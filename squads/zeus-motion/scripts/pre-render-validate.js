#!/usr/bin/env node
/**
 * pre-render-validate.js
 * Validador obrigatório antes de qualquer render de composition com SCENE_TIMING
 *
 * Uso:
 *   node scripts/pre-render-validate.js <CompositionName>
 *
 * Exemplo:
 *   node scripts/pre-render-validate.js AgenteArquiteto
 *
 * O que verifica:
 *   1. EXIT_F + 18 <= dur (animação de saída cabe dentro da Sequence)
 *   2. EXIT_F + 22 <= dur (margem segura, avisa se não tiver)
 *   3. Overlaps entre cenas (5-12f, BRABO OS)
 *   4. Nenhum gap entre cenas (frame vazio proibido)
 *   5. Total de frames consistente com Root.tsx e render.js
 *   6. Duração das cenas coerente com a narração (se arquivo .json de timing existir)
 */

const fs = require("fs");
const path = require("path");

const COMPOSITION = process.argv[2];
if (!COMPOSITION) {
  console.error("Uso: node scripts/pre-render-validate.js <CompositionName>");
  process.exit(1);
}

// ─── CONFIGURAÇÕES POR COMPOSITION ─────────────────────────────────────────

const COMPOSITIONS_CONFIG = {
  AgenteArquiteto: {
    totalFrames: 1387,
    fps: 30,
    minOverlap: 5,
    maxOverlap: 20,
    timingFile: path.join(__dirname, "../docs/timing-agente-arquiteto.json"),
    // Cenas e seus EXIT_F declarados (extrair manualmente do .tsx)
    // Formato: { sceneName: { dur, EXIT_F } }
    scenes: [
      { name: "SceneChatGPT", from: 0,    dur: 120, EXIT_F: 100 },
      { name: "Scene1",        from: 110,  dur: 182, EXIT_F: 161 },
      { name: "Scene2",        from: 282,  dur: 75,  EXIT_F: 45  },
      { name: "Scene3",        from: 350,  dur: 125, EXIT_F: 99  },
      { name: "Scene4",        from: 465,  dur: 145, EXIT_F: 119 },
      { name: "Scene5",        from: 600,  dur: 255, EXIT_F: 229 },
      { name: "Scene6",        from: 845,  dur: 240, EXIT_F: 210 },
      { name: "Scene7",        from: 1075, dur: 200, EXIT_F: 168 },
      { name: "Scene8",        from: 1265, dur: 122, EXIT_F: null }, // última cena: sem EXIT_F obrigatório
    ],
  },
  MagnaCaptura: {
    totalFrames: 810,
    fps: 30,
    minOverlap: 5,
    maxOverlap: 20,
    scenes: [
      { name: "Scene1",  from: 0,   dur: 90, EXIT_F: 65  },
      { name: "Scene2",  from: 83,  dur: 87, EXIT_F: 62  },
      { name: "Scene3",  from: 163, dur: 87, EXIT_F: 47  },
      { name: "Scene4",  from: 243, dur: 87, EXIT_F: 67  },
      { name: "Scene5",  from: 323, dur: 87, EXIT_F: 67  },
      { name: "Scene6",  from: 403, dur: 87, EXIT_F: 67  },
      { name: "Scene7",  from: 483, dur: 87, EXIT_F: 67  },
      { name: "Scene8",  from: 563, dur: 87, EXIT_F: 62  },
      { name: "Scene9",  from: 643, dur: 87, EXIT_F: 67  },
      { name: "Scene10", from: 723, dur: 87, EXIT_F: null }, // última cena: sem saída
    ],
  },
  // Adicionar novas compositions aqui:
  // NovaComposition: { totalFrames: NNN, fps: 30, scenes: [...] }
};

// ─── REGRAS BRUTAS (para compositions sem config declarada) ─────────────────

const MIN_OVERLAP = 5;
const MAX_OVERLAP = 20;
const EXIT_ANIM_DUR = 18; // duração da animação de saída em frames
const EXIT_SAFE_MARGIN = 22; // margem segura recomendada

// ─── VALIDAÇÃO ──────────────────────────────────────────────────────────────

let errors = 0;
let warnings = 0;

function err(msg) {
  console.error(`  [ERRO]    ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  [AVISO]   ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`  [OK]      ${msg}`);
}

function info(msg) {
  console.log(`  [INFO]    ${msg}`);
}

console.log(`\n========================================`);
console.log(` PRE-RENDER VALIDATE — ${COMPOSITION}`);
console.log(`========================================\n`);

const config = COMPOSITIONS_CONFIG[COMPOSITION];

if (!config) {
  warn(`Composition "${COMPOSITION}" não tem config declarada neste script.`);
  warn(`Adicione a config em COMPOSITIONS_CONFIG no arquivo pre-render-validate.js`);
  warn(`Executando validações básicas apenas...`);
  console.log("\n[RESULTADO] Validação incompleta — adicione config e rode novamente.\n");
  process.exit(0);
}

const { scenes, totalFrames, fps, minOverlap = MIN_OVERLAP, maxOverlap = MAX_OVERLAP } = config;

// ─── VALIDAÇÃO 1: EXIT_F dentro de cada cena ────────────────────────────────

console.log("1. Verificando EXIT_F vs dur em cada cena...");

for (const scene of scenes) {
  const { name, from, dur, EXIT_F } = scene;

  if (EXIT_F === null) {
    info(`${name}: última cena, sem EXIT_F obrigatório.`);
    continue;
  }

  const absExitStart = from + EXIT_F;
  const absExitEnd   = absExitStart + EXIT_ANIM_DUR;
  const absSceneEnd  = from + dur;

  // Regra absoluta: EXIT_F + 18 <= dur
  if (EXIT_F + EXIT_ANIM_DUR > dur) {
    err(`${name}: EXIT_F=${EXIT_F} + ${EXIT_ANIM_DUR} = ${EXIT_F + EXIT_ANIM_DUR} > dur=${dur}`);
    err(`  → A animação de saída excede os limites da Sequence! Aumentar dur ou reduzir EXIT_F.`);
  } else {
    ok(`${name}: EXIT_F=${EXIT_F}, dur=${dur}, margem=${dur - EXIT_F - EXIT_ANIM_DUR}f`);
  }

  // Aviso de margem mínima segura
  if (EXIT_F + EXIT_SAFE_MARGIN > dur && EXIT_F + EXIT_ANIM_DUR <= dur) {
    warn(`${name}: EXIT_F=${EXIT_F} no limite (margem=${dur - EXIT_F - EXIT_ANIM_DUR}f < 4f recomendado)`);
  }

  // Aviso de EXIT_F em 100% do limite
  if (EXIT_F + EXIT_ANIM_DUR === dur) {
    warn(`${name}: EXIT_F no limite ABSOLUTO (EXIT_F+18=dur). Sem margem alguma.`);
  }
}

// ─── VALIDAÇÃO 2: Overlaps entre cenas ──────────────────────────────────────

console.log("\n2. Verificando overlaps entre cenas...");

for (let i = 0; i < scenes.length - 1; i++) {
  const current = scenes[i];
  const next    = scenes[i + 1];

  const currentEnd = current.from + current.dur;
  const overlap    = currentEnd - next.from;

  if (overlap < 0) {
    err(`${current.name} → ${next.name}: GAP de ${Math.abs(overlap)}f entre cenas!`);
    err(`  → Frames vazios são proibidos (BRABO Mandamento 7). Ajustar from ou dur.`);
  } else if (overlap < minOverlap) {
    err(`${current.name} → ${next.name}: overlap=${overlap}f < mínimo=${minOverlap}f`);
    err(`  → Reduzir from de ${next.name} ou aumentar dur de ${current.name}.`);
  } else if (overlap > maxOverlap) {
    warn(`${current.name} → ${next.name}: overlap=${overlap}f > máximo=${maxOverlap}f`);
    warn(`  → Overlap excessivo pode causar sobreposição visual indesejada.`);
  } else {
    ok(`${current.name} → ${next.name}: overlap=${overlap}f ✓`);
  }
}

// ─── VALIDAÇÃO 3: Total de frames ───────────────────────────────────────────

console.log("\n3. Verificando total de frames...");

const lastScene = scenes[scenes.length - 1];
const calculatedTotal = lastScene.from + lastScene.dur;

if (calculatedTotal !== totalFrames) {
  err(`Total calculado=${calculatedTotal}f ≠ totalFrames configurado=${totalFrames}f`);
  err(`  → Verificar last_scene.from + last_scene.dur e atualizar Root.tsx + render.js`);
} else {
  ok(`Total: ${calculatedTotal}f = ${(calculatedTotal / fps).toFixed(2)}s ✓`);
}

// ─── VALIDAÇÃO 4: Consistência com Root.tsx e render.js ─────────────────────

console.log("\n4. Verificando Root.tsx e render.js...");

const rootPath   = path.join(__dirname, "../src/Root.tsx");
const renderPath = path.join(__dirname, "./render.js");

try {
  const rootContent   = fs.readFileSync(rootPath, "utf8");
  const renderContent = fs.readFileSync(renderPath, "utf8");

  // Procura durationInFrames no Root.tsx para esta composition
  const rootMatch = rootContent.match(
    new RegExp(`id="${COMPOSITION}"[\\s\\S]*?durationInFrames=\\{(\\d+)\\}`)
  );
  if (rootMatch) {
    const rootFrames = parseInt(rootMatch[1]);
    if (rootFrames !== totalFrames) {
      err(`Root.tsx: durationInFrames=${rootFrames} ≠ ${totalFrames}`);
    } else {
      ok(`Root.tsx: durationInFrames=${rootFrames} ✓`);
    }
  } else {
    warn(`Root.tsx: não encontrou durationInFrames para "${COMPOSITION}"`);
  }

  // Procura duration no render.js para esta composition
  const renderMatch = renderContent.match(
    new RegExp(`${COMPOSITION}:[^}]*duration:\\s*(\\d+)`)
  );
  if (renderMatch) {
    const renderFrames = parseInt(renderMatch[1]);
    if (renderFrames !== totalFrames) {
      err(`render.js: duration=${renderFrames} ≠ ${totalFrames}`);
    } else {
      ok(`render.js: duration=${renderFrames} ✓`);
    }
  } else {
    warn(`render.js: não encontrou duration para "${COMPOSITION}"`);
  }
} catch (e) {
  warn(`Não foi possível verificar Root.tsx ou render.js: ${e.message}`);
}

// ─── VALIDAÇÃO 5: Arquivo de timing de narração (se existir) ────────────────

if (config.timingFile && fs.existsSync(config.timingFile)) {
  console.log("\n5. Verificando sync com narração...");

  try {
    const timing = JSON.parse(fs.readFileSync(config.timingFile, "utf8"));

    for (let i = 0; i < Math.min(scenes.length, timing.length); i++) {
      const scene = scenes[i];
      const narr  = timing[i];
      if (!narr) continue;

      const { EXIT_F } = scene;
      if (EXIT_F === null) continue;

      const exitAbsS = (scene.from + EXIT_F) / fps;
      const narr_end  = narr.end_s;

      const diff = Math.abs(exitAbsS - narr_end);
      if (diff > 0.5) {
        warn(`${scene.name}: exit em ${exitAbsS.toFixed(2)}s, narração termina em ${narr_end.toFixed(2)}s (diff=${diff.toFixed(2)}s)`);
      } else {
        ok(`${scene.name}: exit=${exitAbsS.toFixed(2)}s, narr_end=${narr_end.toFixed(2)}s (diff=${diff.toFixed(2)}s) ✓`);
      }
    }
  } catch (e) {
    warn(`Não foi possível verificar arquivo de timing: ${e.message}`);
  }
} else {
  info(`Arquivo de timing de narração não encontrado. Pulando validação de sync.`);
  info(`Para validar sync: criar ${config.timingFile || "docs/timing-[composition].json"}`);
}

// ─── RESULTADO FINAL ─────────────────────────────────────────────────────────

console.log(`\n========================================`);
if (errors > 0) {
  console.error(` RESULTADO: REPROVADO — ${errors} erro(s), ${warnings} aviso(s)`);
  console.error(` Corrigir todos os erros antes de renderizar.`);
  console.log(`========================================\n`);
  process.exit(1);
} else if (warnings > 0) {
  console.warn(` RESULTADO: APROVADO COM AVISOS — 0 erros, ${warnings} aviso(s)`);
  console.warn(` Verificar avisos antes de prosseguir.`);
  console.log(`========================================\n`);
  process.exit(0);
} else {
  console.log(` RESULTADO: APROVADO — 0 erros, 0 avisos`);
  console.log(` Pode renderizar com segurança.`);
  console.log(`========================================\n`);
  process.exit(0);
}
