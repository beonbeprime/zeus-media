import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface ProgressBarProps {
  progress: number;
  color?: string;
  bgColor?: string;
  height?: number;
  delay?: number;
  showLabel?: boolean;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress, color = "#FFFFFF", bgColor = "#333333",
  height = 8, delay = 0, showLabel = true, style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const animProgress = spring({ frame: f, fps, config: { stiffness: 60, damping: 18 }, durationInFrames: 60 });
  const width = interpolate(animProgress, [0, 1], [0, progress]);

  return (
    <div style={{ width: "100%", ...style }}>
      <div style={{ background: bgColor, borderRadius: height, height, overflow: "hidden" }}>
        <div style={{ background: color, width: `${width}%`, height: "100%", borderRadius: height }} />
      </div>
      {showLabel && (
        <div style={{ color, fontSize: 18, marginTop: 8, textAlign: "right" }}>
          {Math.round(width)}%
        </div>
      )}
    </div>
  );
};
