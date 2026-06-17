import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrand } from "../../brand/loader";
import { AnimatedMetric } from "../../modules/dataviz/AnimatedMetric";
import { MaskedSlide } from "../../modules/text-system/MaskedSlide";
import { StaggeredFadeUp } from "../../modules/text-system/StaggeredFadeUp";

interface DataStoryProps {
  brand?: string;
  title?: string;
  metrics?: Array<{ value: number; label: string; prefix?: string; suffix?: string }>;
}

export const DataStory: React.FC<DataStoryProps> = ({
  brand = "universal-default",
  title = "Resultados",
  metrics = [
    { value: 127, label: "Alunos transformados", suffix: "+" },
    { value: 4.9, label: "Avaliação média", suffix: "/5" },
    { value: 89, label: "Taxa de conclusão", suffix: "%" },
  ],
}) => {
  const b = loadBrand(brand);

  return (
    <AbsoluteFill style={{ background: b.colors.bg, padding: "120px 80px", justifyContent: "center" }}>
      <MaskedSlide delay={0} style={{ marginBottom: 60 }}>
        <div style={{ color: b.colors.text, fontSize: 56, fontWeight: 700, fontFamily: b.typography.display }}>{title}</div>
      </MaskedSlide>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
        {metrics.map((m, i) => (
          <AnimatedMetric
            key={i}
            value={m.value}
            label={m.label}
            prefix={m.prefix}
            suffix={m.suffix}
            delay={20 + i * 15}
            color={b.colors.text}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
