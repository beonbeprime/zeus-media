import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface AnimatedStarProps {
  size?: number;
  color?: string;
  delay?: number;
  spin?: boolean;
}

export const AnimatedStar: React.FC<AnimatedStarProps> = ({
  size = 40, color = "#FFD700", delay = 0, spin = false
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 200, damping: 15 } });
  const scale = interpolate(progress, [0, 1], [0, 1]);
  const rotation = spin ? (frame - delay) * 2 : 0;

  const points = Array.from({ length: 5 }, (_, i) => {
    const outer = (i * 72 - 90) * (Math.PI / 180);
    const inner = ((i * 72 + 36) - 90) * (Math.PI / 180);
    const r = size / 2;
    const ri = r * 0.4;
    return [
      r + r * Math.cos(outer), r + r * Math.sin(outer),
      r + ri * Math.cos(inner), r + ri * Math.sin(inner),
    ];
  }).flat().join(" ");

  return (
    <svg width={size} height={size} style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}>
      <polygon points={points} fill={color} />
    </svg>
  );
};
