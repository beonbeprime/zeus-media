import React from "react";
import { AbsoluteFill, Audio, Video, staticFile } from "remotion";

export const VideoMixer: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("video-mixer-source.mp4")}
        volume={1.0}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Audio
        src={staticFile("life-is-infinity.mp3")}
        volume={0.8}
        startFrom={0}
      />
    </AbsoluteFill>
  );
};
