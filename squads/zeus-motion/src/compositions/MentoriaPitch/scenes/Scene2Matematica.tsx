/**
 * Scene2Matematica — VOID | dur=196f (6.5s)
 * "O problema é que quando você tenta..."
 *
 * Label  (f10): "O problema é que"      — blur entry Y
 * Punch  (f22): "QUANDO VOCÊ TENTA,"    — scaleBlur AE
 * Items  (f55-81): estuda/aprende/executa — blur slide X
 * Crash  (f110): "e nunca dá certo."    — scaleBlur AE
 * Safe zone: y=160 a y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { ci, mBlur, scaleBlur, VoidBackground } from "../index";
import { FONT, COLORS } from "../design-system";

const DUR = 196;

export const Scene2Matematica: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = ci(frame, [0, 18], [0, 1]);
  const fadeOut = ci(frame, [DUR - 20, DUR], [1, 0]);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Springs suaves — AE Easy Ease
  const labelIn = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 22, stiffness: 160 } });
  const punchIn = spring({ frame: Math.max(0, frame - 22), fps, config: { damping: 24, stiffness: 200 }, from: 2.4, to: 1.0 });
  const item1In = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 22, stiffness: 160 } });
  const item2In = spring({ frame: Math.max(0, frame - 68), fps, config: { damping: 22, stiffness: 160 } });
  const item3In = spring({ frame: Math.max(0, frame - 81), fps, config: { damping: 22, stiffness: 160 } });
  const crashIn = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 24, stiffness: 200 }, from: 1.5, to: 1.0 });

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
          {/* "O problema é que" */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 300,
              color: "rgba(255,255,255,0.42)",
              textAlign: "center",
              letterSpacing: "-0.2px",
              opacity: labelIn,
              transform: `translateY(${ci(labelIn, [0, 1], [-28, 0])}px)`,
              filter: `blur(${mBlur(frame, 10, 14, 8)}px)`,
              marginBottom: 18,
            }}
          >
            O problema é que
          </div>

          {/* "QUANDO VOCÊ TENTA," — punch com scaleBlur */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: "-3px",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.05,
              opacity: ci(Math.max(0, frame - 22), [0, 12], [0, 1]),
              transform: `scale(${Math.max(0.1, punchIn)})`,
              filter: `blur(${scaleBlur(Math.max(0.1, punchIn), 5)}px)`,
              marginBottom: 48,
            }}
          >
            QUANDO<br />VOCÊ TENTA,
          </div>

          {/* Stagger: estudar / aprender / executar — blur slide X */}
          {[
            { label: "você estuda.", sp: item1In, delay: 55 },
            { label: "você aprende.", sp: item2In, delay: 68 },
            { label: "você executa.", sp: item3In, delay: 81 },
          ].map(({ label, sp, delay }) => (
            <div
              key={label}
              style={{
                fontFamily: FONT,
                fontSize: 28,
                fontWeight: 300,
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
                letterSpacing: "-0.3px",
                opacity: sp,
                transform: `translateX(${ci(sp, [0, 1], [50, 0])}px)`,
                filter: `blur(${mBlur(frame, delay, 12, 9)}px)`,
                lineHeight: 1.8,
              }}
            >
              {label}
            </div>
          ))}

          {/* "e nunca dá certo." — crash com scaleBlur */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-1.5px",
              color: COLORS.accent,
              textAlign: "center",
              marginTop: 32,
              opacity: ci(Math.max(0, frame - 110), [0, 14], [0, 1]),
              transform: `scale(${Math.max(0.1, crashIn)})`,
              filter: `blur(${scaleBlur(Math.max(0.1, crashIn), 4)}px)`,
            }}
          >
            e nunca dá certo.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
