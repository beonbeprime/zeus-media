import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrand } from "../../brand/loader";
import { DeviceFrame } from "../../modules/device/DeviceFrame";
import { BlurReveal } from "../../modules/text-system/BlurReveal";
import { MaskedSlide } from "../../modules/text-system/MaskedSlide";

interface DeviceDemoProps {
  brand?: string;
  device?: "iphone" | "android" | "ipad" | "browser";
  title?: string;
  subtitle?: string;
}

export const DeviceDemo: React.FC<DeviceDemoProps> = ({
  brand = "universal-default",
  device = "iphone",
  title = "Seu App Aqui",
  subtitle = "Demo em motion em segundos",
}) => {
  const b = loadBrand(brand);

  return (
    <AbsoluteFill style={{ background: b.colors.bg, alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 60 }}>
      <MaskedSlide delay={0} style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ color: b.colors.text, fontSize: 52, fontWeight: 700, fontFamily: b.typography.display }}>{title}</div>
      </MaskedSlide>
      <DeviceFrame device={device} delay={10} scale={0.85}>
        <div style={{ background: "#111", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#888", fontSize: 18 }}>Conteúdo do app</div>
        </div>
      </DeviceFrame>
      <BlurReveal delay={30} style={{ marginTop: 32, textAlign: "center" }}>
        <div style={{ color: b.colors.text_secondary, fontSize: 24, fontFamily: b.typography.body }}>{subtitle}</div>
      </BlurReveal>
    </AbsoluteFill>
  );
};
