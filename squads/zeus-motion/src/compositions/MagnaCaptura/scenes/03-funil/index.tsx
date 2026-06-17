/**
 * Scene3 — O Funil Quebrado
 * dur=87f | EXIT_F=47 | exit: Z-collapse (scale + blur)
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { ci, entryFrom, BackgroundBase, SafeZone } from "../../index";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../design-system";

const EXIT_F = 77;

const FUNNEL_BARS = [
  { label: "VISITANTES",    pct: 100, hot: false },
  { label: "LEADS",         pct: 40,  hot: false },
  { label: "INTERESSADOS",  pct: 15,  hot: false },
  { label: "COMPRADORES",   pct: 2,   hot: true  },
];

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  // Z-collapse na saída
  const exitProg = ci(frame, [EXIT_F, EXIT_F + 18], [0, 1], Easing.in(Easing.exp));
  const collapseStyle: React.CSSProperties = {
    opacity: 1 - exitProg,
    transform: `scale(${1 - exitProg * 0.08})`,
    filter: `blur(${exitProg * 14}px)`,
  };

  const titleEntry = entryFrom(frame, "top", 40, 18);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,59,48,0.05)" />

      <SafeZone justify="center">
        <div style={{ ...collapseStyle, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Título */}
          <div
            style={{
              ...titleEntry,
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.muted,
              textAlign: "center",
              marginBottom: 44,
            }}
          >
            seu funil hoje
          </div>

          {/* Barras */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
            {FUNNEL_BARS.map((bar, i) => {
              const barFrame = Math.max(0, frame - i * 6);
              const barEntry = entryFrom(barFrame, "left", 80, 18);
              const barW = ci(frame, [6 + i * 6, 26 + i * 6], [0, (bar.pct / 100) * 720]);

              return (
                <div key={bar.label} style={{ ...barEntry, width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontFamily: FONT_DISPLAY,
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: bar.hot ? COLORS.red : COLORS.muted,
                    }}
                  >
                    <span>{bar.label}</span>
                    <span style={{ fontFamily: FONT_MONO, color: bar.hot ? COLORS.red : COLORS.muted }}>
                      {bar.pct}%
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                    <div
                      style={{
                        width: barW,
                        height: "100%",
                        borderRadius: 2,
                        background: bar.hot
                          ? `linear-gradient(90deg, ${COLORS.red}, rgba(255,59,48,0.4))`
                          : "rgba(255,255,255,0.28)",
                        boxShadow: bar.hot ? `0 0 8px ${COLORS.red}` : "none",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnóstico */}
          <div
            style={{
              marginTop: 48,
              opacity: ci(frame, [34, 46], [0, 1]),
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: FONT_DISPLAY,
                fontSize: 42,
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: `linear-gradient(135deg, ${COLORS.red}, #FF6B6B)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              funil rodando?
            </span>
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
