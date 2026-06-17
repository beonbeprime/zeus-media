import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  color?: string;
  size?: number;
  delay?: number;
  staggerDelay?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating, maxStars = 5, color = "#FFD700", size = 40, delay = 0, staggerDelay = 5
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const starPoints = (s: number) => {
    const pts = Array.from({ length: 5 }, (_, i) => {
      const outer = (i * 72 - 90) * (Math.PI / 180);
      const inner = ((i * 72 + 36) - 90) * (Math.PI / 180);
      const r = s / 2;
      const ri = r * 0.4;
      return [
        r + r * Math.cos(outer), r + r * Math.sin(outer),
        r + ri * Math.cos(inner), r + ri * Math.sin(inner),
      ];
    }).flat();
    return pts.join(" ");
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {Array.from({ length: maxStars }, (_, i) => {
        const f = Math.max(0, frame - delay - i * staggerDelay);
        const progress = spring({ frame: f, fps, config: { stiffness: 200, damping: 15 } });
        const scale = interpolate(progress, [0, 1], [0, 1]);
        const isFilled = i < rating;
        return (
          <div key={i} style={{ transform: `scale(${scale})`, opacity: isFilled ? 1 : 0.3 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <polygon points={starPoints(size)} fill={isFilled ? color : "#444"} />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
