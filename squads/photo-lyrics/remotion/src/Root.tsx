import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {PhotoLyrics} from './PhotoLyrics';
import type {Manifest} from './types';

const emptyManifest: Manifest = {
  project: 'demo',
  fps: 30,
  width: 1080,
  height: 1920,
  music: {file: '', duration_s: 2, duration_frames: 60},
  scenes: [],
  timeline: {transition: 'cut'},
};

// Demo: smoke test de render sem midia externa
const Demo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(180deg, #080808 0%, #1a1a2e 100%)',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div style={{color: '#fff', fontSize: 96, fontFamily: 'Arial'}}>PHOTO LYRICS</div>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PhotoLyrics"
        component={PhotoLyrics}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={60}
        defaultProps={emptyManifest}
        calculateMetadata={({props}) => ({
          durationInFrames: Math.max(
            1,
            (props.music?.duration_frames ?? 60) -
              (props.music?.start_offset_f ?? 0) -
              (props.music?.end_trim_f ?? 0),
          ),
          fps: 30,
          width: props.width ?? 1080,
          height: props.height ?? 1920,
        })}
      />
      <Composition
        id="Demo"
        component={Demo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={60}
      />
    </>
  );
};
