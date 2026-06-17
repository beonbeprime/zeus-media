// ===================================================================
// scene-config.ts — MentoriaEstrutura21Dias
// Briefing: "Pensamento de Vídeo: Estrutura Absoluta 21 Dias"
// Squad: zeus-motion | Padrão: Dark Luxury Tech Premium
// Gerado em: 2026-05-21
// ===================================================================

export const FPS       = 30;
export const OVERLAP   = 7;   // frames de overlap entre cenas

// ─── Paleta Dark Luxury Tech Premium (do briefing) ─────────────────
export const COLORS = {
  bg:         "#000000",
  surface1:   "#0E0E10",
  surface2:   "#16161A",
  red:        "#FF002E",
  white:      "#FFFFFF",
  gray:       "#8E8E93",
  glowRed:    "rgba(255, 0, 46, 0.18)",
  glowRedSub: "rgba(255, 0, 46, 0.06)",
};

// ─── Fontes ─────────────────────────────────────────────────────────
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
  x:          90,    // margem lateral mínima
  padTop:     180,   // conteúdo começa aqui
  padBottom:  730,   // conteúdo termina aqui (protege overlay IG/TikTok)
};

// ─── SCENE_TIMING original do briefing ──────────────────────────────
// Formato: [from, durationInFrames]
// ⚠️  Este arquivo é substituído por narr-timing.ts após rodar narr-sync.py
export const SCENE_TIMING_ORIGINAL: [number, number][] = [
  [0,    135],  // C1 — 4.5s  — Sistema Orbital Grid
  [128,  157],  // C2 — 5.2s  — Calendário 3D + Contador de Impacto
  [278,  157],  // C3 — 5.2s  — Linha Bézier + Gráfico de Aceleração
  [425,  190],  // C4 — 6.3s  — Cronômetro Holográfico + 21 em Vermelho
  [608,  217],  // C5 — 7.2s  — Mockup UX + Card Executivo de Vendas
  [818,  307],  // C6 — 10.2s — Grid Cascata de Nodes (Máquina de Tráfego)
  [1118, 232],  // C7 — 7.7s  — Lockup Final CTA
];

export const TOTAL_FRAMES_ORIGINAL = 1350; // 45.0s @ 30fps

// ─── Metadata visual de cada cena (do briefing) ──────────────────────
export interface SceneMeta {
  id:            string;
  label:         string;
  narration:     string;
  keywords:      string[];
  visual:        string;
  camera:        string;
  cameraEntry:   "left" | "right" | "top" | "bottom";
  cameraExit:    "left" | "right" | "top" | "bottom" | "none";
  glowColor:     string;
}

export const SCENES_META: SceneMeta[] = [
  {
    id:          "C1",
    label:       "VENDER MENTORIA",
    narration:   "Quando você pensa em VENDER MENTORIA... Você sabe que precisa estruturar algo que sozinho não vai levar menos do que UM ANO...",
    keywords:    ["vender mentoria", "quando você pensa", "mentoria"],
    visual:      "Wireframe esférico giroscópio + grid de linhas no chão + tipografia ZAxis",
    camera:      "Orbit 360° → Dolly Out violento para saída",
    cameraEntry: "right",
    cameraExit:  "left",
    glowColor:   "rgba(255,0,46,0.06)",
  },
  {
    id:          "C2",
    label:       "UM ANO",
    narration:   "Você sabe que precisa estruturar algo que sozinho não vai levar menos do que UM ANO...",
    keywords:    ["sozinho", "um ano", "estruturar"],
    visual:      "Bloco monolítico 3D do calendário + contador 365 em loop + Impact Shake",
    camera:      "Dolly In Agressivo + Impact Shake (frames 220-228)",
    cameraEntry: "right",
    cameraExit:  "bottom",
    glowColor:   "rgba(255,0,46,0.04)",
  },
  {
    id:          "C3",
    label:       "TRÊS MESES",
    narration:   "Com alguém direcionando você leva uns TRÊS MESES para você colocar a mão na massa e construir.",
    keywords:    ["alguém direcionando", "três meses", "mão na massa", "construir"],
    visual:      "Gráfico Bézier ascendente + node branco correndo + stagger de palavras",
    camera:      "Pan horizontal esquerda para direita + Zoom In óptico na saída (FOV 60→35)",
    cameraEntry: "bottom",
    cameraExit:  "right",
    glowColor:   "rgba(255,0,46,0.04)",
  },
  {
    id:          "C4",
    label:       "21 DIAS",
    narration:   "Agora se eu te falasse que a gente constrói a estrutura da sua mentoria em 21 DIAS... te entrega uma ÁREA DE MEMBROS e também uma PESSOA PARA FAZER AS VENDAS no seu lugar...",
    keywords:    ["agora", "21 dias", "estrutura", "mentoria"],
    visual:      "Número 240px vermelho incandescente + Cronômetro holográfico + partículas",
    camera:      "Crane Up + Zoom In estontante (z: -1500 → -350) + Handheld micro-shake",
    cameraEntry: "left",
    cameraExit:  "left",
    glowColor:   "rgba(255,0,46,0.10)",
  },
  {
    id:          "C5",
    label:       "ÁREA DE MEMBROS",
    narration:   "te entrega uma ÁREA DE MEMBROS e também uma PESSOA PARA FAZER AS VENDAS no seu lugar...",
    keywords:    ["área de membros", "pessoa para fazer", "vendas no seu lugar"],
    visual:      "Mockup Glassmorphism UX + Card terno/headset com borda vermelha + Parallax Z",
    camera:      "Orbit invertido (L→R) estabilizador + Dolly In sutil final",
    cameraEntry: "left",
    cameraExit:  "bottom",
    glowColor:   "rgba(255,0,46,0.04)",
  },
  {
    id:          "C6",
    label:       "PÁGINA · AUTOMAÇÕES · ANÚNCIOS",
    narration:   "Criamos a sua PÁGINA DE VENDAS, as AUTOMAÇÕES, os ANÚNCIOS, as CAMPANHAS DE TRÁFEGO...",
    keywords:    ["página de vendas", "automações", "anúncios", "campanhas", "tráfego"],
    visual:      "4 cards em cascata com stagger de 35f + linhas vetoriais de conexão vermelhas",
    camera:      "Dolly Out + Tilt Down panorâmico (z: -1000 → -1600)",
    cameraEntry: "top",
    cameraExit:  "top",
    glowColor:   "rgba(255,0,46,0.04)",
  },
  {
    id:          "C7",
    label:       "AGENDAR UM HORÁRIO",
    narration:   "E você começa a vender mentoria em 21 DIAS. Para conhecer, é você tocar no botão aqui embaixo e AGENDAR UM HORÁRIO.",
    keywords:    ["começa a vender", "21 dias", "agendar", "botão", "horário"],
    visual:      "CTA Card premium + botão #FF002E + sweep de luz lazer a cada 60f",
    camera:      "Zoom In óptico constante (FOV 60→42) + freeze frame final",
    cameraEntry: "top",
    cameraExit:  "none",
    glowColor:   "rgba(255,0,46,0.08)",
  },
];
