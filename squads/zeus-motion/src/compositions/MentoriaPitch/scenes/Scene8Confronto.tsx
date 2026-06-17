/**
 * Scene8Confronto — VOID | dur=293f (9.8s)
 * "Isso fica pronto em 21 dias e você recebe essa estrutura
 *  pronta para vender a sua mentoria sem precisar pagar uma
 *  agência de tráfego."
 *
 * Handheld shake suave (f0-130) — amplitude reduzida, smooth
 * Label  (f20): "Isso fica pronto em"         — blur Y entry
 * Punch  (f45): "21 DIAS." hero               — scaleBlur AE
 * Impact shake suave (f45-55)
 * Sub    (f100): "Você recebe a estrutura pronta" — blur Y entry
 * Crash  (f145): "Sem pagar agência de tráfego." — blur Y entry
 * Push zoom (f200-293): scale 1→1.6 com velocity blur
 * Safe zone: y=160 a y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, spring, useVideoConfig } from "remotion";
import { ci, mBlur, scaleBlur, VoidBackground } from "../index";
import { FONT, COLORS } from "../design-system";

const DUR = 293;

export const Scene8Confronto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = ci(frame, [0, 12],  [0, 1]);
  const fadeOut = ci(frame, [DUR - 15, DUR], [1, 0]);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // ─── Camera: Handheld shake suave (f0-130) — amplitude menor, mais smooth ──
  const shakeActive = frame < 130;
  // Usando sin com frequência baixa para movimento mais orgânico e suave
  const shakeX = shakeActive
    ? (Math.sin(frame * 1.4) * 1.2 + Math.cos(frame * 2.3) * 0.7) * ci(frame, [100, 130], [1, 0])
    : 0;
  const shakeY = shakeActive
    ? (Math.cos(frame * 1.1) * 1.2 + Math.sin(frame * 2.8) * 0.5) * ci(frame, [100, 130], [1, 0])
    : 0;

  // Push zoom com velocity blur
  const pushScale     = ci(frame, [200, DUR], [1, 1.6], Easing.in(Easing.cubic));
  const pushScalePrev = ci(Math.max(0, frame - 1), [200, DUR], [1, 1.6], Easing.in(Easing.cubic));
  const pushBlur      = Math.abs(pushScale - pushScalePrev) * 120;

  // ─── Entradas ─────────────────────────────────────────────────────────────
  const labelIn  = ci(frame, [20, 40], [0, 1]);
  const punchIn  = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 24, stiffness: 220 }, from: 2.8, to: 1.0 });
  const punchOpacity = ci(frame, [45, 58], [0, 1]);
  const subIn    = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 22, stiffness: 160 } });
  const crashIn  = spring({ frame: Math.max(0, frame - 145), fps, config: { damping: 22, stiffness: 160 } });

  // Impact shake suave (f45-58) — amplitude reduzida, decay mais gradual
  const impactShake = frame >= 45 && frame <= 58
    ? Math.sin((frame - 45) * 3.5) * 7 * ci(frame, [45, 58], [1, 0], Easing.out(Easing.cubic))
    : 0;

  const totalShakeX = shakeX + impactShake;
  const totalShakeY = shakeY + Math.abs(impactShake) * 0.3;

  // Blur do push zoom aplicado ao container todo
  const containerBlur = pushBlur;

  return (
    <AbsoluteFill>
      <div style={{ opacity: sceneOpacity, width: "100%", height: "100%", position: "relative", perspective: "1200px" }}>
        <VoidBackground />

        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 160,
            paddingBottom: 640,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${totalShakeX}px, ${totalShakeY}px) scale(${pushScale})`,
            transformOrigin: "50% 720px",
            filter: `blur(${containerBlur}px)`,
          }}
        >
          {/* "Isso fica pronto em" */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              textAlign: "center",
              letterSpacing: "-0.3px",
              opacity: labelIn,
              transform: `translateY(${ci(labelIn, [0, 1], [-24, 0])}px)`,
              filter: `blur(${mBlur(frame, 20, 16, 8)}px)`,
              marginBottom: 8,
            }}
          >
            Isso fica pronto em
          </div>

          {/* "21 DIAS." — big hero punch com scaleBlur */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 136,
              fontWeight: 900,
              letterSpacing: "-5px",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 0.95,
              opacity: punchOpacity,
              transform: `scale(${Math.max(0.1, punchIn)})`,
              filter: `blur(${scaleBlur(Math.max(0.1, punchIn), 6)}px)`,
              textShadow: "0 0 60px rgba(255,255,255,0.2), 0 0 120px rgba(255,255,255,0.1)",
              marginBottom: 40,
            }}
          >
            21<br />DIAS.
          </div>

          {/* "Você recebe a estrutura pronta" */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 300,
              color: "rgba(255,255,255,0.55)",
              textAlign: "center",
              letterSpacing: "-0.2px",
              opacity: subIn,
              transform: `translateY(${ci(subIn, [0, 1], [28, 0])}px)`,
              filter: `blur(${mBlur(frame, 100, 14, 8)}px)`,
              marginBottom: 14,
            }}
          >
            Você recebe a estrutura pronta
          </div>

          {/* "Sem pagar agência de tráfego." */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-1px",
              color: COLORS.accent,
              textAlign: "center",
              opacity: ci(Math.max(0, frame - 145), [0, 16], [0, 1]),
              transform: `translateY(${ci(crashIn, [0, 1], [28, 0])}px)`,
              filter: `blur(${mBlur(frame, 145, 14, 8)}px)`,
              paddingLeft: 60,
              paddingRight: 60,
            }}
          >
            sem pagar agência de tráfego.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
