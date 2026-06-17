/**
 * Scene3Autoridade — VOID | dur=150f (5.0s)
 * "Na verdade, nós construímos o funil de vendas de mentoria para você."
 *
 * Top   (f10): "Na verdade,"        — blur Y entry
 * Mid   (f22): "nós construímos"    — blur Y entry
 * Punch (f34): "O FUNIL DE VENDAS"  — scaleBlur AE
 * Sub   (f75): "de mentoria para você." — blur Y entry
 * Safe zone: y=160 a y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { ci, mBlur, scaleBlur, VoidBackground } from "../index";
import { FONT } from "../design-system";

const DUR = 150;

export const Scene3Autoridade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = ci(frame, [0, 18], [0, 1]);
  const fadeOut = ci(frame, [DUR - 20, DUR], [1, 0]);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Springs suaves — AE Easy Ease
  const topIn   = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 22, stiffness: 160 } });
  const midIn   = spring({ frame: Math.max(0, frame - 22), fps, config: { damping: 22, stiffness: 160 } });
  const punchIn = spring({ frame: Math.max(0, frame - 34), fps, config: { damping: 24, stiffness: 200 }, from: 2.2, to: 1.0 });
  const subIn   = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 22, stiffness: 160 } });

  return (
    <AbsoluteFill>
      <div style={{ opacity: sceneOpacity, width: "100%", height: "100%", position: "relative" }}>
        <VoidBackground />
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
          {/* "Na verdade," */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 28,
              fontWeight: 300,
              color: "rgba(255,255,255,0.42)",
              textAlign: "center",
              opacity: topIn,
              transform: `translateY(${ci(topIn, [0, 1], [-28, 0])}px)`,
              filter: `blur(${mBlur(frame, 10, 14, 8)}px)`,
              marginBottom: 10,
            }}
          >
            Na verdade,
          </div>

          {/* "nós construímos" */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 36,
              fontWeight: 300,
              color: "rgba(255,255,255,0.65)",
              textAlign: "center",
              opacity: midIn,
              transform: `translateY(${ci(midIn, [0, 1], [-24, 0])}px)`,
              filter: `blur(${mBlur(frame, 22, 14, 9)}px)`,
              marginBottom: 8,
            }}
          >
            nós construímos
          </div>

          {/* "O FUNIL DE VENDAS" — punch com scaleBlur */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: "-3px",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.0,
              opacity: ci(Math.max(0, frame - 34), [0, 12], [0, 1]),
              transform: `scale(${Math.max(0.1, punchIn)})`,
              filter: `blur(${scaleBlur(Math.max(0.1, punchIn), 5)}px)`,
              textShadow: "0 0 60px rgba(255,255,255,0.12)",
              marginBottom: 22,
            }}
          >
            O FUNIL<br />DE VENDAS
          </div>

          {/* "de mentoria para você." */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              textAlign: "center",
              letterSpacing: "-0.3px",
              opacity: subIn,
              transform: `translateY(${ci(subIn, [0, 1], [28, 0])}px)`,
              filter: `blur(${mBlur(frame, 75, 14, 8)}px)`,
              paddingLeft: 60,
              paddingRight: 60,
            }}
          >
            de mentoria para você.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
