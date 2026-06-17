// ===================================================================
// MagnaMotion — Design tokens
// Fonte da verdade rosegold: clientes/zeus/lucas-viralizacao-v2/index.html
// (deck de apresentação padrão Magna — rosegold dark luxury)
//
// PALETAS: a matiz é selecionada em data/palette.ts (parte do roteiro).
// A ESTRUTURA nunca muda: 3 tons no degradê 135deg, fundo quase preto,
// texto claro, muted translúcido. Só a matiz troca.
// ===================================================================

import { ACTIVE_PALETTE, type PaletteId } from "../data/palette";

interface MagnaPalette {
  /** Tom escuro / médio / claro do degradê de destaque */
  g1: string;
  g2: string;
  g3: string;
  bg: string;
  bgAlt: string;
  bgCard: string;
  txt: string;
  txtMuted: string;
  border: string;
  cardBorder: string;
  cardBg: string;
  /** Glows do background (aurora) */
  aurora1: string;
  aurora2: string;
  /** RGB do grain (0-1) */
  grainRGB: [number, number, number];
  /** Logo oficial correspondente (em public/) */
  logoFile: string;
  /** Filtro CSS opcional no logo (ex: deixar branco sem recriar arquivo) */
  logoFilter?: string;
  /** Fonte display do tema (default Inter). Body permanece DM Sans. */
  fontDisplay?: string;
  /**
   * Tracking dos tamanhos display (hero/headline/subhead).
   * Fontes condensadas (Bebas) NÃO usam o tracking negativo do Inter:
   * ficam juntas demais (feedback 2026-06-10). Levemente aberto.
   */
  displayTracking?: string;
}

const PALETTES: Record<PaletteId, MagnaPalette> = {
  // Padrão oficial Magna (deck lucas-viralizacao-v2) — APROVADO
  rosegold: {
    g1: "#b8887a",
    g2: "#d4a08a",
    g3: "#f0c8b0",
    bg: "#0a0806",
    bgAlt: "#0e0c08",
    bgCard: "#141210",
    txt: "#f0e0d8",
    txtMuted: "rgba(220, 180, 160, 0.55)",
    border: "rgba(200, 155, 140, 0.12)",
    cardBorder: "rgba(212, 160, 138, 0.4)",
    cardBg: "rgba(184, 136, 122, 0.05)",
    aurora1: "rgba(212, 160, 138, 0.085)",
    aurora2: "rgba(184, 136, 122, 0.05)",
    grainRGB: [0.94, 0.78, 0.69],
    logoFile: "magna-logo-rosegold.png",
  },
  // Dourado original com degradê (teste autorizado 2026-06-10)
  gold: {
    g1: "#8a6914",
    g2: "#d4af37",
    g3: "#f4e2a0",
    bg: "#0a0804",
    bgAlt: "#0e0c06",
    bgCard: "#141206",
    txt: "#f2ead6",
    txtMuted: "rgba(225, 205, 150, 0.55)",
    border: "rgba(212, 175, 55, 0.14)",
    cardBorder: "rgba(212, 175, 55, 0.4)",
    cardBg: "rgba(180, 140, 40, 0.05)",
    aurora1: "rgba(212, 175, 55, 0.085)",
    aurora2: "rgba(160, 125, 30, 0.05)",
    grainRGB: [0.94, 0.84, 0.55],
    logoFile: "magna-logo-dourado.png",
  },
  // Vermelho estilo Netflix: preto + branco + vermelho, Bebas Neue
  // (pedido 2026-06-10, exclusivo desta arte)
  red: {
    g1: "#9e0b10",
    g2: "#e50914",
    g3: "#ff5e57",
    bg: "#0a0909",
    bgAlt: "#0e0d0d",
    bgCard: "#141212",
    txt: "#f2f0ee",
    txtMuted: "rgba(225, 220, 218, 0.55)",
    border: "rgba(255, 255, 255, 0.10)",
    cardBorder: "rgba(229, 9, 20, 0.45)",
    cardBg: "rgba(229, 9, 20, 0.05)",
    aurora1: "rgba(229, 9, 20, 0.07)",
    aurora2: "rgba(158, 11, 16, 0.05)",
    grainRGB: [0.9, 0.35, 0.32],
    logoFile: "magna-logo-dourado.png",
    logoFilter: "grayscale(1) brightness(1.9)",
    fontDisplay: "'Bebas Neue', 'Inter', sans-serif",
    displayTracking: "0.018em",
  },
};

const P = PALETTES[ACTIVE_PALETTE];

export const COLORS = {
  rg1: P.g1,
  rg2: P.g2,
  rg3: P.g3,
  bg: P.bg,
  bgAlt: P.bgAlt,
  bgCard: P.bgCard,
  txt: P.txt,
  txtMuted: P.txtMuted,
  border: P.border,
  cardBorder: P.cardBorder,
  cardBg: P.cardBg,
} as const;

export const AURORA_1 = P.aurora1;
export const AURORA_2 = P.aurora2;
export const GRAIN_RGB = P.grainRGB;
export const LOGO_FILE = P.logoFile;
export const LOGO_FILTER = P.logoFilter;

/** Gradiente de destaque (estrutura do deck, matiz da paleta ativa) */
export const GRADIENT_TEXT = `linear-gradient(135deg, ${P.g3} 20%, ${P.g2} 50%, ${P.g1} 80%)`;

export const gradientTextStyle: React.CSSProperties = {
  backgroundImage: GRADIENT_TEXT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export const FONT_DISPLAY = P.fontDisplay ?? "'Inter', -apple-system, sans-serif";
export const FONT_BODY = "'DM Sans', sans-serif";

/** Escala tipográfica 1080x1920 (remotion-animation-standards) */
const track = (interDefault: string) => P.displayTracking ?? interDefault;
export const SIZES: Record<string, { fontSize: number; fontWeight: number; letterSpacing: string; fontFamily: string; lineHeight: number }> = {
  hero: { fontSize: 128, fontWeight: 800, letterSpacing: track("-0.04em"), fontFamily: FONT_DISPLAY, lineHeight: 1.06 },
  headline: { fontSize: 92, fontWeight: 800, letterSpacing: track("-0.035em"), fontFamily: FONT_DISPLAY, lineHeight: 1.1 },
  subhead: { fontSize: 64, fontWeight: 600, letterSpacing: track("-0.02em"), fontFamily: FONT_DISPLAY, lineHeight: 1.18 },
  body: { fontSize: 44, fontWeight: 400, letterSpacing: "0em", fontFamily: FONT_BODY, lineHeight: 1.42 },
};

// ─── Layout / zonas seguras ─────────────────────────────────────────
export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const PAD_X = 80;
export const PAD_TOP = 150;
/** Terço inferior livre (UI do Instagram/anúncio): nada cruza esta linha */
export const SAFE_BOTTOM = 1280;

/**
 * Gap entre linhas de texto de uma cena (px).
 * REGRA (feedback 2026-06-10): linhas PRÓXIMAS — espaçamento exagerado
 * entre linhas é erro de padrão, desalinha e fica feio.
 */
export const LINE_GAP = 10;

// ─── Timing ─────────────────────────────────────────────────────────
/** Antecipação da palavra em relação à fala (frames) */
export const LEAD_IN = 3;
/** Frames de cena antes da primeira palavra (background/tag montam) */
export const PRE_ROLL = 12;
/** Overlap entre cenas (padrão da casa) */
export const OVERLAP = 7;
/** Duração da saída quádrupla */
export const EXIT_DUR = 16;
/** Respiro padrão após a última palavra da cena (s) */
export const DEFAULT_HOLD_TAIL = 0.4;
/** Buffer no fim da composição (frames) */
export const TAIL_BUFFER = 45;
