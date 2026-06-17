/**
 * Scene6 — A Engrenagem Completa
 * dur=87f | EXIT_F=67 | exit: zoom out
 * 6 cards em cascata, stagger individual
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { ci, entryFrom, BackgroundBase, SafeZone } from "../../index";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../design-system";

const EXIT_F = 110;

const CARDS = [
  { label: "PÁGINAS",      num: "01", hot: true  },
  { label: "ANÚNCIOS",     num: "02", hot: true  },
  { label: "ESTRATÉGIA",   num: "03", hot: false },
  { label: "CRM",          num: "04", hot: false },
  { label: "AUTOMAÇÕES",   num: "05", hot: false },
  { label: "INTEGRAÇÕES",  num: "06", hot: false },
];

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();

  const exitProg = ci(frame, [EXIT_F, EXIT_F + 18], [0, 1], Easing.in(Easing.exp));
  const exitStyle: React.CSSProperties = {
    opacity: 1 - exitProg * 0.95,
    transform: `scale(${1 - exitProg * 0.08})`,
    filter: `blur(${exitProg * 10}px)`,
  };

  const labelEntry = entryFrom(frame, "top", 40, 18);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.04)" />

      <SafeZone justify="center">
        <div style={{ ...exitStyle, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Label */}
          <div
            style={{
              ...labelEntry,
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.muted,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            o que você recebe
          </div>

          {/* Cards */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            {CARDS.map((card, i) => {
              const cFrame = Math.max(0, frame - i * 7);
              const cEntry = entryFrom(cFrame, "left", 70, 18);
              const borderColor = card.hot ? `rgba(255,255,255,0.28)` : "rgba(255,255,255,0.08)";
              const bgColor     = card.hot ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.015)";

              return (
                <div
                  key={card.label}
                  style={{
                    ...cEntry,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 24px",
                    border: `1px solid ${borderColor}`,
                    background: bgColor,
                    borderRadius: 3,
                  }}
                >
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: card.hot ? COLORS.white : "rgba(255,255,255,0.20)", minWidth: 26 }}>
                    {card.num}
                  </span>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: card.hot ? COLORS.white : COLORS.offWhite, flex: 1 }}>
                    {card.label}
                  </span>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: card.hot ? COLORS.white : "rgba(255,255,255,0.18)", boxShadow: card.hot ? `0 0 6px rgba(255,255,255,0.50)` : "none" }} />
                </div>
              );
            })}
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
