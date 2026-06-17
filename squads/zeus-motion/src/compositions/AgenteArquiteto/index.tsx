/**
 * AgenteArquiteto - v13 (46.23s / 1387 frames @ 30fps)
 * 9 cenas sincronizadas com narração (45.79s)
 * Apple Minimalista | Safe zone Reels: texto NUNCA abaixo y=1200
 * v13: sync-fix-3 — análise completa silencedetect, ajuste TODOS os EXIT_F + SCENE_TIMING:
 *   C2: dur 120->75, EXIT_F2 100->45 (narração C2 dura só 0.99s, de 9.9s a 10.89s)
 *   C3: from 392->350, EXIT_F3 105->99 (C3 narração termina em 14.95s)
 *   C4: from 507->465, dur 150->145, EXIT_F4 128->119 (C4 narração termina em 19.49s)
 *   C5: from 647->600, dur 225->255, EXIT_F5 197->229, REVEAL_DELAY5 0->3
 *   C6: from 852->845, dur 210->240, EXIT_F6 185->210 (C6 narração termina em 35.05s)
 *   C7: from 1052->1075, EXIT_F7 178->168 (C7 narração termina em 41.44s)
 *   C8: from 1232->1265, dur 155->122 (C8 começa em 42.09s, termina 45.79s)
 *
 * Timing (narração — silencedetect -35dB:d=0.3):
 *  C0 from=0    dur=120   | ChatGPT intro       0.00s – 4.00s  | exit@100=3.33s
 *  C1 from=110  dur=182   | Lista numerada      3.67s – 9.73s  | exit@161→abs271=9.03s
 *  C2 from=282  dur=75    | Formas caos->linhas 9.40s – 11.9s  | exit@45→abs327=10.9s
 *  C3 from=350  dur=125   | Celular + tags      11.67s – 15.83s| exit@99→abs449=14.97s
 *  C4 from=465  dur=145   | Timer microfone     15.5s – 20.33s | exit@119→abs584=19.47s
 *  C5 from=600  dur=255   | Texto agressivo     20.0s – 28.5s  | exit@229→abs829=27.63s
 *  C6 from=845  dur=240   | Checkout            28.17s – 36.5s | exit@210→abs1055=35.17s
 *  C7 from=1075 dur=200   | Ticket bonus        35.83s – 42.5s | exit@168→abs1243=41.43s
 *  C8 from=1265 dur=122   | Tela final          42.17s – 46.23s
 *  Total: 1265 + 122 = 1387
 */

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ─── PRIMITIVAS BRABO v9.0 ───────────────────────────────────────────────────

const ci = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  ease?: (t: number) => number
) =>
  interpolate(frame, [f0, f1], [v0, v1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

type Direction = "left" | "right" | "top" | "bottom";
const SIGN_MAP: Record<Direction, [string, number]> = {
  left:   ["X", -1],
  right:  ["X",  1],
  top:    ["Y", -1],
  bottom: ["Y",  1],
};

const entryFrom = (
  frame: number,
  dir: Direction,
  distance = 100,
  dur = 22
): React.CSSProperties => {
  const [axis, sign] = SIGN_MAP[dir];
  const pos = ci(frame, [0, dur], [distance * sign, 0], Easing.out(Easing.cubic));
  return {
    opacity: ci(frame, [0, Math.round(dur * 0.5)], [0, 1]),
    transform: `translate${axis}(${pos}px)`,
    filter: `blur(${ci(frame, [0, Math.round(dur * 0.45)], [12, 0], Easing.out(Easing.quad))}px)`,
  };
};

const exitTo = (
  frame: number,
  start: number,
  dir: Direction,
  distance = 1200,
  dur = 18
): React.CSSProperties => {
  const [axis, sign] = SIGN_MAP[dir];
  return {
    opacity: ci(frame, [start + dur * 0.35, start + dur], [1, 0]),
    transform: `translate${axis}(${ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp))}px) scale(${ci(frame, [start, start + dur], [1, 0.94], Easing.in(Easing.exp))})`,
    filter: `blur(${ci(frame, [start, start + dur], [0, 20], Easing.in(Easing.cubic))}px)`,
  };
};

const exitToNB = (
  frame: number,
  start: number,
  dir: Direction,
  distance = 1200,
  dur = 18
): React.CSSProperties => {
  const [axis, sign] = SIGN_MAP[dir];
  return {
    opacity: ci(frame, [start + dur * 0.35, start + dur], [1, 0]),
    transform: `translate${axis}(${ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp))}px) scale(${ci(frame, [start, start + dur], [1, 0.94], Easing.in(Easing.exp))})`,
  };
};

const mergeStyles = (
  entry: React.CSSProperties,
  exit: React.CSSProperties
): React.CSSProperties => ({
  ...entry,
  ...exit,
  opacity: ((entry.opacity as number) ?? 1) * ((exit.opacity as number) ?? 1),
  transform: [entry.transform, exit.transform].filter(Boolean).join(" "),
  filter: [entry.filter, exit.filter].filter(Boolean).join(" "),
});

// ─── LAYOUT ──────────────────────────────────────────────────────────────────

const SAFE_X     = 90;
const SAFE_W     = 900;
const PAD_TOP    = 180;
const PAD_BOTTOM = 730;
const FONT       = "SF Pro Display, -apple-system, Helvetica Neue, sans-serif";

// ─── BACKGROUND ──────────────────────────────────────────────────────────────

const BackgroundBase: React.FC<{ glowColor?: string }> = ({
  glowColor = "rgba(255,255,255,0.04)",
}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "#000000" }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 50% at 50% 28%, ${glowColor} 0%, transparent 70%)`,
      }}
    />
    <AbsoluteFill style={{ opacity: 0.03 }}>
      <svg width="100%" height="100%">
        <filter id="n-aa">
          <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n-aa)" />
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);

// ─── CENA 0 - CHATGPT INTRO ──────────────────────────────────────────────────
// dur=120f | EXIT_F=100
// Interface ChatGPT imitada: top bar + pergunta em destaque + input bar

const SceneChatGPT: React.FC = () => {
  const frame = useCurrentFrame();
  const EXIT_DIR: Direction = "top";
  const EXIT_F0 = 100;

  const lineA = ["Pensou", "em", "vender"];
  const lineC = ["mas", "não", "sabe", "por", "onde", "começar?"];

  // Animação da seta do input bar
  const arrowY = Math.sin(frame * 0.12) * 3;

  const topBarOp  = ci(frame, [0, 16], [0, 1]);
  const inputBarOp = ci(frame, [55, 75], [0, 1]) *
                     ci(frame, [EXIT_F0 - 8, EXIT_F0 + 8], [1, 0]);

  return (
    <AbsoluteFill>
      {/* ChatGPT dark background */}
      <AbsoluteFill style={{ background: "#0d0d0d" }} />
      {/* Noise */}
      <AbsoluteFill style={{ opacity: 0.022 }}>
        <svg width="100%" height="100%">
          <filter id="n-cgpt">
            <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#n-cgpt)" />
        </svg>
      </AbsoluteFill>

      {/* ── Top bar ChatGPT ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 130,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
          paddingBottom: 24,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          opacity: topBarOp,
        }}
      >
        {/* Logo ChatGPT */}
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 34, height: 34,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.65)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9 Q9 1.5 15 9 Q9 16.5 3 9Z" fill="rgba(255,255,255,0.85)" />
            </svg>
          </div>
          <div
            style={{
              fontSize: 19,
              fontFamily: FONT,
              fontWeight: 600,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "-0.01em",
            }}
          >
            ChatGPT
          </div>
        </div>
        {/* Model pill */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.11)",
            borderRadius: 100,
            padding: "8px 16px",
          }}
        >
          <div style={{ fontSize: 14, fontFamily: FONT, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>4o</div>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── Texto principal (pergunta) ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
          paddingTop: 130,
          paddingBottom: 640,
        }}
      >
        {/* Linha 1: "Pensou em vender" */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 6 }}>
          {lineA.map((word, wi) => {
            const delay = 10 + wi * 5;
            const f = Math.max(frame - delay, 0);
            const notStarted = frame < delay;
            return (
              <div
                key={wi}
                style={{
                  fontSize: 46,
                  fontFamily: FONT,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.2,
                  ...mergeStyles(
                    notStarted ? { opacity: 0, transform: "translateY(26px)" } : entryFrom(f, "bottom", 34, 16),
                    exitToNB(frame, EXIT_F0, EXIT_DIR)
                  ),
                }}
              >
                {word}
              </div>
            );
          })}
        </div>

        {/* Linha 2: "MENTORIA" - destaque máximo */}
        {(() => {
          const delay = 26;
          const f = Math.max(frame - delay, 0);
          const notStarted = frame < delay;
          return (
            <div
              style={{
                fontSize: 90,
                fontFamily: FONT,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                marginBottom: 12,
                ...mergeStyles(
                  notStarted ? { opacity: 0, transform: "translateY(52px)" } : entryFrom(f, "bottom", 64, 22),
                  exitToNB(frame, EXIT_F0, EXIT_DIR)
                ),
              }}
            >
              MENTORIA
            </div>
          );
        })()}

        {/* Linha 3: "mas não sabe por onde começar?" */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {lineC.map((word, wi) => {
            const delay = 38 + wi * 4;
            const f = Math.max(frame - delay, 0);
            const notStarted = frame < delay;
            return (
              <div
                key={wi}
                style={{
                  fontSize: 42,
                  fontFamily: FONT,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.3,
                  ...mergeStyles(
                    notStarted ? { opacity: 0, transform: "translateY(22px)" } : entryFrom(f, "bottom", 28, 14),
                    exitToNB(frame, EXIT_F0, EXIT_DIR)
                  ),
                }}
              >
                {word}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ── Input bar ChatGPT (decoração) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 680,
          left: SAFE_X,
          right: SAFE_X,
          opacity: inputBarOp,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.065)",
            border: "1px solid rgba(255,255,255,0.13)",
            borderRadius: 26,
            padding: "19px 22px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* + icon */}
          <div
            style={{
              width: 30, height: 30,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6h8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          {/* Placeholder */}
          <div
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: FONT,
              color: "rgba(255,255,255,0.22)",
              fontWeight: 400,
            }}
          >
            Pergunte qualquer coisa
          </div>
          {/* Send button animado */}
          <div
            style={{
              width: 36, height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.14)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transform: `translateY(${arrowY}px)`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 11V3M3 7L7 3L11 7" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── CENA 1 - CAPA (lista numerada) ──────────────────────────────────────────
// dur=182f | EXIT_F=161
// "Quando você pensa em vender mentoria" + "O que fazer primeiro?" + lista 1-5

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const EXIT_DIR: Direction = "top";
  const EXIT_F1 = 161;

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.04)" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingTop: PAD_TOP + 60,
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
          paddingBottom: PAD_BOTTOM,
        }}
      >
        {/* Label contexto */}
        <div
          style={{
            fontSize: 22,
            fontFamily: FONT,
            fontWeight: 500,
            color: "#8E8E93",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 18,
            ...mergeStyles(
              entryFrom(frame, "top", 30, 14),
              exitTo(frame, EXIT_F1, EXIT_DIR)
            ),
          }}
        >
          Quando você pensa em vender mentoria
        </div>

        {/* Headline principal */}
        <div
          style={{
            fontSize: 60,
            fontFamily: FONT,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.1,
            marginBottom: 50,
            ...mergeStyles(
              entryFrom(Math.max(frame - 6, 0), "top", 52, 20),
              exitToNB(frame, EXIT_F1, EXIT_DIR)
            ),
          }}
        >
          O que você tem{"\n"}que fazer primeiro?
        </div>

        {/* Lista 1-5 com stagger */}
        {[0, 1, 2, 3, 4].map((idx) => {
          const delay = 22 + idx * 11;
          const f = Math.max(frame - delay, 0);
          const notStarted = frame < delay;
          return (
            <div
              key={idx}
              style={{
                ...mergeStyles(
                  notStarted ? { opacity: 0 } : entryFrom(f, "right", 60, 18),
                  exitTo(frame, EXIT_F1 + idx * 2, EXIT_DIR, 800)
                ),
                display: "flex",
                alignItems: "center",
                gap: 22,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(255,255,255,0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 17,
                  fontFamily: FONT,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {idx + 1}
              </div>
              <div
                style={{
                  height: 3,
                  flex: 1,
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 2,
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── CENA 2 - ORGANIZAR (caos -> linhas por tipo) ────────────────────────────
// dur=75f | EXIT_F=55
// 16 formas: 4 linhas por tipo | easeInOut(cubic)

type ShapeKind = "circle" | "square" | "triangle" | "diamond";

const SHAPES_BY_TYPE: ShapeKind[] = [
  "circle",  "circle",  "circle",  "circle",
  "square",  "square",  "square",  "square",
  "triangle","triangle","triangle","triangle",
  "diamond", "diamond", "diamond", "diamond",
];

const INIT_POS_C2 = [
  { x: 340, y: 490 }, { x: 65,  y: 120 }, { x: 755, y: 330 }, { x: 185, y: 620 },
  { x: 545, y: 55  }, { x: 825, y: 445 }, { x: 115, y: 380 }, { x: 665, y: 185 },
  { x: 275, y: 265 }, { x: 715, y: 565 }, { x: 35,  y: 510 }, { x: 840, y: 95  },
  { x: 450, y: 355 }, { x: 110, y: 705 }, { x: 785, y: 275 }, { x: 355, y: 45  },
];

const FINAL_POS_C2 = Array.from({ length: 16 }, (_, i) => ({
  x: 55 + (i % 4) * 225,
  y: Math.floor(i / 4) * 195 + 10,
}));

const ShapeEl: React.FC<{ shape: ShapeKind; size: number; color: string }> = ({ shape, size, color }) => {
  if (shape === "circle")
    return <div style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${color}` }} />;
  if (shape === "square")
    return <div style={{ width: size, height: size, border: `2px solid ${color}` }} />;
  if (shape === "triangle")
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <polygon points="20,4 37,35 3,35" fill="none" stroke={color} strokeWidth="2" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const EXIT_DIR: Direction = "right";
  const EXIT_F2 = 45;

  const SHAPE_COLORS = [
    "rgba(255,255,255,0.95)",
    "rgba(255,255,255,0.65)",
    "rgba(255,255,255,0.45)",
    "rgba(255,255,255,0.80)",
  ];

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.035)" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingTop: PAD_TOP + 20,
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
          paddingBottom: PAD_BOTTOM,
        }}
      >
        {/* Texto atrasa 15f para sincronizar com narrador dizendo "organizar o seu conhecimento" */}
        <div
          style={{
            fontSize: 60,
            fontFamily: FONT,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.1,
            marginBottom: 30,
            ...mergeStyles(
              entryFrom(Math.max(frame - 15, 0), "left", 64, 18),
              exitToNB(frame, EXIT_F2, EXIT_DIR)
            ),
          }}
        >
          Organizar o seu conhecimento.
        </div>

        <div style={{ position: "relative", height: 820, width: SAFE_W }}>
          {SHAPES_BY_TYPE.map((shape, i) => {
            const morphProg = ci(frame, [10, 50], [0, 1], Easing.inOut(Easing.cubic));
            const x = INIT_POS_C2[i].x + (FINAL_POS_C2[i].x - INIT_POS_C2[i].x) * morphProg;
            const y = INIT_POS_C2[i].y + (FINAL_POS_C2[i].y - INIT_POS_C2[i].y) * morphProg;
            const entryOp = ci(frame, [15 + i * 0.3, 27 + i * 0.3], [0, 1]);
            const exitX   = ci(frame, [EXIT_F2, EXIT_F2 + 18], [0, 1200], Easing.in(Easing.exp));
            const exitOp  = ci(frame, [EXIT_F2 + 6, EXIT_F2 + 18], [1, 0]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x + exitX,
                  top: y,
                  opacity: entryOp * exitOp,
                }}
              >
                <ShapeEl shape={shape} size={44} color={SHAPE_COLORS[i % 4]} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── CENA 3 - CELULAR + TAGS VERTICAIS ───────────────────────────────────────
// dur=125f | EXIT_F=105
// Titulo + celular com mic + "Método" centralizado grande + outros abaixo

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const EXIT_DIR: Direction = "bottom";
  const EXIT_F3 = 99;

  const TAGS_SECONDARY = ["Conteúdo Programático", "Aulas", "Estrutura Completa", "Precificação"];

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.05)" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: PAD_TOP + 16,
          paddingBottom: PAD_BOTTOM,
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
        }}
      >
        {/* Titulo */}
        <div
          style={{
            fontSize: 34,
            fontFamily: FONT,
            fontWeight: 600,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.35,
            marginBottom: 28,
            ...mergeStyles(
              entryFrom(frame, "top", 48, 18),
              exitToNB(frame, EXIT_F3, EXIT_DIR)
            ),
          }}
        >
          O agente te ouve e organiza seu conhecimento e estrutura sua mentoria.
        </div>

        {/* Phone frame */}
        <div
          style={{
            ...mergeStyles(
              entryFrom(Math.max(frame - 12, 0), "bottom", 100, 24),
              exitTo(frame, EXIT_F3, EXIT_DIR)
            ),
            position: "relative",
            width: 280,
            height: 420,
            background: "#0a0a0a",
            borderRadius: 38,
            border: "2px solid rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 90,
              height: 22,
              background: "#000",
              borderRadius: 11,
              zIndex: 3,
            }}
          />
          {/* Ondas de audio */}
          {[0, 1, 2, 3].map((w) => {
            const progress = ((frame * 0.038 + w * 0.25) % 1);
            const radius   = 48 + progress * 120;
            const wOp      = (1 - progress) * 0.35;
            return (
              <div
                key={w}
                style={{
                  position: "absolute",
                  width: radius * 2,
                  height: radius * 2,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(255,255,255,0.7)",
                  opacity: wOp,
                  pointerEvents: "none",
                }}
              />
            );
          })}
          {/* Botao mic */}
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              boxShadow: "0 0 36px rgba(255,255,255,0.22)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
              <rect x="15" y="3" width="14" height="24" rx="7" fill="#000" />
              <path d="M7 22c0 8.284 6.716 15 15 15s15-6.716 15-15" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="22" y1="37" x2="22" y2="42" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="14" y1="42" x2="30" y2="42" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* "Método" - centralizado, destaque */}
        {frame >= 30 && (
          <div
            style={{
              ...mergeStyles(
                entryFrom(Math.max(frame - 30, 0), "bottom", 40, 18),
                exitTo(frame, EXIT_F3, EXIT_DIR)
              ),
              marginTop: 24,
              fontSize: 44,
              fontFamily: FONT,
              fontWeight: 800,
              color: "#FFFFFF",
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            Método
          </div>
        )}

        {/* Tags secundárias - uma abaixo da outra, stagger */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
          }}
        >
          {TAGS_SECONDARY.map((tag, ti) => {
            const delay = 44 + ti * 12;
            const f = Math.max(frame - delay, 0);
            const notStarted = frame < delay;
            return (
              <div
                key={ti}
                style={{
                  ...mergeStyles(
                    notStarted ? { opacity: 0 } : entryFrom(f, "bottom", 28, 16),
                    exitTo(frame, EXIT_F3, EXIT_DIR)
                  ),
                  padding: "8px 24px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 100,
                  fontSize: 20,
                  fontFamily: FONT,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.75)",
                  background: "rgba(255,255,255,0.05)",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {tag}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── CENA 4 - TIMER + MICROFONE ──────────────────────────────────────────────
// dur=150f | EXIT_F=128
// "Em apenas 8 minutos" ESTATICO + "A estrutura da sua mentoria fica pronta" ESTATICO
// Silhueta de microfone com timer animado dentro

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const EXIT_DIR: Direction = "left";
  const EXIT_F4 = 119;

  const totalSec = Math.floor(ci(frame, [18, 120], [0, 480]));
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.035)" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: PAD_TOP + 50,
          paddingBottom: PAD_BOTTOM,
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
        }}
      >
        {/* ESTATICO 1 */}
        <div
          style={{
            fontSize: 50,
            fontFamily: FONT,
            fontWeight: 700,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 14,
            ...mergeStyles(
              entryFrom(frame, "top", 40, 26),
              exitTo(frame, EXIT_F4, EXIT_DIR)
            ),
          }}
        >
          Em apenas 8 minutos
        </div>

        {/* ESTATICO 2 */}
        <div
          style={{
            fontSize: 32,
            fontFamily: FONT,
            fontWeight: 400,
            color: "#8E8E93",
            textAlign: "center",
            marginBottom: 44,
            ...mergeStyles(
              entryFrom(Math.max(frame - 8, 0), "top", 36, 26),
              exitTo(frame, EXIT_F4, EXIT_DIR)
            ),
          }}
        >
          A estrutura da sua mentoria fica pronta
        </div>

        {/* Microfone + timer dentro */}
        <div
          style={{
            ...mergeStyles(
              { opacity: ci(frame, [12, 28], [0, 1]) },
              exitTo(frame, EXIT_F4, EXIT_DIR)
            ),
            position: "relative",
            width: 280,
            height: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG microfone silhueta */}
          <svg
            width="280"
            height="420"
            viewBox="0 0 280 420"
            fill="none"
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Corpo do mic */}
            <rect
              x="90" y="18"
              width="100" height="180"
              rx="50"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2.5"
            />
            {/* Arco */}
            <path
              d="M48 188 C 48 268, 232 268, 232 188"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Haste */}
            <line
              x1="140" y1="268" x2="140" y2="318"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Base */}
            <line
              x1="90" y1="318" x2="190" y2="318"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Timer posicionado dentro do corpo do mic */}
          <div
            style={{
              position: "absolute",
              top: 72,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 58,
                fontFamily: "SF Mono, Menlo, Courier New, monospace",
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              {mm}:{ss}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── CENA 5 - TEXTO AGRESSIVO ─────────────────────────────────────────────────
// dur=255f | EXIT_F=229 | REVEAL_DELAY=3 (C5 em 600f=20.0s, narrador em 20.10s)

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const EXIT_DIR: Direction = "top";
  const EXIT_F5 = 229;

  // REVEAL_DELAY5=3: palavras começam 3f dentro de C5 (abs 603=20.1s) — sync exato com narrador
  const REVEAL_DELAY5 = 3;

  const words = [
    "Um", "agente", "de", "inteligência", "artificial", "que", "te", "ouve,",
    "entende", "a", "sua", "história", "e", "organiza", "o", "seu", "conhecimento",
    "em", "uma",
  ];
  const lastWord = "mentoria.";

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.035)" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingTop: PAD_TOP + 50,
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
          paddingBottom: PAD_BOTTOM,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 12px", rowGap: "10px" }}>
          {words.map((word, wi) => {
            const f = Math.max(frame - REVEAL_DELAY5 - wi * 2, 0);
            const notStarted = frame < REVEAL_DELAY5 + wi * 2;
            return (
              <div
                key={wi}
                style={{
                  fontSize: 52,
                  fontFamily: FONT,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  lineHeight: 1.2,
                  ...mergeStyles(
                    notStarted ? { opacity: 0, transform: "translateY(20px)" } : entryFrom(f, "bottom", 30, 16),
                    exitToNB(frame, EXIT_F5, EXIT_DIR)
                  ),
                }}
              >
                {word}
              </div>
            );
          })}
          {/* "mentoria" destacada */}
          {(() => {
            const wi = words.length;
            const f = Math.max(frame - REVEAL_DELAY5 - wi * 2, 0);
            const notStarted = frame < REVEAL_DELAY5 + wi * 2;
            return (
              <div
                key="mentoria"
                style={{
                  fontSize: 60,
                  fontFamily: FONT,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  lineHeight: 1.2,
                  position: "relative",
                  ...mergeStyles(
                    notStarted ? { opacity: 0, transform: "translateY(20px)" } : entryFrom(f, "bottom", 40, 20),
                    exitToNB(frame, EXIT_F5, EXIT_DIR)
                  ),
                }}
              >
                {lastWord}
                <div
                  style={{
                    position: "absolute",
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "rgba(255,255,255,0.6)",
                    borderRadius: 2,
                    opacity: ci(frame, [wi * 2 + 8, wi * 2 + 20], [0, 1]),
                  }}
                />
              </div>
            );
          })()}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── CENA 6 - CHECKOUT ───────────────────────────────────────────────────────
// dur=210f | EXIT_F=185 | from=852 (cascade +45f de C2 + dur +15f para preço ficar mais tempo)

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const EXIT_DIR: Direction = "right";
  const EXIT_F6 = 210;

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.04)" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: PAD_TOP + 40,
          paddingBottom: PAD_BOTTOM,
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontFamily: FONT,
            fontWeight: 500,
            color: "#8E8E93",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: 24,
            ...mergeStyles(
              entryFrom(frame, "top", 28, 14),
              exitTo(frame, EXIT_F6, EXIT_DIR)
            ),
          }}
        >
          Resumo do pedido
        </div>

        <div
          style={{
            ...mergeStyles(
              entryFrom(Math.max(frame - 6, 0), "bottom", 100, 26),
              exitTo(frame, EXIT_F6, EXIT_DIR)
            ),
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 28,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "28px 36px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
                <rect x="15" y="3" width="14" height="24" rx="7" fill="#000" />
                <path d="M7 22c0 8.284 6.716 15 15 15s15-6.716 15-15" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 28, fontFamily: FONT, fontWeight: 700, color: "#FFFFFF" }}>
                Agente Arquiteto
              </div>
              <div style={{ fontSize: 18, fontFamily: FONT, color: "#8E8E93" }}>
                Acesso imediato
              </div>
            </div>
          </div>

          {/* Corpo - preço centralizado, R$8,05 em destaque */}
          <div
            style={{
              padding: "32px 36px 44px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Preço aparece mais cedo para sincronizar com narrador dizendo "por apenas 12x de 8,05" */}
            <div
              style={{
                fontSize: 20,
                fontFamily: FONT,
                color: "#8E8E93",
                textAlign: "center",
                marginBottom: 4,
                opacity: ci(frame, [2, 14], [0, 1]),
              }}
            >
              Por apenas
            </div>

            <div
              style={{
                fontSize: 24,
                fontFamily: FONT,
                fontWeight: 500,
                color: "#8E8E93",
                textAlign: "center",
                marginBottom: 6,
                opacity: ci(frame, [4, 16], [0, 1]),
              }}
            >
              12x de
            </div>

            <div
              style={{
                fontSize: 96,
                fontFamily: FONT,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                textAlign: "center",
                marginBottom: 22,
                opacity: ci(frame, [6, 18], [0, 1]),
              }}
            >
              R$8,05
            </div>

            <div
              style={{
                height: 1,
                width: "100%",
                background: "rgba(255,255,255,0.1)",
                marginBottom: 18,
                opacity: ci(frame, [10, 22], [0, 1]),
              }}
            />

            <div
              style={{
                fontSize: 22,
                fontFamily: FONT,
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
                opacity: ci(frame, [14, 24], [0, 1]),
              }}
            >
              ou R$67 à vista
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── CENA 7 - TICKET BONUS ───────────────────────────────────────────────────
// dur=200f | EXIT_F=178

const AnimatedCrown: React.FC<{ frame: number }> = ({ frame }) => {
  const rotate = Math.sin(frame * 0.08) * 8;
  const scale  = 1 + 0.06 * Math.sin(frame * 0.12);
  return (
    <svg
      width="72" height="72" viewBox="0 0 72 72" fill="none"
      style={{ transform: `rotate(${rotate}deg) scale(${scale})` }}
    >
      <path
        d="M10 50 L10 28 L22 40 L36 14 L50 40 L62 28 L62 50 Z"
        fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round"
      />
      <rect x="8" y="50" width="56" height="9" rx="3" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
      <circle cx="10" cy="28" r="3.5" fill="rgba(255,255,255,0.9)" />
      <circle cx="36" cy="14" r="3.5" fill="rgba(255,255,255,0.9)" />
      <circle cx="62" cy="28" r="3.5" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
};

const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const EXIT_DIR: Direction = "top";
  const EXIT_F7 = 168;

  const cardY  = ci(frame, [0, 32], [-580, 0], Easing.out(Easing.cubic));
  const cardOp = ci(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.05)" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: PAD_TOP + 50,
          paddingBottom: PAD_BOTTOM,
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
        }}
      >
        <div
          style={{
            opacity: cardOp,
            transform: `translateY(${cardY}px)`,
            width: "100%",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 28,
              overflow: "visible",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 3,
                borderRadius: 25,
                border: "2px dashed rgba(255,255,255,0.2)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: -18,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#000000",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -18,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#000000",
              }}
            />
            <div
              style={{
                padding: "40px 48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              <AnimatedCrown frame={frame} />

              <div
                style={{
                  fontSize: 14,
                  fontFamily: FONT,
                  fontWeight: 600,
                  color: "#8E8E93",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                Bonus Exclusivo
              </div>

              <div
                style={{
                  fontSize: 34,
                  fontFamily: FONT,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  textAlign: "center",
                  lineHeight: 1.3,
                  opacity: ci(frame, [12, 28], [0, 1]),
                }}
              >
                Comprando hoje você ganha uma consultoria individual
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontFamily: FONT,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "center",
                  lineHeight: 1.5,
                  opacity: ci(frame, [20, 36], [0, 1]),
                }}
              >
                para receber um plano personalizado
              </div>

              <div
                style={{
                  width: "100%",
                  height: 1,
                  background: "rgba(255,255,255,0.1)",
                  opacity: ci(frame, [24, 38], [0, 1]),
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: ci(frame, [26, 42], [0, 1]),
                }}
              >
                <div style={{ fontSize: 18, fontFamily: FONT, color: "#8E8E93" }}>Valor:</div>
                <div
                  style={{
                    fontSize: 24,
                    fontFamily: FONT,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.35)",
                    textDecoration: "line-through",
                  }}
                >
                  R$497
                </div>
                <div style={{ fontSize: 26, fontFamily: FONT, fontWeight: 700, color: "#FFFFFF" }}>
                  GRÁTIS
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── DEDO ANIMADO (aponta para cima, leve e discreto) ────────────────────────

const AnimatedFinger: React.FC<{ frame: number }> = ({ frame }) => {
  const bounceY = Math.sin(frame * 0.18) * 7;
  const op = 0.45 + 0.18 * Math.sin(frame * 0.14);
  return (
    <div
      style={{
        transform: `translateY(${bounceY}px)`,
        opacity: op,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg width="28" height="58" viewBox="0 0 28 58" fill="none">
        {/* Dedo apontando para cima — forma simples */}
        <rect x="4" y="2" width="20" height="54" rx="10" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
        {/* Junta superior */}
        <line x1="5" y1="18" x2="23" y2="18" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4" strokeLinecap="round" />
        {/* Junta inferior */}
        <line x1="5" y1="34" x2="23" y2="34" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ─── CENA 8 - TELA FINAL ─────────────────────────────────────────────────────
// dur=215f | sem saida

const Scene8: React.FC = () => {
  const frame = useCurrentFrame();

  const titleY = ci(frame, [0, 32], [-60, 0], Easing.out(Easing.cubic));
  const btnY   = ci(Math.max(frame - 12, 0), [0, 28], [80, 0], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.06)" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: PAD_TOP + 120,
          paddingBottom: PAD_BOTTOM,
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
        }}
      >
        {/* Logo icon */}
        <div
          style={{
            opacity: ci(frame, [0, 18], [0, 1]),
            transform: `scale(${0.8 + 0.2 * ci(frame, [0, 18], [0, 1])})`,
            marginBottom: 36,
          }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="1" y="1" width="62" height="62" rx="18" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <rect x="19" y="10" width="11" height="22" rx="5.5" fill="white" opacity="0.9" />
            <path d="M8 31c0 13.255 10.745 24 24 24s24-10.745 24-24" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
            <line x1="32" y1="55" x2="32" y2="62" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
          </svg>
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: ci(frame, [0, 20], [0, 1]),
            transform: `translateY(${titleY}px)`,
            fontSize: 60,
            fontFamily: FONT,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Conheça o Agente Arquiteto
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 26,
            fontFamily: FONT,
            fontWeight: 400,
            color: "#8E8E93",
            textAlign: "center",
            marginBottom: 56,
            opacity: ci(frame, [8, 24], [0, 1]),
          }}
        >
          Sua mentoria estruturada em 8 minutos.
        </div>

        {/* Botao */}
        <div
          style={{
            opacity: ci(frame, [12, 30], [0, 1]),
            transform: `translateY(${btnY}px)`,
            background: "#FFFFFF",
            borderRadius: 22,
            padding: "28px 0",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 0 48px rgba(255,255,255,0.18)",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontFamily: FONT,
              fontWeight: 700,
              color: "#000000",
              letterSpacing: "0.01em",
            }}
          >
            Saiba mais
          </div>
        </div>

        {/* Dedo apontando para o botão */}
        <div
          style={{
            marginTop: 16,
            opacity: ci(frame, [22, 40], [0, 1]),
          }}
        >
          <AnimatedFinger frame={frame} />
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── COMPOSICAO PRINCIPAL ─────────────────────────────────────────────────────
//
// C0 from=0    dur=120  (ends 120)            ChatGPT intro
// C1 from=110  dur=182  (ends 292,  10f ovlp) Lista numerada
// C2 from=282  dur=75   (ends 357,   7f ovlp) Formas caos->linhas  [EXIT=45]
// C3 from=350  dur=125  (ends 475,  10f ovlp) Celular + tags        [EXIT=99]
// C4 from=465  dur=145  (ends 610,  10f ovlp)  Timer + microfone  [EXIT=119]
// C5 from=600  dur=255  (ends 855,  10f ovlp)  Texto agressivo    [REVEAL=3, EXIT=229]
// C6 from=845  dur=240  (ends 1085, 10f ovlp)  Checkout           [EXIT=210]
// C7 from=1075 dur=200  (ends 1275, 10f ovlp)  Ticket bonus       [EXIT=168]
// C8 from=1265 dur=122  (ends 1387, 10f ovlp)  Tela final
// Total: 1387 frames = 46.23s

const SCENE_TIMING: [number, number, React.FC][] = [
  [0,    120, SceneChatGPT],  // C0: 0.00s–4.00s  | EXIT@100f=3.33s
  [110,  182, Scene1],         // C1: 3.67s–9.73s  | EXIT@161f→abs 271=9.03s
  [282,   75, Scene2],         // C2: 9.40s–11.9s  | EXIT@45f→abs 327=10.9s
  [350,  125, Scene3],         // C3: 11.67s–15.83s| EXIT@99f→abs 449=14.97s
  [465,  145, Scene4],         // C4: 15.5s–20.33s | EXIT@119f→abs 584=19.47s
  [600,  255, Scene5],         // C5: 20.0s–28.5s  | EXIT@229f→abs 829=27.63s [REVEAL=3]
  [845,  240, Scene6],         // C6: 28.17s–36.5s | EXIT@210f→abs 1055=35.17s
  [1075, 200, Scene7],         // C7: 35.83s–42.5s | EXIT@168f→abs 1243=41.43s
  [1265, 122, Scene8],         // C8: 42.17s–46.23s| ends=1387
];

export const AgenteArquiteto: React.FC = () => (
  <AbsoluteFill style={{ background: "#000000" }}>
    {SCENE_TIMING.map(([from, dur, SceneComp], i) => (
      <Sequence key={i} from={from} durationInFrames={dur}>
        <SceneComp />
      </Sequence>
    ))}
  </AbsoluteFill>
);
