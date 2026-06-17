// ===================================================================
// MagnaMotion — buildTimeline()
// Resolve cenas (scenes.ts) + palavras (narration.json) em frames.
// Cada palavra entra LEAD_IN frames antes do timestamp da fala.
// Transições de cena acontecem dentro dos silêncios.
// ===================================================================

import {
  DEFAULT_HOLD_TAIL,
  EXIT_DUR,
  LEAD_IN,
  OVERLAP,
  PRE_ROLL,
  TAIL_BUFFER,
} from "./design-system/tokens";
import type {
  MagnaScene,
  NarrationData,
  ResolvedScene,
  ResolvedWord,
} from "./types";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Frame absoluto em que a palavra COMEÇA a entrar (lead-in incluído) */
const wordEntryFrame = (
  startSec: number,
  offsetSec: number,
  fps: number
): number => Math.max(0, Math.round((startSec + offsetSec) * fps) - LEAD_IN);

/** Duração adaptativa da entrada: palavras rápidas entram rápido (6–18f) */
const adaptiveEntryDur = (
  startSec: number,
  endSec: number,
  fps: number
): number => clamp(Math.round((endSec - startSec) * fps * 1.5), 6, 18);

export function buildTimeline(
  narration: NarrationData,
  scenes: MagnaScene[],
  fps: number,
  globalOffsetMs = 0
): { scenes: ResolvedScene[]; totalFrames: number } {
  const { words } = narration;
  if (scenes.length === 0) {
    throw new Error("[MagnaMotion] scenes.ts vazio — defina pelo menos uma cena.");
  }

  // ── Validação dos ranges ─────────────────────────────────────────
  let prevEnd = -1;
  for (const scene of scenes) {
    if (scene.lines.length === 0) {
      throw new Error(`[MagnaMotion] Cena "${scene.id}" sem linhas.`);
    }
    // REGRA INVIOLÁVEL (feedback 2026-06-10): texto que NÃO está na fala
    // é proibido. Tag só em layouts de itens (list/grid) — nas demais cenas,
    // usar accentIcon (esquema visual) no lugar de texto inventado.
    if (scene.tag && scene.layout !== "list" && scene.layout !== "grid") {
      throw new Error(
        `[MagnaMotion] Cena "${scene.id}" (${scene.layout}): tag "${scene.tag}" proibida — texto não falado só em list/grid. Use accentIcon.`
      );
    }
    for (const line of scene.lines) {
      const [a, b] = line.words;
      if (a > b) {
        throw new Error(
          `[MagnaMotion] Cena "${scene.id}": range invertido [${a}, ${b}].`
        );
      }
      if (a < 0 || b >= words.length) {
        throw new Error(
          `[MagnaMotion] Cena "${scene.id}": range [${a}, ${b}] fora do narration.json (0–${words.length - 1}).`
        );
      }
      if (a <= prevEnd) {
        throw new Error(
          `[MagnaMotion] Cena "${scene.id}": range [${a}, ${b}] sobrepõe o range anterior (último índice usado: ${prevEnd}).`
        );
      }
      if (a > prevEnd + 1) {
        // Buraco: palavras puladas não aparecem no vídeo (aviso, não erro)
        console.warn(
          `[MagnaMotion] Aviso: palavras #${prevEnd + 1}–#${a - 1} fora do roteiro (cena "${scene.id}").`
        );
      }
      if (line.displayOverride && line.displayOverride.length !== b - a + 1) {
        throw new Error(
          `[MagnaMotion] Cena "${scene.id}": displayOverride tem ${line.displayOverride.length} itens, range [${a}, ${b}] tem ${b - a + 1} palavras.`
        );
      }
      prevEnd = b;
    }
  }

  const globalOffsetSec = globalOffsetMs / 1000;

  // ── Fronteiras das cenas ─────────────────────────────────────────
  // Início ideal da cena: PRE_ROLL frames antes da primeira palavra
  // (background e tag montam durante o silêncio que antecede a fala).
  const sceneFirstWordFrame = scenes.map((scene) => {
    const offsetSec = globalOffsetSec + (scene.offsetMs ?? 0) / 1000;
    const firstIdx = scene.lines[0].words[0];
    return wordEntryFrame(words[firstIdx].start, offsetSec, fps);
  });
  const sceneLastWordEndFrame = scenes.map((scene) => {
    const offsetSec = globalOffsetSec + (scene.offsetMs ?? 0) / 1000;
    const lastLine = scene.lines[scene.lines.length - 1];
    const lastIdx = lastLine.words[1];
    return Math.round((words[lastIdx].end + offsetSec) * fps);
  });

  const starts: number[] = scenes.map((scene, i) => {
    if (i === 0) return 0;
    // Não invadir o fim da fala da cena anterior nem o respiro dela
    const prevHold = Math.round(
      (scenes[i - 1].holdTailSec ?? DEFAULT_HOLD_TAIL) * fps
    );
    const minStart = sceneLastWordEndFrame[i - 1] + Math.min(prevHold, 6);
    return Math.max(minStart, sceneFirstWordFrame[i] - PRE_ROLL);
  });

  const totalFrames =
    Math.ceil(narration.durationSec * fps) + TAIL_BUFFER;

  // ── Modos de saída (alternância automática left/up + rotate manual) ──
  const exitModes = scenes.map(
    (scene, i) => scene.exit ?? (i % 2 === 0 ? "left" : "up")
  );

  // ── Resolução das cenas ──────────────────────────────────────────
  const resolved: ResolvedScene[] = scenes.map((scene, i) => {
    const offsetSec = globalOffsetSec + (scene.offsetMs ?? 0) / 1000;
    const fromFrame = starts[i];
    const isLast = i === scenes.length - 1;
    const isItemLayout = scene.layout === "list" || scene.layout === "grid";
    // A cena dura até a próxima começar (+ OVERLAP para a saída acontecer
    // por baixo da entrada da próxima). A última segura até o fim.
    const durFrames = isLast
      ? totalFrames - fromFrame
      : starts[i + 1] - fromFrame + OVERLAP;

    if (durFrames < EXIT_DUR + 8) {
      throw new Error(
        `[MagnaMotion] Cena "${scene.id}" curta demais (${durFrames}f). Agrupe com a vizinha.`
      );
    }

    const lines = scene.lines.map((line) => {
      const [a, b] = line.words;
      const resolvedWords: ResolvedWord[] = [];
      for (let wi = a; wi <= b; wi++) {
        const w = words[wi];
        const override = line.displayOverride?.[wi - a];
        let text = override !== undefined ? override : w.text;
        // Itens (list/grid) não levam pontuação: pills/células limpas
        if (isItemLayout && override === undefined) {
          text = text.replace(/[.,;:!?]+$/u, "");
        }
        resolvedWords.push({
          text,
          startFrame: Math.max(
            1,
            wordEntryFrame(w.start, offsetSec, fps) - fromFrame
          ),
          entryDur: adaptiveEntryDur(w.start, w.end, fps),
        });
      }
      return { line, words: resolvedWords };
    });

    return {
      scene,
      sceneIndex: i,
      fromFrame,
      durFrames,
      lines,
      isLast,
      exitMode: exitModes[i],
      enterRotate: i > 0 && exitModes[i - 1] === "rotate",
    };
  });

  return { scenes: resolved, totalFrames };
}
