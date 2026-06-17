import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TrackingInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const TrackingIn: React.FC<TrackingInProps> = ({
  children, delay = 0, duration = 25, style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);

  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 }, durationInFrames: duration });

  const letterSpacing = interpolate(progress, [0, 1], [20, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const blur = interpolate(progress, [0, 1], [8, 0]);

  return (
    <div style={{ letterSpacing: `${letterSpacing}px`, opacity, filter: `blur(${blur}px)`, ...style }}>
      {children}
    </div>
  );
};
