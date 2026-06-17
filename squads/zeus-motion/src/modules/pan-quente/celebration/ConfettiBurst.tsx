import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";

interface ConfettiBurstProps {
  x: number;
  y: number;
  count?: number;
  colors?: string[];
  delay?: number;
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  x, y, count = 30, colors = ["#FFFFFF", "#888888", "#0071E3", "#30D158"], delay = 0
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const duration = 60;

  const particles = Array.from({ length: count }, (_, i) => {
    const angle = random(`angle-${i}`) * 360;
    const speed = 3 + random(`speed-${i}`) * 8;
    const colorIndex = Math.floor(random(`color-${i}`) * colors.length);
    const color = colors[colorIndex] ?? "#FFFFFF";
    const size = 4 + random(`size-${i}`) * 8;

    const progress = interpolate(f, [0, duration], [0, 1], { extrapolateRight: "clamp" });
    const dist = speed * progress * 100;
    const px = x + Math.cos((angle * Math.PI) / 180) * dist;
    const py = y + Math.sin((angle * Math.PI) / 180) * dist + (progress * progress * 200);
    const opacity = interpolate(progress, [0.5, 1], [1, 0], { extrapolateLeft: "clamp" });
    const rotation = random(`rot-${i}`) * 360 * progress * 3;

    return { px, py, color, size, opacity, rotation };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: p.px,
          top: p.py,
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: 2,
          opacity: p.opacity,
          transform: `rotate(${p.rotation}deg)`,
          pointerEvents: "none",
        }} />
      ))}
    </>
  );
};
