import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CheckmarkDrawProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
}

export const CheckmarkDraw: React.FC<CheckmarkDrawProps> = ({
  size = 60, color = "#30D158", strokeWidth = 4, delay = 0
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 100, damping: 20 } });
  const pathLength = 80;
  const dashOffset = interpolate(progress, [0, 1], [pathLength, 0]);

  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <path
        d="M10 30 L25 45 L50 15"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};
