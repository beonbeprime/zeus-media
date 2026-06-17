import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CharByCharProps {
  text: string;
  delay?: number;
  charDelay?: number;
  style?: React.CSSProperties;
  charStyle?: React.CSSProperties;
}

export const CharByChar: React.FC<CharByCharProps> = ({
  text, delay = 0, charDelay = 3, style, charStyle
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "inline-flex", flexWrap: "wrap", ...style }}>
      {text.split("").map((char, i) => {
        const f = Math.max(0, frame - delay - i * charDelay);
        const progress = spring({ frame: f, fps, config: { stiffness: 200, damping: 20 }, durationInFrames: 10 });
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const scale = interpolate(progress, [0, 1], [0.5, 1]);
        return (
          <span key={i} style={{ opacity, transform: `scale(${scale})`, display: "inline-block", ...charStyle }}>
            {char === " " ? " " : char}
          </span>
        );
      })}
    </div>
  );
};
