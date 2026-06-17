/**
 * MentoriaPitch — v3 (Reels portrait + narração sincronizada)
 * 1620 frames (54.0s) @ 30fps | 1080×1920
 * Conteúdo dentro dos 2/3 superiores (y <= 1280px)
 * Apple Minimalist Kinetic: Void/Flash alternating
 *
 * SCENE_TIMING (Sequence from / durationInFrames) — sincronizado com narração:
 *  S1  from=0     dur=237   Gancho     VOID   "Se você é mentor..."
 *  S2  from=225   dur=196   Problema   VOID   "O problema é que..."
 *  S3  from=409   dur=167   Autoridade VOID   "Na verdade, nós construímos..."
 *  S4  from=564   dur=188   Metodo     FLASH  "Te entregamos tudo pronto."
 *  S5  from=740   dur=122   Resultado  VOID   "Uma máquina de vendas..."
 *  S6  from=850   dur=172   Estrutura  FLASH  "Páginas, anúncios, automações..."
 *  S7  from=1010  dur=134   Prova      VOID   "E ainda ganha área de membros..."
 *  S8  from=1132  dur=293   Confronto  VOID   "Isso fica pronto em 21 dias..."
 *  S9  from=1413  dur=207   CTA        FLASH  "Se você quer vender..."
 *  Total: 1620 frames
 */

import React from "react";
import { AbsoluteFill, Sequence, Audio, interpolate, Easing } from "remotion";
import { staticFile } from "remotion";
import { Scene1Gancho }    from "./scenes/Scene1Gancho";
import { Scene2Matematica } from "./scenes/Scene2Matematica";
import { Scene3Autoridade } from "./scenes/Scene3Autoridade";
import { Scene4Metodo }     from "./scenes/Scene4Metodo";
import { Scene5Resultado }  from "./scenes/Scene5Resultado";
import { Scene6Estrutura }  from "./scenes/Scene6Estrutura";
import { Scene7Prova }      from "./scenes/Scene7Prova";
import { Scene8Confronto }  from "./scenes/Scene8Confronto";
import { Scene9CTA }        from "./scenes/Scene9CTA";

// ─── PRIMITIVAS BRABO v9.0 ───────────────────────────────────────────────────

// Motion blur: blur máximo no início do movimento, decai até 0 conforme elemento pousa
// delay = frame em que o elemento começa a se mover
export const mBlur = (
  frame: number,
  delay: number,
  dur = 12,
  amount = 10
): number =>
  Math.max(0, amount * interpolate(frame, [delay, delay + dur], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

// Scale blur: blur proporcional à distância do scale atual até 1.0
// Automático: quando punchIn=2.5 → blur alto; quando punchIn=1.0 → blur zero
export const scaleBlur = (currentScale: number, sensitivity = 5): number =>
  Math.max(0, Math.abs(currentScale - 1.0) * sensitivity);

export const ci = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  ease?: (t: number) => number
) =>
  interpolate(frame, [f0, f1], [v0, v1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export type Direction = "left" | "right" | "top" | "bottom";
const SIGN_MAP: Record<Direction, [string, number]> = {
  left:   ["X", -1],
  right:  ["X",  1],
  top:    ["Y", -1],
  bottom: ["Y",  1],
};

export const entryFrom = (
  frame: number,
  dir: Direction,
  distance = 100,
  dur = 22
): React.CSSProperties => {
  const [axis, sign] = SIGN_MAP[dir];
  const pos = ci(frame, [0, dur], [distance * sign, 0], Easing.out(Easing.cubic));
  return {
    opacity:   ci(frame, [0, Math.round(dur * 0.5)], [0, 1]),
    transform: `translate${axis}(${pos}px)`,
    filter:    `blur(${ci(frame, [0, Math.round(dur * 0.45)], [12, 0], Easing.out(Easing.quad))}px)`,
  };
};

export const exitTo = (
  frame: number,
  start: number,
  dir: Direction,
  distance = 1920,
  dur = 18
): React.CSSProperties => {
  const [axis, sign] = SIGN_MAP[dir];
  return {
    opacity:   ci(frame, [start + dur * 0.35, start + dur], [1, 0]),
    transform: `translate${axis}(${ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp))}px) scale(${ci(frame, [start, start + dur], [1, 0.94], Easing.in(Easing.exp))})`,
    filter:    `blur(${ci(frame, [start, start + dur], [0, 20], Easing.in(Easing.cubic))}px)`,
  };
};

// exitToNB: exit sem blur — usar em elementos com WebkitBackgroundClip:text
export const exitToNB = (
  frame: number,
  start: number,
  dir: Direction,
  distance = 1920,
  dur = 18
): React.CSSProperties => {
  const [axis, sign] = SIGN_MAP[dir];
  return {
    opacity:   ci(frame, [start + dur * 0.35, start + dur], [1, 0]),
    transform: `translate${axis}(${ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp))}px) scale(${ci(frame, [start, start + dur], [1, 0.94], Easing.in(Easing.exp))})`,
  };
};

export const mergeStyles = (
  entry: React.CSSProperties,
  exit: React.CSSProperties
): React.CSSProperties => ({
  ...entry,
  ...exit,
  opacity:   ((entry.opacity as number) ?? 1) * ((exit.opacity as number) ?? 1),
  transform: [entry.transform, exit.transform].filter(Boolean).join(" "),
  filter:    [entry.filter, exit.filter].filter(Boolean).join(" "),
});

// ─── BACKGROUNDS ─────────────────────────────────────────────────────────────

export const VoidBackground: React.FC<{ glowColor?: string }> = ({
  glowColor = "rgba(255,255,255,0.025)",
}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "#000000" }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${glowColor} 0%, transparent 70%)`,
      }}
    />
    {/* Noise grain */}
    <AbsoluteFill style={{ opacity: 0.04 }}>
      <svg width="100%" height="100%">
        <filter id="n-mp">
          <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n-mp)" />
      </svg>
    </AbsoluteFill>
    {/* Vignette */}
    <AbsoluteFill
      style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.8)", pointerEvents: "none" }}
    />
  </AbsoluteFill>
);

export const FlashBackground: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "#FFFFFF" }} />
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,0,0,0.015) 0%, transparent 70%)",
      }}
    />
  </AbsoluteFill>
);

// ─── COMPOSIÇÃO PRINCIPAL ─────────────────────────────────────────────────────

export const MentoriaPitch: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Narração sincronizada */}
      <Audio src={staticFile("narration.mp3")} />

      {/* S1 — Gancho (VOID, 0-237) */}
      <Sequence from={0} durationInFrames={237}>
        <Scene1Gancho />
      </Sequence>

      {/* S2 — Problema (VOID, 225-421) — overlap 12f */}
      <Sequence from={225} durationInFrames={196}>
        <Scene2Matematica />
      </Sequence>

      {/* S3 — Autoridade (VOID, 409-576) — overlap 12f */}
      <Sequence from={409} durationInFrames={167}>
        <Scene3Autoridade />
      </Sequence>

      {/* S4 — Metodo (FLASH, 564-752) — overlap 12f */}
      <Sequence from={564} durationInFrames={188}>
        <Scene4Metodo />
      </Sequence>

      {/* S5 — Resultado VOID accent green (740-862) */}
      <Sequence from={740} durationInFrames={122}>
        <Scene5Resultado />
      </Sequence>

      {/* S6 — Estrutura (FLASH, 850-1022) — overlap 12f */}
      <Sequence from={850} durationInFrames={172}>
        <Scene6Estrutura />
      </Sequence>

      {/* S7 — Prova (VOID, 1010-1144) — overlap 12f */}
      <Sequence from={1010} durationInFrames={134}>
        <Scene7Prova />
      </Sequence>

      {/* S8 — Confronto (VOID, 1132-1425) — overlap 12f */}
      <Sequence from={1132} durationInFrames={293}>
        <Scene8Confronto />
      </Sequence>

      {/* S9 — CTA (FLASH, 1413-1620) — overlap 12f */}
      <Sequence from={1413} durationInFrames={207}>
        <Scene9CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
