import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface CurrencyCounterProps {
  from?: number;
  to: number;
  currency?: string;
  locale?: string;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const CurrencyCounter: React.FC<CurrencyCounterProps> = ({
  from = 0, to, currency = "BRL", locale = "pt-BR", delay = 0, duration = 60, style
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const value = from + (to - from) * progress;
  const formatted = value.toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return <span style={style}>{formatted}</span>;
};
