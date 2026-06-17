import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface WordByWordProps {
  text: string;
  delay?: number;
  wordDelay?: number;
  style?: React.CSSProperties;
}

export const WordByWord: React.FC<WordByWordProps> = ({
  text, delay = 0, wordDelay = 6, style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3em", ...style }}>
      {words.map((word, i) => {
        const f = Math.max(0, frame - delay - i * wordDelay);
        const progress = spring({ frame: f, fps, config: { stiffness: 100, damping: 20 }, durationInFrames: 15 });
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const blur = interpolate(progress, [0, 1], [6, 0]);
        const scale = interpolate(progress, [0, 1], [0.9, 1]);
        return (
          <span key={i} style={{ opacity, filter: `blur(${blur}px)`, transform: `scale(${scale})`, display: "inline-block" }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};
