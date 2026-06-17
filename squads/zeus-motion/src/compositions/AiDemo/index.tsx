import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrand } from "../../brand/loader";
import { TypeWriter } from "../../modules/text-system/TypeWriter";
import { BlurReveal } from "../../modules/text-system/BlurReveal";
import { DeviceFrame } from "../../modules/device/DeviceFrame";
import { HandCursor } from "../../modules/cursor/HandCursor";

interface AiDemoProps {
  brand?: string;
  prompt?: string;
  title?: string;
}

export const AiDemo: React.FC<AiDemoProps> = ({
  brand = "universal-default",
  prompt = "Crie um vídeo de 30s apresentando meu produto...",
  title = "IA gerando seu vídeo",
}) => {
  const b = loadBrand(brand);

  return (
    <AbsoluteFill style={{ background: b.colors.bg, justifyContent: "center", alignItems: "center", padding: "0 60px", flexDirection: "column" }}>
      <BlurReveal style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{ color: b.colors.text, fontSize: 48, fontWeight: 700, fontFamily: b.typography.display }}>
          {title}
        </div>
      </BlurReveal>
      <DeviceFrame device="browser" delay={10} style={{ width: "100%" }}>
        <div style={{ background: "#0A0A0A", padding: 32, minHeight: 200 }}>
          <div style={{ color: "#888888", fontSize: 14, marginBottom: 12, fontFamily: "monospace" }}>
            Prompt:
          </div>
          <TypeWriter
            text={prompt}
            delay={30}
            charsPerFrame={0.8}
            style={{ color: "#30D158", fontSize: 20, fontFamily: "monospace", lineHeight: 1.6 }}
          />
        </div>
      </DeviceFrame>
      <HandCursor x={480} y={600} gesture="tap" delay={20} />
    </AbsoluteFill>
  );
};
