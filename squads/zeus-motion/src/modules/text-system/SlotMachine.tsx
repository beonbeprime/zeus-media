import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface SlotMachineProps {
  chars: string[];
  targetIndex: number;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  chars, targetIndex, delay = 0, duration = 30, style
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, duration], [0, 1], { extrapolateRight: "clamp" });
  const index = interpolate(progress, [0, 1], [0, targetIndex], { extrapolateRight: "clamp" });
  const charHeight = 60;
  const translateY = -index * charHeight;

  return (
    <div style={{ overflow: "hidden", height: charHeight, ...style }}>
      <div style={{ transform: `translateY(${translateY}px)`, transition: "none" }}>
        {chars.map((c, i) => (
          <div key={i} style={{ height: charHeight, display: "flex", alignItems: "center" }}>{c}</div>
        ))}
      </div>
    </div>
  );
};
