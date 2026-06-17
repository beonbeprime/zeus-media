import React from "react";
import { Arrow } from "@remotion/shapes";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface AnimatedArrowProps {
  length?: number;
  color?: string;
  delay?: number;
  direction?: "right" | "left" | "up" | "down";
  style?: React.CSSProperties;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  length = 200, color = "#FFFFFF", delay = 0, direction = "right", style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 } });
  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const rotation = { right: 0, left: 180, up: -90, down: 90 }[direction];

  return (
    <div style={{ transform: `scale(${scale}) rotate(${rotation}deg)`, opacity, transformOrigin: "left center", ...style }}>
      <Arrow
        length={length}
        headWidth={30}
        headLength={20}
        shaftWidth={4}
        color={color}
      />
    </div>
  );
};
