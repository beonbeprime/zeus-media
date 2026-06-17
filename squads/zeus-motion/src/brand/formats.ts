export type VideoFormat = "VERTICAL" | "FEED_PORTRAIT" | "SQUARE" | "WIDE";

export interface FormatConfig {
  width: number;
  height: number;
  fps: number;
  safeZone: { top: number; bottom: number; left: number; right: number };
  adDeadZone?: { startY: number };
}

export const FORMATS: Record<VideoFormat, FormatConfig> = {
  VERTICAL: {
    width: 1080,
    height: 1920,
    fps: 30,
    safeZone: { top: 0.08, bottom: 0.85, left: 0.05, right: 0.95 },
    adDeadZone: { startY: 0.65 },
  },
  FEED_PORTRAIT: {
    width: 1080,
    height: 1350,
    fps: 30,
    safeZone: { top: 0.05, bottom: 0.90, left: 0.05, right: 0.95 },
    adDeadZone: { startY: 0.75 },
  },
  SQUARE: {
    width: 1080,
    height: 1080,
    fps: 30,
    safeZone: { top: 0.05, bottom: 0.90, left: 0.05, right: 0.95 },
    adDeadZone: { startY: 0.80 },
  },
  WIDE: {
    width: 1920,
    height: 1080,
    fps: 30,
    safeZone: { top: 0.05, bottom: 0.90, left: 0.05, right: 0.95 },
  },
};

export function getSafeArea(format: VideoFormat) {
  const f = FORMATS[format];
  return {
    top: f.height * f.safeZone.top,
    bottom: f.height * f.safeZone.bottom,
    left: f.width * f.safeZone.left,
    right: f.width * f.safeZone.right,
    contentHeight: f.height * (f.safeZone.bottom - f.safeZone.top),
    contentWidth: f.width * (f.safeZone.right - f.safeZone.left),
  };
}

export function isInDeadZone(yPercent: number, format: VideoFormat, adMode: boolean): boolean {
  if (!adMode) return false;
  const f = FORMATS[format];
  return f.adDeadZone ? yPercent >= f.adDeadZone.startY : false;
}
