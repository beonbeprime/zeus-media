// ===================================================================
// MagnaMotion — PhraseScene (coração do modo legenda sincronizada)
// Frase(s) centralizadas, palavras acendendo no ritmo da fala.
// Linhas PRÓXIMAS (gap mínimo — espaçamento exagerado é erro de padrão).
// Sem tag: texto não falado é proibido aqui (usar accentIcon).
// ===================================================================

import React from "react";
import { SyncedLine } from "../components/SyncedLine";
import { LINE_GAP } from "../design-system/tokens";
import type { ResolvedScene } from "../types";
import { SceneShell } from "./shared";

export const PhraseScene: React.FC<{ resolved: ResolvedScene }> = ({ resolved }) => {
  const { lines } = resolved;
  return (
    <SceneShell resolved={resolved}>
      <div style={{ display: "flex", flexDirection: "column", gap: LINE_GAP, width: "100%" }}>
        {lines.map((l, i) => (
          <SyncedLine
            key={i}
            words={l.words}
            size={l.line.size ?? "headline"}
            emphasis={l.line.emphasis ?? "normal"}
          />
        ))}
      </div>
    </SceneShell>
  );
};
