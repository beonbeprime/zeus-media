import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface CountUpProps {
  from?: number;
  to: number;
  delay?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  toFixed?: number;
  locale?: string;
  style?: React.CSSProperties;
}

export const CountUp: React.FC<CountUpProps> = ({
  from = 0, to, delay = 0, duration = 60, prefix = "", suffix = "",
  toFixed = 0, locale = "pt-BR", style
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const value = from + (to - from) * progress;
  const formatted = value.toLocaleString(locale, {
    minimumFractionDigits: toFixed,
    maximumFractionDigits: toFixed,
  });

  return <span style={style}>{prefix}{formatted}{suffix}</span>;
};
