import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {ci} from './primitives';
import type {Scene as SceneType} from './types';

const cover: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const KenBurnsImage: React.FC<{
  src: string;
  durationInFrames: number;
  direction: 'in' | 'out';
  refresh: boolean;
}> = ({src, durationInFrames, direction, refresh}) => {
  const frame = useCurrentFrame();
  const half = Math.floor(durationInFrames / 2);
  // motion_refresh: troca a direcao na metade para a cena nunca morrer parada
  const localDir =
    refresh && frame >= half ? (direction === 'in' ? 'out' : 'in') : direction;
  const segStart = refresh && frame >= half ? half : 0;
  const segDur = refresh ? half : durationInFrames;
  const t = ci(frame, [segStart, segStart + segDur], [0, 1], Easing.inOut(Easing.quad));
  const scale = localDir === 'in' ? 1.0 + 0.08 * t : 1.08 - 0.08 * t;
  const pan = 12 * t * (localDir === 'in' ? 1 : -1);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={src}
        style={{
          ...cover,
          transform: `scale(${scale}) translate(${pan}px, ${pan}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Scene: React.FC<{scene: SceneType; durationInFrames: number}> = ({
  scene,
  durationInFrames,
}) => {
  const media = scene.media;
  if (!media || !media.file) {
    return <AbsoluteFill style={{backgroundColor: '#000'}} />;
  }
  const src = staticFile(media.file);

  if (media.type === 'video') {
    const trimIn = media.trim_in_f ?? 0;
    const trimOut = media.trim_out_f ?? media.duration_f ?? trimIn + durationInFrames;
    const rate = media.playback_rate ?? 1.0;
    const playedFrames = Math.max(1, Math.round((trimOut - trimIn) / rate));
    const video = (
      <OffthreadVideo
        src={src}
        startFrom={trimIn}
        endAt={trimOut}
        playbackRate={rate}
        muted
        style={cover}
      />
    );
    // cena mais longa que o clipe: LOOP da janela util (nunca congela)
    const needsLoop = media.loop && playedFrames < durationInFrames;
    return (
      <AbsoluteFill style={{backgroundColor: '#000'}}>
        {needsLoop ? (
          <Loop durationInFrames={playedFrames}>{video}</Loop>
        ) : (
          video
        )}
      </AbsoluteFill>
    );
  }

  const direction = scene.motion === 'kenburns-out' ? 'out' : 'in';
  return (
    <KenBurnsImage
      src={src}
      durationInFrames={durationInFrames}
      direction={direction}
      refresh={Boolean(scene.motion_refresh)}
    />
  );
};
