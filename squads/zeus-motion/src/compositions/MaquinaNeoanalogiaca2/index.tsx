import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const BG    = "#050505";
const WHITE = "#F2F2F2";
const ROSE1 = "#FF2D78";   // rosa quente / iOS pink — acento principal
const ROSE2 = "#FF85B3";   // blush claro — para gradientes
const DARK2 = "#1A1A1A";
const FONT  = `"SF Pro Display", "Inter", -apple-system, "Helvetica Neue", sans-serif`;
const MONO  = `"Space Mono", "Courier New", monospace`;
const SAFE_X = 80;

// ─── SPRING CONFIGS ───────────────────────────────────────────────────────────
const SPRING_PUNCH  = { damping: 24, stiffness: 220, mass: 0.7 };
const SPRING_TEXT   = { damping: 16, stiffness: 130, mass: 0.8 };
const SPRING_COLOS  = { damping: 12, mass: 1.4, stiffness: 90 };
const SPRING_SNAP   = { damping: 14, stiffness: 260, mass: 0.7 };

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const ci = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing?: (t: number) => number
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const entryFrom = (
  frame: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 80,
  dur = 20
): React.CSSProperties => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  return {
    opacity:   ci(frame, [0, Math.round(dur * 0.6)], [0, 1]),
    transform: `translate${axis}(${ci(frame, [0, dur], [distance * sign, 0], Easing.out(Easing.cubic))}px)`,
    filter:    `blur(${ci(frame, [0, Math.round(dur * 0.45)], [10, 0], Easing.out(Easing.quad))}px)`,
    willChange: "transform, opacity, filter",
  };
};

const exitTo = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 1100,
  dur = 16
): React.CSSProperties => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const f = frame - start;
  return {
    opacity:   ci(f, [dur * 0.35, dur], [1, 0]),
    transform: `translate${axis}(${ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp))}px) scale(${ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp))})`,
    filter:    `blur(${ci(f, [0, dur], [0, 18], Easing.in(Easing.cubic))}px)`,
  };
};

const exitScaleOut = (frame: number, start: number, dur = 18): React.CSSProperties => {
  const f = frame - start;
  return {
    opacity:   ci(f, [dur * 0.3, dur], [1, 0]),
    transform: `scale(${ci(f, [0, dur], [1, 0.72], Easing.in(Easing.cubic))})`,
    filter:    `blur(${ci(f, [0, dur], [0, 12], Easing.in(Easing.cubic))}px)`,
  };
};

// ─── BACKGROUND ───────────────────────────────────────────────────────────────
const Background: React.FC<{ glow?: string }> = ({ glow = "transparent" }) => (
  <>
    <AbsoluteFill style={{ background: BG }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 45% at 50% 30%, ${glow} 0%, transparent 68%)` }} />
    <AbsoluteFill style={{ opacity: 0.07 }}>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="bg-grid2" width="54" height="54" patternUnits="userSpaceOnUse">
            <path d="M54 0L0 0 0 54" fill="none" stroke={WHITE} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid2)" />
      </svg>
    </AbsoluteFill>
    <AbsoluteFill style={{ opacity: 0.035, mixBlendMode: "overlay" as const }}>
      <svg width="100%" height="100%">
        <filter id="bg-grain2">
          <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bg-grain2)" />
      </svg>
    </AbsoluteFill>
  </>
);

// ─── CHROMATIC ABERRATION ─────────────────────────────────────────────────────
const ChromaAberration: React.FC<{ intensity: number }> = ({ intensity }) => {
  if (intensity < 0.001) return null;
  const px = intensity * 22;
  return (
    <>
      <AbsoluteFill style={{ mixBlendMode: "screen" as const, opacity: intensity * 0.35, transform: `translateX(-${px}px)`, background: "linear-gradient(90deg, rgba(255,59,48,0.22) 0%, transparent 45%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ mixBlendMode: "screen" as const, opacity: intensity * 0.35, transform: `translateX(${px}px)`, background: "linear-gradient(270deg, rgba(0,122,255,0.22) 0%, transparent 45%)", pointerEvents: "none" }} />
    </>
  );
};

// ─── WORD BY WORD ─────────────────────────────────────────────────────────────
type WordHL = { color: string; shadow?: string };
const WordByWord: React.FC<{
  text: string;
  startFrame: number;
  stagger?: number;
  style?: React.CSSProperties;
  highlights?: Record<string, WordHL>; // chave = palavra em minúsculas sem pontuação
}> = ({ text, startFrame, stagger = 3, style = {}, highlights = {} }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 10px", ...style }}>
      {words.map((w, i) => {
        const f = Math.max(0, frame - startFrame - i * stagger);
        const op = ci(f, [0, 10], [0, 1]);
        const tx = ci(f, [0, 14], [18, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 10], [8, 0], Easing.out(Easing.quad));
        const key = w.replace(/[.,!?;:]/g, "").toLowerCase();
        const hl = highlights[key];
        return (
          <span key={i} style={{
            opacity: op,
            transform: `translateX(${tx}px)`,
            filter: `blur(${blur}px)`,
            display: "inline-block",
            color:      hl ? hl.color   : undefined,
            textShadow: hl ? hl.shadow  : undefined,
          }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ─── SCENE 1 ─ "Você acha…" cursor blink, WordByWord, exit LEFT (from=0, 170f, exitAt=148) ──
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const isExiting = frame >= 148;
  const exitStyle = isExiting ? exitTo(frame, 148, "left", 1200, 16) : {};
  const cursorBlink = Math.floor(frame / 14) % 2 === 0;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <div style={{ fontSize: 34, fontFamily: FONT, fontWeight: 400, color: `rgba(242,242,242,0.45)`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 40, ...entryFrom(frame, "top", 40, 18) }}>
        O MITO
      </div>
      <WordByWord
        text="Você acha que a sua mentoria não saiu do papel porque você não grava conteúdo?"
        startFrame={22}
        stagger={7}
        style={{ fontSize: 52, fontFamily: FONT, fontWeight: 600, color: WHITE, lineHeight: 1.3, textAlign: "center", letterSpacing: -1 }}
        highlights={{
          "mentoria": {
            color:  ROSE1,
            shadow: `0 0 18px ${ROSE1}cc, 0 0 42px ${ROSE1}66, 0 0 80px ${ROSE1}33`,
          },
        }}
      />
      <span style={{ fontSize: 48, fontFamily: MONO, color: ROSE1, marginTop: 32, opacity: cursorBlink ? 1 : 0, textShadow: `0 0 20px ${ROSE1}99` }}>|</span>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 ─ "MENTIRA." colossal ROSE, chroma, grid pulse, exit DOWN (from=158, 70f, exitAt=48) ──
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const isExiting = frame >= 48;
  const exitStyle = isExiting ? exitTo(frame, 48, "bottom", 1300, 17) : {};

  const colossalScale = ci(frame, [0, 28], [1.4, 1.0], Easing.out(Easing.exp));
  const colossalOp = ci(frame, [0, 10], [0, 1]);
  const colossalBlur = ci(frame, [0, 16], [30, 0], Easing.out(Easing.quad));
  const chromaIntensity = ci(frame, [0, 12], [1, 0], Easing.out(Easing.cubic));
  const glowPulse = 1 + Math.sin(frame * 0.14) * 0.08;

  return (
    <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center", ...exitStyle }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,45,120,${0.12 * glowPulse}) 0%, transparent 65%)` }} />
      <div style={{
        opacity: colossalOp,
        transform: `scale(${colossalScale})`,
        filter: `blur(${colossalBlur}px)`,
        fontSize: 188,
        fontFamily: FONT,
        fontWeight: 900,
        color: ROSE1,
        letterSpacing: -8,
        textAlign: "center",
        lineHeight: 1,
        willChange: "transform, opacity, filter",
        textShadow: `0 0 50px ${ROSE1}cc, 0 0 100px ${ROSE1}77, 0 0 200px ${ROSE1}33`,
      }}>
        MENTIRA.
      </div>
      <ChromaAberration intensity={chromaIntensity} />
    </AbsoluteFill>
  );
};

// ─── SCENE 3 ─ ROSE X checklist 3 itens, borda rosa, exit RIGHT (from=215, 310f, exitAt=290) ──
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const isExiting = frame >= 290;
  const exitStyle = isExiting ? exitTo(frame, 290, "right", 1200, 16) : {};

  const items = [
    "Gravar conteúdo todo dia",
    "Ter muitos seguidores",
    "Ser famoso nas redes sociais",
  ];

  const subStyle = entryFrom(frame, "top", 60, 18);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      {/* "VOCÊ NÃO PRECISA" em rosa, centralizado */}
      <div style={{
        fontSize: 32, fontFamily: FONT, fontWeight: 700,
        color: ROSE1, letterSpacing: 3, textTransform: "uppercase",
        textAlign: "center",
        textShadow: `0 0 20px ${ROSE1}88`,
        marginBottom: 48,
        ...subStyle,
      }}>
        VOCÊ NÃO PRECISA
      </div>
      {items.map((item, i) => {
        const itemStarts = [8, 148, 222];
        const itemStart = itemStarts[i];
        const f = Math.max(0, frame - itemStart);
        const textOp = ci(f, [0, 16], [0, 1]);
        const xOp = ci(Math.max(0, f - 42), [0, 10], [0, 1]);
        const cardOp = ci(f, [0, 12], [0, 1]);
        const ty = ci(f, [0, 18], [30, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 12], [8, 0]);
        const fs = Math.max(0, f - 22);
        const strikeScale = ci(fs, [0, 20], [0, 1], Easing.out(Easing.cubic));
        // borda do card: sutil até o X aparecer, fica rosa quando risca
        const borderAlpha = Math.round(ci(f, [22, 60], [0.18, 0.38]) * 255).toString(16).padStart(2, "0");
        return (
          <div key={i} style={{
            opacity: cardOp,
            transform: `translateY(${ty}px)`,
            filter: `blur(${blur}px)`,
            marginBottom: 20,
            width: "100%",
          }}>
            {/* Retângulo rosa em volta do item */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
              border: `1.5px solid ${ROSE1}${borderAlpha}`,
              borderRadius: 14,
              padding: "18px 28px",
              background: `rgba(255,45,120,0.04)`,
              boxShadow: `0 0 0 1px ${ROSE1}18, inset 0 0 20px ${ROSE1}06`,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Ícone X em rosa */}
              <div style={{ opacity: xOp, flexShrink: 0 }}>
                <svg width="42" height="42" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="20" stroke={ROSE1} strokeWidth="1.8" fill={`${ROSE1}12`} />
                  <line x1="13" y1="13" x2="31" y2="31" stroke={ROSE1} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="31" y1="13" x2="13" y2="31" stroke={ROSE1} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              {/* Texto + risco */}
              <div style={{ position: "relative", textAlign: "center" }}>
                <span style={{ fontSize: 44, fontFamily: FONT, fontWeight: 600, color: `rgba(242,242,242,0.75)`, letterSpacing: -1, display: "block", opacity: textOp }}>
                  {item}
                </span>
                <div style={{
                  position: "absolute", left: 0, top: "50%",
                  height: "2.5px", width: "100%",
                  background: `linear-gradient(90deg, ${ROSE1}cc, ${ROSE2}aa)`,
                  transform: `scaleX(${strikeScale})`,
                  transformOrigin: "left center",
                  borderRadius: "2px",
                  boxShadow: `0 0 8px ${ROSE1}88`,
                }} />
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCENE 4 ─ 3 ROSE-border cards, exit TOP (from=505, 290f, exitAt=268) ──────
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const isExiting = frame >= 268;
  const exitStyle = isExiting ? exitTo(frame, 268, "top", 1200, 16) : {};

  const subStyle = entryFrom(frame, "left", 80, 18);

  const funnelSections = [
    { label: "FUNIL",  delay: 15 },
    { label: "PÁGINA", delay: 68 },
    { label: "OFERTA", delay: 128 },
  ];

  // Polígonos do funil: cada seção fica mais estreita de cima para baixo
  const funnelPolygons = [
    [[0, 0],    [700, 0],   [620, 155], [80, 155]],
    [[80, 175], [620, 175], [510, 330], [190, 330]],
    [[190, 350],[510, 350], [430, 505], [270, 505]],
  ];

  // Centro vertical de cada seção (para posicionar o label)
  const funnelLabelTopPx = [57, 232, 407];

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <div style={{ fontSize: 32, fontFamily: FONT, fontWeight: 400, color: `rgba(242,242,242,0.45)`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 52, ...subStyle }}>
        O QUE VOCÊ PRECISA
      </div>
      <div style={{ position: "relative", width: 700, height: 520 }}>
        <svg width="700" height="520" viewBox="0 0 700 520" style={{ position: "absolute", top: 0, left: 0 }}>
          {funnelPolygons.map((pts, i) => {
            const f = Math.max(0, frame - funnelSections[i].delay);
            const op = ci(f, [0, 18], [0, 1]);
            const glowPulse = f > 20 ? Math.sin(f * 0.09 + i) * 0.5 + 0.5 : 0;
            const pointsStr = pts.map(([x, y]) => `${x},${y}`).join(" ");
            return (
              <g key={i} style={{ opacity: op }}>
                <polygon
                  points={pointsStr}
                  fill={`rgba(255,45,120,${0.05 + glowPulse * 0.04})`}
                  stroke={`rgba(255,45,120,${0.65 + glowPulse * 0.25})`}
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
        {funnelSections.map((sec, i) => {
          const f = Math.max(0, frame - sec.delay);
          const op = ci(f, [0, 18], [0, 1]);
          const ty = ci(f, [0, 22], [18, 0], Easing.out(Easing.cubic));
          return (
            <div key={i} style={{
              position: "absolute",
              top: funnelLabelTopPx[i],
              left: 0, right: 0,
              display: "flex", justifyContent: "center", alignItems: "center",
              opacity: op,
              transform: `translateY(${ty}px)`,
            }}>
              <span style={{ fontSize: 40, fontFamily: FONT, fontWeight: 700, color: WHITE, letterSpacing: 3, textTransform: "uppercase" }}>
                {sec.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 ─ R$1 CountUp 198px, SCALE OUT (from=775, 250f, exitAt=228) ──────
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const isExiting = frame >= 228;
  const exitStyle = isExiting ? exitScaleOut(frame, 228, 18) : {};

  const countValue = ci(frame, [15, 200], [0, 1], Easing.out(Easing.cubic));
  const countOp = ci(frame, [15, 25], [0, 1]);
  const chromaIntensity = ci(frame, [8, 20], [0.9, 0], Easing.out(Easing.cubic));

  const sub1Style = entryFrom(frame, "left", 100, 20);
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 65% 40% at 50% 50%, rgba(255,45,120,0.08) 0%, transparent 65%)` }} />
      <div style={{ fontSize: 52, fontFamily: FONT, fontWeight: 800, color: WHITE, textAlign: "center", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, ...sub1Style }}>
        LEADS POR
      </div>
      <div style={{
        opacity: countOp,
        fontSize: 198, fontFamily: FONT, fontWeight: 900, color: ROSE1,
        letterSpacing: -10, lineHeight: 0.85, textAlign: "center",
        willChange: "transform, opacity",
        textShadow: `0 0 60px ${ROSE1}cc, 0 0 120px ${ROSE1}66, 0 0 220px ${ROSE1}22`,
      }}>
        R$&nbsp;{countValue.toFixed(2).replace(".", ",")}
      </div>
      <ChromaAberration intensity={chromaIntensity} />
    </AbsoluteFill>
  );
};

// ─── SCENE 6 ─ "21 DIAS" spring + progress bar, exit LEFT (from=1000, 370f, exitAt=348) ──
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isExiting = frame >= 348;
  const exitStyle = isExiting ? exitTo(frame, 348, "left", 1200, 16) : {};

  const diasScale = spring({ frame, fps, config: SPRING_SNAP, from: 3, to: 1 });
  const diasOp = ci(frame, [0, 10], [0, 1]);
  const diasBlur = ci(frame, [0, 16], [40, 0], Easing.out(Easing.cubic));

  // STOPS = centros exatos de cada label com flex:1 (5 labels = 20% cada → centros: 10,30,50,70,90)
  // Garante que a bolinha SEMPRE para no centro visual da palavra, independente do tamanho do texto
  const STOPS = [10, 30, 50, 70, 90] as const;

  // Bolinha — EXTREME AE EASE: bezier(0.87, 0, 0.13, 1)
  // Sync com full-v2.mp3 — S6 começa em global 1000 (33.33s)
  // "funil"    falado em 39.76s → local 193f
  // "página"   falado em 41.10s → local 233f
  // "oferta"   falado em 41.96s → local 259f
  // "anúncios" falado em 43.02s → local 291f
  // Bola chega em cada milestone EXATAMENTE quando a palavra é falada (travel 18f cada)
  const getMilestoneProgress = (): number => {
    const extremeAE = Easing.bezier(0.87, 0, 0.13, 1);
    const travel = (f: number, f0: number, f1: number, v0: number, v1: number): number => {
      const t = extremeAE(Math.max(0, Math.min(1, (f - f0) / (f1 - f0))));
      return v0 + (v1 - v0) * t;
    };
    if (frame < 175) return STOPS[0];                                   // segura em BRIEFING (10%)
    if (frame < 193) return travel(frame, 175, 193, STOPS[0], STOPS[1]); // viaja → FUNIL (18f) — chega em "funil"
    if (frame < 215) return STOPS[1];                                   // segura em FUNIL (30%)
    if (frame < 233) return travel(frame, 215, 233, STOPS[1], STOPS[2]); // viaja → PÁGINA (18f) — chega em "página"
    if (frame < 241) return STOPS[2];                                   // segura em PÁGINA (50%)
    if (frame < 259) return travel(frame, 241, 259, STOPS[2], STOPS[3]); // viaja → OFERTA (18f) — chega em "oferta"
    if (frame < 273) return STOPS[3];                                   // segura em OFERTA (70%)
    if (frame < 291) return travel(frame, 273, 291, STOPS[3], STOPS[4]); // viaja → ATIVO (18f) — chega em "anúncios"
    return STOPS[4];                                                    // segura em ATIVO (90%)
  };
  const progressWidth = getMilestoneProgress();
  const progressOp = ci(frame, [18, 28], [0, 1]);

  const subStyle = entryFrom(frame, "right", 90, 18);
  const timelineStyle = entryFrom(Math.max(0, frame - 22), "bottom", 80, 22);
  const cursorBlink = Math.floor(frame / 14) % 2 === 0;

  const milestones = ["BRIEFING", "FUNIL", "PÁGINA", "OFERTA", "ATIVO"];

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <div style={{ fontSize: 32, fontFamily: FONT, fontWeight: 400, color: `rgba(242,242,242,0.45)`, letterSpacing: 2, textTransform: "uppercase", marginBottom: 28, ...subStyle }}>
        A gente monta sua máquina em
      </div>
      <div style={{ opacity: diasOp, transform: `scale(${diasScale})`, filter: `blur(${diasBlur}px)`, fontSize: 162, fontFamily: FONT, fontWeight: 900, color: WHITE, letterSpacing: -7, textAlign: "center", lineHeight: 1, willChange: "transform, opacity, filter", marginBottom: 16 }}>
        21 DIAS.
      </div>
      <div style={{ fontSize: 48, fontWeight: 700, fontFamily: MONO, color: ROSE1, letterSpacing: 2, textAlign: "center", textShadow: `0 0 18px ${ROSE1}88`, marginBottom: 44, ...entryFrom(Math.max(0, frame - 30), "bottom", 60, 18) }}>
        PRONTA A OPERAR.
        <span style={{ opacity: cursorBlink ? 1 : 0, color: WHITE }}>_</span>
      </div>
      <div style={{ width: "100%", opacity: progressOp, ...timelineStyle }}>
        {/* Track + markers + ball */}
        <div style={{ width: "100%", position: "relative", height: 6, marginBottom: 22 }}>
          {/* Base track */}
          <div style={{ width: "100%", height: "100%", background: DARK2, borderRadius: 3 }} />
          {/* Fill */}
          <div style={{ position: "absolute", top: 0, left: 0, width: `${progressWidth}%`, height: "100%", background: `linear-gradient(90deg, ${ROSE1}aa, ${ROSE2})`, borderRadius: 3, boxShadow: `0 0 12px ${ROSE1}88` }} />
          {/* Milestone markers — dot discreto no centro de cada label (apagado = não chegou, invisível = passou) */}
          {STOPS.map((pos, i) => {
            const passed = progressWidth >= pos - 1;
            return (
              <div key={i} style={{
                position: "absolute", top: "50%", left: `${pos}%`,
                width: 7, height: 7, borderRadius: "50%",
                background: passed ? "transparent" : "rgba(242,242,242,0.16)",
                boxShadow: passed ? "none" : "0 0 0 1px rgba(242,242,242,0.28)",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }} />
            );
          })}
          {/* Bolinha ativa */}
          <div style={{
            position: "absolute", top: "50%", left: `${progressWidth}%`,
            width: 18, height: 18, borderRadius: "50%", background: ROSE1,
            boxShadow: `0 0 14px ${ROSE1}, 0 0 28px ${ROSE1}99, 0 0 42px ${ROSE1}44`,
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }} />
        </div>
        {/* Labels — flex:1 garante que o centro de cada label fica em 10/30/50/70/90% */}
        <div style={{ display: "flex" }}>
          {milestones.map((m, i) => {
            const colorT = ci(progressWidth, [STOPS[i] - 7, STOPS[i] + 7], [0, 1]);
            const r = Math.round(242 + (255 - 242) * colorT);
            const g = Math.round(242 + (45  - 242) * colorT);
            const b = Math.round(242 + (120 - 242) * colorT);
            const color = `rgb(${r},${g},${b})`;
            return (
              <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 26, fontFamily: MONO, color, letterSpacing: 1 }}>
                {m}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 7 ─ Círculo centerpiece com "100 MIL" dentro, exit DOWN ──
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isExiting = frame >= 193;
  const exitStyle = isExiting ? exitTo(frame, 193, "bottom", 1300, 17) : {};

  const garantiaOp = ci(frame, [0, 14], [0, 1]);
  const garantiaTy = ci(frame, [0, 18], [-40, 0], Easing.out(Easing.cubic));
  const garantiaBlur = ci(frame, [0, 12], [8, 0], Easing.out(Easing.quad));

  const glowPulse = frame > 25 ? Math.sin(frame * 0.1) * 0.5 + 0.5 : 0;
  const bgGlowIntensity = 0.1 + glowPulse * 0.07;
  const chromaIntensity = ci(frame, [20, 34], [1, 0], Easing.out(Easing.cubic));

  // Círculo girando com "X MIL" no centro (0 MIL → 100 MIL)
  const CIRCLE_R = 128;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;
  const circleStart = 22;
  const circleEntryScale = spring({ frame: Math.max(0, frame - circleStart), fps, config: SPRING_COLOS, from: 0.35, to: 1 });
  const circleProgress = ci(frame, [circleStart, 215], [0, 1], Easing.out(Easing.cubic));
  const strokeDashoffset = CIRCUMFERENCE * (1 - circleProgress);
  const rotation = Math.max(0, frame - circleStart) * 1.6;
  const counterValue = Math.round(ci(frame, [circleStart, 215], [0, 100]));
  const circleOp = ci(frame, [circleStart, circleStart + 14], [0, 1]);
  const counterOp = ci(frame, [circleStart + 6, circleStart + 22], [0, 1]);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255,45,120,${bgGlowIntensity}) 0%, transparent 65%)` }} />
      {/* Label topo */}
      <div style={{
        opacity: garantiaOp,
        transform: `translateY(${garantiaTy}px)`,
        filter: `blur(${garantiaBlur}px)`,
        fontSize: 30, fontFamily: FONT, fontWeight: 400,
        color: `rgba(242,242,242,0.45)`, letterSpacing: 3,
        textTransform: "uppercase", marginBottom: 52,
      }}>
        GARANTIA TOTAL
      </div>
      {/* Círculo centerpiece — "100 MIL" dentro */}
      <div style={{
        opacity: circleOp,
        transform: `scale(${circleEntryScale})`,
        overflow: "visible",
        position: "relative", width: 300, height: 300,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* SVG com overflow:visible — sem máscara quadrada no glow */}
        <svg
          width="300" height="300" viewBox="0 0 300 300"
          style={{ position: "absolute", overflow: "visible", transform: `rotate(${rotation}deg)` }}
        >
          {/* Glow layer: arco espesso e desfocado — sem drop-shadow */}
          <circle cx="150" cy="150" r={CIRCLE_R}
            fill="none" stroke={ROSE1} strokeWidth="24"
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
            style={{ filter: "blur(16px)", opacity: 0.38 }} />
          {/* Glow secundário mais suave */}
          <circle cx="150" cy="150" r={CIRCLE_R}
            fill="none" stroke={ROSE2} strokeWidth="14"
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
            style={{ filter: "blur(8px)", opacity: 0.22 }} />
          {/* Track de fundo */}
          <circle cx="150" cy="150" r={CIRCLE_R}
            fill="none" stroke="rgba(255,45,120,0.13)" strokeWidth="10" />
          {/* Arco principal — nítido, sem filter */}
          <circle cx="150" cy="150" r={CIRCLE_R}
            fill="none" stroke={ROSE1} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset} />
        </svg>
        {/* Conteúdo interno: número + MIL */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          opacity: counterOp,
        }}>
          <div style={{
            fontSize: 80, fontFamily: FONT, fontWeight: 900,
            color: WHITE, letterSpacing: -4, lineHeight: 0.95,
            textShadow: `0 0 22px rgba(242,242,242,0.4)`,
          }}>
            {counterValue}
          </div>
          <div style={{
            fontSize: 34, fontFamily: FONT, fontWeight: 900,
            color: ROSE1, letterSpacing: 4, lineHeight: 1.2,
            textShadow: `0 0 18px ${ROSE1}99`,
          }}>
            MIL
          </div>
        </div>
      </div>
      <ChromaAberration intensity={chromaIntensity} />
    </AbsoluteFill>
  );
};

// ─── SCENE 8 ─ CTA ROSE button pulse, fade to black (from=1040, 310f, fadeAt=270) ──
const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const masterOp = ci(frame, [215, 244], [1, 0]);
  const pulse = 1 + Math.sin(frame * 0.12) * 0.05;
  const buttonGlow = Math.sin(frame * 0.12) * 0.5 + 0.5;

  const subStyle = entryFrom(frame, "top", 80, 22);
  const headStyle = entryFrom(Math.max(0, frame - 12), "top", 80, 24);
  const ctaStyle = entryFrom(Math.max(0, frame - 36), "bottom", 100, 26);
  const arrowStyle = entryFrom(Math.max(0, frame - 56), "bottom", 60, 18);

  const { fps: vfps } = useVideoConfig();
  const logoScale = spring({ frame: Math.max(0, frame - 4), fps: vfps, config: SPRING_TEXT, from: 0.85, to: 1 });
  const logoOp = ci(frame, [4, 16], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity: masterOp, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px` }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 50% at 50% 45%, rgba(255,45,120,${0.06 + buttonGlow * 0.04}) 0%, transparent 65%)` }} />
      <div style={{ fontSize: 34, fontFamily: FONT, fontWeight: 400, color: `rgba(242,242,242,0.45)`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36, ...subStyle }}>
        PRÓXIMO PASSO
      </div>
      <div style={{ fontSize: 60, fontFamily: FONT, fontWeight: 800, color: WHITE, letterSpacing: -2, textAlign: "center", lineHeight: 1.2, marginBottom: 16, ...headStyle }}>
        Quer receber essa{" "}
        <span style={{ color: ROSE1, textShadow: `0 0 20px ${ROSE1}88`, fontFamily: FONT, fontWeight: 900 }}>máquina</span>
        <br />pronta?
      </div>
      <div style={{ fontSize: 36, fontFamily: FONT, fontWeight: 400, color: `rgba(242,242,242,0.5)`, textAlign: "center", lineHeight: 1.5, marginBottom: 64, ...entryFrom(Math.max(0, frame - 20), "right", 70, 20) }}>
        Toque no botão abaixo.
      </div>
      <div style={{
        ...ctaStyle,
        transform: `scale(${(ctaStyle as any).transform ? 1 : 1}) scale(${pulse})`,
        background: ROSE1, color: WHITE,
        fontSize: 40, fontFamily: FONT, fontWeight: 900, letterSpacing: -0.5,
        padding: "32px 80px", borderRadius: 18, textAlign: "center",
        boxShadow: `0 0 ${30 + buttonGlow * 30}px ${ROSE1}${Math.round(100 + buttonGlow * 60).toString(16)}, 0 0 ${70 + buttonGlow * 50}px ${ROSE2}44`,
      }}>
        QUERO MINHA MÁQUINA
      </div>
      <div style={{ fontSize: 52, color: ROSE1, marginTop: 28, textShadow: `0 0 20px ${ROSE1}88`, ...arrowStyle }}>
        ↓
      </div>
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logoOp, transform: `scale(${logoScale})` }}>
        <div style={{ fontSize: 22, fontFamily: MONO, color: `rgba(242,242,242,0.25)`, letterSpacing: 4, textTransform: "uppercase" }}>
          FÁBRICA DE MENTORES
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── MAIN COMPOSITION (1785 frames = 59.5s @ 30fps) ──────────────────────────
// Scene 1: from=0,    dur=170  | Scene 2: from=158,  dur=70
// Scene 3: from=215,  dur=310  | Scene 4: from=505,  dur=290
// Scene 5: from=775,  dur=250  | Scene 6: from=1000, dur=370
// Scene 7: from=1350, dur=215  | Scene 8: from=1540, dur=245
export const MaquinaNeoanalogiaca2: React.FC = () => {
  const frame = useCurrentFrame();

  const glowPerScene: string =
    frame < 158  ? "rgba(242,242,242,0.04)" :
    frame < 215  ? "rgba(255,45,120,0.08)"  :
    frame < 505  ? "rgba(255,59,48,0.04)"   :
    frame < 775  ? "rgba(255,45,120,0.05)"  :
    frame < 1000 ? "rgba(255,45,120,0.10)"  :
    frame < 1350 ? "rgba(255,133,179,0.04)" :
    frame < 1540 ? "rgba(255,45,120,0.09)"  :
                   "rgba(255,45,120,0.07)";

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: BG }}>
      <Background glow={glowPerScene} />

      {/* Trilha de fundo — One life (volume 12%, inicia do frame 0) */}
      <Audio src={staticFile("one-life.mp3")} volume={0.12} startFrom={0} />

      {/* Narração principal — full-v2.mp3 (57.47s = ~1724f @ 30fps) */}
      <Audio src={staticFile("audio/neoanalogiaca/full-v2.mp3")} />

      <Sequence from={0}    durationInFrames={170}><Scene1 /></Sequence>
      <Sequence from={158}  durationInFrames={70}><Scene2 /></Sequence>
      <Sequence from={215}  durationInFrames={310}><Scene3 /></Sequence>
      <Sequence from={505}  durationInFrames={290}><Scene4 /></Sequence>
      <Sequence from={775}  durationInFrames={250}><Scene5 /></Sequence>
      <Sequence from={1000} durationInFrames={370}><Scene6 /></Sequence>
      <Sequence from={1350} durationInFrames={215}><Scene7 /></Sequence>
      <Sequence from={1540} durationInFrames={245}><Scene8 /></Sequence>
    </AbsoluteFill>
  );
};
