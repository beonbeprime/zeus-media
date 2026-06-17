/**
 * Scene4 — O Divisor de Mundos
 * dur=87f | EXIT_F=67 | exit: pan right
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { ci, entryFrom, exitTo, exitToNB, mergeStyles, BackgroundBase, Direction } from "../../index";
import { COLORS, FONT_DISPLAY, SAFE_BOTTOM, PAD_TOP, SAFE_X } from "../../design-system";

const EXIT_F   = 110;
const EXIT_DIR: Direction = "right";

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  // Linha divisória cresce de cima para baixo (apenas na safe zone)
  const lineH = ci(frame, [0, 28], [0, SAFE_BOTTOM - PAD_TOP], Easing.out(Easing.cubic));
  const lineGlow = 0.5 + 0.5 * Math.sin((frame / 30) * Math.PI * 2);

  // Conteúdo esquerdo entra depois da linha (delay 16f)
  const leftFrame  = Math.max(0, frame - 16);
  const rightFrame = Math.max(0, frame - 16);

  const leftEntry  = entryFrom(leftFrame,  "left",  80, 22);
  const rightEntry = entryFrom(rightFrame, "right", 80, 22);
  const leftExit   = exitTo(frame, EXIT_F, EXIT_DIR, 1300, 18);
  const rightExit  = exitToNB(frame, EXIT_F, EXIT_DIR, 1300, 18);

  const CONTENT_H = SAFE_BOTTOM - PAD_TOP;

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.05)" />

      {/* Linha divisória — limitada ao safe zone */}
      <div
        style={{
          position: "absolute",
          top: PAD_TOP,
          left: "50%",
          width: 1,
          height: lineH,
          background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.55) 15%, rgba(255,255,255,0.55) 85%, transparent)`,
          boxShadow: `0 0 ${10 * lineGlow}px rgba(255,255,255,0.25)`,
          transform: "translateX(-50%)",
        }}
      />

      {/* Lado esquerdo */}
      <div
        style={{
          ...mergeStyles(leftEntry, leftExit),
          position: "absolute",
          top: PAD_TOP,
          left: 0,
          width: "50%",
          height: CONTENT_H,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: SAFE_X,
          paddingRight: 40,
        }}
      >
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 300, letterSpacing: "0.20em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 16, textAlign: "center" }}>
          o mundo de
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.offWhite, textAlign: "center", lineHeight: 1.15 }}>
          POUCAS{"\n"}PESSOAS
        </div>
        <div style={{ marginTop: 24, fontFamily: FONT_DISPLAY, fontSize: 17, color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.7 }}>
          que conseguem escalar{"\n"}de verdade
        </div>
      </div>

      {/* Lado direito — gold premium, SEM filter no pai */}
      <div
        style={{
          ...mergeStyles(rightEntry, rightExit),
          position: "absolute",
          top: PAD_TOP,
          right: 0,
          width: "50%",
          height: CONTENT_H,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingRight: SAFE_X,
          paddingLeft: 40,
        }}
      >
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 300, letterSpacing: "0.20em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 16, textAlign: "center" }}>
          onde você vai entrar
        </div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.15,
            color: COLORS.white,
          }}
        >
          NÓS{"\n"}ENTREGAMOS
        </div>
        <div style={{ marginTop: 24, fontFamily: FONT_DISPLAY, fontSize: 17, color: COLORS.muted, letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.7 }}>
          estrutura, método{"\n"}e resultado
        </div>
      </div>

      {/* Ponto central na linha */}
      <div
        style={{
          position: "absolute",
          top: PAD_TOP + CONTENT_H / 2,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: COLORS.bg,
          border: `1.5px solid rgba(255,255,255,0.45)`,
          boxShadow: `0 0 8px rgba(255,255,255,0.15)`,
          opacity: ci(frame, [22, 32], [0, 1]),
        }}
      />
    </AbsoluteFill>
  );
};
