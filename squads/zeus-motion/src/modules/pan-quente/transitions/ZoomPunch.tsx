import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface ZoomPunchProps {
  children: React.ReactNode;
  frame_start: number;
  intensity?: number;
  style?: React.CSSProperties;
}

export const ZoomPunch: React.FC<ZoomPunchProps> = ({
  children, frame_start, intensity = 1.15, style
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - frame_start);
  const scale = f < 12
    ? interpolate(f, [0, 5, 12], [1, intensity, 1], { extrapolateRight: "clamp" })
    : 1;

  return <div style={{ transform: `scale(${scale})`, ...style }}>{children}</div>;
};
