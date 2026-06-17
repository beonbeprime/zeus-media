import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface StaggeredFadeUpProps {
  items: React.ReactNode[];
  delay?: number;
  staggerDelay?: number;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
}

export const StaggeredFadeUp: React.FC<StaggeredFadeUpProps> = ({
  items, delay = 0, staggerDelay = 8, style, itemStyle
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, ...style }}>
      {items.map((item, i) => {
        const f = Math.max(0, frame - delay - i * staggerDelay);
        const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 }, durationInFrames: 20 });
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [30, 0]);
        return (
          <div key={i} style={{ opacity, transform: `translateY(${translateY}px)`, ...itemStyle }}>
            {item}
          </div>
        );
      })}
    </div>
  );
};
