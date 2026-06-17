import {interpolate} from 'remotion';

// ci() - clamped interpolate (padrao marcial do AIOS: NUNCA interpolate sem clamp)
export const ci = (
  frame: number,
  input: number[],
  output: number[],
  easing?: (t: number) => number,
): number =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    ...(easing ? {easing} : {}),
  });
