import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { loadBrand } from "../../brand/loader";
import { BlurReveal } from "../../modules/text-system/BlurReveal";
import { WordByWord } from "../../modules/text-system/WordByWord";
import { DipToBlack } from "../../modules/pan-quente/transitions/DipToBlack";
import { CheckmarkDraw } from "../../modules/shapes/CheckmarkDraw";

interface ProblemSolutionProps {
  brand?: string;
  problem?: string;
  solution?: string;
}

export const ProblemSolution: React.FC<ProblemSolutionProps> = ({
  brand = "universal-default",
  problem = "O problema que seu cliente enfrenta",
  solution = "A solução que você oferece",
}) => {
  const b = loadBrand(brand);

  const ProblemScene = () => (
    <AbsoluteFill style={{ background: b.colors.bg, justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <div style={{ textAlign: "center" }}>
        <BlurReveal>
          <div style={{ color: "#FF453A", fontSize: 28, fontFamily: b.typography.body, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>
            O PROBLEMA
          </div>
        </BlurReveal>
        <WordByWord
          text={problem}
          delay={15}
          style={{ color: b.colors.text, fontSize: 56, fontWeight: 700, fontFamily: b.typography.display, textAlign: "center", lineHeight: 1.2 }}
        />
      </div>
      <DipToBlack frame_start={70} duration={20} />
    </AbsoluteFill>
  );

  const SolutionScene = () => (
    <AbsoluteFill style={{ background: b.colors.bg, justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <div style={{ textAlign: "center" }}>
        <BlurReveal>
          <div style={{ color: "#30D158", fontSize: 28, fontFamily: b.typography.body, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>
            A SOLUÇÃO
          </div>
        </BlurReveal>
        <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center" }}>
          <CheckmarkDraw size={72} color="#30D158" delay={20} />
          <WordByWord
            text={solution}
            delay={20}
            style={{ color: b.colors.text, fontSize: 56, fontWeight: 700, fontFamily: b.typography.display, textAlign: "center", lineHeight: 1.2 }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={90}>
          <ProblemScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <SolutionScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
