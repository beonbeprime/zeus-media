import React from "react";

interface StackProps {
  children: React.ReactNode;
  direction?: "row" | "column";
  gap?: number;
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  style?: React.CSSProperties;
}

export const Stack: React.FC<StackProps> = ({
  children, direction = "column", gap = 16, align = "flex-start", justify = "flex-start", style
}) => {
  return (
    <div style={{ display: "flex", flexDirection: direction, gap, alignItems: align, justifyContent: justify, ...style }}>
      {children}
    </div>
  );
};
