import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrand } from "../../brand/loader";
import { AnimatedArrow } from "../../modules/shapes/AnimatedArrow";
import { BlurReveal } from "../../modules/text-system/BlurReveal";
import { StaggeredFadeUp } from "../../modules/text-system/StaggeredFadeUp";

interface ArrowExplainerProps {
  brand?: string;
  title?: string;
  steps?: string[];
}

export const ArrowExplainer: React.FC<ArrowExplainerProps> = ({
  brand = "universal-default",
  title = "Como funciona",
  steps = ["Passo 1", "Passo 2", "Passo 3"],
}) => {
  const b = loadBrand(brand);

  return (
    <AbsoluteFill style={{ background: b.colors.bg, padding: "120px 80px", justifyContent: "center" }}>
      <BlurReveal style={{ marginBottom: 60 }}>
        <div style={{ color: b.colors.text, fontSize: 56, fontWeight: 700, fontFamily: b.typography.display }}>
          {title}
        </div>
      </BlurReveal>
      <StaggeredFadeUp
        items={steps.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 24,
              border: `2px solid ${b.colors.text}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: b.colors.text, fontSize: 20, fontWeight: 700,
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <AnimatedArrow length={40} color={b.colors.text_secondary} delay={20 + i * 10} />
            )}
            <span style={{ color: b.colors.text, fontSize: 36, fontFamily: b.typography.body }}>{step}</span>
          </div>
        ))}
        delay={20}
        staggerDelay={12}
      />
    </AbsoluteFill>
  );
};
