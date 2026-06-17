import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";

interface InlineHighlightProps {
  children: React.ReactNode;
  fromColor?: string;
  toColor?: string;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const InlineHighlight: React.FC<InlineHighlightProps> = ({
  children, fromColor = "#888888", toColor = "#FFFFFF", delay = 0, duration = 20, style
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, duration], [0, 1], { extrapolateRight: "clamp" });
  const color = interpolateColors(progress, [0, 1], [fromColor, toColor]);

  return <span style={{ color, ...style }}>{children}</span>;
};
