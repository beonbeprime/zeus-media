// ===================================================================
// MagnaMotion — SyncedWord
// Uma palavra com o efeito .word do deck, disparada pelo timestamp da fala.
// Renderizada desde o frame 0 da cena (invisível) para reservar layout:
// as palavras "acendem" no lugar, sem reflow do texto.
// ===================================================================

import React from "react";
import { useCurrentFrame } from "remotion";
import { wordEntry } from "../design-system/effects";
import { gradientTextStyle } from "../design-system/tokens";
import type { Emphasis, ResolvedWord } from "../types";

export const SyncedWord: React.FC<{
  word: ResolvedWord;
  emphasis?: Emphasis;
  mutedColor?: string;
}> = ({ word, emphasis = "normal", mutedColor }) => {
  const frame = useCurrentFrame();
  if (word.text === "") return null; // palavra ocultada via displayOverride
  const style = wordEntry(frame, word.startFrame, word.entryDur);
  return (
    <span
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        ...(emphasis === "gradient" ? gradientTextStyle : {}),
        ...(emphasis === "muted" && mutedColor ? { color: mutedColor } : {}),
        ...style,
      }}
    >
      {word.text}
    </span>
  );
};
