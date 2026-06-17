import React from "react";
import { C, FONT } from "./GroovyTokens";

// ─── Shape helper (internal) ────────────────────────────────────────────────
interface ShapeProps {
  d: string;
  fill: string;
  outer?: number;
  inner?: number;
}
function Shape({ d, fill, outer = 8, inner = 3 }: ShapeProps) {
  return (
    <>
      <path d={d} fill={C.purple} stroke={C.purple} strokeWidth={outer} strokeLinejoin="round" />
      <path d={d} fill={fill}    stroke={C.paper}  strokeWidth={inner} strokeLinejoin="round" />
    </>
  );
}

// ─── GroovyGrain ─────────────────────────────────────────────────────────────
export const GroovyGrain: React.FC = () => (
  <svg
    style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      mixBlendMode: "multiply", pointerEvents: "none",
    }}
  >
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.23  0 0 0 0 0.06  0 0 0 0 0.22  0 0 0 0.85 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

// ─── DisplayOut (outlined Ultra text) ────────────────────────────────────────
interface DisplayOutProps {
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
}
export const DisplayOut: React.FC<DisplayOutProps> = ({
  children, fontSize = 160, color = C.paper, style,
}) => (
  <div
    style={{
      fontFamily: FONT.display,
      fontSize,
      fontWeight: 900,
      lineHeight: 0.9,
      color: "transparent",
      WebkitTextStroke: `4px ${C.purple}`,
      textShadow: `8px 8px 0 ${C.magenta}`,
      textTransform: "uppercase",
      letterSpacing: "-2px",
      paintOrder: "stroke fill",
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── SwirlColumn (hourglass background) ──────────────────────────────────────
interface SwirlColumnProps {
  width?: number;
  height?: number;
  waistY?: number;
}
export const SwirlColumn: React.FC<SwirlColumnProps> = ({
  width = 1080,
  height = 1920,
  waistY = 0.48,
}) => {
  const cx = width / 2;
  const waist = height * waistY;

  function bandPath(halfTop: number, halfWaist: number, halfBot: number): string {
    const topY = 0;
    const topCurveStart = height * 0.18;
    const botCurveEnd = height * 0.82;
    const botY = height;
    const fL = cx - halfBot;
    const fR = cx + halfBot;
    const flameH = Math.min(80, halfBot * 0.7);
    const stepBot = (fR - fL) / 3;
    return `
      M ${cx - halfTop} ${topY}
      L ${cx - halfTop} ${topCurveStart}
      C ${cx - halfTop} ${waist - 80}, ${cx - halfWaist - 20} ${waist - 30},
        ${cx - halfWaist} ${waist}
      C ${cx - halfWaist - 20} ${waist + 30}, ${cx - halfBot} ${botCurveEnd - 30},
        ${cx - halfBot} ${botCurveEnd}
      L ${fL} ${botY - flameH}
      L ${fL + stepBot * 0.5} ${botY}
      L ${fL + stepBot} ${botY - flameH * 0.8}
      L ${fL + stepBot * 1.5} ${botY}
      L ${fL + stepBot * 2} ${botY - flameH * 0.8}
      L ${fL + stepBot * 2.5} ${botY}
      L ${fR} ${botY - flameH}
      L ${cx + halfBot} ${botCurveEnd}
      C ${cx + halfBot} ${botCurveEnd - 30}, ${cx + halfWaist + 20} ${waist + 30},
        ${cx + halfWaist} ${waist}
      C ${cx + halfWaist + 20} ${waist - 30}, ${cx + halfTop} ${waist - 80},
        ${cx + halfTop} ${topCurveStart}
      L ${cx + halfTop} ${topY}
      Z
    `;
  }

  const bands = [
    { c: C.purple,  topW: 360, waistW: 140, botW: 380 },
    { c: C.magenta, topW: 300, waistW: 110, botW: 320 },
    { c: C.orange,  topW: 240, waistW:  84, botW: 260 },
    { c: C.yellow,  topW: 184, waistW:  62, botW: 200 },
    { c: C.teal,    topW: 130, waistW:  42, botW: 144 },
    { c: C.hotPink, topW:  78, waistW:  24, botW:  90 },
  ];

  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      {bands.map((b, i) => (
        <path
          key={i}
          d={bandPath(b.topW / 2, b.waistW / 2, b.botW / 2)}
          fill={b.c}
          stroke={i === 0 ? C.purple : "none"}
          strokeWidth={i === 0 ? 4 : 0}
        />
      ))}
    </svg>
  );
};

// ─── Icons ───────────────────────────────────────────────────────────────────

export const Rocket: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-100 -120 200 240">
    {/* Exhaust glow */}
    <ellipse cx="0" cy="110" rx="28" ry="14" fill={C.orange} opacity={0.5} />
    {/* Side fins */}
    <Shape d="M-30 60 L-70 100 L-30 80 Z" fill={C.magenta} />
    <Shape d="M30 60 L70 100 L30 80 Z" fill={C.magenta} />
    {/* Body */}
    <Shape
      d="M0 -110 C-30 -110,-50 -60,-50 0 L-50 70 C-50 90,-30 100,0 100 C30 100,50 90,50 70 L50 0 C50 -60,30 -110,0 -110 Z"
      fill={C.yellow}
    />
    {/* Stripe */}
    <Shape d="M-50 20 L50 20 L50 45 L-50 45 Z" fill={C.hotPink} />
    {/* Window */}
    <circle cx="0" cy="-20" r="22" fill={C.teal} stroke={C.purple} strokeWidth={4} />
    <circle cx="0" cy="-20" r="14" fill={C.paper} />
    {/* Rivets */}
    {[-40, 40].map((x, i) => (
      <circle key={i} cx={x} cy="60" r="5" fill={C.purple} />
    ))}
    {/* Antenna */}
    <line x1="0" y1="-110" x2="0" y2="-130" stroke={C.purple} strokeWidth={3} />
    <circle cx="0" cy="-133" r="6" fill={C.magenta} stroke={C.purple} strokeWidth={2} />
  </svg>
);

export const Padlock: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-100 -110 200 220">
    {/* Shackle */}
    <path
      d="M-30 -10 L-30 -60 C-30 -90,30 -90,30 -60 L30 -10"
      fill="none" stroke={C.purple} strokeWidth={12}
    />
    <path
      d="M-24 -10 L-24 -58 C-24 -82,24 -82,24 -58 L24 -10"
      fill="none" stroke={C.teal} strokeWidth={6}
    />
    {/* Body */}
    <Shape
      d="M-55 -10 C-55 -16,-50 -20,-44 -20 L44 -20 C50 -20,55 -16,55 -10 L55 80 C55 90,48 100,40 100 L-40 100 C-48 100,-55 90,-55 80 Z"
      fill={C.yellow}
    />
    {/* Keyhole circle */}
    <circle cx="0" cy="38" r="18" fill={C.paper} stroke={C.purple} strokeWidth={4} />
    {/* Keyhole slot */}
    <rect x="-6" y="44" width="12" height="24" rx="3" fill={C.purple} />
    {/* Highlight */}
    <path d="M-44 -6 L-44 60" stroke={C.paper} strokeWidth={3} opacity={0.4} strokeLinecap="round" />
    {/* Rivets */}
    {[[-40, 90], [40, 90]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="5" fill={C.purple} />
    ))}
  </svg>
);

export const Microphone: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-90 -120 180 240">
    {/* Base */}
    <Shape d="M-30 110 L30 110 L20 85 L-20 85 Z" fill={C.orange} />
    {/* Tripod */}
    <line x1="-20" y1="85" x2="-50" y2="115" stroke={C.purple} strokeWidth={6} />
    <line x1="20" y1="85" x2="50" y2="115" stroke={C.purple} strokeWidth={6} />
    <line x1="0" y1="85" x2="0" y2="115" stroke={C.purple} strokeWidth={6} />
    {/* Yoke arms */}
    <line x1="-40" y1="20" x2="-20" y2="85" stroke={C.purple} strokeWidth={8} strokeLinecap="round" />
    <line x1="40" y1="20" x2="20" y2="85" stroke={C.purple} strokeWidth={8} strokeLinecap="round" />
    {/* Head capsule */}
    <Shape
      d="M0 -110 C-35 -110,-55 -80,-55 -40 L-55 10 C-55 40,-30 55,0 55 C30 55,55 40,55 10 L55 -40 C55 -80,35 -110,0 -110 Z"
      fill={C.magenta}
    />
    {/* Grill bars */}
    {[-30, -10, 10, 30].map((y, i) => (
      <line key={i} x1={-50 + Math.abs(y)} y1={y} x2={50 - Math.abs(y)} y2={y} stroke={C.paper} strokeWidth={3} opacity={0.5} />
    ))}
    {/* Side knob */}
    <circle cx="55" cy="-20" r="10" fill={C.yellow} stroke={C.purple} strokeWidth={3} />
  </svg>
);

export const Headphones: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-110 -110 220 240">
    {/* Band */}
    <path
      d="M-60 -70 C-60 -105,60 -105,60 -70"
      fill="none" stroke={C.purple} strokeWidth={14} strokeLinecap="round"
    />
    <path
      d="M-60 -70 C-60 -100,60 -100,60 -70"
      fill="none" stroke={C.yellow} strokeWidth={6} strokeLinecap="round"
    />
    {/* Sliders */}
    <rect x="-70" y="-75" width="20" height="30" rx="5" fill={C.paper} stroke={C.purple} strokeWidth={3} />
    <rect x="50" y="-75" width="20" height="30" rx="5" fill={C.paper} stroke={C.purple} strokeWidth={3} />
    {/* Left cup */}
    <Shape
      d="M-90 -30 C-90 -60,-50 -70,-50 -40 L-50 60 C-50 90,-90 90,-90 60 Z"
      fill={C.teal}
    />
    <ellipse cx="-70" cy="10" rx="12" ry="18" fill={C.paper} opacity={0.3} />
    {/* Right cup */}
    <Shape
      d="M90 -30 C90 -60,50 -70,50 -40 L50 60 C50 90,90 90,90 60 Z"
      fill={C.magenta}
    />
    <ellipse cx="70" cy="10" rx="12" ry="18" fill={C.paper} opacity={0.3} />
    {/* Coiled cable */}
    <path
      d="M0 80 C-5 90,-5 100,0 105 C5 110,5 120,0 125"
      fill="none" stroke={C.purple} strokeWidth={4} strokeLinecap="round"
    />
    <circle cx="0" cy="128" r="7" fill={C.orange} stroke={C.purple} strokeWidth={3} />
  </svg>
);

export const Vinyl: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-120 -100 240 200">
    {/* Turntable base */}
    <Shape
      d="M-110 -90 C-110 -95,-105 -98,-100 -98 L100 -98 C105 -98,110 -95,110 -90 L110 88 C110 93,105 98,100 98 L-100 98 C-105 98,-110 93,-110 88 Z"
      fill={C.orange}
    />
    {/* Platter */}
    <circle cx="0" cy="0" r="88" fill={C.purple} stroke={C.purple} strokeWidth={4} />
    {/* Grooves */}
    {[72, 58, 46, 36, 28].map((r, i) => (
      <circle key={i} cx="0" cy="0" r={r} fill="none" stroke={C.plum} strokeWidth={2} />
    ))}
    {/* Center label */}
    <circle cx="0" cy="0" r="22" fill={C.yellow} stroke={C.purple} strokeWidth={3} />
    <circle cx="0" cy="0" r="5" fill={C.purple} />
    {/* Tonearm */}
    <line x1="88" y1="-70" x2="50" y2="20" stroke={C.paper} strokeWidth={5} strokeLinecap="round" />
    <circle cx="88" cy="-70" r="8" fill={C.magenta} stroke={C.purple} strokeWidth={3} />
    {/* Slider */}
    <rect x="84" y="-85" width="20" height="10" rx="4" fill={C.teal} stroke={C.purple} strokeWidth={2} />
  </svg>
);

export const Guitar: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-100 -120 200 240" style={{ transform: "rotate(-18deg)" }}>
    {/* Headstock */}
    <Shape d="M-14 -110 C-14 -120,14 -120,14 -110 L14 -80 L-14 -80 Z" fill={C.orange} />
    {/* Tuning pegs */}
    {[[-20, -105], [20, -105], [-20, -90], [20, -90]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="7" fill={C.yellow} stroke={C.purple} strokeWidth={2} />
    ))}
    {/* Neck */}
    <Shape d="M-12 -80 L12 -80 L12 20 L-12 20 Z" fill={C.yellow} />
    {/* Fret lines */}
    {Array.from({ length: 8 }, (_, i) => -68 + i * 11).map((y, i) => (
      <line key={i} x1="-12" y1={y} x2="12" y2={y} stroke={C.purple} strokeWidth={2} />
    ))}
    {/* Body back */}
    <Shape
      d="M0 20 C-50 10,-80 30,-80 60 C-80 90,-60 110,-30 110 C-15 110,-5 105,0 100 C5 105,15 110,30 110 C60 110,80 90,80 60 C80 30,50 10,0 20 Z"
      fill={C.magenta}
    />
    {/* Body front cutaway shape */}
    <path
      d="M0 25 C-44 16,-72 34,-72 60 C-72 84,-55 102,-30 102 C-16 102,-7 97,0 93 C7 97,16 102,30 102 C55 102,72 84,72 60 C72 34,44 16,0 25 Z"
      fill={C.hotPink}
    />
    {/* Pickguard */}
    <Shape d="M10 40 L30 40 L30 75 L10 80 Z" fill={C.plum} />
    {/* Pickups */}
    <rect x="-28" y="42" width="34" height="12" rx="3" fill={C.purple} />
    <rect x="-28" y="60" width="34" height="12" rx="3" fill={C.purple} />
    {/* Strings */}
    {[-8, -4, 0, 4, 8, 12].map((x, i) => (
      <line key={i} x1={x} y1="-80" x2={x} y2="90" stroke={C.paper} strokeWidth={1} opacity={0.6} />
    ))}
    {/* Sound hole */}
    <circle cx="0" cy="58" r="18" fill={C.plum} stroke={C.purple} strokeWidth={3} />
    {/* Knobs */}
    {[[38, 48], [38, 62], [38, 76]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="6" fill={C.yellow} stroke={C.purple} strokeWidth={2} />
    ))}
    {/* Bridge */}
    <rect x="-16" y="88" width="32" height="8" rx="3" fill={C.orange} stroke={C.purple} strokeWidth={2} />
  </svg>
);

export const Robot: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-120 -120 240 240">
    {/* Antennas */}
    <line x1="-30" y1="-105" x2="-30" y2="-120" stroke={C.purple} strokeWidth={4} />
    <circle cx="-30" cy="-123" r="6" fill={C.magenta} stroke={C.purple} strokeWidth={2} />
    <line x1="30" y1="-105" x2="30" y2="-120" stroke={C.purple} strokeWidth={4} />
    <circle cx="30" cy="-123" r="6" fill={C.teal} stroke={C.purple} strokeWidth={2} />
    {/* Ears */}
    <rect x="-110" y="-50" width="20" height="40" rx="5" fill={C.orange} stroke={C.purple} strokeWidth={3} />
    <rect x="90" y="-50" width="20" height="40" rx="5" fill={C.orange} stroke={C.purple} strokeWidth={3} />
    {/* Head body */}
    <Shape
      d="M-80 -105 C-80 -115,-70 -120,-60 -120 L60 -120 C70 -120,80 -115,80 -105 L80 30 C80 40,70 50,60 50 L-60 50 C-70 50,-80 40,-80 30 Z"
      fill={C.yellow}
    />
    {/* Face plate */}
    <rect x="-65" y="-90" width="130" height="120" rx="8" fill={C.paper} stroke={C.purple} strokeWidth={3} />
    {/* Gear left */}
    <circle cx="-55" cy="-100" r="12" fill={C.teal} stroke={C.purple} strokeWidth={2} />
    {/* Eye */}
    <circle cx="0" cy="-50" r="25" fill={C.magenta} stroke={C.purple} strokeWidth={4} />
    <circle cx="0" cy="-50" r="14" fill={C.paper} />
    <circle cx="6" cy="-56" r="6" fill={C.purple} />
    {/* Mouth grid */}
    {[-3, 0, 3].map((row, ri) =>
      [-30, -20, -10, 0, 10, 20, 30].map((x, ci) => (
        <rect key={`${ri}-${ci}`} x={x - 4} y={-10 + row * 8} width="7" height="6" rx="1" fill={C.orange} />
      ))
    )}
    {/* Chin pipe */}
    <rect x="-10" y="22" width="20" height="20" rx="4" fill={C.teal} stroke={C.purple} strokeWidth={2} />
  </svg>
);

export const Helmet: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-120 -110 240 220">
    {/* Neck base */}
    <Shape d="M-40 90 L40 90 L50 110 L-50 110 Z" fill={C.orange} />
    {/* Helmet outer */}
    <Shape
      d="M0 -100 C-70 -100,-100 -50,-100 0 L-100 70 C-100 85,-85 95,-70 95 L70 95 C85 95,100 85,100 70 L100 0 C100 -50,70 -100,0 -100 Z"
      fill={C.teal}
    />
    {/* Top stripe */}
    <path
      d="M0 -100 C-10 -80,-10 -60,0 -40 C10 -60,10 -80,0 -100 Z"
      fill={C.yellow}
    />
    {/* Visor */}
    <Shape
      d="M-75 -10 C-75 -30,-55 -50,0 -50 C55 -50,75 -30,75 -10 L75 40 C75 55,60 65,0 65 C-60 65,-75 55,-75 40 Z"
      fill={C.purple}
    />
    {/* Visor reflections */}
    <path d="M-60 -5 C-60 -20,-45 -35,-10 -38" fill="none" stroke={C.paper} strokeWidth={3} opacity={0.3} strokeLinecap="round" />
    <path d="M-50 15 C-50 5,-40 -5,-20 -8" fill="none" stroke={C.paper} strokeWidth={2} opacity={0.2} strokeLinecap="round" />
    {/* Side control box */}
    <rect x="80" y="10" width="30" height="40" rx="5" fill={C.yellow} stroke={C.purple} strokeWidth={3} />
    {[18, 28, 38].map((y, i) => (
      <circle key={i} cx="95" cy={y} r="4" fill={C.magenta} />
    ))}
    {/* Left port */}
    <rect x="-110" y="20" width="20" height="24" rx="4" fill={C.orange} stroke={C.purple} strokeWidth={3} />
    {/* Air tube */}
    <path d="M-90 30 C-70 30,-60 50,-40 50" fill="none" stroke={C.purple} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const Camera: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-120 -110 240 220">
    {/* Viewfinder top bump */}
    <Shape d="M-30 -100 C-30 -110,30 -110,30 -100 L30 -80 L-30 -80 Z" fill={C.orange} />
    {/* Shutter button */}
    <circle cx="50" cy="-90" r="12" fill={C.magenta} stroke={C.purple} strokeWidth={3} />
    {/* Hot shoe */}
    <rect x="-10" y="-108" width="40" height="8" rx="2" fill={C.purple} />
    {/* Body */}
    <Shape
      d="M-100 -80 C-100 -90,-90 -98,-80 -98 L80 -98 C90 -98,100 -90,100 -80 L100 80 C100 90,90 100,80 100 L-80 100 C-90 100,-100 90,-100 80 Z"
      fill={C.yellow}
    />
    {/* Leather strip */}
    <rect x="-100" y="-20" width="200" height="14" fill={C.orange} />
    {/* Lens rings */}
    <circle cx="-10" cy="10" r="65" fill={C.purple} stroke={C.purple} strokeWidth={4} />
    <circle cx="-10" cy="10" r="52" fill={C.plum} />
    <circle cx="-10" cy="10" r="38" fill={C.purple} />
    <circle cx="-10" cy="10" r="26" fill={C.teal} stroke={C.paper} strokeWidth={2} />
    <circle cx="-10" cy="10" r="14" fill={C.paper} opacity={0.6} />
    {/* Flash */}
    <rect x="68" y="-70" width="22" height="16" rx="4" fill={C.paper} stroke={C.purple} strokeWidth={3} />
    {/* Dial */}
    <circle cx="78" cy="20" r="16" fill={C.orange} stroke={C.purple} strokeWidth={3} />
    <line x1="78" y1="6" x2="78" y2="34" stroke={C.purple} strokeWidth={2} />
    <line x1="64" y1="20" x2="92" y2="20" stroke={C.purple} strokeWidth={2} />
    {/* Film advance */}
    <rect x="62" y="55" width="24" height="30" rx="4" fill={C.magenta} stroke={C.purple} strokeWidth={3} />
    {[60, 66, 72, 78].map((y, i) => (
      <line key={i} x1="62" y1={y} x2="86" y2={y} stroke={C.purple} strokeWidth={1} />
    ))}
  </svg>
);

export const Bolt: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="-100 -120 200 240">
    <Shape
      d="M10 -100 L-50 20 L-10 20 L-30 100 L60 -20 L20 -20 L40 -100 Z"
      fill={C.yellow}
      outer={10}
    />
  </svg>
);
