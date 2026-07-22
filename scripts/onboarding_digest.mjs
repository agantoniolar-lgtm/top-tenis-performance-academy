#!/usr/bin/env node
// Digest semanal de onboarding pendiente para coaches (T161 Parte 2).
//
// Junta los mismos gaps que ya se muestran en /portal/equipo y /portal/alumnos/:id (perfil,
// PTF post-torneo, baseline físico, papás/tutor, reclutamiento — ver `onboardingGaps()` en
// src/lib/athletics.js) y arma UN solo digest de equipo (no personalizado por coach — no hay
// ownership real de atletas desde T140), enviado por email a todos los coaches vía Resend.
//
// Reglas de cuándo aparece un gap en el digest (más estrictas que los flags en-app, que son
// inmediatos): perfil físico sin gracia; PTF con PTF_GRACE_DAYS desde la fecha del torneo;
// baseline físico / papás-tutor / reclutamiento con ONBOARDING_GRACE_DAYS desde fecha_ingreso.
// Ver `filterGapsForDigest()` en athletics.js para el detalle.
//
// Uso:
//   node scripts/onboarding_digest.mjs --dry-run   # imprime el digest sin enviar nada
//   node scripts/onboarding_digest.mjs             # arma y envía el digest real a todos los coaches
//
// Variables de entorno necesarias:
//   SUPABASE_URL          → URL del proyecto de Top Tennis (no el de AMTP)
//   SUPABASE_SERVICE_KEY  → Service role key (Supabase > Settings > API) — bypassa RLS a propósito,
//                           este job necesita ver todos los atletas/coaches sin importar quién abrió cada reporte.
//   RESEND_API_KEY        → API key de Resend
//   RESEND_FROM           → remitente del digest (opcional, default 'onboarding@resend.dev' — el
//                           sandbox de Resend, sirve para probar sin dominio verificado)
//   DIGEST_TEST_TO        → (opcional) si está seteada, el digest se manda SOLO a esta dirección
//                           en vez de a todos los coaches — para probar el envío real sin
//                           mandarle un email de verdad a todo el equipo.

import { createClient } from '@supabase/supabase-js';
import {
  calcCat, onboardingGaps, filterGapsForDigest, hasPendingPTF, PTF_GRACE_DAYS,
} from '../src/lib/athletics.js';

const DRY_RUN = process.argv.includes('--dry-run');

function requireEnv(name) {
  const v = process.env[name];
  if (!v) { console.error(`Falta la variable de entorno ${name}`); process.exit(1); }
  return v;
}

const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = requireEnv('SUPABASE_SERVICE_KEY');
const RESEND_API_KEY = DRY_RUN ? (process.env.RESEND_API_KEY ?? null) : requireEnv('RESEND_API_KEY');
// || y no ?? a propósito: en CI, un secret sin configurar llega como '' (string vacío), no
// undefined — ?? no lo reemplazaría por el default.
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const today = new Date().toISOString().slice(0, 10);

async function loadTeamGaps() {
  const { data: athletes, error: eAth } = await supabase
    .from('athletes')
    .select('id, nombre, apellido, fecha_nacimiento, fecha_ingreso, altura_cm, peso_kg, escuela, nombre_padre, telefono_padre, email_padre')
    .eq('activo', true);
  if (eAth) throw eAth;
  if (athletes.length === 0) return [];

  const athIds = athletes.map(a => a.id);

  const [{ data: recruitmentRows }, { data: tournRows }, { data: reportRows }] = await Promise.all([
    supabase.from('athlete_recruitment_profile')
      .select('athlete_id, division_objetivo, grad_year, english_level').in('athlete_id', athIds),
    supabase.from('athlete_tournaments')
      .select('athlete_id, tournaments(fecha), post_tournament_forms(id)').in('athlete_id', athIds),
    supabase.from('reports').select('id, athlete_id').in('athlete_id', athIds),
  ]);

  const recruitmentByAth = Object.fromEntries((recruitmentRows ?? []).map(r => [r.athlete_id, r]));

  const tournByAth = {};
  for (const t of (tournRows ?? [])) {
    (tournByAth[t.athlete_id] ??= []).push({
      fecha: t.tournaments?.fecha ?? null,
      hasForm: (t.post_tournament_forms?.length ?? 0) > 0,
    });
  }

  const allRepIds = (reportRows ?? []).map(r => r.id);
  const athIdByRepId = Object.fromEntries((reportRows ?? []).map(r => [r.id, r.athlete_id]));
  const { data: physRows } = allRepIds.length > 0
    ? await supabase.from('report_physical').select('report_id').in('report_id', allRepIds).not('completed_at', 'is', null)
    : { data: [] };
  const physicalBaselineSet = new Set((physRows ?? []).map(r => athIdByRepId[r.report_id]).filter(Boolean));

  return athletes
    .map(a => {
      const rawGaps = onboardingGaps({
        athlete: a,
        recruitment: recruitmentByAth[a.id],
        pendingPTF: hasPendingPTF(tournByAth[a.id], today, PTF_GRACE_DAYS),
        hasPhysicalBaseline: physicalBaselineSet.has(a.id),
      });
      const gaps = filterGapsForDigest(rawGaps, a.fecha_ingreso, today);
      return { athlete: a, gaps };
    })
    .filter(({ gaps }) => gaps.length > 0);
}

async function loadCoachEmails() {
  const { data: coaches, error } = await supabase.from('coaches').select('id, nombre, apellido, user_id');
  if (error) throw error;

  const { data: usersPage, error: eUsers } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (eUsers) throw eUsers;
  const emailByUserId = Object.fromEntries(usersPage.users.map(u => [u.id, u.email]));

  return coaches
    .map(c => ({ ...c, email: emailByUserId[c.user_id] ?? null }))
    .filter(c => c.email);
}

function renderDigestHtml(teamGaps) {
  if (teamGaps.length === 0) {
    return '<p>Sin onboarding pendiente esta semana — todo el equipo está al día.</p>';
  }
  const rows = teamGaps.map(({ athlete: a, gaps }) => `
    <tr>
      <td style="padding:6px 12px;border-bottom:1px solid #eee;"><b>${a.nombre} ${a.apellido}</b> · ${calcCat(a.fecha_nacimiento)}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #eee;">${gaps.map(g => g.label).join(', ')}</td>
    </tr>`).join('');
  return `
    <p>Onboarding pendiente del equipo esta semana:</p>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:13px;">
      <thead><tr><th style="text-align:left;padding:6px 12px;">Atleta</th><th style="text-align:left;padding:6px 12px;">Pendiente</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="color:#666;font-size:12px;">Revisa el detalle completo en /portal/equipo y /portal/alumnos.</p>`;
}

async function sendDigest(toEmail, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: toEmail,
      subject: 'Top Tennis — onboarding pendiente esta semana',
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function main() {
  const teamGaps = await loadTeamGaps();
  const html = renderDigestHtml(teamGaps);

  console.log(`Onboarding pendiente: ${teamGaps.length} atleta(s) con al menos un gap fuera de gracia.`);
  for (const { athlete: a, gaps } of teamGaps) {
    console.log(`  - ${a.nombre} ${a.apellido}: ${gaps.map(g => g.label).join(', ')}`);
  }

  if (DRY_RUN) {
    console.log('\n--dry-run: no se envía ningún email. HTML generado:\n');
    console.log(html);
    return;
  }

  const testTo = process.env.DIGEST_TEST_TO;
  if (testTo) {
    await sendDigest(testTo, html);
    console.log(`Enviado (modo prueba, DIGEST_TEST_TO) a ${testTo}`);
    return;
  }

  const coaches = await loadCoachEmails();
  if (coaches.length === 0) {
    console.log('Sin coaches con email resuelto — nada que enviar.');
    return;
  }
  for (const c of coaches) {
    await sendDigest(c.email, html);
    console.log(`Enviado a ${c.nombre} ${c.apellido} <${c.email}>`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
