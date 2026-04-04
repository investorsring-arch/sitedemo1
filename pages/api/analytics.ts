// pages/api/analytics.ts
// Endpoint sécurisé — Analyses Stratégiques Douane.ia
// Appelle Claude Sonnet avec web_search côté serveur (clé API jamais exposée au client)

import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SECTORS: Record<string, string> = {
  douane:     'Douane & Commerce international',
  textile:    'Textile & Habillement (chapitres SH 50 à 63)',
  automobile: 'Automobile & Équipements (chapitre SH 87)',
  agro:       'Agroalimentaire & Agriculture',
  industrie:  'Industrie générale',
  logistique: 'Services & Logistique',
};

const PERIMETRES: Record<string, string> = {
  maroc_ue:      "Maroc — Union Européenne (Accord d'Association)",
  maroc_global:  'Maroc — Marché mondial',
  maroc_afrique: 'Maroc — Afrique & Zone de Libre-Échange Continentale Africaine (AfCFTA)',
  maroc_usa:     'Maroc — États-Unis (Accord de Libre-Échange)',
  maroc_turquie: 'Maroc — Turquie',
};

function buildSystemPrompt(secteur: string, perimetre: string): string {
  const sLabel = SECTORS[secteur] || secteur;
  const pLabel = PERIMETRES[perimetre] || perimetre;

  return `Tu incarnes Douane.ia, assistant analytique expert en douanes et commerce international, spécialisé dans le cadre réglementaire marocain.

IDENTITÉ ABSOLUE : Tu es Douane.ia. Ne jamais mentionner Claude, Anthropic ou tout autre modèle IA. Tu es Douane.ia, et uniquement Douane.ia.

SECTEUR ACTIF DE L'ABONNÉ : ${sLabel}
PÉRIMÈTRE GÉOGRAPHIQUE : ${pLabel}

MISSION : Produire des analyses stratégiques factuelles, vérifiables et personnalisées pour des professionnels du commerce international et de la douane.

DOMAINES D'EXPERTISE :
- Procédures & réglementations douanières marocaines (ADII, Code des douanes — Dahir du 9 octobre 1977 et amendements)
- Classification tarifaire (Nomenclature SH, tarif douanier marocain), valeur en douane, règles d'origine
- Commerce international : Incoterms® 2020, crédits documentaires, garanties bancaires, logistique multimodale
- Accords de libre-échange du Maroc : UE (Accord d'Association), USA (ALE), Turquie, pays arabes (GZALE), Agadir, AfCFTA
- TVA à l'importation, droits de douane, TIC, parafiscalité, redevances
- Réglementation des changes (Office des Changes — circulaires et instructions)
- Convention PEM modernisée (en vigueur depuis le 1er janvier 2025, règles transitoires Maroc-UE depuis octobre 2025)
- Régimes douaniers suspensifs : AT, ATPA, MEAD, Entrepôt, ZAI, transit

RÈGLES DE RECHERCHE WEB :
- Utiliser web_search pour obtenir des données factuelles et réglementaires récentes
- Privilégier les sources officielles : douane.gov.ma, eur-lex.europa.eu, wto.org, oc.gov.ma, sgg.gov.ma, trade.ec.europa.eu, portnet.ma
- Citer systématiquement les sources avec URL lorsque disponibles
- Alerter explicitement sur les changements réglementaires récents
- Signaler si une vérification auprès de la source officielle est recommandée

STRUCTURE DE RÉPONSE OBLIGATOIRE :
**Contexte réglementaire** — cadre légal applicable (loi, accord, circulaire)
**Données factuelles vérifiées** — chiffres, taux, textes avec citations sources
**Impact pratique** — conséquences opérationnelles concrètes pour le secteur ${sLabel} dans le périmètre ${pLabel}
**Recommandations** — actions prioritaires et points de vigilance

STYLE :
- Narratif explicatif — paragraphes clairs et structurés
- Précis et sans remplissage — chaque phrase apporte une information nouvelle
- Ton expert, direct, professionnel
- Exemples concrets lorsque pertinents

RÈGLE ABSOLUE DE SIGNATURE : Chaque réponse se termine obligatoirement par :
---
*Douane.ia, votre assistant personnalisé*`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { question, secteur = 'douane', perimetre = 'maroc_ue', sessionId } = req.body;

  if (!question || typeof question !== 'string' || question.trim().length < 5) {
    return res.status(400).json({ error: 'Question invalide' });
  }
  if (question.length > 2000) {
    return res.status(400).json({ error: 'Question trop longue (max 2000 caractères)' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: buildSystemPrompt(secteur, perimetre),
      tools: [
        {
          type: 'web_search_20250305' as any,
          name: 'web_search',
          max_uses: 4,
        } as any,
      ],
      messages: [{ role: 'user', content: question.trim() }],
    });

    // Extraire texte + sources des résultats web
    let text = '';
    const sources: { title: string; url: string }[] = [];

    for (const block of response.content) {
      if (block.type === 'text') {
        text += block.text;
      }
      if (block.type === 'tool_result') {
        try {
          const raw = (block as any).content?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.results) {
              parsed.results.slice(0, 5).forEach((r: any) => {
                if (r.url) sources.push({ title: r.title || r.url, url: r.url });
              });
            }
          }
        } catch (_) {}
      }
    }

    return res.status(200).json({
      text,
      sources,
      secteur:   SECTORS[secteur] || secteur,
      perimetre: PERIMETRES[perimetre] || perimetre,
      sessionId,
    });

  } catch (err: any) {
    console.error('[/api/analytics] Erreur:', err?.message || err);

    if (err?.status === 429) {
      return res.status(429).json({ error: 'Service momentanément surchargé. Réessayez dans quelques secondes.' });
    }

    return res.status(500).json({ error: 'Erreur interne — analyse non disponible' });
  }
}
