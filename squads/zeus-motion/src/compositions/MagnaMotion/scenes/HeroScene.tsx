// ===================================================================
// MagnaMotion — HeroScene (capa do deck)
// Título palavra por palavra + divider + subtítulo. Linhas próximas.
// Sem tag: texto não falado é proibido aqui (logo Magna já identifica).
// ===================================================================

import React from "react";
import { SyncedLine } from "../components/SyncedLine";
import { LINE_GAP } from "../design-system/tokens";
import type { ResolvedLine, ResolvedScene } from "../types";
import { Divider, SceneShell } from "./shared";

const isSub = (l: ResolvedLine) =>
  (l.line.emphasis ?? "normal") === "muted" || l.line.size === "body";

export const HeroScene: React.FC<{ resolved: ResolvedScene }> = ({ resolved }) => {
  const { lines } = resolved;
  const firstSubIdx = lines.findIndex(isSub);
  const dividerDelay =
    firstSubIdx > 0 ? Math.max(0, lines[firstSubIdx].words[0].startFrame - 12) : -1;

  return (
    <SceneShell resolved={resolved}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: LINE_GAP,
          width: "100%",
          alignItems: "center",
        }}
      >
        {lines.map((l, i) => (
          <React.Fragment key={i}>
            {i === firstSubIdx && dividerDelay >= 0 && (
              <Divider delay={dividerDelay} style={{ margin: "18px 0" }} />
            )}
            <SyncedLine
              words={l.words}
              size={l.line.size ?? (isSub(l) ? "body" : "hero")}
              emphasis={l.line.emphasis ?? (isSub(l) ? "muted" : "normal")}
            />
          </React.Fragment>
        ))}
      </div>
    </SceneShell>
  );
};
