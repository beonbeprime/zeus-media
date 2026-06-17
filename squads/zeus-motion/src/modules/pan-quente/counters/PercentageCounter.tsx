import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface PercentageCounterProps {
  to: number;
  delay?: number;
  duration?: number;
  toFixed?: number;
  style?: React.CSSProperties;
}

export const PercentageCounter: React.FC<PercentageCounterProps> = ({
  to, delay = 0, duration = 60, toFixed = 0, style
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const value = interpolate(f, [0, duration], [0, to], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <span style={style}>{value.toFixed(toFixed)}%</span>;
};
