import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface MaskedSlideProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down";
  style?: React.CSSProperties;
}

export const MaskedSlide: React.FC<MaskedSlideProps> = ({
  children, delay = 0, direction = "up", style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 }, durationInFrames: 20 });
  const translateY = interpolate(progress, [0, 1], [direction === "up" ? 40 : -40, 0]);

  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${translateY}px)` }}>
        {children}
      </div>
    </div>
  );
};
