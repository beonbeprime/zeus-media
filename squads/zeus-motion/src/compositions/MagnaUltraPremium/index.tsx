import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Easing,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { COLORS, FONT, FONT_MONO, TV, SAFE, SCENE_TIMING, TOTAL_FRAMES } from "./scene-config";

export { TOTAL_FRAMES };

// ─── Primitivas ──────────────────────────────────────────────────────

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
  distance = 100,
  dur = 22
): React.CSSProperties => {
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

const exitTo = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 1200,
  dur = 18
): React.CSSProperties => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const f    = frame - start;
  const pos  = ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp));
  const op   = ci(f, [dur * 0.35, dur], [1, 0]);
  const sc   = ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp));
  const blur = ci(f, [0, dur], [0, 20], Easing.in(Easing.cubic));
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px) scale(${sc})`,
    filter:    `blur(${blur}px)`,
  };
};

const exitToNB = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 1200,
  dur = 18
): React.CSSProperties => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const f    = frame - start;
  const pos  = ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp));
  const op   = ci(f, [dur * 0.35, dur], [1, 0]);
  const sc   = ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp));
  return { opacity: op, transform: `translate${axis}(${pos}px) scale(${sc})` };
};

const mergeStyles = (...styles: React.CSSProperties[]): React.CSSProperties => ({
  opacity:
    styles.reduce(
      (acc, s) =>
        acc * (typeof s.opacity === "number" ? s.opacity : 1),
      1
    ),
  transform: styles.map((s) => s.transform).filter(Boolean).join(" ") || undefined,
  filter:    styles.map((s) => s.filter).filter(Boolean).join(" ") || undefined,
});

// ─── Background 3 camadas ─────────────────────────────────────────────

const Background: React.FC<{ glowColor: string }> = ({ glowColor }) => (
  <>
    <AbsoluteFill style={{ background: COLORS.bg }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 50% at 50% 28%, ${glowColor} 0%, transparent 70%)`,
      }}
    />
    <AbsoluteFill style={{ opacity: 0.03 }}>
      <svg width="100%" height="100%">
        <filter id="grain-mup">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.88"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-mup)" />
      </svg>
    </AbsoluteFill>
  </>
);

// ─── WordByWord ───────────────────────────────────────────────────────

const WordByWord: React.FC<{
  text: string;
  frame: number;
  startFrame?: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
}> = ({ text, frame, startFrame = 0, stagger = 3, style, wordStyle }) => {
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 12px",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const f = frame - startFrame - i * stagger;
        const op  = ci(f, [0, 14], [0, 1]);
        const tx  = ci(f, [0, 14], [30, 0], Easing.out(Easing.cubic));
        const blr = ci(f, [0, 10], [8, 0], Easing.out(Easing.quad));
        return (
          <span
            key={i}
            style={{
              opacity: op,
              transform: `translateX(${tx}px)`,
              filter: `blur(${blr}px)`,
              willChange: "transform, opacity, filter",
              ...wordStyle,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ─── EyebrowTag ────────────────────────────────────────────────────────

const EyebrowTag: React.FC<{ label: string; style?: React.CSSProperties }> = ({
  label,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      border: `1px solid ${COLORS.red}`,
      padding: "6px 20px",
      borderRadius: 2,
      letterSpacing: 6,
      fontSize: 18,
      fontWeight: 600,
      fontFamily: FONT,
      color: COLORS.red,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {label}
  </div>
);

// ─── LineDivider ──────────────────────────────────────────────────────

const LineDivider: React.FC<{ opacity?: number }> = ({ opacity = 0.15 }) => (
  <div
    style={{
      width: 120,
      height: 1,
      background: `linear-gradient(90deg, transparent, ${COLORS.red}, transparent)`,
      opacity,
      margin: "0 auto",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════
// CENA 1 — Área de membros não vende sozinha
// ═══════════════════════════════════════════════════════════════════════

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SCENE_TIMING[0][1];
  const EXIT = dur - 20;

  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "left") : {};

  const items = ["ÁREA DE MEMBROS", "PRODUTO", "CONHECIMENTO"];

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background glowColor="rgba(255, 0, 30, 0.08)" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: SAFE.padTop,
          paddingBottom: SAFE.padBottom,
          paddingLeft: SAFE.x,
          paddingRight: SAFE.x,
          gap: 40,
          ...exitStyle,
        }}
      >
        {/* Ícone X vermelho */}
        <div
          style={{
            ...entryFrom(frame, "right", 80, 20),
            willChange: "transform, opacity, filter",
          }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke={COLORS.red}
              strokeWidth="2"
              opacity={0.3}
            />
            <line
              x1="24"
              y1="24"
              x2="56"
              y2="56"
              stroke={COLORS.red}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="56"
              y1="24"
              x2="24"
              y2="56"
              stroke={COLORS.red}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Headline */}
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            ...entryFrom(frame, "right", 60, 20),
            willChange: "transform, opacity, filter",
          }}
        >
          <WordByWord
            text="Ter isso não vende mentoria."
            frame={frame}
            startFrame={6}
            stagger={3}
            style={{ justifyContent: "center" }}
            wordStyle={{
              fontSize: TV.headline.fontSize,
              fontWeight: TV.headline.fontWeight,
              letterSpacing: TV.headline.letterSpacing,
              color: COLORS.white,
              lineHeight: 1.1,
            }}
          />
        </div>

        {/* Cards em cascata */}
        {items.map((item, i) => {
          const delay = 28 + i * 11;
          const f = Math.max(0, frame - delay);
          const sc = spring({ frame: f, fps, config: { damping: 14, mass: 0.8 } });
          return (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: ci(frame, [delay, delay + 10], [0, 1]),
                transform: `scale(${sc}) translateX(${ci(
                  frame,
                  [delay, delay + 18],
                  [60, 0],
                  Easing.out(Easing.cubic)
                )}px)`,
                willChange: "transform, opacity",
              }}
            >
              <div
                style={{
                  width: 500,
                  padding: "18px 28px",
                  background: COLORS.surface1,
                  border: `1px solid rgba(255,0,30,0.18)`,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: TV.body.fontSize,
                    fontWeight: 500,
                    color: COLORS.gray,
                    textDecoration: "line-through",
                    textDecorationColor: COLORS.red,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {item}
                </span>
                <span style={{ color: COLORS.red, fontSize: 24, fontWeight: 700 }}>✕</span>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CENA 2 — Fica parado
// ═══════════════════════════════════════════════════════════════════════

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SCENE_TIMING[1][1];
  const EXIT = dur - 20;
  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "top") : {};

  const countTarget = 365;
  const countVal = Math.floor(ci(frame, [10, 60], [countTarget, 0]));

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background glowColor="rgba(255, 0, 30, 0.04)" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: SAFE.padTop,
          paddingBottom: SAFE.padBottom,
          paddingLeft: SAFE.x,
          paddingRight: SAFE.x,
          gap: 36,
          ...exitStyle,
        }}
      >
        {/* Contador holográfico */}
        <div
          style={{
            ...entryFrom(frame, "left", 80, 22),
            willChange: "transform, opacity, filter",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: TV.hero.fontSize,
              fontWeight: TV.hero.fontWeight,
              letterSpacing: TV.hero.letterSpacing,
              color: COLORS.red,
              fontFamily: FONT_MONO,
              lineHeight: 1,
              textShadow: `0 0 40px rgba(255,0,30,0.5)`,
            }}
          >
            {countVal}
          </div>
          <div
            style={{
              fontSize: TV.caption.fontSize,
              fontWeight: TV.caption.fontWeight,
              letterSpacing: TV.caption.letterSpacing,
              color: COLORS.gray,
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            DIAS ESPERANDO
          </div>
        </div>

        <LineDivider />

        {/* Texto */}
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            ...entryFrom(frame, "left", 60, 22),
            willChange: "transform, opacity, filter",
            marginTop: 8,
          }}
        >
          <WordByWord
            text="Enquanto você espera, alguém com menos preparo fecha todo dia."
            frame={frame}
            startFrame={18}
            stagger={3}
            style={{ justifyContent: "center" }}
            wordStyle={{
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -2,
              color: COLORS.white,
              lineHeight: 1.2,
            }}
          />
        </div>

        {/* Sub */}
        <div
          style={{
            opacity: ci(frame, [55, 70], [0, 1]),
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: TV.body.fontSize,
              fontWeight: 300,
              color: COLORS.gray,
              letterSpacing: 1,
            }}
          >
            O momento perfeito nunca chega.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CENA 3 — Curso vs Mentoria
// ═══════════════════════════════════════════════════════════════════════

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SCENE_TIMING[2][1];
  const EXIT = dur - 20;
  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "right") : {};

  const colItems = [
    { label: "CURSO",    items: ["R$ 97", "R$ 197", "R$ 297"], color: COLORS.gray },
    { label: "MENTORIA", items: ["R$ 5k", "R$ 15k", "R$ 30k"], color: COLORS.red },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background glowColor="rgba(255, 0, 30, 0.06)" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: SAFE.padTop,
          paddingBottom: SAFE.padBottom,
          paddingLeft: SAFE.x,
          paddingRight: SAFE.x,
          gap: 40,
          ...exitStyle,
        }}
      >
        <EyebrowTag
          label="A DIFERENÇA"
          style={{
            opacity: ci(frame, [0, 12], [0, 1]),
            transform: `translateY(${ci(frame, [0, 12], [-20, 0], Easing.out(Easing.cubic))}px)`,
          }}
        />

        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            ...entryFrom(frame, "top", 50, 20),
            willChange: "transform, opacity, filter",
          }}
        >
          <WordByWord
            text="Estrutura separa quem vende curso de quem vende mentoria."
            frame={frame}
            startFrame={10}
            stagger={3}
            style={{ justifyContent: "center" }}
            wordStyle={{
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -2,
              color: COLORS.white,
              lineHeight: 1.2,
            }}
          />
        </div>

        {/* Split columns */}
        <div
          style={{
            display: "flex",
            gap: 28,
            opacity: ci(frame, [32, 44], [0, 1]),
            transform: `translateY(${ci(
              frame,
              [32, 44],
              [40, 0],
              Easing.out(Easing.cubic)
            )}px)`,
            willChange: "transform, opacity",
          }}
        >
          {colItems.map((col) => (
            <div
              key={col.label}
              style={{
                width: 400,
                background: COLORS.surface1,
                border: `1px solid ${col.color === COLORS.red
                  ? "rgba(255,0,30,0.35)"
                  : "rgba(255,255,255,0.06)"}`,
                borderRadius: 4,
                padding: "28px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontSize: TV.caption.fontSize,
                  letterSpacing: 6,
                  fontWeight: 600,
                  color: col.color,
                  textTransform: "uppercase",
                }}
              >
                {col.label}
              </span>
              {col.items.map((it, i) => (
                <div
                  key={it}
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: col.color === COLORS.red ? COLORS.white : COLORS.gray,
                    opacity: ci(frame, [40 + i * 8, 52 + i * 8], [0, 1]),
                    letterSpacing: -1,
                  }}
                >
                  {it}
                </div>
              ))}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CENA 4 — 21 DIAS
// ═══════════════════════════════════════════════════════════════════════

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SCENE_TIMING[3][1];
  const EXIT = dur - 20;
  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "left") : {};

  const deliverables = [
    "Área de Membros",
    "Página de Vendas",
    "Automações",
    "Anúncios",
    "Time de Vendas",
  ];

  const numScale = spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 18, mass: 1.2 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background glowColor="rgba(255, 0, 30, 0.12)" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: SAFE.padTop,
          paddingBottom: SAFE.padBottom,
          paddingLeft: SAFE.x,
          paddingRight: SAFE.x,
          gap: 32,
          ...exitStyle,
        }}
      >
        {/* Número 21 ghost */}
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: TV.hero.fontSize,
              fontWeight: TV.hero.fontWeight,
              letterSpacing: TV.hero.letterSpacing,
              color: COLORS.red,
              lineHeight: 1,
              transform: `scale(${numScale})`,
              textShadow: `0 0 80px rgba(255,0,30,0.6), 0 0 160px rgba(255,0,30,0.3)`,
              willChange: "transform",
            }}
          >
            21
          </div>
          <div
            style={{
              fontSize: TV.subhead.fontSize,
              fontWeight: 300,
              letterSpacing: 8,
              color: COLORS.gray,
              textTransform: "uppercase",
              marginTop: -8,
              opacity: ci(frame, [14, 26], [0, 1]),
            }}
          >
            DIAS
          </div>
        </div>

        <LineDivider />

        {/* Lista de entregas */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {deliverables.map((item, i) => {
            const delay = 24 + i * 11;
            const checkFrame = Math.max(0, frame - delay - 10);
            const checkScale = spring({
              frame: checkFrame,
              fps,
              config: { damping: 12, mass: 0.7, stiffness: 120 },
            });
            return (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  opacity: ci(frame, [delay, delay + 12], [0, 1]),
                  transform: `translateX(${ci(
                    frame,
                    [delay, delay + 16],
                    [-40, 0],
                    Easing.out(Easing.cubic)
                  )}px)`,
                  willChange: "transform, opacity",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: COLORS.red,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${checkScale})`,
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <polyline
                      points="2,7 6,11 12,3"
                      stroke={COLORS.white}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: TV.body.fontSize,
                    fontWeight: 500,
                    color: COLORS.white,
                    letterSpacing: 0.5,
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CENA 5 — Fechador
// ═══════════════════════════════════════════════════════════════════════

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SCENE_TIMING[4][1];
  const EXIT = dur - 20;
  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "bottom") : {};

  const cardScale = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 13, mass: 0.9 } });
  const pulseFactor = Math.sin(frame * 0.14) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background glowColor="rgba(255, 0, 30, 0.06)" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: SAFE.padTop,
          paddingBottom: SAFE.padBottom,
          paddingLeft: SAFE.x,
          paddingRight: SAFE.x,
          gap: 36,
          ...exitStyle,
        }}
      >
        <EyebrowTag
          label="INCLUSO"
          style={{
            opacity: ci(frame, [0, 14], [0, 1]),
            transform: `translateY(${ci(frame, [0, 14], [-20, 0], Easing.out(Easing.cubic))}px)`,
          }}
        />

        {/* Card glassmorphism - fechador */}
        <div
          style={{
            width: 780,
            background: "rgba(13,13,17,0.85)",
            border: `1px solid rgba(255,0,30,${0.2 + pulseFactor * 0.15})`,
            borderRadius: 8,
            padding: "44px 52px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            transform: `scale(${cardScale})`,
            backdropFilter: "blur(24px)",
            willChange: "transform",
            boxShadow: `0 0 ${40 + pulseFactor * 20}px rgba(255,0,30,${0.08 + pulseFactor * 0.06})`,
          }}
        >
          {/* Silhueta / ícone */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,0,30,${0.18 + pulseFactor * 0.1}) 0%, transparent 70%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid rgba(255,0,30,0.3)`,
            }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="16" r="8" stroke={COLORS.red} strokeWidth="1.8" fill="none" />
              <path
                d="M6 38c0-8.837 7.163-16 16-16s16 7.163 16 16"
                stroke={COLORS.red}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          <div style={{ textAlign: "center", justifyContent: "center" }}>
            <div
              style={{
                fontSize: TV.headline.fontSize,
                fontWeight: TV.headline.fontWeight,
                letterSpacing: TV.headline.letterSpacing,
                color: COLORS.white,
                lineHeight: 1.1,
              }}
            >
              FECHADOR
            </div>
            <div
              style={{
                fontSize: TV.caption.fontSize,
                letterSpacing: 4,
                fontWeight: 500,
                color: COLORS.red,
                textTransform: "uppercase",
                marginTop: 10,
                opacity: ci(frame, [22, 34], [0, 1]),
              }}
            >
              FAZ AS VENDAS NO SEU LUGAR
            </div>
          </div>
        </div>

        {/* Sub */}
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            opacity: ci(frame, [45, 58], [0, 1]),
          }}
        >
          <span
            style={{
              fontSize: TV.body.fontSize,
              fontWeight: 300,
              color: COLORS.gray,
              letterSpacing: 0.5,
            }}
          >
            Você foca no conhecimento. A gente fecha.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CENA 6 — R$ 50k
// ═══════════════════════════════════════════════════════════════════════

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SCENE_TIMING[5][1];
  const EXIT = dur - 20;
  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "right") : {};

  const numScale = spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 16, mass: 1.2 } });

  // Partículas
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 50 + Math.cos((i / 12) * Math.PI * 2) * 280,
    y: 50 + Math.sin((i / 12) * Math.PI * 2) * 180,
    delay: i * 5,
  }));

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background glowColor="rgba(255, 0, 30, 0.10)" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: SAFE.padTop,
          paddingBottom: SAFE.padBottom,
          paddingLeft: SAFE.x,
          paddingRight: SAFE.x,
          gap: 24,
          ...exitStyle,
        }}
      >
        {/* Partículas */}
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x / 10.8}%`,
              top: `${p.y / 19.2}%`,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: COLORS.red,
              opacity: interpolate(
                frame - p.delay,
                [0, 20, 40, 60],
                [0, 0.8, 0.8, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
              transform: `scale(${ci(frame - p.delay, [0, 20], [0, 1])})`,
              willChange: "transform, opacity",
            }}
          />
        ))}

        <EyebrowTag
          label="RESULTADO"
          style={{
            opacity: ci(frame, [0, 14], [0, 1]),
            transform: `translateY(${ci(frame, [0, 14], [-20, 0], Easing.out(Easing.cubic))}px)`,
          }}
        />

        {/* Número hero */}
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            transform: `scale(${numScale})`,
            willChange: "transform",
          }}
        >
          <div
            style={{
              fontSize: TV.hero.fontSize,
              fontWeight: TV.hero.fontWeight,
              letterSpacing: TV.hero.letterSpacing,
              color: COLORS.red,
              lineHeight: 0.9,
              textShadow: `0 0 60px rgba(255,0,30,0.5)`,
            }}
          >
            R$50k
          </div>
          <div
            style={{
              fontSize: TV.subhead.fontSize,
              fontWeight: 300,
              letterSpacing: 6,
              color: COLORS.gray,
              textTransform: "uppercase",
              marginTop: 16,
              opacity: ci(frame, [18, 30], [0, 1]),
            }}
          >
            POR MÊS COM MENTORIA
          </div>
        </div>

        <LineDivider />

        {/* Sub */}
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            opacity: ci(frame, [40, 55], [0, 1]),
            transform: `translateY(${ci(frame, [40, 55], [20, 0], Easing.out(Easing.cubic))}px)`,
            willChange: "transform, opacity",
          }}
        >
          <span
            style={{
              fontSize: TV.body.fontSize,
              fontWeight: 300,
              color: COLORS.gray,
              letterSpacing: 0.5,
            }}
          >
            Com tudo no lugar, os números aparecem.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CENA 7 — CTA Final
// ═══════════════════════════════════════════════════════════════════════

const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SCENE_TIMING[6][1];

  const cardScale = spring({ frame: Math.max(0, frame - 4), fps, config: { damping: 22, mass: 0.9 } });

  // Sweep de luz lazer a cada 60f
  const sweepCycle = frame % 60;
  const sweepX = ci(sweepCycle, [0, 50], [-120, 900]);
  const sweepOp = interpolate(sweepCycle, [0, 5, 45, 50], [0, 0.4, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background glowColor="rgba(255, 0, 30, 0.10)" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: SAFE.padTop,
          paddingBottom: SAFE.padBottom,
          paddingLeft: SAFE.x,
          paddingRight: SAFE.x,
          gap: 40,
        }}
      >
        {/* Card CTA */}
        <div
          style={{
            width: 820,
            background: COLORS.surface1,
            border: `1px solid rgba(255,0,30,0.25)`,
            borderRadius: 8,
            padding: "52px 60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            transform: `scale(${cardScale})`,
            willChange: "transform",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Sweep de luz */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: sweepX,
              width: 120,
              height: "100%",
              background: `linear-gradient(90deg, transparent, rgba(255,0,30,0.12), transparent)`,
              opacity: sweepOp,
              pointerEvents: "none",
            }}
          />

          {/* Headline */}
          <div style={{ textAlign: "center", justifyContent: "center" }}>
            <WordByWord
              text="Toque no botão e agende uma conversa."
              frame={frame}
              startFrame={8}
              stagger={3}
              style={{ justifyContent: "center" }}
              wordStyle={{
                fontSize: TV.headline.fontSize,
                fontWeight: TV.headline.fontWeight,
                letterSpacing: TV.headline.letterSpacing,
                color: COLORS.white,
                lineHeight: 1.15,
              }}
            />
          </div>

          {/* Sub */}
          <div
            style={{
              textAlign: "center",
              justifyContent: "center",
              opacity: ci(frame, [30, 44], [0, 1]),
              transform: `translateY(${ci(frame, [30, 44], [16, 0], Easing.out(Easing.cubic))}px)`,
              willChange: "transform, opacity",
            }}
          >
            <span
              style={{
                fontSize: TV.body.fontSize,
                fontWeight: 300,
                color: COLORS.gray,
                letterSpacing: 0.5,
              }}
            >
              A gente constrói sua mentoria em 21 dias.
            </span>
          </div>

          {/* Botão CTA */}
          <div
            style={{
              opacity: ci(frame, [44, 58], [0, 1]),
              transform: `translateY(${ci(
                frame,
                [44, 58],
                [20, 0],
                Easing.out(Easing.cubic)
              )}px)`,
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                background: COLORS.red,
                borderRadius: 4,
                padding: "20px 56px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  fontSize: TV.body.fontSize,
                  fontWeight: 700,
                  color: COLORS.white,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                AGENDAR AGORA
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10h12M12 6l4 4-4 4"
                  stroke={COLORS.white}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Logo/assinatura */}
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            opacity: ci(frame, [70, 85], [0, 1]),
          }}
        >
          <span
            style={{
              fontSize: TV.eyebrow.fontSize,
              fontWeight: TV.eyebrow.fontWeight,
              letterSpacing: TV.eyebrow.letterSpacing,
              color: COLORS.gray,
              textTransform: "uppercase",
            }}
          >
            MAGNA
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// COMPOSIÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════

export const MagnaUltraPremium: React.FC = () => {
  const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7];

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {SCENE_TIMING.map(([from, duration], i) => {
        const SceneComponent = scenes[i];
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <SceneComponent />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
