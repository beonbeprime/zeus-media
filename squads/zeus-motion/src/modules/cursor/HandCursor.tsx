import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface HandCursorProps {
  x: number;
  y: number;
  gesture?: "tap" | "swipe" | "idle";
  delay?: number;
  visible?: boolean;
}

export const HandCursor: React.FC<HandCursorProps> = ({
  x, y, gesture = "idle", delay = 0, visible = true
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const fadeIn = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const tapScale = gesture === "tap"
    ? interpolate(f % 30, [0, 5, 10, 15], [1, 0.8, 1.1, 1], { extrapolateRight: "clamp" })
    : 1;

  if (!visible) return null;

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      opacity: fadeIn,
      transform: `scale(${tapScale})`,
      transformOrigin: "center top",
      pointerEvents: "none",
      zIndex: 100,
    }}>
      <svg width="52" height="60" viewBox="0 0 52 60" fill="none">
        <ellipse cx="26" cy="38" rx="18" ry="18" fill="white" stroke="#333" strokeWidth="1.5" />
        <rect x="18" y="16" width="8" height="24" rx="4" fill="white" stroke="#333" strokeWidth="1.5" />
        <rect x="26" y="18" width="7" height="22" rx="3.5" fill="white" stroke="#333" strokeWidth="1.5" />
        <rect x="33" y="21" width="7" height="19" rx="3.5" fill="white" stroke="#333" strokeWidth="1.5" />
        <rect x="11" y="24" width="7" height="17" rx="3.5" fill="white" stroke="#333" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
