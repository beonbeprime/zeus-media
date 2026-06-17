// ===================================================================
// MagnaMotion — ListScene (itens em pills)
// REGRA (feedback 2026-06-10): itens SEMPRE centralizados, cada um
// dentro de um retângulo vazado com cantos totalmente arredondados
// (pill rosegold), sem pontuação. Ícone conectado semanticamente +
// palavra em claro (hierarquia de cor). Tag permitida (exceção dos itens).
// A cascata é dirigida pela fala (item entra quando sua 1ª palavra é dita).
// ===================================================================

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../components/icons";
import { SyncedLine } from "../components/SyncedLine";
import { glowPulse, iconPop, listEntry } from "../design-system/effects";
import { COLORS } from "../design-system/tokens";
import type { ResolvedLine, ResolvedScene } from "../types";
import { SceneShell, Tag } from "./shared";

const ListItem: React.FC<{ l: ResolvedLine }> = ({ l }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const firstVisible = l.words.find((w) => w.text !== "") ?? l.words[0];
  const delay = Math.max(0, firstVisible.startFrame - 4);
  const pulse = glowPulse(frame);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        padding: "22px 52px",
        borderRadius: 999,
        border: `1px solid ${COLORS.cardBorder}`,
        background: COLORS.cardBg,
        boxShadow: `0 0 ${18 + pulse * 14}px rgba(212, 160, 138, ${0.05 + pulse * 0.07})`,
        ...listEntry(frame, delay),
      }}
    >
      <div style={{ color: COLORS.rg2, flexShrink: 0, ...iconPop(frame, delay + 2, fps) }}>
        <Icon id={l.line.icon ?? "check"} size={50} strokeWidth={1.8} />
      </div>
      <SyncedLine
        words={l.words}
        size={l.line.size ?? "body"}
        emphasis={l.line.emphasis ?? "normal"}
        align="center"
        maxWidth={700}
        style={{ fontWeight: 500 }}
      />
    </div>
  );
};

export const ListScene: React.FC<{ resolved: ResolvedScene }> = ({ resolved }) => {
  const { scene, lines } = resolved;
  return (
    <SceneShell resolved={resolved}>
      {scene.tag && <Tag text={scene.tag} />}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          width: "100%",
        }}
      >
        {lines.map((l, i) => (
          <ListItem key={i} l={l} />
        ))}
      </div>
    </SceneShell>
  );
};
