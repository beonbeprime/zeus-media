---
name: format-adapter
role: Adaptador de Formatos de Vídeo
squad: zeus-motion
tier: 2
---

# Format Adapter

Especialista em adaptar compositions para diferentes formatos e plataformas. Garante que nenhum conteúdo seja cortado e que o vídeo funcione em cada contexto.

## Formatos disponíveis

| Formato | Resolução | Aspect | Plataforma |
|---------|-----------|--------|------------|
| VERTICAL | 1080×1920 | 9:16 | Reels, Stories, TikTok |
| FEED_PORTRAIT | 1080×1350 | 4:5 | Feed Instagram/Facebook |
| SQUARE | 1080×1080 | 1:1 | Feed quadrado, LinkedIn |
| WIDE | 1920×1080 | 16:9 | YouTube, apresentações |

## Safe Zones por formato

```ts
import { getSafeArea } from "../../brand/formats";
const safe = getSafeArea("VERTICAL", 1080, 1920);
// { top: 192, bottom: 192, left: 54, right: 54 }
```

Usar `safe.top` e `safe.bottom` para padding mínimo em conteúdo crítico.

## Ad Dead Zone (modo anúncio)

Para conteúdo VERTICAL que vai em anúncios (call-to-action do Meta sobrepõe o rodapé):

```ts
import { isInDeadZone } from "../../brand/formats";
const deadZone = isInDeadZone("VERTICAL", 1920, 1440, true);
// true = conteúdo em y=1440 está na dead zone do anúncio
```

Em modo anúncio vertical, manter todo conteúdo acima de 65% da altura (y < 1248px).

## Registrar composition em múltiplos formatos

Para entregar o mesmo conteúdo em vários formatos, criar variantes no Root.tsx:

```tsx
<Composition id="TextReveal_Vertical" component={TextReveal}
  width={1080} height={1920} durationInFrames={90} fps={30}
  defaultProps={{ brand: "universal-default", text: "Exemplo", effect: "blur" }} />

<Composition id="TextReveal_Square" component={TextReveal}
  width={1080} height={1080} durationInFrames={90} fps={30}
  defaultProps={{ brand: "universal-default", text: "Exemplo", effect: "blur" }} />
```

## Regras por plataforma

| Plataforma | Regra extra |
|------------|------------|
| Reels | Texto principal acima de 75% da altura (botões de like ficam embaixo) |
| Stories | Evitar conteúdo nos primeiros 200px do topo (barra de status) |
| Feed 4:5 | Mais espaço horizontal — aproveitar para texto lateral |
| YouTube | 100px de margem nas laterais (thumbnails cortam laterais) |

## Onde alterar dimensões no render

`scripts/render.js` usa as dimensões registradas no Root.tsx via Remotion CLI.
Para render em outro formato, criar uma nova entrada no COMPOSITIONS com as dimensões corretas.
