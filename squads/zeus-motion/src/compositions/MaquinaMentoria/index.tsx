import React from "react";
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
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCormorantGaramond } from "@remotion/google-fonts/CormorantGaramond";

// Fontes locais via @remotion/google-fonts — delayRender/continueRender gerenciados internamente
loadBebasNeue();
loadPlayfairDisplay();
loadCormorantGaramond();

// ─── PALETA VINTAGE REAL (papel envelhecido, sépia, ferrugem) ─────────────────
const V = {
  PAPER:    "#F2E2C0",   // papel amarelado envelhecido
  PAPER2:   "#E8D4A2",   // papel mais escuro
  CREAM:    "#FAF0DC",   // creme claro
  SEPIA:    "#C4A46B",   // sépia dourado
  RUST:     "#9B3A1E",   // ferrugem
  RUST2:    "#C4622D",   // ferrugem mais vivo
  BURGUNDY: "#6B1A2A",   // bordô escuro
  GOLD:     "#B8941A",   // ouro desbotado
  GOLD2:    "#D4A820",   // ouro mais brilhante
  BROWN:    "#1C0F08",   // marrom escuro (texto)
  BROWN2:   "#2C1810",   // marrom médio
  WARM:     "#4A2C1A",   // marrom quente
  IVORY:    "#FFF8E8",   // marfim quase branco
} as const;

// ─── FONTES VINTAGE ────────────────────────────────────────────────────────────
const BEBAS     = "'Bebas Neue', Impact, 'Arial Narrow', sans-serif";
const PLAYFAIR  = "'Playfair Display', Georgia, serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

// ─── SAFE ZONES ────────────────────────────────────────────────────────────────
const PAD_X       = 72;
const PAD_TOP     = 160;
const SAFE_BOTTOM = 1280;

// ─── PRIMITIVAS DE ANIMAÇÃO ───────────────────────────────────────────────────
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
  dir: "left" | "right" | "top" | "bottom",
  distance = 60,
  dur = 22
): React.CSSProperties => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const pos  = ci(frame, [0, dur], [distance * sign, 0], Easing.out(Easing.cubic));
  const op   = ci(frame, [0, Math.round(dur * 0.55)], [0, 1]);
  const blur = ci(frame, [0, Math.round(dur * 0.45)], [10, 0]);
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px)`,
    filter:    `blur(${blur}px)`,
  };
};

const exitTo = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 1100,
  dur = 16
): React.CSSProperties => {
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  const sign = dir === "right" || dir === "bottom" ? 1 : -1;
  const f    = frame - start;
  const pos  = ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp));
  const op   = ci(f, [Math.round(dur * 0.35), dur], [1, 0]);
  const sc   = ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp));
  const blur = ci(f, [0, dur], [0, 18]);
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px) scale(${sc})`,
    filter:    `blur(${blur}px)`,
  };
};

const mergeStyles = (...styles: React.CSSProperties[]): React.CSSProperties => ({
  opacity:   styles.reduce((a, s) => a * (typeof s.opacity === "number" ? s.opacity : 1), 1),
  transform: styles.map(s => s.transform).filter(Boolean).join(" ") || undefined,
  filter:    styles.map(s => s.filter).filter(Boolean).join(" ") || undefined,
});

// ─── TIMING (frase-exato por whisper: 26 cenas, 1703f = 56.77s) ───────────────
const TIMING: [number, number][] = [
  [0,     131],  // C01 MENTORIA PRONTA  (fala: 0→4.360s)
  [131,    82],  // C02 2 ANOS           (fala: 4.360→6.600s)
  [213,    53],  // C03 ESPERANDO        (fala: 7.100→8.880s)
  [266,   132],  // C04 STATS PROBLEMA   (fala: 8.880→13.280s)
  [398,   126],  // C05 OUTROS LANÇARAM  (fala: 13.280→17.480s)
  [524,   101],  // C06 NÃO É TALENTO    (fala: 17.480→20.860s)
  [625,    44],  // C07 A MÁQUINA        (fala: 20.860→22.280s)
  [669,    28],  // C08 SISTEMA COMPLETO (fala: 22.680→23.540s)
  [697,   172],  // C09 COMPONENTES      (fala: 23.940→25.740s) — FIX4: estende para cobrir gap até C10@869
  [869,    69],  // C10 200+             (fala: 28.580→30.880s)
  [938,    43],  // C11 DA IDEIA À VENDA (fala: 30.880→32.320s)
  [981,    34],  // C12 CONTRATO         (fala: 32.740→33.860s)
  [1015,   39],  // C13 ACOMPANHAMENTO   (fala: 34.140→35.420s)
  [1054,  113],  // C14 R$100K           (fala: 35.840→38.060s) — FIX5: estende até C15@1167
  [1167,   64],  // C15 4 PILARES        (fala: 38.900→40.580s) — FIX5: alinhado com narração 38.9s×30
  [1231,   35],  // C16 PILAR 1          (fala: 41.040→42.200s) — FIX5: alinhado 41.04s×30
  [1266,   28],  // C17 PILAR 2          (fala: 42.200→43.120s) — FIX5: alinhado 42.2s×30
  [1294,   18],  // C18 PILAR 3          (fala: 43.120→43.720s) — FIX5: alinhado 43.12s×30
  [1312,   35],  // C19 PILAR 4          (fala: 43.720→44.900s) — FIX5: alinhado 43.72s×30
  [1347,   37],  // C20 TODOS INTEGRADOS (fala: 44.900→45.800s) — FIX5: alinhado 44.9s×30
  [1384,   49],  // C21 SISTEMA COMPLETO (fala: 46.120→46.820s) — FIX5: alinhado 46.12s×30
  [1433,   38],  // C22 NÃO ESPERE MAIS  (fala: 47.760→48.720s) — FIX5: alinhado 47.76s×30
  [1471,   68],  // C23 O MERCADO        (fala: 49.040→51.320s) — FIX5: alinhado 49.04s×30
  [1521,  115],  // C29 CLIQUE AGORA     (whisper: "Toque"=50.700s → f1521, termina f1636)
  [1636,   67],  // C30 CTA              (visual f1636→f1703)
];
export const TOTAL_FRAMES_MM = 1703;

// ─── GRAIN VINTAGE (película desgastada) ──────────────────────────────────────
const FilmGrain: React.FC<{ strength?: number }> = ({ strength = 0.07 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: strength, pointerEvents: "none", zIndex: 999 }}>
      <svg width="100%" height="100%">
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            seed={Math.floor(frame * 0.9) % 80}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="1.4" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// ─── LIGHT LEAK (vazamento de luz vintage, estilo After Effects) ─────────────
const LightLeak: React.FC<{ frame: number; tint?: "gold" | "rust" }> = ({
  frame,
  tint = "gold",
}) => {
  const isGold = tint === "gold";
  const col1 = isGold ? "212,168,32" : "180,60,20";
  const col2 = isGold ? "180,80,20" : "212,40,10";
  const op1 = interpolate(frame, [0, 6, 20, 34], [0, 0.18, 0.10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op2 = interpolate(frame, [4, 12, 26, 40], [0, 0.14, 0.07, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 35% at 10% 6%, rgba(${col1},0.95) 0%, transparent 70%)`,
          opacity: op1,
          pointerEvents: "none",
          zIndex: 992,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 40% 26% at 90% 94%, rgba(${col2},0.85) 0%, transparent 70%)`,
          opacity: op2,
          pointerEvents: "none",
          zIndex: 992,
        }}
      />
    </>
  );
};

// ─── VINHETA VINTAGE (bordas muito escuras) ───────────────────────────────────
const VintageVignette: React.FC<{ intensity?: number }> = ({ intensity = 0.38 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex: 998,
      background: `radial-gradient(ellipse 85% 90% at 50% 50%, transparent 55%, rgba(28,15,8,${intensity}) 100%)`,
    }}
  />
);

// ─── BACKGROUND VINTAGE ───────────────────────────────────────────────────────
const VintageBg: React.FC<{
  color?: string;
  showTexture?: boolean;
}> = ({ color = V.PAPER, showTexture = true }) => (
  <>
    <AbsoluteFill style={{ background: color }} />
    {showTexture && (
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% 20%, rgba(180,130,60,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 30% 80%, rgba(155,58,30,0.08) 0%, transparent 60%)
          `,
        }}
      />
    )}
  </>
);

// ─── SVG: BORDA ORNAMENTAL VINTAGE ───────────────────────────────────────────
const OrnamentalFrame: React.FC<{
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ color = V.GOLD, opacity = 0.6, style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 10,
      opacity,
      ...style,
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1080 1920"
      preserveAspectRatio="none"
    >
      {/* Borda externa */}
      <rect
        x="28"
        y="28"
        width="1024"
        height="1864"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray="8 4"
        opacity="0.7"
      />
      {/* Borda interna */}
      <rect
        x="44"
        y="44"
        width="992"
        height="1832"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Cantos ornamentais — superior esquerdo */}
      <path
        d="M28,80 L28,28 L80,28"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="square"
        opacity="0.9"
      />
      <path
        d="M44,100 L44,44 L100,44"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
        opacity="0.5"
      />
      <circle cx="28" cy="28" r="5" fill={color} opacity="0.8" />
      {/* Canto superior direito */}
      <path
        d="M1052,80 L1052,28 L1000,28"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="square"
        opacity="0.9"
      />
      <circle cx="1052" cy="28" r="5" fill={color} opacity="0.8" />
      {/* Canto inferior esquerdo */}
      <path
        d="M28,1840 L28,1892 L80,1892"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="square"
        opacity="0.9"
      />
      <circle cx="28" cy="1892" r="5" fill={color} opacity="0.8" />
      {/* Canto inferior direito */}
      <path
        d="M1052,1840 L1052,1892 L1000,1892"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="square"
        opacity="0.9"
      />
      <circle cx="1052" cy="1892" r="5" fill={color} opacity="0.8" />
      {/* Divisória central decorativa */}
      <line x1="120" y1="960" x2="960" y2="960" stroke={color} strokeWidth="0.5" opacity="0.2" />
    </svg>
  </div>
);

// ─── SVG: LINHA ORNAMENTAL HORIZONTAL ────────────────────────────────────────
const OrnamentalLine: React.FC<{
  color?: string;
  y?: number;
  width?: number;
  opacity?: number;
}> = ({ color = V.GOLD, y = 0, width = 600, opacity = 0.7 }) => (
  <svg
    style={{ display: "block" }}
    width={width}
    height="20"
    viewBox={`0 0 ${width} 20`}
  >
    <line
      x1="0"
      y1="10"
      x2={width}
      y2="10"
      stroke={color}
      strokeWidth="1"
      opacity={opacity * 0.4}
    />
    <line
      x1={width * 0.15}
      y1="10"
      x2={width * 0.85}
      y2="10"
      stroke={color}
      strokeWidth="2"
      opacity={opacity}
    />
    <circle cx={width / 2} cy="10" r="4" fill={color} opacity={opacity} />
    <circle cx={width * 0.15} cy="10" r="2" fill={color} opacity={opacity * 0.8} />
    <circle cx={width * 0.85} cy="10" r="2" fill={color} opacity={opacity * 0.8} />
    <path
      d={`M${width * 0.15},10 L${width * 0.15 + 12},6 L${width * 0.15 + 12},14 Z`}
      fill={color}
      opacity={opacity * 0.6}
    />
    <path
      d={`M${width * 0.85},10 L${width * 0.85 - 12},6 L${width * 0.85 - 12},14 Z`}
      fill={color}
      opacity={opacity * 0.6}
    />
  </svg>
);

// ─── SVG: SELO CIRCULAR VINTAGE ───────────────────────────────────────────────
const VintageSeal: React.FC<{
  text?: string;
  color?: string;
  size?: number;
  opacity?: number;
}> = ({ text = "MAGNA", color = V.GOLD, size = 180, opacity = 0.25 }) => (
  <svg width={size} height={size} viewBox="0 0 180 180" style={{ opacity }}>
    <circle cx="90" cy="90" r="84" fill="none" stroke={color} strokeWidth="2" />
    <circle cx="90" cy="90" r="76" fill="none" stroke={color} strokeWidth="0.8" />
    <circle cx="90" cy="90" r="68" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
    {/* Texto circular */}
    <defs>
      <path id="textCircle" d="M 90,90 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" />
    </defs>
    <text
      fontFamily={BEBAS}
      fontSize="13"
      fill={color}
      letterSpacing="8"
    >
      <textPath href="#textCircle">{text} · MENTORIA · ÉLITE ·</textPath>
    </text>
    {/* Estrelas */}
    {[0, 60, 120, 180, 240, 300].map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const x = 90 + 72 * Math.cos(rad);
      const y = 90 + 72 * Math.sin(rad);
      return <circle key={deg} cx={x} cy={y} r="2.5" fill={color} />;
    })}
  </svg>
);

// ─── ILUSTRAÇÕES SVG VINTAGE (imagens por cena) ───────────────────────────────

const SVGScroll: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=240,color=V.SEPIA,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{opacity:op}}>
      <rect x="20" y="15" width="80" height="90" rx="6" fill="none" stroke={color} strokeWidth="2"/>
      <ellipse cx="60" cy="15" rx="40" ry="10" fill="none" stroke={color} strokeWidth="2"/>
      <ellipse cx="60" cy="105" rx="40" ry="10" fill="none" stroke={color} strokeWidth="2"/>
      <ellipse cx="60" cy="15" rx="20" ry="5" fill={color} fillOpacity="0.1"/>
      <line x1="32" y1="38" x2="88" y2="38" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <line x1="32" y1="50" x2="88" y2="50" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <line x1="32" y1="62" x2="80" y2="62" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <line x1="32" y1="74" x2="84" y2="74" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <line x1="32" y1="86" x2="76" y2="86" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="60" cy="62" r="14" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 2" opacity="0.4"/>
    </svg>
  );
};

const SVGHourglass: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=240,color=V.SEPIA,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const sandY = ci(frame,[4,22],[0,1]);
  return (
    <svg width={size} height={size} viewBox="0 0 100 120" style={{opacity:op}}>
      <path d="M10,5 L90,5 L60,60 L90,115 L10,115 L40,60 Z" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
      <rect x="8" y="3" width="84" height="12" rx="3" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="8" y="105" width="84" height="12" rx="3" fill="none" stroke={color} strokeWidth="2"/>
      <polygon points="10,5 90,5 60,60 40,60" fill={color} fillOpacity="0.12"/>
      <polygon points={`40,115 60,115 ${55+sandY*15},${115-sandY*30} ${45-sandY*15},${115-sandY*30}`} fill={color} fillOpacity="0.18"/>
      <line x1="50" y1="60" x2="50" y2="85" stroke={color} strokeWidth="2" strokeDasharray="3 2" opacity="0.5"/>
      <line x1="20" y1="20" x2="55" y2="55" stroke={color} strokeWidth="0.8" opacity="0.2"/>
      <line x1="30" y1="15" x2="60" y2="55" stroke={color} strokeWidth="0.8" opacity="0.2"/>
      <line x1="40" y1="12" x2="65" y2="55" stroke={color} strokeWidth="0.8" opacity="0.2"/>
    </svg>
  );
};

const SVGBarChart: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=260,color=V.RUST,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const h1 = ci(frame,[6,20],[0,90]);
  const h2 = ci(frame,[10,24],[0,55]);
  const h3 = ci(frame,[14,28],[0,70]);
  return (
    <svg width={size} height={size*0.85} viewBox="0 0 120 100" style={{opacity:op}}>
      <line x1="10" y1="95" x2="110" y2="95" stroke={color} strokeWidth="2"/>
      <line x1="10" y1="95" x2="10" y2="5" stroke={color} strokeWidth="2"/>
      <rect x="20" y={95-h1} width="20" height={h1} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
      <rect x="50" y={95-h2} width="20" height={h2} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
      <rect x="80" y={95-h3} width="20" height={h3} fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5"/>
      <line x1="20" y1={95-h1} x2="40" y2={95-h1} stroke={color} strokeWidth="3" opacity="0.8"/>
      <line x1="8" y1="45" x2="110" y2="45" stroke={color} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.3"/>
      <line x1="8" y1="70" x2="110" y2="70" stroke={color} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.3"/>
    </svg>
  );
};

const SVGRocket: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=260,color=V.GOLD,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const lift = ci(frame,[8,28],[0,20],Easing.out(Easing.quad));
  return (
    <svg width={size} height={size*1.2} viewBox="0 0 80 100" style={{opacity:op, transform:`translateY(${-lift}px)`}}>
      <path d="M40,10 Q55,30 55,60 L40,70 L25,60 Q25,30 40,10 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M25,60 L15,80 L35,65" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M55,60 L65,80 L45,65" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="40" cy="40" r="8" fill="none" stroke={color} strokeWidth="1.8"/>
      <circle cx="40" cy="40" r="4" fill={color} fillOpacity="0.2"/>
      <path d="M32,70 Q40,90 48,70" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6"/>
      <path d="M35,72 Q40,96 45,72" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 2" opacity="0.4"/>
      <line x1="5" y1="50" x2="18" y2="50" stroke={color} strokeWidth="1" opacity="0.4" strokeDasharray="5 2"/>
    </svg>
  );
};

const SVGGears: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=280,color=V.BROWN2,opacity=0.15}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const rot = frame * 3;
  const teeth1 = [0,45,90,135,180,225,270,315];
  const teeth2 = [0,45,90,135,180,225,270,315];
  return (
    <svg width={size} height={size*0.85} viewBox="0 0 120 100" style={{opacity:op}}>
      <g transform={`rotate(${rot}, 38, 50)`}>
        <circle cx="38" cy="50" r="28" fill="none" stroke={color} strokeWidth="2"/>
        <circle cx="38" cy="50" r="18" fill="none" stroke={color} strokeWidth="1.5"/>
        <circle cx="38" cy="50" r="6" fill={color} fillOpacity="0.3"/>
        {teeth1.map((deg,i) => {
          const rad = deg * Math.PI / 180;
          return <line key={i} x1={38+28*Math.cos(rad)} y1={50+28*Math.sin(rad)} x2={38+36*Math.cos(rad)} y2={50+36*Math.sin(rad)} stroke={color} strokeWidth="4" strokeLinecap="round"/>;
        })}
      </g>
      <g transform={`rotate(${-rot*1.5}, 82, 42)`}>
        <circle cx="82" cy="42" r="20" fill="none" stroke={color} strokeWidth="2"/>
        <circle cx="82" cy="42" r="12" fill="none" stroke={color} strokeWidth="1.5"/>
        <circle cx="82" cy="42" r="5" fill={color} fillOpacity="0.3"/>
        {teeth2.map((deg,i) => {
          const rad = deg * Math.PI / 180;
          return <line key={i} x1={82+20*Math.cos(rad)} y1={42+20*Math.sin(rad)} x2={82+27*Math.cos(rad)} y2={42+27*Math.sin(rad)} stroke={color} strokeWidth="3.5" strokeLinecap="round"/>;
        })}
      </g>
    </svg>
  );
};

const SVGThreePillars: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=280,color=V.BROWN2,opacity=0.16}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  return (
    <svg width={size} height={size*0.75} viewBox="0 0 120 90" style={{opacity:op}}>
      <rect x="5" y="82" width="110" height="5" fill={color} fillOpacity="0.4" rx="1"/>
      <rect x="15" y="15" width="22" height="67" fill="none" stroke={color} strokeWidth="1.8"/>
      <rect x="13" y="8" width="26" height="8" fill={color} fillOpacity="0.3" rx="1"/>
      <rect x="49" y="5" width="22" height="77" fill="none" stroke={color} strokeWidth="1.8"/>
      <rect x="47" y="-2" width="26" height="8" fill={color} fillOpacity="0.5" rx="1"/>
      <rect x="83" y="15" width="22" height="67" fill="none" stroke={color} strokeWidth="1.8"/>
      <rect x="81" y="8" width="26" height="8" fill={color} fillOpacity="0.3" rx="1"/>
    </svg>
  );
};

const SVGTrophy: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=260,color=V.GOLD,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const glow = ci(frame,[15,35],[0,1],Easing.inOut(Easing.cubic));
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" style={{opacity:op}}>
      <path d="M25,10 Q20,55 40,65 L60,65 Q80,55 75,10 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M25,20 Q10,25 12,45 Q14,55 30,50" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M75,20 Q90,25 88,45 Q86,55 70,50" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <rect x="44" y="65" width="12" height="20" fill="none" stroke={color} strokeWidth="1.5"/>
      <rect x="30" y="85" width="40" height="8" rx="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2"/>
      <polygon points="50,22 52,30 60,30 54,36 56,44 50,40 44,44 46,36 40,30 48,30" fill={color} fillOpacity={0.2+glow*0.2} stroke={color} strokeWidth="1"/>
    </svg>
  );
};

const SVGArrowPath: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=280,color=V.RUST,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const progress = ci(frame,[8,30],[0,1]);
  return (
    <svg width={size} height={size*0.6} viewBox="0 0 120 70" style={{opacity:op}}>
      <path d="M15,35 Q15,18 28,15 Q42,12 42,28 Q42,38 35,42 L35,48 L22,48 L22,42 Q15,38 15,35 Z" fill="none" stroke={color} strokeWidth="1.8"/>
      <line x1="22" y1="48" x2="35" y2="48" stroke={color} strokeWidth="2.5"/>
      <line x1="24" y1="52" x2="33" y2="52" stroke={color} strokeWidth="2"/>
      <path d="M42,35 Q65,20 80,35 Q95,50 105,35" fill="none" stroke={color} strokeWidth="2" strokeDasharray={`${progress*80} 200`} strokeLinecap="round"/>
      <polygon points="102,28 110,35 102,42" fill={color} fillOpacity={progress*0.8} stroke={color} strokeWidth="1.5"/>
      <circle cx="108" cy="55" r="10" fill="none" stroke={color} strokeWidth="1.5" opacity={progress}/>
      <text x="108" y="59" textAnchor="middle" fontFamily={BEBAS} fontSize="10" fill={color} opacity={progress}>$</text>
    </svg>
  );
};

const SVGHandshake: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=280,color=V.SEPIA,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  return (
    <svg width={size} height={size*0.7} viewBox="0 0 120 80" style={{opacity:op}}>
      <path d="M5,60 L5,40 Q5,30 15,30 L40,30 Q45,30 45,40 L45,50" fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M20,30 L20,15 Q20,10 24,10 Q28,10 28,15 L28,30" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M30,30 L30,12 Q30,7 34,7 Q38,7 38,12 L38,30" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M10,30 L10,20 Q10,15 14,15 Q18,15 18,20 L18,30" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <rect x="38" y="38" width="44" height="18" rx="9" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M115,60 L115,40 Q115,30 105,30 L80,30 Q75,30 75,40 L75,50" fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M100,30 L100,15 Q100,10 96,10 Q92,10 92,15 L92,30" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M90,30 L90,12 Q90,7 86,7 Q82,7 82,12 L82,30" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M110,30 L110,20 Q110,15 106,15 Q102,15 102,20 L102,30" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

const SVGCalendar: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=260,color=V.SEPIA,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const colLines = [0,1,2,3,4,5,6];
  const rowLines = [0,1,2,3];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{opacity:op}}>
      <rect x="10" y="15" width="80" height="75" rx="4" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="10" y="15" width="80" height="18" rx="4" fill={color} fillOpacity="0.18"/>
      <line x1="10" y1="33" x2="90" y2="33" stroke={color} strokeWidth="1.5"/>
      <rect x="28" y="10" width="8" height="14" rx="4" fill="none" stroke={color} strokeWidth="1.8"/>
      <rect x="64" y="10" width="8" height="14" rx="4" fill="none" stroke={color} strokeWidth="1.8"/>
      {colLines.map(col => (
        <line key={col} x1={15+col*11} y1="33" x2={15+col*11} y2="90" stroke={color} strokeWidth="0.7" opacity="0.3"/>
      ))}
      {rowLines.map(row => (
        <line key={row} x1="10" y1={44+row*12} x2="90" y2={44+row*12} stroke={color} strokeWidth="0.7" opacity="0.3"/>
      ))}
      <circle cx="48" cy="56" r="6" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1"/>
      <path d="M44,56 L47,59 L52,53" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const SVGCoins: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=260,color=V.GOLD,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const stack1 = [0,1,2,3,4,5];
  const stack2 = [0,1,2,3,4,5,6,7];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{opacity:op}}>
      {stack1.map(i => (
        <ellipse key={i} cx="30" cy={82-i*6} rx="18" ry="5" fill="none" stroke={color} strokeWidth="1.8"/>
      ))}
      <ellipse cx="30" cy="52" rx="18" ry="5" fill={color} fillOpacity="0.25"/>
      <line x1="12" y1="52" x2="12" y2="82" stroke={color} strokeWidth="1.8"/>
      <line x1="48" y1="52" x2="48" y2="82" stroke={color} strokeWidth="1.8"/>
      {stack2.map(i => (
        <ellipse key={i} cx="65" cy={85-i*6} rx="18" ry="5" fill="none" stroke={color} strokeWidth="1.8"/>
      ))}
      <ellipse cx="65" cy="43" rx="18" ry="5" fill={color} fillOpacity="0.25"/>
      <line x1="47" y1="43" x2="47" y2="85" stroke={color} strokeWidth="1.8"/>
      <line x1="83" y1="43" x2="83" y2="85" stroke={color} strokeWidth="1.8"/>
      <line x1="8" y1="90" x2="88" y2="90" stroke={color} strokeWidth="2" opacity="0.5"/>
    </svg>
  );
};

const SVGFourColumns: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=280,color=V.BROWN2,opacity=0.15}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const colData = [72,68,75,70];
  return (
    <svg width={size} height={size*0.75} viewBox="0 0 120 90" style={{opacity:op}}>
      <rect x="5" y="82" width="110" height="5" fill={color} fillOpacity="0.4" rx="1"/>
      {colData.map((h,i) => {
        const x = 14 + i*27;
        return (
          <g key={i}>
            <rect x={x} y={90-h} width="16" height={h} fill="none" stroke={color} strokeWidth="1.8"/>
            <rect x={x-2} y={90-h-7} width="20" height="7" fill={color} fillOpacity="0.25" rx="1"/>
          </g>
        );
      })}
    </svg>
  );
};

const SVGColumn: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=200,color=V.SEPIA,opacity=0.2}) => {
  const op = ci(frame,[8,24],[0,opacity]);
  const flutes = [0,1,2,3,4];
  return (
    <svg width={size} height={size*1.2} viewBox="0 0 60 80" style={{opacity:op}}>
      <rect x="2" y="4" width="56" height="8" rx="1" fill={color} fillOpacity="0.3"/>
      <rect x="8" y="10" width="44" height="4" rx="1" fill="none" stroke={color} strokeWidth="1.5"/>
      <rect x="15" y="14" width="30" height="52" fill="none" stroke={color} strokeWidth="2"/>
      {flutes.map(i => (
        <line key={i} x1={18+i*6} y1="14" x2={18+i*6} y2="66" stroke={color} strokeWidth="0.8" opacity="0.25"/>
      ))}
      <rect x="8" y="66" width="44" height="4" rx="1" fill="none" stroke={color} strokeWidth="1.5"/>
      <rect x="3" y="70" width="54" height="7" rx="1" fill={color} fillOpacity="0.25"/>
    </svg>
  );
};

const SVGCircleArrows: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=260,color=V.BROWN2,opacity=0.16}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const rot = frame * 2;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{opacity:op}}>
      <g transform={`rotate(${rot}, 50, 50)`}>
        <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="2" strokeDasharray="60 20"/>
        <polygon points="50,12 58,22 42,22" fill={color} opacity="0.7"/>
        <polygon points="88,50 78,42 78,58" fill={color} opacity="0.7"/>
        <polygon points="50,88 42,78 58,78" fill={color} opacity="0.7"/>
        <polygon points="12,50 22,58 22,42" fill={color} opacity="0.7"/>
      </g>
      <circle cx="50" cy="50" r="22" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="50" cy="50" r="8" fill={color} fillOpacity="0.2"/>
    </svg>
  );
};

const SVGClock: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=160,color=V.RUST,opacity=0.2}) => {
  const op = ci(frame,[4,16],[0,opacity]);
  const minAngle = (frame * 6) % 360;
  const hrAngle  = (frame * 0.5) % 360;
  const ticks = [0,30,60,90,120,150,180,210,240,270,300,330];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{opacity:op}}>
      <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="1"/>
      {ticks.map(deg => {
        const rad = deg * Math.PI/180;
        const isHour = deg % 90 === 0;
        const r1 = isHour ? 32 : 35;
        return <line key={deg} x1={50+r1*Math.sin(rad)} y1={50-r1*Math.cos(rad)} x2={50+38*Math.sin(rad)} y2={50-38*Math.cos(rad)} stroke={color} strokeWidth={isHour?2.5:1.2} strokeLinecap="round"/>;
      })}
      <line x1="50" y1="50" x2={50+30*Math.sin(minAngle*Math.PI/180)} y2={50-30*Math.cos(minAngle*Math.PI/180)} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="50" y1="50" x2={50+20*Math.sin(hrAngle*Math.PI/180)} y2={50-20*Math.cos(hrAngle*Math.PI/180)} stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="3.5" fill={color}/>
    </svg>
  );
};

const SVGCursor: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=260,color=V.IVORY,opacity=0.2}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const click = ci(frame,[8,22],[1,0.85],Easing.inOut(Easing.cubic));
  const ring1 = ci(frame,[10,28],[0.8,0]);
  const ring2 = ci(frame,[14,30],[0.5,0]);
  const ring3 = ci(frame,[18,32],[0.3,0]);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{opacity:op, transform:`scale(${click})`}}>
      <polygon points="20,10 20,70 38,55 52,85 62,80 48,52 68,52" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="52" cy="62" r="20" fill="none" stroke={color} strokeWidth="1.5" opacity={ring1}/>
      <circle cx="52" cy="62" r="30" fill="none" stroke={color} strokeWidth="1" opacity={ring2}/>
      <circle cx="52" cy="62" r="40" fill="none" stroke={color} strokeWidth="0.8" opacity={ring3}/>
    </svg>
  );
};

const SVGStar: React.FC<{frame:number;size?:number;color?:string;opacity?:number}> =
({frame,size=280,color=V.GOLD,opacity=0.18}) => {
  const op = ci(frame,[10,28],[0,opacity]);
  const rays = ci(frame,[8,30],[0,1],Easing.out(Easing.cubic));
  const rayDegrees = [0,30,60,90,120,150,180,210,240,270,300,330];
  return (
    <svg width={size} height={size*0.9} viewBox="0 0 120 110" style={{opacity:op}}>
      <circle cx="60" cy="55" r="22" fill="none" stroke={color} strokeWidth="2.5"/>
      <circle cx="60" cy="55" r="16" fill={color} fillOpacity="0.15"/>
      {rayDegrees.map((deg) => {
        const rad = deg * Math.PI/180;
        const isMain = deg % 90 === 0;
        const rEnd = isMain ? 44 : 34;
        const x1 = 60 + 23*Math.cos(rad); const y1 = 55 + 23*Math.sin(rad);
        const x2 = 60 + rEnd*Math.cos(rad)*rays; const y2 = 55 + rEnd*Math.sin(rad)*rays;
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={isMain?3:1.5} strokeLinecap="round" opacity={isMain?0.9:0.6}/>;
      })}
      <line x1="5" y1="85" x2="115" y2="85" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    </svg>
  );
};

// ─── ANIMAÇÃO PALAVRA POR PALAVRA ─────────────────────────────────────────────
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
  text,
  frame,
  startDelay = 0,
  stagger = 4,
  style,
  wordStyle,
  dir = "bottom",
  distance = 40,
  dur = 20,
}) => {
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.18em",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const f = frame - startDelay - i * stagger;
        const entry = entryFrom(Math.max(0, f), dir, distance, dur);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              ...entry,
              ...wordStyle,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ─── ANIMAÇÃO LETRA POR LETRA ─────────────────────────────────────────────────
interface LetterByLetterProps {
  text: string;
  frame: number;
  startDelay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  letterStyle?: React.CSSProperties;
}

const LetterByLetter: React.FC<LetterByLetterProps> = ({
  text,
  frame,
  startDelay = 0,
  stagger = 2,
  style,
  letterStyle,
}) => {
  const chars = text.split("");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        ...style,
      }}
    >
      {chars.map((char, i) => {
        const f = frame - startDelay - i * stagger;
        const op  = ci(Math.max(0, f), [0, 14], [0, 1]);
        const blur = ci(Math.max(0, f), [0, 8], [8, 0]);
        const translateY = ci(Math.max(0, f), [0, 14], [20, 0], Easing.out(Easing.cubic));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: op,
              filter: `blur(${blur}px)`,
              transform: `translateY(${translateY}px)`,
              ...(char === " " ? { width: "0.4em" } : {}),
              ...letterStyle,
            }}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
    </div>
  );
};

// ─── COMPONENTE: NÚMERO GRANDE VINTAGE ───────────────────────────────────────
const BigNumber: React.FC<{
  value: string;
  frame: number;
  color?: string;
  size?: number;
}> = ({ value, frame, color = V.RUST, size = 220 }) => {
  const op   = ci(frame, [0, 18], [0, 1], Easing.out(Easing.cubic));
  const sc   = ci(frame, [0, 22], [0.6, 1], Easing.out(Easing.back(1.5)));
  const blur = ci(frame, [0, 12], [16, 0]);
  // count-up: extrai número, anima de 0 até o alvo em 22 frames
  const numMatch = value.match(/(\d+)/);
  const targetNum = numMatch ? parseInt(numMatch[1]) : null;
  const countProgress = ci(frame, [0, 22], [0, 1], Easing.out(Easing.cubic));
  const currentNum = targetNum !== null ? Math.round(targetNum * countProgress) : null;
  const displayValue = currentNum !== null
    ? value.replace(/\d+/, String(currentNum))
    : value;
  return (
    <div
      style={{
        fontFamily: BEBAS,
        fontSize: size,
        lineHeight: 1,
        color,
        opacity: op,
        filter: `blur(${blur}px)`,
        transform: `scale(${sc})`,
        textAlign: "center",
        letterSpacing: "-0.02em",
        textShadow: `0 4px 40px ${color}55, 0 0 80px ${color}22`,
      }}
    >
      {displayValue}
    </div>
  );
};

// ─── CENA GENÉRICA COM LAYOUT VINTAGE ────────────────────────────────────────
const VintageScene: React.FC<{
  frame: number;
  duration: number;
  bg?: string;
  entryDir?: "left" | "right" | "top" | "bottom";
  exitDir?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
  showFrame?: boolean;
  frameColor?: string;
  leakTint?: "gold" | "rust";
  vignetteIntensity?: number;
}> = ({
  frame,
  duration,
  bg = V.PAPER,
  entryDir = "left",
  exitDir = "right",
  children,
  showFrame = true,
  frameColor = V.GOLD,
  leakTint = "gold",
  vignetteIntensity = 0.38,
}) => {
  const exitStart = duration - 18;
  const sceneEntry = entryFrom(frame, entryDir, 30, 24);
  const sceneExit  = exitTo(frame, exitStart, exitDir, 1100, 16);
  const merged     = mergeStyles(sceneEntry, sceneExit);

  // Ken Burns: slow push-in no background (0 → duration), escala 1.0 → 1.025
  const kbScale = ci(frame, [0, Math.max(1, duration - 18)], [1.0, 1.025], Easing.inOut(Easing.quad));

  return (
    <AbsoluteFill>
      {/* Background com Ken Burns sutil */}
      <AbsoluteFill
        style={{
          transform: `scale(${kbScale})`,
          transformOrigin: "50% 50%",
        }}
      >
        <VintageBg color={bg} />
      </AbsoluteFill>

      {/* Conteúdo da cena com entrada/saída */}
      <AbsoluteFill style={{ ...merged }}>
        {children}
      </AbsoluteFill>

      {/* Borda ornamental */}
      {showFrame && <OrnamentalFrame color={frameColor} opacity={0.5} />}

      {/* Color grade cinematográfico (quente, profundo) */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(180,100,20,0.04) 0%, rgba(40,10,5,0.10) 100%)",
          pointerEvents: "none",
          zIndex: 995,
        }}
      />

      {/* Light leak vintage */}
      <LightLeak frame={frame} tint={leakTint} />

      {/* Vinheta escura nas bordas */}
      <VintageVignette intensity={vignetteIntensity} />

      {/* Grain de película */}
      <FilmGrain strength={0.09} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CENAS INDIVIDUAIS
// ═══════════════════════════════════════════════════════════════════════════════

// C01 — MENTORIA PRONTA (letra a letra, impacto máximo)
const C01_MentoriaProta: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER} entryDir="bottom" exitDir="top">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <div style={{ opacity: ci(frame, [6, 20], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={500} opacity={0.8} />
      </div>
      <LetterByLetter
        text="SUA MENTORIA"
        frame={frame}
        startDelay={4}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 130,
          lineHeight: 0.9,
          color: V.BROWN,
          letterSpacing: "0.04em",
        }}
      />
      <WordByWord
        text="já está pronta"
        frame={frame}
        startDelay={10}
        stagger={2}
        wordStyle={{
          fontFamily: CORMORANT,
          fontSize: 68,
          fontStyle: "italic",
          color: V.RUST,
          letterSpacing: "0.02em",
        }}
      />
      <div style={{ opacity: ci(frame, [30, 42], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={500} opacity={0.8} />
      </div>
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        bottom: 80,
        right: 100,
        opacity: ci(frame, [20, 35], [0, 1]),
      }}
    >
      <VintageSeal text="MAGNA" size={160} color={V.GOLD} opacity={0.3} />
    </div>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGScroll frame={frame} size={140} color={V.SEPIA} opacity={0.15}/>
    </div>
  </VintageScene>
);

// C02 — 2 ANOS (número impacto)
const C02_DoisAnos: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER2} entryDir="right" exitDir="left">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <BigNumber value="2" frame={frame} color={V.RUST} size={280} />
      <WordByWord
        text="ANOS NO PAPEL"
        frame={frame}
        startDelay={5}
        stagger={2}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 96,
          color: V.BROWN,
          letterSpacing: "0.06em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGHourglass frame={frame} size={140} color={V.RUST} opacity={0.15}/>
    </div>
  </VintageScene>
);

// C03 — ESPERANDO
const C03_Esperando: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.CREAM} entryDir="left" exitDir="right">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <WordByWord
        text="ESPERANDO"
        frame={frame}
        startDelay={2}
        stagger={3}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 148,
          color: V.BURGUNDY,
          letterSpacing: "0.08em",
        }}
      />
      <div style={{ opacity: ci(frame, [12, 22], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={420} />
      </div>
      <WordByWord
        text="o momento certo"
        frame={frame}
        startDelay={10}
        stagger={2}
        wordStyle={{
          fontFamily: CORMORANT,
          fontSize: 62,
          fontStyle: "italic",
          color: V.WARM,
          letterSpacing: "0.02em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGHourglass frame={frame} size={130} color={V.BURGUNDY} opacity={0.15}/>
    </div>
  </VintageScene>
);

// C04 — STATS PROBLEMA
const C04_Stats: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER} entryDir="bottom" exitDir="top" vignetteIntensity={0.50}>
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <BigNumber value="73%" frame={frame} color={V.RUST} size={200} />
      <div style={{ opacity: ci(frame, [14, 24], [0, 1]) }}>
        <OrnamentalLine color={V.RUST2} width={380} />
      </div>
      <WordByWord
        text="nunca lançam"
        frame={frame}
        startDelay={10}
        stagger={2}
        wordStyle={{
          fontFamily: CORMORANT,
          fontSize: 74,
          fontStyle: "italic",
          color: V.BURGUNDY,
          letterSpacing: "0.02em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGBarChart frame={frame} size={140} color={V.RUST} opacity={0.15}/>
    </div>
  </VintageScene>
);

// C05 — OUTROS LANÇARAM
const C05_OutrosLancaram: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER2} entryDir="right" exitDir="left">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <WordByWord
        text="OUTROS"
        frame={frame}
        startDelay={2}
        stagger={3}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 180,
          color: V.GOLD,
          letterSpacing: "0.06em",
        }}
      />
      <WordByWord
        text="LANÇARAM"
        frame={frame}
        startDelay={8}
        stagger={3}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 180,
          color: V.BROWN,
          letterSpacing: "0.06em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGRocket frame={frame} size={140} color={V.GOLD} opacity={0.18}/>
    </div>
  </VintageScene>
);

// C06 — NÃO É TALENTO
const C06_NaoTalento: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.CREAM} entryDir="left" exitDir="right">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <WordByWord
        text="NÃO É"
        frame={frame}
        startDelay={2}
        stagger={5}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 120,
          color: V.BROWN2,
          letterSpacing: "0.06em",
        }}
      />
      <LetterByLetter
        text="TALENTO"
        frame={frame}
        startDelay={12}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 160,
          color: V.RUST,
          letterSpacing: "0.1em",
        }}
      />
      <WordByWord
        text="é estrutura"
        frame={frame}
        startDelay={28}
        stagger={5}
        wordStyle={{
          fontFamily: CORMORANT,
          fontSize: 60,
          fontStyle: "italic",
          color: V.WARM,
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGGears frame={frame} size={140} color={V.SEPIA} opacity={0.16}/>
    </div>
  </VintageScene>
);

// C07 — A MÁQUINA JÁ EXISTE
const C07_Maquina: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER} entryDir="bottom" exitDir="top">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <div style={{ opacity: ci(frame, [0, 14], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={560} />
      </div>
      <LetterByLetter
        text="A MÁQUINA"
        frame={frame}
        startDelay={4}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 140,
          color: V.BROWN,
          letterSpacing: "0.05em",
          textShadow: `0 0 40px rgba(184,148,26,0.55), 0 4px 12px rgba(28,15,8,0.5)`,
        }}
      />
      <WordByWord
        text="FOI ATIVADA"
        frame={frame}
        startDelay={24}
        stagger={6}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 120,
          color: V.RUST,
          letterSpacing: "0.06em",
          textShadow: `0 0 36px rgba(155,58,30,0.60), 0 4px 14px rgba(28,15,8,0.6)`,
        }}
      />
      <div style={{ opacity: ci(frame, [32, 42], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={560} />
      </div>
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGGears frame={frame} size={150} color={V.GOLD} opacity={0.18}/>
    </div>
  </VintageScene>
);

// C08 — SISTEMA COMPLETO
const C08_Sistema: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER2} entryDir="right" exitDir="left">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <WordByWord
        text="SISTEMA"
        frame={frame}
        startDelay={2}
        stagger={3}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 170,
          color: V.GOLD,
          letterSpacing: "0.06em",
        }}
      />
      <WordByWord
        text="COMPLETO"
        frame={frame}
        startDelay={10}
        stagger={3}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 130,
          color: V.BROWN,
          letterSpacing: "0.06em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGGears frame={frame} size={140} color={V.SEPIA} opacity={0.16}/>
    </div>
  </VintageScene>
);

// C09 — COMPONENTES (conteúdo, venda, entrega)
const C09_Componentes: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.CREAM} entryDir="left" exitDir="right">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      {[
        { word: "CONTEÚDO", delay: 2, color: V.BROWN },
        { word: "VENDA", delay: 10, color: V.RUST },
        { word: "ENTREGA", delay: 18, color: V.GOLD },
      ].map(({ word, delay, color }) => (
        <div
          key={word}
          style={{
            ...entryFrom(Math.max(0, frame - delay), "left", 80, 18),
            fontFamily: BEBAS,
            fontSize: 110,
            color,
            letterSpacing: "0.08em",
          }}
        >
          {word}
        </div>
      ))}
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGThreePillars frame={frame} size={140} color={V.SEPIA} opacity={0.16}/>
    </div>
  </VintageScene>
);

// C10 — 200+ ALUNOS
const C10_Duzentos: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER} entryDir="bottom" exitDir="top" vignetteIntensity={0.50}>
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <BigNumber value="200+" frame={frame} color={V.GOLD} size={200} />
      <div style={{ opacity: ci(frame, [12, 22], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={400} />
      </div>
      <WordByWord
        text="ALUNOS TRANSFORMADOS"
        frame={frame}
        startDelay={16}
        stagger={4}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 80,
          color: V.BROWN,
          letterSpacing: "0.04em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGTrophy frame={frame} size={140} color={V.GOLD} opacity={0.18}/>
    </div>
  </VintageScene>
);

// C11 — DA IDEIA À VENDA
const C11_IdeiaVenda: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER2} entryDir="right" exitDir="left">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <WordByWord
        text="DA IDEIA"
        frame={frame}
        startDelay={2}
        stagger={5}
        wordStyle={{
          fontFamily: PLAYFAIR,
          fontSize: 96,
          fontStyle: "italic",
          color: V.WARM,
          letterSpacing: "0.02em",
        }}
      />
      <div style={{ opacity: ci(frame, [14, 24], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={300} />
      </div>
      <WordByWord
        text="À VENDA"
        frame={frame}
        startDelay={18}
        stagger={6}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 160,
          color: V.RUST,
          letterSpacing: "0.06em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGArrowPath frame={frame} size={140} color={V.RUST} opacity={0.16}/>
    </div>
  </VintageScene>
);

// C12 — CONTRATO (vermelho, impacto)
const C12_Contrato: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene
    frame={frame}
    duration={duration}
    bg={V.BURGUNDY}
    entryDir="left"
    exitDir="right"
    frameColor={V.GOLD2}
    leakTint="rust"
  >
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <div style={{ opacity: ci(frame, [2, 16], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD2} width={540} opacity={0.9} />
      </div>
      <LetterByLetter
        text="CONTRATO"
        frame={frame}
        startDelay={4}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 150,
          color: V.IVORY,
          letterSpacing: "0.1em",
          textShadow: `0 0 48px rgba(255,248,232,0.55), 0 6px 18px rgba(28,15,8,0.7)`,
        }}
      />
      <WordByWord
        text="ASSINADO"
        frame={frame}
        startDelay={24}
        stagger={5}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 110,
          color: V.GOLD2,
          letterSpacing: "0.08em",
          textShadow: `0 0 40px rgba(212,168,32,0.65), 0 4px 14px rgba(28,15,8,0.6)`,
        }}
      />
      <div style={{ opacity: ci(frame, [38, 50], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD2} width={540} opacity={0.9} />
      </div>
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 80,
        opacity: ci(frame, [20, 36], [0, 1]),
      }}
    >
      <VintageSeal text="ASSINADO" size={150} color={V.GOLD2} opacity={0.35} />
    </div>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGHandshake frame={frame} size={130} color={V.GOLD2} opacity={0.18}/>
    </div>
  </VintageScene>
);

// C13 — ACOMPANHAMENTO
const C13_Acomp: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER} entryDir="bottom" exitDir="top">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <WordByWord
        text="ACOMPANHAMENTO"
        frame={frame}
        startDelay={2}
        stagger={2}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 104,
          color: V.BROWN,
          letterSpacing: "0.04em",
        }}
      />
      <div style={{ opacity: ci(frame, [16, 26], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={480} />
      </div>
      <WordByWord
        text="SEMANAL"
        frame={frame}
        startDelay={18}
        stagger={3}
        wordStyle={{
          fontFamily: PLAYFAIR,
          fontSize: 88,
          fontStyle: "italic",
          color: V.SEPIA,
          letterSpacing: "0.04em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGCalendar frame={frame} size={130} color={V.SEPIA} opacity={0.16}/>
    </div>
  </VintageScene>
);

// C14 — R$100K (número de impacto máximo)
const C14_R100k: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.CREAM} entryDir="top" exitDir="bottom">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <WordByWord
        text="ATÉ"
        frame={frame}
        startDelay={2}
        stagger={3}
        wordStyle={{
          fontFamily: CORMORANT,
          fontSize: 72,
          fontStyle: "italic",
          color: V.WARM,
        }}
      />
      <BigNumber value="R$100K" frame={frame} color={V.RUST} size={160} />
      <div style={{ opacity: ci(frame, [20, 32], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={500} />
      </div>
      <WordByWord
        text="nos primeiros meses"
        frame={frame}
        startDelay={24}
        stagger={3}
        wordStyle={{
          fontFamily: CORMORANT,
          fontSize: 60,
          fontStyle: "italic",
          color: V.WARM,
        }}
      />
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        bottom: 100,
        right: 80,
        opacity: ci(frame, [30, 50], [0, 1]),
      }}
    >
      <VintageSeal text="GARANTIA" size={170} color={V.GOLD} opacity={0.3} />
    </div>
    <div style={{ position:"absolute", top:80, left:60, pointerEvents:"none" }}>
      <SVGCoins frame={frame} size={120} color={V.GOLD} opacity={0.18}/>
    </div>
  </VintageScene>
);

// C15 — 4 PILARES
const C15_Pilares: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER2} entryDir="right" exitDir="left">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <BigNumber value="4" frame={frame} color={V.GOLD} size={240} />
      <WordByWord
        text="PILARES"
        frame={frame}
        startDelay={14}
        stagger={3}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 130,
          color: V.BROWN,
          letterSpacing: "0.08em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGFourColumns frame={frame} size={150} color={V.SEPIA} opacity={0.16}/>
    </div>
  </VintageScene>
);

// Cenas de pilar genérica
const PilarScene: React.FC<{
  frame: number;
  duration: number;
  numero: string;
  titulo: string;
  entryDir?: "left" | "right" | "top" | "bottom";
  exitDir?: "left" | "right" | "top" | "bottom";
}> = ({ frame, duration, numero, titulo, entryDir = "left", exitDir = "right" }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER} entryDir={entryDir} exitDir={exitDir}>
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <div
        style={{
          ...entryFrom(frame, "top", 40, 18),
          fontFamily: CORMORANT,
          fontSize: 56,
          fontStyle: "italic",
          color: V.SEPIA,
          letterSpacing: "0.1em",
        }}
      >
        PILAR {numero}
      </div>
      <div style={{ opacity: ci(frame, [10, 20], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={380} />
      </div>
      <WordByWord
        text={titulo}
        frame={frame}
        startDelay={12}
        stagger={3}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 120,
          color: V.BROWN,
          letterSpacing: "0.04em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", top:80, right:60, pointerEvents:"none" }}>
      <SVGColumn frame={frame} size={180} color={V.SEPIA} opacity={0.18}/>
    </div>
  </VintageScene>
);

// C20 — TODOS INTEGRADOS
const C20_Integrados: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.CREAM} entryDir="bottom" exitDir="top">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <WordByWord
        text="TODOS"
        frame={frame}
        startDelay={2}
        stagger={3}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 170,
          color: V.RUST,
          letterSpacing: "0.06em",
        }}
      />
      <WordByWord
        text="INTEGRADOS"
        frame={frame}
        startDelay={10}
        stagger={3}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: 110,
          color: V.BROWN,
          letterSpacing: "0.06em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGCircleArrows frame={frame} size={140} color={V.RUST} opacity={0.16}/>
    </div>
  </VintageScene>
);

// C21 — SISTEMA COMPLETO (resolução)
const C21_SistemaCompleto: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene frame={frame} duration={duration} bg={V.PAPER} entryDir="left" exitDir="right">
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <div style={{ opacity: ci(frame, [0, 12], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={520} />
      </div>
      <LetterByLetter
        text="SISTEMA"
        frame={frame}
        startDelay={4}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 150,
          color: V.GOLD,
          letterSpacing: "0.08em",
        }}
      />
      <LetterByLetter
        text="COMPLETO"
        frame={frame}
        startDelay={18}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 120,
          color: V.BROWN,
          letterSpacing: "0.08em",
        }}
      />
    </AbsoluteFill>
    <div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGGears frame={frame} size={140} color={V.GOLD} opacity={0.16}/>
    </div>
  </VintageScene>
);

// Cenas de urgência (C22-C29) — genérica
const UrgencyScene: React.FC<{
  frame: number;
  duration: number;
  line1: string;
  line2?: string;
  bg?: string;
  color1?: string;
  color2?: string;
  entryDir?: "left" | "right" | "top" | "bottom";
  exitDir?: "left" | "right" | "top" | "bottom";
  size1?: number;
  size2?: number;
  vignetteIntensity?: number;
}> = ({
  frame,
  duration,
  line1,
  line2,
  bg = V.PAPER,
  color1 = V.RUST,
  color2 = V.BROWN,
  entryDir = "bottom",
  exitDir = "top",
  size1 = 130,
  size2 = 100,
  vignetteIntensity = 0.60,
}) => (
  <VintageScene frame={frame} duration={duration} bg={bg} entryDir={entryDir} exitDir={exitDir} vignetteIntensity={vignetteIntensity}>
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <WordByWord
        text={line1}
        frame={frame}
        startDelay={2}
        stagger={2}
        wordStyle={{
          fontFamily: BEBAS,
          fontSize: size1,
          color: color1,
          letterSpacing: "0.05em",
        }}
      />
      {line2 && (
        <WordByWord
          text={line2}
          frame={frame}
          startDelay={10}
          stagger={2}
          wordStyle={{
            fontFamily: BEBAS,
            fontSize: size2,
            color: color2,
            letterSpacing: "0.05em",
          }}
        />
      )}
    </AbsoluteFill>
    <div style={{ position:"absolute", top:80, right:60, pointerEvents:"none" }}>
      <SVGClock frame={frame} size={120} color={V.RUST} opacity={0.18}/>
    </div>
  </VintageScene>
);

// C30 — AÇÃO (botão/CTA vintage)
const C30_CTA: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene
    frame={frame}
    duration={duration}
    bg={V.BURGUNDY}
    entryDir="bottom"
    exitDir="top"
    frameColor={V.GOLD2}
    vignetteIntensity={0.70}
  >
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <div style={{ opacity: ci(frame, [4, 18], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD2} width={560} opacity={0.9} />
      </div>
      <LetterByLetter
        text="CLIQUE"
        frame={frame}
        startDelay={6}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 170,
          color: V.IVORY,
          letterSpacing: "0.1em",
        }}
      />
      <LetterByLetter
        text="AGORA"
        frame={frame}
        startDelay={22}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 150,
          color: V.GOLD2,
          letterSpacing: "0.1em",
        }}
      />
      <div style={{ opacity: ci(frame, [38, 52], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD2} width={560} opacity={0.9} />
      </div>
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        top: 80,
        right: 80,
        opacity: ci(frame, [30, 50], [0, 1]),
      }}
    >
      <VintageSeal text="ELITE" size={160} color={V.GOLD2} opacity={0.35} />
    </div>
    <div style={{ position:"absolute", bottom:100, left:60, pointerEvents:"none" }}>
      <SVGCursor frame={frame} size={110} color={V.IVORY} opacity={0.20}/>
    </div>
  </VintageScene>
);

// C31 — GLÓRIA FINAL
const C31_Gloria: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => (
  <VintageScene
    frame={frame}
    duration={duration}
    bg={V.PAPER}
    entryDir="top"
    exitDir="bottom"
    vignetteIntensity={0.70}
  >
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
      }}
    >
      <div style={{ opacity: ci(frame, [2, 16], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={580} opacity={0.9} />
      </div>
      <WordByWord
        text="SUA HISTÓRIA"
        frame={frame}
        startDelay={4}
        stagger={5}
        wordStyle={{
          fontFamily: PLAYFAIR,
          fontSize: 100,
          fontStyle: "italic",
          color: V.WARM,
          letterSpacing: "0.02em",
        }}
      />
      <LetterByLetter
        text="COMEÇA"
        frame={frame}
        startDelay={18}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 180,
          color: V.RUST,
          letterSpacing: "0.1em",
          textShadow: `0 0 56px rgba(155,58,30,0.65), 0 6px 20px rgba(28,15,8,0.6)`,
        }}
      />
      <LetterByLetter
        text="AGORA"
        frame={frame}
        startDelay={34}
        stagger={2}
        letterStyle={{
          fontFamily: BEBAS,
          fontSize: 140,
          color: V.GOLD,
          letterSpacing: "0.1em",
          textShadow: `0 0 44px rgba(184,148,26,0.70), 0 5px 16px rgba(28,15,8,0.55)`,
        }}
      />
      <div style={{ opacity: ci(frame, [50, 58], [0, 1]) }}>
        <OrnamentalLine color={V.GOLD} width={580} opacity={0.9} />
      </div>
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        bottom: 140,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: ci(frame, [45, 58], [0, 1]),
      }}
    >
      <VintageSeal text="MAGNA" size={200} color={V.GOLD} opacity={0.35} />
    </div>
    <div style={{ position:"absolute", top:60, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
      <SVGStar frame={frame} size={120} color={V.GOLD} opacity={0.20}/>
    </div>
  </VintageScene>
);

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const MaquinaMentoria: React.FC = () => {
  const frame = useCurrentFrame();

  const seq = (idx: number): { localFrame: number; dur: number } => {
    const [start, dur] = TIMING[idx];
    return { localFrame: frame - start, dur };
  };

  return (
    <AbsoluteFill>
      {/* C01 */}
      <Sequence from={TIMING[0][0]} durationInFrames={TIMING[0][1]}>
        {(() => { const s = seq(0); return <C01_MentoriaProta frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C02 */}
      <Sequence from={TIMING[1][0]} durationInFrames={TIMING[1][1]}>
        {(() => { const s = seq(1); return <C02_DoisAnos frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C03 */}
      <Sequence from={TIMING[2][0]} durationInFrames={TIMING[2][1]}>
        {(() => { const s = seq(2); return <C03_Esperando frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C04 */}
      <Sequence from={TIMING[3][0]} durationInFrames={TIMING[3][1]}>
        {(() => { const s = seq(3); return <C04_Stats frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C05 */}
      <Sequence from={TIMING[4][0]} durationInFrames={TIMING[4][1]}>
        {(() => { const s = seq(4); return <C05_OutrosLancaram frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C06 */}
      <Sequence from={TIMING[5][0]} durationInFrames={TIMING[5][1]}>
        {(() => { const s = seq(5); return <C06_NaoTalento frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C07 */}
      <Sequence from={TIMING[6][0]} durationInFrames={TIMING[6][1]}>
        {(() => { const s = seq(6); return <C07_Maquina frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C08 */}
      <Sequence from={TIMING[7][0]} durationInFrames={TIMING[7][1]}>
        {(() => { const s = seq(7); return <C08_Sistema frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C09 */}
      <Sequence from={TIMING[8][0]} durationInFrames={TIMING[8][1]}>
        {(() => { const s = seq(8); return <C09_Componentes frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C10 */}
      <Sequence from={TIMING[9][0]} durationInFrames={TIMING[9][1]}>
        {(() => { const s = seq(9); return <C10_Duzentos frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C11 */}
      <Sequence from={TIMING[10][0]} durationInFrames={TIMING[10][1]}>
        {(() => { const s = seq(10); return <C11_IdeiaVenda frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C12 */}
      <Sequence from={TIMING[11][0]} durationInFrames={TIMING[11][1]}>
        {(() => { const s = seq(11); return <C12_Contrato frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C13 */}
      <Sequence from={TIMING[12][0]} durationInFrames={TIMING[12][1]}>
        {(() => { const s = seq(12); return <C13_Acomp frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C14 */}
      <Sequence from={TIMING[13][0]} durationInFrames={TIMING[13][1]}>
        {(() => { const s = seq(13); return <C14_R100k frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C15 */}
      <Sequence from={TIMING[14][0]} durationInFrames={TIMING[14][1]}>
        {(() => { const s = seq(14); return <C15_Pilares frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C16 */}
      <Sequence from={TIMING[15][0]} durationInFrames={TIMING[15][1]}>
        {(() => { const s = seq(15); return (
          <PilarScene
            frame={s.localFrame}
            duration={s.dur}
            numero="I"
            titulo="POSICIONAMENTO"
            entryDir="right"
            exitDir="left"
          />
        ); })()}
      </Sequence>

      {/* C17 */}
      <Sequence from={TIMING[16][0]} durationInFrames={TIMING[16][1]}>
        {(() => { const s = seq(16); return (
          <PilarScene
            frame={s.localFrame}
            duration={s.dur}
            numero="II"
            titulo="CONTEÚDO"
            entryDir="left"
            exitDir="right"
          />
        ); })()}
      </Sequence>

      {/* C18 */}
      <Sequence from={TIMING[17][0]} durationInFrames={TIMING[17][1]}>
        {(() => { const s = seq(17); return (
          <PilarScene
            frame={s.localFrame}
            duration={s.dur}
            numero="III"
            titulo="VENDAS"
            entryDir="right"
            exitDir="left"
          />
        ); })()}
      </Sequence>

      {/* C19 */}
      <Sequence from={TIMING[18][0]} durationInFrames={TIMING[18][1]}>
        {(() => { const s = seq(18); return (
          <PilarScene
            frame={s.localFrame}
            duration={s.dur}
            numero="IV"
            titulo="ENTREGA"
            entryDir="left"
            exitDir="right"
          />
        ); })()}
      </Sequence>

      {/* C20 */}
      <Sequence from={TIMING[19][0]} durationInFrames={TIMING[19][1]}>
        {(() => { const s = seq(19); return <C20_Integrados frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C21 */}
      <Sequence from={TIMING[20][0]} durationInFrames={TIMING[20][1]}>
        {(() => { const s = seq(20); return <C21_SistemaCompleto frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* C22 */}
      <Sequence from={TIMING[21][0]} durationInFrames={TIMING[21][1]}>
        {(() => { const s = seq(21); return (
          <UrgencyScene
            frame={s.localFrame}
            duration={s.dur}
            line1="NÃO ESPERE"
            line2="MAIS"
            bg={V.PAPER2}
            color1={V.BURGUNDY}
            color2={V.RUST}
            size1={140}
            size2={180}
            entryDir="left"
            exitDir="right"
          />
        ); })()}
      </Sequence>

      {/* C23 */}
      <Sequence from={TIMING[22][0]} durationInFrames={TIMING[22][1]}>
        {(() => { const s = seq(22); return (
          <UrgencyScene
            frame={s.localFrame}
            duration={s.dur}
            line1="O MERCADO"
            line2="NÃO ESPERA"
            bg={V.CREAM}
            color1={V.BROWN}
            color2={V.RUST2}
            size1={120}
            size2={100}
            entryDir="right"
            exitDir="left"
          />
        ); })()}
      </Sequence>

      {/* C29 */}
      <Sequence from={TIMING[23][0]} durationInFrames={TIMING[23][1]}>
        {(() => { const s = seq(23); return (
          <UrgencyScene
            frame={s.localFrame}
            duration={s.dur}
            line1="CLIQUE"
            line2="AGORA"
            bg={V.PAPER2}
            color1={V.RUST}
            color2={V.BURGUNDY}
            size1={160}
            size2={150}
            entryDir="right"
            exitDir="left"
            vignetteIntensity={0.70}
          />
        ); })()}
      </Sequence>

      {/* C30 — CTA final (f1636→f1703) */}
      <Sequence from={TIMING[24][0]} durationInFrames={TIMING[24][1]}>
        {(() => { const s = seq(24); return <C30_CTA frame={s.localFrame} duration={s.dur} />; })()}
      </Sequence>

      {/* Narrador */}
      <Audio src={staticFile("audio/maquina-mentoria-narrador.mp3")} />

      {/* Música de fundo — startFrom=834 alinha o fim da música com o fim do vídeo (56.77s total) */}
      <Audio
        src={staticFile("audio/maquina-mentoria-musica.mp3")}
        startFrom={834}
        volume={0.10}
      />
    </AbsoluteFill>
  );
};
