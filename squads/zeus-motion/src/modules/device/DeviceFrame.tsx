import React from "react";
import { IPhoneMockup, AndroidMockup, IPadMockup } from "react-device-mockup";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type DeviceType = "iphone" | "android" | "ipad" | "browser";

interface DeviceFrameProps {
  device?: DeviceType;
  children?: React.ReactNode;
  delay?: number;
  scale?: number;
  screenWidth?: number;
  style?: React.CSSProperties;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  device = "iphone", children, delay = 0, scale = 1, screenWidth = 300, style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: { stiffness: 80, damping: 18 } });
  const enterScale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const containerStyle: React.CSSProperties = {
    transform: `scale(${enterScale * scale})`,
    opacity,
    ...style,
  };

  if (device === "browser") {
    return (
      <div style={{
        ...containerStyle,
        background: "#1C1C1E",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ background: "#2C2C2E", padding: "12px 16px", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF453A" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FFD60A" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#30D158" }} />
          <div style={{ flex: 1, background: "#3A3A3C", borderRadius: 6, height: 20, marginLeft: 8 }} />
        </div>
        <div style={{ minHeight: 200 }}>{children}</div>
      </div>
    );
  }

  const MockupComponents: Record<string, React.FC<any>> = {
    iphone: IPhoneMockup,
    android: AndroidMockup,
    ipad: IPadMockup,
  };

  const MockupComponent = MockupComponents[device] ?? IPhoneMockup;

  return (
    <div style={containerStyle}>
      <MockupComponent screenWidth={screenWidth} phoneColor="black" frameColor="black">
        {children}
      </MockupComponent>
    </div>
  );
};
