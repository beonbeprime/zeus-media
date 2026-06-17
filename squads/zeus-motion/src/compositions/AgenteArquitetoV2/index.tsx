/**
 * AgenteArquitetoV2 — Brabo Edition
 * 45s / 1350 frames @ 30fps | 1080 × 1920
 * Kinetic Luxury Tech | Safe zone: conteúdo NUNCA abaixo y=1200px
 *
 * Paleta: #050505 (dark) | #F8F8FA (light) | #E60000 (red)
 * Fontes: Bebas Neue (display) + Inter (corpo)
 *
 * Timeline (Sequence from / dur):
 *  C1  from=0     dur=190   Hook: "Você quer vender MENTORIA..."
 *  C2  from=180   dur=190   Caos: "Seu conhecimento está na sua cabeça"
 *  C3  from=360   dur=220   Solução: "Agente Arquiteto"
 *  C4  from=570   dur=285   Magia: "8 minutos → mentoria completa"
 *  C5  from=845   dur=195   Faturamento: "50 MIL POR MÊS"
 *  C6  from=1030  dur=200   Bônus: "Encontro individual"
 *  C7  from=1220  dur=130   CTA: "Toque no botão Saiba Mais"
 *  Total: 1350 frames
 */

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ── Font import (Google Fonts via style tag) ─────────────────────────────────
const FontLoader: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;700;900&display=swap');
  `}</style>
);

// ── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  DARK:  "#050505",
  LIGHT: "#F8F8FA",
  RED:   "#E60000",
  WHITE: "#FFFFFF",
  GREY:  "#88888E",
  GLOW:  "rgba(230,0,0,0.4)",
} as const;

const BEBAS = "'Bebas Neue', Impact, 'Arial Narrow', sans-serif";
const INTER  = "'Inter', -apple-system, Helvetica Neue, sans-serif";

// ── Helper ci (clamped interpolate) ────────────────────────────────────────
const ci = (
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

// ── Noise SVG layer ─────────────────────────────────────────────────────────
const Noise: React.FC<{ id: string; op?: number }> = ({ id, op = 0.035 }) => (
  <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.88"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  </AbsoluteFill>
);

// ── Word entry animation ────────────────────────────────────────────────────
const wordEntryStyle = (frame: number, delay: number): React.CSSProperties => {
  const f = Math.max(frame - delay, 0);
  if (frame < delay) return { opacity: 0, transform: "scale(2.2)", filter: "blur(40px)" };
  return {
    opacity:   ci(f, [0, 12], [0, 1]),
    transform: `scale(${ci(f, [0, 22], [2.2, 1], Easing.out(Easing.cubic))})`,
    filter:    `blur(${ci(f, [0, 15], [40, 0], Easing.out(Easing.quad))}px)`,
  };
};

// ── Quadruple Exit (all words fly in same direction) ───────────────────────
const quadExit = (
  frame: number,
  startF: number,
  dir: "up" | "down" | "left" | "right" | "forward" = "up",
  dur = 12
): React.CSSProperties => {
  if (frame < startF) return {};
  const t = ci(frame, [startF, startF + dur], [0, 1], Easing.inOut(Easing.cubic));
  const blurV = ci(frame, [startF, startF + dur], [0, 28], Easing.in(Easing.cubic));
  const scaleV = ci(frame, [startF, startF + dur], [1, 0.88]);
  const opacity = ci(frame, [startF + dur * 0.35, startF + dur], [1, 0]);

  let tx = 0, ty = 0;
  if (dir === "up")      ty = t * -900;
  if (dir === "down")    ty = t * 900;
  if (dir === "left")    tx = t * -900;
  if (dir === "right")   tx = t * 900;
  if (dir === "forward") return { opacity, transform: `scale(${1 + t * 18})`, filter: `blur(${blurV}px)` };

  return {
    opacity,
    transform: `translate(${tx}px, ${ty}px) scale(${scaleV})`,
    filter: `blur(${blurV}px)`,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// CENA 1 — Hook de Retenção (from=0, dur=190)
// "50K POR MÊS COM MENTORIA / DEPENDE DE / UMA COISA"
// BG: escuro | Camera: Dolly In suave | Blur progressivo em palavras anteriores
// ─────────────────────────────────────────────────────────────────────────────
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  // Dolly In muito suave: 1 → 1.022 ao longo de toda a cena
  const dolly = ci(frame, [0, 185], [1, 1.022], Easing.out(Easing.cubic));

  // Glow de fundo pulsa levemente com "50K"
  const glowOp = ci(frame, [8, 50], [0, 0.07]) + Math.sin(frame * 0.038) * 0.01;

  const EXIT_F = 178;
  const PUSH_DUR = 24; // frames para animar o push-up de cada palavra

  const words = [
    { text: "50K",          size: 290, color: C.RED,   delay: 8,   h: 300, special: true },
    { text: "POR MÊS",      size: 100, color: C.GREY,  delay: 32,  h: 108 },
    { text: "COM MENTORIA", size: 115, color: C.WHITE,  delay: 58,  h: 124 },
    { text: "DEPENDE DE",   size: 78,  color: C.GREY,   delay: 92,  h: 84  },
    { text: "UMA COISA",    size: 152, color: C.WHITE,  delay: 118, h: 162 },
  ] as const;

  const GAP = 8;
  const ANCHOR = 1045;

  // Push-up animado: posição de cada palavra inclui deslocamento progressivo
  // à medida que palavras posteriores aparecem, empurrando as anteriores para cima
  const positions = words.map((w, i) => {
    if (frame < w.delay) return 2000;
    // posição base: ancorada no ANCHOR, sem contar empurrões
    let pos = ANCHOR - w.h;
    // somar empurrões de palavras subsequentes que já apareceram
    for (let j = i + 1; j < words.length; j++) {
      if (frame < words[j].delay) continue;
      const pushAmt = words[j].h + GAP;
      pos -= ci(frame, [words[j].delay, words[j].delay + PUSH_DUR], [0, pushAmt], Easing.inOut(Easing.cubic));
    }
    return pos;
  });

  const exit = quadExit(frame, EXIT_F, "up");
  const exitOp = (exit.opacity as number) ?? 1;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.DARK }} />
      <Noise id="n1" op={0.04} />

      {/* Radial glow vermelho pulsante */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 65% 38% at 50% 52%, rgba(230,0,0,${glowOp}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Camera wrapper — dolly in suave */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${dolly})`,
          transformOrigin: "center center",
        }}
      >
        {words.map((w, i) => {
          if (frame < w.delay - 3) return null;

          const f = Math.max(frame - w.delay, 0);
          const isFirst  = i === 0;
          const slideFrom = isFirst ? 35 : 20;
          const fadeDur   = isFirst ? 32 : 26;
          const blurFrom  = isFirst ? 10 : 7;

          // Entrada: slide de baixo + fade + blur leve (sem scale)
          const entryOp   = ci(f, [0, fadeDur], [0, 1], Easing.out(Easing.cubic));
          const entryY    = ci(f, [0, fadeDur - 4], [slideFrom, 0], Easing.out(Easing.cubic));
          const entryBlur = ci(f, [0, fadeDur - 6], [blurFrom, 0], Easing.out(Easing.quad));

          // Blur-out progressivo: quando próxima palavra aparece, esta desfoca
          const nextDelay = i + 1 < words.length ? words[i + 1].delay : 99999;
          const blurOut  = ci(frame, [nextDelay, nextDelay + 30], [0, 4.5], Easing.out(Easing.quad));
          const dimOut   = ci(frame, [nextDelay, nextDelay + 30], [1, 0.38], Easing.out(Easing.quad));

          const isSpecial = (w as { special?: boolean }).special;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: positions[i],
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: BEBAS,
                fontSize: w.size,
                color: w.color,
                lineHeight: 1,
                letterSpacing: isSpecial ? "-5px" : "-1px",
                ...(isSpecial && {
                  textShadow: `0 0 90px ${C.GLOW}, 0 0 40px ${C.GLOW}`,
                }),
                opacity: entryOp * dimOut * exitOp,
                transform: `translateY(${entryY}px) ${exit.transform ?? ""}`.trim(),
                filter: `blur(${entryBlur + blurOut}px) ${exit.filter ?? ""}`.trim(),
              }}
            >
              {w.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CENA 2 — Caos da Estruturação (from=180, dur=190)
// "Seu conhecimento existe. O problema é que está na sua cabeça."
// BG: branco clínico | Camera: Tilt Down 3D
// ─────────────────────────────────────────────────────────────────────────────
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  // Tilt Down: perspectiva sutil
  const tiltX = ci(frame, [0, 160], [1.5, -1], Easing.inOut(Easing.quad));
  const tiltY  = ci(frame, [0, 160], [0, -40], Easing.inOut(Easing.quad));

  const EXIT_F = 178;

  const lines = [
    { text: "SEU CONHECIMENTO",           size: 110, col: "#050505", delay: 8,   fromLeft: true  },
    { text: "EXISTE.",                    size: 130, col: "#050505", delay: 28,  fromLeft: false },
    { text: "O PROBLEMA",                 size: 96,  col: C.GREY,    delay: 55,  fromLeft: true  },
    { text: "É QUE ELE AINDA ESTÁ",       size: 80,  col: C.GREY,    delay: 82,  fromLeft: false },
    { text: "NA SUA CABEÇA.",             size: 118, col: "#050505", delay: 112, fromLeft: true,  glitch: true },
  ] as const;

  const GAP = 8;
  const ANCHOR = 1000;
  const PUSH_DUR2 = 26;
  const heights = [122, 144, 108, 90, 132];

  // Push-up suave: posição animada, igual à Scene 1
  const positions = lines.map((ln, i) => {
    if (frame < ln.delay) return 2000;
    let pos = ANCHOR - heights[i];
    for (let j = i + 1; j < lines.length; j++) {
      if (frame < lines[j].delay) continue;
      const pushAmt = heights[j] + GAP;
      pos -= ci(frame, [lines[j].delay, lines[j].delay + PUSH_DUR2], [0, pushAmt], Easing.inOut(Easing.cubic));
    }
    return pos;
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.LIGHT }} />
      <Noise id="n2" op={0.025} />

      {/* Camera Tilt Down */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: "1200px",
          perspectiveOrigin: "50% 40%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotateX(${tiltX}deg) translateY(${tiltY}px)`,
            transformOrigin: "50% 40%",
          }}
        >
          {lines.map((ln, i) => {
            if (frame < ln.delay - 3) return null;

            // Entry: vem da esquerda ou direita
            const entryX = ci(
              frame,
              [ln.delay, ln.delay + 22],
              [ln.fromLeft ? -380 : 380, 0],
              Easing.out(Easing.cubic)
            );
            const entryOp = ci(frame, [ln.delay, ln.delay + 14], [0, 1]);
            const entryBlur = ci(frame, [ln.delay, ln.delay + 18], [18, 0], Easing.out(Easing.quad));

            const exit = quadExit(frame, EXIT_F, "forward", 10);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: positions[i],
                  left: 60,
                  right: 60,
                  textAlign: "center",
                  fontFamily: BEBAS,
                  fontSize: ln.size,
                  color: ln.col,
                  lineHeight: 1,
                  letterSpacing: "-1px",
                  opacity: entryOp * ((exit.opacity as number) ?? 1),
                  transform: `translateX(${entryX}px) ${exit.transform ?? ""}`,
                  filter: `blur(${entryBlur}px) ${exit.filter ?? ""}`,
                }}
              >
                {ln.text}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CENA 3 — A Solução: Agente Arquiteto (from=360, dur=220)
// BG: escuro + glow vermelho | Camera: Orbit simulado
// ─────────────────────────────────────────────────────────────────────────────
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  // Orbit: rotateY de -30° → 30° ao longo da cena
  const orbitY = ci(frame, [0, 200], [-30, 30], Easing.inOut(Easing.cubic));

  const EXIT_F = 208;

  // Glow pulsante
  const glowOp = 0.18 + Math.sin(frame * 0.06) * 0.08;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.DARK }} />
      {/* Glow vermelho radial */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% 50%, rgba(230,0,0,${glowOp}) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <Noise id="n3" op={0.04} />

      {/* Camera Orbit wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: "1100px",
          perspectiveOrigin: "50% 45%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotateY(${orbitY}deg)`,
            transformOrigin: "50% 45%",
          }}
        >
          {/* Elemento hero geométrico: prisma glassmorphism */}
          {frame >= 10 && (
            <div
              style={{
                position: "absolute",
                top: 480,
                left: "50%",
                transform: `translateX(-50%) scale(${ci(frame, [10, 35], [0.4, 1], Easing.out(Easing.cubic))})`,
                width: 220,
                height: 220,
                borderRadius: 28,
                background: "rgba(230,0,0,0.08)",
                border: "1.5px solid rgba(230,0,0,0.35)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 80px rgba(230,0,0,0.22), inset 0 0 40px rgba(230,0,0,0.08)",
                opacity: ci(frame, [10, 25], [0, 1]),
              }}
            >
              {/* Ícone: brain/circuit SVG minimalista */}
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <circle cx="45" cy="45" r="30" stroke={C.RED} strokeWidth="1.5" opacity="0.7" />
                <circle cx="45" cy="45" r="18" stroke={C.RED} strokeWidth="1" opacity="0.5" />
                <line x1="45" y1="15" x2="45" y2="75" stroke={C.RED} strokeWidth="1" opacity="0.4" />
                <line x1="15" y1="45" x2="75" y2="45" stroke={C.RED} strokeWidth="1" opacity="0.4" />
                <circle cx="45" cy="45" r="5" fill={C.RED} opacity="0.9" />
              </svg>
            </div>
          )}

          {/* Texto: "POR ISSO CRIAMOS O" */}
          {frame >= 30 && (
            <div
              style={{
                position: "absolute",
                top: 340,
                left: 0, right: 0,
                textAlign: "center",
                fontFamily: INTER,
                fontSize: 38,
                fontWeight: 300,
                color: C.GREY,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                opacity: ci(frame, [30, 50], [0, 1]),
                transform: `translateY(${ci(frame, [30, 50], [30, 0], Easing.out(Easing.cubic))}px)`,
                ...quadExit(frame, EXIT_F, "up"),
              }}
            >
              POR ISSO CRIAMOS O
            </div>
          )}

          {/* "AGENTE" */}
          {frame >= 55 && (
            <div
              style={{
                position: "absolute",
                top: 720,
                left: 0, right: 0,
                textAlign: "center",
                fontFamily: BEBAS,
                fontSize: 200,
                color: C.WHITE,
                lineHeight: 1,
                letterSpacing: "-4px",
                opacity: ci(frame, [55, 75], [0, 1]),
                transform: `translateY(${ci(frame, [55, 75], [60, 0], Easing.out(Easing.cubic))}px)`,
                filter: `blur(${ci(frame, [55, 68], [20, 0], Easing.out(Easing.quad))}px)`,
                ...quadExit(frame, EXIT_F, "up"),
              }}
            >
              AGENTE
            </div>
          )}

          {/* "ARQUITETO" em vermelho com glow */}
          {frame >= 80 && (
            <div
              style={{
                position: "absolute",
                top: 900,
                left: 0, right: 0,
                textAlign: "center",
                fontFamily: BEBAS,
                fontSize: 180,
                color: C.RED,
                lineHeight: 1,
                letterSpacing: "-4px",
                textShadow: `0 0 60px ${C.GLOW}, 0 0 120px rgba(230,0,0,0.25)`,
                opacity: ci(frame, [80, 100], [0, 1]),
                transform: `translateY(${ci(frame, [80, 100], [60, 0], Easing.out(Easing.cubic))}px)`,
                filter: `blur(${ci(frame, [80, 95], [20, 0], Easing.out(Easing.quad))}px)`,
                ...quadExit(frame, EXIT_F, "right"),
              }}
            >
              ARQUITETO
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CENA 4 — A Mágica dos 8 Minutos (from=570, dur=285)
// Waveform → Checklist → "8 MINUTOS" | Camera: Slow Dolly In
// ─────────────────────────────────────────────────────────────────────────────
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const EXIT_F = 272;

  // Slow Dolly In
  const dolly = ci(frame, [0, 260], [1, 1.06], Easing.linear);

  // Fase 1: Waveform (f 0-130)
  // Fase 2: Morph barras → checklist (f 130-165)
  // Fase 3: "8 MINUTOS" domina (f 165+)

  const waveOpOut    = ci(frame, [125, 152], [1, 0], Easing.in(Easing.cubic));
  const checkOpIn    = ci(frame, [148, 185], [0, 1], Easing.out(Easing.cubic));
  const checkOpOut   = ci(frame, [210, 232], [1, 0], Easing.in(Easing.cubic));
  const checkVisible = checkOpIn * checkOpOut;
  const minutesOpIn  = ci(frame, [232, 258], [0, 1], Easing.out(Easing.cubic));
  const minutesScale = ci(frame, [232, 258], [0.6, 1], Easing.out(Easing.exp));

  // 11 barras — onda lenta, centro maior, bordas menores (conceitual)
  const BAR_COUNT = 11;
  const barHeights = Array.from({ length: BAR_COUNT }, (_, i) => {
    const center = (BAR_COUNT - 1) / 2;
    const distNorm = Math.abs(i - center) / center; // 0=centro, 1=borda
    const baseH = (1 - distNorm * 0.45) * 62;      // centro ~62px, bordas ~34px
    const wave1 = Math.sin(frame * 0.052 + i * 0.74) * 40; // onda primária lenta
    const wave2 = Math.sin(frame * 0.026 + i * 0.38) * 16; // onda secundária mais lenta
    return Math.max(baseH + wave1 + wave2, 5);
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.DARK }} />
      <Noise id="n4" op={0.035} />

      {/* Camera Dolly */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${dolly})`,
          transformOrigin: "50% 50%",
        }}
      >
        {/* Ícone microfone + texto acima waveform */}
        {waveOpOut > 0.02 && (
          <>
            {/* Microfone SVG */}
            <div
              style={{
                position: "absolute",
                top: 390,
                left: 0, right: 0,
                display: "flex",
                justifyContent: "center",
                opacity: ci(frame, [8, 24], [0, 1]) * waveOpOut,
              }}
            >
              <svg width="52" height="82" viewBox="0 0 52 82" fill="none" opacity="0.9">
                {/* Cápsula — traço fino elegante */}
                <rect x="16" y="2" width="20" height="36" rx="10" stroke={C.RED} strokeWidth="1.2" fill="rgba(230,0,0,0.06)" />
                {/* Detalhe interno minimalista */}
                <line x1="20" y1="12" x2="32" y2="12" stroke={C.RED} strokeWidth="0.8" opacity="0.35" />
                <line x1="20" y1="19" x2="32" y2="19" stroke={C.RED} strokeWidth="0.8" opacity="0.35" />
                <line x1="20" y1="26" x2="32" y2="26" stroke={C.RED} strokeWidth="0.8" opacity="0.35" />
                {/* Arco base */}
                <path d="M10 32 Q10 54 26 54 Q42 54 42 32" stroke={C.RED} strokeWidth="1.2" fill="none" strokeLinecap="round" />
                {/* Haste */}
                <line x1="26" y1="54" x2="26" y2="68" stroke={C.RED} strokeWidth="1.2" />
                {/* Base */}
                <line x1="16" y1="72" x2="36" y2="72" stroke={C.RED} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Texto "GRAVE UM ÁUDIO DE" */}
            {frame >= 12 && (
              <div
                style={{
                  position: "absolute",
                  top: 508,
                  left: 60, right: 60,
                  textAlign: "center",
                  fontFamily: INTER,
                  fontSize: 34,
                  fontWeight: 300,
                  color: C.GREY,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  opacity: ci(frame, [12, 30], [0, 1]) * waveOpOut,
                }}
              >
                GRAVE UM ÁUDIO DE
              </div>
            )}

            {/* Waveform: 11 barras elegantes */}
            <div
              style={{
                position: "absolute",
                top: 600,
                left: 0, right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                opacity: waveOpOut,
              }}
            >
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: h,
                    background: `linear-gradient(to top, ${C.RED}, rgba(230,0,0,0.5))`,
                    borderRadius: 5,
                    boxShadow: `0 0 6px rgba(230,0,0,0.3)`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Checklist (após morph → sai antes do "8 MIN") */}
        {checkVisible > 0.01 && (
          <div
            style={{
              position: "absolute",
              top: 520,
              left: 120, right: 120,
              opacity: checkVisible,
              transform: `translateY(${ci(frame, [148, 185], [30, 0], Easing.out(Easing.cubic))}px)`,
            }}
          >
            {[
              "Estrutura de módulos",
              "Aulas roteirizadas",
              "Material de apoio",
              "Promessa de transformação",
              "Precificação estratégica",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  marginBottom: 22,
                  opacity: ci(frame, [158 + i * 8, 172 + i * 8], [0, 1]),
                  transform: `translateX(${ci(frame, [158 + i * 8, 172 + i * 8], [-40, 0], Easing.out(Easing.cubic))}px)`,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: C.RED,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L5 9L13 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ fontFamily: INTER, fontSize: 36, fontWeight: 400, color: C.WHITE, lineHeight: 1.2 }}>
                  {item}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* "8 MIN" dominante — aparece só após o checklist sair */}
        {minutesOpIn > 0.01 && (
          <>
            <div
              style={{
                position: "absolute",
                top: 820,
                left: 0, right: 0,
                textAlign: "center",
                fontFamily: BEBAS,
                fontSize: 270,
                color: C.RED,
                lineHeight: 1,
                letterSpacing: "-6px",
                textShadow: `0 0 80px ${C.GLOW}, 0 0 160px rgba(230,0,0,0.2)`,
                opacity: minutesOpIn,
                transform: `scale(${minutesScale})`,
                ...quadExit(frame, EXIT_F, "forward"),
              }}
            >
              8 MIN
            </div>
            <div
              style={{
                position: "absolute",
                top: 1060,
                left: 0, right: 0,
                textAlign: "center",
                fontFamily: INTER,
                fontSize: 42,
                fontWeight: 300,
                color: C.GREY,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: minutesOpIn,
                ...quadExit(frame, EXIT_F, "down"),
              }}
            >
              SUA MENTORIA COMPLETA
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CENA 5 — O Faturamento (from=845, dur=195)
// Parte 1: BG Vermelho | Parte 2: BG Branco + "50 MIL"
// ─────────────────────────────────────────────────────────────────────────────
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  // BG transição: vermelho → branco no frame 100
  const bgSwitch = ci(frame, [92, 108], [0, 1], Easing.inOut(Easing.cubic));
  const bgColor = bgSwitch > 0.5 ? C.LIGHT : C.RED;

  const EXIT_F = 182;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: bgColor }} />
      <Noise id="n5" op={bgSwitch > 0.5 ? 0.018 : 0.04} />

      {/* Parte 1 — Fundo vermelho, texto branco */}
      {bgSwitch < 0.98 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 70px",
            gap: 20,
            opacity: 1 - bgSwitch,
          }}
        >
          {[
            { text: "PRONTA PARA",  size: 130 },
            { text: "VENDER",       size: 160 },
            { text: "NO MESMO DIA", size: 100 },
          ].map((ln, i) => (
            <div
              key={i}
              style={{
                fontFamily: BEBAS,
                fontSize: ln.size,
                color: C.WHITE,
                lineHeight: 1,
                letterSpacing: "-2px",
                opacity: ci(frame, [i * 12, i * 12 + 20], [0, 1]),
                transform: `translateY(${ci(frame, [i * 12, i * 12 + 20], [50, 0], Easing.out(Easing.cubic))}px)`,
                filter: `blur(${ci(frame, [i * 12, i * 12 + 18], [16, 0], Easing.out(Easing.quad))}px)`,
              }}
            >
              {ln.text}
            </div>
          ))}

          <div
            style={{
              fontFamily: INTER,
              fontSize: 34,
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginTop: 10,
              opacity: ci(frame, [40, 58], [0, 1]),
            }}
          >
            ESSE É O PRIMEIRO PASSO PARA
          </div>
        </AbsoluteFill>
      )}

      {/* Parte 2 — Fundo branco, "50 MIL" preto */}
      {bgSwitch > 0.02 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 200,
            opacity: bgSwitch,
          }}
        >
          {/* Zoom rápido no "50 MIL" */}
          <div
            style={{
              fontFamily: BEBAS,
              fontSize: 310,
              color: "#050505",
              lineHeight: 0.88,
              letterSpacing: "-10px",
              transform: `translateY(${ci(frame, [100, 122], [50, 0], Easing.out(Easing.cubic))}px)`,
              opacity: ci(frame, [100, 118], [0, 1]),
              filter: `blur(${ci(frame, [100, 115], [16, 0], Easing.out(Easing.quad))}px)`,
              ...quadExit(frame, EXIT_F, "down"),
            }}
          >
            50 MIL
          </div>

          <div
            style={{
              fontFamily: BEBAS,
              fontSize: 90,
              color: C.RED,
              letterSpacing: "0.06em",
              marginTop: -10,
              opacity: ci(frame, [112, 130], [0, 1]),
              transform: `translateY(${ci(frame, [112, 130], [30, 0], Easing.out(Easing.cubic))}px)`,
              ...quadExit(frame, EXIT_F, "down"),
            }}
          >
            POR MÊS
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CENA 6 — O Bônus Escasso (from=1030, dur=200)
// "Quem comprar hoje garante um encontro individual" | Cards 3D
// ─────────────────────────────────────────────────────────────────────────────
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();

  // Crane Down: conteúdo desce suavemente (câmera desce)
  const craneY = ci(frame, [0, 185], [0, 90], Easing.out(Easing.cubic));

  const EXIT_F = 186;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.DARK }} />
      <Noise id="n6" op={0.04} />

      {/* Glow sutil */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 65%, rgba(230,0,0,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${craneY}px)`,
        }}
      >
        {/* Subtítulo */}
        {frame >= 15 && (
          <div
            style={{
              position: "absolute",
              top: 280,
              left: 0, right: 0,
              textAlign: "center",
              fontFamily: INTER,
              fontSize: 34,
              fontWeight: 300,
              color: C.GREY,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: ci(frame, [15, 35], [0, 1]),
              ...quadExit(frame, EXIT_F, "up"),
            }}
          >
            QUEM COMPRAR HOJE GARANTE
          </div>
        )}

        {/* Cards 3D */}
        {[
          { label: "ENCONTRO",    rotY: 14,  rotZ: -4.5, tx: -118, delay: 30 },
          { label: "INDIVIDUAL",  rotY: -14, rotZ:  4.5, tx:  118, delay: 50 },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 440,
              left: "50%",
              width: 320,
              height: 440,
              marginLeft: -160,
              borderRadius: 24,
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
              transform: `
                translateX(${card.tx}px)
                rotateY(${card.rotY}deg)
                rotateZ(${card.rotZ}deg)
                scale(${ci(frame, [card.delay, card.delay + 24], [0.5, 1], Easing.out(Easing.cubic))})
              `,
              opacity: ci(frame, [card.delay, card.delay + 18], [0, 1]),
              perspective: "800px",
              ...(i === 0 && quadExit(frame, EXIT_F, "left")),
              ...(i === 1 && quadExit(frame, EXIT_F, "right")),
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(230,0,0,0.15)",
                border: "1px solid rgba(230,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="10" r="5" stroke={C.RED} strokeWidth="1.5" />
                <path d="M4 24c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke={C.RED} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: BEBAS,
                fontSize: 52,
                color: C.WHITE,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              {card.label}
            </div>
          </div>
        ))}

        {/* Descrição do encontro individual */}
        {frame >= 72 && (
          <div
            style={{
              position: "absolute",
              top: 900,
              left: 60, right: 60,
              textAlign: "center",
              opacity: ci(frame, [72, 92], [0, 1]),
              transform: `translateY(${ci(frame, [72, 92], [40, 0], Easing.out(Easing.cubic))}px)`,
              ...quadExit(frame, EXIT_F, "up"),
            }}
          >
            <div
              style={{
                fontFamily: BEBAS,
                fontSize: 60,
                color: C.RED,
                lineHeight: 1,
                letterSpacing: "0.02em",
                textShadow: `0 0 40px ${C.GLOW}`,
              }}
            >
              COM UM DE NOSSOS ESPECIALISTAS
            </div>
            <div
              style={{
                fontFamily: INTER,
                fontSize: 30,
                fontWeight: 300,
                color: C.GREY,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginTop: 14,
                lineHeight: 1.5,
              }}
            >
              para criar um plano de ação
              <br />
              personalizado para você
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CENA 7 — CTA Direcional (from=1220, dur=130)
// "Toque no botão Saiba Mais" | Chevrons | Estático final
// ─────────────────────────────────────────────────────────────────────────────
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* Gradiente: vermelho (topo) → preto (centro) */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, ${C.RED} 0%, #1a0000 28%, ${C.DARK} 58%)`,
        }}
      />
      <Noise id="n7" op={0.04} />

      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        {/* "TOQUE NO BOTÃO" */}
        {frame >= 14 && (
          <div
            style={{
              position: "absolute",
              top: 260,
              left: 0, right: 0,
              textAlign: "center",
              fontFamily: INTER,
              fontSize: 38,
              fontWeight: 300,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: ci(frame, [14, 32], [0, 1]),
              transform: `translateY(${ci(frame, [14, 32], [24, 0], Easing.out(Easing.cubic))}px)`,
            }}
          >
            TOQUE NO BOTÃO
          </div>
        )}

        {/* "SAIBA MAIS" */}
        {frame >= 28 && (
          <div
            style={{
              position: "absolute",
              top: 350,
              left: 0, right: 0,
              textAlign: "center",
              fontFamily: BEBAS,
              fontSize: 195,
              color: C.WHITE,
              lineHeight: 1,
              letterSpacing: "-4px",
              textShadow: `0 0 60px ${C.GLOW}, 0 0 120px rgba(230,0,0,0.2)`,
              opacity: ci(frame, [28, 48], [0, 1]),
              transform: `translateY(${ci(frame, [28, 48], [50, 0], Easing.out(Easing.cubic))}px)`,
              filter: `blur(${ci(frame, [28, 44], [16, 0], Easing.out(Easing.quad))}px)`,
            }}
          >
            SAIBA MAIS
          </div>
        )}

        {/* Chevrons pulsantes (max Y=1150, dentro da safe zone) */}
        {frame >= 52 && (
          <div
            style={{
              position: "absolute",
              top: 970,
              left: 0, right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            {[0, 1, 2].map((i) => {
              // Pulsação suave em onda cascata (sem saltos)
              const phase = (frame / 22) + i * 2.094; // 2π/3 de offset entre chevrons
              const op = 0.18 + 0.82 * (Math.sin(phase) * 0.5 + 0.5);
              return (
                <svg
                  key={i}
                  width="58"
                  height="34"
                  viewBox="0 0 58 34"
                  fill="none"
                  style={{ opacity: op, transition: "opacity 0.1s" }}
                >
                  <path
                    d="M3 3L29 30L55 3"
                    stroke={C.WHITE}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              );
            })}
          </div>
        )}

        {/* Linha inferior: chamada de suporte */}
        {frame >= 70 && (
          <div
            style={{
              position: "absolute",
              top: 1110,
              left: 0, right: 0,
              textAlign: "center",
              fontFamily: INTER,
              fontSize: 28,
              fontWeight: 300,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: ci(frame, [70, 88], [0, 1]),
            }}
          >
            Vagas limitadas
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSIÇÃO PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export const AgenteArquitetoV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.DARK, fontFamily: INTER }}>
      <FontLoader />

      {/* C1: Hook (0-190) */}
      <Sequence from={0} durationInFrames={190}>
        <Scene1 />
      </Sequence>

      {/* C2: Caos (180-370) — overlap 10f */}
      <Sequence from={180} durationInFrames={190}>
        <Scene2 />
      </Sequence>

      {/* C3: Solução (360-580) — overlap 10f */}
      <Sequence from={360} durationInFrames={220}>
        <Scene3 />
      </Sequence>

      {/* C4: Magia 8 min (570-855) — overlap 10f */}
      <Sequence from={570} durationInFrames={285}>
        <Scene4 />
      </Sequence>

      {/* C5: Faturamento (845-1040) — overlap 10f */}
      <Sequence from={845} durationInFrames={195}>
        <Scene5 />
      </Sequence>

      {/* C6: Bônus (1030-1230) — overlap 10f */}
      <Sequence from={1030} durationInFrames={200}>
        <Scene6 />
      </Sequence>

      {/* C7: CTA (1220-1350) — overlap 10f */}
      <Sequence from={1220} durationInFrames={130}>
        <Scene7 />
      </Sequence>
    </AbsoluteFill>
  );
};
