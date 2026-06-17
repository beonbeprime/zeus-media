import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BoxAroundProps {
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  radius?: number;
  delay?: number;
}

export const BoxAround: React.FC<BoxAroundProps> = ({
  width, height, color = "#FFFFFF", strokeWidth = 2, radius = 8, delay = 0
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 } });
  const perimeter = 2 * (width + height);
  const dashOffset = interpolate(progress, [0, 1], [perimeter, 0]);

  return (
    <svg
      width={width + strokeWidth * 2}
      height={height + strokeWidth * 2}
      style={{ position: "absolute", top: -strokeWidth, left: -strokeWidth, pointerEvents: "none" }}
    >
      <rect
        x={strokeWidth}
        y={strokeWidth}
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={perimeter}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
      />
    </svg>
  );
};
