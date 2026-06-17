import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CircleAroundProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
}

export const CircleAround: React.FC<CircleAroundProps> = ({
  size = 80, color = "#FFFFFF", strokeWidth = 3, delay = 0
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 } });
  const circumference = 2 * Math.PI * (size / 2);
  const dashOffset = interpolate(progress, [0, 1], [circumference, 0]);

  return (
    <svg width={size + strokeWidth * 2} height={size + strokeWidth * 2} style={{ position: "absolute" }}>
      <circle
        cx={(size + strokeWidth * 2) / 2}
        cy={(size + strokeWidth * 2) / 2}
        r={size / 2}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90, ${(size + strokeWidth * 2) / 2}, ${(size + strokeWidth * 2) / 2})`}
      />
    </svg>
  );
};
