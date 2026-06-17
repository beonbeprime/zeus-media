import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CountUp } from "../pan-quente/counters/CountUp";

interface AnimatedMetricProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  delta?: { value: number; positive: boolean };
  delay?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const AnimatedMetric: React.FC<AnimatedMetricProps> = ({
  value, label, prefix = "", suffix = "", delta, delay = 0, color = "#FFFFFF", style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      <div style={{ fontSize: 64, fontWeight: 700, color, lineHeight: 1, letterSpacing: -2 }}>
        {prefix}<CountUp to={value} delay={delay} duration={45} />{suffix}
      </div>
      <div style={{ fontSize: 18, color: "#888888", marginTop: 4 }}>{label}</div>
      {delta && (
        <div style={{
          fontSize: 16,
          color: delta.positive ? "#30D158" : "#FF453A",
          marginTop: 4,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          <span>{delta.positive ? "+" : ""}{delta.value}</span>
        </div>
      )}
    </div>
  );
};
