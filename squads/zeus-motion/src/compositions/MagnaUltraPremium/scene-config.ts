// ===================================================================
// scene-config.ts — MagnaUltraPremium
// Briefing: "Magna Ultra Premium (Nível 5 de Consciência)"
// Squad: zeus-motion | Padrão: Dark Luxury Tech Premium
// Gerado em: 2026-05-21
// ===================================================================

export const FPS     = 30;
export const OVERLAP = 7;   // frames de overlap entre cenas

// ─── Paleta Dark Luxury Tech Premium — Magna Ultra Premium ──────────
export const COLORS = {
  bg:         "#000000",
  surface1:   "#0D0D11",
  surface2:   "#16161C",
  red:        "#FF001E",
  white:      "#FFFFFF",
  gray:       "#7E7E86",
  glowRed:    "rgba(255, 0, 30, 0.18)",
  glowRedSub: "rgba(255, 0, 30, 0.06)",
};

// ─── Fontes ──────────────────────────────────────────────────────────
export const FONT      = `"SF Pro Display", -apple-system, "Helvetica Neue", sans-serif`;
export const FONT_MONO = `"Space Mono", "Courier New", monospace`;

// ─── Tipografia TV Scale (1080×1920) ────────────────────────────────
export const TV = {
  hero:     { fontSize: 240, fontWeight: 900, letterSpacing: -4 },
  headline: { fontSize: 96,  fontWeight: 700, letterSpacing: -3 },
  subhead:  { fontSize: 64,  fontWeight: 300, letterSpacing: -1 },
  body:     { fontSize: 40,  fontWeight: 400, letterSpacing: 0  },
  caption:  { fontSize: 24,  fontWeight: 500, letterSpacing: 2  },
  eyebrow:  { fontSize: 18,  fontWeight: 600, letterSpacing: 6  },
};

// ─── Safe zones ──────────────────────────────────────────────────────
export const SAFE = {
  x:         90,    // margem lateral mínima
  padTop:    180,   // conteúdo começa aqui
  padBottom: 730,   // conteúdo termina aqui (protege overlay IG/TikTok)
};

// ─── SCENE_TIMING do briefing ───────────────────────────────────────
// Formato: [from, durationInFrames]
export const SCENE_TIMING: [number, number][] = [
  [0,    150],  // C1 — 5.0s  — Área de membros não vende sozinha
  [143,  177],  // C2 — 5.9s  — FICA PARADO
  [313,  187],  // C3 — 6.2s  — Curso vs Mentoria
  [493,  187],  // C4 — 6.2s  — 21 DIAS
  [673,  217],  // C5 — 7.2s  — FECHADOR
  [883,  247],  // C6 — 8.2s  — R$ 50k
  [1123, 227],  // C7 — 7.6s  — CTA
];

export const TOTAL_FRAMES = 1350; // 45.0s @ 30fps

// ─── Metadata visual de cada cena ───────────────────────────────────
export interface SceneMeta {
  id:          string;
  label:       string;
  narration:   string;
  visual:      string;
  camera:      string;
  cameraEntry: "left" | "right" | "top" | "bottom";
  cameraExit:  "left" | "right" | "top" | "bottom" | "none";
  glowColor:   string;
}

export const SCENES_META: SceneMeta[] = [
  {
    id:          "C1",
    label:       "ÁREA DE MEMBROS NÃO VENDE",
    narration:   "Ter área de membros não vende mentoria. Ter produto não vende mentoria. Ter conhecimento não vende mentoria.",
    visual:      "Ícone X vermelho pulsante + 3 cards em cascata (Área de Membros / Produto / Conhecimento) com tachado",
    camera:      "Dolly In agressivo + micro-shake a cada card",
    cameraEntry: "right",
    cameraExit:  "left",
    glowColor:   "rgba(255, 0, 30, 0.08)",
  },
  {
    id:          "C2",
    label:       "FICA PARADO",
    narration:   "E enquanto você fica parado esperando o momento perfeito, alguém com menos preparo do que você está fechando mentorias todo dia.",
    visual:      "Contador regressivo holográfico + silhueta parada vs silhueta em movimento",
    camera:      "Pan lateral L→R + Zoom In óptico na saída",
    cameraEntry: "left",
    cameraExit:  "top",
    glowColor:   "rgba(255, 0, 30, 0.04)",
  },
  {
    id:          "C3",
    label:       "CURSO VS MENTORIA",
    narration:   "A diferença entre quem vende curso e quem vende mentoria é uma só: estrutura. E estrutura leva tempo.",
    visual:      "Split screen: coluna CURSO (cinza, preços baixos) vs coluna MENTORIA (vermelho, ticket alto)",
    camera:      "Crane Up + Dolly Out panorâmico",
    cameraEntry: "top",
    cameraExit:  "right",
    glowColor:   "rgba(255, 0, 30, 0.06)",
  },
  {
    id:          "C4",
    label:       "21 DIAS",
    narration:   "A gente constrói tudo isso por você em 21 dias. Área de membros. Página de vendas. Automações. Anúncios. Time de vendas.",
    visual:      "Número 21 em 240px vermelho incandescente + lista de entregas surgindo com check animado",
    camera:      "Zoom In estontante (z: -1500 → -350) + Handheld micro-shake",
    cameraEntry: "bottom",
    cameraExit:  "left",
    glowColor:   "rgba(255, 0, 30, 0.12)",
  },
  {
    id:          "C5",
    label:       "FECHADOR",
    narration:   "A gente ainda coloca um fechador para fazer as vendas no seu lugar.",
    visual:      "Card glassmorphism: silhueta terno/headset com halo vermelho pulsante + tag FECHADOR",
    camera:      "Orbit invertido (R→L) + Dolly In sutil final",
    cameraEntry: "left",
    cameraExit:  "bottom",
    glowColor:   "rgba(255, 0, 30, 0.06)",
  },
  {
    id:          "C6",
    label:       "R$ 50K",
    narration:   "Com tudo isso no lugar, você começa a faturar 50 mil por mês com mentoria.",
    visual:      "Número R$50k em hero 240px com animação countUp em vermelho + partículas douradas",
    camera:      "Dolly Out + Tilt Down panorâmico",
    cameraEntry: "top",
    cameraExit:  "right",
    glowColor:   "rgba(255, 0, 30, 0.10)",
  },
  {
    id:          "C7",
    label:       "CTA — AGENDAR",
    narration:   "Para saber como funciona, toque no botão aqui embaixo e agende uma conversa com o nosso time.",
    visual:      "CTA Card premium: headline + botão #FF001E + sweep de luz lazer a cada 60f",
    camera:      "Zoom In óptico constante (FOV 60→42) + freeze frame final",
    cameraEntry: "top",
    cameraExit:  "none",
    glowColor:   "rgba(255, 0, 30, 0.10)",
  },
];
