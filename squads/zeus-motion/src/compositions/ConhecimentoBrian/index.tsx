/**
 * CONHECIMENTO BRIAN v5 — Navy Arquiteto · Motion Extremo · SYNC REAL
 * Narrador: Brian (ElevenLabs) — conhecimento-brian.mp3 (26.44s)
 * Total: 843f @ 30fps
 *
 * SCENE MAP v5 (whisper REAL — sem estimativas):
 * C00   0– 30  (30f) "A GENTE MONTA"         gente@7, monta@12
 * C01  30–100  (70f) "ESTRUTURA completa"    estrutura@local0, completa@local12
 * C02 100–203 (103f) "MENTORIA página de vendas"  mentoria@local0, página@local33, vendas@local73
 * C03 203–376 (173f) Lista deliverables      anúncios@local0, funil@local46, automações@local74, tudo@local120
 * C04 376–503 (127f) "SEM"                   sem@local0, necessário@local21
 * C05 503–643 (140f) "100 MIL"               100@local77, mil@local86 [MINIMAL + ícone]
 * C06 643–695  (52f) "VENDEDOR PRONTO"       vendedor@local0, pronto@local15
 * C07 695–750  (55f) "REUNIÕES no seu lugar" reuniões@local0, lugar@local22
 * C08 750–843  (93f) CTA                     Toque@local0, botão@local13, abaixo@local22
 *
 * Whisper REAL word timestamps:
 *   7f:gente  12f:monta  26f:a  30f:estrutura  42f:completa
 *  58f:para  69f:você  76f:começar  89f:a  93f:vender  100f:mentoria
 * 130f:com  133f:página  165f:de  173f:vendas  203f:anúncios  215f:rodando
 * 249f:funil  277f:automações  305f:e  323f:tudo  331f:que  338f:você  346f:precisa
 * 376f:sem  385f:que  389f:seja  397f:necessário  416f:você  423f:fazer
 * 434f:manualmente  456f:qualquer  467f:coisa  503f:Te  508f:acompanhamos
 * 527f:até  535f:você  542f:atingir  559f:os  563f:seus  566f:primeiros
 * 580f:100  589f:mil  607f:e  617f:te  620f:entregamos  637f:um
 * 643f:vendedor  658f:pronto  671f:para  682f:fazer  689f:as
 * 695f:reuniões  708f:no  713f:seu  717f:lugar  750f:Toque
 * 761f:no  763f:botão  772f:abaixo
 */

import {
  AbsoluteFill, Audio, Easing, interpolate,
  Sequence, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import React from "react";
import { loadFont as loadBagelFatOne   } from "@remotion/google-fonts/BagelFatOne";
import { loadFont as loadDMSans        } from "@remotion/google-fonts/DMSans";
import { loadFont as loadUltra         } from "@remotion/google-fonts/Ultra";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

loadBagelFatOne(); loadDMSans(); loadUltra(); loadJetBrainsMono();

// ─── Fontes ───────────────────────────────────────────────────────────────────
const GROOVY  = "'Bagel Fat One', 'Bowlby One SC', sans-serif";
const BODY    = "'DM Sans', system-ui, sans-serif";
const DISPLAY = "'Ultra', 'Alfa Slab One', serif";
const MONO    = "'JetBrains Mono', ui-monospace, monospace";

// ─── Paleta Navy Arquiteto ────────────────────────────────────────────────────
const G = {
  paper:     "#F2E8DC",
  paperDeep: "#E6DFDA",
  paperEdge: "#C4BAB4",
  magenta:   "#D97B59",
  hotPink:   "#D97B59",
  orange:    "#733C1D",
  teal:      "#D97B59",
  purple:    "#193940",
  plum:      "#101F22",
} as const;

// ─── Safe zones ───────────────────────────────────────────────────────────────
const PAD_X   = 72;
const PAD_TOP = 160;

// ─── Scene map v4 (whisper real) ──────────────────────────────────────────────
export const TOTAL_FRAMES = 843;
const S = [
  { s:   0, d:  30 }, // C00 gente@7, monta@12
  { s:  30, d:  70 }, // C01 estrutura@0, completa@12
  { s: 100, d: 103 }, // C02 mentoria@0, página@33, vendas@73
  { s: 203, d: 173 }, // C03 anúncios@0, funil@46, automações@74, tudo@120
  { s: 376, d: 127 }, // C04 sem@0, necessário@21
  { s: 503, d: 140 }, // C05 100@77, mil@86
  { s: 643, d:  52 }, // C06 vendedor@0, pronto@15
  { s: 695, d:  55 }, // C07 reuniões@0, lugar@22
  { s: 750, d:  93 }, // C08 Toque@0, botão@13, abaixo@22
  // 30+70+103+173+127+140+52+55+93 = 843 ✓
];

// ─── Primitiva ci ─────────────────────────────────────────────────────────────
const ci = (
  frame: number,
  inp: [number, number],
  out: [number, number],
  ease?: (t: number) => number
) => interpolate(frame, inp, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// ─── Componente: LetraALetra (After Effects feel) ────────────────────────────
interface LetraALetraProps {
  text: string;
  frame: number;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  letterStyle?: React.CSSProperties;
  blurAmount?: number;
  dist?: number;
  dur?: number;
  dir?: "top" | "bottom" | "left" | "right";
}
const LetraALetra: React.FC<LetraALetraProps> = ({
  text, frame, delay = 0, stagger = 2.5,
  style, letterStyle,
  blurAmount = 55, dist = 28, dur = 20, dir = "bottom",
}) => {
  const chars = text.split("");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", ...style }}>
      {chars.map((ch, i) => {
        const f   = Math.max(0, frame - delay - i * stagger);
        const op  = ci(f, [0, dur * 0.6], [0, 1]);
        const blr = ci(f, [0, dur * 0.7], [blurAmount, 0], Easing.out(Easing.cubic));
        const sc  = ci(f, [0, dur], [0.60, 1.0], Easing.out(Easing.back(2.2)));
        const yv  = dir === "bottom" ?  dist : dir === "top" ? -dist : 0;
        const xv  = dir === "right"  ?  dist : dir === "left" ? -dist : 0;
        const y   = ci(f, [0, dur], [yv, 0], Easing.out(Easing.back(1.9)));
        const x   = ci(f, [0, dur], [xv, 0], Easing.out(Easing.back(1.9)));
        return (
          <span key={i} style={{
            display:    "inline-block",
            opacity:    op,
            transform:  `translate(${x}px, ${y}px) scale(${sc})`,
            filter:     `blur(${blr}px)`,
            whiteSpace: ch === " " ? "pre" : "normal",
            ...letterStyle,
          }}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
};

// ─── Componente: PalavraBlur (word-by-word com blur pesado) ──────────────────
interface PalavraBlurProps {
  text: string;
  frame: number;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
  blurAmount?: number;
  dist?: number;
  dur?: number;
  dir?: "top" | "bottom" | "left" | "right";
}
const PalavraBlur: React.FC<PalavraBlurProps> = ({
  text, frame, delay = 0, stagger = 6,
  style, wordStyle,
  blurAmount = 40, dist = 40, dur = 22, dir = "bottom",
}) => {
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.14em", ...style }}>
      {words.map((word, i) => {
        const f   = Math.max(0, frame - delay - i * stagger);
        const op  = ci(f, [0, dur * 0.65], [0, 1]);
        const blr = ci(f, [0, dur * 0.75], [blurAmount, 0], Easing.out(Easing.cubic));
        const sc  = ci(f, [0, dur], [0.65, 1.0], Easing.out(Easing.back(1.8)));
        const yv  = dir === "bottom" ?  dist : dir === "top" ? -dist : 0;
        const xv  = dir === "right"  ?  dist : dir === "left" ? -dist : 0;
        const y   = ci(f, [0, dur], [yv, 0], Easing.out(Easing.back(1.7)));
        const x   = ci(f, [0, dur], [xv, 0], Easing.out(Easing.back(1.7)));
        return (
          <span key={i} style={{
            display:   "inline-block",
            opacity:   op,
            transform: `translate(${x}px, ${y}px) scale(${sc})`,
            filter:    `blur(${blr}px)`,
            ...wordStyle,
          }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ─── Fade blur simples (para elementos únicos) ────────────────────────────────
const fadeBlur = (frame: number, delay: number, dur = 22, blurAmt = 45, dist = 36, dir: "top"|"bottom"|"left"|"right" = "bottom"): React.CSSProperties => {
  const f   = Math.max(0, frame - delay);
  const op  = ci(f, [0, dur * 0.6], [0, 1]);
  const blr = ci(f, [0, dur * 0.7], [blurAmt, 0], Easing.out(Easing.cubic));
  const sc  = ci(f, [0, dur], [0.72, 1.0], Easing.out(Easing.back(1.7)));
  const yv  = dir === "bottom" ? dist : dir === "top" ? -dist : 0;
  const xv  = dir === "right" ? dist : dir === "left" ? -dist : 0;
  const y   = ci(f, [0, dur], [yv, 0], Easing.out(Easing.back(1.6)));
  const x   = ci(f, [0, dur], [xv, 0], Easing.out(Easing.back(1.6)));
  return { opacity: op, transform: `translate(${x}px, ${y}px) scale(${sc})`, filter: `blur(${blr}px)` };
};

// ─── Saída de cena (cinematic exit) ──────────────────────────────────────────
const sceneExit = (frame: number, duration: number, dir: "top"|"bottom"|"left"|"right" = "left"): React.CSSProperties => {
  const start = duration - 18;
  const f     = frame - start;
  if (f <= 0) return {};
  const axisX = dir === "left" || dir === "right";
  const sign  = dir === "right" || dir === "bottom" ? 1 : -1;
  const dist  = axisX ? 1100 : 1920;
  const pos   = ci(f, [0, 18], [0, dist * sign], Easing.in(Easing.exp));
  const op    = ci(f, [4, 18], [1, 0]);
  const blr   = ci(f, [0, 14], [0, 24], Easing.in(Easing.cubic));
  const sc    = ci(f, [0, 18], [1, 0.92], Easing.in(Easing.quad));
  if (axisX) return { opacity: op, transform: `translateX(${pos}px) scale(${sc})`, filter: `blur(${blr}px)` };
  return { opacity: op, transform: `translateY(${pos}px) scale(${sc})`, filter: `blur(${blr}px)` };
};

// ─── Ken Burns ────────────────────────────────────────────────────────────────
const kb = (frame: number, duration: number) =>
  ci(frame, [0, Math.max(1, duration - 18)], [1.0, 1.032], Easing.inOut(Easing.quad));

// ─── Grain ────────────────────────────────────────────────────────────────────
const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
    <svg width="100%" height="100%" style={{ mixBlendMode: "multiply", opacity: 0.28 }}>
      <filter id="gb2">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.10  0 0 0 0 0.22  0 0 0 0 0.25  0 0 0 0.85 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gb2)" />
    </svg>
  </AbsoluteFill>
);

// ─── Vinheta ──────────────────────────────────────────────────────────────────
const Vignette: React.FC<{ i?: number }> = ({ i = 0.30 }) => (
  <AbsoluteFill style={{
    background: [
      `radial-gradient(ellipse 78% 58% at 50% 50%, transparent 35%, rgba(16,31,34,${i}) 100%)`,
      `radial-gradient(circle at 8% 10%, rgba(16,31,34,${i * 0.85}), transparent 20%)`,
      `radial-gradient(circle at 92% 90%, rgba(16,31,34,${i * 0.75}), transparent 18%)`,
    ].join(", "),
    pointerEvents: "none", zIndex: 996,
  }} />
);

// ─── Borda vintage ────────────────────────────────────────────────────────────
const Border: React.FC<{ color?: string; accent?: string }> = ({
  color = G.purple, accent = G.magenta
}) => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 993, opacity: 0.52 }}>
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="none">
      <rect x="18" y="18" width="1044" height="1884" fill="none" stroke={color} strokeWidth="7" />
      <rect x="27" y="27" width="1044" height="1884" fill="none" stroke={accent} strokeWidth="2" opacity="0.45" />
      {([[18,18],[1062,18],[18,1902],[1062,1902]] as [number,number][]).map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="9"  fill={color} />
          <circle cx={cx} cy={cy} r="16" fill="none" stroke={color} strokeWidth="2" />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

// ─── Aura de luz ─────────────────────────────────────────────────────────────
const Aura: React.FC<{ frame: number; color?: string }> = ({
  frame, color = "rgba(217,123,89,0.20)"
}) => {
  const op = ci(frame, [0, 14], [0, 1]) * ci(frame, [30, 42], [1, 0.28]);
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse 55% 38% at 14% 11%, ${color} 0%, transparent 68%)`,
      opacity: op, pointerEvents: "none", zIndex: 997,
    }} />
  );
};

// ─── Background ───────────────────────────────────────────────────────────────
const Bg: React.FC<{ color: string }> = ({ color }) => (
  <AbsoluteFill style={{
    background: color,
    backgroundImage: [
      "radial-gradient(ellipse at 22% 0%, rgba(217,123,89,0.09), transparent 50%)",
      "radial-gradient(ellipse at 78% 100%, rgba(115,60,29,0.07), transparent 50%)",
    ].join(", "),
  }} />
);

// ─── Linha separadora com estrela ─────────────────────────────────────────────
const Linha: React.FC<{ color?: string; frame?: number; delay?: number }> = ({
  color = G.magenta, frame = 0, delay = 0
}) => {
  const f   = Math.max(0, frame - delay);
  const sc  = ci(f, [0, 18], [0, 1], Easing.out(Easing.cubic));
  const op  = ci(f, [0, 12], [0, 1]);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      opacity: op, transform: `scaleX(${sc})`, transformOrigin: "50% 50%",
    }}>
      <div style={{ flex: 1, height: 2, background: color, opacity: 0.72 }} />
      <svg width="15" height="15" viewBox="0 0 14 14">
        <path d="M7,0 L8.5,5.5 L14,7 L8.5,8.5 L7,14 L5.5,8.5 L0,7 L5.5,5.5 Z" fill={color} opacity="0.85" />
      </svg>
      <div style={{ flex: 1, height: 2, background: color, opacity: 0.72 }} />
    </div>
  );
};

// ─── SVGs ────────────────────────────────────────────────────────────────────
const IcoCheck = ({ color = G.magenta, size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);
const IcoArrow = ({ color = G.magenta, size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>
  </svg>
);
const IcoPerson = ({ color = G.paper, size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoGears = ({ color = G.paper, size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
    <path d="M12 2v2"/><path d="M12 22v-2"/>
    <path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/>
    <path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/>
    <path d="M14 12h8"/><path d="M2 12h2"/>
    <path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/>
    <path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/>
  </svg>
);

// ─── IcoContrato: documento com selo (C05 MINIMAL) ───────────────────────────
const IcoContrato = ({ color = G.magenta, size = 110 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Documento */}
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
          stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="13 2 13 9 20 9"
              stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Linhas de texto */}
    <line x1="7" y1="13" x2="15" y2="13" stroke={color} strokeWidth="1.0" strokeLinecap="round" opacity="0.60"/>
    <line x1="7" y1="16" x2="15" y2="16" stroke={color} strokeWidth="1.0" strokeLinecap="round" opacity="0.60"/>
    <line x1="7" y1="10" x2="11" y2="10" stroke={color} strokeWidth="1.0" strokeLinecap="round" opacity="0.60"/>
    {/* Selo (círculo duplo, canto inferior direito) */}
    <circle cx="17" cy="18" r="4.5" stroke={color} strokeWidth="1.3" fill="none"/>
    <circle cx="17" cy="18" r="3.0" stroke={color} strokeWidth="0.7" fill="none" opacity="0.55"/>
    {/* Estrela de 5 pontas no selo */}
    <polygon
      points="17,14.8 17.7,17.0 20.1,17.0 18.2,18.4 18.9,20.6 17,19.2 15.1,20.6 15.8,18.4 13.9,17.0 16.3,17.0"
      fill={color} opacity="0.90"/>
  </svg>
);

// ─── Wrapper de cena ──────────────────────────────────────────────────────────
interface SceneWrapProps {
  frame: number; duration: number;
  bg: string;
  entryDir?: "top"|"bottom"|"left"|"right";
  exitDir?:  "top"|"bottom"|"left"|"right";
  borderColor?: string; accentColor?: string;
  aura?: string; vignetteI?: number;
  children: React.ReactNode;
}
const SceneWrap: React.FC<SceneWrapProps> = ({
  frame, duration, bg,
  entryDir = "bottom", exitDir = "top",
  borderColor = G.purple, accentColor = G.magenta,
  aura = "rgba(217,123,89,0.20)", vignetteI = 0.30,
  children,
}) => {
  const ef  = frame;
  const eop = ci(ef, [0, 18], [0, 1]);
  const ebl = ci(ef, [0, 14], [20, 0], Easing.out(Easing.quad));
  const esc = ci(ef, [0, 18], [0.94, 1.0], Easing.out(Easing.cubic));
  const edv = entryDir === "bottom" ? 30 : entryDir === "top" ? -30 : 0;
  const edhv = entryDir === "right" ? 30 : entryDir === "left" ? -30 : 0;
  const ey  = ci(ef, [0, 18], [edv, 0], Easing.out(Easing.cubic));
  const ex  = ci(ef, [0, 18], [edhv, 0], Easing.out(Easing.cubic));
  const entryStyle: React.CSSProperties = {
    opacity: eop, filter: `blur(${ebl}px)`,
    transform: `translate(${ex}px,${ey}px) scale(${esc})`,
  };
  const exitStyle = sceneExit(frame, duration, exitDir);
  const mergedOp = (typeof entryStyle.opacity === "number" ? entryStyle.opacity : 1)
                 * (typeof exitStyle.opacity  === "number" ? exitStyle.opacity  : 1);
  const mergedTr = [entryStyle.transform, exitStyle.transform].filter(Boolean).join(" ");
  const mergedBl = [entryStyle.filter, exitStyle.filter].filter(Boolean).join(" ");
  const mergedStyle: React.CSSProperties = {
    opacity: mergedOp, transform: mergedTr || undefined, filter: mergedBl || undefined,
  };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${kb(frame, duration)})`, transformOrigin: "50% 50%" }}>
        <Bg color={bg} />
      </AbsoluteFill>
      <AbsoluteFill style={mergedStyle}>{children}</AbsoluteFill>
      <Border color={borderColor} accent={accentColor} />
      <Aura frame={frame} color={aura} />
      <Vignette i={vignetteI} />
      <Grain />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CENA 00 — "A gente MONTA" · 0–34f
// Flash cinético: "A GENTE" imediato, "MONTA" peak@local17
// ═══════════════════════════════════════════════════════════════════════════════
const C00: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <SceneWrap frame={frame} duration={duration} bg={G.purple} entryDir="bottom" exitDir="top"
    accentColor={G.magenta} vignetteI={0.50}>
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      paddingTop: PAD_TOP, paddingBottom: 640,
      paddingLeft: PAD_X, paddingRight: PAD_X,
    }}>
      <LetraALetra
        text="A GENTE"
        frame={frame} delay={0} stagger={0.9}
        blurAmount={65} dist={40} dur={11} dir="top"
        style={{ marginBottom: 2 }}
        letterStyle={{
          fontFamily: DISPLAY, fontSize: 96,
          color: G.paper,
          letterSpacing: "0.06em", lineHeight: 0.9,
        }}
      />
      <LetraALetra
        text="MONTA"
        frame={frame} delay={2} stagger={1.0}
        blurAmount={75} dist={42} dur={12} dir="bottom"
        letterStyle={{
          fontFamily: DISPLAY, fontSize: 134,
          color: G.magenta,
          WebkitTextStroke: `4px ${G.paper}`,
          paintOrder: "stroke fill",
          textShadow: `8px 8px 0 ${G.orange}`,
          letterSpacing: "0.04em", lineHeight: 0.85,
        }}
      />
    </div>
  </SceneWrap>
);

// ═══════════════════════════════════════════════════════════════════════════════
// CENA 01 — "a ESTRUTURA completa" · 34–103f (69f)
// estrutura@local0: delay=0 → emerge ao falar
// completa@local14: PalavraBlur delay=12
// ═══════════════════════════════════════════════════════════════════════════════
const C01: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <SceneWrap frame={frame} duration={duration} bg={G.plum} entryDir="right" exitDir="left"
    accentColor={G.magenta} vignetteI={0.45}>
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      paddingTop: PAD_TOP, paddingBottom: 620,
      paddingLeft: PAD_X, paddingRight: PAD_X,
    }}>
      <div style={{ marginBottom: 8, textAlign: "center", ...fadeBlur(frame, 0, 12, 28, 18, "bottom") }}>
        <span style={{
          fontFamily: BODY, fontSize: 32,
          color: G.paper, fontWeight: 300,
          letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.45,
        }}>
          a
        </span>
      </div>

      <LetraALetra
        text="ESTRUTURA"
        frame={frame} delay={0} stagger={1.8}
        blurAmount={68} dist={44} dur={22} dir="bottom"
        letterStyle={{
          fontFamily: DISPLAY, fontSize: 110,
          color: G.magenta,
          WebkitTextStroke: `4px ${G.paper}`,
          paintOrder: "stroke fill",
          textShadow: `7px 7px 0 ${G.orange}`,
          letterSpacing: "0.03em", lineHeight: 0.88,
        }}
      />

      <div style={{ width: "100%", marginTop: 20, marginBottom: 20 }}>
        <Linha color={G.magenta} frame={frame} delay={20} />
      </div>

      <PalavraBlur
        text="completa"
        frame={frame} delay={12} stagger={5}
        blurAmount={52} dist={32} dur={20} dir="bottom"
        wordStyle={{
          fontFamily: GROOVY, fontSize: 74,
          color: G.paper, letterSpacing: "0.03em", lineHeight: 1.0,
        }}
      />

      <div style={{ marginTop: 30, ...fadeBlur(frame, 36, 16, 28, 16, "bottom") }}>
        <IcoGears color={G.paper} size={52} />
      </div>
    </div>
  </SceneWrap>
);

// ═══════════════════════════════════════════════════════════════════════════════
// CENA 02 — "MENTORIA com página de vendas" · 100–203f (103f)
// mentoria@local0: desblur imediato
// página@local33: entrada SUAVE (sem back(), só Y + scale com expo) — zero tremor
// vendas@local73: stagger continua, palavra "vendas" no local73
// ═══════════════════════════════════════════════════════════════════════════════
const C02: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const mOp = ci(frame, [0, 18], [0, 1]);
  const mSc = ci(frame, [0, 20], [0.60, 1.0], Easing.out(Easing.back(2.0)));
  const mBl = ci(frame, [0, 18], [75, 0], Easing.out(Easing.cubic));

  // "página de vendas" — entrada SUAVE no local33, sem back() para zero tremor
  const pf  = Math.max(0, frame - 33);
  const pOp = ci(pf, [0, 18], [0, 1]);
  const pBl = ci(pf, [0, 16], [44, 0], Easing.out(Easing.cubic));
  const pY  = ci(pf, [0, 22], [30, 0], Easing.out(Easing.exp));
  const pSc = ci(pf, [0, 22], [0.86, 1.0], Easing.out(Easing.exp));

  return (
    <SceneWrap frame={frame} duration={duration} bg={G.purple} entryDir="top" exitDir="bottom"
      accentColor={G.magenta} vignetteI={0.48}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: PAD_TOP, paddingBottom: 640,
        paddingLeft: PAD_X, paddingRight: PAD_X,
      }}>

        {/* "para vender" — contexto, de cima */}
        <PalavraBlur
          text="para vender"
          frame={frame} delay={0} stagger={5}
          blurAmount={40} dist={30} dur={18} dir="top"
          style={{ marginBottom: 14 }}
          wordStyle={{
            fontFamily: BODY, fontSize: 38,
            color: G.paper, fontWeight: 300,
            letterSpacing: "0.14em", opacity: 0.65,
            textTransform: "uppercase",
          }}
        />

        {/* linha superior */}
        <div style={{ width: "100%", marginBottom: 18 }}>
          <Linha color={G.magenta} frame={frame} delay={2} />
        </div>

        {/* "MENTORIA" — cinematic desblur @local0 */}
        <div style={{
          opacity: mOp,
          transform: `scale(${mSc})`,
          filter: `blur(${mBl}px)`,
          transformOrigin: "50% 50%",
          textAlign: "center",
        }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 148,
            color: G.magenta,
            WebkitTextStroke: `5px ${G.paper}`,
            paintOrder: "stroke fill",
            textShadow: `10px 10px 0 ${G.orange}`,
            letterSpacing: "0.01em", lineHeight: 0.86,
            display: "block",
          }}>
            MENTORIA
          </span>
        </div>

        {/* linha inferior */}
        <div style={{ width: "100%", marginTop: 18, marginBottom: 18 }}>
          <Linha color={G.magenta} frame={frame} delay={20} />
        </div>

        {/* "com página de vendas" — SUAVE, sem back() — entra no local33 */}
        <div style={{
          opacity: pOp,
          filter: `blur(${pBl}px)`,
          transform: `translateY(${pY}px) scale(${pSc})`,
          textAlign: "center",
        }}>
          <span style={{
            fontFamily: GROOVY, fontSize: 56,
            color: G.paper, letterSpacing: "0.02em", lineHeight: 1.0,
          }}>
            com página de vendas
          </span>
        </div>
      </div>
    </SceneWrap>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CENA 03 — Lista de deliverables CENTRADA · 211–380f (169f)
// Checklist centrado como tabela, entrada suave de baixo (sem back() horizontal)
// anúncios@local0  funil@local41  automações@local76  tudo@local115
// ═══════════════════════════════════════════════════════════════════════════════
const C03: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const itens = [
    { texto: "anúncios rodando", delay:   0 },
    { texto: "funil",            delay:  46 },
    { texto: "automações",       delay:  74 },
    { texto: "e tudo mais",      delay: 120 },
  ];

  return (
    <SceneWrap frame={frame} duration={duration} bg={G.plum} entryDir="right" exitDir="left"
      accentColor={G.magenta} vignetteI={0.42}>

      {/* header */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 60,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...fadeBlur(frame, 0, 16, 28, 16, "top"),
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 20, letterSpacing: "0.36em",
          color: G.paper, textTransform: "uppercase", opacity: 0.40,
        }}>
          tudo que você precisa
        </span>
      </div>

      {/* linha */}
      <div style={{ position: "absolute", top: PAD_TOP + 120, left: PAD_X, right: PAD_X }}>
        <Linha color={G.magenta} frame={frame} delay={6} />
      </div>

      {/* checklist CENTRADO — entrada de baixo, sem back() horizontal */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 168,
        left: 0, right: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}>
        {itens.map((item, i) => {
          const f   = Math.max(0, frame - item.delay);
          const op  = ci(f, [0, 18], [0, 1]);
          const blr = ci(f, [0, 14], [52, 0], Easing.out(Easing.cubic));
          // Apenas Y (sem X), sem back() — zero tremor horizontal
          const y   = ci(f, [0, 22], [48, 0], Easing.out(Easing.exp));
          const sc  = ci(f, [0, 22], [0.82, 1.0], Easing.out(Easing.exp));

          const isLast = i === itens.length - 1;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 18,
              opacity: op,
              filter: `blur(${blr}px)`,
              transform: `translateY(${y}px) scale(${sc})`,
            }}>
              <IcoCheck color={G.magenta} size={isLast ? 22 : 26} />
              <span style={{
                fontFamily: GROOVY,
                fontSize:   isLast ? 46 : 60,
                color:      isLast ? `${G.paper}BB` : G.paper,
                letterSpacing: "0.02em", lineHeight: 1.0,
              }}>
                {item.texto}
              </span>
            </div>
          );
        })}
      </div>
    </SceneWrap>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CENA 04 — "SEM esforço manual" · 380–507f (127f)
// sem@local0: "SEM" emerge imediatamente
// necessário@local20: "esforço manual" delay=20
// ═══════════════════════════════════════════════════════════════════════════════
const C04: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <SceneWrap frame={frame} duration={duration} bg={G.paper} entryDir="left" exitDir="right"
    borderColor={G.purple} accentColor={G.purple} aura="rgba(115,60,29,0.14)" vignetteI={0.18}>
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      paddingTop: PAD_TOP, paddingBottom: 600,
      paddingLeft: PAD_X, paddingRight: PAD_X,
    }}>

      <PalavraBlur
        text="sem que seja necessário"
        frame={frame} delay={0} stagger={4}
        blurAmount={36} dist={24} dur={18} dir="top"
        style={{ marginBottom: 10 }}
        wordStyle={{
          fontFamily: BODY, fontSize: 30,
          color: G.plum, fontWeight: 400,
          letterSpacing: "0.08em", opacity: 0.60,
        }}
      />

      {/* "SEM" — delay=0, emerge ao falar (local0) */}
      <LetraALetra
        text="SEM"
        frame={frame} delay={0} stagger={3.5}
        blurAmount={78} dist={52} dur={26} dir="bottom"
        style={{ marginBottom: 8 }}
        letterStyle={{
          fontFamily: DISPLAY, fontSize: 150,
          color: G.orange,
          letterSpacing: "0.08em", lineHeight: 0.88,
        }}
      />

      <div style={{ width: "100%", marginBottom: 18 }}>
        <Linha color={G.orange} frame={frame} delay={14} />
      </div>

      {/* "esforço manual" — delay=20, nécessário@local20 */}
      <LetraALetra
        text="esforço manual"
        frame={frame} delay={20} stagger={2.0}
        blurAmount={55} dist={32} dur={22} dir="bottom"
        style={{ marginBottom: 26 }}
        letterStyle={{
          fontFamily: GROOVY, fontSize: 68,
          color: G.plum, letterSpacing: "0.02em", lineHeight: 1.0,
        }}
      />

      <PalavraBlur
        text="nenhuma tarefa manual necessária"
        frame={frame} delay={44} stagger={4}
        blurAmount={30} dist={20} dur={16} dir="bottom"
        wordStyle={{
          fontFamily: BODY, fontSize: 30,
          color: G.plum, fontWeight: 400,
          letterSpacing: "0.06em", opacity: 0.55,
        }}
      />
    </div>
  </SceneWrap>
);

// ═══════════════════════════════════════════════════════════════════════════════
// CENA 05 — "100 MIL" MINIMAL · 507–648f (141f)
// Foco absoluto: IcoContrato + "100" + "MIL"
// 100@local78: desblur explosion
// mil@local85: LetraALetra delay=82
// ═══════════════════════════════════════════════════════════════════════════════
const C05: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  // "100" — blur=0 exato em local77
  const n100Op = ci(frame, [67, 77], [0, 1]);
  const n100Sc = ci(Math.max(0, frame - 67), [0, 14], [0.55, 1.0], Easing.out(Easing.back(2.4)));
  const n100Bl = ci(frame, [67, 77], [82, 0], Easing.out(Easing.cubic));

  return (
    <SceneWrap frame={frame} duration={duration} bg={G.purple} entryDir="bottom" exitDir="top"
      accentColor={G.magenta} vignetteI={0.50}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: PAD_TOP, paddingBottom: 600,
        paddingLeft: PAD_X, paddingRight: PAD_X,
      }}>

        {/* IcoContrato — aparece cedo, foca no conceito visual */}
        <div style={{ marginBottom: 24, ...fadeBlur(frame, 14, 22, 42, 26, "bottom") }}>
          <IcoContrato color={G.magenta} size={110} />
        </div>

        {/* "100" — desblur explosion @local78 */}
        <div style={{
          opacity: n100Op,
          transform: `scale(${n100Sc})`,
          filter: `blur(${n100Bl}px)`,
          transformOrigin: "50% 50%",
          textAlign: "center",
          lineHeight: 0.78, marginBottom: 4,
        }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 210,
            color: G.magenta,
            WebkitTextStroke: `5px ${G.paper}`,
            paintOrder: "stroke fill",
            textShadow: `12px 12px 0 ${G.orange}`,
            display: "block",
          }}>
            100
          </span>
        </div>

        {/* "MIL" — @local86, delay=82 */}
        <LetraALetra
          text="MIL"
          frame={frame} delay={82} stagger={2.5}
          blurAmount={62} dist={32} dur={18} dir="bottom"
          letterStyle={{
            fontFamily: GROOVY, fontSize: 96,
            color: G.paper, letterSpacing: "0.12em", lineHeight: 1.0,
          }}
        />

        {/* linha */}
        <div style={{ width: "80%", marginTop: 18 }}>
          <Linha color={G.magenta} frame={frame} delay={94} />
        </div>
      </div>
    </SceneWrap>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CENA 06 — "VENDEDOR PRONTO" · 648–700f (52f)
// vendedor@local0: desblur imediato
// pronto@local17: LetraALetra delay=14
// ═══════════════════════════════════════════════════════════════════════════════
const C06: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  // vendedor@local0 — desblur imediato
  const vOp = ci(frame, [0, 14], [0, 1]);
  const vSc = ci(frame, [0, 16], [0.62, 1.0], Easing.out(Easing.back(2.0)));
  const vBl = ci(frame, [0, 14], [68, 0], Easing.out(Easing.cubic));

  return (
    <SceneWrap frame={frame} duration={duration} bg={G.plum} entryDir="left" exitDir="right"
      accentColor={G.magenta} vignetteI={0.50}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: PAD_TOP, paddingBottom: 640,
        paddingLeft: PAD_X, paddingRight: PAD_X,
      }}>

        {/* "e te entregamos um" */}
        <div style={{ marginBottom: 12, textAlign: "center", ...fadeBlur(frame, 0, 14, 28, 18, "top") }}>
          <span style={{
            fontFamily: BODY, fontSize: 28,
            color: G.paper, fontWeight: 300,
            letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.45,
          }}>
            e te entregamos um
          </span>
        </div>

        {/* "VENDEDOR" — desblur imediato @local0 */}
        <div style={{
          opacity: vOp, transform: `scale(${vSc})`,
          filter: `blur(${vBl}px)`, transformOrigin: "50% 50%", textAlign: "center",
          marginBottom: 8,
        }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 118,
            color: G.magenta,
            WebkitTextStroke: `4px ${G.paper}`,
            paintOrder: "stroke fill",
            textShadow: `8px 8px 0 ${G.orange}`,
            display: "block", lineHeight: 0.88,
          }}>
            VENDEDOR
          </span>
        </div>

        {/* "PRONTO" — @local15, delay=12 */}
        <LetraALetra
          text="PRONTO"
          frame={frame} delay={12} stagger={2.2}
          blurAmount={58} dist={36} dur={20} dir="bottom"
          letterStyle={{
            fontFamily: GROOVY, fontSize: 86,
            color: G.paper, letterSpacing: "0.06em", lineHeight: 1.0,
          }}
        />
      </div>
    </SceneWrap>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CENA 07 — "REUNIÕES no seu lugar" · 700–756f (56f)
// reuniões@local0: desblur imediato
// lugar@local20: PalavraBlur delay=18
// ═══════════════════════════════════════════════════════════════════════════════
const C07: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const rOp = ci(frame, [0, 14], [0, 1]);
  const rSc = ci(frame, [0, 14], [0.62, 1.0], Easing.out(Easing.back(2.0)));
  const rBl = ci(frame, [0, 12], [68, 0], Easing.out(Easing.cubic));

  return (
    <SceneWrap frame={frame} duration={duration} bg={G.purple} entryDir="right" exitDir="left"
      accentColor={G.magenta} vignetteI={0.45}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: PAD_TOP, paddingBottom: 620,
        paddingLeft: PAD_X, paddingRight: PAD_X,
      }}>

        {/* "para fazer as" */}
        <PalavraBlur
          text="para fazer as"
          frame={frame} delay={0} stagger={4}
          blurAmount={38} dist={28} dur={16} dir="top"
          style={{ marginBottom: 12 }}
          wordStyle={{
            fontFamily: BODY, fontSize: 34,
            color: G.paper, fontWeight: 300,
            letterSpacing: "0.12em", opacity: 0.60,
          }}
        />

        {/* "REUNIÕES" — desblur imediato @local0 */}
        <div style={{
          opacity: rOp, transform: `scale(${rSc})`,
          filter: `blur(${rBl}px)`, transformOrigin: "50% 50%",
          textAlign: "center", marginBottom: 14,
        }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 106,
            color: G.magenta,
            WebkitTextStroke: `4px ${G.paper}`,
            paintOrder: "stroke fill",
            textShadow: `7px 7px 0 ${G.orange}`,
            letterSpacing: "0.03em", lineHeight: 0.88,
            display: "block",
          }}>
            REUNIÕES
          </span>
        </div>

        <div style={{ width: "100%", marginBottom: 14 }}>
          <Linha color={G.magenta} frame={frame} delay={12} />
        </div>

        {/* "no seu lugar" — @local22, delay=18 */}
        <PalavraBlur
          text="no seu lugar"
          frame={frame} delay={18} stagger={4}
          blurAmount={42} dist={26} dur={16} dir="bottom"
          wordStyle={{
            fontFamily: GROOVY, fontSize: 68,
            color: G.paper, letterSpacing: "0.02em", lineHeight: 1.0,
          }}
        />
      </div>
    </SceneWrap>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CENA 08 — "TOQUE NO BOTÃO" · 756–843f (87f)
// Toque@local0: desblur imediato
// botão@local11: LetraALetra delay=6
// abaixo@local20: PalavraBlur delay=18
// ═══════════════════════════════════════════════════════════════════════════════
const C08: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  // Pulse suave via seno (sem reset brusco do modulo) — respiração contínua
  const pulse = 1 + Math.sin(frame * 0.22) * 0.025;
  const tOp   = ci(frame, [0, 18], [0, 1]);
  const tSc   = ci(frame, [0, 20], [0.65, 1.0], Easing.out(Easing.back(2.0)));
  const tBl   = ci(frame, [0, 18], [74, 0], Easing.out(Easing.cubic));

  return (
    <SceneWrap frame={frame} duration={duration} bg={G.purple} entryDir="top" exitDir="bottom"
      accentColor={G.magenta} vignetteI={0.52}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: PAD_TOP, paddingBottom: 640,
        paddingLeft: PAD_X, paddingRight: PAD_X,
      }}>

        <div style={{ width: "100%", marginBottom: 20 }}>
          <Linha color={G.magenta} frame={frame} delay={0} />
        </div>

        {/* "TOQUE" — desblur imediato @local0 */}
        <div style={{
          opacity: tOp, transform: `scale(${tSc})`,
          filter: `blur(${tBl}px)`, transformOrigin: "50% 50%",
          textAlign: "center", marginBottom: 8,
        }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 144,
            color: G.magenta,
            WebkitTextStroke: `5px ${G.paper}`,
            paintOrder: "stroke fill",
            textShadow: `10px 10px 0 ${G.orange}`,
            display: "block", lineHeight: 0.86,
          }}>
            TOQUE
          </span>
        </div>

        {/* "no botão" — @local13, delay=8 */}
        <LetraALetra
          text="no botão"
          frame={frame} delay={8} stagger={2.0}
          blurAmount={52} dist={30} dur={20} dir="bottom"
          style={{ marginBottom: 8 }}
          letterStyle={{
            fontFamily: GROOVY, fontSize: 66,
            color: G.paper, letterSpacing: "0.04em", lineHeight: 1.0,
          }}
        />

        {/* "abaixo" — @local22, delay=20 */}
        <PalavraBlur
          text="abaixo"
          frame={frame} delay={20} stagger={5}
          blurAmount={38} dist={22} dur={18} dir="bottom"
          style={{ marginBottom: 32 }}
          wordStyle={{
            fontFamily: GROOVY, fontSize: 52,
            color: G.paper, letterSpacing: "0.06em", opacity: 0.75,
          }}
        />

        {/* seta pulsante */}
        <div style={{
          opacity: ci(frame, [30, 44], [0, 1]),
          transform: `scale(${pulse}) translateY(${ci(frame, [30, 44], [16, 0], Easing.out(Easing.cubic))}px)`,
        }}>
          <IcoArrow color={G.magenta} size={68} />
        </div>

        <div style={{ width: "100%", marginTop: 20 }}>
          <Linha color={G.magenta} frame={frame} delay={34} />
        </div>
      </div>
    </SceneWrap>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT COMPOSITION
// ═══════════════════════════════════════════════════════════════════════════════
export const ConhecimentoBrian: React.FC = () => {
  const frame = useCurrentFrame();

  const scenes = [
    C00, C01, C02, C03, C04, C05, C06, C07, C08,
  ] as const;

  return (
    <AbsoluteFill style={{ background: G.plum, fontFamily: BODY }}>
      {/* Trilha sonora vintage (volume baixo, abaixo da narração) */}
      <Audio src={staticFile("audio/trilha-vintage.mp3")} volume={0.18} />
      {/* Narração Brian (voz principal) */}
      <Audio src={staticFile("audio/conhecimento-brian.mp3")} />
      {scenes.map((Comp, i) => (
        <Sequence key={i} from={S[i].s} durationInFrames={S[i].d}>
          <Comp frame={frame - S[i].s} duration={S[i].d} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
