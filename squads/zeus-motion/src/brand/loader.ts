import { BrandConfig } from "./types";

// Universal Default — Apple Minimal
const UNIVERSAL_DEFAULT: BrandConfig = {
  client: "universal-default",
  style: "dark",
  colors: {
    primary: "#FFFFFF",
    secondary: "#888888",
    accent: "#FFFFFF",
    bg: "#000000",
    text: "#FFFFFF",
    text_secondary: "#888888",
    highlight: "#E5E5E5",
  },
  typography: {
    display: "Inter",
    body: "Inter",
    weight_display: 700,
    weight_body: 400,
  },
  motion_preset: "elegant",
  icon_style: "line",
  design_system: false,
};

// Registro de brands (adicionar aqui ao usar brand-intake)
const BRAND_REGISTRY: Record<string, BrandConfig> = {
  "universal-default": UNIVERSAL_DEFAULT,
};

export function loadBrand(clientId: string): BrandConfig {
  return BRAND_REGISTRY[clientId] ?? UNIVERSAL_DEFAULT;
}

export function registerBrand(config: BrandConfig): void {
  BRAND_REGISTRY[config.client] = config;
}

export { UNIVERSAL_DEFAULT };
