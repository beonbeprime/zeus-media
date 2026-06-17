// ===================================================================
// MagnaMotion — Primitivas de animação
// Conversão dos efeitos CSS do deck (lucas-viralizacao-v2) para frames
// .word | .blur-in | .num-highlight | lista cascata | ícone spring | glowPulse
// ===================================================================

import { Easing, interpolate, spring } from "remotion";
import React from "react";

/** Interpolação com clamp dos dois lados (padrão da casa) */
export const ci = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing?: (t: number) => number
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Blur só durante a transição — nunca pagar raster de blur(0px) */
const blurFilter = (blur: number): string | undefined =>
  blur > 0.1 ? `blur(${blur}px)` : undefined;

/**
 * Efeito .word do deck: opacity 0→1, blur 12→0, translateY 22→0, scale 0.94→1.
 * dur adaptativa (6–18f) calculada pela timeline conforme o ritmo da fala.
 */
export const wordEntry = (
  frame: number,
  startFrame: number,
  dur = 18
): React.CSSProperties => {
  const f = frame - startFrame;
  if (f < 0) {
    return { opacity: 0, transform: "translateY(22px) scale(0.94)" };
  }
  const op = ci(f, [0, Math.max(1, Math.round(dur * 0.55))], [0, 1]);
  const blur = ci(f, [0, Math.max(1, Math.round(dur * 0.45))], [12, 0], Easing.out(Easing.quad));
  const y = ci(f, [0, dur], [22, 0], Easing.out(Easing.cubic));
  const sc = ci(f, [0, dur], [0.94, 1], Easing.out(Easing.cubic));
  return {
    opacity: op,
    transform: `translateY(${y}px) scale(${sc})`,
    filter: blurFilter(blur),
  };
};

/** Efeito .blur-in do deck (estáticos: tags, dividers, subtítulos): blur 14→0, translateY 28→0 */
export const blurIn = (
  frame: number,
  delay = 0,
  dur = 28
): React.CSSProperties => {
  const f = frame - delay;
  if (f < 0) return { opacity: 0, transform: "translateY(28px)" };
  const op = ci(f, [0, Math.round(dur * 0.7)], [0, 1]);
  const blur = ci(f, [0, dur], [14, 0], Easing.out(Easing.quad));
  const y = ci(f, [0, dur], [28, 0], Easing.out(Easing.cubic));
  return { opacity: op, transform: `translateY(${y}px)`, filter: blurFilter(blur) };
};

/** Efeito .num-highlight do deck: blur 20→0, scale 0.6→1 com spring */
export const numHighlight = (
  frame: number,
  delay: number,
  fps: number
): React.CSSProperties => {
  const f = Math.max(0, frame - delay);
  const notStarted = frame < delay;
  const progress = spring({ frame: f, fps, config: { damping: 14, stiffness: 90 } });
  const sc = interpolate(progress, [0, 1], [0.6, 1]);
  const op = ci(f, [0, 14], [0, 1]);
  const blur = ci(f, [0, 22], [20, 0], Easing.out(Easing.quad));
  if (notStarted) return { opacity: 0, transform: "scale(0.6)" };
  return { opacity: op, transform: `scale(${sc})`, filter: blurFilter(blur) };
};

/** Item de lista do deck: translateX -32→0 com blur (cascata controlada pela fala) */
export const listEntry = (
  frame: number,
  delay = 0,
  dur = 18
): React.CSSProperties => {
  const f = frame - delay;
  if (f < 0) return { opacity: 0, transform: "translateX(-32px)" };
  const op = ci(f, [0, Math.round(dur * 0.6)], [0, 1]);
  const blur = ci(f, [0, Math.round(dur * 0.8)], [10, 0], Easing.out(Easing.quad));
  const x = ci(f, [0, dur], [-32, 0], Easing.out(Easing.cubic));
  return { opacity: op, transform: `translateX(${x}px)`, filter: blurFilter(blur) };
};

/** Ícone de lista do deck: scale 0.3→1 + rotate -30°→0° com spring */
export const iconPop = (
  frame: number,
  delay: number,
  fps: number
): React.CSSProperties => {
  if (frame < delay) return { opacity: 0, transform: "scale(0.3) rotate(-30deg)" };
  const f = frame - delay;
  const progress = spring({ frame: f, fps, config: { damping: 12, stiffness: 110 } });
  const sc = interpolate(progress, [0, 1], [0.3, 1]);
  const rot = interpolate(progress, [0, 1], [-30, 0]);
  const op = ci(f, [0, 10], [0, 1]);
  return { opacity: op, transform: `scale(${sc}) rotate(${rot}deg)` };
};

/** Saída quádrupla da casa: posição + blur + opacity + scale (Easing.in(exp)) */
export const exitTo = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom" = "left",
  distance = 1100,
  dur = 16
): React.CSSProperties => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const f = frame - start;
  if (f < 0) return {};
  const pos = ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp));
  const op = ci(f, [Math.round(dur * 0.35), dur], [1, 0]);
  const sc = ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp));
  const blur = ci(f, [0, dur], [0, 18], Easing.in(Easing.cubic));
  return {
    opacity: op,
    transform: `translate${axis}(${pos}px) scale(${sc})`,
    filter: blurFilter(blur),
  };
};

/** Pulso de glow do deck (glowPulse 4s ease-in-out infinito) → 0..1 */
export const glowPulse = (frame: number, periodFrames = 108): number =>
  0.5 + 0.5 * Math.sin((frame / periodFrames) * Math.PI * 2);

/** Combina estilos de entrada e saída (opacity multiplica, transform/filter concatenam) */
export const mergeStyles = (...styles: React.CSSProperties[]): React.CSSProperties => ({
  opacity: styles.reduce<number>(
    (acc, s) => acc * (typeof s.opacity === "number" ? s.opacity : 1),
    1
  ),
  transform: styles.map((s) => s.transform).filter(Boolean).join(" ") || undefined,
  filter: styles.map((s) => s.filter).filter(Boolean).join(" ") || undefined,
});
