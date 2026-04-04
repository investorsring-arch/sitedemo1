"""
DAS — Import tarifs vers Supabase
Exécuter : python import_supabase.py
"""

import pandas as pd
import requests
import json
import time
import math

# ── Configuration ─────────────────────────────────────────────────────────────
SUPABASE_URL = "https://vfgjihkshhmnwjwbnrfz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZ2ppaGtzaGhtbndqd2JucmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTY2NzAsImV4cCI6MjA4OTc3MjY3MH0.5Fttwav2CqiVG8jOFeUuTYyPsFZiewr9uujCb4pXVVM"
CSV_FILE    = "tarifs_supabase_import.csv"
BATCH_SIZE  = 200   # lignes par requête

HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal"
}

# ── Chargement du CSV ─────────────────────────────────────────────────────────
print(f"Chargement de {CSV_FILE}...")
df = pd.read_csv(CSV_FILE, dtype={
    'code_sh': str, 'chapitre': str, 'position': str,
    'sous_position': str, 'subdivision': str, 'code_complet': str
})
print(f"✓ {len(df)} lignes chargées")

# ── Nettoyage NaN → None ──────────────────────────────────────────────────────
df = df.where(pd.notna(df), None)

# Convertir booleans
df['est_hierarchique'] = df['est_hierarchique'].apply(
    lambda x: True if str(x).lower() == 'true' else False
)
df['est_feuille'] = df['est_feuille'].apply(
    lambda x: True if str(x).lower() == 'true' else False
)

# ── Import par lots ───────────────────────────────────────────────────────────
total    = len(df)
batches  = math.ceil(total / BATCH_SIZE)
inserted = 0
errors   = 0

print(f"\nImport en {batches} lots de {BATCH_SIZE} lignes...")
print(f"URL: {SUPABASE_URL}/rest/v1/tarifs\n")

for i in range(batches):
    start = i * BATCH_SIZE
    end   = min(start + BATCH_SIZE, total)
    batch = df.iloc[start:end]

    # Convertir en liste de dicts
    records = batch.to_dict(orient='records')

    # Nettoyer les valeurs None et float NaN
    clean = []
    for r in records:
        clean_r = {}
        for k, v in r.items():
            if v is None or (isinstance(v, float) and math.isnan(v)):
                clean_r[k] = None
            else:
                clean_r[k] = v
        clean.append(clean_r)

    # Envoyer à Supabase
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/tarifs",
        headers=HEADERS,
        data=json.dumps(clean)
    )

    if resp.status_code in (200, 201):
        inserted += len(clean)
        pct = round(inserted / total * 100, 1)
        print(f"  Lot {i+1:3d}/{batches} — {inserted}/{total} lignes ({pct}%)", end='\r')
    else:
        errors += 1
        print(f"\n  ✗ Lot {i+1} erreur {resp.status_code}: {resp.text[:200]}")
        if errors > 5:
            print("Trop d'erreurs — arrêt.")
            break

    # Pause courte pour ne pas surcharger l'API
    time.sleep(0.1)

# ── Résultat ──────────────────────────────────────────────────────────────────
print(f"\n\n{'='*50}")
print(f"✓ Import terminé !")
print(f"  Lignes insérées : {inserted}")
print(f"  Erreurs         : {errors}")
print(f"  Total attendu   : {total}")

# ── Vérification ──────────────────────────────────────────────────────────────
print(f"\nVérification dans Supabase...")
resp = requests.get(
    f"{SUPABASE_URL}/rest/v1/tarifs?select=count",
    headers={**HEADERS, "Prefer": "count=exact"},
)
count_header = resp.headers.get('content-range', 'inconnu')
print(f"  Lignes en base : {count_header}")
print(f"\nTerminé. Allez dans Supabase → Table Editor → tarifs pour vérifier.")
