import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface AuroraBackgroundProps {
  color1?: string;
  color2?: string;
  color3?: string;
  style?: React.CSSProperties;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  color1 = "#0071E3", color2 = "#5856D6", color3 = "#000000", style
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const shift1 = interpolate(frame, [0, durationInFrames], [0, 20]);
  const shift2 = interpolate(frame, [0, durationInFrames], [20, 0]);

  return (
    <div style={{ position: "absolute", inset: 0, background: color3, overflow: "hidden", ...style }}>
      <div style={{
        position: "absolute",
        width: "70%", height: "70%",
        borderRadius: "50%",
        background: color1,
        filter: "blur(120px)",
        opacity: 0.3,
        top: `${20 + shift1}%`,
        left: "10%",
      }} />
      <div style={{
        position: "absolute",
        width: "60%", height: "60%",
        borderRadius: "50%",
        background: color2,
        filter: "blur(120px)",
        opacity: 0.25,
        top: `${30 + shift2}%`,
        right: "5%",
      }} />
    </div>
  );
};
