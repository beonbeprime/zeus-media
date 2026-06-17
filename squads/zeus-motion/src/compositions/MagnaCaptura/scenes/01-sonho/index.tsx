/**
 * Scene1 — Abertura: Hook de impacto
 * dur=142f (4.7s) | EXIT_F=105 | exit: translateX left
 *
 * Conceito: pergunta-gatilho que ancora o tema imediatamente.
 *
 * Estrutura palavra por palavra:
 *   Frame 0-18:  "VOCÊ JÁ PENSOU"  — peso 300, offWhite, stagger 5f/palavra
 *   Frame 18-36: "EM VENDER"       — peso 300, offWhite, stagger 5f/palavra
 *   Frame 34-48: divider cresce
 *   Frame 46-68: "MENTORIA?"       — hero, 96px, peso 900, branco puro
 *
 * SAFE ZONE: tudo entre y=160 e y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ci, entryFrom, exitTo, exitToNB, mergeStyles, BackgroundBase, SafeZone, Direction } from "../../index";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../design-system";

const EXIT_F   = 105;
const EXIT_DIR: Direction = "left";

const LINE1_WORDS = ["VOCÊ", "JÁ", "PENSOU"];
const LINE2_WORDS = ["EM", "VENDER"];

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  // Sweep luminoso horizontal (lento, luxo)
  const sweepX  = ci(frame, [5, 90], [-600, 1680], (t) => t);
  const sweepOp = ci(frame, [5, 20], [0, 1]) * ci(frame, [EXIT_F, EXIT_F + 12], [1, 0]);

  // Divider cresce entre as frases e o hero
  const dividerW  = ci(frame, [34, 50], [0, 220]);
  const dividerOp = ci(frame, [34, 46], [0, 1]) * ci(frame, [EXIT_F, EXIT_F + 10], [1, 0]);

  // Hero "MENTORIA?" — spring de escala + fade + blur
  const heroEntry = entryFrom(Math.max(0, frame - 46), "bottom", 90, 26);
  const heroExit  = exitTo(frame, EXIT_F + 4, EXIT_DIR, 1100, 18);

  // Saída das linhas superiores
  const block1Exit = exitTo(frame, EXIT_F,     EXIT_DIR, 1100, 18);
  const block2Exit = exitTo(frame, EXIT_F + 2, EXIT_DIR, 1100, 18);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.05)" />

      {/* Sweep de luz */}
      <AbsoluteFill
        style={{
          opacity: sweepOp * 0.06,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
          transform: `translateX(${sweepX - 540}px) skewX(-8deg)`,
          width: 200,
          pointerEvents: "none",
        }}
      />

      <SafeZone justify="center">
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          width: "100%",
        }}>

          {/* Linha 1 — "VOCÊ JÁ PENSOU" — palavra por palavra */}
          <div style={{
            ...block1Exit,
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 18,
            marginBottom: 8,
            flexWrap: "nowrap",
          }}>
            {LINE1_WORDS.map((word, wi) => {
              const wf = Math.max(0, frame - wi * 5);
              const entry = entryFrom(wf, "bottom", 60, 20);
              return (
                <span key={word} style={{
                  ...entry,
                  fontFamily: FONT_DISPLAY,
                  fontSize: 52,
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  color: COLORS.offWhite,
                  display: "inline-block",
                }}>
                  {word}
                </span>
              );
            })}
          </div>

          {/* Linha 2 — "EM VENDER" — palavra por palavra, stagger começa no frame 18 */}
          <div style={{
            ...block2Exit,
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 18,
            marginBottom: 36,
            flexWrap: "nowrap",
          }}>
            {LINE2_WORDS.map((word, wi) => {
              const wf = Math.max(0, frame - 18 - wi * 5);
              const entry = entryFrom(wf, "bottom", 60, 20);
              return (
                <span key={word} style={{
                  ...entry,
                  fontFamily: FONT_DISPLAY,
                  fontSize: 52,
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  color: COLORS.offWhite,
                  display: "inline-block",
                }}>
                  {word}
                </span>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{
            width: dividerW,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
            marginBottom: 36,
            opacity: dividerOp,
          }} />

          {/* Hero — "MENTORIA?" — impacto total */}
          <div style={{
            ...mergeStyles(heroEntry, heroExit),
            textAlign: "center",
          }}>
            <span style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: "0.04em",
              lineHeight: 1.0,
              color: COLORS.white,
              display: "block",
              textShadow: `0 0 60px rgba(255,255,255,0.12)`,
            }}>
              MENTORIA?
            </span>
          </div>

          {/* Eyebrow abaixo do hero — ancora a marca discretamente */}
          <div style={{
            opacity: ci(frame, [72, 88], [0, 1]) * ci(frame, [EXIT_F, EXIT_F + 8], [1, 0]),
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.30em",
            textTransform: "uppercase",
            color: COLORS.muted,
            textAlign: "center",
            marginTop: 28,
          }}>
            MENTORIA MAGNA
          </div>

        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
