/**
 * MagnaCaptura — Design System
 * Black & White Premium — vermelho apenas para negativos
 * v3
 */

// ─── PALETA ──────────────────────────────────────────────────────────────────

export const COLORS = {
  bg:          "#080808",
  white:       "#FFFFFF",
  offWhite:    "rgba(255,255,255,0.92)",
  muted:       "rgba(255,255,255,0.50)",
  subtle:      "rgba(255,255,255,0.14)",
  cardBg:      "rgba(255,255,255,0.04)",
  cardBorder:  "rgba(255,255,255,0.10)",
  red:         "#FF3B30",   // APENAS elementos negativos — discreto
  // aliases para compatibilidade (gold/teal removidos da paleta)
  gold:        "rgba(255,255,255,0.92)",
  goldDim:     "rgba(255,255,255,0.55)",
  goldGlow:    "rgba(255,255,255,0.06)",
  teal:        "rgba(255,255,255,0.75)",
  tealDim:     "rgba(255,255,255,0.42)",
};

// ─── TIPOGRAFIA ──────────────────────────────────────────────────────────────

export const FONT_DISPLAY = "Montserrat, 'SF Pro Display', -apple-system, sans-serif";
export const FONT_MONO    = "'Space Mono', 'Courier New', monospace";

// ─── LAYOUT ──────────────────────────────────────────────────────────────────

export const SAFE_X      = 90;   // margem lateral
export const SAFE_W      = 900;  // largura máxima do conteúdo
export const PAD_TOP     = 160;  // conteúdo começa aqui (de cima)
export const SAFE_BOTTOM = 1280; // conteúdo TERMINA aqui (2/3 da tela)
// Regra: NADA abaixo de SAFE_BOTTOM (1280px).
// O terço inferior (1280-1920) fica vazio para overlay do Instagram.
export const CONTENT_HEIGHT = SAFE_BOTTOM - PAD_TOP; // 1120px de área útil

// ─── SCENE_TIMING ────────────────────────────────────────────────────────────

export interface SceneMeta {
  name: string;
  from: number;
  dur:  number;
  exitF: number | null;
}

export const SCENES_META: SceneMeta[] = [
  { name: "Scene1",  from: 0,    dur: 142, exitF: 105 },
  { name: "Scene2",  from: 135,  dur: 142, exitF: 100 },
  { name: "Scene3",  from: 270,  dur: 142, exitF: 77  },
  { name: "Scene4",  from: 405,  dur: 142, exitF: 110 },
  { name: "Scene5",  from: 540,  dur: 142, exitF: 110 },
  { name: "Scene6",  from: 675,  dur: 142, exitF: 110 },
  { name: "Scene7",  from: 810,  dur: 142, exitF: 110 },
  { name: "Scene8",  from: 945,  dur: 142, exitF: 100 },
  { name: "Scene9",  from: 1080, dur: 142, exitF: 110 },
  { name: "Scene10", from: 1215, dur: 142, exitF: null },
];
