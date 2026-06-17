/**
 * MagnaCaptura — v4
 * 1357 frames (45.2s) @ 30fps | 1080×1920 (vertical)
 * Black & White Premium — vermelho só para negativos
 *
 * REGRA SAFE ZONE: NADA abaixo de y=1280 (terço inferior = vazio para overlay Instagram)
 * REGRA MOTION: todo elemento entra com entryFrom blur/smooth individual (stagger explícito)
 * REGRA GRADIENT TEXT: container pai NUNCA tem filter:blur (retângulo sólido) — usar exitToNB
 *
 * SCENE_TIMING (142f = 4.73s por cena, 7f overlap):
 *  C1  0     142  105  — Frase + Pergunta (abertura) + label Mentoria Magna
 *  C2  135   142  100  — O Caos do Passado
 *  C3  270   142  77   — O Funil Quebrado
 *  C4  405   142  110  — O Divisor de Mundos
 *  C5  540   142  110  — A Máquina de Low Ticket
 *  C6  675   142  110  — A Engrenagem Completa
 *  C7  810   142  110  — Área de Membros Premium
 *  C8  945   142  100  — O Fator 21 Dias
 *  C9  1080  142  110  — Organização do Conhecimento
 *  C10 1215  142  null — A Chamada (sem saída)
 */

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  Easing,
} from "remotion";
import { Scene1  } from "./scenes/01-sonho";
import { Scene2  } from "./scenes/02-caos";
import { Scene3  } from "./scenes/03-funil";
import { Scene4  } from "./scenes/04-divisor";
import { Scene5  } from "./scenes/05-low-ticket";
import { Scene6  } from "./scenes/06-engrenagem";
import { Scene7  } from "./scenes/07-membros";
import { Scene8  } from "./scenes/08-21dias";
import { Scene9  } from "./scenes/09-metodo";
import { Scene10 } from "./scenes/10-cta";
import { COLORS, PAD_TOP, SAFE_BOTTOM, SAFE_X } from "./design-system";

// ─── PRIMITIVAS BRABO v9.0 ───────────────────────────────────────────────────

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
  distance = 80,
  dur = 22
): React.CSSProperties => {
  const [axis, sign] = SIGN_MAP[dir];
  const pos = ci(frame, [0, dur], [distance * sign, 0], Easing.out(Easing.cubic));
  return {
    opacity: ci(frame, [0, Math.round(dur * 0.55)], [0, 1]),
    transform: `translate${axis}(${pos}px)`,
    filter: `blur(${ci(frame, [0, Math.round(dur * 0.45)], [10, 0], Easing.out(Easing.quad))}px)`,
  };
};

export const exitTo = (
  frame: number,
  start: number,
  dir: Direction,
  distance = 1200,
  dur = 18
): React.CSSProperties => {
  const [axis, sign] = SIGN_MAP[dir];
  return {
    opacity: ci(frame, [start + dur * 0.35, start + dur], [1, 0]),
    transform: `translate${axis}(${ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp))}px) scale(${ci(frame, [start, start + dur], [1, 0.94], Easing.in(Easing.exp))})`,
    filter: `blur(${ci(frame, [start, start + dur], [0, 18], Easing.in(Easing.cubic))}px)`,
  };
};

// NB = No Blur — container pai com gradient text (evita retângulo sólido)
export const exitToNB = (
  frame: number,
  start: number,
  dir: Direction,
  distance = 1200,
  dur = 18
): React.CSSProperties => {
  const [axis, sign] = SIGN_MAP[dir];
  return {
    opacity: ci(frame, [start + dur * 0.35, start + dur], [1, 0]),
    transform: `translate${axis}(${ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp))}px) scale(${ci(frame, [start, start + dur], [1, 0.94], Easing.in(Easing.exp))})`,
  };
};

export const mergeStyles = (
  entry: React.CSSProperties,
  exit: React.CSSProperties
): React.CSSProperties => ({
  ...entry,
  ...exit,
  opacity: ((entry.opacity as number) ?? 1) * ((exit.opacity as number) ?? 1),
  transform: [entry.transform, exit.transform].filter(Boolean).join(" "),
  filter: [entry.filter, exit.filter].filter(Boolean).join(" "),
});

// ─── BACKGROUND BASE ─────────────────────────────────────────────────────────

export const BackgroundBase: React.FC<{ glowColor?: string }> = ({
  glowColor = COLORS.goldGlow,
}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: COLORS.bg }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 75% 45% at 50% 28%, ${glowColor} 0%, transparent 70%)`,
      }}
    />
    <AbsoluteFill style={{ opacity: 0.035 }}>
      <svg width="100%" height="100%">
        <filter id="magna-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.88"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#magna-noise)" />
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);

// ─── SAFE ZONE WRAPPER ───────────────────────────────────────────────────────
// Garante que NENHUM conteúdo ultrapassa y=1280.
// Centraliza verticalmente dentro dos 2/3 superiores.

export const SafeZone: React.FC<{ children: React.ReactNode; justify?: "center" | "flex-start" | "flex-end" }> = ({
  children,
  justify = "center",
}) => (
  <div
    style={{
      position: "absolute",
      top: PAD_TOP,
      left: SAFE_X,
      right: SAFE_X,
      height: SAFE_BOTTOM - PAD_TOP, // 1120px
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: justify,
      overflow: "hidden", // nunca vaza abaixo do safe bottom
    }}
  >
    {children}
  </div>
);

// ─── SCENE_TIMING ────────────────────────────────────────────────────────────

const SCENE_TIMING: [number, number, React.FC][] = [
  [0,    142, Scene1 ],
  [135,  142, Scene2 ],
  [270,  142, Scene3 ],
  [405,  142, Scene4 ],
  [540,  142, Scene5 ],
  [675,  142, Scene6 ],
  [810,  142, Scene7 ],
  [945,  142, Scene8 ],
  [1080, 142, Scene9 ],
  [1215, 142, Scene10],
];

// ─── COMPOSITION ─────────────────────────────────────────────────────────────

export const MagnaCaptura: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {SCENE_TIMING.map(([from, dur, SceneComponent], i) => (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <SceneComponent />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
