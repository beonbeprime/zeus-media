import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface ShakeWiggleProps {
  children: React.ReactNode;
  frame_start: number;
  intensity?: number;
  duration?: number;
}

export const ShakeWiggle: React.FC<ShakeWiggleProps> = ({
  children, frame_start, intensity = 8, duration = 20
}) => {
  const frame = useCurrentFrame();
  const f = frame - frame_start;

  if (f < 0 || f > duration) return <>{children}</>;

  const progress = f / duration;
  const decay = 1 - progress;
  const shake = Math.sin(f * 1.5) * intensity * decay;

  return (
    <div style={{ transform: `translateX(${shake}px)` }}>
      {children}
    </div>
  );
};
