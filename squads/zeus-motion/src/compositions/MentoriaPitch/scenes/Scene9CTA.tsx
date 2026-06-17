/**
 * Scene9CTA — FLASH | dur=207f (6.9s no Sequence — DUR=336 nunca é alcançado)
 * "Quer sua mentoria vendendo em 21 dias?"
 * Instagram pill @black.fabricadementores + cursor animado + click "Seguir"->"Seguindo"
 *
 * Aterrissagem zoom out + velocity blur (f0-60)
 * Headline (f5): blur Y entry
 * Mockup (f20): scaleBlur AE punch + blur Y
 * Tagline (f35): blur Y entry
 * Cursor entra de baixo (f100-120), click f125
 * Safe zone: conteudo dentro de y=160 a y=1280
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, spring, useVideoConfig, interpolate } from "remotion";
import { ci, mBlur, scaleBlur, FlashBackground } from "../index";
import { FONT, COLORS } from "../design-system";

const DUR = 336;

export const Scene9CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Fade entrada/saida ───────────────────────────────────────────────────
  const fadeIn  = ci(frame, [0, 15], [0, 1]);
  const fadeOut = ci(frame, [DUR - 50, DUR], [1, 0], Easing.out(Easing.cubic));
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // ─── Aterrissagem: zoom out com velocity blur ─────────────────────────────
  const zoomOut     = ci(frame, [0, 60], [1.6, 1.0], Easing.out(Easing.cubic));
  const zoomOutPrev = ci(Math.max(0, frame - 1), [0, 60], [1.6, 1.0], Easing.out(Easing.cubic));
  const zoomBlur    = Math.abs(zoomOut - zoomOutPrev) * 140;

  // ─── Entradas suaves — AE Easy Ease ──────────────────────────────────────
  const headlineIn  = spring({ frame: Math.max(0, frame - 5),  fps, config: { damping: 22, stiffness: 160 } });
  const mockupSlide = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 22, stiffness: 160 } });
  const mockupScale = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 24, stiffness: 200 }, from: 1.45, to: 1.0 });
  const taglineIn   = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 22, stiffness: 160 } });

  // blur combinado do mockup: decaimento temporal + blur proporcional ao scale
  const mockupBlur = Math.max(mBlur(frame, 20, 14, 8), scaleBlur(Math.max(0.1, mockupScale), 7));

  // ─── Cursor animado (f100-120, desaparece f145) ───────────────────────────
  const cursorX = ci(frame, [100, 120], [200, 0], Easing.out(Easing.cubic));
  const cursorY = ci(frame, [100, 120], [400, 0], Easing.out(Easing.cubic));
  const cursorOpacity = interpolate(frame, [100, 108, 140, 145], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Click f125: botão muda ───────────────────────────────────────────────
  const buttonClick = spring({ frame: Math.max(0, frame - 125), fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });
  const buttonScale = ci(buttonClick, [0, 1], [0.9, 1]);
  const isClicked   = frame >= 125;
  const buttonBg    = isClicked ? "#E5E5EA" : COLORS.blue;
  const buttonText  = isClicked ? "Seguindo" : "Seguir";
  const buttonColor = isClicked ? COLORS.dark : "#FFFFFF";

  return (
    <AbsoluteFill>
      <div
        style={{
          opacity: sceneOpacity,
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <FlashBackground />

        {/* Grupo zoom out com velocity blur — centrado na safe zone y=160 a y=1280 */}
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
            transform: `scale(${zoomOut})`,
            transformOrigin: "50% 720px",
            filter: `blur(${zoomBlur}px)`,
          }}
        >
          {/* Headline */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: "-0.5px",
              color: COLORS.dark,
              textAlign: "center",
              opacity: headlineIn,
              transform: `translateY(${ci(headlineIn, [0, 1], [-30, 0])}px)`,
              filter: `blur(${mBlur(frame, 5, 16, 10)}px)`,
              marginBottom: 48,
              paddingLeft: 40,
              paddingRight: 40,
            }}
          >
            Quer sua mentoria vendendo em 21 dias?
          </div>

          {/* Instagram pill mockup — scaleBlur AE punch */}
          <div
            style={{
              position: "relative",
              opacity: ci(Math.max(0, frame - 20), [0, 12], [0, 1]),
              transform: `translateY(${ci(mockupSlide, [0, 1], [60, 0])}px) scale(${Math.max(0.1, mockupScale)})`,
              filter: `blur(${mockupBlur}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E5EA",
                borderRadius: 50,
                boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04)",
                padding: "10px 16px 10px 10px",
                gap: 12,
                width: 380,
              }}
            >
              {/* Avatar circular */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #000 0%, #333 100%)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.8)" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.6)" />
                </svg>
              </div>

              {/* Handle */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "-0.3px",
                    color: COLORS.dark,
                  }}
                >
                  @black.fabricadementores
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: COLORS.grayText, marginTop: 2 }}>
                  Mentoria · Negócios
                </div>
              </div>

              {/* Botão Seguir */}
              <div
                style={{
                  backgroundColor: buttonBg,
                  color: buttonColor,
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 10,
                  padding: "10px 16px",
                  flexShrink: 0,
                  transform: `scale(${buttonScale})`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {buttonText}
              </div>
            </div>

            {/* Cursor SVG animado */}
            <svg
              width="28"
              height="34"
              viewBox="0 0 32 40"
              style={{
                position: "absolute",
                right: 50 + cursorX,
                bottom: -16 + cursorY,
                opacity: cursorOpacity,
                transform: "rotate(-10deg)",
                pointerEvents: "none",
              }}
            >
              <path
                d="M2 2L2 30L10 22L16 36L20 34L14 20L26 20Z"
                fill={COLORS.dark}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: 40,
              fontFamily: FONT,
              fontSize: 18,
              fontWeight: 300,
              color: COLORS.grayText,
              letterSpacing: "0px",
              opacity: taglineIn,
              transform: `translateY(${ci(taglineIn, [0, 1], [24, 0])}px)`,
              filter: `blur(${mBlur(frame, 35, 14, 8)}px)`,
              textAlign: "center",
              paddingLeft: 40,
              paddingRight: 40,
            }}
          >
            Siga e veja como receber o funil pronto
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
