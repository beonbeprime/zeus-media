/**
 * Scene7Prova — VOID | dur=134f (4.5s)
 * "Rodando e você ainda ganha uma área de membros completa."
 *
 * Tag  (f10): "E ainda ganha:"              — blur Y entry
 * Main (f22): "ÁREA DE MEMBROS"             — scaleBlur AE + floatBlur
 * Sub  (f65): "completa. Rodando junto."    — blur Y entry
 * Safe zone: y=160 a y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { ci, mBlur, scaleBlur, VoidBackground } from "../index";
import { FONT } from "../design-system";

const DUR = 134;

export const Scene7Prova: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = ci(frame, [0, 15],  [0, 1]);
  const fadeOut = ci(frame, [DUR - 20, DUR], [1, 0]);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Float com blur proporcional à velocidade
  const numFloat   = Math.sin(frame * 0.07) * 6;
  const floatSpeed = Math.abs(Math.cos(frame * 0.07) * 0.07 * 6);
  const floatBlur  = floatSpeed * 8;

  // Springs suaves — AE Easy Ease
  const tagIn  = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 22, stiffness: 160 } });
  const mainIn = spring({ frame: Math.max(0, frame - 22), fps, config: { damping: 24, stiffness: 200 }, from: 2.6, to: 1.0 });
  const subIn  = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 22, stiffness: 160 } });

  const heroBlur = Math.max(scaleBlur(Math.max(0.1, mainIn), 5), floatBlur);

  return (
    <AbsoluteFill>
      <div style={{ opacity: sceneOpacity, width: "100%", height: "100%", position: "relative" }}>
        <VoidBackground glowColor="rgba(255,255,255,0.04)" />
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
              filter: `blur(${mBlur(frame, 10, 14, 8)}px)`,
              marginBottom: 24,
            }}
          >
            E ainda ganha:
          </div>

          {/* "ÁREA DE MEMBROS" — scaleBlur + floatBlur */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: "-3.5px",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.0,
              opacity: ci(Math.max(0, frame - 22), [0, 12], [0, 1]),
              transform: `scale(${Math.max(0.1, mainIn)}) translateY(${numFloat}px)`,
              filter: `blur(${heroBlur}px)`,
              textShadow: "0 0 80px rgba(255,255,255,0.12)",
              marginBottom: 28,
            }}
          >
            ÁREA DE<br />MEMBROS
          </div>

          {/* "completa. Rodando junto." */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              textAlign: "center",
              letterSpacing: "-0.2px",
              opacity: subIn,
              transform: `translateY(${ci(subIn, [0, 1], [28, 0])}px)`,
              filter: `blur(${mBlur(frame, 65, 14, 8)}px)`,
            }}
          >
            completa. Rodando junto.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
