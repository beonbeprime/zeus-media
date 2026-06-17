import React from "react";
import { AbsoluteFill } from "remotion";
import { C, TIMING, SAFE, FONT, FS } from "./GroovyTokens";
import { GroovyEntrance } from "./GroovyEntrance";
import { SwirlColumn, GroovyGrain, DisplayOut } from "./GroovyElements";

export const GroovyMotion: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT.body }}>
      {/* Camada 1: SwirlColumn hourglass de fundo (corte seco, sem animação direcional) */}
      <AbsoluteFill style={{ opacity: 0.55 }}>
        <SwirlColumn />
      </AbsoluteFill>

      {/* Camada 2: Grain de papel (mix-blend-mode multiply) */}
      <AbsoluteFill>
        <GroovyGrain />
      </AbsoluteFill>

      {/* Camada 3: Conteúdo animado */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: SAFE.padX,
          paddingRight: SAFE.padX,
          paddingTop: SAFE.padTop,
          paddingBottom: 1920 - SAFE.bottom,
        }}
      >
        {/* Hook principal — entra no frame 0, sai no frame 90 */}
        <GroovyEntrance delay={0} exitStart={TIMING.holdEnd} exitDir="bottom">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: -8,
            }}
          >
            <DisplayOut style={{ fontSize: FS.hook, lineHeight: 0.9 }}>
              GROOVY
            </DisplayOut>
            <DisplayOut
              style={{
                fontSize: FS.hook,
                lineHeight: 0.9,
                WebkitTextStroke: `4px ${C.teal}`,
                textShadow: `8px 8px 0 ${C.orange}`,
              }}
            >
              MOTION
            </DisplayOut>
          </div>
        </GroovyEntrance>

        {/* Subtitle — entra com delay 8f */}
        <GroovyEntrance delay={8} exitStart={TIMING.holdEnd} exitDir="top">
          <div
            style={{
              fontFamily: FONT.groovy,
              fontSize: FS.subtitle,
              color: C.plum,
              letterSpacing: "0.06em",
              textAlign: "center",
              marginTop: 32,
              opacity: 0.85,
            }}
          >
            Sistema Visual 70s
          </div>
        </GroovyEntrance>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
