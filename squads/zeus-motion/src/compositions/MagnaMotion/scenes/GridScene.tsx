// ===================================================================
// MagnaMotion — GridScene (grade de itens do deck, estilo TOCAR)
// Linhas COM icon/label viram células do grid (borda + ícone + palavra).
// Linhas SEM icon/label viram texto normal (intro/fechamento).
// ===================================================================

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../components/icons";
import { SyncedLine } from "../components/SyncedLine";
import { blurIn, iconPop } from "../design-system/effects";
import { COLORS, FONT_DISPLAY } from "../design-system/tokens";
import type { ResolvedLine, ResolvedScene } from "../types";
import { SceneShell, Tag } from "./shared";

const isCell = (l: ResolvedLine) =>
  l.line.icon !== undefined || l.line.label !== undefined;

const GridCell: React.FC<{ l: ResolvedLine; spanAll: boolean }> = ({ l, spanAll }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const firstVisible = l.words.find((w) => w.text !== "") ?? l.words[0];
  const delay = Math.max(0, firstVisible.startFrame - 6);
  return (
    <div
      style={{
        gridColumn: spanAll ? "1 / -1" : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "34px 22px",
        borderRadius: 18,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.cardBg,
        ...blurIn(frame, delay, 20),
      }}
    >
      {l.line.icon && (
        <div style={{ color: COLORS.rg2, ...iconPop(frame, delay + 3, fps) }}>
          <Icon id={l.line.icon} size={56} strokeWidth={1.6} />
        </div>
      )}
      {/* Hierarquia de cor (feedback 2026-06-10): a palavra é o que se lê —
          claro Magna (#f0e0d8); o ícone fica com a cor rosegold */}
      <SyncedLine
        words={l.words}
        size="body"
        emphasis={l.line.emphasis ?? "normal"}
        style={{ fontSize: 44, fontWeight: 700, fontFamily: FONT_DISPLAY }}
      />
      {l.line.label && (
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLORS.txtMuted,
            ...blurIn(frame, delay + 8, 18),
          }}
        >
          {l.line.label}
        </div>
      )}
    </div>
  );
};

export const GridScene: React.FC<{ resolved: ResolvedScene }> = ({ resolved }) => {
  const { scene, lines } = resolved;
  const firstCellIdx = lines.findIndex(isCell);
  const lastCellIdx =
    firstCellIdx === -1
      ? -1
      : lines.length - 1 - [...lines].reverse().findIndex(isCell);
  const pre = firstCellIdx === -1 ? lines : lines.slice(0, firstCellIdx);
  const cells = lines.filter(isCell);
  const post = lastCellIdx === -1 ? [] : lines.slice(lastCellIdx + 1).filter((l) => !isCell(l));
  const oddLast = cells.length % 2 === 1;

  return (
    <SceneShell resolved={resolved}>
      {scene.tag && <Tag text={scene.tag} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%" }}>
        {pre.map((l, i) => (
          <SyncedLine
            key={`pre-${i}`}
            words={l.words}
            size={l.line.size ?? "body"}
            emphasis={l.line.emphasis ?? "normal"}
          />
        ))}

        {cells.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
              width: "100%",
            }}
          >
            {cells.map((l, i) => (
              <GridCell key={i} l={l} spanAll={oddLast && i === cells.length - 1} />
            ))}
          </div>
        )}

        {post.map((l, i) => (
          <SyncedLine
            key={`post-${i}`}
            words={l.words}
            size={l.line.size ?? "body"}
            emphasis={l.line.emphasis ?? "muted"}
          />
        ))}
      </div>
    </SceneShell>
  );
};
