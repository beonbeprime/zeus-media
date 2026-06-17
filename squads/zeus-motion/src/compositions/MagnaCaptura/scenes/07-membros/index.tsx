/**
 * Scene7 — Área de Membros Premium
 * dur=87f | EXIT_F=67 | exit: zoom in + fade
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { ci, entryFrom, BackgroundBase, SafeZone } from "../../index";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../design-system";

const EXIT_F = 110;

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();

  const progressW  = ci(frame, [18, 58], [0, 540]);
  const playPulse  = 0.85 + 0.15 * Math.sin((frame / 30) * Math.PI * 3);

  const exitProg   = ci(frame, [EXIT_F, EXIT_F + 18], [0, 1], Easing.in(Easing.exp));
  const exitStyle: React.CSSProperties = {
    opacity: 1 - exitProg * 0.95,
    transform: `scale(${1 + exitProg * 0.25})`,
    filter: `blur(${exitProg * 12}px)`,
  };

  const labelEntry  = entryFrom(frame, "top", 40, 18);
  const mockupEntry = entryFrom(Math.max(0, frame - 6), "bottom", 100, 28);
  const captionEntry = entryFrom(Math.max(0, frame - 36), "bottom", 40, 18);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.04)" />

      <SafeZone justify="center">
        <div style={{ ...exitStyle, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Label */}
          <div style={{ ...labelEntry, fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.muted, textAlign: "center", marginBottom: 32 }}>
            seu aluno recebe
          </div>

          {/* iPad mockup */}
          <div
            style={{
              ...mockupEntry,
              width: 600,
              background: "rgba(14,14,18,0.96)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            <div style={{ height: 38, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 16, paddingRight: 16, gap: 7 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,59,48,0.5)" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,204,0,0.5)" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(52,199,89,0.5)" }} />
              <span style={{ marginLeft: "auto", fontFamily: FONT_MONO, fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.05em" }}>MAGNA · VIP</span>
            </div>
            <div style={{ padding: "22px 24px 26px" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, opacity: ci(frame, [8, 20], [0, 1]) }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: "rgba(255,255,255,0.90)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 900, color: COLORS.bg }}>M</div>
                <div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, color: COLORS.offWhite }}>Mentoria Magna</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 11, color: COLORS.muted }}>Área de Membros Premium</div>
                </div>
              </div>

              {/* Thumbnail + play */}
              <div style={{ height: 120, background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative", overflow: "hidden", opacity: ci(frame, [12, 24], [0, 1]) }}>
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))` }} />
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: `rgba(255,255,255,0.15)`, border: `1.5px solid rgba(255,255,255,0.55)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${10 * playPulse}px rgba(255,255,255,0.25)`, transform: `scale(${playPulse})` }}>
                  <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: `16px solid ${COLORS.bg}`, marginLeft: 3 }} />
                </div>
              </div>

              {/* Progress */}
              <div style={{ opacity: ci(frame, [18, 30], [0, 1]) }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontFamily: FONT_MONO, fontSize: 10, color: COLORS.muted }}>
                  <span>Módulo 3 - Funil de Captação</span>
                  <span style={{ color: COLORS.gold }}>{Math.round(ci(frame, [18, 58], [0, 78]))}%</span>
                </div>
                <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
                  <div style={{ width: progressW, height: "100%", background: "rgba(255,255,255,0.85)", borderRadius: 2, boxShadow: `0 0 5px rgba(255,255,255,0.30)` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div style={{ ...captionEntry, marginTop: 24, fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.gold, textAlign: "center", opacity: (captionEntry.opacity as number ?? 1) * (1 - exitProg) }}>
            ÁREA DE MEMBROS COMPLETA.
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
