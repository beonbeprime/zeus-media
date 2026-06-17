/**
 * Scene5Resultado — VOID | dur=122f (4.1s)
 * "Uma máquina de vendas pronta que gera leads através do low ticket"
 *
 * Tag  (f12): "O produto"             — blur Y entry
 * Main (f24): "MÁQUINA DE VENDAS"     — scaleBlur AE + floatBlur contínuo
 * Sub  (f65): "pronta. Gera leads..." — blur Y entry
 * Safe zone: y=160 a y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { ci, mBlur, scaleBlur, VoidBackground } from "../index";
import { FONT, COLORS } from "../design-system";

const DUR = 122;

export const Scene5Resultado: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = ci(frame, [0, 15],  [0, 1]);
  const fadeOut = ci(frame, [DUR - 22, DUR], [1, 0]);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Float com blur proporcional à velocidade de oscilação
  const numFloat   = Math.sin(frame * 0.07) * 6;
  const floatSpeed = Math.abs(Math.cos(frame * 0.07) * 0.07 * 6);
  const floatBlur  = floatSpeed * 8;

  // Springs suaves — AE Easy Ease
  const tagIn  = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 22, stiffness: 160 } });
  const mainIn = spring({ frame: Math.max(0, frame - 24), fps, config: { damping: 24, stiffness: 200 }, from: 2.8, to: 1.0 });
  const subIn  = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 22, stiffness: 160 } });

  const heroBlur = Math.max(scaleBlur(Math.max(0.1, mainIn), 5), floatBlur);

  return (
    <AbsoluteFill>
      <div style={{ opacity: sceneOpacity, width: "100%", height: "100%", position: "relative" }}>
        <VoidBackground glowColor="rgba(52,199,89,0.06)" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 160,
            paddingBottom: 640,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Tag */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "4px",
              color: "rgba(255,255,255,0.38)",
              textTransform: "uppercase" as const,
              opacity: tagIn,
              transform: `translateY(${ci(tagIn, [0, 1], [-24, 0])}px)`,
              filter: `blur(${mBlur(frame, 12, 14, 8)}px)`,
              marginBottom: 20,
            }}
          >
            O produto
          </div>

          {/* "MÁQUINA DE VENDAS" — scaleBlur + floatBlur */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: "-3px",
              color: COLORS.accent,
              textAlign: "center",
              lineHeight: 1.05,
              opacity: ci(Math.max(0, frame - 24), [0, 12], [0, 1]),
              transform: `scale(${Math.max(0.1, mainIn)}) translateY(${numFloat}px)`,
              filter: `blur(${heroBlur}px)`,
              textShadow: "0 0 60px rgba(52,199,89,0.3), 0 0 120px rgba(52,199,89,0.12)",
              marginBottom: 24,
            }}
          >
            MÁQUINA<br />DE VENDAS
          </div>

          {/* "pronta. Gera leads via low ticket." */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 300,
              color: "rgba(255,255,255,0.55)",
              textAlign: "center",
              letterSpacing: "-0.2px",
              opacity: subIn,
              transform: `translateY(${ci(subIn, [0, 1], [28, 0])}px)`,
              filter: `blur(${mBlur(frame, 65, 14, 8)}px)`,
            }}
          >
            pronta. Gera leads via low ticket.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
