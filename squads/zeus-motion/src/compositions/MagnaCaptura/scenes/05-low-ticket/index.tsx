/**
 * Scene5 — A Máquina de Low Ticket
 * dur=87f | EXIT_F=67 | exit: fade + scale down
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { ci, entryFrom, BackgroundBase, SafeZone } from "../../index";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../design-system";

const EXIT_F = 110;

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  const BARS = [28, 46, 65, 82, 70, 95];
  const chartProg = ci(frame, [22, 50], [0, 1], Easing.out(Easing.cubic));
  const leadsCount = Math.round(ci(frame, [28, 62], [0, 1247], Easing.out(Easing.cubic)));

  const exitProg = ci(frame, [EXIT_F, EXIT_F + 18], [0, 1], Easing.in(Easing.exp));
  const exitStyle: React.CSSProperties = {
    opacity: 1 - exitProg * 0.95,
    transform: `scale(${1 - exitProg * 0.05})`,
    filter: `blur(${exitProg * 10}px)`,
  };

  const labelEntry  = entryFrom(frame, "top", 40, 18);
  const notebEntry  = entryFrom(Math.max(0, frame - 6), "bottom", 100, 28);
  const captionEntry = entryFrom(Math.max(0, frame - 32), "bottom", 40, 18);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.04)" />

      <SafeZone justify="center">
        <div style={{ ...exitStyle, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Label topo */}
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
              marginBottom: 36,
            }}
          >
            apresentando
          </div>

          {/* Notebook mockup */}
          <div
            style={{
              ...notebEntry,
              width: 660,
              background: "rgba(14,14,18,0.96)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {/* Barra de título */}
            <div style={{ height: 38, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 16, gap: 7 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,59,48,0.5)" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,204,0,0.5)" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(52,199,89,0.5)" }} />
            </div>

            {/* Conteúdo */}
            <div style={{ padding: "24px 28px 28px" }}>
              {/* Título na tela */}
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: COLORS.white,
                  marginBottom: 20,
                  opacity: ci(frame, [18, 30], [0, 1]),
                }}
              >
                MÁQUINA DE LOW TICKET
              </div>

              {/* Chart */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, marginBottom: 18, opacity: ci(frame, [22, 35], [0, 1]) }}>
                {BARS.map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h * chartProg}%`, background: i === 5 ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.10)", borderRadius: "2px 2px 0 0", boxShadow: i === 5 ? `0 0 6px rgba(255,255,255,0.40)` : "none" }} />
                ))}
              </div>

              {/* Counter */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, opacity: ci(frame, [28, 42], [0, 1]) }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 36, fontWeight: 700, color: COLORS.offWhite, letterSpacing: "-0.02em" }}>
                  {leadsCount.toLocaleString("pt-BR")}
                </span>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: COLORS.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  leads gerados
                </span>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div
            style={{
              ...captionEntry,
              marginTop: 28,
              fontFamily: FONT_DISPLAY,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.gold,
              textAlign: "center",
              opacity: (captionEntry.opacity as number ?? 1) * (1 - exitProg),
            }}
          >
            PREVISÍVEL. ESCALÁVEL.
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
