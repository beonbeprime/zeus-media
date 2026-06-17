/**
 * CONHECIMENTO — Navy Arquiteto (dark luxury: teal noturno, creme, terracota, mogno)
 * Narrador: conhecimento.mp3 (38.38s = 1151f)
 * Total: 1202f (50f trailing buffer) @ 30fps
 *
 * SCENE MAP (whisper-synced):
 * C00  0–141   "Você já tem conhecimento suficiente para vender mentoria."
 * C01  141–233 "Provavelmente, você até pensa nisso faz tempo."
 * C02  233–359 "Mas sua mentoria ainda não saiu do papel por um motivo."
 * C03  359–437 "Você não sabe por onde começar."
 * C04  437–507 "O problema não é o seu conhecimento."
 * C05  507–596 "É que você ainda não tem a estrutura."
 * C06  596–670 "A gente monta a estrutura completa."
 * C07  670–829 "A página de vendas, o funil, a automação, as campanhas."
 * C08  829–961 "Com área de membros personalizada e tudo pronto para rodar."
 * C09  961–1202 "Para advogados, médicos, dentistas, psicólogos e empresários que precisam começar."
 */

import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";
import { loadFont as loadBagelFatOne }    from "@remotion/google-fonts/BagelFatOne";
import { loadFont as loadDMSans }         from "@remotion/google-fonts/DMSans";
import { loadFont as loadUltra }          from "@remotion/google-fonts/Ultra";
import { loadFont as loadJetBrainsMono }  from "@remotion/google-fonts/JetBrainsMono";

loadBagelFatOne();
loadDMSans();
loadUltra();
loadJetBrainsMono();

// ─── Tipografia ───────────────────────────────────────────────────────────────
const GROOVY  = "'Bagel Fat One', 'Bowlby One SC', sans-serif";
const BODY    = "'DM Sans', system-ui, sans-serif";
const DISPLAY = "'Ultra', 'Alfa Slab One', serif";
const MONO    = "'JetBrains Mono', ui-monospace, monospace";

// ─── Paleta Navy Arquiteto (dark luxury) ─────────────────────────────────────
const G = {
  paper:     "#F2E8DC",   // creme marfim — fundo claro / texto sobre escuro
  paperDeep: "#E6DFDA",   // creme variante
  paperEdge: "#C4BAB4",   // borda creme acinzentada
  magenta:   "#D97B59",   // terracota cobre — acento principal
  hotPink:   "#D97B59",   // terracota (mesma, papéis distintos)
  yellow:    "#F2E8DC",   // creme como highlight de texto em cenas escuras
  orange:    "#733C1D",   // mogno profundo — acento quente secundário
  teal:      "#D97B59",   // terracota serve como contraste
  purple:    "#193940",   // teal noturno — fundo escuro principal
  plum:      "#101F22",   // teal mais profundo — segundo fundo escuro
};

// ─── Zonas seguras ────────────────────────────────────────────────────────────
const PAD_X       = 72;
const PAD_TOP     = 160;
const SAFE_BOTTOM = 1280;

// ─── Primitivas de animação ───────────────────────────────────────────────────
const ci = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing?: (t: number) => number
) =>
  interpolate(frame, input, output, {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const entryFrom = (
  frame: number,
  dir: "left" | "right" | "top" | "bottom" = "bottom",
  distance = 50,
  dur = 20
) => {
  const axis  = dir === "left" || dir === "right" ? "X" : "Y";
  const sign  = dir === "right" || dir === "bottom" ? 1 : -1;
  const pos   = ci(frame, [0, dur], [distance * sign, 0], Easing.out(Easing.cubic));
  const op    = ci(frame, [0, Math.round(dur * 0.55)], [0, 1]);
  const blur  = ci(frame, [0, Math.round(dur * 0.45)], [10, 0], Easing.out(Easing.quad));
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px)`,
    filter:    `blur(${blur}px)`,
  } as React.CSSProperties;
};

const exitTo = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom" = "left",
  distance = 1100,
  dur = 16
) => {
  const axis  = dir === "left" || dir === "right" ? "X" : "Y";
  const sign  = dir === "right" || dir === "bottom" ? 1 : -1;
  const f     = frame - start;
  const pos   = ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp));
  const op    = ci(f, [Math.round(dur * 0.35), dur], [1, 0]);
  const sc    = ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp));
  const blur  = ci(f, [0, dur], [0, 18], Easing.in(Easing.cubic));
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px) scale(${sc})`,
    filter:    `blur(${blur}px)`,
  } as React.CSSProperties;
};

const mergeStyles = (...styles: React.CSSProperties[]): React.CSSProperties => ({
  opacity:   styles.reduce((acc, s) => acc * (typeof s.opacity === "number" ? s.opacity : 1), 1),
  transform: styles.map(s => s.transform).filter(Boolean).join(" ") || undefined,
  filter:    styles.map(s => s.filter).filter(Boolean).join(" ") || undefined,
});

// ─── Groovy Grain ─────────────────────────────────────────────────────────────
const GroovyGrain: React.FC<{ strength?: number }> = ({ strength = 0.35 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
    <svg width="100%" height="100%" style={{ mixBlendMode: "multiply", opacity: strength }}>
      <filter id="grain-groovy">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.10  0 0 0 0 0.22  0 0 0 0 0.25  0 0 0 0.85 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-groovy)" />
    </svg>
  </AbsoluteFill>
);

// ─── Vinheta Groovy ───────────────────────────────────────────────────────────
const GroovyVignette: React.FC<{ intensity?: number }> = ({ intensity = 0.25 }) => (
  <AbsoluteFill
    style={{
      background: [
        `radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(16,31,34,${intensity}) 100%)`,
        `radial-gradient(circle at 10% 12%, rgba(16,31,34,${intensity * 0.9}), transparent 18%)`,
        `radial-gradient(circle at 90% 88%, rgba(16,31,34,${intensity * 0.8}), transparent 16%)`,
      ].join(", "),
      pointerEvents: "none",
      zIndex: 996,
    }}
  />
);

// ─── Background Groovy ────────────────────────────────────────────────────────
const GroovyBg: React.FC<{ color?: string }> = ({ color = G.paper }) => (
  <AbsoluteFill
    style={{
      background: color,
      backgroundImage: [
        `radial-gradient(ellipse at 20% 0%, rgba(217,123,89,0.08), transparent 50%)`,
        `radial-gradient(ellipse at 80% 100%, rgba(115,60,29,0.07), transparent 50%)`,
      ].join(", "),
    }}
  />
);

// ─── Aura / Light (substitui LightLeak) ──────────────────────────────────────
const GroovyAura: React.FC<{ frame: number; tint?: "magenta" | "teal" | "orange" }> = ({
  frame, tint = "magenta"
}) => {
  const colors = {
    magenta: "rgba(217,123,89,0.22)",
    teal:    "rgba(115,60,29,0.16)",
    orange:  "rgba(217,123,89,0.20)",
  };
  const color = colors[tint];
  const op = ci(frame, [0, 12], [0, 1]) * ci(frame, [30, 40], [1, 0.3]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 55% 35% at 15% 12%, ${color} 0%, transparent 70%)`,
        opacity: op,
        pointerEvents: "none",
        zIndex: 997,
      }}
    />
  );
};

// ─── Borda Groovy (substitui OrnamentalFrame) ─────────────────────────────────
const GroovyBorder: React.FC<{ color?: string; opacity?: number }> = ({
  color = G.purple,
  opacity = 0.55,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 993, opacity }}>
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="none">
      {/* borda principal chunky */}
      <rect x="20" y="20" width="1040" height="1880" fill="none" stroke={color} strokeWidth="6" />
      {/* sombra offset (deslocada) */}
      <rect x="28" y="28" width="1040" height="1880" fill="none" stroke={G.magenta} strokeWidth="2" opacity="0.4" />
      {/* cantos com ponto */}
      {[[20, 20], [1060, 20], [20, 1900], [1060, 1900]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="8"  fill={color} />
          <circle cx={cx} cy={cy} r="14" fill="none" stroke={color} strokeWidth="2" />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

// ─── Linha separadora Groovy ──────────────────────────────────────────────────
const GroovyLine: React.FC<{ color?: string; width?: number; style?: React.CSSProperties }> = ({
  color = G.orange,
  width = 480,
  style = {},
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
    <div style={{ flex: 1, height: 2, background: color, opacity: 0.7 }} />
    <svg width="16" height="16" viewBox="0 0 14 14">
      <path d="M7,0 L8.5,5.5 L14,7 L8.5,8.5 L7,14 L5.5,8.5 L0,7 L5.5,5.5 Z" fill={color} opacity="0.8" />
    </svg>
    <div style={{ flex: 1, height: 2, background: color, opacity: 0.7 }} />
  </div>
);

// ─── Palavra por Palavra ──────────────────────────────────────────────────────
interface WordByWordProps {
  text: string;
  frame: number;
  startDelay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
  dir?: "left" | "right" | "top" | "bottom";
  distance?: number;
  dur?: number;
}
const WordByWord: React.FC<WordByWordProps> = ({
  text, frame, startDelay = 0, stagger = 4, style, wordStyle,
  dir = "bottom", distance = 36, dur = 18,
}) => {
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.14em", ...style }}>
      {words.map((word, i) => {
        const f = frame - startDelay - i * stagger;
        const entry = entryFrom(Math.max(0, f), dir, distance, dur);
        return (
          <span key={i} style={{ display: "inline-block", ...entry, ...wordStyle }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ─── Cena Groovy (wrapper universal) ─────────────────────────────────────────
interface GroovySceneProps {
  frame: number;
  duration: number;
  bg?: string;
  entryDir?: "left" | "right" | "top" | "bottom";
  exitDir?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
  showBorder?: boolean;
  borderColor?: string;
  auraTint?: "magenta" | "teal" | "orange";
  vignetteIntensity?: number;
}
const GroovyScene: React.FC<GroovySceneProps> = ({
  frame, duration, bg = G.paper,
  entryDir = "left", exitDir = "right",
  children, showBorder = true, borderColor = G.purple,
  auraTint = "magenta", vignetteIntensity = 0.25,
}) => {
  const exitStart  = duration - 16;
  const sceneEntry = entryFrom(frame, entryDir, 28, 22);
  const sceneExit  = exitTo(frame, exitStart, exitDir, 1100, 14);
  const merged     = mergeStyles(sceneEntry, sceneExit);
  const kbScale    = ci(frame, [0, Math.max(1, duration - 16)], [1.0, 1.025], Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${kbScale})`, transformOrigin: "50% 50%" }}>
        <GroovyBg color={bg} />
      </AbsoluteFill>
      <AbsoluteFill style={{ ...merged }}>{children}</AbsoluteFill>
      {showBorder && <GroovyBorder color={borderColor} opacity={0.50} />}
      <GroovyAura frame={frame} tint={auraTint} />
      <GroovyVignette intensity={vignetteIntensity} />
      <GroovyGrain strength={0.30} />
    </AbsoluteFill>
  );
};

// ─── SVGs Temáticos (Magna Icon Library — Groovy colors) ──────────────────────

const SVGBook: React.FC<{ color?: string; size?: number }> = ({ color = G.yellow, size = 180 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const SVGHourglass: React.FC<{ color?: string; size?: number; frame?: number }> = ({ color = G.orange, size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M5 22h14"/>
    <path d="M5 2h14"/>
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/>
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
  </svg>
);

const SVGLightbulb: React.FC<{ color?: string; size?: number }> = ({ color = G.yellow, size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);

const SVGGears: React.FC<{ color?: string; size?: number; frame?: number }> = ({ color = G.orange, size = 180 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
    <path d="M12 2v2"/>
    <path d="M12 22v-2"/>
    <path d="m17 20.66-1-1.73"/>
    <path d="M11 10.27 7 3.34"/>
    <path d="m20.66 17-1.73-1"/>
    <path d="m3.34 7 1.73 1"/>
    <path d="M14 12h8"/>
    <path d="M2 12h2"/>
    <path d="m20.66 7-1.73 1"/>
    <path d="m3.34 17 1.73-1"/>
    <path d="m17 3.34-1 1.73"/>
    <path d="m11 13.73-4 6.93"/>
  </svg>
);

const SVGFunnel: React.FC<{ color?: string; size?: number }> = ({ color = G.yellow, size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const SVGScreen: React.FC<{ color?: string; size?: number }> = ({ color = G.yellow, size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" x2="16" y1="21" y2="21"/>
    <line x1="12" x2="12" y1="17" y2="21"/>
  </svg>
);

const SVGRocket: React.FC<{ color?: string; size?: number; frame?: number }> = ({ color = G.yellow, size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const SVGCheck: React.FC<{ color?: string; size?: number }> = ({ color = G.yellow, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

// ─── CENA 00: HOOK — "Você já tem conhecimento suficiente para vender mentoria." ──
// frames 0–141
const C00_Hook: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  // Fase 1 (0-14f): linhas revelam do centro para as bordas (scaleX)
  const lineReveal = ci(frame, [0, 14], [0, 1], Easing.out(Easing.cubic));
  const lineOp     = ci(frame, [0, 10], [0, 1]);

  // Fase 2 (6-28f): MENTORIA emerge — scale + desblur cinematográfico
  const mentoriaOp    = ci(frame, [6, 26], [0, 1]);
  const mentoriaScale = ci(Math.max(0, frame - 6), [0, 22], [0.78, 1.0], Easing.out(Easing.back(1.10)));
  const mentoriaBlur  = ci(frame, [6, 22], [28, 0], Easing.out(Easing.quad));

  // Fase 3 (0-18f): eyebrow desce do topo
  const eyeOp = ci(frame, [0, 18], [0, 1]);
  const eyeY  = ci(frame, [0, 18], [-44, 0], Easing.out(Easing.cubic));

  // Fase 4 (20-36f): tagline sobe de baixo (convergência intencional)
  const tagOp = ci(frame, [20, 36], [0, 1]);
  const tagY  = ci(frame, [20, 36], [32, 0], Easing.out(Easing.cubic));

  // Fase 5 (38-56f): ícone aparece suave
  const iconOp = ci(frame, [38, 56], [0, 1]);

  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.purple} entryDir="bottom" exitDir="top"
      borderColor={G.magenta} auraTint="magenta" vignetteIntensity={0.45}
    >
      {/* ── BLOCO CENTRAL TIPOGRÁFICO ─────────────────────────────────────────
          Composição em coluna flex, centralizada na zona segura (160–1280px).
          paddingTop=PAD_TOP, paddingBottom=640 → centro visual em y≈720px.
      ────────────────────────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: PAD_TOP,
        paddingBottom: 640,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}>

        {/* EYEBROW — entra do topo */}
        <div style={{
          opacity: eyeOp,
          transform: `translateY(${eyeY}px)`,
          marginBottom: 22,
          textAlign: "center",
        }}>
          <span style={{
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: "0.44em",
            color: G.paper,
            textTransform: "uppercase",
            opacity: 0.55,
          }}>
            você já tem
          </span>
        </div>

        {/* LINHA SUPERIOR — scaleX do centro para as bordas */}
        <div style={{
          width: "100%",
          opacity: lineOp,
          transform: `scaleX(${lineReveal})`,
          transformOrigin: "50% 50%",
          marginBottom: 24,
        }}>
          <GroovyLine color={G.magenta} />
        </div>

        {/* HERO: MENTORIA — emerge do centro com scale + desblur */}
        <div style={{
          opacity: mentoriaOp,
          transform: `scale(${mentoriaScale})`,
          transformOrigin: "50% 50%",
          filter: `blur(${mentoriaBlur}px)`,
          textAlign: "center",
          marginBottom: 24,
        }}>
          <span style={{
            fontFamily: DISPLAY,
            fontSize: 136,
            letterSpacing: "0.005em",
            color: G.magenta,
            WebkitTextStroke: `4px ${G.paper}`,
            paintOrder: "stroke fill",
            textShadow: `8px 8px 0 ${G.orange}`,
            display: "inline-block",
            lineHeight: 0.92,
            whiteSpace: "nowrap",
          }}>
            MENTORIA
          </span>
        </div>

        {/* LINHA INFERIOR — scaleX do centro para as bordas */}
        <div style={{
          width: "100%",
          opacity: lineOp,
          transform: `scaleX(${lineReveal})`,
          transformOrigin: "50% 50%",
          marginBottom: 30,
        }}>
          <GroovyLine color={G.magenta} />
        </div>

        {/* TAGLINE — sobe de baixo (converge com eyebrow que desce) */}
        <div style={{
          opacity: tagOp,
          transform: `translateY(${tagY}px)`,
          textAlign: "center",
          marginBottom: 48,
        }}>
          <span style={{
            fontFamily: BODY,
            fontSize: 28,
            color: G.paper,
            fontWeight: 300,
            letterSpacing: "0.14em",
            opacity: 0.60,
            display: "block",
            lineHeight: 1.65,
          }}>
            conhecimento suficiente
          </span>
          <span style={{
            fontFamily: BODY,
            fontSize: 28,
            color: G.paper,
            fontWeight: 300,
            letterSpacing: "0.14em",
            opacity: 0.60,
            display: "block",
            lineHeight: 1.65,
          }}>
            para vender mentoria
          </span>
        </div>

        {/* ÍCONE — fade suave, ancora a composição */}
        <div style={{ opacity: iconOp }}>
          <SVGBook color={G.paper} size={60} />
        </div>
      </div>
    </GroovyScene>
  );
};

// ─── CENA 01: AMPLIFY — "Provavelmente, você até pensa nisso faz tempo." ──────
// frames 141–233 (dur=92)
const C01_Amplify: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.paper} entryDir="right" exitDir="left"
      borderColor={G.purple} auraTint="teal" vignetteIntensity={0.22}
    >
      <div style={{
        position: "absolute",
        top: PAD_TOP + 200,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
      }}>
        {/* "Provavelmente," */}
        <WordByWord
          text="Provavelmente,"
          frame={frame}
          startDelay={4}
          stagger={4}
          dir="bottom"
          distance={32}
          dur={18}
          style={{ marginBottom: 14 }}
          wordStyle={{
            fontFamily: GROOVY,
            fontSize: 62,
            color: G.magenta,
            fontWeight: 400,
          }}
        />
        {/* "você até pensa nisso faz tempo." */}
        <WordByWord
          text="você até pensa nisso faz tempo."
          frame={frame}
          startDelay={18}
          stagger={5}
          dir="bottom"
          distance={28}
          dur={16}
          wordStyle={{
            fontFamily: BODY,
            fontSize: 50,
            color: G.plum,
            fontWeight: 700,
          }}
        />
      </div>

      {/* hourglass */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 560,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: ci(frame, [20, 36], [0, 1]),
      }}>
        <SVGHourglass color={G.orange} size={110} frame={frame} />
      </div>
    </GroovyScene>
  );
};

// ─── CENA 02: DOR — "Mas sua mentoria ainda não saiu do papel por um motivo." ─
// frames 233–359 (dur=126)
const C02_Dor: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.purple} entryDir="left" exitDir="right"
      borderColor={G.magenta} auraTint="magenta" vignetteIntensity={0.45}
    >
      {/* "Mas" — pequeno, de entrada */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 140,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(frame, "bottom", 28, 16),
      }}>
        <span style={{
          fontFamily: MONO,
          fontSize: 48,
          color: G.paper,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0.75,
        }}>
          Mas
        </span>
      </div>

      {/* "sua mentoria ainda não saiu do papel" */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 220,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
      }}>
        <WordByWord
          text="sua mentoria ainda não saiu do papel"
          frame={frame}
          startDelay={8}
          stagger={4}
          dir="bottom"
          distance={36}
          dur={18}
          wordStyle={{
            fontFamily: GROOVY,
            fontSize: 74,
            color: G.hotPink,
            letterSpacing: "0.02em",
            lineHeight: 1.0,
          }}
        />
      </div>

      {/* "por um motivo." */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 560,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(Math.max(0, frame - 45), "bottom", 28, 16),
      }}>
        <span style={{
          fontFamily: BODY,
          fontSize: 52,
          color: G.paper,
          fontWeight: 500,
        }}>
          por um motivo.
        </span>
      </div>
    </GroovyScene>
  );
};

// ─── CENA 03: PROBLEMA — "Você não sabe por onde começar." ────────────────────
// frames 359–437 (dur=78)
const C03_Problema: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.plum} entryDir="bottom" exitDir="top"
      borderColor={G.yellow} auraTint="orange" vignetteIntensity={0.50}
    >
      <div style={{
        position: "absolute",
        top: PAD_TOP + 180,
        left: PAD_X - 20, right: PAD_X - 20,
        textAlign: "center",
      }}>
        <WordByWord
          text="Você não sabe"
          frame={frame}
          startDelay={2}
          stagger={5}
          dir="top"
          distance={48}
          dur={20}
          style={{ marginBottom: 16 }}
          wordStyle={{
            fontFamily: GROOVY,
            fontSize: 64,
            color: G.paper,
            letterSpacing: "0.02em",
            lineHeight: 1.0,
          }}
        />
        <WordByWord
          text="por onde começar."
          frame={frame}
          startDelay={20}
          stagger={5}
          dir="top"
          distance={48}
          dur={20}
          wordStyle={{
            fontFamily: GROOVY,
            fontSize: 64,
            color: G.magenta,
            letterSpacing: "0.02em",
            lineHeight: 1.0,
          }}
        />
      </div>

      {/* lightbulb apagada */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 560,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: ci(frame, [20, 36], [0, 0.5]),
        filter: "grayscale(0.8)",
      }}>
        <SVGLightbulb color={G.orange} size={100} />
      </div>
    </GroovyScene>
  );
};

// ─── CENA 04: REFRAME — "O problema não é o seu conhecimento." ────────────────
// frames 437–507 (dur=70)
const C04_Reframe: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.paperDeep} entryDir="right" exitDir="left"
      borderColor={G.purple} auraTint="teal" vignetteIntensity={0.28}
    >
      {/* "O problema não é" */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 180,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(frame, "right", 50, 22),
      }}>
        <span style={{
          fontFamily: BODY,
          fontSize: 60,
          color: G.plum,
          fontWeight: 500,
          display: "block",
        }}>
          O problema não é
        </span>
      </div>

      {/* "o seu CONHECIMENTO." — tachado após frame 40 */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 300,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(Math.max(0, frame - 14), "right", 60, 22),
      }}>
        <span style={{
          fontFamily: GROOVY,
          fontSize: 68,
          color: G.magenta,
          letterSpacing: "0.02em",
          lineHeight: 1.0,
          display: "block",
          textDecoration: frame > 40 ? "line-through" : "none",
          textDecorationColor: G.orange,
          textDecorationThickness: "5px",
        }}>
          CONHECIMENTO.
        </span>
      </div>
    </GroovyScene>
  );
};

// ─── CENA 05: REVEAL — "É que você ainda não tem a estrutura." ─────────────────
// frames 507–596 (dur=89)
const C05_Reveal: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const scaleIn = ci(frame, [0, 24], [0.75, 1.0], Easing.out(Easing.back(1.4)));

  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.purple} entryDir="bottom" exitDir="top"
      borderColor={G.yellow} auraTint="magenta" vignetteIntensity={0.40}
    >
      {/* "É que você ainda não tem a" */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 160,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(frame, "bottom", 36, 20),
      }}>
        <WordByWord
          text="É que você ainda não tem a"
          frame={frame}
          startDelay={4}
          stagger={4}
          dir="bottom"
          distance={24}
          dur={16}
          wordStyle={{
            fontFamily: BODY,
            fontSize: 52,
            color: G.paper,
            fontWeight: 500,
            opacity: 0.85,
          }}
        />
      </div>

      {/* ESTRUTURA — outlined destaque */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 340,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        transform: `scale(${scaleIn})`,
        opacity: ci(frame, [4, 20], [0, 1]),
      }}>
        <span style={{
          fontFamily: DISPLAY,
          fontSize: 108,
          letterSpacing: "0.03em",
          color: G.purple,
          WebkitTextStroke: `6px ${G.paper}`,
          paintOrder: "stroke fill",
          textShadow: `9px 9px 0 ${G.magenta}`,
          display: "block",
          lineHeight: 0.95,
        }}>
          ESTRUTURA.
        </span>
      </div>

      {/* gears */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 570,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: ci(frame, [30, 50], [0, 0.9]),
      }}>
        <SVGGears color={G.orange} size={120} frame={frame} />
      </div>
    </GroovyScene>
  );
};

// ─── CENA 06: SOLUÇÃO — "A gente monta a estrutura completa." ─────────────────
// frames 596–670 (dur=74)
const C06_Solucao: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.paper} entryDir="left" exitDir="right"
      borderColor={G.purple} auraTint="magenta" vignetteIntensity={0.22}
    >
      {/* "A gente monta" */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 220,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
      }}>
        <WordByWord
          text="A gente monta"
          frame={frame}
          startDelay={2}
          stagger={5}
          dir="left"
          distance={50}
          dur={20}
          style={{ marginBottom: 12 }}
          wordStyle={{
            fontFamily: BODY,
            fontSize: 68,
            color: G.plum,
            fontWeight: 500,
          }}
        />
        {/* "a estrutura" */}
        <WordByWord
          text="a estrutura"
          frame={frame}
          startDelay={20}
          stagger={5}
          dir="left"
          distance={50}
          dur={20}
          style={{ marginBottom: 12 }}
          wordStyle={{
            fontFamily: GROOVY,
            fontSize: 74,
            color: G.magenta,
            letterSpacing: "0.02em",
          }}
        />
        {/* "completa." */}
        <WordByWord
          text="completa."
          frame={frame}
          startDelay={35}
          stagger={4}
          dir="left"
          distance={40}
          dur={18}
          wordStyle={{
            fontFamily: GROOVY,
            fontSize: 74,
            color: G.orange,
            letterSpacing: "0.02em",
          }}
        />
      </div>

      {/* rocket */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 610,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: ci(frame, [24, 40], [0, 1]),
      }}>
        <SVGRocket color={G.yellow} size={90} frame={frame} />
      </div>
    </GroovyScene>
  );
};

// ─── CENA 07: LISTA — "A página de vendas, o funil, a automação, as campanhas." ──
// frames 670–829 (dur=159)
const C07_Lista: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const items = [
    { text: "Página de Vendas", startF: 0,   color: G.paper,   SVGComp: SVGScreen   },
    { text: "Funil",           startF: 45,  color: G.magenta, SVGComp: SVGFunnel   },
    { text: "Automação",       startF: 76,  color: G.paper,   SVGComp: SVGGears    },
    { text: "Campanhas",       startF: 121, color: G.magenta, SVGComp: SVGRocket   },
  ];

  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.purple} entryDir="right" exitDir="left"
      borderColor={G.yellow} auraTint="magenta" vignetteIntensity={0.35}
    >
      {/* eyebrow */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 80,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(frame, "top", 24, 16),
      }}>
        <span style={{
          fontFamily: MONO,
          fontSize: 34,
          color: G.paper,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.75,
        }}>
          A estrutura inclui
        </span>
      </div>

      {/* lista progressiva */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 160,
        left: PAD_X + 20, right: PAD_X + 20,
      }}>
        {items.map((item, idx) => {
          const f = frame - item.startF;
          const itemOp  = ci(f, [0, 16], [0, 1]);
          const itemY   = ci(f, [0, 16], [30, 0], Easing.out(Easing.cubic));
          const itemBlur= ci(f, [0, 10], [8, 0]);
          if (f < -2) return null;
          return (
            <div key={idx} style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 28,
              opacity: itemOp,
              transform: `translateY(${itemY}px)`,
              filter: `blur(${itemBlur}px)`,
            }}>
              <SVGCheck color={item.color} size={26} />
              <span style={{
                fontFamily: GROOVY,
                fontSize: 50,
                color: item.color,
                letterSpacing: "0.02em",
                lineHeight: 1.0,
              }}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </GroovyScene>
  );
};

// ─── CENA 08: COMPLETO — "Com área de membros personalizada e tudo pronto para rodar." ──
// frames 829–961 (dur=132)
const C08_Completo: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.paper} entryDir="left" exitDir="right"
      borderColor={G.purple} auraTint="teal" vignetteIntensity={0.26}
    >
      {/* "Com área de membros" */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 140,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
      }}>
        <WordByWord
          text="Com área de membros"
          frame={frame}
          startDelay={2}
          stagger={5}
          dir="bottom"
          distance={36}
          dur={18}
          style={{ marginBottom: 8 }}
          wordStyle={{
            fontFamily: BODY,
            fontSize: 58,
            color: G.plum,
            fontWeight: 500,
          }}
        />
      </div>

      {/* "PERSONALIZADA" — destaque outlined */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 320,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(Math.max(0, frame - 36), "bottom", 50, 20),
      }}>
        <span style={{
          fontFamily: DISPLAY,
          fontSize: 84,
          letterSpacing: "0.02em",
          color: G.purple,
          WebkitTextStroke: `5px ${G.paperEdge}`,
          paintOrder: "stroke fill",
          textShadow: `8px 8px 0 ${G.magenta}`,
          display: "block",
          lineHeight: 1.0,
        }}>
          PERSONALIZADA
        </span>
      </div>

      {/* linha */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 470,
        left: PAD_X + 80, right: PAD_X + 80,
        opacity: ci(Math.max(0, frame - 50), [0, 16], [0, 1]),
      }}>
        <GroovyLine color={G.orange} />
      </div>

      {/* "e tudo pronto para rodar." */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 510,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(Math.max(0, frame - 69), "bottom", 32, 18),
      }}>
        <WordByWord
          text="e tudo pronto para rodar."
          frame={Math.max(0, frame - 69)}
          startDelay={0}
          stagger={5}
          dir="bottom"
          distance={28}
          dur={16}
          wordStyle={{
            fontFamily: BODY,
            fontSize: 54,
            color: G.plum,
            fontWeight: 700,
          }}
        />
      </div>
    </GroovyScene>
  );
};

// ─── CENA 09: PÚBLICO + CTA ───────────────────────────────────────────────────
// frames 961–1202 (dur=241)
const C09_CTA: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const profissoes = [
    { label: "Advogados",    startF: 0   },
    { label: "Médicos",      startF: 41  },
    { label: "Dentistas",    startF: 70  },
    { label: "Psicólogos",   startF: 105 },
    { label: "Empresários",  startF: 129 },
  ];

  const ctaOp    = ci(frame, [190, 210], [0, 1]);
  const ctaScale = ci(frame, [190, 210], [0.9, 1.0], Easing.out(Easing.back(1.3)));

  return (
    <GroovyScene
      frame={frame} duration={duration}
      bg={G.purple} entryDir="bottom" exitDir="top"
      borderColor={G.yellow} auraTint="teal" vignetteIntensity={0.42}
    >
      {/* "Para" eyebrow */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 70,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(frame, "top", 24, 16),
      }}>
        <span style={{
          fontFamily: MONO,
          fontSize: 40,
          color: G.paper,
          letterSpacing: "0.20em",
          textTransform: "uppercase",
          opacity: 0.75,
        }}>
          Para
        </span>
      </div>

      {/* lista de profissões */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 150,
        left: PAD_X + 10, right: PAD_X + 10,
        textAlign: "center",
      }}>
        {profissoes.map((p, idx) => {
          const f    = frame - p.startF;
          const op   = ci(f, [0, 14], [0, 1]);
          const tY   = ci(f, [0, 14], [24, 0], Easing.bezier(0.4, 0.0, 0.2, 1.0));
          const blur = ci(f, [0, 10], [6, 0]);
          if (f < -2) return null;
          return (
            <span key={idx} style={{
              display: "block",
              fontFamily: GROOVY,
              fontSize: 72,
              letterSpacing: "0.02em",
              color: idx % 2 === 0 ? G.magenta : G.paper,
              lineHeight: 1.05,
              opacity: op,
              transform: `translateY(${tY}px)`,
              filter: `blur(${blur}px)`,
            }}>
              {p.label}
              {idx < profissoes.length - 1 ? "," : ""}
            </span>
          );
        })}
      </div>

      {/* "que precisam começar." */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 600,
        left: PAD_X, right: PAD_X,
        textAlign: "center",
        ...entryFrom(Math.max(0, frame - 150), "bottom", 32, 18),
      }}>
        <span style={{
          fontFamily: BODY,
          fontSize: 50,
          color: G.paper,
          fontWeight: 500,
        }}>
          que precisam começar.
        </span>
      </div>

      {/* CTA box estilo Groovy (borda chunky + offset shadow) */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 740,
        left: PAD_X + 30, right: PAD_X + 30,
        opacity: ctaOp,
        transform: `scale(${ctaScale})`,
        transformOrigin: "50% 50%",
      }}>
        <div style={{
          border: `6px solid ${G.magenta}`,
          borderRadius: 4,
          padding: "28px 40px",
          textAlign: "center",
          background: `rgba(16,31,34,0.85)`,
          boxShadow: `10px 10px 0 ${G.orange}`,
        }}>
          <span style={{
            fontFamily: GROOVY,
            fontSize: 58,
            letterSpacing: "0.04em",
            color: G.paper,
            display: "block",
            lineHeight: 1.0,
          }}>
            COMECE AGORA
          </span>
          <span style={{
            fontFamily: MONO,
            fontSize: 30,
            color: G.paper,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            display: "block",
            marginTop: 10,
            opacity: 0.80,
          }}>
            a estrutura que faltava
          </span>
        </div>
      </div>

      {/* seta para baixo */}
      <div style={{
        position: "absolute",
        top: PAD_TOP + 960,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: ctaOp * interpolate(Math.max(0, frame - 200), [0, 10, 20, 30], [0, 1, 0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24,8 L24,36" stroke={G.magenta} strokeWidth="3" strokeLinecap="round" />
          <path d="M12,26 L24,40 L36,26" stroke={G.magenta} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </GroovyScene>
  );
};

// ─── COMPOSIÇÃO PRINCIPAL ─────────────────────────────────────────────────────
const SCENES = [
  { id: "C00", from: 0,    dur: 141 },
  { id: "C01", from: 141,  dur: 92  },
  { id: "C02", from: 233,  dur: 126 },
  { id: "C03", from: 359,  dur: 78  },
  { id: "C04", from: 437,  dur: 70  },
  { id: "C05", from: 507,  dur: 89  },
  { id: "C06", from: 596,  dur: 74  },
  { id: "C07", from: 670,  dur: 159 },
  { id: "C08", from: 829,  dur: 132 },
  { id: "C09", from: 961,  dur: 241 },
];

export const Conhecimento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Música de fundo ────────────────────────────────────────────────────────
  // - Pula os primeiros 4s da fonte (Travel.mp3 começa cheio aos ~4s)
  // - Fade-in de 1s no início do vídeo
  // - Fade-out de 1s no fim
  // - Volume baixo (0.12) para não competir com o narrador
  const MUSIC_SKIP_FRAMES   = Math.round(4 * fps);   // 120 @ 30fps
  const MUSIC_FADE_FRAMES   = Math.round(1 * fps);   // 30  @ 30fps
  const MUSIC_TARGET_VOLUME = 0.13; // +8% sobre 0.12

  const musicVolume = (f: number) => {
    const fadeIn  = interpolate(f, [0, MUSIC_FADE_FRAMES], [0, MUSIC_TARGET_VOLUME], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(
      f,
      [durationInFrames - MUSIC_FADE_FRAMES, durationInFrames],
      [MUSIC_TARGET_VOLUME, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return Math.min(fadeIn, fadeOut);
  };

  return (
    <AbsoluteFill>
      {/* Música de fundo (corte 4s + fade) */}
      <Audio
        src={staticFile("audio/conhecimento-musica.mp3")}
        startFrom={MUSIC_SKIP_FRAMES}
        volume={musicVolume}
      />

      {/* Áudio narrador */}
      <Audio src={staticFile("audio/conhecimento.mp3")} />

      {/* Cenas */}
      <Sequence from={SCENES[0].from} durationInFrames={SCENES[0].dur}>
        <C00_Hook frame={frame - SCENES[0].from} duration={SCENES[0].dur} />
      </Sequence>
      <Sequence from={SCENES[1].from} durationInFrames={SCENES[1].dur}>
        <C01_Amplify frame={frame - SCENES[1].from} duration={SCENES[1].dur} />
      </Sequence>
      <Sequence from={SCENES[2].from} durationInFrames={SCENES[2].dur}>
        <C02_Dor frame={frame - SCENES[2].from} duration={SCENES[2].dur} />
      </Sequence>
      <Sequence from={SCENES[3].from} durationInFrames={SCENES[3].dur}>
        <C03_Problema frame={frame - SCENES[3].from} duration={SCENES[3].dur} />
      </Sequence>
      <Sequence from={SCENES[4].from} durationInFrames={SCENES[4].dur}>
        <C04_Reframe frame={frame - SCENES[4].from} duration={SCENES[4].dur} />
      </Sequence>
      <Sequence from={SCENES[5].from} durationInFrames={SCENES[5].dur}>
        <C05_Reveal frame={frame - SCENES[5].from} duration={SCENES[5].dur} />
      </Sequence>
      <Sequence from={SCENES[6].from} durationInFrames={SCENES[6].dur}>
        <C06_Solucao frame={frame - SCENES[6].from} duration={SCENES[6].dur} />
      </Sequence>
      <Sequence from={SCENES[7].from} durationInFrames={SCENES[7].dur}>
        <C07_Lista frame={frame - SCENES[7].from} duration={SCENES[7].dur} />
      </Sequence>
      <Sequence from={SCENES[8].from} durationInFrames={SCENES[8].dur}>
        <C08_Completo frame={frame - SCENES[8].from} duration={SCENES[8].dur} />
      </Sequence>
      <Sequence from={SCENES[9].from} durationInFrames={SCENES[9].dur}>
        <C09_CTA frame={frame - SCENES[9].from} duration={SCENES[9].dur} />
      </Sequence>
    </AbsoluteFill>
  );
};
