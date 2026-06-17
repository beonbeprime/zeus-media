// ===================================================================
// MagnaMotion — GlowCard
// Card do deck: borda rosegold translúcida + glowPulse infinito (respiração)
// ===================================================================

import React from "react";
import { useCurrentFrame } from "remotion";
import { blurIn, glowPulse } from "../design-system/effects";
import { COLORS } from "../design-system/tokens";

export const GlowCard: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const pulse = glowPulse(frame);
  const glow = 0.08 + pulse * 0.14;
  const spread = 20 + pulse * 20;
  return (
    <div
      style={{
        padding: "42px 54px",
        borderRadius: 20,
        border: `1px solid ${COLORS.cardBorder}`,
        background: COLORS.cardBg,
        boxShadow: `0 0 ${spread}px rgba(212, 160, 138, ${glow})`,
        textAlign: "center",
        ...blurIn(frame, delay, 26),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
