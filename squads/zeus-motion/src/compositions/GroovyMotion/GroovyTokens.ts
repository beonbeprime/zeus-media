// Groovy Motion System — Design Tokens (70s vintage psychedelic)
// Filosofia: Vintage Premium Groovy | Aprovado 2026-05-23

export const C = {
  paper:     "#F4E7C8",
  paperDeep: "#E8D6A8",
  paperEdge: "#C9B27E",
  magenta:   "#D63380",
  hotPink:   "#E84A7C",
  yellow:    "#F2BE2C",
  orange:    "#DB5F2A",
  teal:      "#46B5AE",
  purple:    "#3B0F38",
  plum:      "#5C1F4E",
} as const;

export const FONT = {
  display: `"Ultra", "Alfa Slab One", serif`,
  groovy:  `"Bagel Fat One", "Bowlby One SC", sans-serif`,
  body:    `"DM Sans", system-ui, sans-serif`,
  mono:    `"JetBrains Mono", ui-monospace, monospace`,
} as const;

// Tamanhos para 1080×1920
export const FS = {
  hook:      160,
  title:      90,
  subtitle:   48,
  body:       30,
  caption:    20,
} as const;

// Safe zone portrait
export const SAFE = {
  padX:    72,
  padTop: 160,
  bottom: 1280,
} as const;

// Timing por cena @30fps (120f = 4s)
export const TIMING = {
  entryEnd:  22,   // entrada 0→22f (0.7s)
  holdEnd:   90,   // hold 22→90f (2.3s)
  exitEnd:  120,   // saída 90→120f (1.0s)
  total:    120,
} as const;

// Offset shadow groovy
export const SHADOW = { x: 8, y: 8 } as const;
