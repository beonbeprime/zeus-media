import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BounceEnterProps {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}

export const BounceEnter: React.FC<BounceEnterProps> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const scale = spring({ frame: f, fps, config: { stiffness: 300, damping: 10, mass: 0.5 } });
  const opacity = interpolate(f, [0, 5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ transform: `scale(${scale})`, opacity, ...style }}>{children}</div>
  );
};
