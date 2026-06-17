// ===================================================================
// MagnaMotion — Tipos compartilhados
// Padrão visual Magna (rosegold) com texto sincronizado palavra a palavra
// ===================================================================

import type { IconId } from "./components/icons";

/** Uma palavra transcrita do áudio (gerado por scripts/transcribe-words.py) */
export interface NarrationWord {
  /** Índice da palavra — chave usada pelos ranges do scenes.ts */
  i: number;
  /** Texto original com acentos e pontuação ("você,", "não") */
  text: string;
  /** Início da fala em segundos */
  start: number;
  /** Fim da fala em segundos */
  end: number;
}

export interface NarrationData {
  /** Caminho relativo a public/ (usado com staticFile) */
  audioFile: string;
  durationSec: number;
  language: string;
  /** "narration" = voz falada | "lyrics" = letra de música (mesmo formato) */
  mode: "narration" | "lyrics";
  generatedAt: string;
  words: NarrationWord[];
}

export type SceneLayout = "hero" | "phrase" | "list" | "grid" | "stats" | "act";
export type TextSize = "hero" | "headline" | "subhead" | "body";
export type Emphasis = "gradient" | "normal" | "muted";

/** Uma linha de texto sincronizado dentro de uma cena */
export interface SceneLine {
  /** Range INCLUSIVO de índices de palavras do narration.json: [primeiro, último] */
  words: [number, number];
  size?: TextSize;
  emphasis?: Emphasis;
  /** Ícone (layouts list/grid) */
  icon?: IconId;
  /**
   * Corrige a grafia exibida sem mexer no timing.
   * Deve ter o MESMO número de itens que o range de palavras.
   * Use "" para ocultar uma palavra (o tempo dela ainda passa).
   */
  displayOverride?: string[];
  /** Rótulo estático (layouts stats/grid: legenda abaixo do número/célula) */
  label?: string;
}

export type ExitMode = "left" | "up" | "rotate";

export interface MagnaScene {
  id: string;
  layout: SceneLayout;
  /**
   * Texto estático pequeno acima do conteúdo (não sincronizado).
   * REGRA INVIOLÁVEL: só permitido em layouts de itens (list/grid).
   * Texto que não está na fala NUNCA aparece em hero/phrase/act/stats —
   * use accentIcon (esquema visual) no lugar. buildTimeline valida e bloqueia.
   */
  tag?: string;
  lines: SceneLine[];
  /**
   * Ícone complementar CENTRALIZADO abaixo do texto (cor rosegold, visível).
   * Substitui o antigo float-icon de canto desfocado: complementa a
   * informação da fala, não é ornamento. Conexão semântica obrigatória
   * (ebook → book, dentista → tooth, psicólogo → brain).
   */
  accentIcon?: IconId;
  /** Fundo: "base" #0a0806 | "alt" #0e0c08 | "ato" gradiente */
  bg?: "base" | "alt" | "ato";
  /**
   * Como a cena SAI. Default: alterna left/up automaticamente.
   * "rotate" = giro de câmera 90° (eixo canto inferior esquerdo) — usar
   * com moderação (1-2x por vídeo), a cena seguinte entra no mesmo giro.
   */
  exit?: ExitMode;
  /** Respiro extra (s) após a última palavra antes da cena poder sair */
  holdTailSec?: number;
  /** Ajuste fino de sync da cena inteira em ms (+ atrasa, - adianta) */
  offsetMs?: number;
}

// ─── Timeline resolvida (calculada por timeline.ts) ────────────────

export interface ResolvedWord {
  text: string;
  /** Frame de início da entrada, RELATIVO ao início da cena */
  startFrame: number;
  /** Duração da animação de entrada em frames (adaptativa) */
  entryDur: number;
}

export interface ResolvedLine {
  line: SceneLine;
  words: ResolvedWord[];
}

export interface ResolvedScene {
  scene: MagnaScene;
  sceneIndex: number;
  /** Frame absoluto de início na composição */
  fromFrame: number;
  durFrames: number;
  lines: ResolvedLine[];
  isLast: boolean;
  /** Como esta cena sai (resolvido: alternância automática ou override) */
  exitMode: ExitMode;
  /** true quando a cena anterior saiu com "rotate" — esta entra no giro */
  enterRotate: boolean;
}
