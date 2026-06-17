// ===================================================================
// MentoriaEstrutura21Dias/index.tsx
// Comercial Premium — "Estrutura Absoluta 21 Dias"
// Venda de Mentoria | Dark Luxury Tech Premium
// 1080×1920 | 30fps | ~45s (ajusta via narr-sync.py)
//
// Squad: zeus-motion
// Padrão: BRABO Motion OS v9 + padrao-aprovado-zeus-motion.md
// ===================================================================

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
  useVideoConfig,
} from "remotion";

import {
  COLORS,
  FONT,
  FONT_MONO,
  TV,
  SAFE,
  SCENES_META,
} from "./scene-config";

import {
  NARR_SCENE_TIMING,
  TOTAL_FRAMES_NARR,
  NARR_STATUS,
} from "./narr-timing";

// Primitiva: clamped interpolate (Mandamento BRABO — nunca interpolar sem clamp)
const ci = (
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

// Primitiva: entrada com blur (Mandamento 4 — Motion Blur)
const entryFrom = (
  frame: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 80,
  dur = 22
): React.CSSProperties => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const pos  = ci(frame, [0, dur], [distance * sign, 0], Easing.inOut(Easing.cubic));
  const op   = ci(frame, [0, Math.round(dur * 0.5)], [0, 1]);
  const blur = ci(frame, [0, Math.round(dur * 0.45)], [12, 0], Easing.out(Easing.quad));
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px)`,
    filter:    `blur(${blur}px)`,
  };
};

// Primitiva: saída quadrupla (Mandamento 9 — sempre 4 componentes)
const exitTo = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 1200,
  dur = 18
): React.CSSProperties => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const f    = frame - start;
  const pos  = ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp));
  const op   = ci(f, [dur * 0.35, dur], [1, 0]);
  const sc   = ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp));
  const blur = ci(f, [0, dur], [0, 20], Easing.in(Easing.cubic));
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px) scale(${sc})`,
    filter:    `blur(${blur}px)`,
  };
};

// Combina entrada + saída sem duplicar opacity
const mergeStyles = (...styles: React.CSSProperties[]): React.CSSProperties => ({
  opacity: styles.reduce(
    (acc, s) => acc * (typeof s.opacity === "number" ? s.opacity : 1),
    1
  ),
  transform: styles.map((s) => s.transform).filter(Boolean).join(" ") || undefined,
  filter:    styles.map((s) => s.filter).filter(Boolean).join(" ") || undefined,
});

// ─── Background 3 camadas (Mandamento BRABO + Regra V13) ─────────────
const Background: React.FC<{ glowColor?: string }> = ({
  glowColor = COLORS.glowRedSub,
}) => (
  <AbsoluteFill>
    {/* Camada 1: fundo sólido */}
    <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.bg }} />
    {/* Camada 2: radial glow */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 80% 50% at 50% 28%, ${glowColor} 0%, transparent 70%)`,
      }}
    />
    {/* Camada 3: grain SVG */}
    <div style={{ position: "absolute", inset: 0, opacity: 0.03 }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.88"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  </AbsoluteFill>
);

// ─── Texto animado palavra por palavra (Mandamento 2) ─────────────────
const WordByWord: React.FC<{
  words: string[];
  startFrame: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number) => React.CSSProperties;
}> = ({ words, startFrame, stagger = 3, style, wordStyle }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25em", ...style }}>
      {words.map((word, i) => {
        const delay = startFrame + i * stagger;
        const op    = ci(frame, [delay, delay + 16], [0, 1]);
        const ty    = ci(frame, [delay, delay + 18], [30, 0], Easing.inOut(Easing.cubic));
        const bl    = ci(frame, [delay, delay + 12], [10, 0], Easing.out(Easing.quad));
        return (
          <span
            key={i}
            style={{
              opacity:   op,
              transform: `translateY(${ty}px)`,
              filter:    `blur(${bl}px)`,
              display:   "inline-block",
              ...(wordStyle ? wordStyle(i) : {}),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ─── CENA 1 — O Pensamento Inicial ───────────────────────────────────
// "Quando você pensa em VENDER MENTORIA..."
// Visual: Wireframe Esférico decorativo + Tipografia em safe zone
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const dur   = NARR_SCENE_TIMING[0][1];
  const EXIT  = dur - 20;

  const ringOp  = ci(frame, [0, 20], [0, 1]);
  const ringRot = frame * 1.2;
  const floatY  = Math.sin(frame * 0.035) * 5;

  const entWords  = ["Quando", "você", "pensa", "em"];
  const heroWords = ["VENDER", "MENTORIA"];

  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "left") : {};

  return (
    <AbsoluteFill>
      <Background glowColor={COLORS.glowRedSub} />

      {/* Wireframe esférico — posicionamento em pixel, bem abaixo do texto */}
      {[680, 480, 300].map((size, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 540 - size / 2,
            top:  1050 - size / 2,
            width: size, height: size,
            borderRadius: "50%",
            border: `1px solid rgba(255,255,255,${0.05 - i * 0.01})`,
            transform: `rotate(${(i % 2 === 0 ? 1 : -0.7) * ringRot}deg)`,
            opacity: ringOp,
          }}
        />
      ))}

      {/* Conteúdo tipográfico — safe zone respeitada */}
      <div
        style={{
          ...mergeStyles(exitStyle),
          position: "absolute",
          left: SAFE.x, right: SAFE.x,
          top: SAFE.padTop + 60 + floatY,
          display: "flex", flexDirection: "column", gap: 16,
        }}
      >
        {/* "Quando você pensa em" */}
        <WordByWord
          words={entWords}
          startFrame={4}
          stagger={3}
          style={{
            fontFamily: FONT,
            fontSize: TV.subhead.fontSize,
            fontWeight: 300,
            color: COLORS.gray,
            letterSpacing: -1,
          }}
        />

        {/* VENDER / MENTORIA — fontSize 152 cabe na safe zone (900px) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {heroWords.map((word, i) => {
            const delay = 18 + i * 6;
            const ty    = ci(frame, [delay, delay + 20], [40, 0], Easing.out(Easing.cubic));
            const op    = ci(frame, [delay, delay + 14], [0, 1]);
            const bl    = ci(frame, [delay, delay + 12], [14, 0], Easing.out(Easing.quad));
            return (
              <span
                key={word}
                style={{
                  fontFamily: FONT,
                  fontSize: 152,
                  fontWeight: 900,
                  letterSpacing: -4,
                  lineHeight: 0.92,
                  color: i === 1 ? COLORS.red : COLORS.white,
                  display: "block",
                  opacity: op,
                  transform: `translateY(${ty}px)`,
                  filter: `blur(${bl}px)`,
                  textShadow: i === 1
                    ? `0 0 60px rgba(255,0,46,0.5), 0 0 120px rgba(255,0,46,0.2)`
                    : "none",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── CENA 2 — O Peso do Tempo (1 Ano) ────────────────────────────────
// "...sozinho não vai levar menos do que 1 ANO..."
// Visual: grade de calendário SVG + "1 ANO" em destaque
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const dur   = NARR_SCENE_TIMING[1][1];
  const EXIT  = dur - 20;

  const cardTy = ci(frame, [0, 28], [60, 0], Easing.out(Easing.cubic));
  const cardOp = ci(frame, [0, 16], [0, 1]);

  const numDelay = 20;
  const numTy    = ci(frame, [numDelay, numDelay + 20], [30, 0], Easing.inOut(Easing.cubic));
  const numOp    = ci(frame, [numDelay, numDelay + 14], [0, 1]);

  // "1" transiciona de branco para vermelho discretamente após aparecer
  const colorT   = ci(frame, [45, 70], [0, 1], Easing.inOut(Easing.cubic));
  const numG     = Math.round(255 * (1 - colorT));
  const numB     = Math.round(46 + (255 - 46) * (1 - colorT));
  const numColor = `rgb(255,${numG},${numB})`;

  const anoDelay = 28;
  const anoTy    = ci(frame, [anoDelay, anoDelay + 18], [20, 0], Easing.inOut(Easing.cubic));
  const anoOp    = ci(frame, [anoDelay, anoDelay + 12], [0, 1]);

  const floatY   = Math.sin(frame * 0.038) * 4;
  const entWords = ["Você", "sabe", "que", "sozinho", "não", "vai", "levar", "menos", "do", "que"];
  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "bottom") : {};

  // Grade do calendário: 7 colunas × 5 linhas = 35 células
  const cellW = 36, cellH = 30, cellGap = 6;
  const cols = 7, rows = 5;

  return (
    <AbsoluteFill>
      <Background />
      <div
        style={{
          ...mergeStyles(exitStyle),
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: SAFE.padTop + 60,
          gap: 48,
        }}
      >
        {/* Texto superior */}
        <WordByWord
          words={entWords}
          startFrame={0}
          stagger={2}
          style={{
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 300,
            color: COLORS.gray,
            justifyContent: "center",
            paddingLeft: SAFE.x,
            paddingRight: SAFE.x,
          }}
        />

        {/* Card: calendário + 1 ANO */}
        <div
          style={{
            opacity: cardOp,
            transform: `translateY(${cardTy + floatY}px)`,
            width: 680,
            background: COLORS.surface1,
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: 24,
            boxShadow: "0 50px 100px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 40px 44px",
            gap: 32,
          }}
        >
          {/* Grade do calendário — célula vermelha no dia 1 */}
          <svg
            width={cols * (cellW + cellGap) - cellGap}
            height={rows * (cellH + cellGap) - cellGap}
          >
            {Array.from({ length: rows }).flatMap((_, row) =>
              Array.from({ length: cols }).map((_, col) => {
                const idx = row * cols + col;
                const cellDelay = 6 + idx * 1.0;
                const cellOp = ci(frame, [cellDelay, cellDelay + 8], [0, 1]);
                const isFirst = idx === 0;
                return (
                  <rect
                    key={idx}
                    x={col * (cellW + cellGap)}
                    y={row * (cellH + cellGap)}
                    width={cellW}
                    height={cellH}
                    rx={4}
                    fill={isFirst ? COLORS.red : "rgba(255,255,255,0.05)"}
                    stroke={isFirst ? "none" : "rgba(255,255,255,0.08)"}
                    strokeWidth={1}
                    opacity={cellOp}
                  />
                );
              })
            )}
          </svg>

          {/* "1 ANO" */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 180,
                fontWeight: 900,
                letterSpacing: -6,
                color: numColor,
                lineHeight: 1,
                opacity: numOp,
                transform: `translateY(${numTy}px)`,
                textShadow: `0 0 40px rgba(255,${numG},${numB},${0.15 + colorT * 0.5})`,
              }}
            >
              1
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 72,
                fontWeight: 300,
                letterSpacing: 8,
                color: COLORS.gray,
                lineHeight: 1,
                opacity: anoOp,
                transform: `translateY(${anoTy}px)`,
              }}
            >
              ANO
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── CENA 3 — A Aceleração Guiada (3 Meses) ──────────────────────────
// "...TRÊS MESES para colocar a mão na massa..."
// Visual: texto no topo + Bézier no fundo (baixa opacidade) + ampulheta central
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const dur   = NARR_SCENE_TIMING[2][1];
  const EXIT  = dur - 20;

  // Bézier no fundo — sem obstruir o texto
  const lineProgress = ci(frame, [0, 40], [0, 1], Easing.out(Easing.quad));

  // Ampulheta: areia caindo de cima para baixo
  const sandProgress = ci(frame, [10, EXIT - 10], [0, 1], Easing.in(Easing.quad));
  const dripLen      = Math.sin(frame * 0.4) * 20 + 30;
  const dripOp       = ci(frame, [16, 30], [0, 1]);

  // TRÊS MESES entry
  const delay = 20;
  const ty    = ci(frame, [delay, delay + 20], [30, 0], Easing.inOut(Easing.cubic));
  const op    = ci(frame, [delay, delay + 14], [0, 1]);
  const bl    = ci(frame, [delay, delay + 12], [12, 0], Easing.out(Easing.quad));

  // Número "3" — aparece com spring bounce quando narrador diz "três" (~frame 22)
  const tresBounce = spring({ frame: Math.max(0, frame - 22), fps: 30, config: { damping: 16, mass: 0.8, stiffness: 220 } });
  const tresOp     = ci(frame, [22, 34], [0, 1]);
  const tresFloat  = Math.sin(frame * 0.055) * 6;

  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "right") : {};

  return (
    <AbsoluteFill>
      <Background />
      <div style={{ ...mergeStyles(exitStyle), position: "absolute", inset: 0 }}>

        {/* Bézier decorativa no fundo — curva baixa, não obstrui texto */}
        <svg
          style={{ position: "absolute", inset: 0, opacity: 0.22 }}
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
        >
          <defs>
            <linearGradient id="lineGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLORS.gray} stopOpacity="0" />
              <stop offset="50%" stopColor={COLORS.gray} />
              <stop offset="100%" stopColor={COLORS.white} />
            </linearGradient>
          </defs>
          <path
            d="M 90 1700 Q 350 1300 600 980 T 990 700"
            fill="none"
            stroke="url(#lineGrad3)"
            strokeWidth={3}
            strokeDasharray="2000"
            strokeDashoffset={2000 - lineProgress * 2000}
            strokeLinecap="round"
          />
        </svg>

        {/* Texto — seguro no topo */}
        <div
          style={{
            position: "absolute",
            left: SAFE.x, right: SAFE.x,
            top: SAFE.padTop + 60,
            display: "flex", flexDirection: "column", gap: 12,
          }}
        >
          <WordByWord
            words={["Com", "alguém", "direcionando,", "você", "leva", "uns"]}
            startFrame={0}
            stagger={3}
            style={{
              fontFamily: FONT,
              fontSize: 42,
              fontWeight: 300,
              color: COLORS.gray,
            }}
          />
          <div
            style={{
              opacity: op,
              transform: `translateY(${ty}px)`,
              filter: `blur(${bl}px)`,
              fontFamily: FONT,
              fontSize: TV.headline.fontSize,
              fontWeight: TV.headline.fontWeight,
              letterSpacing: TV.headline.letterSpacing,
              color: COLORS.white,
            }}
          >
            TRÊS MESES
          </div>
          <div
            style={{
              opacity: ci(frame, [delay + 10, delay + 24], [0, 1]),
              fontFamily: FONT,
              fontSize: 38,
              fontWeight: 300,
              color: COLORS.gray,
            }}
          >
            para colocar a mão na massa
          </div>
        </div>

        {/* Número "3" — grande, discreto, com spring bounce */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 440,
            transform: `translateX(-50%) scale(${tresBounce}) translateY(${tresFloat}px)`,
            opacity: tresOp,
            fontFamily: FONT,
            fontSize: 280,
            fontWeight: 900,
            letterSpacing: -8,
            color: "rgba(255,255,255,0.07)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          3
        </div>

        {/* Ampulheta SVG — centro visual da cena */}
        <svg
          style={{
            position: "absolute",
            left: 540 - 100,
            top: 960,
            opacity: dripOp,
          }}
          width="200"
          height="260"
          viewBox="0 0 200 260"
        >
          <defs>
            <clipPath id="sandTopClip3">
              <rect x="50" y="22" width="100" height={70 * (1 - sandProgress)} />
            </clipPath>
            <clipPath id="sandBotClip3">
              <rect x="50" y={130 + 60 * (1 - sandProgress)} width="100" height={70 * sandProgress + 60} />
            </clipPath>
          </defs>
          {/* Estrutura da ampulheta */}
          <polygon
            points="30,12 170,12 170,22 108,96 108,162 170,236 170,248 30,248 30,236 92,162 92,96 30,22"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Areia superior (diminuindo) — vermelha */}
          <polygon
            points="42,22 158,22 108,94 92,94"
            fill="rgba(255,0,46,0.50)"
            clipPath="url(#sandTopClip3)"
          />
          {/* Areia inferior (acumulando) — vermelha */}
          <polygon
            points="92,164 108,164 158,238 42,238"
            fill="rgba(255,0,46,0.40)"
            clipPath="url(#sandBotClip3)"
          />
          {/* Fio de areia — vermelho */}
          <line
            x1="100" y1="97"
            x2="100" y2={97 + dripLen}
            stroke="rgba(255,0,46,0.75)"
            strokeWidth="2.5"
          />
        </svg>

      </div>
    </AbsoluteFill>
  );
};

// ─── CENA 4 — A Quebra do Padrão (21 DIAS) ───────────────────────────
// "Agora se eu te falasse... 21 DIAS..."
// Visual: "21" + "DIAS" agrupados em flexbox único, sem separação exagerada
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const dur   = NARR_SCENE_TIMING[3][1];
  const EXIT  = dur - 20;

  const glowOp  = 0.15 + Math.sin(frame * 0.12) * 0.10;
  const ringRot1 = frame * 1.5;
  const ringRot2 = frame * -1.0;

  // Centro dos anéis alinhado com o bloco 21/DIAS
  const ringCenterX = 540;
  const ringCenterY = 700;

  // Bloco 21 + DIAS entram juntos
  const numDelay = 8;
  const numTy    = ci(frame, [numDelay, numDelay + 22], [50, 0], Easing.out(Easing.cubic));
  const numOp    = ci(frame, [numDelay, numDelay + 14], [0, 1]);
  const numBlur  = ci(frame, [numDelay, numDelay + 12], [30, 0], Easing.out(Easing.quad));

  const diasDelay = numDelay + 8;
  const diasTy    = ci(frame, [diasDelay, diasDelay + 20], [30, 0], Easing.inOut(Easing.cubic));
  const diasOp    = ci(frame, [diasDelay, diasDelay + 12], [0, 1]);

  const floatY    = Math.sin(frame * 0.032) * 6;
  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "left") : {};

  return (
    <AbsoluteFill>
      <Background glowColor={COLORS.glowRed} />

      <div style={{ ...mergeStyles(exitStyle), position: "absolute", inset: 0 }}>

        {/* Anéis concêntricos — posicionamento em pixel */}
        {[700, 520, 340].map((size, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ringCenterX - size / 2,
              top:  ringCenterY - size / 2,
              width: size, height: size,
              borderRadius: "50%",
              border: `1px solid rgba(255,255,255,${0.04 + i * 0.015})`,
              transform: `rotate(${i % 2 === 0 ? ringRot1 : ringRot2}deg)`,
            }}
          />
        ))}

        {/* Glow pulsante */}
        <div
          style={{
            position: "absolute",
            left: ringCenterX - 200,
            top:  ringCenterY - 200,
            width: 400, height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,0,46,${glowOp}) 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />

        {/* "Agora se eu te falasse..." — topo próximo ao bloco */}
        <div
          style={{
            position: "absolute",
            left: SAFE.x, right: SAFE.x,
            top: SAFE.padTop + 30,
          }}
        >
          <WordByWord
            words={["Agora,", "se", "eu", "te", "falasse", "que", "a", "gente", "constrói", "em"]}
            startFrame={0}
            stagger={2}
            style={{
              fontFamily: FONT,
              fontSize: 38,
              fontWeight: 300,
              color: COLORS.gray,
              justifyContent: "center",
            }}
          />
        </div>

        {/* Bloco "21 DIAS" — agrupado em flex column, sem gap excessivo */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 400 + floatY,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* 21 */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 340,
              fontWeight: 900,
              letterSpacing: -8,
              color: COLORS.red,
              lineHeight: 0.88,
              opacity: numOp,
              transform: `translateY(${numTy}px)`,
              filter: `blur(${numBlur}px)`,
              textShadow: `0 0 80px rgba(255,0,46,0.8), 0 0 200px rgba(255,0,46,0.3)`,
              userSelect: "none",
            }}
          >
            21
          </div>

          {/* DIAS — colado embaixo do 21 */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 128,
              fontWeight: 900,
              letterSpacing: -3,
              color: COLORS.white,
              lineHeight: 1.0,
              opacity: diasOp,
              transform: `translateY(${diasTy}px)`,
              textAlign: "center",
            }}
          >
            DIAS
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};

// ─── CENA 5 — A Entrega Estrutural ────────────────────────────────────
// "ÁREA DE MEMBROS + PESSOA PARA FAZER AS VENDAS"
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const dur   = NARR_SCENE_TIMING[4][1];
  const EXIT  = dur - 20;

  const textOp = ci(frame, [0, 16], [0, 1]);
  const textTy = ci(frame, [0, 22], [30, 0], Easing.inOut(Easing.cubic));

  const mockOp = ci(frame, [10, 26], [0, 1]);
  const mockTy = ci(frame, [10, 30], [80, 0], Easing.inOut(Easing.cubic));
  const mockSc = ci(frame, [10, 30], [0.93, 1], Easing.inOut(Easing.cubic));

  const cardOp = ci(frame, [30, 44], [0, 1]);
  const cardTy = ci(frame, [30, 48], [50, 0], Easing.inOut(Easing.cubic));

  const floatY    = Math.sin(frame * 0.038) * 5;
  const floatY2   = Math.sin(frame * 0.038 + 1.5) * 4;
  const borderOp  = 0.4 + Math.sin(frame * 0.14) * 0.35;
  const glowPulse = 0.06 + Math.sin(frame * 0.09) * 0.04;
  const iconPulse = 0.6 + Math.sin(frame * 0.16) * 0.3;
  const notifOp   = 0.6 + Math.sin(frame * 0.20) * 0.3;

  const lineProgress = ci(frame, [20, 55], [0, 1], Easing.out(Easing.cubic));

  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "bottom") : {};

  const modules: { name: string; status: "done" | "active" | "locked" }[] = [
    { name: "Fundação da Mentoria",   status: "done"   },
    { name: "Estrutura de Captação",  status: "active" },
    { name: "Escala com Anúncios",    status: "locked" },
    { name: "Vendas & Fechamentos",   status: "locked" },
  ];

  return (
    <AbsoluteFill>
      <Background glowColor="rgba(255,0,46,0.04)" />
      <div style={{ ...mergeStyles(exitStyle), position: "absolute", inset: 0 }}>

        {/* Texto topo */}
        <div
          style={{
            position: "absolute",
            left: SAFE.x, right: SAFE.x,
            top: SAFE.padTop + 40,
            opacity: textOp,
            transform: `translateY(${textTy}px)`,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 300, color: COLORS.gray }}>
            te entrega uma
          </div>
          <div style={{
            fontFamily: FONT, fontSize: 68, fontWeight: 800,
            color: COLORS.white, letterSpacing: -2, lineHeight: 1.0, marginTop: 6,
          }}>
            ÁREA DE MEMBROS
          </div>
        </div>

        {/* Mockup — área de membros estilo app real */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 470 + floatY,
            transform: `translateX(-50%) translateY(${mockTy}px) scale(${mockSc})`,
            opacity: mockOp,
            width: 780,
            background: "#0A0A0C",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 28,
            boxShadow: "0 60px 120px rgba(0,0,0,0.85), 0 0 80px rgba(255,0,46,0.04)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, rgba(255,0,46,0.12) 0%, transparent 70%)",
            padding: "20px 28px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 9,
                color: COLORS.red, letterSpacing: "0.3em",
              }}>ÁREA DE MEMBROS</div>
              <div style={{
                fontFamily: FONT, fontSize: 19, fontWeight: 700,
                color: COLORS.white, letterSpacing: -0.3, marginTop: 3,
              }}>Olá, Mentorando 👋</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                backgroundColor: COLORS.red,
                boxShadow: `0 0 8px ${COLORS.red}`,
                opacity: notifOp,
              }} />
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `linear-gradient(135deg, rgba(255,0,46,0.7), rgba(180,0,30,0.9))`,
                border: "1.5px solid rgba(255,0,46,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 800, color: COLORS.white }}>M</span>
              </div>
            </div>
          </div>

          {/* Barra de progresso geral */}
          <div style={{ padding: "16px 28px 0" }}>
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: 8,
            }}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 9,
                color: COLORS.gray, letterSpacing: "0.25em",
              }}>PROGRESSO DO PROGRAMA</div>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 11,
                color: COLORS.red, fontWeight: 700,
              }}>{Math.round(lineProgress * 62)}%</div>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
              <div style={{
                height: "100%",
                width: `${lineProgress * 62}%`,
                background: `linear-gradient(90deg, ${COLORS.red}, rgba(255,80,60,0.7))`,
                borderRadius: 3,
                boxShadow: "0 0 10px rgba(255,0,46,0.5)",
              }} />
            </div>
          </div>

          {/* Lista de módulos */}
          <div style={{ padding: "14px 28px 22px", display: "flex", flexDirection: "column", gap: 7 }}>
            {modules.map(({ name, status }, i) => {
              const itemDelay = 22 + i * 7;
              const itemOp = ci(frame, [itemDelay, itemDelay + 10], [0, 1]);
              const itemTy = ci(frame, [itemDelay, itemDelay + 12], [16, 0], Easing.inOut(Easing.cubic));
              const isDone   = status === "done";
              const isActive = status === "active";
              const isLocked = status === "locked";

              return (
                <div key={i} style={{
                  opacity: itemOp,
                  transform: `translateY(${itemTy}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 14px",
                  background: isActive
                    ? "rgba(255,0,46,0.07)"
                    : "rgba(255,255,255,0.02)",
                  border: isActive
                    ? `1px solid rgba(255,0,46,${(iconPulse * 0.35).toFixed(2)})`
                    : "1px solid rgba(255,255,255,0.03)",
                  borderRadius: 11,
                }}>
                  {/* Ícone de status */}
                  <div style={{
                    width: 27, height: 27, borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isDone
                      ? COLORS.red
                      : isActive
                        ? "rgba(255,0,46,0.18)"
                        : "rgba(255,255,255,0.04)",
                    boxShadow: isDone ? "0 0 10px rgba(255,0,46,0.6)" : "none",
                  }}>
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7 L5.5 10 L11.5 4"
                          stroke="white" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : isActive ? (
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        backgroundColor: COLORS.red,
                        boxShadow: `0 0 6px ${COLORS.red}`,
                      }} />
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="2" y="5.5" width="8" height="5.5" rx="1.2"
                          stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <path d="M4 5.5V4a2 2 0 014 0v1.5"
                          stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      </svg>
                    )}
                  </div>

                  {/* Nome do módulo */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: FONT,
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isLocked
                        ? "rgba(255,255,255,0.22)"
                        : isActive
                          ? COLORS.white
                          : "rgba(255,255,255,0.65)",
                      letterSpacing: "0.01em",
                    }}>{name}</div>
                  </div>

                  {/* Tag de status */}
                  <div style={{
                    fontFamily: FONT_MONO,
                    fontSize: 9,
                    color: isDone
                      ? COLORS.red
                      : isActive
                        ? `rgba(255,0,46,${(0.6 + Math.sin(frame * 0.18) * 0.25).toFixed(2)})`
                        : "rgba(255,255,255,0.12)",
                    letterSpacing: "0.15em",
                    flexShrink: 0,
                  }}>
                    {isDone ? "FEITO" : isActive ? "CURSANDO" : "BLOQUEADO"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card vendedor */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 900 + floatY2,
            transform: `translateX(-50%) translateY(${cardTy}px)`,
            opacity: cardOp,
            width: 660,
            background: COLORS.surface1,
            border: `1.5px solid rgba(255,0,46,${borderOp})`,
            borderRadius: 20,
            boxShadow: `0 0 50px rgba(255,0,46,${glowPulse}), 0 20px 60px rgba(0,0,0,0.5)`,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "20px 28px",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="16" r="9" stroke={COLORS.white} strokeWidth="1.5" />
            <path d="M8 42 C8 32 15 28 24 28 C33 28 40 32 40 42"
              stroke={COLORS.white} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 16 C14 16 12 18 12 21 L12 25"
              stroke={COLORS.red} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M32 16 C34 16 36 18 36 21 L36 25"
              stroke={COLORS.red} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: COLORS.gray, letterSpacing: "0.18em", marginBottom: 4 }}>
              INCLUSO NA ESTRUTURA
            </div>
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: COLORS.white, letterSpacing: -0.5 }}>
              Pessoa para fazer as vendas
            </div>
          </div>
          <div style={{
            marginLeft: "auto", width: 10, height: 10, borderRadius: "50%",
            backgroundColor: COLORS.red, boxShadow: `0 0 12px ${COLORS.red}`,
            flexShrink: 0,
          }} />
        </div>

      </div>
    </AbsoluteFill>
  );
};

// ─── CENA 6 — A Engrenagem de Atração ─────────────────────────────────
// "PÁGINA · AUTOMAÇÕES · ANÚNCIOS · TRÁFEGO"
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const dur   = NARR_SCENE_TIMING[5][1];
  const EXIT  = dur - 20;

  const CARDS = [
    { label: "PÁGINA DE VENDAS",     delay: 0  },
    { label: "AUTOMAÇÕES",           delay: 35 },
    { label: "ANÚNCIOS",             delay: 70 },
    { label: "CAMPANHAS DE TRÁFEGO", delay: 105, isRed: true },
  ];

  const exitStyle = frame > EXIT ? exitTo(frame, EXIT, "top") : {};

  return (
    <AbsoluteFill>
      <Background />
      <div
        style={{
          ...mergeStyles(exitStyle),
          position: "absolute",
          left: SAFE.x, right: SAFE.x,
          top: SAFE.padTop,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <WordByWord
          words={["Criamos", "a", "sua"]}
          startFrame={0}
          stagger={3}
          style={{
            fontFamily: FONT,
            fontSize: 44,
            fontWeight: 300,
            color: COLORS.gray,
            marginBottom: 8,
          }}
        />

        {CARDS.map(({ label, delay, isRed }, i) => {
          const cardY  = ci(frame, [delay, delay + 28], [-200, 0], Easing.out(Easing.cubic));
          const cardOp = ci(frame, [delay, delay + 18], [0, 1]);

          // Linha de conexão vetorial vermelha
          const lineW = i < CARDS.length - 1
            ? `${ci(frame, [delay + 28, delay + 38], [0, 100], Easing.out(Easing.quad))}%`
            : "0%";

          return (
            <div key={i} style={{ position: "relative" }}>
              <div
                style={{
                  opacity: cardOp,
                  transform: `translateY(${cardY}px)`,
                  background: COLORS.surface1,
                  border: isRed
                    ? `1px solid rgba(255,0,46,0.4)`
                    : `1px solid rgba(255,255,255,0.04)`,
                  borderRadius: 16,
                  padding: "24px 32px",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                {/* Indicador */}
                <div
                  style={{
                    width: 8, height: 8,
                    borderRadius: "50%",
                    backgroundColor: isRed ? COLORS.red : COLORS.gray,
                    boxShadow: isRed ? `0 0 12px ${COLORS.red}` : "none",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 42,
                    fontWeight: 700,
                    color: isRed ? COLORS.red : COLORS.white,
                    letterSpacing: -1,
                    textShadow: isRed ? `0 0 30px rgba(255,0,46,0.4)` : "none",
                  }}
                >
                  {label}
                </span>
              </div>

              {/* Linha vermelha de conexão para o próximo card */}
              {i < CARDS.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 32,
                    bottom: -14,
                    width: 2,
                    height: lineW,
                    maxHeight: 28,
                    background: COLORS.red,
                    boxShadow: `0 0 8px ${COLORS.red}`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── CENA 7 — O Fechamento (21 Dias + CTA) ────────────────────────────
// "E você começa a vender... AGENDAR UM HORÁRIO"
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const dur   = NARR_SCENE_TIMING[6][1];

  // Card CTA
  const cardSc = spring({ frame, fps: 30, config: { damping: 14, mass: 0.9 } });
  const cardOp = ci(frame, [0, 18], [0, 1]);
  const cardBl = ci(frame, [0, 16], [15, 0], Easing.out(Easing.quad));

  // Idle float do card
  const floatY = Math.sin(frame * 0.028) * 5;

  // Setas pulsantes abaixo do botão
  const arrowPulse = 0.4 + Math.sin(frame * 0.18) * 0.3;
  const arrowTy    = Math.sin(frame * 0.18) * 6;

  // Sweep de luz lazer no botão
  const sweepProgress = frame % 60;
  const sweepX = ci(sweepProgress, [0, 12], [-100, 200], Easing.linear);
  const sweepOp = sweepProgress < 12
    ? interpolate(sweepProgress, [0, 4, 10, 12], [0, 0.6, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill>
      <Background glowColor="rgba(255,0,46,0.08)" />

      {/* CTA Card */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `calc(42% + ${floatY}px)`,
          transform: `translate(-50%, -50%) scale(${cardSc})`,
          opacity: cardOp,
          filter: `blur(${cardBl}px)`,
          width: 720,
          background: COLORS.surface1,
          border: "1.5px solid rgba(255,255,255,0.12)",
          borderRadius: 32,
          padding: 48,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          alignItems: "center",
        }}
      >
        {/* Glow central pulsante */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 32,
            background: `radial-gradient(circle, rgba(255,0,46,${0.04 + Math.sin(frame * 0.1) * 0.02}) 0%, transparent 70%)`,
          }}
        />

        {/* "E você começa a vender mentoria em" */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 300,
            color: COLORS.gray,
            textAlign: "center",
            position: "relative",
          }}
        >
          E você começa a vender mentoria em
        </div>

        {/* 21 DIAS */}
        {(() => {
          const delay = 16;
          const op  = ci(frame, [delay, delay + 14], [0, 1]);
          const bl  = ci(frame, [delay, delay + 12], [20, 0], Easing.out(Easing.quad));
          const glowPulse = 0.6 + Math.sin(frame * 0.12) * 0.2;
          return (
            <div
              style={{
                opacity: op,
                filter: `blur(${bl}px)`,
                fontFamily: FONT,
                fontSize: 100,
                fontWeight: 900,
                letterSpacing: -3,
                color: COLORS.red,
                textShadow: `0 0 60px rgba(255,0,46,${glowPulse})`,
                position: "relative",
              }}
            >
              21 DIAS
            </div>
          );
        })()}

        {/* Botão AGENDAR */}
        {(() => {
          const delay = 28;
          const op = ci(frame, [delay, delay + 14], [0, 1]);
          const ty = ci(frame, [delay, delay + 18], [20, 0], Easing.inOut(Easing.cubic));
          return (
            <>
              <div
                style={{
                  opacity: op,
                  transform: `translateY(${ty}px)`,
                  width: "100%",
                  height: 90,
                  backgroundColor: COLORS.red,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 15px 30px rgba(255, 0, 46, 0.25)",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                {/* Sweep lazer */}
                <div
                  style={{
                    position: "absolute",
                    left: `${sweepX}%`,
                    top: 0, bottom: 0,
                    width: 60,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    transform: "skewX(-20deg)",
                    opacity: sweepOp,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 36,
                    fontWeight: 800,
                    color: COLORS.white,
                    letterSpacing: 1,
                    position: "relative",
                  }}
                >
                  AGENDAR UM HORÁRIO
                </span>
              </div>

              {/* Setas apontando para baixo */}
              <div
                style={{
                  opacity: op * arrowPulse,
                  transform: `translateY(${ty + arrowTy}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  paddingTop: 8,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <svg key={i} width="32" height="18" viewBox="0 0 32 18" fill="none"
                    style={{ opacity: 1 - i * 0.25 }}
                  >
                    <path
                      d="M4 4 L16 14 L28 4"
                      stroke={COLORS.white}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
              </div>
            </>
          );
        })()}
      </div>

      {/* Indicador de status da narração */}
      {NARR_STATUS === "original" && (
        <div
          style={{
            position: "absolute",
            bottom: 60, right: 60,
            fontFamily: FONT_MONO,
            fontSize: 12,
            color: "rgba(255,0,46,0.4)",
            letterSpacing: "0.2em",
          }}
        >
          TIMING: BRIEFING ORIGINAL
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── Composição Principal ─────────────────────────────────────────────
const SCENE_COMPONENTS: React.FC[] = [
  Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7,
];

export const MentoriaEstrutura21Dias: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Narração sincronizada com as cenas */}
      <Audio src={staticFile("ads-05-narrador.mp3")} />

      {/* Música de fundo — inicia em 23.67s da faixa, fim do vídeo = exatos 60s da música */}
      <Audio src={staticFile("ads-05-v3-music.mp3")} startFrom={710} volume={0.12} />

      {NARR_SCENE_TIMING.map(([from, dur], i) => {
        const SceneComponent = SCENE_COMPONENTS[i];
        if (!SceneComponent) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <SceneComponent />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export { TOTAL_FRAMES_NARR };
