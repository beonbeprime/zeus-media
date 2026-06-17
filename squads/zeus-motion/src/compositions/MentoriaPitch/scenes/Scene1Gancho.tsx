/**
 * Scene1Gancho — VOID | dur=237f (7.9s)
 * "Se você é mentor e você ainda não vende tanto quanto deveria..."
 *
 * Camera: Dolly In suave (scale 0.44→0.67, f0-160) com velocity blur
 * Tag    (f8):  "se você é mentor"     — blur entry
 * Line   (f22): "e ainda não vende"    — blur entry
 * Punch  (f38): "TANTO QUANTO DEVERIA," — scaleBlur AE-style
 * Sub    (f110): "temos a solução."     — blur entry
 * Safe zone: y=160 a y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, spring, useVideoConfig } from "remotion";
import { ci, mBlur, scaleBlur, VoidBackground } from "../index";
import { FONT } from "../design-system";

const DUR = 237;

export const Scene1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = ci(frame, [0, 20], [0, 1]);
  const fadeOut = ci(frame, [DUR - 22, DUR], [1, 0]);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Camera: dolly in suave com velocity blur — calcula velocidade frame a frame
  const camScale     = ci(frame, [0, 160], [0.44, 0.67], Easing.out(Easing.cubic));
  const camScalePrev = ci(Math.max(0, frame - 1), [0, 160], [0.44, 0.67], Easing.out(Easing.cubic));
  const camBlur      = Math.abs(camScale - camScalePrev) * 180; // proporcional à velocidade

  // ─── Springs suaves — AE Easy Ease ──────────────────────────────────────────
  const tagIn   = spring({ frame: Math.max(0, frame - 8),   fps, config: { damping: 22, stiffness: 160 } });
  const lineIn  = spring({ frame: Math.max(0, frame - 22),  fps, config: { damping: 22, stiffness: 160 } });
  const punchIn = spring({ frame: Math.max(0, frame - 38),  fps, config: { damping: 24, stiffness: 200 }, from: 2.4, to: 1.0 });
  const subIn   = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 22, stiffness: 160 } });

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
            transform: `scale(${camScale})`,
            transformOrigin: "50% 720px",
            filter: `blur(${camBlur}px)`,
          }}
        >
          {/* Tag */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "4px",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase" as const,
              opacity: tagIn,
              transform: `translateY(${ci(tagIn, [0, 1], [-24, 0])}px)`,
              filter: `blur(${mBlur(frame, 8, 14, 8)}px)`,
              marginBottom: 22,
            }}
          >
            se você é mentor
          </div>

          {/* "e ainda não vende" */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 38,
              fontWeight: 300,
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              letterSpacing: "-0.5px",
              opacity: lineIn,
              transform: `translateY(${ci(lineIn, [0, 1], [28, 0])}px)`,
              filter: `blur(${mBlur(frame, 22, 14, 10)}px)`,
              marginBottom: 8,
            }}
          >
            e ainda não vende
          </div>

          {/* "TANTO QUANTO DEVERIA," — hero punch com scaleBlur */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: "-4px",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.0,
              opacity: ci(Math.max(0, frame - 38), [0, 12], [0, 1]),
              transform: `scale(${Math.max(0.1, punchIn)})`,
              filter: `blur(${scaleBlur(Math.max(0.1, punchIn), 5)}px)`,
              textShadow: "0 0 80px rgba(255,255,255,0.15)",
              marginBottom: 36,
            }}
          >
            TANTO QUANTO<br />DEVERIA,
          </div>

          {/* "temos a solução." */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 28,
              fontWeight: 300,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              letterSpacing: "-0.3px",
              opacity: subIn,
              transform: `translateY(${ci(subIn, [0, 1], [28, 0])}px)`,
              filter: `blur(${mBlur(frame, 110, 14, 8)}px)`,
            }}
          >
            temos a solução.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
