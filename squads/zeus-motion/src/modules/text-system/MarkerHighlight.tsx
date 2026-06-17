import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface MarkerHighlightProps {
  children: React.ReactNode;
  color?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export const MarkerHighlight: React.FC<MarkerHighlightProps> = ({
  children, color = "rgba(255,255,0,0.3)", delay = 0, style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 }, durationInFrames: 20 });
  const width = interpolate(progress, [0, 1], [0, 100]);

  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{
        position: "absolute", bottom: 0, left: 0,
        width: `${width}%`, height: "40%",
        background: color, zIndex: -1, borderRadius: 2,
      }} />
      {children}
    </span>
  );
};
