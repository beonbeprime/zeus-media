import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ShimmerSweepProps {
  children: React.ReactNode;
  color?: string;
  shimmerColor?: string;
  style?: React.CSSProperties;
}

export const ShimmerSweep: React.FC<ShimmerSweepProps> = ({
  children, color = "#FFFFFF", shimmerColor = "#888888", style
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 200]);

  return (
    <span style={{
      background: `linear-gradient(90deg, ${color} 0%, ${shimmerColor} ${progress - 20}%, ${color} ${progress}%, ${color} 100%)`,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      ...style
    }}>
      {children}
    </span>
  );
};
