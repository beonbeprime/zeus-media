import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface ScalePunchProps {
  children: React.ReactNode;
  frame_start: number;
  intensity?: number;
}

export const ScalePunch: React.FC<ScalePunchProps> = ({
  children, frame_start, intensity = 1.2
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - frame_start);
  const scale = f < 15
    ? interpolate(f, [0, 4, 8, 15], [1, intensity, 0.95, 1], { extrapolateRight: "clamp" })
    : 1;

  return <div style={{ transform: `scale(${scale})` }}>{children}</div>;
};
