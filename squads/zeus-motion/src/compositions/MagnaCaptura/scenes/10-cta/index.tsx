/**
 * Scene10 — A Chamada (CTA Final)
 * dur=142f | EXIT_F=null (última cena, sem saída)
 * Convite para preencher formulário — sem venda direta
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { ci, entryFrom, BackgroundBase, SafeZone } from "../../index";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../design-system";

export const Scene10: React.FC = () => {
  const frame = useCurrentFrame();

  // Pulso do botão
  const btnPulse = 0.88 + 0.12 * Math.sin((frame / 30) * Math.PI * 2.4);
  const glowPulse = 0.7 + 0.3 * Math.sin((frame / 30) * Math.PI * 2.4);

  // Stagger individual por elemento
  const eyebrowEntry = entryFrom(frame, "top", 40, 20);
  const line1Entry   = entryFrom(Math.max(0, frame - 10), "bottom", 70, 22);
  const line2Entry   = entryFrom(Math.max(0, frame - 20), "bottom", 70, 22);
  const dividerEntry = entryFrom(Math.max(0, frame - 32), "bottom", 40, 16);
  const subEntry     = entryFrom(Math.max(0, frame - 40), "bottom", 50, 20);
  const btnEntry     = entryFrom(Math.max(0, frame - 50), "bottom", 60, 22);

  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.05)" />

      <SafeZone justify="center">
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Eyebrow */}
          <div style={{
            ...eyebrowEntry,
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 400,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: COLORS.muted,
            textAlign: "center",
            marginBottom: 28,
          }}>
            próximo passo
          </div>

          {/* Headline linha 1 */}
          <div style={{
            ...line1Entry,
            fontFamily: FONT_DISPLAY,
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: COLORS.offWhite,
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 4,
          }}>
            SE VOCÊ ESTÁ
          </div>

          {/* Headline linha 2 — destaque branco */}
          <div style={{
            ...line2Entry,
            fontFamily: FONT_DISPLAY,
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 36,
            color: COLORS.white,
          }}>
            PRONTO
          </div>

          {/* Divider */}
          <div style={{
            ...dividerEntry,
            width: 160,
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)`,
            marginBottom: 32,
          }} />

          {/* Sub — instrução */}
          <div style={{
            ...subEntry,
            fontFamily: FONT_DISPLAY,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: COLORS.muted,
            textAlign: "center",
            marginBottom: 48,
          }}>
            toque no botão abaixo
          </div>

          {/* Botão CTA visual */}
          <div style={{
            ...btnEntry,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: "22px 56px",
            background: COLORS.white,
            borderRadius: 6,
            boxShadow: `0 0 ${28 * glowPulse}px rgba(255,255,255,0.25), 0 4px 32px rgba(0,0,0,0.5)`,
            transform: `${btnEntry.transform ?? ""} scale(${btnPulse})`,
          }}>
            <span style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#080808",
            }}>
              QUERO FAZER PARTE
            </span>
            {/* Seta */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10h14M11 4l6 6-6 6" stroke="#080808" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Micro-texto rodapé safe zone */}
          <div style={{
            marginTop: 28,
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.12em",
            textAlign: "center",
            opacity: ci(frame, [104, 124], [0, 1]),
          }}>
            VAGAS LIMITADAS · MENTORIA MAGNA
          </div>

        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
