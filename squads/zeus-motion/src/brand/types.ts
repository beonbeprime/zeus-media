export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
  text_secondary: string;
  highlight?: string;
}

export interface BrandTypography {
  display: string;
  body: string;
  weight_display: number;
  weight_body: number;
}

export interface BrandConfig {
  client: string;
  style: "dark" | "light" | "colorful" | "minimal";
  colors: BrandColors;
  typography: BrandTypography;
  motion_preset: "smooth" | "energetic" | "elegant" | "bold";
  icon_style: "line" | "filled" | "duotone";
  design_system: boolean;
  design_system_path?: string;
}
