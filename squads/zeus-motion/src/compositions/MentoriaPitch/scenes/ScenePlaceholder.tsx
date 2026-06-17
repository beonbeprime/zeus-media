/**
 * ScenePlaceholder — usado nas cenas 3-7
 * Suporta bg "void" (preto) ou "flash" (branco)
 * Headline 80px + subtitulo + watermark do numero de cena
 * Safe zone: conteudo dentro de y=160 a y=1280 (top 2/3)
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, spring, useVideoConfig } from "remotion";
import { ci, VoidBackground, FlashBackground } from "../index";
import { FONT, COLORS } from "../design-system";

interface ScenePlaceholderProps {
  bg: "void" | "flash";
  sceneNum: number;
  text: string;
  sub?: string;
  duration: number;
  accent?: boolean;
}

export const ScenePlaceholder: React.FC<ScenePlaceholderProps> = ({
  bg, sceneNum, text, sub, duration, accent = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isVoid      = bg === "void";
  const textColor   = isVoid ? "#FFFFFF" : COLORS.dark;
  const accentColor = COLORS.accent;

  const fadeIn  = ci(frame, [0, 15],  [0, 1]);
  const fadeOut = ci(frame, [duration - 15, duration], [1, 0]);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  const headlineSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14 } });
  const subSpring      = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12 } });

  const parallaxY = ci(frame, [0, duration], [0, -40]);

  const sceneNumOpacity = ci(frame, [30, 60], [0, 0.08]);

  return (
    <AbsoluteFill>
      {isVoid ? <VoidBackground /> : <FlashBackground />}

      <div style={{ opacity: sceneOpacity, width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
        {/* Watermark numero de cena */}
        <div
          style={{
            position: "absolute",
            right: "8%",
            bottom: "35%",
            fontFamily: FONT,
            fontSize: 200,
            fontWeight: 900,
            color: textColor,
            opacity: sceneNumOpacity,
            lineHeight: 1,
            letterSpacing: "-6px",
            userSelect: "none",
          }}
        >
          {sceneNum}
        </div>

        {/* Conteudo — centrado na safe zone y=160 a y=1280 */}
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
            transform: `translateY(${parallaxY}px)`,
          }}
        >
          {/* Tag de cena */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "4px",
              color: accent
                ? accentColor
                : isVoid ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
              textTransform: "uppercase",
              marginBottom: 20,
              opacity: subSpring,
            }}
          >
            CENA {sceneNum}
          </div>

          {/* Headline */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: "-3px",
              color: accent ? accentColor : textColor,
              textAlign: "center",
              opacity: headlineSpring,
              transform: `translateY(${ci(headlineSpring, [0, 1], [60, 0])}px)`,
              lineHeight: 1,
            }}
          >
            {text}
          </div>

          {/* Divider */}
          {sub && (
            <div
              style={{
                marginTop: 28,
                marginBottom: 20,
                width: 60,
                height: 2,
                background: accent
                  ? accentColor
                  : isVoid ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)",
                opacity: subSpring,
              }}
            />
          )}

          {/* Subtitulo */}
          {sub && (
            <div
              style={{
                fontFamily: FONT,
                fontSize: 28,
                fontWeight: 300,
                letterSpacing: "-0.3px",
                color: isVoid ? "rgba(255,255,255,0.6)" : "rgba(29,29,31,0.6)",
                textAlign: "center",
                maxWidth: 700,
                opacity: subSpring,
                transform: `translateY(${ci(subSpring, [0, 1], [30, 0])}px)`,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
