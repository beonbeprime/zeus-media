import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrand } from "../../brand/loader";
import { DeviceFrame } from "../../modules/device/DeviceFrame";
import { BlurReveal } from "../../modules/text-system/BlurReveal";
import { CurrencyCounter } from "../../modules/pan-quente/counters/CurrencyCounter";
import { HandCursor } from "../../modules/cursor/HandCursor";
import { CheckmarkDraw } from "../../modules/shapes/CheckmarkDraw";

interface CheckoutDemoProps {
  brand?: string;
  productName?: string;
  price?: number;
  currency?: string;
}

export const CheckoutDemo: React.FC<CheckoutDemoProps> = ({
  brand = "universal-default",
  productName = "Meu Produto Digital",
  price = 97,
  currency = "BRL",
}) => {
  const b = loadBrand(brand);

  return (
    <AbsoluteFill style={{ background: b.colors.bg, justifyContent: "center", alignItems: "center", padding: "0 60px", flexDirection: "column" }}>
      <BlurReveal style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{ color: b.colors.text, fontSize: 48, fontWeight: 700, fontFamily: b.typography.display }}>
          {productName}
        </div>
      </BlurReveal>
      <DeviceFrame device="iphone" delay={10} scale={0.8}>
        <div style={{ background: "#111", padding: 24, height: "100%" }}>
          <div style={{ background: "#1C1C1E", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ color: "#888", fontSize: 14, marginBottom: 8 }}>Total</div>
            <CurrencyCounter to={price} currency={currency} delay={30} duration={40} style={{ color: "#FFFFFF", fontSize: 40, fontWeight: 700 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
            <CheckmarkDraw size={32} color="#30D158" delay={80} />
            <div style={{ color: "#30D158", fontSize: 16 }}>Pagamento confirmado!</div>
          </div>
        </div>
      </DeviceFrame>
      <HandCursor x={400} y={700} gesture="tap" delay={70} />
    </AbsoluteFill>
  );
};
