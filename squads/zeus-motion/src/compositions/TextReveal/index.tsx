import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrand } from "../../brand/loader";
import { BlurReveal } from "../../modules/text-system/BlurReveal";
import { TrackingIn } from "../../modules/text-system/TrackingIn";
import { StaggeredFadeUp } from "../../modules/text-system/StaggeredFadeUp";
import { GradientBackground } from "../../modules/backgrounds/GradientBackground";

interface TextRevealProps {
  brand?: string;
  text?: string;
  subtitle?: string;
  effect?: "blur" | "tracking" | "stagger";
}

export const TextReveal: React.FC<TextRevealProps> = ({
  brand = "universal-default",
  text = "Sua mensagem aqui",
  subtitle = "",
  effect = "blur",
}) => {
  const b = loadBrand(brand);

  return (
    <AbsoluteFill style={{ background: b.colors.bg, justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <GradientBackground from={b.colors.bg} to="#111111" />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        {effect === "blur" && (
          <BlurReveal>
            <div style={{ color: b.colors.text, fontSize: 80, fontWeight: b.typography.weight_display, fontFamily: b.typography.display, lineHeight: 1.1 }}>
              {text}
            </div>
          </BlurReveal>
        )}
        {effect === "tracking" && (
          <TrackingIn>
            <div style={{ color: b.colors.text, fontSize: 80, fontWeight: b.typography.weight_display, fontFamily: b.typography.display, lineHeight: 1.1 }}>
              {text}
            </div>
          </TrackingIn>
        )}
        {subtitle && (
          <BlurReveal delay={20}>
            <div style={{ color: b.colors.text_secondary, fontSize: 32, fontFamily: b.typography.body, marginTop: 24 }}>
              {subtitle}
            </div>
          </BlurReveal>
        )}
      </div>
    </AbsoluteFill>
  );
};
