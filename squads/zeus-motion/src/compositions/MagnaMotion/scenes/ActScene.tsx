// ===================================================================
// MagnaMotion — ActScene (slide de transição/ato do deck)
// Divider vertical + título grande. Fundo gradiente próprio.
// Sem tag: texto não falado é proibido aqui (usar accentIcon).
// ===================================================================

import React from "react";
import { SyncedLine } from "../components/SyncedLine";
import { LINE_GAP } from "../design-system/tokens";
import type { ResolvedScene } from "../types";
import { Divider, SceneShell } from "./shared";

export const ActScene: React.FC<{ resolved: ResolvedScene }> = ({ resolved }) => {
  const { scene, lines } = resolved;
  return (
    <SceneShell resolved={{ ...resolved, scene: { ...scene, bg: scene.bg ?? "ato" } }}>
      <Divider vertical delay={2} style={{ marginBottom: 30 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: LINE_GAP, width: "100%" }}>
        {lines.map((l, i) => (
          <SyncedLine
            key={i}
            words={l.words}
            size={l.line.size ?? "hero"}
            emphasis={l.line.emphasis ?? "normal"}
          />
        ))}
      </div>
    </SceneShell>
  );
};
