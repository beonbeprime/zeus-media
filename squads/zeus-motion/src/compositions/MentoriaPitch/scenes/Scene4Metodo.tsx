/**
 * Scene4Metodo — FLASH | dur=150f (5.0s)
 * "Te entregamos tudo pronto. A diferença é que poucas pessoas entregam."
 *
 * Top   (f10): "Te entregamos"            — blur Y entry
 * Punch (f22): "TUDO PRONTO."             — scaleBlur AE, fundo branco
 * Div   (f60): linha separadora           — slide X
 * Sub   (f68): "A diferença é que..."     — blur Y entry
 * Safe zone: y=160 a y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { ci, mBlur, scaleBlur, FlashBackground } from "../index";
import { FONT, COLORS } from "../design-system";

const DUR = 150;

export const Scene4Metodo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = ci(frame, [0, 18], [0, 1]);
  const fadeOut = ci(frame, [DUR - 20, DUR], [1, 0]);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Springs suaves — AE Easy Ease
  const topIn  = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 22, stiffness: 160 } });
  const mainIn = spring({ frame: Math.max(0, frame - 22), fps, config: { damping: 24, stiffness: 200 }, from: 2.2, to: 1.0 });
  const divIn  = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 22, stiffness: 160 } });
  const subIn  = spring({ frame: Math.max(0, frame - 68), fps, config: { damping: 22, stiffness: 160 } });

  const dividerW = ci(divIn, [0, 1], [0, 560]);

  return (
    <AbsoluteFill>
      <div style={{ opacity: sceneOpacity, width: "100%", height: "100%", position: "relative" }}>
        <FlashBackground />
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
          {/* "Te entregamos" */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 34,
              fontWeight: 300,
              color: "rgba(0,0,0,0.45)",
              textAlign: "center",
              letterSpacing: "-0.3px",
              opacity: topIn,
              transform: `translateY(${ci(topIn, [0, 1], [-28, 0])}px)`,
              filter: `blur(${mBlur(frame, 10, 14, 8)}px)`,
              marginBottom: 8,
            }}
          >
            Te entregamos
          </div>

          {/* "TUDO PRONTO." — punch com scaleBlur */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 100,
              fontWeight: 900,
              letterSpacing: "-4px",
              color: COLORS.dark,
              textAlign: "center",
              lineHeight: 1,
              opacity: ci(Math.max(0, frame - 22), [0, 12], [0, 1]),
              transform: `scale(${Math.max(0.1, mainIn)})`,
              filter: `blur(${scaleBlur(Math.max(0.1, mainIn), 5)}px)`,
              marginBottom: 36,
            }}
          >
            TUDO<br />PRONTO.
          </div>

          {/* Divider */}
          <div
            style={{
              width: dividerW,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${COLORS.dark}, transparent)`,
              opacity: divIn * 0.18,
              filter: `blur(${mBlur(frame, 60, 12, 3)}px)`,
              marginBottom: 28,
            }}
          />

          {/* Sub */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 300,
              color: "rgba(0,0,0,0.45)",
              textAlign: "center",
              letterSpacing: "-0.2px",
              lineHeight: 1.45,
              opacity: subIn,
              transform: `translateY(${ci(subIn, [0, 1], [28, 0])}px)`,
              filter: `blur(${mBlur(frame, 68, 14, 8)}px)`,
              paddingLeft: 80,
              paddingRight: 80,
            }}
          >
            A diferença é que poucas pessoas entregam{"\n"}o que nós entregamos.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
