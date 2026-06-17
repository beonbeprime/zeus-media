import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BlurRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const BlurReveal: React.FC<BlurRevealProps> = ({
  children, delay = 0, duration = 20, style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);

  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 }, durationInFrames: duration });

  const blur = interpolate(progress, [0, 1], [20, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div style={{ filter: `blur(${blur}px)`, opacity, ...style }}>
      {children}
    </div>
  );
};
