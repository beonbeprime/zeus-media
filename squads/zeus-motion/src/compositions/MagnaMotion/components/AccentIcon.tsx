// ===================================================================
// MagnaMotion — AccentIcon
// Ícone complementar CENTRALIZADO (feedback 2026-06-10): substitui o
// antigo float-icon de canto desfocado. Fica abaixo do texto, rosegold
// visível, com flutuação suave. COMPLEMENTA a informação da fala —
// a conexão semântica com o texto é obrigatória.
// ===================================================================

import React from "react";
import { useCurrentFrame } from "remotion";
import { blurIn } from "../design-system/effects";
import { COLORS } from "../design-system/tokens";
import { Icon, type IconId } from "./icons";

export const AccentIcon: React.FC<{
  id: IconId;
  delay?: number;
  size?: number;
}> = ({ id, delay = 10, size = 150 }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 38) * 7;
  const breathe = 1 + 0.04 * Math.sin(frame / 52);
  const entry = blurIn(frame, delay, 24);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 64,
        color: COLORS.rg2,
        opacity: (typeof entry.opacity === "number" ? entry.opacity : 1) * 0.85,
        transform: `${entry.transform ?? ""} translateY(${float}px) scale(${breathe})`,
        filter: entry.filter,
      }}
    >
      <Icon id={id} size={size} strokeWidth={1.5} />
    </div>
  );
};
