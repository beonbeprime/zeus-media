// ===================================================================
// MAGNA MOTION — Padrão visual das apresentações Magna em vídeo
// Rosegold dark luxury | 1080x1920 @ 30fps | Reels vertical
//
// Texto sincronizado PALAVRA POR PALAVRA com a narração:
// cada palavra entra com o efeito .word do deck no instante exato da fala.
// Conteúdo confinado aos 2/3 superiores (terço inferior livre p/ UI).
//
// Pipeline:
//   1. python scripts/transcribe-words.py public/audio/<arquivo>.mp3
//   2. Montar data/scenes.ts com os índices do transcript numerado
//   3. node scripts/render.js MagnaMotion draft   (aprovação)
//   4. node scripts/render.js MagnaMotion full    (final)
// ===================================================================

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";

import narrationJson from "./data/narration.json";
import { GLOBAL_OFFSET_MS, MUSIC_FILE, MUSIC_VOLUME, SCENES } from "./data/scenes";
import { ci } from "./design-system/effects";
import { COLORS, FPS } from "./design-system/tokens";
import { buildTimeline } from "./timeline";
import type { NarrationData, ResolvedScene, SceneLayout } from "./types";

import { MagnaGrain } from "./components/MagnaBackground";
import { ActScene } from "./scenes/ActScene";
import { GridScene } from "./scenes/GridScene";
import { HeroScene } from "./scenes/HeroScene";
import { ListScene } from "./scenes/ListScene";
import { PhraseScene } from "./scenes/PhraseScene";
import { StatsScene } from "./scenes/StatsScene";

loadInter("normal", {
  weights: ["300", "400", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});
loadDMSans("normal", {
  weights: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});
// Tema "red" estilo Netflix (Bebas Neue só tem peso 400)
loadBebasNeue("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

const narration = narrationJson as NarrationData;
const TIMELINE = buildTimeline(narration, SCENES, FPS, GLOBAL_OFFSET_MS);

/** Duração total — importada pelo Root.tsx */
export const TOTAL_FRAMES_MAGNA = TIMELINE.totalFrames;

const SCENE_COMPONENTS: Record<
  SceneLayout,
  React.FC<{ resolved: ResolvedScene }>
> = {
  hero: HeroScene,
  phrase: PhraseScene,
  list: ListScene,
  grid: GridScene,
  stats: StatsScene,
  act: ActScene,
};

export const MagnaMotion: React.FC = () => {
  const frame = useCurrentFrame();
  // Fade-out global discreto no encerramento
  const endFade = ci(frame, [TOTAL_FRAMES_MAGNA - 18, TOTAL_FRAMES_MAGNA - 4], [1, 0]);

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile(narration.audioFile)} />
      {MUSIC_FILE && (
        <Audio
          src={staticFile(MUSIC_FILE)}
          volume={(f) =>
            MUSIC_VOLUME *
            ci(f, [0, 20], [0, 1]) *
            ci(f, [TOTAL_FRAMES_MAGNA - 50, TOTAL_FRAMES_MAGNA - 6], [1, 0])
          }
        />
      )}

      <AbsoluteFill style={{ opacity: endFade }}>
        {TIMELINE.scenes.map((rs) => {
          const SceneComponent = SCENE_COMPONENTS[rs.scene.layout];
          return (
            <Sequence
              key={rs.scene.id}
              from={rs.fromFrame}
              durationInFrames={rs.durFrames}
            >
              <SceneComponent resolved={rs} />
            </Sequence>
          );
        })}
      </AbsoluteFill>

      <MagnaGrain />
    </AbsoluteFill>
  );
};
