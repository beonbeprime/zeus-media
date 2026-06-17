import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface ArrowCursorProps {
  x: number;
  y: number;
  gesture?: "click" | "hover" | "idle";
  delay?: number;
}

export const ArrowCursor: React.FC<ArrowCursorProps> = ({
  x, y, gesture = "idle", delay = 0
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const fadeIn = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const clickScale = gesture === "click"
    ? interpolate(f % 20, [0, 3, 6, 10], [1, 0.85, 1, 1], { extrapolateRight: "clamp" })
    : 1;

  return (
    <div style={{
      position: "absolute", left: x, top: y,
      opacity: fadeIn,
      transform: `scale(${clickScale})`,
      transformOrigin: "0 0",
      pointerEvents: "none",
      zIndex: 100,
    }}>
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
        <path d="M4 2L28 20L16 22L10 36L4 2Z" fill="white" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
