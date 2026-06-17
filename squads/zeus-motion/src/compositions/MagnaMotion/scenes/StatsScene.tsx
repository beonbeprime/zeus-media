// ===================================================================
// MagnaMotion — StatsScene (stat-strip do deck)
// Números grandes em gradiente rosegold (num-highlight com spring)
// + rótulo estático abaixo. Separadores verticais entre stats.
// ===================================================================

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SyncedLine } from "../components/SyncedLine";
import { blurIn, numHighlight } from "../design-system/effects";
import { COLORS, FONT_DISPLAY } from "../design-system/tokens";
import type { ResolvedLine, ResolvedScene } from "../types";
import { SceneShell, Tag } from "./shared";

const StatItem: React.FC<{ l: ResolvedLine; withSep: boolean }> = ({ l, withSep }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Delay pela primeira palavra VISÍVEL: o rótulo nunca aparece antes
  // do número (feedback 2026-06-10 — surgimento fora de ordem é erro)
  const firstVisible = l.words.find((w) => w.text !== "") ?? l.words[0];
  const delay = Math.max(0, firstVisible.startFrame - 2);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "0 42px",
        borderLeft: withSep ? `1px solid ${COLORS.border}` : "none",
      }}
    >
      <div style={numHighlight(frame, delay, fps)}>
        <SyncedLine
          words={l.words}
          size="headline"
          emphasis="gradient"
          style={{ fontSize: 104, fontWeight: 900, letterSpacing: "-0.05em" }}
        />
      </div>
      {l.line.label && (
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            // Hierarquia de cor: número em gradiente rosegold, rótulo em
            // claro suave — nunca a tela inteira na mesma cor
            color: COLORS.txtMuted,
            ...blurIn(frame, delay + 10, 22),
          }}
        >
          {l.line.label}
        </div>
      )}
    </div>
  );
};

export const StatsScene: React.FC<{ resolved: ResolvedScene }> = ({ resolved }) => {
  const { scene, lines } = resolved;
  // Horizontal só com poucos stats E números curtos (palavras longas estouram 1080px)
  const maxLen = Math.max(
    ...lines.map((l) => l.words.reduce((acc, w) => acc + w.text.length, 0))
  );
  const horizontal = lines.length <= 3 && maxLen <= 5;
  return (
    <SceneShell resolved={resolved}>
      {scene.tag && <Tag text={scene.tag} />}
      <div
        style={{
          display: "flex",
          flexDirection: horizontal ? "row" : "column",
          justifyContent: "center",
          alignItems: "center",
          gap: horizontal ? 0 : 54,
        }}
      >
        {lines.map((l, i) => (
          <StatItem key={i} l={l} withSep={horizontal && i > 0} />
        ))}
      </div>
    </SceneShell>
  );
};
