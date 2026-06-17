// ===================================================================
// MagnaMotion — SyncedLine
// Linha de palavras sincronizadas com tipografia da escala do padrão.
// Todas as palavras montam o layout desde o frame 0 (anti-reflow).
//
// BALANCEADOR DE LINHAS (feedback 2026-06-10): quando o texto não cabe
// em uma linha, as palavras são distribuídas de forma EQUILIBRADA
// (6+1 vira 4+3; 8+8+1 vira 6+6+5). Nunca deixar palavra órfã.
// ===================================================================

import React from "react";
import { COLORS, PAD_X, SIZES, W } from "../design-system/tokens";
import type { Emphasis, ResolvedWord, TextSize } from "../types";
import { SyncedWord } from "./SyncedWord";

const MAX_WIDTH = W - PAD_X * 2; // 920px

/** Largura estimada de uma palavra (heurística por caractere) */
const wordWidth = (text: string, fontSize: number, fontWeight: number): number => {
  const factor = fontWeight >= 700 ? 0.56 : 0.5;
  return text.length * fontSize * factor + fontSize * 0.26; // + gap
};

/**
 * Distribui palavras em N sub-linhas com larguras quase iguais.
 * N = mínimo necessário para caber; alvo = largura total / N.
 */
const balanceWords = (
  words: ResolvedWord[],
  fontSize: number,
  fontWeight: number,
  maxWidth: number
): ResolvedWord[][] => {
  const visible = words.filter((w) => w.text !== "");
  if (visible.length === 0) return [words];

  const widths = visible.map((w) => wordWidth(w.text, fontSize, fontWeight));
  const total = widths.reduce((a, b) => a + b, 0);
  const numLines = Math.max(1, Math.ceil(total / maxWidth));
  if (numLines === 1) return [words];

  const target = total / numLines;
  const rows: ResolvedWord[][] = [];
  let row: ResolvedWord[] = [];
  let acc = 0;

  visible.forEach((w, i) => {
    const wWidth = widths[i];
    const wordsLeft = visible.length - i; // incluindo a atual
    const rowsLeft = numLines - rows.length; // incluindo a atual
    // Pode quebrar se: a linha atual tem conteúdo, ainda há linha futura
    // disponível e sobra pelo menos 1 palavra para cada linha futura
    const canBreak =
      row.length > 0 && rows.length < numLines - 1 && wordsLeft >= rowsLeft - 1;
    // Quebra equilibrada (metade da palavra passa do alvo) OU
    // quebra obrigatória (a palavra não cabe na largura máxima)
    if (canBreak && (acc + wWidth / 2 > target || acc + wWidth > maxWidth)) {
      rows.push(row);
      row = [];
      acc = 0;
    }
    row.push(w);
    acc += wWidth;
  });
  if (row.length > 0) rows.push(row);
  return rows;
};

export const SyncedLine: React.FC<{
  words: ResolvedWord[];
  size?: TextSize;
  emphasis?: Emphasis;
  align?: "left" | "center";
  /** Largura disponível (px) para o balanceador. Default: zona útil. */
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({ words, size = "headline", emphasis = "normal", align = "center", maxWidth = MAX_WIDTH, style }) => {
  const t = SIZES[size];
  const fontSize = (style?.fontSize as number) ?? t.fontSize;
  const fontWeight = (style?.fontWeight as number) ?? (emphasis === "muted" ? 300 : t.fontWeight);
  const rows = balanceWords(words, fontSize, fontWeight, maxWidth);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        rowGap: "0.06em",
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        fontWeight: emphasis === "muted" ? 300 : t.fontWeight,
        letterSpacing: t.letterSpacing,
        lineHeight: t.lineHeight,
        color: emphasis === "muted" ? COLORS.txtMuted : COLORS.txt,
        textAlign: align,
        ...style,
      }}
    >
      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: align === "center" ? "center" : "flex-start",
            columnGap: "0.26em",
          }}
        >
          {row.map((w, i) => (
            <SyncedWord
              key={i}
              word={w}
              emphasis={emphasis}
              mutedColor={COLORS.txtMuted}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
