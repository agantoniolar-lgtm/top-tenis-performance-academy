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


def lookup_player(rankings: dict, nombre: str) -> Optional[dict]:
    """
    Busca un jugador por nombre (búsqueda flexible, sin acentos, case-insensitive).
    Útil para mostrar el ranking de un atleta específico en su perfil.

    Retorna: {"posicion": int, "puntos": float, "genero": str} o None si no aparece.
    """
    import unicodedata

    def normalize(s: str) -> str:
        s = s.lower().strip()
        return "".join(
            c for c in unicodedata.normalize("NFD", s)
            if unicodedata.category(c) != "Mn"
        )

    needle = normalize(nombre)

    for genero, lista in [("varonil", rankings["varonil"]), ("femenil", rankings["femenil"])]:
        for entry in lista:
            if needle in normalize(entry["nombre"]) or normalize(entry["nombre"]) in needle:
                return {**entry, "genero": genero}

    return None


# ── 6. Upsert a Supabase ─────────────────────────────────────────────────────

def upsert_to_supabase(rankings: dict) -> None:
    """
    Borra los rankings anteriores y sube el snapshot nuevo a nuestra tabla amtp_rankings.
    Requiere SUPABASE_URL y SUPABASE_SERVICE_KEY en el entorno.
    """
    supabase_url = os.environ.get("SUPABASE_URL")
    service_key  = os.environ.get("SUPABASE_SERVICE_KEY")

    if not supabase_url or not service_key:
        raise EnvironmentError(
            "Faltan variables de entorno: SUPABASE_URL y/o SUPABASE_SERVICE_KEY"
        )

    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    base = f"{supabase_url}/rest/v1"

    # Borrar rankings anteriores
    log.info("Borrando rankings anteriores en Supabase...")
    resp = requests.delete(
        f"{base}/amtp_rankings",
        headers={**headers, "Prefer": "return=minimal"},
        params={"id": "neq.00000000-0000-0000-0000-000000000000"},  # borrar todos
    )
    resp.raise_for_status()

    # Construir payload
    scraped_at = datetime.now(timezone.utc).isoformat()
    rows = []
    for genero in ("varonil", "femenil"):
        for entry in rankings.get(genero, []):
            rows.append({
                "nombre":     entry["nombre"],
                "puntos":     entry["puntos"],
                "posicion":   entry["posicion"],
                "genero":     genero,
                "fuente":     rankings.get("source", "api"),
                "scraped_at": scraped_at,
            })

    if not rows:
        log.warning("No hay datos para subir.")
        return

    # Insert en lotes de 500
    batch_size = 500
    total_inserted = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        resp = requests.post(f"{base}/amtp_rankings", headers=headers, json=batch)
        resp.raise_for_status()
        total_inserted += len(batch)
        log.info(f"  → {total_inserted}/{len(rows)} registros insertados.")

    log.info(f"✓ Upsert completo: {total_inserted} rankings guardados en Supabase.")


# ── CLI ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    args = sys.argv[1:]
    do_upsert    = "--upsert" in args
    nombre_args  = [a for a in args if not a.startswith("--")]
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
        upsert_to_supabase(data)
