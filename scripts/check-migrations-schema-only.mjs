#!/usr/bin/env node
// Bloquea migraciones nuevas que mezclan DDL (schema) con DML (datos reales).
//
// Por qué: una migración se prueba primero contra el sandbox y luego se aplica a producción
// (ver verify-rls skill, sección 2). Si una migración mezcla ALTER/CREATE con INSERT/UPDATE/
// DELETE/TRUNCATE que dependen de IDs o filas reales, probarla en sandbox no garantiza nada —
// el sandbox tiene datos distintos a producción, así que el mismo archivo puede comportarse
// diferente (o no tener efecto, o borrar/pisar filas reales) al aplicarse a prod. Ya pasó:
// varias migraciones históricas (antes de esta regla, 2026-07-20) mezclan ambas cosas — no se
// re-revisan (solo se revisan archivos NUEVOS respecto a un ref base, ver modos abajo).
//
// Regla desde 2026-07-20: las migraciones nuevas son solo schema (DDL). Un fix de datos de
// una sola vez se corre como script aparte, fuera de supabase/migrations/, explícito y
// confirmado por Marco — nunca agregado a una migración versionada que se puede replayar.
//
// DML dentro de un cuerpo de función/trigger ($$...$$, ej. un trigger de updated_at o un
// audit log) NO cuenta como violación — es comportamiento programado que corre fila-por-fila
// cuando el trigger dispara más adelante, no una mutación inmediata de datos reales al aplicar
// la migración. Se excluye explícitamente antes de escanear.
//
// Escape hatch: si una migración realmente necesita DML top-level (caso raro, revisado a
// propósito), agregar una línea `-- ALLOW-DML: <razón>` en cualquier parte del archivo. El
// check pasa pero imprime la razón para que quede visible en el log de commit/CI.
//
// Modos:
//   --staged              (default, usado por .husky/pre-commit) — archivos en el stage de git.
//   --diff-against <ref>  (usado por CI) — archivos nuevos/modificados entre <ref> y HEAD.
//                          Si <ref> no es válido (ej. primer push, before=0000...), no bloquea:
//                          imprime un warning y pasa limpio, en vez de fallar CI espuriamente.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const MIGRATIONS_DIR = 'supabase/migrations';
const DML_PATTERN = /\b(INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|TRUNCATE|MERGE\s+INTO|COPY\s+\w+\s+FROM)/i;
const ALLOW_PATTERN = /--\s*ALLOW-DML:\s*(.+)/i;
const TRIGGER_EVENT_PATTERN = /\b(BEFORE|AFTER|INSTEAD\s+OF)\s+((?:INSERT|UPDATE|DELETE|TRUNCATE)(?:\s+OR\s+(?:INSERT|UPDATE|DELETE|TRUNCATE))*)\s+ON\b/gi;
// CREATE POLICY ... FOR {ALL|SELECT|INSERT|UPDATE|DELETE} [TO <role>] — el nombre del comando
// que cubre la policy, no un statement DML.
const POLICY_COMMAND_PATTERN = /\bFOR\s+(ALL|SELECT|INSERT|UPDATE|DELETE)\b/gi;

function stripSqlComments(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => {
      const idx = line.indexOf('--');
      return idx === -1 ? line : line.slice(0, idx);
    })
    .join('\n');
}

// Quita cuerpos de función/trigger delimitados por dollar-quoting ($$...$$ o $tag$...$tag$) —
// el DML ahí adentro es comportamiento programado, no una mutación inmediata.
function stripDollarQuotedBodies(sql) {
  return sql.replace(/\$([A-Za-z_]*)\$[\s\S]*?\$\1\$/g, '');
}

// Quita cláusulas de evento de trigger ("before update on", "after insert or update on") —
// no son statements DML, son parte de la sintaxis de CREATE TRIGGER.
function stripTriggerEventClauses(sql) {
  return sql.replace(TRIGGER_EVENT_PATTERN, '');
}

// Quita el nombre del comando cubierto por una policy ("for update", "for insert to authenticated")
// — no son statements DML, son parte de la sintaxis de CREATE POLICY.
function stripPolicyCommands(sql) {
  return sql.replace(POLICY_COMMAND_PATTERN, '');
}

function isRealDml(fileContent) {
  const noComments = stripSqlComments(fileContent);
  const noFunctionBodies = stripDollarQuotedBodies(noComments);
  const noTriggerEvents = stripTriggerEventClauses(noFunctionBodies);
  const noPolicyCommands = stripPolicyCommands(noTriggerEvents);
  return DML_PATTERN.test(noPolicyCommands);
}

function getStagedMigrationFiles() {
  const out = execSync(
    `git diff --cached --name-only --diff-filter=ACM -- ${MIGRATIONS_DIR}/*.sql`,
    { encoding: 'utf8' }
  );
  return out.split('\n').filter(Boolean);
}

function getDiffMigrationFiles(baseRef) {
  if (!baseRef || /^0+$/.test(baseRef)) {
    console.warn(`[migrations-schema-only] ref base inválido ("${baseRef}") — probablemente el primer push de la rama. Se omite el check, no se puede diffear contra nada.`);
    return null;
  }
  try {
    const out = execSync(
      `git diff --name-only --diff-filter=ACM ${baseRef} HEAD -- ${MIGRATIONS_DIR}/*.sql`,
      { encoding: 'utf8' }
    );
    return out.split('\n').filter(Boolean);
  } catch (err) {
    console.warn(`[migrations-schema-only] no se pudo diffear contra "${baseRef}" (${err.message.split('\n')[0]}) — se omite el check en vez de fallar CI espuriamente.`);
    return null;
  }
}

function main() {
  const diffIdx = process.argv.indexOf('--diff-against');
  const files = diffIdx !== -1
    ? getDiffMigrationFiles(process.argv[diffIdx + 1])
    : getStagedMigrationFiles();

  if (files === null || files.length === 0) {
    process.exit(0);
  }

  let failed = false;

  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const allowMatch = raw.match(ALLOW_PATTERN);

    if (isRealDml(raw)) {
      if (allowMatch) {
        console.warn(`[migrations-schema-only] ${file}: DML permitido explícitamente — ALLOW-DML: ${allowMatch[1].trim()}`);
        continue;
      }
      failed = true;
      console.error(`[migrations-schema-only] BLOQUEADO: ${file} contiene DML top-level (INSERT/UPDATE/DELETE/TRUNCATE/MERGE/COPY) fuera de un cuerpo de función/trigger.`);
      console.error('  Las migraciones nuevas deben ser solo schema (DDL) — un fix de datos de una sola vez va como script aparte, no en supabase/migrations/.');
      console.error('  Si de verdad hace falta DML en esta migración (caso revisado a propósito), agrega una línea: -- ALLOW-DML: <razón>');
    }
  }

  if (failed) {
    process.exit(1);
  }
}

main();
