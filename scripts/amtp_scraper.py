"""
amtp_scraper.py
Scraper de rankings para amtp.mx (Asociación Mexicana de Tenistas Profesionales).

Estrategia:
  1. Extrae el anon key de Supabase del JS bundle del sitio (en runtime, sin hardcodear).
  2. Llama la API de Supabase directamente → ranking completo (no solo top 10).
  3. Fallback: Playwright DOM scraping (solo top 10 por género).

Output: dict con listas 'varonil' y 'femenil', cada una con {posicion, nombre, puntos}.

Uso:
  # Solo imprimir rankings:
  python scripts/amtp_scraper.py

  # Buscar jugador específico:
  python scripts/amtp_scraper.py "Nombre Apellido"

  # Scrape + guardar en Supabase (requiere SUPABASE_URL y SUPABASE_SERVICE_KEY en env):
  python scripts/amtp_scraper.py --upsert

Dependencias:
  pip install requests beautifulsoup4 python-dotenv
  pip install playwright && playwright install chromium  # solo para fallback DOM

Variables de entorno necesarias para --upsert:
  SUPABASE_URL          → URL del proyecto de Top Tennis (no el de AMTP)
  SUPABASE_SERVICE_KEY  → Service role key (en Supabase > Settings > API)
"""

import re
import json
import os
import sys
import logging
from datetime import datetime, timezone
from typing import Optional

import requests
from bs4 import BeautifulSoup

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ── Configuración ─────────────────────────────────────────────────────────────

AMTP_BASE_URL = "https://amtp.mx"
SUPABASE_URL  = "https://supabase-amtp.servers.ssmusic.group"
RANKINGS_ENDPOINT = f"{SUPABASE_URL}/rest/v1/rankings"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "*/*",
}

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger(__name__)


# ── 1. Extracción del anon key ─────────────────────────────────────────────────

def get_anon_key() -> Optional[str]:
    """
    Extrae el Supabase anon key del JS bundle del sitio amtp.mx.
    El key es un JWT (empieza con 'eyJ') embebido en el chunk de config de Supabase.
    """
    log.info("Buscando anon key en el JS bundle de amtp.mx...")

    # 1a. Obtener HTML de la home page
    resp = requests.get(AMTP_BASE_URL, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    # 1b. Encontrar URLs de chunks JS de Next.js
    script_urls = [
        s["src"] for s in soup.find_all("script", src=True)
        if "_next/static/chunks" in s.get("src", "")
    ]
    log.info(f"Encontrados {len(script_urls)} chunks JS.")

    # 1c. Buscar en cada chunk hasta encontrar el que tiene la config de Supabase
    for path in script_urls:
        url = path if path.startswith("http") else f"{AMTP_BASE_URL}{path}"
        try:
            chunk = requests.get(url, headers=HEADERS, timeout=10).text
        except Exception:
            continue

        if "ssmusic.group" not in chunk:
            continue

        # El patrón en el bundle minificado es: createClient("https://...", "eyJ...")
        # Buscamos el JWT que viene después de la URL de Supabase.
        match = re.search(
            r'ssmusic\.group[^"\']*["\'][\s,)]*["\']?(eyJ[a-zA-Z0-9_\-\.]{50,})',
            chunk,
        )
        if match:
            key = match.group(1)
            log.info(f"Anon key extraído del chunk {path.split('/')[-1]} (len={len(key)}).")
            return key

        # Patrón alternativo: "url","key" como argumentos consecutivos
        match2 = re.search(
            r'"https://supabase-amtp[^"]+","(eyJ[a-zA-Z0-9_\-\.]{50,})"',
            chunk,
        )
        if match2:
            key = match2.group(1)
            log.info(f"Anon key extraído (patrón 2) del chunk {path.split('/')[-1]} (len={len(key)}).")
            return key

    log.warning("No se pudo extraer el anon key del JS bundle.")
    return None


# ── 2. Fetch rankings vía API de Supabase ────────────────────────────────────

def fetch_rankings_api(anon_key: str) -> list:
    """
    Llama la REST API de Supabase y devuelve el ranking completo (todos los jugadores).
    """
    log.info("Haciendo fetch del ranking completo vía Supabase REST API...")
    headers = {
        **HEADERS,
        "apikey": anon_key,
        "Authorization": f"Bearer {anon_key}",
        "Content-Type": "application/json",
    }
    params = {"select": "*", "order": "points.desc"}
    resp = requests.get(RANKINGS_ENDPOINT, headers=headers, params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    log.info(f"API devolvió {len(data)} registros.")
    if data:
        log.info(f"Campos disponibles: {list(data[0].keys())}")
    return data


# ── 3. Fallback: DOM scraping con Playwright ──────────────────────────────────

def fetch_rankings_dom() -> dict:
    """
    Fallback: renderiza la página con Playwright y extrae el top-10 por género del DOM.
    Solo retorna lo visible en la home (top 10 femenil + top 10 varonil).
    """
    try:
        from playwright.sync_api import sync_playwright  # noqa
    except ImportError:
        raise RuntimeError(
            "Playwright no está instalado. Corre: pip install playwright && playwright install chromium"
        )

    log.info("Fallback: scraping DOM con Playwright (solo top 10 por género)...")

    def extract_ranking_rows(page) -> list:
        rows = page.query_selector_all("section table tr, section [role='row']")
        result = []
        for i, row in enumerate(rows[1:], start=1):  # saltar header
            cells = row.query_selector_all("td, [role='cell']")
            if len(cells) >= 3:
                result.append({
                    "posicion": i,
                    "nombre": cells[1].inner_text().strip() if len(cells) > 1 else "",
                    "puntos": _parse_float(cells[2].inner_text().strip()) if len(cells) > 2 else 0,
                })
        return result

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(AMTP_BASE_URL, wait_until="networkidle")

        # Femenil (tab activo por defecto)
        page.wait_for_selector("table, [role='table']", timeout=10000)
        femenil = extract_ranking_rows(page)

        # Varonil (click en el segundo tab)
        varonil_tab = page.query_selector("button[role='tab']:nth-child(2), [data-value='varonil']")
        if varonil_tab:
            varonil_tab.click()
            page.wait_for_timeout(1500)
            varonil = extract_ranking_rows(page)
        else:
            varonil = []

        browser.close()

    return {"femenil": femenil, "varonil": varonil}


# ── 4. Procesamiento del response de Supabase ─────────────────────────────────

def _parse_float(value: str) -> float:
    try:
        return float(value.replace(",", "").strip())
    except (ValueError, AttributeError):
        return 0.0


def process_api_response(raw: list) -> dict:
    """
    Convierte la respuesta raw de Supabase en el formato normalizado:
      { 'femenil': [{posicion, nombre, puntos}, ...],
        'varonil': [{posicion, nombre, puntos}, ...] }

    Los nombres de campo se detectan automáticamente para ser resiliente
    a cambios en el schema de AMTP.
    """
    if not raw:
        return {"femenil": [], "varonil": []}

    sample = raw[0]
    log.info(f"Campos del schema AMTP: {list(sample.keys())}")

    # Detectar nombre de campo para cada columna
    name_field    = _detect_field(sample, ["name", "nombre", "player_name", "jugador"])
    points_field  = _detect_field(sample, ["points", "puntos", "pts"])
    pos_field     = _detect_field(sample, ["position", "posicion", "rank", "ranking"])
    gender_field  = _detect_field(sample, ["gender", "genero", "category", "categoria", "sexo"])

    femenil, varonil = [], []

    for i, row in enumerate(raw):
        nombre  = str(row.get(name_field, "")).strip()
        puntos  = _parse_float(str(row.get(points_field, 0)))
        posicion = row.get(pos_field, i + 1)
        genero  = str(row.get(gender_field, "")).lower()

        entry = {"posicion": posicion, "nombre": nombre, "puntos": puntos}

        if any(k in genero for k in ["f", "fem", "mujer", "woman"]):
            femenil.append(entry)
        elif any(k in genero for k in ["m", "var", "hombre", "man"]):
            varonil.append(entry)
        else:
            # Si no hay campo de género, intentar inferir por puntos
            # (por ahora lo dejamos sin clasificar)
            log.warning(f"Género no reconocido para '{nombre}': '{genero}'")

    return {
        "femenil": sorted(femenil, key=lambda x: x["puntos"], reverse=True),
        "varonil": sorted(varonil, key=lambda x: x["puntos"], reverse=True),
    }


def _detect_field(sample: dict, candidates: list) -> Optional[str]:
    """Devuelve el primer campo del sample que coincida con algún candidato."""
    keys_lower = {k.lower(): k for k in sample.keys()}
    for c in candidates:
        if c.lower() in keys_lower:
            return keys_lower[c.lower()]
    # Si no hay match, devuelve el primer campo que contenga algún candidato
    for c in candidates:
        for k in sample.keys():
            if c.lower() in k.lower():
                return k
    return None


# ── 5. Función principal ──────────────────────────────────────────────────────

def scrape_amtp_rankings() -> dict:
    """
    Entry point del scraper. Devuelve:
      {
        "femenil": [{"posicion": int, "nombre": str, "puntos": float}, ...],
        "varonil": [{"posicion": int, "nombre": str, "puntos": float}, ...],
        "source": "api" | "dom",
        "total": int,
      }
    """
    # Intento 1: API de Supabase (ranking completo)
    anon_key = get_anon_key()
    if anon_key:
        try:
            raw = fetch_rankings_api(anon_key)
            if raw:
                rankings = process_api_response(raw)
                total = len(rankings["femenil"]) + len(rankings["varonil"])
                log.info(f"✓ Rankings obtenidos vía API: {total} jugadores total.")
                return {**rankings, "source": "api", "total": total}
        except Exception as e:
            log.warning(f"API falló ({e}). Intentando fallback DOM...")

    # Intento 2: DOM scraping con Playwright (top 10 por género)
    rankings = fetch_rankings_dom()
    total = len(rankings["femenil"]) + len(rankings["varonil"])
    log.info(f"✓ Rankings obtenidos vía DOM (top 10): {total} jugadores total.")
    return {**rankings, "source": "dom", "total": total}


def lookup_player(rankings: dict, nombre: str, apellido: str = "") -> Optional[dict]:
    """
    Busca un jugador por nombre+apellido en el ranking scrapeado.
    Si se pasa apellido, usa el matching preciso (primer nombre + primer apellido).
    Si solo se pasa nombre completo como string único, hace búsqueda flexible.

    Retorna: {"posicion": int, "puntos": float, "genero": str} o None si no aparece.
    """
    for genero, lista in [("varonil", rankings["varonil"]), ("femenil", rankings["femenil"])]:
        for entry in lista:
            if apellido:
                if _nombres_match(nombre, apellido, entry["nombre"]):
                    return {**entry, "genero": genero}
            else:
                # Fallback: búsqueda flexible por string completo (solo para uso manual)
                n1 = _norm(nombre)
                n2 = _norm(entry["nombre"])
                if n1 in n2 or n2 in n1:
                    return {**entry, "genero": genero}
    return None


# ── 6. Fetch atletas de la plataforma ────────────────────────────────────────

def fetch_platform_athletes(supabase_url: str, service_key: str) -> list[dict]:
    """
    Devuelve lista de dicts {id, nombre, apellido} de atletas activos en la plataforma.
    Se mantienen separados para el matching preciso: ambos deben aparecer en el nombre AMTP.
    """
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
    }
    resp = requests.get(
        f"{supabase_url}/rest/v1/athletes",
        headers=headers,
        params={"select": "id,nombre,apellido,segundo_apellido", "activo": "eq.true"},
        timeout=10,
    )
    resp.raise_for_status()
    athletes = resp.json()
    nombres = ', '.join(f"{a['nombre']} {a['apellido']}" for a in athletes)
    log.info(f"Atletas en plataforma: {len(athletes)} → {nombres}")
    return athletes  # lista de {id, nombre, apellido, segundo_apellido}


def _norm(s: str) -> str:
    """Normaliza string: minúsculas, sin acentos, sin espacios extras."""
    import unicodedata
    s = " ".join(s.lower().split())  # colapsa espacios extras
    return "".join(
        c for c in unicodedata.normalize("NFD", s)
        if unicodedata.category(c) != "Mn"
    )


def _nombres_match(nombre: str, apellido: str, ranking_name: str, segundo_apellido: str = "") -> bool:
    """
    Coincidencia precisa: el primer token del nombre Y el primer token del apellido
    deben aparecer como palabras completas en el nombre del ranking AMTP.

    Si se conoce el segundo apellido, también se requiere que su primer token aparezca
    en el ranking — esto reduce colisiones cuando hay dos atletas con nombre+apellido parecido.

    Ejemplos que pasan:
      nombre="Emiliano"  apellido="Flores"  seg="Rivera"  → "Emiliano Flores Rivera" ✓
      nombre="Ian"       apellido="Kleiman" seg="Plaza"   → "Ian Kleiman Plaza" ✓
    Ejemplos que fallan (correcto):
      nombre="Carlos"    apellido="Sánchez" seg=""        → "Carlos Zerega López" ✗
      nombre="Emiliano"  apellido="Flores"  seg="Rivera"  → "Emiliano Flores Martínez" ✗ (seg no coincide)
    """
    ranking_words = set(_norm(ranking_name).split())
    first_nombre   = _norm(nombre).split()[0]
    first_apellido = _norm(apellido).split()[0]
    if not (first_nombre in ranking_words and first_apellido in ranking_words):
        return False
    # Si tenemos segundo apellido, exigirlo también
    if segundo_apellido and segundo_apellido.strip():
        first_segundo = _norm(segundo_apellido).split()[0]
        return first_segundo in ranking_words
    return True


# ── 7. Upsert a Supabase ─────────────────────────────────────────────────────

def upsert_to_supabase(rankings: dict, periodo: Optional[str] = None) -> None:
    """
    Guarda el snapshot de rankings en Supabase, filtrando solo los atletas
    registrados en la plataforma. Usa upsert por (nombre, genero, periodo)
    para mantener historial sin borrar períodos anteriores.

    Args:
        rankings: resultado de scrape_amtp_rankings()
        periodo:  string YYYY-MM del mes del ranking (default: mes actual)

    Requiere SUPABASE_URL y SUPABASE_SERVICE_KEY en el entorno.
    """
    supabase_url = os.environ.get("SUPABASE_URL")
    service_key  = os.environ.get("SUPABASE_SERVICE_KEY")

    if not supabase_url or not service_key:
        raise EnvironmentError(
            "Faltan variables de entorno: SUPABASE_URL y/o SUPABASE_SERVICE_KEY"
        )

    if periodo is None:
        periodo = datetime.now(timezone.utc).strftime("%Y-%m")

    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    base = f"{supabase_url}/rest/v1"

    # Obtener atletas de la plataforma para filtrar
    atletas_plataforma = fetch_platform_athletes(supabase_url, service_key)

    # Construir payload — solo atletas registrados en la plataforma
    scraped_at = datetime.now(timezone.utc).isoformat()
    rows = []
    skipped = 0
    for genero in ("varonil", "femenil"):
        for entry in rankings.get(genero, []):
            nombre_ranking = entry["nombre"]
            # Buscar coincidencia con atleta de la plataforma
            # Exige que primer nombre Y primer apellido aparezcan en el nombre del ranking
            matched = next(
                (a for a in atletas_plataforma
                 if _nombres_match(a["nombre"], a["apellido"], nombre_ranking,
                                   a.get("segundo_apellido") or "")),
                None,
            )
            if not matched:
                skipped += 1
                continue
            rows.append({
                "nombre":     nombre_ranking,
                "puntos":     entry["puntos"],
                "posicion":   entry["posicion"],
                "genero":     genero,
                "fuente":     rankings.get("source", "api"),
                "scraped_at": scraped_at,
                "periodo":    periodo,
                "athlete_id": matched["id"],
            })

    log.info(f"Atletas en ranking total: {rankings.get('total', 0)} | "
             f"Coincidencias plataforma: {len(rows)} | Ignorados: {skipped}")

    if not rows:
        log.warning("Ningún atleta de la plataforma apareció en el ranking AMTP.")
        return

    # Upsert (merge-duplicates por unique constraint nombre+genero+periodo).
    # on_conflict es obligatorio: sin él, PostgREST no sabe contra qué constraint resolver
    # el upsert (usa la PK por default, que nunca choca porque "id" no viene en el payload)
    # y termina haciendo un INSERT plano que revienta contra la unique constraint real en
    # cuanto ya existe una fila para ese (nombre, genero, periodo) — exactamente lo que pasaba
    # en cualquier corrida que no fuera la primera del mes (bug real, no el duplicado de un
    # atleta — encontrado y confirmado 22 Jul 2026 revisando el fallo de AMTP Rankings Scraper).
    resp = requests.post(
        f"{base}/amtp_rankings?on_conflict=nombre,genero,periodo",
        headers=headers, json=rows,
    )
    resp.raise_for_status()
    log.info(f"✓ Upsert completo: {len(rows)} registros para período {periodo}.")


# ── CLI ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    args = sys.argv[1:]
    do_upsert = "--upsert" in args

    # --periodo YYYY-MM (default: mes actual)
    periodo: Optional[str] = None
    if "--periodo" in args:
        idx = args.index("--periodo")
        if idx + 1 < len(args):
            periodo = args[idx + 1]

    nombre_args   = [a for a in args if not a.startswith("--")]
    nombre_buscar = nombre_args[0] if nombre_args else None

    data = scrape_amtp_rankings()

    if nombre_buscar:
        result = lookup_player(data, nombre_buscar)
        if result:
            print(f"\n✓ {nombre_buscar} → #{result['posicion']} {result['genero']} — {result['puntos']} pts")
        else:
            print(f"\n✗ '{nombre_buscar}' no aparece en el ranking AMTP.")
    else:
        print(f"\nFuente: {data['source']} | Total jugadores: {data['total']}")
        print(f"\n── Varonil (top 10) ──")
        for r in data["varonil"][:10]:
            print(f"  #{r['posicion']:>3}  {r['nombre']:<40}  {r['puntos']} pts")
        print(f"\n── Femenil (top 10) ──")
        for r in data["femenil"][:10]:
            print(f"  #{r['posicion']:>3}  {r['nombre']:<40}  {r['puntos']} pts")

    if do_upsert:
        # Uso: python amtp_scraper.py --upsert [--periodo 2026-06]
        upsert_to_supabase(data, periodo=periodo)
