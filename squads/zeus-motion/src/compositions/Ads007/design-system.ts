/**
 * ADS 007 — Design System Tokens
 * Filosofia: Dark Premium Purple — estilo azza.co
 * Acento: #8B2FBE roxo elétrico vibrante
 */

import { Easing, interpolate } from "remotion";

// ─── PALETA ───────────────────────────────────────────────────────────────────

export const BG           = "#080808";   // preto profundo com toque escuro
export const CARD_1       = "#0E0B14";   // superfície card roxa escura
export const CARD_2       = "#17112A";   // superfície card elevada
export const RED          = "#8B2FBE";   // roxo elétrico — acento principal (azza.co)
export const RED_DIM      = "rgba(139, 47, 190, 0.15)";  // glow de fundo
export const RED_MID      = "rgba(139, 47, 190, 0.45)";  // glow médio
export const PURPLE_BRIGHT = "#A855F7";  // roxo mais claro para destaques
export const WHITE        = "#FFFFFF";   // texto primário
export const GRAY         = "#9B9BA8";   // texto secundário
export const BORDER       = "#2A1A3E";   // bordas de card roxas

// ─── TIPOGRAFIA ───────────────────────────────────────────────────────────────

export const FONT = `"SF Pro Display", -apple-system, "Helvetica Neue", sans-serif`;

export const TYPE = {
  HERO:       { fontSize: 220, fontWeight: 900, letterSpacing: -8,  lineHeight: 0.88 },
  DISPLAY:    { fontSize: 170, fontWeight: 900, letterSpacing: -6,  lineHeight: 0.90 },
  IMPACT:     { fontSize: 110, fontWeight: 800, letterSpacing: -4,  lineHeight: 1.0  },
  HEADLINE:   { fontSize:  80, fontWeight: 700, letterSpacing: -3,  lineHeight: 1.1  },
  SUBHEAD:    { fontSize:  52, fontWeight: 500, letterSpacing: -1,  lineHeight: 1.2  },
  BODY:       { fontSize:  38, fontWeight: 400, letterSpacing:  0,  lineHeight: 1.4  },
  LABEL:      { fontSize:  22, fontWeight: 600, letterSpacing:  4,  textTransform: "uppercase" as const },
  CAPTION:    { fontSize:  18, fontWeight: 400, letterSpacing:  1,  lineHeight: 1.5  },
} as const;

// ─── SAFE ZONES ───────────────────────────────────────────────────────────────

export const SAFE_X      = 90;
export const PAD_TOP     = 180;
export const SAFE_BOTTOM = 1280;

// ─── BACKGROUND (3 camadas padrão) ───────────────────────────────────────────

export const BG_LAYERS = {
  solid:  BG,
  glow:   `radial-gradient(ellipse 80% 55% at 50% 28%, ${RED_DIM} 0%, transparent 70%)`,
  glow2:  `radial-gradient(ellipse 60% 40% at 50% 80%, rgba(139,47,190,0.08) 0%, transparent 70%)`,
  grain:  { opacity: 0.035 },
} as const;

// ─── SPRING CONFIGS APROVADAS ─────────────────────────────────────────────────

export const SPRING = {
  text:    { damping: 14, mass: 0.8 },
  card:    { damping: 13, mass: 0.9 },
  impact:  { damping: 16, mass: 1.1 },   // títulos grandes
  badge:   { damping: 12, mass: 0.7, stiffness: 120 },
  snappy:  { damping: 18, mass: 0.6, stiffness: 200 },
  heavy:   { damping: 16, mass: 1.2 },
  camera:  { damping: 22, mass: 1.0 },   // câmera orbital
} as const;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** clamped interpolate — nunca usar interpolate sem clamp */
export const ci = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing?: (t: number) => number
) =>
  interpolate(frame, input, output, {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** entryFrom — entrada com blur direcional */
export const entryFrom = (
  frame: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 80,
  dur = 22
) => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const pos  = ci(frame, [0, dur], [distance * sign, 0], Easing.out(Easing.cubic));
  const op   = ci(frame, [0, Math.round(dur * 0.5)], [0, 1]);
  const blur = ci(frame, [0, Math.round(dur * 0.45)], [12, 0], Easing.out(Easing.quad));
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px)`,
    filter:    `blur(${blur}px)`,
  };
};

/** exitTo — Saída Quadrupla completa */
export const exitTo = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 1200,
  dur = 18
) => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const f    = frame - start;
  return {
    opacity:   ci(f, [dur * 0.35, dur], [1, 0]),
    transform: `translate${axis}(${ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp))}px) scale(${ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp))})`,
    filter:    `blur(${ci(f, [0, dur], [0, 20], Easing.in(Easing.cubic))}px)`,
  };
};

/** exitToNB — Saída sem blur (pai de WebkitBackgroundClip:text) */
export const exitToNB = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 1200,
  dur = 18
) => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const f    = frame - start;
  return {
    opacity:   ci(f, [dur * 0.35, dur], [1, 0]),
    transform: `translate${axis}(${ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp))}px) scale(${ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp))})`,
  };
};

/** Float senoidal para micro-animação */
export const floatY = (frame: number, amplitude = 6, freq = 0.04) =>
  Math.sin(frame * freq) * amplitude;

/** Glow pulsante roxo */
export const redGlow = (frame: number, base = 0.20, variation = 0.06, freq = 0.05) =>
  base + Math.sin(frame * freq) * variation;

/** CountUp numérico: de 0 a target em dur frames */
export const countUp = (frame: number, target: number, dur: number) =>
  Math.round(ci(frame, [0, dur], [0, target], Easing.out(Easing.cubic)));
