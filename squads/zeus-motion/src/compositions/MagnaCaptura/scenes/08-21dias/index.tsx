/**
 * Scene8 — O Fator 21 Dias
 * dur=87f | EXIT_F=62 | exit: fade + scale down
 * Clock SVG animado + contagem spring + caption
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, spring, useVideoConfig } from "remotion";
import { ci, entryFrom, BackgroundBase, SafeZone } from "../../index";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../design-system";

const EXIT_F = 100;

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Clock sweep: segundeiro vai de 0° a 360° durante os primeiros 60f
  const sweepDeg = ci(frame, [8, 92], [0, 360], Easing.out(Easing.cubic));

  // Número "21" sobe com spring elástico (entra no frame 22)
  const numSpring = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { stiffness: 180, damping: 14, mass: 1 },
  });

  // Exit
  const exitProg = ci(frame, [EXIT_F, EXIT_F + 18], [0, 1], Easing.in(Easing.exp));
  const exitStyle: React.CSSProperties = {
    opacity: 1 - exitProg * 0.95,
    transform: `scale(${1 - exitProg * 0.06})`,
    filter: `blur(${exitProg * 12}px)`,
  };

  const labelEntry   = entryFrom(frame, "top", 40, 18);
  const clockEntry   = entryFrom(Math.max(0, frame - 4), "bottom", 120, 28);
  const captionEntry = entryFrom(Math.max(0, frame - 40), "bottom", 50, 20);

  // Ponto do segundeiro (raio 82)
  const RADIUS = 82;
  const rad = ((sweepDeg - 90) * Math.PI) / 180;
  const sX = 100 + RADIUS * Math.cos(rad);
  const sY = 100 + RADIUS * Math.sin(rad);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.04)" />

      <SafeZone justify="center">
        <div style={{ ...exitStyle, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Label topo */}
          <div style={{ ...labelEntry, fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.muted, textAlign: "center", marginBottom: 40 }}>
            a estrutura funciona em
          </div>

          {/* Clock SVG */}
          <div style={{ ...clockEntry, marginBottom: 32, opacity: ci(frame, [4, 18], [0, 1]) }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Fundo do relógio */}
              <circle cx="100" cy="100" r="96" fill="rgba(255,255,255,0.03)" stroke={COLORS.gold} strokeWidth="1.5" strokeOpacity="0.35" />

              {/* Marcas de hora */}
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i * 30 - 90) * (Math.PI / 180);
                const x1 = 100 + 76 * Math.cos(a);
                const y1 = 100 + 76 * Math.sin(a);
                const x2 = 100 + 88 * Math.cos(a);
                const y2 = 100 + 88 * Math.sin(a);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={i === 0 ? COLORS.gold : "rgba(255,255,255,0.20)"}
                    strokeWidth={i === 0 ? 2.5 : 1.2}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Ponteiro de hora (fixo — aponta para ~11h) */}
              <line x1="100" y1="100" x2="72" y2="54"
                stroke={COLORS.offWhite} strokeWidth="3" strokeLinecap="round"
                opacity={ci(frame, [8, 20], [0, 1])}
              />

              {/* Ponteiro de minuto (fixo — aponta para ~3h) */}
              <line x1="100" y1="100" x2="158" y2="100"
                stroke={COLORS.offWhite} strokeWidth="2" strokeLinecap="round"
                opacity={ci(frame, [8, 20], [0, 1])}
              />

              {/* Segundeiro (anima) */}
              <line
                x1="100" y1="100" x2={sX} y2={sY}
                stroke={COLORS.offWhite} strokeWidth="1.5" strokeLinecap="round"
                opacity={ci(frame, [8, 18], [0, 1])}
              />

              {/* Ponto do glow no segundeiro */}
              <circle cx={sX} cy={sY} r="4" fill={COLORS.gold} opacity={ci(frame, [8, 18], [0, 1])}>
                <filter id="sec-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </circle>

              {/* Centro */}
              <circle cx="100" cy="100" r="5" fill={COLORS.gold} opacity={ci(frame, [8, 20], [0, 1])} />
              <circle cx="100" cy="100" r="2.5" fill={COLORS.bg} opacity={ci(frame, [8, 20], [0, 1])} />
            </svg>
          </div>

          {/* Número "21" com spring */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 16,
            transform: `scale(${numSpring})`,
            opacity: numSpring,
          }}>
            <span style={{
              fontFamily: FONT_MONO,
              fontSize: 110,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: COLORS.white,
              textShadow: `0 0 40px rgba(255,255,255,0.18)`,
            }}>
              21
            </span>
            <span style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.offWhite,
              paddingBottom: 8,
            }}>
              DIAS.
            </span>
          </div>

          {/* Caption */}
          <div style={{
            ...captionEntry,
            fontFamily: FONT_DISPLAY,
            fontSize: 20,
            fontWeight: 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: COLORS.muted,
            textAlign: "center",
            opacity: (captionEntry.opacity as number ?? 1) * (1 - exitProg),
          }}>
            para seu método estar no ar
          </div>

        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
