import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface GroovyEntranceProps {
  children: React.ReactNode;
  delay?: number;
  exitStart?: number;
  exitDir?: "left" | "right" | "top" | "bottom";
}

// Wrapper com bounce-in groovy + paper jitter + saída quadrupla
export const GroovyEntrance: React.FC<GroovyEntranceProps> = ({
  children,
  delay = 0,
  exitStart = 90,
  exitDir = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);

  // Entrada: spring bouncy groovy
  const scale = spring({
    frame: f,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.9 },
    from: 0,
    to: 1,
  });

  // Blur de entrada
  const blurIn = interpolate(f, [0, 10], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Paper jitter (micro-movimento de papel handmade)
  const jx = Math.sin(frame * 1.7) * 2;
  const jy = Math.cos(frame * 2.1) * 2;
  const jr = Math.sin(frame * 0.9) * 0.6;

  // Saída quadrupla
  const ef = frame - exitStart;
  const exitDur = 18;
  const isExiting = frame >= exitStart;

  const axisMap = {
    left:   ["X", -1200],
    right:  ["X",  1200],
    top:    ["Y", -1920],
    bottom: ["Y",  1920],
  } as const;
  const [axis, dist] = axisMap[exitDir];

  const exitPos = isExiting ? interpolate(ef, [0, exitDur], [0, dist], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) : 0;
  const exitOp = isExiting ? interpolate(ef, [exitDur * 0.35, exitDur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) : 1;
  const exitSc = isExiting ? interpolate(ef, [0, exitDur], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) : 1;
  const exitBlur = isExiting ? interpolate(ef, [0, exitDur], [0, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) : 0;

  const translateEntry = `translate(${jx}px, ${jy}px) rotate(${jr}deg) scale(${scale})`;
  const translateExit  = axis === "X"
    ? `translateX(${exitPos}px) scale(${exitSc})`
    : `translateY(${exitPos}px) scale(${exitSc})`;

  const opacity  = exitOp * Math.min(scale, 1);
  const filter   = `blur(${Math.max(blurIn, exitBlur)}px)`;
  const transform = isExiting ? translateExit : translateEntry;

  return (
    <div style={{ opacity, filter, transform, willChange: "transform, opacity, filter" }}>
      {children}
    </div>
  );
};
