// ===================================================================
// MagnaMotion — Elementos compartilhados das cenas
// SceneShell (background + logo + zona de conteúdo + transições)
// Tag (SÓ para layouts de itens) e Divider (linha gradiente do deck)
//
// TRANSIÇÕES (feedback 2026-06-10):
// - Saída alterna automaticamente: direita→esquerda e baixo→cima
// - "rotate": giro de câmera 90° (eixo canto inferior esquerdo),
//   a cena seguinte ENTRA no mesmo giro (estilo câmera do After Effects)
// ===================================================================

import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { blurIn, ci, exitTo } from "../design-system/effects";
import {
  COLORS,
  EXIT_DUR,
  FONT_DISPLAY,
  GRADIENT_TEXT,
  H,
  PAD_TOP,
  PAD_X,
  SAFE_BOTTOM,
} from "../design-system/tokens";
import { AccentIcon } from "../components/AccentIcon";
import { MagnaBackground } from "../components/MagnaBackground";
import { MagnaLogo } from "../components/MagnaLogo";
import type { ResolvedScene } from "../types";

// Giro de câmera: easy ease (feedback 2026-06-10) — começa lento,
// acelera no meio e desacelera no fim, como keyframes easy-ease do
// After Effects. NUNCA linear nem aceleração só de um lado (amador).
const ROTATE_DUR = 26;
const ROTATE_EASE = Easing.inOut(Easing.cubic);

export const SceneShell: React.FC<{
  resolved: ResolvedScene;
  children: React.ReactNode;
}> = ({ resolved, children }) => {
  const frame = useCurrentFrame();
  const { scene, fromFrame, durFrames, isLast, exitMode, enterRotate } = resolved;

  // ── Entrada ──
  // Giro de câmera: a cena entra rotacionando de +90° para 0°
  const enterRot = enterRotate
    ? ci(frame, [0, ROTATE_DUR], [90, 0], ROTATE_EASE)
    : 0;
  // Fade do background (cross com a saída da cena anterior)
  const bgFade = fromFrame === 0 || enterRotate ? 1 : ci(frame, [0, 8], [0, 1]);

  // ── Saída ──
  const rotateExitStart = durFrames - ROTATE_DUR;
  const exitRot =
    !isLast && exitMode === "rotate"
      ? ci(frame, [rotateExitStart, durFrames], [0, -90], ROTATE_EASE)
      : 0;
  const exitStart = durFrames - EXIT_DUR;
  const contentExit =
    !isLast && exitMode !== "rotate"
      ? exitTo(frame, exitStart, exitMode === "up" ? "top" : "left")
      : {};

  const totalRot = enterRot + exitRot;

  return (
    <AbsoluteFill
      style={{
        opacity: bgFade,
        transform: totalRot !== 0 ? `rotate(${totalRot}deg)` : undefined,
        transformOrigin: "0% 100%", // eixo: canto inferior esquerdo
      }}
    >
      <MagnaBackground variant={scene.bg ?? "base"} />
      <MagnaLogo />
      <div
        style={{
          position: "absolute",
          top: PAD_TOP,
          left: PAD_X,
          right: PAD_X,
          height: SAFE_BOTTOM - PAD_TOP,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          ...contentExit,
        }}
      >
        {children}
        {scene.accentIcon && (
          <AccentIcon
            id={scene.accentIcon}
            delay={Math.max(6, resolved.lines[0]?.words[0]?.startFrame ?? 6)}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Tag: SÓ em layouts de itens (list/grid) — validado no buildTimeline */
export const Tag: React.FC<{ text: string; delay?: number; style?: React.CSSProperties }> = ({
  text,
  delay = 6,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontSize: 27,
        fontWeight: 600,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: COLORS.rg2,
        marginBottom: 44,
        ...blurIn(frame, delay, 26),
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Divider do deck: linha fina com gradiente rosegold */
export const Divider: React.FC<{
  delay?: number;
  vertical?: boolean;
  style?: React.CSSProperties;
}> = ({ delay = 0, vertical = false, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: vertical ? 2 : 120,
        height: vertical ? 90 : 2,
        background: GRADIENT_TEXT,
        borderRadius: 2,
        opacity: 0.85,
        ...blurIn(frame, delay, 22),
        ...style,
      }}
    />
  );
};

/** Altura útil da zona de conteúdo (referência para validações visuais) */
export const CONTENT_HEIGHT = SAFE_BOTTOM - PAD_TOP;
export const FULL_HEIGHT = H;
