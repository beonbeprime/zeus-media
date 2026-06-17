/**
 * Scene2 — O Caos do Passado
 * dur=87f (2.9s) | EXIT_F=62 | exit: translateY top
 *
 * 4 cards empilhados verticalmente.
 * Cada card entra UM POR VEZ com blur/smooth BRABO — stagger de 8f entre cards.
 * Zero shake. Zero noise. Puro luxo.
 *
 * SAFE ZONE: conteúdo entre y=160 e y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ci, entryFrom, exitTo, mergeStyles, BackgroundBase, SafeZone, Direction } from "../../index";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../design-system";

const EXIT_F   = 100;
const EXIT_DIR: Direction = "top";

const CARDS = [
  { label: "ESTUDAR",       num: "01", accent: false },
  { label: "APRENDER",      num: "02", accent: false },
  { label: "EXECUTAR",      num: "03", accent: false },
  { label: "MÃO NA MASSA",  num: "04", accent: false },
];

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  // Header entra primeiro
  const headerEntry = entryFrom(frame, "top", 40, 18);
  const headerExit  = exitTo(frame, EXIT_F, EXIT_DIR, 700, 16);

  // Sub-linha inferior entra depois dos cards
  const subFrame = Math.max(0, frame - 46);
  const subEntry  = entryFrom(subFrame, "bottom", 40, 18);
  const subExit   = exitTo(frame, EXIT_F + 2, EXIT_DIR, 700, 16);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,59,48,0.05)" />

      <SafeZone justify="center">
        {/* Header */}
        <div
          style={{
            ...mergeStyles(headerEntry, headerExit),
            fontFamily: FONT_DISPLAY,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: COLORS.muted,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          o que você já tentou fazer
        </div>

        {/* Cards — um por um com stagger limpo */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          {CARDS.map((card, i) => {
            // Cada card começa a entrar i*8 frames depois
            const cardFrame  = Math.max(0, frame - i * 8);
            const cardEntry  = entryFrom(cardFrame, "right", 90, 20);
            const cardExit   = exitTo(frame, EXIT_F + i * 2, EXIT_DIR, 800, 16);

            return (
              <div
                key={card.label}
                style={{
                  ...mergeStyles(cardEntry, cardExit),
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "22px 28px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.025)",
                  borderRadius: 3,
                }}
              >
                {/* Número */}
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 15,
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.05em",
                    minWidth: 30,
                  }}
                >
                  {card.num}
                </span>

                {/* Label */}
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 34,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: COLORS.offWhite,
                    flex: 1,
                  }}
                >
                  {card.label}
                </span>

                {/* Traço decorativo direita */}
                <div
                  style={{
                    width: 24,
                    height: 1,
                    background: "rgba(255,255,255,0.15)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Sub-texto — resultado */}
        <div
          style={{
            ...mergeStyles(subEntry, subExit),
            marginTop: 32,
            fontFamily: FONT_DISPLAY,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: COLORS.red,
            textAlign: "center",
          }}
        >
          resultado: zero
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
