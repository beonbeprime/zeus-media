import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface StampEffectProps {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}

export const StampEffect: React.FC<StampEffectProps> = ({
  children, delay = 0, style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 300, damping: 20 } });
  const scale = interpolate(progress, [0, 1], [2.5, 1]);
  const opacity = interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const rotate = interpolate(progress, [0, 1], [0, -8]);

  return (
    <div style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, opacity, transformOrigin: "center center", ...style }}>
      {children}
    </div>
  );
};
