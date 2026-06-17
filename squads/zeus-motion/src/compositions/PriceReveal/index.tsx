import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrand } from "../../brand/loader";
import { CurrencyCounter } from "../../modules/pan-quente/counters/CurrencyCounter";
import { BlurReveal } from "../../modules/text-system/BlurReveal";
import { StampEffect } from "../../modules/pan-quente/emphasis/StampEffect";
import { MaskedSlide } from "../../modules/text-system/MaskedSlide";

interface PriceRevealProps {
  brand?: string;
  price?: number;
  originalPrice?: number;
  label?: string;
  cta?: string;
}

export const PriceReveal: React.FC<PriceRevealProps> = ({
  brand = "universal-default",
  price = 97,
  originalPrice = 297,
  label = "Oferta por tempo limitado",
  cta = "Garanta agora",
}) => {
  const b = loadBrand(brand);

  return (
    <AbsoluteFill style={{ background: b.colors.bg, justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <div style={{ textAlign: "center" }}>
        <BlurReveal>
          <div style={{ color: b.colors.text_secondary, fontSize: 28, fontFamily: b.typography.body, marginBottom: 8 }}>
            {label}
          </div>
        </BlurReveal>
        <BlurReveal delay={10}>
          <div style={{ color: "#888888", fontSize: 40, fontFamily: b.typography.display, textDecoration: "line-through", marginBottom: 8 }}>
            <CurrencyCounter to={originalPrice} delay={10} duration={30} />
          </div>
        </BlurReveal>
        <CurrencyCounter
          from={originalPrice}
          to={price}
          delay={40}
          duration={45}
          style={{ color: "#30D158", fontSize: 120, fontWeight: 900, fontFamily: b.typography.display, lineHeight: 1 }}
        />
        <MaskedSlide delay={90} style={{ marginTop: 40 }}>
          <div style={{
            background: "#FFFFFF",
            color: "#000000",
            fontSize: 32,
            fontWeight: 700,
            fontFamily: b.typography.display,
            padding: "20px 60px",
            borderRadius: 100,
            display: "inline-block",
          }}>
            {cta}
          </div>
        </MaskedSlide>
      </div>
    </AbsoluteFill>
  );
};
