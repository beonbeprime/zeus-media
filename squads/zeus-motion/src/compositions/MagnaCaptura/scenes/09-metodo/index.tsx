/**
 * Scene9 — Organização do Conhecimento
 * dur=87f | EXIT_F=67 | exit: zoom in + fade (Z-collapse)
 * Mindmap radial — nó central + 6 ramos animados em stagger
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { ci, entryFrom, BackgroundBase, SafeZone } from "../../index";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../design-system";

const EXIT_F = 110;

const NODES = [
  { label: "TRÁFEGO",   angle: -90,  color: COLORS.offWhite, delay: 0  },
  { label: "COPY",      angle: -30,  color: COLORS.gold,    delay: 6  },
  { label: "FUNIL",     angle:  30,  color: COLORS.gold,    delay: 12 },
  { label: "ALUNOS",    angle:  90,  color: COLORS.offWhite, delay: 18 },
  { label: "ESCALA",    angle: 150,  color: COLORS.gold,    delay: 24 },
  { label: "MÉTODO",    angle: 210,  color: COLORS.offWhite, delay: 30 },
];

const DEG_TO_RAD = Math.PI / 180;
const RADIUS = 240; // distância do centro ao nó

export const Scene9: React.FC = () => {
  const frame = useCurrentFrame();

  const exitProg = ci(frame, [EXIT_F, EXIT_F + 18], [0, 1], Easing.in(Easing.exp));
  const exitStyle: React.CSSProperties = {
    opacity: 1 - exitProg,
    transform: `scale(${1 - exitProg * 0.07})`,
    filter: `blur(${exitProg * 14}px)`,
  };

  const labelEntry  = entryFrom(frame, "top", 40, 18);
  const centerEntry = entryFrom(Math.max(0, frame - 8), "bottom", 80, 24);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.04)" />

      <SafeZone justify="center">
        <div style={{ ...exitStyle, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Label */}
          <div style={{ ...labelEntry, fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.muted, textAlign: "center", marginBottom: 24 }}>
            tudo organizado em um só lugar
          </div>

          {/* Mindmap SVG */}
          <div style={{ ...centerEntry, position: "relative", width: 600, height: 600, flexShrink: 0 }}>
            <svg
              width="600"
              height="600"
              viewBox="-300 -300 600 600"
              style={{ overflow: "visible" }}
            >
              {/* Ramos */}
              {NODES.map((node, i) => {
                const rad = node.angle * DEG_TO_RAD;
                const x = RADIUS * Math.cos(rad);
                const y = RADIUS * Math.sin(rad);
                const midX = (RADIUS * 0.5) * Math.cos(rad);
                const midY = (RADIUS * 0.5) * Math.sin(rad);

                const lineProgress = ci(frame, [node.delay + 14, node.delay + 30], [0, 1], Easing.out(Easing.cubic));
                const nodeOpacity  = ci(frame, [node.delay + 24, node.delay + 38], [0, 1]);

                const x2 = x * lineProgress;
                const y2 = y * lineProgress;

                return (
                  <g key={node.label}>
                    {/* Linha do ramo */}
                    <line
                      x1="0" y1="0"
                      x2={x2} y2={y2}
                      stroke={node.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.45"
                      strokeLinecap="round"
                    />

                    {/* Nó do ramo (aparece após a linha) */}
                    <g opacity={nodeOpacity}>
                      {/* Halo */}
                      <circle cx={x} cy={y} r="46"
                        fill="rgba(255,255,255,0.025)"
                        stroke={node.color}
                        strokeWidth="1"
                        strokeOpacity="0.30"
                      />
                      {/* Texto do nó */}
                      <text
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={node.color}
                        fontSize="13"
                        fontFamily="Montserrat, sans-serif"
                        fontWeight="700"
                        letterSpacing="0.12em"
                      >
                        {node.label}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Glow central */}
              <circle cx="0" cy="0" r="68"
                fill="rgba(255,255,255,0.035)"
                opacity={ci(frame, [8, 22], [0, 1])}
              />
              <circle cx="0" cy="0" r="68"
                fill="rgba(0,0,0,0)"
                stroke={COLORS.gold}
                strokeWidth="1.5"
                strokeOpacity="0.55"
                opacity={ci(frame, [8, 22], [0, 1])}
              />

              {/* Texto central */}
              <text
                x="0" y="-10"
                textAnchor="middle"
                fill={COLORS.gold}
                fontSize="22"
                fontFamily="Montserrat, sans-serif"
                fontWeight="900"
                letterSpacing="0.1em"
                opacity={ci(frame, [8, 22], [0, 1])}
              >
                MAGNA
              </text>
              <text
                x="0" y="14"
                textAnchor="middle"
                fill="rgba(255,255,255,0.40)"
                fontSize="11"
                fontFamily="Space Mono, monospace"
                letterSpacing="0.08em"
                opacity={ci(frame, [8, 22], [0, 1])}
              >
                MENTORIA
              </text>
            </svg>
          </div>

          {/* Caption */}
          <div style={{
            marginTop: 0,
            opacity: ci(frame, [52, 64], [0, 1]) * (1 - exitProg),
            fontFamily: FONT_DISPLAY,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: COLORS.gold,
            textAlign: "center",
          }}>
            SISTEMA COMPLETO.
          </div>

        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
