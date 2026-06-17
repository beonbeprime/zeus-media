import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  /** escala inicial (default 0.97 — padrão V13, nunca 0 ou 0.5) */
  from?: number;
  style?: React.CSSProperties;
}

/**
 * ScaleIn v2 — padrão V13/BRABO.
 * Entrada com: blur (10→0px) + scale sutil (0.97→1.0) + opacity.
 * NUNCA scale 0→1 (pop amador). Sempre range sutil 0.97-0.98.
 * Para punch de impacto maior use scaleBlur() do brabo-motion-os-v9.
 */
export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  from = 0.97,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);

  const progress = spring({ frame: f, fps, config: { damping: 22, stiffness: 160, mass: 0.8 } });

  const scale = interpolate(progress, [0, 1], [from, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const blur = interpolate(progress, [0, 1], [10, 0]);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        willChange: "transform, opacity, filter",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
