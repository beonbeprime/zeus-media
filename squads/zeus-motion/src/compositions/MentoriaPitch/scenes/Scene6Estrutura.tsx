/**
 * Scene6Estrutura — FLASH | dur=150f (5.0s)
 * "Páginas de vendas, anúncios, estratégias, CRM, automações..."
 *
 * Título (f10): "O que inclui"
 * Item 1 (f28): "Páginas de vendas"      — blur slide X
 * Item 2 (f44): "Anúncios ativos"        — blur slide X
 * Item 3 (f60): "Automações e CRM"       — blur slide X
 * Item 4 (f76): "Integrações completas"  — blur slide X
 * Safe zone: y=160 a y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { ci, mBlur, FlashBackground } from "../index";
import { FONT, COLORS } from "../design-system";

const DUR = 150;

const CheckItem: React.FC<{ label: string; sp: number; blurVal: number }> = ({ label, sp, blurVal }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      opacity: sp,
      transform: `translateX(${ci(sp, [0, 1], [-54, 0])}px)`,
      filter: `blur(${blurVal}px)`,
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: COLORS.dark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div
      style={{
        fontFamily: FONT,
        fontSize: 28,
        fontWeight: 500,
        color: COLORS.dark,
        letterSpacing: "-0.5px",
      }}
    >
      {label}
    </div>
  </div>
);

export const Scene6Estrutura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = ci(frame, [0, 18], [0, 1]);
  const fadeOut = ci(frame, [DUR - 20, DUR], [1, 0]);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Springs suaves — AE Easy Ease
  const titleIn = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 22, stiffness: 160 } });
  const item1   = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 22, stiffness: 160 } });
  const item2   = spring({ frame: Math.max(0, frame - 44), fps, config: { damping: 22, stiffness: 160 } });
  const item3   = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 22, stiffness: 160 } });
  const item4   = spring({ frame: Math.max(0, frame - 76), fps, config: { damping: 22, stiffness: 160 } });

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
            paddingLeft: 90,
            paddingRight: 90,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {/* Título */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "4px",
              color: "rgba(0,0,0,0.28)",
              textTransform: "uppercase" as const,
              opacity: titleIn,
              transform: `translateY(${ci(titleIn, [0, 1], [-24, 0])}px)`,
              filter: `blur(${mBlur(frame, 10, 14, 6)}px)`,
              marginBottom: 40,
            }}
          >
            O que inclui
          </div>

          {/* Items com blur proporcional ao slide X */}
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <CheckItem label="Páginas de vendas"      sp={item1} blurVal={mBlur(frame, 28, 14, 10)} />
            <CheckItem label="Anúncios ativos"        sp={item2} blurVal={mBlur(frame, 44, 14, 10)} />
            <CheckItem label="Automações e CRM"       sp={item3} blurVal={mBlur(frame, 60, 14, 10)} />
            <CheckItem label="Integrações completas"  sp={item4} blurVal={mBlur(frame, 76, 14, 10)} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
