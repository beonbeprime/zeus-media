import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface UnderlineDrawProps {
  width: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  curved?: boolean;
}

export const UnderlineDraw: React.FC<UnderlineDrawProps> = ({
  width, color = "#FFFFFF", strokeWidth = 3, delay = 0, curved = true
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 } });
  const drawWidth = interpolate(progress, [0, 1], [0, width]);

  const h = 12;
  const path = curved
    ? `M 0 ${h / 2} Q ${width / 2} 0 ${width} ${h / 2}`
    : `M 0 ${h / 2} L ${width} ${h / 2}`;

  return (
    <svg width={width} height={h} style={{ overflow: "visible" }}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={width * 2}
        strokeDashoffset={interpolate(progress, [0, 1], [width * 2, 0])}
      />
    </svg>
  );
};
