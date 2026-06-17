// MentoriaPitch — Design System (1080×1920 Reels / portrait)
// Apple Minimalist Kinetic: Void/Flash alternating

export const W = 1080;
export const H = 1920;

export const SAFE_X         = 90;    // margem lateral
export const SAFE_W         = 900;   // largura máxima do conteúdo
export const PAD_TOP        = 160;   // conteúdo começa aqui
export const SAFE_BOTTOM    = 1280;  // conteúdo TERMINA aqui (top 2/3)
export const CONTENT_HEIGHT = SAFE_BOTTOM - PAD_TOP; // 1120px

export const COLORS = {
  void:     "#000000",
  flash:    "#FFFFFF",
  accent:   "#34C759",   // green — resultados
  red:      "#FF3B30",   // strike-through cena 8
  blue:     "#0071E3",   // botão Instagram cena 9
  grayBg:   "#F5F5F7",   // card fundo cena 2
  grayText: "#86868B",   // texto secundário
  dark:     "#1D1D1F",   // texto escuro
  white:    "#FFFFFF",
} as const;

export const FONT     = "Inter, -apple-system, Helvetica Neue, sans-serif";
export const CENTER_X = W / 2;                          // 540
export const CENTER_Y = PAD_TOP + CONTENT_HEIGHT / 2;  // 720
