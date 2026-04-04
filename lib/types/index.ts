// lib/types/index.ts
// Version 4.0 — ajout systemPrompt dans AgentRequest

export type Channel = "web" | "whatsapp" | "mobile";

export type IntentType =
  | "tarif"
  | "procedure"
  | "circulaire_specifique"
  | "admission_temporaire"
  | "zones_franches"
  | "tva"
  | "contentieux"
  | "general";

export interface Intent {
  type: IntentType;
  circulaire_numero?: string;
  category_filter?: string;
  confidence: number;
}

export interface ChunkResult {
  circulaire_id: string;
  numero: string;
  date: string;
  objet: string;
  titre_section: string;
  contenu: string;
  similarity: number;
}

export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentRequest {
  message:       string;
  sessionId:     string;
  channel?:      string;
  language?:     "fr" | "ar" | "auto";
  systemPrompt?: string;   // ← System Prompt v4 injecté par pages/api/chat.ts
}

export interface AgentResponse {
  text:       string;
  sources:    SourceCitation[];
  sessionId:  string;
  tokensUsed: number;
  latencyMs:  number;
}

export interface SourceCitation {
  numero:     string;
  date:       string;
  objet:      string;
  section:    string;
  similarity: number;
}

export interface CirculaireExtracted {
  numero:         string;
  date:           string;
  objet:          string;
  categorie:      string;
  mots_cles:      string[];
  references:     ReferenceItem[];
  abroge:         string | null;
  modifie:        string[];
  resume:         string;
  fichier_source: string;
  sections:       SectionItem[];
}

export interface ReferenceItem {
  type:  "article_code" | "arrete" | "loi" | "circulaire" | "dahir";
  texte: string;
}

export interface SectionItem {
  titre:   string;
  contenu: string;
}

export interface IngestResult {
  fichier:         string;
  status:          "success" | "error";
  numero?:         string;
  chunksInserted?: number;
  error?:          string;
}
