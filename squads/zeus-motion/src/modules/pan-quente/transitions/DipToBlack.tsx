import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface DipToBlackProps {
  frame_start: number;
  duration?: number;
}

export const DipToBlack: React.FC<DipToBlackProps> = ({
  frame_start, duration = 16
}) => {
  const frame = useCurrentFrame();
  const f = frame - frame_start;
  const half = duration / 2;
  const opacity = f < 0 ? 0
    : f < half ? interpolate(f, [0, half], [0, 1], { extrapolateRight: "clamp" })
    : interpolate(f, [half, duration], [1, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0,
      backgroundColor: "#000000",
      opacity,
      pointerEvents: "none",
      zIndex: 999,
    }} />
  );
};
