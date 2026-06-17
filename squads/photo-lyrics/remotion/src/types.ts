export type SceneMedia = {
  file: string;
  type: 'video' | 'image';
  duration_f?: number;
  trim_in_f?: number;
  trim_out_f?: number;
  playback_rate?: number;
  loop?: boolean;
};

export type Scene = {
  id: number;
  kind: 'phrase' | 'respiro';
  slug: string;
  phrase: string;
  start_f: number;
  end_f: number;
  motion: 'video' | 'kenburns-in' | 'kenburns-out' | 'extend-previous' | null;
  motion_refresh?: boolean;
  media: SceneMedia | null;
};

export type Manifest = {
  project: string;
  fps: number;
  width: number;
  height: number;
  music: {
    file: string;
    duration_s: number;
    duration_frames: number;
    start_offset_f?: number;
    end_trim_f?: number;
  };
  scenes: Scene[];
  timeline: {transition: string};
};
