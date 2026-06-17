import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface SlideInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
  style?: React.CSSProperties;
}

/**
 * SlideIn v2 — padrão V13/BRABO.
 * Entrada com: blur (12→0px) + translate + opacity.
 * Easing: out(cubic) na entrada — regra marcial.
 * NUNCA slide puro sem blur.
 */
export const SlideIn: React.FC<SlideInProps> = ({
  children,
  delay = 0,
  direction = "up",
  distance = 60,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);

  const progress = spring({ frame: f, fps, config: { damping: 22, stiffness: 120, mass: 0.9 } });

  const offset = interpolate(progress, [0, 1], [distance, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const blur = interpolate(progress, [0, 1], [12, 0]);

  const translateMap = {
    up:    `translateY(${offset}px)`,
    down:  `translateY(${-offset}px)`,
    left:  `translateX(${offset}px)`,
    right: `translateX(${-offset}px)`,
  };

  return (
    <div
      style={{
        transform: translateMap[direction],
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
