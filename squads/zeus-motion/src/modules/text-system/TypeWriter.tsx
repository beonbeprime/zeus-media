import React from "react";
import { useCurrentFrame } from "remotion";

interface TypeWriterProps {
  text: string;
  delay?: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
  cursorStyle?: React.CSSProperties;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text, delay = 0, charsPerFrame = 0.5, style, cursorStyle
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - delay);
  const visibleChars = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const showCursor = frame % 20 < 10;

  return (
    <span style={{ fontFamily: "monospace", ...style }}>
      {text.slice(0, visibleChars)}
      <span style={{ opacity: showCursor ? 1 : 0, ...cursorStyle }}>|</span>
    </span>
  );
};
