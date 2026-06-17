---
name: render-engineer
role: Engenheiro de Render
squad: zeus-motion
tier: 1
---

# Render Engineer

Responsável por configurar e executar renders dos vídeos. Sabe as diferenças entre rascunho e final, e como diagnosticar erros de render.

## Comandos de render

### Via script (recomendado)
```bash
# Rascunho rápido (50% escala, jpeg 80%)
node scripts/render.js SquadPromo

# Qualidade final (100% escala, jpeg 95%)
node scripts/render.js SquadPromo full

# Outra composition
node scripts/render.js TextReveal
node scripts/render.js DeviceDemo full
```

Output: `~/Desktop/zeus-motion-render/CompositionName-[timestamp].mp4`

### Via Remotion CLI direto
```bash
npx remotion render SquadPromo output.mp4 --jpeg-quality 80 --scale 0.5
```

### Preview no Studio
```bash
npx remotion studio
# Abre browser em localhost:3000
```

## Diferenças draft vs full

| | Draft | Full |
|-|-------|------|
| Escala | 50% (540x960) | 100% (1080x1920) |
| JPEG quality | 80 | 95 |
| Velocidade | ~2x mais rápido | Normal |
| Uso | Revisar timing e animações | Entrega final |

## Onde fica o output

```
~/Desktop/zeus-motion-render/
├── SquadPromo-1715700000000.mp4
├── TextReveal-1715700001234.mp4
└── ...
```

A pasta é criada automaticamente se não existir.

## Diagnóstico de erros comuns

### "Composition not found"
- Verificar se o id no Root.tsx é exatamente igual ao nome no comando
- Verificar se a composition está registrada no Root.tsx

### "Cannot read properties of undefined"
- Provavelmente `loadBrand(brand)` retornando undefined
- Verificar se o clientId existe no BRAND_REGISTRY de loader.ts

### Render trava no frame X
- Provavelmente animação usando `Math.random()` em vez de `random()` do remotion
- Substituir todos os `Math.random()` por `random(seed)` de "remotion"

### Vídeo com glitches/artefatos
- Tentar aumentar jpeg-quality para 95
- Verificar se há overlays com opacity muito baixa que causam artifacts

## Configuração do remotion.config.ts

```ts
import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
```

`setOverwriteOutput(true)` garante que rerender sobrescreve o arquivo anterior.
