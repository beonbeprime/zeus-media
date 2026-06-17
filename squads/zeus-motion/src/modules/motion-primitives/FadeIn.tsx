import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  /** distancia Y de entrada em px (default 28) */
  distance?: number;
  style?: React.CSSProperties;
}

/**
 * FadeIn v2 — padrão V13/BRABO.
 * Entrada com: blur (12→0px) + translateY + opacity.
 * NUNCA fade puro (amador). Sempre motion blur.
 * Use entryFrom() do brabo para controle total de direção.
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 22,
  distance = 28,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);

  const progress = spring({ frame: f, fps, config: { damping: 22, stiffness: 120, mass: 0.9 } });

  const opacity = progress;
  const translateY = interpolate(progress, [0, 1], [distance, 0]);
  const blur = interpolate(progress, [0, 1], [12, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
        willChange: "transform, opacity, filter",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
