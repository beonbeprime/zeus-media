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
const ACID  = "#D6FF00";
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
          <pattern id="bg-grid" width="54" height="54" patternUnits="userSpaceOnUse">
            <path d="M54 0L0 0 0 54" fill="none" stroke={WHITE} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid)" />
      </svg>
    </AbsoluteFill>
    <AbsoluteFill style={{ opacity: 0.035, mixBlendMode: "overlay" as const }}>
      <svg width="100%" height="100%">
        <filter id="bg-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bg-grain)" />
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
const WordByWord: React.FC<{ text: string; startFrame: number; stagger?: number; style?: React.CSSProperties }> = ({
  text, startFrame, stagger = 3, style = {}
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 10px", ...style }}>
      {words.map((w, i) => {
        const f = Math.max(0, frame - startFrame - i * stagger);
        const op = ci(f, [0, 10], [0, 1]);
        const tx = ci(f, [0, 14], [18, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 10], [8, 0], Easing.out(Easing.quad));
        return (
          <span key={i} style={{ opacity: op, transform: `translateX(${tx}px)`, filter: `blur(${blur}px)`, display: "inline-block" }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ─── SCENE 1 ─ "Você acha…" cursor blink, WordByWord, exit LEFT (from=0, 165f, exitAt=142) ──
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const isExiting = frame >= 136;
  const exitStyle = isExiting ? exitTo(frame, 136, "left", 1200, 16) : {};
  const cursorBlink = Math.floor(frame / 14) % 2 === 0;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <div style={{ fontSize: 34, fontFamily: FONT, fontWeight: 300, color: `rgba(242,242,242,0.45)`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 40, ...entryFrom(frame, "top", 40, 18) }}>
        O MITO
      </div>
      <WordByWord
        text="Você acha que sua mentoria não saiu do papel porque você não grava conteúdo."
        startFrame={8}
        stagger={3}
        style={{ fontSize: 52, fontFamily: FONT, fontWeight: 600, color: WHITE, lineHeight: 1.3, textAlign: "center", letterSpacing: -1 }}
      />
      <span style={{ fontSize: 48, fontFamily: MONO, color: ACID, marginTop: 32, opacity: cursorBlink ? 1 : 0, textShadow: `0 0 20px ${ACID}99` }}>|</span>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 ─ "MENTIRA." colossal ACID, chroma, grid pulse, exit DOWN (from=155, 95f, exitAt=75) ──
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isExiting = frame >= 45;
  const exitStyle = isExiting ? exitTo(frame, 45, "bottom", 1300, 17) : {};

  const colossalScale = spring({ frame, fps, config: SPRING_COLOS, from: 2.6, to: 1 });
  const colossalOp = ci(frame, [0, 10], [0, 1]);
  const colossalBlur = ci(frame, [0, 16], [50, 0], Easing.out(Easing.quad));
  const chromaIntensity = ci(frame, [0, 12], [1, 0], Easing.out(Easing.cubic));
  const glowPulse = 1 + Math.sin(frame * 0.14) * 0.08;

  return (
    <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center", ...exitStyle }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(214,255,0,${0.12 * glowPulse}) 0%, transparent 65%)` }} />
      <div style={{
        opacity: colossalOp,
        transform: `scale(${colossalScale})`,
        filter: `blur(${colossalBlur}px)`,
        fontSize: 188,
        fontFamily: FONT,
        fontWeight: 900,
        color: ACID,
        letterSpacing: -8,
        textAlign: "center",
        lineHeight: 1,
        willChange: "transform, opacity, filter",
        textShadow: `0 0 50px ${ACID}cc, 0 0 100px ${ACID}77, 0 0 200px ${ACID}33`,
      }}>
        MENTIRA.
      </div>
      <ChromaAberration intensity={chromaIntensity} />
    </AbsoluteFill>
  );
};

// ─── SCENE 3 ─ Red X checklist 3 itens, exit RIGHT (from=240, 140f, exitAt=118) ──
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const isExiting = frame >= 252;
  const exitStyle = isExiting ? exitTo(frame, 252, "right", 1200, 16) : {};

  const items = [
    "Gravar conteúdo todo dia",
    "Ter muitos seguidores",
    "Ser famoso nas redes sociais",
  ];

  const subStyle = entryFrom(frame, "top", 60, 18);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <div style={{ fontSize: 32, fontFamily: FONT, fontWeight: 300, color: `rgba(242,242,242,0.45)`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 48, ...subStyle }}>
        VOCÊ NÃO PRECISA DE
      </div>
      {items.map((item, i) => {
        const f = Math.max(0, frame - 10 - i * 14);
        const op = ci(f, [0, 16], [0, 1]);
        const tx = ci(f, [0, 18], [60, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 12], [8, 0]);
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 24,
            marginBottom: 28, opacity: op,
            transform: `translateX(${tx}px)`,
            filter: `blur(${blur}px)`,
          }}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20" stroke="#FF3B30" strokeWidth="2" fill="rgba(255,59,48,0.1)" />
              <line x1="13" y1="13" x2="31" y2="31" stroke="#FF3B30" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="31" y1="13" x2="13" y2="31" stroke="#FF3B30" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 46, fontFamily: FONT, fontWeight: 600, color: `rgba(242,242,242,0.7)`, letterSpacing: -1, textDecoration: "line-through", textDecorationColor: "rgba(255,59,48,0.6)" }}>
              {item}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCENE 4 ─ 3 ACID-border cards, exit TOP (from=370, 190f, exitAt=168) ──────
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const isExiting = frame >= 244;
  const exitStyle = isExiting ? exitTo(frame, 244, "top", 1200, 16) : {};

  const subStyle = entryFrom(frame, "left", 80, 18);
  const cards = [
    { icon: "⬡", label: "FUNIL DE VENDAS", delay: 10 },
    { icon: "◈", label: "PÁGINA QUE ATRAI\nPESSOAS CERTAS", delay: 26 },
    { icon: "◆", label: "OFERTA\nIRRESISTÍVEL", delay: 42 },
  ];

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <div style={{ fontSize: 32, fontFamily: FONT, fontWeight: 300, color: `rgba(242,242,242,0.45)`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 52, ...subStyle }}>
        O QUE VOCÊ PRECISA É:
      </div>
      {cards.map((card, i) => {
        const f = Math.max(0, frame - card.delay);
        const op = ci(f, [0, 18], [0, 1]);
        const ty = ci(f, [0, 22], [50, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 14], [10, 0]);
        const glowPulse = frame > card.delay + 20 ? Math.sin((frame - card.delay) * 0.09 + i) * 0.5 + 0.5 : 0;
        return (
          <div key={i} style={{
            opacity: op, transform: `translateY(${ty}px)`, filter: `blur(${blur}px)`,
            width: "100%", marginBottom: 20,
            border: `1.5px solid rgba(214,255,0,${0.4 + glowPulse * 0.25})`,
            borderRadius: 16,
            background: `rgba(214,255,0,${0.03 + glowPulse * 0.02})`,
            padding: "24px 36px",
            display: "flex", alignItems: "center", gap: 28,
            boxShadow: `0 0 ${20 + glowPulse * 20}px rgba(214,255,0,${0.06 + glowPulse * 0.08})`,
          }}>
            <span style={{ fontSize: 44, color: ACID, textShadow: `0 0 20px ${ACID}88` }}>{card.icon}</span>
            <span style={{ fontSize: 40, fontFamily: FONT, fontWeight: 700, color: WHITE, letterSpacing: -0.5, lineHeight: 1.2, whiteSpace: "pre-line" }}>
              {card.label}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCENE 5 ─ R$1 CountUp 198px, SCALE OUT (from=550, 150f, exitAt=127) ──────
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const isExiting = frame >= 215;
  const exitStyle = isExiting ? exitScaleOut(frame, 215, 18) : {};

  const countValue = ci(frame, [8, 70], [0, 1]);
  const countOp = ci(frame, [8, 18], [0, 1]);
  const chromaIntensity = ci(frame, [8, 20], [0.9, 0], Easing.out(Easing.cubic));
  const tremor = Math.sin(frame * 0.8) * ci(frame, [8, 20], [0, 1]) * 3;

  const sub1Style = entryFrom(frame, "left", 100, 20);
  const sub2Style = entryFrom(Math.max(0, frame - 75), "bottom", 80, 20);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 65% 40% at 50% 50%, rgba(214,255,0,0.08) 0%, transparent 65%)` }} />
      <div style={{ fontSize: 36, fontFamily: FONT, fontWeight: 300, color: `rgba(242,242,242,0.55)`, textAlign: "center", marginBottom: 16, ...sub1Style }}>
        Com low ticket, você tem leads por
      </div>
      <div style={{
        opacity: countOp,
        transform: `translateX(${tremor}px)`,
        fontSize: 198, fontFamily: FONT, fontWeight: 900, color: ACID,
        letterSpacing: -10, lineHeight: 0.85, textAlign: "center",
        willChange: "transform, opacity",
        textShadow: `0 0 60px ${ACID}cc, 0 0 120px ${ACID}66, 0 0 220px ${ACID}22`,
      }}>
        R$&nbsp;{countValue.toFixed(2).replace(".", ",")}
      </div>
      <div style={{ fontSize: 56, fontFamily: FONT, fontWeight: 700, color: `rgba(242,242,242,0.7)`, letterSpacing: -1, textAlign: "center", marginTop: 20, marginBottom: 36, ...entryFrom(Math.max(0, frame - 72), "bottom", 60, 18) }}>
        POR LEAD.
      </div>
      <div style={{ fontSize: 34, fontFamily: FONT, fontWeight: 300, color: `rgba(242,242,242,0.45)`, textAlign: "center", lineHeight: 1.6, ...sub2Style }}>
        Sem postar todo dia.<br />Sem audiência.
      </div>
      <ChromaAberration intensity={chromaIntensity} />
    </AbsoluteFill>
  );
};

// ─── SCENE 6 ─ "21 DIAS" spring + progress bar, exit LEFT (from=690, 170f, exitAt=148) ──
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isExiting = frame >= 284;
  const exitStyle = isExiting ? exitTo(frame, 284, "left", 1200, 16) : {};

  const diasScale = spring({ frame, fps, config: SPRING_SNAP, from: 3, to: 1 });
  const diasOp = ci(frame, [0, 10], [0, 1]);
  const diasBlur = ci(frame, [0, 16], [40, 0], Easing.out(Easing.cubic));

  const progressWidth = ci(frame, [18, 110], [0, 100]);
  const progressOp = ci(frame, [18, 28], [0, 1]);

  const subStyle = entryFrom(frame, "right", 90, 18);
  const timelineStyle = entryFrom(Math.max(0, frame - 22), "bottom", 80, 22);
  const cursorBlink = Math.floor(frame / 14) % 2 === 0;

  const milestones = ["BRIEFING", "FUNIL", "PÁGINA", "OFERTA", "ATIVO"];

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <div style={{ fontSize: 32, fontFamily: FONT, fontWeight: 300, color: `rgba(242,242,242,0.45)`, letterSpacing: 2, textTransform: "uppercase", marginBottom: 28, ...subStyle }}>
        A gente monta sua máquina em
      </div>
      <div style={{ opacity: diasOp, transform: `scale(${diasScale})`, filter: `blur(${diasBlur}px)`, fontSize: 162, fontFamily: FONT, fontWeight: 900, color: WHITE, letterSpacing: -7, textAlign: "center", lineHeight: 1, willChange: "transform, opacity, filter", marginBottom: 16 }}>
        21 DIAS.
      </div>
      <div style={{ fontSize: 30, fontFamily: MONO, color: ACID, letterSpacing: 2, textAlign: "center", textShadow: `0 0 18px ${ACID}88`, marginBottom: 44, ...entryFrom(Math.max(0, frame - 30), "bottom", 60, 18) }}>
        PRONTA A OPERAR.
        <span style={{ opacity: cursorBlink ? 1 : 0, color: WHITE }}>_</span>
      </div>
      <div style={{ width: "100%", opacity: progressOp, ...timelineStyle }}>
        <div style={{ width: "100%", height: 6, background: DARK2, borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ width: `${progressWidth}%`, height: "100%", background: `linear-gradient(90deg, ${ACID}aa, ${ACID})`, borderRadius: 3, boxShadow: `0 0 12px ${ACID}88`, transition: "width 0s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {milestones.map((m, i) => {
            const filled = progressWidth >= (i / (milestones.length - 1)) * 100;
            return (
              <span key={i} style={{ fontSize: 22, fontFamily: MONO, color: filled ? ACID : `rgba(242,242,242,0.25)`, letterSpacing: 1, transition: "color 0s" }}>
                {m}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 7 ─ "100 MIL" bloom glow, chroma, exit DOWN (from=850, 200f, exitAt=178) ──
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isExiting = frame >= 241;
  const exitStyle = isExiting ? exitTo(frame, 241, "bottom", 1300, 17) : {};

  const punchScale = spring({ frame, fps, config: SPRING_COLOS, from: 2.4, to: 1 });
  const punchOp = ci(frame, [0, 10], [0, 1]);
  const punchBlur = ci(frame, [0, 18], [50, 0], Easing.out(Easing.quad));
  const chromaIntensity = ci(frame, [0, 14], [1, 0], Easing.out(Easing.cubic));

  const glowPulse = frame > 20 ? Math.sin(frame * 0.1) * 0.5 + 0.5 : 0;
  const subStyle = entryFrom(Math.max(0, frame - 8), "top", 60, 18);
  const garantiaStyle = entryFrom(Math.max(0, frame - 44), "bottom", 80, 22);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: `0 ${SAFE_X}px`, ...exitStyle }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 50% at 50% 45%, rgba(214,255,0,${0.1 + glowPulse * 0.05}) 0%, transparent 65%)` }} />
      <div style={{ fontSize: 32, fontFamily: FONT, fontWeight: 300, color: `rgba(242,242,242,0.45)`, letterSpacing: 2, textTransform: "uppercase", marginBottom: 32, ...subStyle }}>
        GARANTIA TOTAL
      </div>
      <div style={{
        opacity: punchOp, transform: `scale(${punchScale})`, filter: `blur(${punchBlur}px)`,
        fontSize: 112, fontFamily: FONT, fontWeight: 900, color: ACID, letterSpacing: -5,
        textAlign: "center", lineHeight: 1.05, willChange: "transform, opacity, filter",
        textShadow: `0 0 40px ${ACID}cc, 0 0 80px ${ACID}${Math.round(102 + glowPulse * 80).toString(16)}, 0 0 160px ${ACID}44`,
        marginBottom: 8,
      }}>
        100 MIL
      </div>
      <div style={{
        opacity: punchOp, transform: `scale(${punchScale})`, filter: `blur(${punchBlur}px)`,
        fontSize: 112, fontFamily: FONT, fontWeight: 900, color: ACID, letterSpacing: -5,
        textAlign: "center", lineHeight: 1.05, willChange: "transform, opacity, filter",
        textShadow: `0 0 40px ${ACID}cc, 0 0 80px ${ACID}66, 0 0 160px ${ACID}22`,
        marginBottom: 40,
      }}>
        POR MÊS.
      </div>
      <div style={{ fontSize: 38, fontFamily: FONT, fontWeight: 400, color: `rgba(242,242,242,0.65)`, textAlign: "center", lineHeight: 1.5, ...garantiaStyle }}>
        Te acompanho até você bater.<br />
        <span style={{ color: WHITE, fontWeight: 600 }}>Sem desculpa. Sem prazo aberto.</span>
      </div>
      <ChromaAberration intensity={chromaIntensity} />
    </AbsoluteFill>
  );
};

// ─── SCENE 8 ─ CTA ACID button pulse, fade to black (from=1040, 310f, fadeAt=270) ──
const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const masterOp = ci(frame, [172, 210], [1, 0]);
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
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 50% at 50% 45%, rgba(214,255,0,${0.06 + buttonGlow * 0.04}) 0%, transparent 65%)` }} />
      <div style={{ fontSize: 34, fontFamily: FONT, fontWeight: 300, color: `rgba(242,242,242,0.45)`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36, ...subStyle }}>
        PRÓXIMO PASSO
      </div>
      <div style={{ fontSize: 60, fontFamily: FONT, fontWeight: 800, color: WHITE, letterSpacing: -2, textAlign: "center", lineHeight: 1.2, marginBottom: 16, ...headStyle }}>
        Quer faturar{" "}
        <span style={{ color: ACID, textShadow: `0 0 20px ${ACID}88` }}>50 mil</span>
        <br />por mês com mentoria?
      </div>
      <div style={{ fontSize: 36, fontFamily: FONT, fontWeight: 300, color: `rgba(242,242,242,0.5)`, textAlign: "center", lineHeight: 1.5, marginBottom: 64, ...entryFrom(Math.max(0, frame - 20), "right", 70, 20) }}>
        Toque no botão abaixo agora.
      </div>
      <div style={{
        ...ctaStyle,
        transform: `scale(${(ctaStyle as any).transform ? 1 : 1}) scale(${pulse})`,
        background: ACID, color: BG,
        fontSize: 40, fontFamily: FONT, fontWeight: 900, letterSpacing: -0.5,
        padding: "32px 80px", borderRadius: 18, textAlign: "center",
        boxShadow: `0 0 ${30 + buttonGlow * 30}px ${ACID}${Math.round(100 + buttonGlow * 60).toString(16)}, 0 0 ${70 + buttonGlow * 50}px ${ACID}44`,
      }}>
        QUERO MINHA MÁQUINA
      </div>
      <div style={{ fontSize: 52, color: ACID, marginTop: 28, textShadow: `0 0 20px ${ACID}88`, ...arrowStyle }}>
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

// ─── MAIN COMPOSITION (1713 frames = 57.1s @ 30fps) ──────────────────────────
// Scene 1: from=0,    dur=158  | Scene 2: from=148,  dur=67
// Scene 3: from=205,  dur=274  | Scene 4: from=469,  dur=266
// Scene 5: from=725,  dur=237  | Scene 6: from=952,  dur=306
// Scene 7: from=1248, dur=263  | Scene 8: from=1501, dur=212
export const MaquinaNeoanalogiaca: React.FC = () => {
  const frame = useCurrentFrame();

  const glowPerScene: string =
    frame < 148  ? "rgba(242,242,242,0.04)" :
    frame < 205  ? "rgba(214,255,0,0.08)"   :
    frame < 469  ? "rgba(255,59,48,0.04)"   :
    frame < 725  ? "rgba(214,255,0,0.05)"   :
    frame < 952  ? "rgba(214,255,0,0.10)"   :
    frame < 1248 ? "rgba(80,200,255,0.04)"  :
    frame < 1501 ? "rgba(214,255,0,0.09)"   :
                   "rgba(214,255,0,0.07)";

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: BG }}>
      <Background glow={glowPerScene} />

      <Sequence from={0}    durationInFrames={158}><Scene1 /><Audio src={staticFile("audio/neoanalogiaca/scene-1.mp3")} /></Sequence>
      <Sequence from={148}  durationInFrames={67}><Scene2 /><Audio src={staticFile("audio/neoanalogiaca/scene-2.mp3")} /></Sequence>
      <Sequence from={205}  durationInFrames={274}><Scene3 /><Audio src={staticFile("audio/neoanalogiaca/scene-3.mp3")} /></Sequence>
      <Sequence from={469}  durationInFrames={266}><Scene4 /><Audio src={staticFile("audio/neoanalogiaca/scene-4.mp3")} /></Sequence>
      <Sequence from={725}  durationInFrames={237}><Scene5 /><Audio src={staticFile("audio/neoanalogiaca/scene-5.mp3")} /></Sequence>
      <Sequence from={952}  durationInFrames={306}><Scene6 /><Audio src={staticFile("audio/neoanalogiaca/scene-6.mp3")} /></Sequence>
      <Sequence from={1248} durationInFrames={263}><Scene7 /><Audio src={staticFile("audio/neoanalogiaca/scene-7.mp3")} /></Sequence>
      <Sequence from={1501} durationInFrames={212}><Scene8 /><Audio src={staticFile("audio/neoanalogiaca/scene-8.mp3")} /></Sequence>
    </AbsoluteFill>
  );
};
