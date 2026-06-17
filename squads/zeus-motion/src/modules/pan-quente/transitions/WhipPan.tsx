import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface WhipPanProps {
  children: React.ReactNode;
  frame_start: number;
  direction?: "left" | "right";
  duration?: number;
}

export const WhipPan: React.FC<WhipPanProps> = ({
  children, frame_start, direction = "left", duration = 12
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - frame_start);
  const half = duration / 2;

  const translateX = f < half
    ? interpolate(f, [0, half], [0, direction === "left" ? -200 : 200], { extrapolateRight: "clamp" })
    : interpolate(f, [half, duration], [direction === "left" ? 200 : -200, 0], { extrapolateRight: "clamp" });

  const blur = f < half
    ? interpolate(f, [0, half], [0, 30], { extrapolateRight: "clamp" })
    : interpolate(f, [half, duration], [30, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{ transform: `translateX(${translateX}px)`, filter: `blur(${blur}px)` }}>
      {children}
    </div>
  );
};
