"""
DAS — Import tarifs vers Supabase (version corrigée)
Exécuter : python import_supabase.py
"""

import pandas as pd
import requests
import json
import math
import time

# ── Configuration ─────────────────────────────────────────────────────────────
SUPABASE_URL = "https://vfgjihkshhmnwjwbnrfz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZ2ppaGtzaGhtbndqd2JucmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTY2NzAsImV4cCI6MjA4OTc3MjY3MH0.5Fttwav2CqiVG8jOFeUuTYyPsFZiewr9uujCb4pXVVM"
CSV_FILE     = "tarifs_supabase_import.csv"
BATCH_SIZE   = 200

# Upsert : si le code_sh existe déjà, on met à jour au lieu d'échouer
HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "resolution=merge-duplicates,return=minimal"
}

# ── Chargement ────────────────────────────────────────────────────────────────
print(f"Chargement de {CSV_FILE}...")
df = pd.read_csv(CSV_FILE, dtype={
    'code_sh': str, 'chapitre': str, 'position': str,
    'sous_position': str, 'subdivision': str, 'code_complet': str
})
df = df.where(pd.notna(df), None)
df['est_hierarchique'] = df['est_hierarchique'].apply(
    lambda x: True if str(x).lower() == 'true' else False)
df['est_feuille'] = df['est_feuille'].apply(
    lambda x: True if str(x).lower() == 'true' else False)

total   = len(df)
batches = math.ceil(total / BATCH_SIZE)
print(f"✓ {total} lignes — {batches} lots de {BATCH_SIZE}\n")

# ── Import ────────────────────────────────────────────────────────────────────
inserted = 0
errors   = []

for i in range(batches):
    start   = i * BATCH_SIZE
    end     = min(start + BATCH_SIZE, total)
    records = df.iloc[start:end].to_dict(orient='records')

    # Nettoyer NaN
    clean = [
        {k: (None if (v is None or (isinstance(v, float) and math.isnan(v))) else v)
         for k, v in r.items()}
        for r in records
    ]

    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/tarifs",
        headers=HEADERS,
        data=json.dumps(clean)
    )

    if resp.status_code in (200, 201):
        inserted += len(clean)
        pct = round(inserted / total * 100, 1)
        print(f"  Lot {i+1:3d}/{batches} — {inserted:5d}/{total} lignes ({pct}%)", end='\r')
    else:
        errors.append((i+1, resp.status_code, resp.text[:150]))
        print(f"\n  ✗ Lot {i+1} — erreur {resp.status_code}: {resp.text[:150]}")

    time.sleep(0.05)

# ── Résultat ──────────────────────────────────────────────────────────────────
print(f"\n\n{'='*50}")
if not errors:
    print(f"✓ Import complet — {inserted}/{total} lignes insérées")
else:
    print(f"✓ Import terminé — {inserted}/{total} lignes OK, {len(errors)} erreurs")
    for lot, code, msg in errors:
        print(f"  Lot {lot} [{code}]: {msg}")

# ── Vérification ──────────────────────────────────────────────────────────────
resp = requests.get(
    f"{SUPABASE_URL}/rest/v1/tarifs?select=count",
    headers={**HEADERS, "Prefer": "count=exact"}
)
print(f"\nLignes en base : {resp.headers.get('content-range', '?')}")
print("Terminé ✓")
