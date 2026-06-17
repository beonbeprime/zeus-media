/**
 * ADS 007 — Magna Ultra Premium
 * Filosofia: Monochrome Dark Luxury com Acento de Urgência
 * 7 cenas | 1350 frames | 45s @ 30fps | 1080×1920
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BG, CARD_1, CARD_2, RED, RED_DIM, RED_MID, WHITE, GRAY, BORDER,
  FONT, TYPE, SAFE_X, PAD_TOP, SAFE_BOTTOM,
  ci, entryFrom, exitTo, floatY, redGlow, countUp, SPRING,
} from "./design-system";

// ─── TIMING ────────────────────────────────────────────────────────────────────
// Cada cena tem from, duration e overlap de 7f com a próxima
const OVERLAP = 7;

const SCENES = [
  { from: 0,    dur: 150 },  // C1 Wireframe grid
  { from: 143,  dur: 177 },  // C2 Card isométrico
  { from: 313,  dur: 187 },  // C3 Dois cards comparação
  { from: 493,  dur: 187 },  // C4 Cronômetro + 21 DIAS
  { from: 673,  dur: 217 },  // C5 Fluxograma + FECHADOR
  { from: 883,  dur: 247 },  // C6 Progress bar R$50k
  { from: 1123, dur: 227 },  // C7 CTA final
] as const;

const TOTAL_FRAMES = 1350;

// ─── GRAIN SVG ─────────────────────────────────────────────────────────────────
const GrainLayer: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.035, pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="grain-007">
        <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-007)" />
    </svg>
  </AbsoluteFill>
);

// ─── BACKGROUND PADRÃO (3 camadas) ─────────────────────────────────────────────
const SceneBackground: React.FC<{ glowStrength?: number }> = ({ glowStrength = 1 }) => {
  const r = 255 * glowStrength * 0.15;
  return (
    <>
      <AbsoluteFill style={{ background: BG }} />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 80% 55% at 50% 28%, rgba(139,47,190,${0.15 * glowStrength}) 0%, transparent 70%)`
      }} />
      <GrainLayer />
    </>
  );
};

// ─── CAMERA WRAPPER ────────────────────────────────────────────────────────────
const CameraOrbit: React.FC<{ angle: number; children: React.ReactNode }> = ({ angle, children }) => (
  <AbsoluteFill style={{ perspective: 1200, perspectiveOrigin: "50% 50%" }}>
    <AbsoluteFill style={{
      transformStyle: "preserve-3d",
      transform: `rotateY(${angle}deg)`,
      willChange: "transform",
    }}>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

const CameraDolly: React.FC<{ scale: number; children: React.ReactNode }> = ({ scale, children }) => (
  <AbsoluteFill style={{
    transform: `scale(${scale})`,
    transformOrigin: "50% 50%",
    willChange: "transform",
  }}>
    {children}
  </AbsoluteFill>
);

// ─── CENA 1 — Wireframe grid + "sozinha." ─────────────────────────────────────
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // câmera: hint de orbit suave 0→5°
  const camAngle = ci(frame, [0, 150], [0, 5], Easing.inOut(Easing.cubic));

  // grid de linhas wireframe
  const gridOp = ci(frame, [0, 20], [0, 1]);
  const gridScale = spring({ frame, fps, config: SPRING.camera });

  // LABEL "ÁREA DE MEMBROS"
  const labelStyle = frame < 120 ? entryFrom(frame, "top", 20, 14) : exitTo(frame, 120, "top");

  // "não vende" subhead
  const sub1 = frame < 120 ? entryFrom(Math.max(0, frame - 8), "bottom", 16, 18) : exitTo(frame, 120, "top", 1200, 16);

  // "sozinha." HERO RED — word-by-word com 3f stagger
  const heroWords = ["sozinha."];
  const HERO_START = 8;
  const EXIT_HERO = 130;

  // saída da cena
  const sceneExit = frame >= EXIT_HERO;

  return (
    <CameraOrbit angle={camAngle}>
      <SceneBackground glowStrength={0.8} />

      {/* Wireframe grid SVG */}
      <AbsoluteFill style={{ opacity: gridOp, willChange: "opacity" }}>
        <svg width="100%" height="100%" style={{ position: "absolute" }}>
          {/* linhas horizontais */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1="0" y1={`${(i + 1) * 8.33}%`}
              x2="100%" y2={`${(i + 1) * 8.33}%`}
              stroke={BORDER} strokeWidth="0.5" opacity="0.6"
            />
          ))}
          {/* linhas verticais */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={`${(i + 1) * 16.66}%`} y1="0"
              x2={`${(i + 1) * 16.66}%`} y2="100%"
              stroke={BORDER} strokeWidth="0.5" opacity="0.6"
            />
          ))}
          {/* nó central pulsante */}
          <circle
            cx="50%" cy="42%"
            r={`${3 + redGlow(frame, 0, 1.5, 0.08)}%`}
            fill="none"
            stroke={RED}
            strokeWidth="1"
            opacity={0.3 + redGlow(frame, 0, 0.2, 0.08)}
          />
        </svg>
      </AbsoluteFill>

      {/* LABEL */}
      <div style={{
        position: "absolute",
        top: PAD_TOP,
        left: SAFE_X,
        right: SAFE_X,
        ...labelStyle,
        willChange: "transform, opacity, filter",
      }}>
        <span style={{
          ...TYPE.LABEL,
          fontFamily: FONT,
          color: GRAY,
          letterSpacing: 5,
        }}>ÁREA DE MEMBROS</span>
      </div>

      {/* "não vende" subhead */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 80,
        left: SAFE_X,
        right: SAFE_X,
        ...sub1,
        willChange: "transform, opacity, filter",
      }}>
        <span style={{
          ...TYPE.HEADLINE,
          fontFamily: FONT,
          color: WHITE,
        }}>não vende</span>
      </div>

      {/* "sozinha." HERO — em vermelho */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 180,
        left: SAFE_X,
        right: SAFE_X,
        display: "flex",
        flexWrap: "wrap",
      }}>
        {heroWords.map((word, i) => {
          const delay = HERO_START + i * 3;
          const f = frame - delay;
          const entryOp = ci(f, [0, 16], [0, 1]);
          const entryY  = ci(f, [0, 20], [28, 0], Easing.out(Easing.cubic));
          const entryBlur = ci(f, [0, 9], [14, 0], Easing.out(Easing.quad));
          const exitStyle = sceneExit ? exitTo(frame, EXIT_HERO, "left") : {};
          return (
            <span
              key={i}
              style={{
                ...TYPE.DISPLAY,
                fontFamily: FONT,
                color: RED,
                display: "inline-block",
                marginRight: "0.18em",
                opacity: entryOp,
                transform: `translateY(${entryY}px)`,
                filter: `blur(${entryBlur}px)`,
                ...(sceneExit && {
                  opacity: (exitStyle as any).opacity,
                  transform: (exitStyle as any).transform,
                  filter: (exitStyle as any).filter,
                }),
                willChange: "transform, opacity, filter",
                textShadow: `0 0 60px rgba(139,47,190,0.5)`,
              }}
            >{word}</span>
          );
        })}
      </div>

      {/* texto corpo word-by-word */}
      {(() => {
        const bodyWords = ["Você pode ter plataforma.", "layout.", "vídeo gravado.", "link na bio."];
        return (
          <div style={{
            position: "absolute",
            top: PAD_TOP + 420,
            left: SAFE_X,
            right: SAFE_X,
            display: "flex",
            flexWrap: "wrap",
            gap: "0 0.3em",
          }}>
            {bodyWords.map((w, i) => {
              const delay = 18 + i * 6;
              const f = frame - delay;
              const op  = ci(f, [0, 14], [0, 1]);
              const y   = ci(f, [0, 16], [12, 0], Easing.out(Easing.cubic));
              const bl  = ci(f, [0, 8],  [8, 0],  Easing.out(Easing.quad));
              const ex  = sceneExit ? exitTo(frame, EXIT_HERO + i * 2, "left") : {};
              return (
                <span key={i} style={{
                  ...TYPE.BODY,
                  fontFamily: FONT,
                  color: GRAY,
                  display: "inline-block",
                  opacity: sceneExit ? (ex as any).opacity : op,
                  transform: sceneExit ? (ex as any).transform : `translateY(${y}px)`,
                  filter: sceneExit ? (ex as any).filter : `blur(${bl}px)`,
                  willChange: "transform, opacity, filter",
                }}>{w}</span>
              );
            })}
          </div>
        );
      })()}
    </CameraOrbit>
  );
};

// ─── CENA 2 — Card isométrico + "FICA PARADO" ──────────────────────────────────
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // câmera: dolly in suave
  const dollyScale = ci(frame, [0, 177], [1.0, 1.08], Easing.inOut(Easing.cubic));

  // card isométrico
  const cardSp = spring({ frame, fps, config: SPRING.card, from: 0.85, to: 1 });
  const cardOp = ci(frame, [0, 20], [0, 1]);

  // "FICA PARADO" 110px — stagger palavra a palavra
  const words = ["FICA", "PARADO"];
  const IMPACT_START = 8;
  const EXIT_F = 157;

  const items = [
    { icon: "⛔", label: "sem funil" },
    { icon: "⛔", label: "sem tráfego" },
    { icon: "⛔", label: "sem fechador" },
  ];

  return (
    <CameraDolly scale={dollyScale}>
      <SceneBackground glowStrength={1.2} />

      {/* Card principal isométrico */}
      <div style={{
        position: "absolute",
        top: 500,
        left: SAFE_X,
        right: SAFE_X,
        height: 380,
        background: CARD_1,
        border: `1px solid ${BORDER}`,
        borderRadius: 24,
        transform: frame < EXIT_F ? `scale(${cardSp})` : (exitTo(frame, EXIT_F, "bottom") as any).transform,
        opacity: frame < EXIT_F ? cardOp : (exitTo(frame, EXIT_F, "bottom") as any).opacity,
        filter: frame < EXIT_F ? undefined : (exitTo(frame, EXIT_F, "bottom") as any).filter,
        willChange: "transform, opacity",
        padding: "40px 48px",
      }}>
        <div style={{
          fontFamily: FONT,
          color: GRAY,
          ...TYPE.LABEL,
          marginBottom: 24,
        }}>CURSO ONLINE</div>

        {/* itens bloqueados */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map((item, i) => {
            const f = frame - (i * 6);
            const op = ci(f, [5, 18], [0, 1]);
            const x  = ci(f, [5, 20], [-20, 0], Easing.out(Easing.cubic));
            return (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: op,
                transform: `translateX(${x}px)`,
                willChange: "transform, opacity",
              }}>
                <span style={{ fontSize: 28 }}>{item.icon}</span>
                <span style={{ fontFamily: FONT, ...TYPE.BODY, color: GRAY, textDecoration: "line-through" }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* "FICA PARADO" IMPACT */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 120,
        left: SAFE_X,
        right: SAFE_X,
        display: "flex",
        flexWrap: "wrap",
        gap: "0 0.2em",
      }}>
        {words.map((word, i) => {
          const delay = IMPACT_START + i * 4;
          const f = frame - delay;
          const op   = ci(f, [0, 16], [0, 1]);
          const y    = ci(f, [0, 20], [24, 0], Easing.out(Easing.cubic));
          const blur = ci(f, [0, 9],  [12, 0], Easing.out(Easing.quad));
          const ex   = frame >= EXIT_F ? exitTo(frame, EXIT_F + i * 3, "top") : {};
          return (
            <span key={i} style={{
              fontSize: 110,
              fontWeight: 900,
              fontFamily: FONT,
              letterSpacing: -4,
              color: WHITE,
              display: "inline-block",
              opacity: frame >= EXIT_F ? (ex as any).opacity : op,
              transform: frame >= EXIT_F ? (ex as any).transform : `translateY(${y}px)`,
              filter: frame >= EXIT_F ? (ex as any).filter : `blur(${blur}px)`,
              willChange: "transform, opacity, filter",
            }}>{word}</span>
          );
        })}
      </div>
    </CameraDolly>
  );
};

// ─── CENA 3 — Dois cards comparação + CountUp ──────────────────────────────────
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // câmera: pan horizontal suave
  const panX = ci(frame, [0, 187], [30, -15], Easing.inOut(Easing.cubic));

  const EXIT_F = 170;

  const cards = [
    { label: "CURSO ONLINE", value: 5000, prefix: "R$", suffix: "k/vaga", accent: GRAY },
    { label: "MENTORIA",     value: 10000, prefix: "R$", suffix: "k/vaga", accent: RED },
  ];

  return (
    <AbsoluteFill style={{ transform: `translateX(${panX}px)`, willChange: "transform" }}>
      <SceneBackground glowStrength={0.9} />

      {/* Headline */}
      <div style={{
        position: "absolute",
        top: PAD_TOP,
        left: SAFE_X,
        right: SAFE_X,
        ...(frame >= EXIT_F ? exitTo(frame, EXIT_F, "top") : entryFrom(frame, "top", 20, 16)),
        willChange: "transform, opacity, filter",
      }}>
        <span style={{ ...TYPE.SUBHEAD, fontFamily: FONT, color: GRAY }}>
          O mercado já mostrou o resultado.
        </span>
      </div>

      {/* Cards side by side */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 200,
        left: SAFE_X,
        right: SAFE_X,
        display: "flex",
        gap: 20,
      }}>
        {cards.map((card, i) => {
          const delay = 15 + i * 10;
          const f = frame - delay;
          const cardOp    = ci(f, [0, 20], [0, 1]);
          const cardY     = ci(f, [0, 24], [40, 0], Easing.out(Easing.cubic));
          const cardBlur  = ci(f, [0, 10], [14, 0], Easing.out(Easing.quad));
          const isRed = card.accent === RED;
          const ex = frame >= EXIT_F ? exitTo(frame, EXIT_F + i * 4, i === 0 ? "left" : "right") : {};

          const displayVal = countUp(Math.max(0, frame - delay - 20), card.value / 1000, 80);

          return (
            <div key={i} style={{
              flex: 1,
              background: CARD_1,
              border: `1.5px solid ${isRed ? RED : BORDER}`,
              borderRadius: 20,
              padding: "36px 32px",
              boxShadow: isRed ? `0 0 40px rgba(139,47,190,0.20)` : "none",
              opacity: frame >= EXIT_F ? (ex as any).opacity : cardOp,
              transform: frame >= EXIT_F ? (ex as any).transform : `translateY(${cardY}px)`,
              filter: frame >= EXIT_F ? (ex as any).filter : `blur(${cardBlur}px)`,
              willChange: "transform, opacity, filter",
            }}>
              <div style={{ ...TYPE.LABEL, fontFamily: FONT, color: isRed ? RED : GRAY, marginBottom: 24 }}>
                {card.label}
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: -2, color: isRed ? RED : WHITE }}>
                {card.prefix}{displayVal}{card.suffix}
              </div>
              {isRed && (
                <div style={{ ...TYPE.CAPTION, fontFamily: FONT, color: GRAY, marginTop: 16 }}>
                  sem concorrência saturada
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Linha extra de contexto */}
      {(() => {
        const f = frame - 60;
        const style = frame >= EXIT_F
          ? exitTo(frame, EXIT_F + 8, "bottom")
          : { opacity: ci(f, [0, 16], [0, 1]), transform: `translateY(${ci(f, [0, 18], [12, 0], Easing.out(Easing.cubic))}px)`, filter: `blur(${ci(f, [0, 8], [8, 0], Easing.out(Easing.quad))}px)` };
        return (
          <div style={{
            position: "absolute",
            top: PAD_TOP + 600,
            left: SAFE_X,
            right: SAFE_X,
            ...style,
            willChange: "transform, opacity, filter",
          }}>
            <span style={{ ...TYPE.BODY, fontFamily: FONT, color: GRAY }}>
              Não tem guerra de preço com infoproduto de R$97.
            </span>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ─── CENA 4 — Cronômetro + "21 DIAS" ──────────────────────────────────────────
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // câmera: crane up (sobe suavemente)
  const craneY = ci(frame, [0, 187], [40, 0], Easing.out(Easing.cubic));

  const EXIT_F = 167;

  // ponteiro do cronômetro
  const tickDeg = (frame * 6) % 360;  // 1 volta/segundo a 30fps = 6°/frame ... muito rápido
  // usar 2 rpm = 12°/frame seria muito. Usar 0.5 volta/s = 3°/frame
  const secondHand = (frame * 3) % 360;
  const minuteHand = (frame * 0.05) % 360;

  return (
    <AbsoluteFill style={{ transform: `translateY(${craneY}px)`, willChange: "transform" }}>
      <SceneBackground glowStrength={1.1} />

      {/* "21 DIAS" mega text */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 80,
        left: SAFE_X,
        right: SAFE_X,
        willChange: "transform, opacity, filter",
      }}>
        {[
          { text: "21", color: RED, size: 220, weight: 900, ls: -8 },
          { text: "DIAS", color: WHITE, size: 80, weight: 700, ls: -2 },
        ].map(({ text, color, size, weight, ls }, i) => {
          const delay = 5 + i * 5;
          const f = frame - delay;
          const op   = ci(f, [0, 18], [0, 1]);
          const y    = ci(f, [0, 22], [30, 0], Easing.out(Easing.cubic));
          const blur = ci(f, [0, 10], [14, 0], Easing.out(Easing.quad));
          const ex   = frame >= EXIT_F ? exitTo(frame, EXIT_F + i * 4, "right") : {};
          return (
            <div key={i} style={{
              fontFamily: FONT,
              fontSize: size,
              fontWeight: weight,
              letterSpacing: ls,
              color,
              lineHeight: 1,
              display: "block",
              opacity: frame >= EXIT_F ? (ex as any).opacity : op,
              transform: frame >= EXIT_F ? (ex as any).transform : `translateY(${y}px)`,
              filter: frame >= EXIT_F ? (ex as any).filter : `blur(${blur}px)`,
              ...(color === RED && { textShadow: `0 0 80px rgba(139,47,190,0.6)` }),
              willChange: "transform, opacity, filter",
            }}>{text}</div>
          );
        })}
      </div>

      {/* Cronômetro SVG */}
      {(() => {
        const f = frame - 15;
        const clockOp = ci(f, [0, 20], [0, 1]);
        const clockY  = ci(f, [0, 24], [50, 0], Easing.out(Easing.cubic));
        const clockBlur = ci(f, [0, 10], [12, 0], Easing.out(Easing.quad));
        const ex = frame >= EXIT_F ? exitTo(frame, EXIT_F + 6, "left") : {};
        return (
          <div style={{
            position: "absolute",
            top: PAD_TOP + 480,
            left: "50%",
            transform: frame >= EXIT_F
              ? `translateX(-50%) ${(ex as any).transform || ""}`
              : `translateX(-50%) translateY(${clockY}px)`,
            opacity: frame >= EXIT_F ? (ex as any).opacity : clockOp,
            filter: frame >= EXIT_F ? (ex as any).filter : `blur(${clockBlur}px)`,
            willChange: "transform, opacity, filter",
          }}>
            <svg width="260" height="260" viewBox="0 0 260 260">
              {/* Face */}
              <circle cx="130" cy="130" r="120" fill={CARD_1} stroke={BORDER} strokeWidth="2" />
              <circle cx="130" cy="130" r="115" fill="none" stroke={BORDER} strokeWidth="0.5" />
              {/* Marcas dos minutos */}
              {Array.from({ length: 60 }).map((_, i) => {
                const a = (i * 6 - 90) * (Math.PI / 180);
                const r1 = i % 5 === 0 ? 100 : 107;
                const r2 = 113;
                return (
                  <line
                    key={i}
                    x1={130 + r1 * Math.cos(a)} y1={130 + r1 * Math.sin(a)}
                    x2={130 + r2 * Math.cos(a)} y2={130 + r2 * Math.sin(a)}
                    stroke={i % 5 === 0 ? WHITE : BORDER}
                    strokeWidth={i % 5 === 0 ? 2 : 0.8}
                  />
                );
              })}
              {/* Ponteiro dos minutos */}
              {(() => {
                const a = (minuteHand - 90) * (Math.PI / 180);
                return <line x1="130" y1="130" x2={130 + 80 * Math.cos(a)} y2={130 + 80 * Math.sin(a)} stroke={GRAY} strokeWidth="2" strokeLinecap="round" />;
              })()}
              {/* Ponteiro dos segundos (vermelho) */}
              {(() => {
                const a = (secondHand - 90) * (Math.PI / 180);
                return (
                  <>
                    <line x1="130" y1="130" x2={130 + 100 * Math.cos(a)} y2={130 + 100 * Math.sin(a)} stroke={RED} strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="130" y1="130" x2={130 - 20 * Math.cos(a)} y2={130 - 20 * Math.sin(a)} stroke={RED} strokeWidth="1.5" />
                  </>
                );
              })()}
              {/* Centro */}
              <circle cx="130" cy="130" r="5" fill={RED} />
            </svg>
          </div>
        );
      })()}

      {/* Texto contexto */}
      {(() => {
        const f = frame - 20;
        const op   = ci(f, [0, 16], [0, 1]);
        const y    = ci(f, [0, 18], [10, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 8],  [8, 0],  Easing.out(Easing.quad));
        const ex   = frame >= EXIT_F ? exitTo(frame, EXIT_F + 10, "bottom") : {};
        return (
          <div style={{
            position: "absolute",
            top: PAD_TOP + 420,
            left: SAFE_X,
            right: SAFE_X,
            opacity: frame >= EXIT_F ? (ex as any).opacity : op,
            transform: frame >= EXIT_F ? (ex as any).transform : `translateY(${y}px)`,
            filter: frame >= EXIT_F ? (ex as any).filter : `blur(${blur}px)`,
            willChange: "transform, opacity, filter",
          }}>
            <span style={{ ...TYPE.SUBHEAD, fontFamily: FONT, color: GRAY }}>
              a Magna constrói sua estrutura completa
            </span>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ─── CENA 5 — Fluxograma + FECHADOR ──────────────────────────────────────────
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // câmera: orbit invertido (ângulo oposto à cena 1)
  const camAngle = ci(frame, [0, 217], [-5, 0], Easing.inOut(Easing.cubic));

  const EXIT_F = 197;

  const nodes = [
    { label: "FUNIL",    x: 90,  y: 520,  delay: 0  },
    { label: "TRÁFEGO",  x: 540, y: 520,  delay: 8  },
    { label: "PÁGINA",   x: 90,  y: 720,  delay: 16 },
    { label: "FECHADOR", x: 540, y: 720,  delay: 24, isRed: true },
  ];

  const connections = [
    { x1: 180, y1: 540, x2: 450, y2: 540 },
    { x1: 180, y1: 740, x2: 450, y2: 740 },
    { x1: 130, y1: 600, x2: 130, y2: 660 },
    { x1: 580, y1: 600, x2: 580, y2: 660 },
  ];

  return (
    <CameraOrbit angle={camAngle}>
      <SceneBackground glowStrength={1.3} />

      {/* Headline */}
      <div style={{
        position: "absolute",
        top: PAD_TOP,
        left: SAFE_X,
        right: SAFE_X,
        ...(frame >= EXIT_F ? exitTo(frame, EXIT_F, "left") : entryFrom(frame, "left", 30, 18)),
        willChange: "transform, opacity, filter",
      }}>
        <span style={{ ...TYPE.HEADLINE, fontFamily: FONT, color: WHITE }}>
          A estrutura que fecha por você
        </span>
      </div>

      {/* Conexões SVG */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg width="100%" height="100%">
          {connections.map((conn, i) => {
            const f = frame - (i * 5 + 20);
            const progress = ci(f, [0, 20], [0, 1]);
            const x2 = conn.x1 + (conn.x2 - conn.x1) * progress;
            const y2 = conn.y1 + (conn.y2 - conn.y1) * progress;
            return (
              <line
                key={i}
                x1={conn.x1} y1={conn.y1}
                x2={x2} y2={y2}
                stroke={i === 3 ? RED : BORDER}
                strokeWidth={i === 3 ? 2 : 1}
                strokeDasharray={i === 3 ? "none" : "4 4"}
                opacity={0.6}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Nós */}
      {nodes.map((node, i) => {
        const f = frame - node.delay;
        const nodeSp = spring({ frame: f, fps, config: SPRING.badge, from: 0.8, to: 1 });
        const nodeOp = ci(f, [0, 14], [0, 1]);
        const ex = frame >= EXIT_F ? exitTo(frame, EXIT_F + node.delay / 2, i % 2 === 0 ? "left" : "right") : {};
        const isRed = (node as any).isRed;
        return (
          <div key={i} style={{
            position: "absolute",
            top: node.y,
            left: node.x,
            width: 160,
            height: 80,
            background: isRed ? `rgba(139,47,190,0.12)` : CARD_2,
            border: `1.5px solid ${isRed ? RED : BORDER}`,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: frame >= EXIT_F ? (ex as any).transform : `scale(${nodeSp})`,
            opacity: frame >= EXIT_F ? (ex as any).opacity : nodeOp,
            filter: frame >= EXIT_F ? (ex as any).filter : undefined,
            boxShadow: isRed ? `0 0 30px rgba(139,47,190,0.25)` : "none",
            willChange: "transform, opacity",
          }}>
            <span style={{
              ...TYPE.LABEL,
              fontFamily: FONT,
              color: isRed ? RED : WHITE,
              fontSize: 16,
            }}>{node.label}</span>
          </div>
        );
      })}

      {/* Texto rodapé */}
      {(() => {
        const f = frame - 60;
        const op   = ci(f, [0, 16], [0, 1]);
        const y    = ci(f, [0, 18], [12, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 8],  [8, 0],  Easing.out(Easing.quad));
        const ex   = frame >= EXIT_F ? exitTo(frame, EXIT_F + 12, "bottom") : {};
        return (
          <div style={{
            position: "absolute",
            top: 920,
            left: SAFE_X,
            right: SAFE_X,
            opacity: frame >= EXIT_F ? (ex as any).opacity : op,
            transform: frame >= EXIT_F ? (ex as any).transform : `translateY(${y}px)`,
            filter: frame >= EXIT_F ? (ex as any).filter : `blur(${blur}px)`,
            willChange: "transform, opacity, filter",
          }}>
            <span style={{ ...TYPE.BODY, fontFamily: FONT, color: GRAY }}>
              Um fechador vendendo no seu lugar.
            </span>
          </div>
        );
      })()}
    </CameraOrbit>
  );
};

// ─── CENA 6 — Progress bar R$50k ──────────────────────────────────────────────
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // câmera: dolly out suave
  const dollyScale = ci(frame, [0, 247], [1.08, 1.0], Easing.out(Easing.cubic));

  const EXIT_F = 227;

  // progress bar de 0 → 1 em 180 frames com ease
  const progressF = Math.max(0, frame - 30);
  const progress = ci(progressF, [0, 180], [0, 1], Easing.inOut(Easing.cubic));

  // valor display R$0 → R$50.000
  const displayValue = Math.round(progress * 50000);

  // glow da cabeça da barra pulsante
  const headGlow = redGlow(frame, 0.5, 0.2, 0.12);

  return (
    <CameraDolly scale={dollyScale}>
      <SceneBackground glowStrength={1.0} />

      {/* Label meta */}
      <div style={{
        position: "absolute",
        top: PAD_TOP,
        left: SAFE_X,
        right: SAFE_X,
        ...(frame >= EXIT_F ? exitTo(frame, EXIT_F, "top") : entryFrom(frame, "top", 20, 16)),
        willChange: "transform, opacity, filter",
      }}>
        <span style={{ ...TYPE.LABEL, fontFamily: FONT, color: GRAY }}>
          ACOMPANHA ATÉ BATER
        </span>
      </div>

      {/* Número grande */}
      {(() => {
        const f = frame - 10;
        const op   = ci(f, [0, 18], [0, 1]);
        const y    = ci(f, [0, 22], [28, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 10], [14, 0], Easing.out(Easing.quad));
        const ex   = frame >= EXIT_F ? exitTo(frame, EXIT_F, "right") : {};
        return (
          <div style={{
            position: "absolute",
            top: PAD_TOP + 80,
            left: SAFE_X,
            right: SAFE_X,
            opacity: frame >= EXIT_F ? (ex as any).opacity : op,
            transform: frame >= EXIT_F ? (ex as any).transform : `translateY(${y}px)`,
            filter: frame >= EXIT_F ? (ex as any).filter : `blur(${blur}px)`,
            willChange: "transform, opacity, filter",
          }}>
            <span style={{
              fontFamily: FONT,
              fontSize: 120,
              fontWeight: 900,
              letterSpacing: -4,
              color: RED,
              textShadow: `0 0 80px rgba(139,47,190,0.6)`,
            }}>
              R${displayValue >= 1000
                ? `${Math.floor(displayValue / 1000)}.${String(displayValue % 1000).padStart(3, "0")}`
                : displayValue}
            </span>
          </div>
        );
      })()}

      {/* Barra de progresso */}
      {(() => {
        const f = frame - 20;
        const op   = ci(f, [0, 16], [0, 1]);
        const y    = ci(f, [0, 20], [30, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 8],  [12, 0], Easing.out(Easing.quad));
        const ex   = frame >= EXIT_F ? exitTo(frame, EXIT_F + 5, "left") : {};
        const barWidth = 1080 - SAFE_X * 2;
        const fillW = progress * barWidth;
        return (
          <div style={{
            position: "absolute",
            top: PAD_TOP + 300,
            left: SAFE_X,
            right: SAFE_X,
            opacity: frame >= EXIT_F ? (ex as any).opacity : op,
            transform: frame >= EXIT_F ? (ex as any).transform : `translateY(${y}px)`,
            filter: frame >= EXIT_F ? (ex as any).filter : `blur(${blur}px)`,
            willChange: "transform, opacity, filter",
          }}>
            {/* Track */}
            <div style={{
              width: "100%",
              height: 12,
              background: CARD_2,
              borderRadius: 6,
              position: "relative",
              overflow: "visible",
            }}>
              {/* Fill */}
              <div style={{
                position: "absolute",
                top: 0, left: 0,
                width: `${progress * 100}%`,
                height: "100%",
                background: `linear-gradient(90deg, rgba(139,47,190,0.7) 0%, ${RED} 100%)`,
                borderRadius: 6,
                boxShadow: `0 0 20px rgba(139,47,190,${headGlow})`,
              }} />
              {/* Cabeça brilhante */}
              {progress > 0 && (
                <div style={{
                  position: "absolute",
                  top: -8,
                  left: `calc(${progress * 100}% - 14px)`,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: RED,
                  boxShadow: `0 0 30px rgba(139,47,190,${headGlow + 0.3}), 0 0 60px rgba(139,47,190,${headGlow})`,
                }} />
              )}
            </div>

            {/* Labels */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}>
              <span style={{ ...TYPE.CAPTION, fontFamily: FONT, color: GRAY }}>R$0</span>
              <span style={{ ...TYPE.CAPTION, fontFamily: FONT, color: GRAY }}>R$50.000</span>
            </div>
          </div>
        );
      })()}

      {/* Checklist visual */}
      {["área de membros", "funil", "anúncios", "página de vendas"].map((item, i) => {
        const delay = 50 + i * 10;
        const f = frame - delay;
        const op   = ci(f, [0, 14], [0, 1]);
        const x    = ci(f, [0, 16], [-20, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 7],  [8, 0],   Easing.out(Easing.quad));
        const ex   = frame >= EXIT_F ? exitTo(frame, EXIT_F + i * 3 + 10, "bottom") : {};
        return (
          <div key={i} style={{
            position: "absolute",
            top: PAD_TOP + 430 + i * 70,
            left: SAFE_X,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: frame >= EXIT_F ? (ex as any).opacity : op,
            transform: frame >= EXIT_F ? (ex as any).transform : `translateX(${x}px)`,
            filter: frame >= EXIT_F ? (ex as any).filter : `blur(${blur}px)`,
            willChange: "transform, opacity, filter",
          }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: "50%",
              background: RED,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
              boxShadow: `0 0 12px rgba(139,47,190,0.4)`,
            }}>✓</div>
            <span style={{ ...TYPE.BODY, fontFamily: FONT, color: WHITE }}>{item}</span>
          </div>
        );
      })}
    </CameraDolly>
  );
};

// ─── CENA 7 — CTA Final ────────────────────────────────────────────────────────
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  // câmera: zoom óptico (perspectiva estreita)
  const perspectiveVal = ci(frame, [0, 60], [2000, 1200], Easing.out(Easing.cubic));

  // sweep light no botão: repete a cada 60 frames
  const SWEEP_CYCLE = 60;
  const sweepF = frame % SWEEP_CYCLE;
  const sweepX = ci(sweepF, [0, SWEEP_CYCLE * 0.4], [-120, 400]);
  const sweepOp = sweepF < SWEEP_CYCLE * 0.4
    ? interpolate(sweepF,
        [0, SWEEP_CYCLE * 0.1, SWEEP_CYCLE * 0.35, SWEEP_CYCLE * 0.4],
        [0, 0.6, 0.6, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // card CTA
  const cardSp = spring({ frame, fps: 30, config: SPRING.heavy, from: 0.9, to: 1 });
  const cardOp = ci(frame, [0, 22], [0, 1]);

  // headline word-by-word
  const ctaWords = ["Toca", "no", "botão", "e", "agenda."];

  return (
    <AbsoluteFill style={{
      perspective: perspectiveVal,
      perspectiveOrigin: "50% 50%",
    }}>
      <SceneBackground glowStrength={1.5} />

      {/* Card CTA central */}
      <div style={{
        position: "absolute",
        top: 380,
        left: SAFE_X,
        right: SAFE_X,
        background: CARD_1,
        border: `1.5px solid ${BORDER}`,
        borderRadius: 28,
        padding: "56px 48px",
        transform: `scale(${cardSp})`,
        opacity: cardOp,
        willChange: "transform, opacity",
      }}>
        {/* Logo/Tag */}
        <div style={{ ...TYPE.LABEL, fontFamily: FONT, color: RED, marginBottom: 32 }}>
          MENTORIA MAGNA
        </div>

        {/* Headline word-by-word */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 0.2em", marginBottom: 40 }}>
          {ctaWords.map((word, i) => {
            const delay = 20 + i * 4;
            const f = frame - delay;
            const op   = ci(f, [0, 16], [0, 1]);
            const y    = ci(f, [0, 20], [20, 0], Easing.out(Easing.cubic));
            const blur = ci(f, [0, 8],  [10, 0], Easing.out(Easing.quad));
            return (
              <span key={i} style={{
                ...TYPE.IMPACT,
                fontFamily: FONT,
                color: WHITE,
                display: "inline-block",
                opacity: op,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
                willChange: "transform, opacity, filter",
              }}>{word}</span>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{
          width: "100%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${BORDER}, transparent)`,
          marginBottom: 40,
          opacity: ci(frame - 40, [0, 14], [0, 1]),
        }} />

        {/* Promessa */}
        <div style={{
          ...TYPE.BODY,
          fontFamily: FONT,
          color: GRAY,
          marginBottom: 48,
          opacity: ci(frame - 48, [0, 14], [0, 1]),
        }}>
          Da estrutura completa aos R$50.000.
        </div>

        {/* Botão CTA */}
        {(() => {
          const btnOp = ci(frame - 56, [0, 18], [0, 1]);
          const btnY  = ci(frame - 56, [0, 22], [20, 0], Easing.out(Easing.cubic));
          const btnBlur = ci(frame - 56, [0, 10], [12, 0], Easing.out(Easing.quad));
          return (
            <div style={{
              position: "relative",
              height: 80,
              background: RED,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: `0 0 40px rgba(139,47,190,0.35)`,
              opacity: btnOp,
              transform: `translateY(${btnY}px)`,
              filter: `blur(${btnBlur}px)`,
              willChange: "transform, opacity, filter",
            }}>
              <span style={{
                ...TYPE.HEADLINE,
                fontFamily: FONT,
                color: WHITE,
                fontSize: 40,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}>AGENDA AGORA</span>

              {/* Sweep light */}
              <div style={{
                position: "absolute",
                top: 0,
                left: sweepX,
                width: 80,
                height: "100%",
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,${sweepOp}), transparent)`,
                transform: "skewX(-20deg)",
                pointerEvents: "none",
              }} />
            </div>
          );
        })()}
      </div>

      {/* Janela de prazo */}
      {(() => {
        const f = frame - 70;
        const op   = ci(f, [0, 16], [0, 1]);
        const y    = ci(f, [0, 18], [12, 0], Easing.out(Easing.cubic));
        const blur = ci(f, [0, 8],  [8, 0],  Easing.out(Easing.quad));
        return (
          <div style={{
            position: "absolute",
            top: 1050,
            left: SAFE_X,
            right: SAFE_X,
            opacity: op,
            transform: `translateY(${y}px)`,
            filter: `blur(${blur}px)`,
            textAlign: "center",
            willChange: "transform, opacity, filter",
          }}>
            <span style={{ ...TYPE.CAPTION, fontFamily: FONT, color: GRAY }}>
              A janela tem prazo. Daqui a 5 anos, todo especialista vai ter mentoria no ar.
            </span>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ─── COMPOSIÇÃO PRINCIPAL ──────────────────────────────────────────────────────
export const Ads007: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FONT }}>
      {/* Cena 1: Wireframe + "sozinha." */}
      <Sequence from={SCENES[0].from} durationInFrames={SCENES[0].dur}>
        <Scene1 />
      </Sequence>

      {/* Cena 2: Card isométrico + FICA PARADO */}
      <Sequence from={SCENES[1].from} durationInFrames={SCENES[1].dur}>
        <Scene2 />
      </Sequence>

      {/* Cena 3: Dois cards comparação */}
      <Sequence from={SCENES[2].from} durationInFrames={SCENES[2].dur}>
        <Scene3 />
      </Sequence>

      {/* Cena 4: Cronômetro + 21 DIAS */}
      <Sequence from={SCENES[3].from} durationInFrames={SCENES[3].dur}>
        <Scene4 />
      </Sequence>

      {/* Cena 5: Fluxograma + FECHADOR */}
      <Sequence from={SCENES[4].from} durationInFrames={SCENES[4].dur}>
        <Scene5 />
      </Sequence>

      {/* Cena 6: Progress bar R$50k */}
      <Sequence from={SCENES[5].from} durationInFrames={SCENES[5].dur}>
        <Scene6 />
      </Sequence>

      {/* Cena 7: CTA final */}
      <Sequence from={SCENES[6].from} durationInFrames={SCENES[6].dur}>
        <Scene7 />
      </Sequence>

      {/* Áudio narração — descomente após gerar com TTS */}
      {/* <Audio src={staticFile("ads007-narracao.mp3")} /> */}
    </AbsoluteFill>
  );
};

export default Ads007;
