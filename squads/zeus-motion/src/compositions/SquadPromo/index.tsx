/**
 * SquadPromo v11 — BRABO Motion O.S. v9.0
 *
 * Reescrito seguindo os 10 Mandamentos do BRABO Motion:
 * - AnimatedText palavra por palavra (Mandamento 2)
 * - exitTo quadruple: posição + blur + opacity + scale (Mandamento 9)
 * - ci (clamped interpolate) em todo interpolate (Parte 5.2)
 * - BackgroundBase 3 camadas (Parte 6.1)
 * - Sequence com overlap 10f — zero frames vazios (Mandamento 7)
 * - Direções opostas entre cenas (Mandamento 6)
 * - Layouts variados por cena (Mandamento 10)
 * - Stagger universal — nada entra ou sai junto (Mandamento 5)
 *
 * Sequência de direções:
 *   S1 sai ESQUERDA  → S2 entra da DIREITA
 *   S2 sai para CIMA → S3 entra de BAIXO
 *   S3 sai DIREITA   → S4 entra da ESQUERDA
 *   S4 sai para BAIXO → S5 entra de CIMA
 *
 * Timing:
 *   S1: from=0   dur=130  exit@110
 *   S2: from=120 dur=130  exit@108
 *   S3: from=240 dur=150  exit@128
 *   S4: from=380 dur=150  exit@128
 *   S5: from=520 dur=120  (sem saída)
 *   Total: 640 frames = 21.3s @ 30fps
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { DeviceFrame } from '../../modules/device/DeviceFrame';

// ════════════════════════════════════════════════════════
// SISTEMA DE TEMAS
// ════════════════════════════════════════════════════════

const THEMES = {
  zeus: {
    bg: '#050505',
    primary: '#F5F5F7',
    secondary: 'rgba(245,245,247,0.52)',
    label: 'rgba(245,245,247,0.36)',
    blue: '#0071E3',
    purple: '#5856D6',
    green: '#30D158',
    red: '#FF3B30',
    gold: '#FF9F0A',
    font: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    inclusoGradient: 'linear-gradient(135deg, #34D158 0%, #0071E3 100%)',
    glow1: 'rgba(255,80,60,0.09)',    // S1: tensão
    glow2: 'rgba(0,113,227,0.10)',    // S2: solução
    glow3: 'rgba(88,86,214,0.10)',    // S3: prova
    glow4: 'rgba(52,209,88,0.08)',    // S4: valor
    glow5: 'rgba(0,113,227,0.13)',    // S5: ação
    accentColor: '#0071E3',
  },
  magna: {
    bg: '#0a0806',
    primary: '#f0e0d8',
    secondary: 'rgba(240,224,216,0.65)',
    label: 'rgba(240,224,216,0.36)',
    blue: '#b8887a',
    purple: '#d4a08a',
    green: '#30D158',
    red: '#FF3B30',
    gold: '#f0c8b0',
    font: '"Playfair Display", "Times New Roman", Georgia, serif',
    inclusoGradient: 'linear-gradient(135deg, #d4a08a 0%, #f0c8b0 50%, #b8887a 100%)',
    glow1: 'rgba(184,136,122,0.10)',
    glow2: 'rgba(212,160,138,0.12)',
    glow3: 'rgba(184,136,122,0.10)',
    glow4: 'rgba(48,209,88,0.08)',
    glow5: 'rgba(212,160,138,0.14)',
    accentColor: '#d4a08a',
  },
} as const;

type ThemeName = keyof typeof THEMES;
type Theme = (typeof THEMES)[ThemeName];

import { createContext, useContext } from 'react';
const ThemeCtx = createContext<Theme>(THEMES.zeus);
const useTheme = () => useContext(ThemeCtx);

// ════════════════════════════════════════════════════════
// ci — CLAMPED INTERPOLATE (usar SEMPRE no lugar de interpolate)
// ════════════════════════════════════════════════════════

const ci = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  ease?: (t: number) => number
): number =>
  interpolate(frame, [f0, f1], [v0, v1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// ════════════════════════════════════════════════════════
// SPRING CONFIGS VALIDADOS
// ════════════════════════════════════════════════════════

const SPRING = {
  text:   { damping: 14, mass: 0.8 },
  card:   { damping: 13, mass: 0.9 },
  badge:  { damping: 12, mass: 0.7, stiffness: 120 },
  icon:   { damping: 10, mass: 0.8, stiffness: 120 },
  snappy: { damping: 18, mass: 0.6, stiffness: 200 },
  bouncy: { damping: 8,  mass: 0.8, stiffness: 150 },
};

// ════════════════════════════════════════════════════════
// TIPOGRAFIA VERTICAL (1080×1920)
// ════════════════════════════════════════════════════════

const TV = {
  hero:     { fontSize: 128, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 },
  headline: { fontSize: 96,  fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 },
  subhead:  { fontSize: 64,  fontWeight: 300, letterSpacing: -1, lineHeight: 1.2  },
  body:     { fontSize: 40,  fontWeight: 400, letterSpacing: 0,  lineHeight: 1.4  },
  caption:  { fontSize: 24,  fontWeight: 500, letterSpacing: 2,  lineHeight: 1.4  },
};

// ════════════════════════════════════════════════════════
// PRIMITIVAS DE ENTRADA
// ════════════════════════════════════════════════════════

/** Entrada padrão: sobe de baixo + blur → 0 */
const entryUp = (frame: number, start: number, dur = 22): React.CSSProperties => {
  const p  = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const y  = ci(frame, [start, start + dur], [40, 0], Easing.out(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.6], [12, 0]);
  return { opacity: p, transform: `translateY(${y}px)`, filter: `blur(${bl}px)` };
};

/** Entrada direcional: vem de uma direção com blur */
const entryFrom = (
  frame: number,
  start: number,
  dir: 'left' | 'right' | 'top' | 'bottom',
  dist = 400,
  dur = 25
): React.CSSProperties => {
  const p   = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const bl  = ci(frame, [start, start + dur * 0.7], [14, 0]);
  const ax  = dir === 'left' || dir === 'right' ? 'X' : 'Y';
  const sgn = dir === 'left' || dir === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [dist * sgn, 0], Easing.out(Easing.cubic));
  return { opacity: p, transform: `translate${ax}(${pos}px)`, filter: `blur(${bl}px)` };
};

/** Entrada direcional SEM blur (usar quando filho tem background-clip:text) */
const entryFromNB = (
  frame: number,
  start: number,
  dir: 'left' | 'right' | 'top' | 'bottom',
  dist = 400,
  dur = 25
): React.CSSProperties => {
  const p   = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const ax  = dir === 'left' || dir === 'right' ? 'X' : 'Y';
  const sgn = dir === 'left' || dir === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [dist * sgn, 0], Easing.out(Easing.cubic));
  return { opacity: p, transform: `translate${ax}(${pos}px)` };
};

/** Entrada bounce: scale com back easing */
const entryBounce = (frame: number, start: number, dur = 18): React.CSSProperties => {
  const p  = ci(frame, [start, start + dur], [0, 1]);
  const sc = ci(frame, [start, start + dur], [0.6, 1], Easing.out(Easing.back(1.7)));
  const bl = ci(frame, [start, start + dur * 0.5], [6, 0]);
  return { opacity: p, transform: `scale(${sc})`, filter: `blur(${bl}px)` };
};

// ════════════════════════════════════════════════════════
// PRIMITIVAS DE SAÍDA — QUADRUPLE EXIT (posição+blur+opacity+scale)
// ════════════════════════════════════════════════════════

/** Saída direcional com arremesso + blur + opacity + scale */
const exitTo = (
  frame: number,
  start: number,
  dir: 'left' | 'right' | 'top' | 'bottom',
  dist = 1200,
  dur = 16
): React.CSSProperties => {
  const p   = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.exp));
  const ax  = dir === 'left' || dir === 'right' ? 'X' : 'Y';
  const sgn = dir === 'left' || dir === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [0, dist * sgn], Easing.in(Easing.exp));
  const bl  = ci(frame, [start, start + dur], [0, 20]);
  const sc  = ci(frame, [start, start + dur], [1, 0.94]);
  const op  = ci(frame, [start + dur * 0.35, start + dur], [1, 0]);
  return { opacity: op, transform: `translate${ax}(${pos}px) scale(${sc})`, filter: `blur(${bl}px)` };
};

/** Saída direcional SEM blur (usar quando filho tem background-clip:text — Regra ERROS-REMOTION ERRO1) */
const exitToNB = (
  frame: number,
  start: number,
  dir: 'left' | 'right' | 'top' | 'bottom',
  dist = 1200,
  dur = 16
): React.CSSProperties => {
  const ax  = dir === 'left' || dir === 'right' ? 'X' : 'Y';
  const sgn = dir === 'left' || dir === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [0, dist * sgn], Easing.in(Easing.exp));
  const sc  = ci(frame, [start, start + dur], [1, 0.94]);
  const op  = ci(frame, [start + dur * 0.35, start + dur], [1, 0]);
  return { opacity: op, transform: `translate${ax}(${pos}px) scale(${sc})` };
};

// ════════════════════════════════════════════════════════
// mergeStyles — combina entrada + saída
// ════════════════════════════════════════════════════════

const mergeStyles = (
  e: React.CSSProperties,
  x: React.CSSProperties
): React.CSSProperties => {
  const eOp = typeof e.opacity === 'number' ? e.opacity : 1;
  const xOp = typeof x.opacity === 'number' ? x.opacity : 1;
  return {
    opacity: eOp * xOp,
    transform: [e.transform, x.transform].filter(Boolean).join(' ') || undefined,
    filter:    [e.filter,    x.filter   ].filter(Boolean).join(' ') || undefined,
  };
};

// ════════════════════════════════════════════════════════
// AnimatedText — texto PALAVRA POR PALAVRA (Mandamento 2)
// ════════════════════════════════════════════════════════

interface AnimatedTextProps {
  text: string;
  delay?: number;
  exitStart?: number;
  exitDir?: 'left' | 'right' | 'top' | 'bottom';
  style?: React.CSSProperties;
  highlightWords?: number[];
  highlightColor?: string;
  stagger?: number;
  wordDur?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  exitStart = 99999,
  exitDir = 'left',
  style,
  highlightWords = [],
  highlightColor,
  stagger = 3,
  wordDur = 22,
}) => {
  const frame = useCurrentFrame();
  const T = useTheme();
  const hColor = highlightColor ?? T.accentColor;
  const words = text.split(' ');
  const ax  = exitDir === 'left' || exitDir === 'right' ? 'X' : 'Y';
  const sgn = exitDir === 'left' || exitDir === 'top' ? -1 : 1;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }}>
      {words.map((word, i) => {
        // Entrada: de baixo para cima + blur
        const ws = delay + i * stagger;
        const eP  = ci(frame, [ws, ws + wordDur], [0, 1], Easing.out(Easing.cubic));
        const eY  = ci(frame, [ws, ws + wordDur], [40, 0], Easing.out(Easing.cubic));
        const eBl = ci(frame, [ws, ws + wordDur * 0.55], [12, 0]);

        // Saída: stagger de 2f, escadinha (Mandamento 5)
        const es   = exitStart + i * 2;
        const xP   = ci(frame, [es, es + 14], [0, 1], Easing.in(Easing.exp));
        const xPos = ci(xP, [0, 1], [0, 1200 * sgn]);
        const xBl  = ci(xP, [0, 1], [0, 20]);
        const xOp  = ci(xP, [0.2, 0.8], [1, 0]);
        const xSc  = ci(xP, [0, 1], [1, 0.95]);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${eY}px) translate${ax}(${xPos}px) scale(${xSc})`,
              opacity: eP * xOp,
              filter: `blur(${eBl + xBl}px)`,
              color:      highlightWords.includes(i) ? hColor : 'inherit',
              fontWeight: highlightWords.includes(i) ? 800    : 'inherit',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ════════════════════════════════════════════════════════
// BackgroundBase — 3 camadas (cor + radial + noise)
// Background NUNCA anima em posição (Mandamento 8)
// ════════════════════════════════════════════════════════

const BackgroundBase: React.FC<{ glowColor?: string }> = ({ glowColor }) => {
  const T = useTheme();
  return (
    <AbsoluteFill>
      {/* Camada 1: cor sólida */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: T.bg }} />
      {/* Camada 2: radial glow sutil */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, ${glowColor ?? 'rgba(255,255,255,0.04)'} 0%, transparent 70%)`,
      }} />
      {/* Camada 3: noise texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.03,
        mixBlendMode: 'overlay' as const,
      }} />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// PhoneScreen — conteúdo do mockup da Cena 3
// ════════════════════════════════════════════════════════

const PHONE_ITEMS = [
  { icon: 'T',  label: 'Textos & Lettering',  sub: 'blur, reveal, tracking',       color: '#0071E3', delay: 16 },
  { icon: '★',  label: 'Animações Pro',        sub: 'stamps, counters, confetti',   color: '#5856D6', delay: 32 },
  { icon: '◻',  label: 'Mockups de Tela',      sub: 'iPhone, Android, Browser',    color: '#30D158', delay: 48 },
  { icon: '→',  label: 'Setas & Shapes',       sub: 'SVG animado, emojis, glitch',  color: '#FF9F0A', delay: 64 },
];

const PhoneScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const headerOp = ci(frame, [4, 18], [0, 1]);

  return (
    <div style={{
      background: '#050505',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px 12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        opacity: headerOp,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: '1px solid rgba(245,245,247,0.07)',
      }}>
        <span style={{
          color: 'rgba(245,245,247,0.28)',
          fontSize: 7,
          fontWeight: 600,
          letterSpacing: '0.24em',
          textTransform: 'uppercase' as const,
          fontFamily: 'Inter, sans-serif',
        }}>
          ZEUS-MOTION
        </span>
        {/* Gradiente text dentro do phone — mantido sem filter no pai graças a exitToNB */}
        <span style={{
          background: 'linear-gradient(90deg, #34D158, #0071E3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: 7,
          fontWeight: 800,
          letterSpacing: '0.08em',
          fontFamily: 'Inter, sans-serif',
        }}>
          INCLUSO
        </span>
      </div>

      {/* Feature rows com cascade */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
        {PHONE_ITEMS.map((item, i) => {
          const op = ci(frame, [item.delay, item.delay + 14], [0, 1]);
          const y  = ci(frame, [item.delay, item.delay + 14], [18, 0], Easing.out(Easing.cubic));
          const ckOp = ci(frame, [item.delay + 18, item.delay + 26], [0, 1]);
          const ckDash = ci(frame, [item.delay + 20, item.delay + 32], [0, 8]);
          return (
            <div key={i} style={{
              opacity: op,
              transform: `translateY(${y}px)`,
              background: `${item.color}0e`,
              border: `1px solid ${item.color}22`,
              borderLeft: `2.5px solid ${item.color}`,
              borderRadius: 8,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: `${item.color}18`,
                border: `1px solid ${item.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: item.color,
                fontFamily: 'Inter, sans-serif', flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#F5F5F7', fontSize: 9, fontWeight: 600, fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
                  {item.label}
                </div>
                <div style={{ color: 'rgba(245,245,247,0.38)', fontSize: 7.5, fontFamily: 'Inter, sans-serif', marginTop: 1 }}>
                  {item.sub}
                </div>
              </div>
              {/* Checkmark SVG animado */}
              <div style={{ opacity: ckOp }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke={item.color} strokeWidth="1" />
                  <path
                    d="M4 7l2 2 4-4"
                    stroke={item.color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="8"
                    strokeDashoffset={`${8 - ckDash}`}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer button */}
      <div style={{
        marginTop: 8,
        background: 'linear-gradient(90deg, #0071E3 0%, #5856D6 100%)',
        borderRadius: 8,
        padding: '7px 0',
        textAlign: 'center',
        color: '#fff',
        fontSize: 8,
        fontWeight: 800,
        letterSpacing: '0.16em',
        fontFamily: 'Inter, sans-serif',
        textTransform: 'uppercase' as const,
        opacity: ci(frame, [80, 92], [0, 1]),
      }}>
        Gratis no squad
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// CENA 1 — O CUSTO
//
// Layout: centralizado — tipografia dominante
// Entrada: de BAIXO (entryUp por elemento)
// Saída: para ESQUERDA (exitTo left)
// Exit começa no frame local 110
// ════════════════════════════════════════════════════════

const EXIT1 = 110;

const Scene1: React.FC = () => {
  const T = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // R$800: spring para física real
  const numSp = spring({ frame, fps, config: SPRING.badge, delay: 18 });
  const numSc = interpolate(numSp, [0, 1], [0.7, 1]);
  const numOp = ci(frame - 18, [0, 10], [0, 1]);
  // Float sutil na fase estável (Micro-animação — Parte 4.1)
  const floatY = Math.sin(frame * 0.025) * 3;

  // Linha de acento cresce depois do número
  const lineW = ci(frame, [28, 48], [0, 100]);

  // Estilos de saída (Mandamento 9 — Saída Quadrupla)
  const ex = (stagger: number) => exitTo(frame, EXIT1 + stagger, 'left');

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor={T.glow1} />
      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
        paddingBottom: '10%',
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>

          {/* Label ZEUS-MOTION */}
          <div style={{ ...mergeStyles(entryUp(frame, 0, 18), ex(0)), marginBottom: 32 }}>
            <span style={{
              ...TV.caption,
              fontFamily: T.font,
              color: T.label,
              letterSpacing: '0.28em',
              textTransform: 'uppercase' as const,
            }}>
              ZEUS-MOTION
            </span>
          </div>

          {/* "Para criar uma animação profissional," — palavra por palavra */}
          <AnimatedText
            text="Para criar uma animação profissional,"
            delay={4}
            exitStart={EXIT1 + 0}
            exitDir="left"
            stagger={2}
            wordDur={18}
            style={{
              ...TV.body,
              fontFamily: T.font,
              color: T.secondary,
              justifyContent: 'center',
              marginBottom: 20,
            }}
          />

          {/* R$ 800 — hero com spring + float */}
          <div style={{
            ...mergeStyles(
              { opacity: numOp, transform: `scale(${numSc}) translateY(${floatY}px)`, filter: 'none' },
              ex(2)
            ),
            marginBottom: 8,
          }}>
            <span style={{
              ...TV.hero,
              fontFamily: T.font,
              color: T.primary,
              display: 'block',
            }}>
              R$ 800
            </span>
          </div>

          {/* Linha de acento */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 24,
          }}>
            <div style={{
              ...ex(4),
              width: `${lineW}%`,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${T.red}, transparent)`,
              borderRadius: 2,
              boxShadow: `0 0 10px ${T.red}55`,
            }} />
          </div>

          {/* "seria o que um mentor pagaria." — palavra por palavra, delay após linha */}
          <AnimatedText
            text="seria o que um mentor pagaria."
            delay={52}
            exitStart={EXIT1 + 6}
            exitDir="left"
            stagger={2}
            wordDur={18}
            style={{
              ...TV.body,
              fontFamily: T.font,
              color: T.secondary,
              justifyContent: 'center',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// CENA 2 — A VIRADA
//
// Layout: alinhado à esquerda — hierarquia por tamanho
// Entrada: da DIREITA (Mandamento 6: S1 saiu esquerda)
// Saída: para CIMA
// Exit começa no frame local 108
// ════════════════════════════════════════════════════════

const EXIT2 = 108;

const Scene2: React.FC = () => {
  const T = useTheme();
  const frame = useCurrentFrame();

  // Linha separadora cresce durante build-up
  const lineW = ci(frame, [44, 64], [0, 75]);
  const lineEx = exitTo(frame, EXIT2 + 4, 'top', 400, 14);

  const ex = (stagger: number) => exitTo(frame, EXIT2 + stagger, 'top');

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor={T.glow2} />
      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 80px',
        paddingBottom: '12%',
      }}>
        <div style={{ width: '100%' }}>

          {/* "Com ZEUS-MOTION," — label pequeno entra da direita */}
          <AnimatedText
            text="Com ZEUS-MOTION,"
            delay={0}
            exitStart={EXIT2}
            exitDir="top"
            stagger={2}
            wordDur={20}
            style={{
              ...TV.caption,
              fontFamily: T.font,
              color: T.accentColor,
              letterSpacing: '0.1em',
              marginBottom: 24,
            }}
          />

          {/* "qualquer mentor faz isso." — hero palavra por palavra, destaque em "mentor" */}
          <AnimatedText
            text="qualquer mentor faz isso."
            delay={6}
            exitStart={EXIT2 + 2}
            exitDir="top"
            highlightWords={[1]}
            stagger={3}
            wordDur={22}
            style={{
              ...TV.headline,
              fontFamily: T.font,
              color: T.primary,
              fontWeight: 800,
              marginBottom: 36,
              flexWrap: 'wrap',
            }}
          />

          {/* Linha separadora */}
          <div style={{ marginBottom: 30 }}>
            <div style={{
              ...lineEx,
              width: `${lineW}%`,
              height: 1,
              background: `linear-gradient(90deg, ${T.accentColor}55, transparent)`,
            }} />
          </div>

          {/* "Sem contratar ninguém. Em minutos." */}
          <AnimatedText
            text="Sem contratar ninguém. Em minutos."
            delay={52}
            exitStart={EXIT2 + 6}
            exitDir="top"
            stagger={2}
            wordDur={18}
            style={{
              ...TV.body,
              fontFamily: T.font,
              color: T.secondary,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// CENA 3 — PROVA: O QUE ESTÁ INCLUSO
//
// Layout: label topo + phone centralizado (hero único)
// Entrada: de BAIXO (Mandamento 6: S2 saiu para cima)
// Saída: para DIREITA (exitToNB — phone tem gradient text interno)
// Exit começa no frame local 128
// ════════════════════════════════════════════════════════

const EXIT3 = 128;

const Scene3: React.FC = () => {
  const T = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label — entryUp + exitTo right
  const labelIn = entryUp(frame, 0, 20);
  const labelEx = exitTo(frame, EXIT3, 'right', 800, 14);

  // Phone — spring de baixo + float sutil
  const phoneSp = spring({ frame, fps, config: SPRING.card, delay: 10 });
  const phoneY  = interpolate(phoneSp, [0, 1], [140, 0]);
  const phoneOp = ci(frame - 10, [0, 12], [0, 1]);
  const floatY  = Math.sin(frame * 0.020) * 5;

  // Phone tem PhoneScreen com WebkitBackgroundClip:text → usar exitToNB (sem blur)
  const phoneEx = exitToNB(frame, EXIT3, 'right', 1200, 18);

  // Glow pulsa suavemente
  const glowP = Math.sin(frame * 0.06) * 0.5 + 0.5;
  const glowOp = interpolate(glowP, [0, 1], [0.10, 0.22]);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor={T.glow3} />
      <AbsoluteFill style={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 100,
        paddingBottom: 80,
        paddingLeft: 40,
        paddingRight: 40,
      }}>
        {/* Label */}
        <div style={{ ...mergeStyles(labelIn, labelEx), marginBottom: 40 }}>
          <span style={{
            ...TV.caption,
            fontFamily: T.font,
            color: T.label,
            letterSpacing: '0.28em',
            textTransform: 'uppercase' as const,
          }}>
            O QUE ESTÁ INCLUSO
          </span>
        </div>

        {/* Phone — hero centralizado */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
          {/* Phone wrapper — sem filter (Regra ERRO1: parent filter quebra background-clip no filho) */}
          <div style={{
            opacity:   phoneOp * (phoneEx.opacity as number ?? 1),
            transform: `translateY(${phoneY + floatY}px) ${phoneEx.transform ?? ''}`,
            position: 'relative',
          }}>
            {/* Glow por trás — em AbsoluteFill separada para não contaminar phone */}
            <div style={{
              position: 'absolute',
              inset: -80,
              background: `radial-gradient(ellipse at 50% 50%, ${T.accentColor}${Math.round(glowOp * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              filter: 'blur(50px)',
              zIndex: 0,
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <DeviceFrame device="iphone" delay={0} scale={1.5} screenWidth={360}>
                <PhoneScreen />
              </DeviceFrame>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// CENA 4 — VALOR: ANTES VS DEPOIS
//
// Layout: split vertical — "FREELANCER HOJE / R$800" topo,
//         "COM ZEUS-MOTION / INCLUSO" embaixo
// Entrada: da ESQUERDA (Mandamento 6: S3 saiu direita)
// Saída: para BAIXO
// Exit começa no frame local 128
// ════════════════════════════════════════════════════════

const EXIT4 = 128;

const Scene4: React.FC = () => {
  const T = useTheme();
  const frame = useCurrentFrame();

  // Bloco "ANTES" entra da esquerda
  const beforeLabelIn = entryFrom(frame, 0,  'left', 500, 22);
  const beforeLabelEx = exitTo(frame, EXIT4,     'bottom', 600, 16);
  const rIn           = entryFrom(frame, 8,  'left', 600, 24);
  const rEx           = exitTo(frame, EXIT4 + 2, 'bottom', 700, 16);

  // Separador central
  const divW  = ci(frame, [20, 36], [0, 100]);
  const divEx = exitTo(frame, EXIT4 + 4, 'bottom', 400, 14);

  // Bloco "DEPOIS" — stagger reduzido para INCLUSO aparecer cedo
  const afterLabelIn = entryFrom(frame, 14, 'left', 400, 20);
  const afterLabelEx = exitTo(frame, EXIT4 + 6, 'bottom', 600, 16);

  // INCLUSO: gradient text → entryFromNB + exitToNB (sem blur no pai — Regra ERRO1)
  // dist reduzida 800→500, delay 44→22, dur 28→22 — aparece completo antes de f50
  const inclusoIn = entryFromNB(frame, 22, 'left', 500, 22);
  const inclusoEx = exitToNB(frame, EXIT4 + 8, 'bottom', 800, 16);
  const floatY    = Math.sin(frame * 0.030) * 4;

  // Merge opacity dos dois (sem filter nos transforms)
  const inclusoOp = (inclusoIn.opacity as number ?? 1) * (inclusoEx.opacity as number ?? 1);
  const inclusoTx = `${inclusoIn.transform ?? ''} ${inclusoEx.transform ?? ''} translateY(${floatY}px)`;

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor={T.glow4} />
      <AbsoluteFill style={{
        justifyContent: 'center',
        padding: '0 80px',
        paddingBottom: '10%',
        flexDirection: 'column',
      }}>

        {/* TOPO — FREELANCER HOJE */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...mergeStyles(beforeLabelIn, beforeLabelEx), marginBottom: 8 }}>
            <span style={{
              ...TV.caption,
              fontFamily: T.font,
              color: T.label,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
            }}>
              FREELANCER HOJE
            </span>
          </div>
          <div style={mergeStyles(rIn, rEx)}>
            <span style={{
              ...TV.headline,
              fontFamily: T.font,
              color: T.secondary,
              textDecoration: 'line-through',
              textDecorationColor: `${T.red}88`,
            }}>
              R$ 800
            </span>
          </div>
        </div>

        {/* Separador */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            ...divEx,
            width: `${divW}%`,
            height: 1,
            background: 'rgba(245,245,247,0.10)',
          }} />
        </div>

        {/* BAIXO — COM ZEUS-MOTION */}
        <div>
          <div style={{ ...mergeStyles(afterLabelIn, afterLabelEx), marginBottom: 10 }}>
            <span style={{
              ...TV.caption,
              fontFamily: T.font,
              color: T.green,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
            }}>
              COM ZEUS-MOTION
            </span>
          </div>

          {/* INCLUSO: wrapper SEM filter (Regra ERRO1 ERROS-REMOTION) */}
          <div style={{ opacity: inclusoOp, transform: inclusoTx }}>
            <span style={{
              display: 'block',
              fontSize: 148,
              fontWeight: 900,
              fontFamily: T.font,
              letterSpacing: -4,
              lineHeight: 0.9,
              background: T.inclusoGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              INCLUSO
            </span>
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// CENA 5 — CTA: COMENTE ZEUS-MOTION
//
// Layout: centralizado — badge + call-to-action + typed text
// Entrada: de CIMA (Mandamento 6: S4 saiu para baixo)
// Sem saída (cena final)
// ════════════════════════════════════════════════════════

const Scene5: React.FC = () => {
  const T = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge — bounce com spring
  const badgeSp = spring({ frame, fps, config: SPRING.bouncy, delay: 0 });
  const badgeSc = interpolate(badgeSp, [0, 1], [0.5, 1]);
  const badgeOp = ci(frame, [0, 12], [0, 1]);
  // Pulse sutil na fase estável
  const pulse = 1 + Math.sin(frame * 0.08) * 0.018;

  // "Quer o squad? Comente abaixo:" — entra de cima
  const subIn = entryFrom(frame, 20, 'top', 180, 22);

  // "zeus-motion" — caractere por caractere
  const CHARS = 'zeus-motion'.split('');
  const CHAR_DELAY = 5; // 5f por caractere

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor={T.glow5} />
      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
        paddingBottom: '12%',
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>

          {/* Badge ZEUS-MOTION */}
          <div style={{
            opacity: badgeOp,
            transform: `scale(${badgeSc * pulse})`,
            display: 'inline-block',
            marginBottom: 32,
          }}>
            <div style={{
              display: 'inline-block',
              border: `2px solid ${T.accentColor}`,
              borderRadius: 14,
              padding: '10px 32px',
              boxShadow: `0 0 24px ${T.accentColor}30, inset 0 0 16px ${T.accentColor}08`,
            }}>
              <span style={{
                ...TV.caption,
                fontFamily: T.font,
                color: T.primary,
                fontSize: 36,
                letterSpacing: '0.14em',
                fontWeight: 900,
              }}>
                ZEUS-MOTION
              </span>
            </div>
          </div>

          {/* "Quer o squad? Comente abaixo:" */}
          <div style={{ ...subIn, marginBottom: 20 }}>
            <span style={{
              ...TV.body,
              fontFamily: T.font,
              color: T.secondary,
            }}>
              Quer o squad? Comente abaixo:
            </span>
          </div>

          {/* "zeus-motion" — digitando caractere por caractere */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.02em' }}>
            {CHARS.map((char, i) => {
              const cs = 38 + i * CHAR_DELAY;
              const op = ci(frame, [cs, cs + 6], [0, 1]);
              const y  = ci(frame, [cs, cs + 8], [22, 0], Easing.out(Easing.cubic));
              return (
                <span key={i} style={{
                  display: 'inline-block',
                  opacity: op,
                  transform: `translateY(${y}px)`,
                  fontSize: 88,
                  fontWeight: 800,
                  fontFamily: T.font,
                  color: T.primary,
                  letterSpacing: -2,
                  lineHeight: 1,
                }}>
                  {char}
                </span>
              );
            })}
          </div>

        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// COMPOSITION PRINCIPAL
//
// Sequence com overlap de 10f — Zero Frames Vazios (Mandamento 7)
// Último frame: 520 + 120 = 640
// ════════════════════════════════════════════════════════

interface SquadPromoProps {
  theme?: ThemeName;
}

export const SquadPromo: React.FC<SquadPromoProps> = ({ theme = 'zeus' }) => {
  const activeTheme = THEMES[theme];
  return (
    <ThemeCtx.Provider value={activeTheme}>
      <AbsoluteFill style={{ background: activeTheme.bg }}>

        {/* S1: from=0   dur=130  — sai ESQUERDA  @ f110 */}
        <Sequence from={0} durationInFrames={130}>
          <Scene1 />
        </Sequence>

        {/* S2: from=120 dur=130  — entra DIREITA,  sai CIMA  @ f108 */}
        <Sequence from={120} durationInFrames={130}>
          <Scene2 />
        </Sequence>

        {/* S3: from=240 dur=150  — entra BAIXO,   sai DIREITA @ f128 */}
        <Sequence from={240} durationInFrames={150}>
          <Scene3 />
        </Sequence>

        {/* S4: from=380 dur=150  — entra ESQUERDA, sai BAIXO  @ f128 */}
        <Sequence from={380} durationInFrames={150}>
          <Scene4 />
        </Sequence>

        {/* S5: from=520 dur=120  — entra CIMA, sem saída */}
        <Sequence from={520} durationInFrames={120}>
          <Scene5 />
        </Sequence>

      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};
