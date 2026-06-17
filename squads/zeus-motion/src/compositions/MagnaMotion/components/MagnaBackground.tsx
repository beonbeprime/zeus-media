// ===================================================================
// MagnaMotion — Background 3 camadas (regra inviolável do padrão)
// 1. Cor sólida (base | alt | ato-gradiente)
// 2. Aurora: glows radiais na matiz da paleta ativa, com drift lento
// 3. Grain SVG sutil (aplicado uma vez no nível da composição)
// Cores vêm de tokens.ts (paleta ativa em data/palette.ts).
// ===================================================================

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AURORA_1, AURORA_2, COLORS, GRAIN_RGB } from "../design-system/tokens";

const BG_BY_VARIANT: Record<string, string> = {
  base: COLORS.bg,
  alt: COLORS.bgAlt,
  ato: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgAlt} 100%)`,
};

export const MagnaBackground: React.FC<{
  variant?: "base" | "alt" | "ato";
}> = ({ variant = "base" }) => {
  const frame = useCurrentFrame();
  // Drift lento da aurora (idle motion: tela nunca congela em pausas da fala)
  const dx = Math.sin(frame / 220) * 40;
  const dy = Math.cos(frame / 260) * 30;
  return (
    <AbsoluteFill style={{ background: BG_BY_VARIANT[variant] }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(ellipse 70% 42% at ${38 + dx / 10}% ${16 + dy / 10}%, ${AURORA_1} 0%, transparent 70%)`,
            `radial-gradient(ellipse 55% 35% at ${72 - dx / 12}% ${78 - dy / 12}%, ${AURORA_2} 0%, transparent 70%)`,
          ].join(", "),
        }}
      />
    </AbsoluteFill>
  );
};

/** Grain SVG — renderizar UMA vez por composição, acima de tudo */
export const MagnaGrain: React.FC<{ strength?: number }> = ({ strength = 0.05 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
    <svg width="100%" height="100%" style={{ opacity: strength }}>
      <filter id="grain-magna">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix
          values={`0 0 0 0 ${GRAIN_RGB[0]}  0 0 0 0 ${GRAIN_RGB[1]}  0 0 0 0 ${GRAIN_RGB[2]}  0 0 0 0.9 0`}
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-magna)" />
    </svg>
  </AbsoluteFill>
);
