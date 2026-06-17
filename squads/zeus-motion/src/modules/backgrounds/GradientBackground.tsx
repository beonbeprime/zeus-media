import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface GradientBackgroundProps {
  from?: string;
  to?: string;
  angle?: number;
  animated?: boolean;
  style?: React.CSSProperties;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  from = "#000000", to = "#111111", angle = 135, animated = false, style
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const animAngle = animated
    ? angle + interpolate(frame, [0, durationInFrames], [0, 30])
    : angle;

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(${animAngle}deg, ${from}, ${to})`,
      ...style,
    }} />
  );
};
