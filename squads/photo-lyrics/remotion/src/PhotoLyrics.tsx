import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ci} from './primitives';
import {Scene} from './Scene';
import type {Manifest, Scene as SceneType} from './types';

const GlobalFade: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  // fade-in 6f no inicio, fade-out 12f no fim (unicos fades globais)
  const opacity =
    ci(frame, [0, 6], [1, 0]) +
    ci(frame, [durationInFrames - 12, durationInFrames], [0, 1]);
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{backgroundColor: '#000', opacity: Math.min(1, opacity)}} />
  );
};

const RespiroFade: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = ci(frame, [0, 8], [1, 0]);
  if (opacity <= 0) return null;
  return <AbsoluteFill style={{backgroundColor: '#000', opacity}} />;
};

// fade-in de 10 frames quando a cena entra vinda de um respiro preto (sem midia)
const SceneFadeIn: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = ci(frame, [0, 10], [1, 0]);
  if (opacity <= 0) return null;
  return <AbsoluteFill style={{backgroundColor: '#000', opacity}} />;
};

export const PhotoLyrics: React.FC<Manifest> = (manifest) => {
  const {durationInFrames} = useVideoConfig();

  // respiro "extend-previous" (sem midia propria) funde com a cena anterior
  const scenes = useMemo(() => {
    const out: SceneType[] = [];
    for (const s of manifest.scenes ?? []) {
      if (s.motion === 'extend-previous' && out.length > 0) {
        out[out.length - 1] = {
          ...out[out.length - 1],
          end_f: s.end_f,
          motion_refresh: true,
        };
      } else {
        out.push(s);
      }
    }
    return out;
  }, [manifest.scenes]);

  const audioOffset = manifest.music?.start_offset_f ?? 0;
  const audioFadeIn = audioOffset > 0 ? 10 : 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {manifest.music?.file ? (
        <Audio
          src={staticFile(manifest.music.file)}
          startFrom={audioOffset}
          volume={(f) =>
            Math.min(
              audioFadeIn ? ci(f, [0, audioFadeIn], [0, 1]) : 1,
              ci(f, [durationInFrames - 20, durationInFrames - 2], [1, 0]),
            )
          }
        />
      ) : null}
      {scenes.map((s, i) => {
        const prev = scenes[i - 1];
        const afterBlack = prev && prev.kind === 'respiro' && !prev.media;
        return (
          <Sequence
            key={s.id}
            from={s.start_f}
            durationInFrames={s.end_f - s.start_f}
            name={`${s.slug} ${s.phrase}`.trim()}
          >
            <Scene scene={s} durationInFrames={s.end_f - s.start_f} />
            {s.kind === 'respiro' ? <RespiroFade /> : null}
            {afterBlack && s.kind === 'phrase' ? <SceneFadeIn /> : null}
          </Sequence>
        );
      })}
      <GlobalFade durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
