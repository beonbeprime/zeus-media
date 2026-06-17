const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const COMPOSITIONS = {
  SquadPromo: { fps: 30, duration: 630, width: 1080, height: 1920 },
  SquadPromoMagna: { fps: 30, duration: 630, width: 1080, height: 1920 },
  TextReveal: { fps: 30, duration: 90, width: 1080, height: 1920 },
  DeviceDemo: { fps: 30, duration: 150, width: 1080, height: 1920 },
  ProblemSolution: { fps: 30, duration: 180, width: 1080, height: 1920 },
  DataStory: { fps: 30, duration: 150, width: 1080, height: 1920 },
  PriceReveal: { fps: 30, duration: 150, width: 1080, height: 1920 },
  ArrowExplainer: { fps: 30, duration: 120, width: 1080, height: 1920 },
  AiDemo: { fps: 30, duration: 150, width: 1080, height: 1920 },
  CheckoutDemo: { fps: 30, duration: 120, width: 1080, height: 1920 },
  AgenteArquiteto: { fps: 30, duration: 1387, width: 1080, height: 1920 },
  MagnaCaptura: { fps: 30, duration: 810, width: 1080, height: 1920 },
  MagnaMotion: { fps: 30, duration: 1200, width: 1080, height: 1920 },
};

const composition = process.argv[2] || "SquadPromo";
const mode = process.argv[3] || "draft";

if (!COMPOSITIONS[composition]) {
  console.error(`Composition "${composition}" nao encontrada.`);
  console.error(`Disponíveis: ${Object.keys(COMPOSITIONS).join(", ")}`);
  process.exit(1);
}

const outputDir = path.join(process.env.USERPROFILE || process.env.HOME, "Desktop", "zeus-motion-render");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const outputFile = path.join(outputDir, `${composition}-${Date.now()}.mp4`);
const quality = mode === "draft" ? "--jpeg-quality 80" : "--jpeg-quality 95";
const scale = mode === "draft" ? "--scale 0.5" : "--scale 1";

const cmd = `npx remotion render src/index.ts ${composition} "${outputFile}" ${quality} ${scale}`;

console.log(`Renderizando: ${composition} (modo: ${mode})`);
console.log(`Saída: ${outputFile}`);
console.log("...");

try {
  execSync(cmd, { stdio: "inherit", cwd: path.dirname(__dirname) });
  console.log(`\nPronto! Video em: ${outputFile}`);
} catch (e) {
  console.error("Erro ao renderizar. Verifique se o npm install foi executado.");
  process.exit(1);
}
