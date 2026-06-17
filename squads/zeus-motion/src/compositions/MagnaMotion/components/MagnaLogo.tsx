// ===================================================================
// MagnaMotion — Logo Magna rosegold (arquivo oficial, nunca recriado em código)
// Topo central, dentro da zona segura superior.
// ===================================================================

import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { blurIn } from "../design-system/effects";
import { LOGO_FILE, LOGO_FILTER } from "../design-system/tokens";

export const MagnaLogo: React.FC<{ delay?: number }> = ({ delay = 4 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        ...blurIn(frame, delay, 24),
      }}
    >
      <Img
        src={staticFile(LOGO_FILE)}
        style={{ height: 52, width: "auto", opacity: 0.92, filter: LOGO_FILTER }}
      />
    </div>
  );
};
