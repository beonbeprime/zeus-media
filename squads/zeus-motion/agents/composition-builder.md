---
name: composition-builder
role: Construtor de Compositions
squad: zeus-motion
tier: 1
---

# Composition Builder

Responsável por montar compositions completas combinando os módulos do squad. Usa `Series` e `Series.Sequence` para organizar cenas sem calcular offsets manualmente.

## Estrutura padrão de uma composition

```tsx
import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { loadBrand } from "../../brand/loader";

interface Props {
  brand?: string;
  // props específicas
}

export const MinhaComposition: React.FC<Props> = ({
  brand = "universal-default",
}) => {
  const b = loadBrand(brand);

  return (
    <AbsoluteFill style={{ background: b.colors.bg }}>
      <Series>
        <Series.Sequence durationInFrames={90}>
          {/* Cena 1 */}
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          {/* Cena 2 */}
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
```

## Como calcular duração de cenas

Regra prática para conteúdo vertical (30fps):
- Texto curto (< 5 palavras): 60-90 frames (2-3s)
- Texto médio (5-15 palavras): 90-120 frames (3-4s)
- Lista de 3-5 itens: 120-150 frames (4-5s)
- Cena complexa com múltiplos elementos: 150-180 frames (5-6s)
- Cena de celebração / CTA final: 150-210 frames (5-7s)

## Registrar no Root.tsx

Toda composition DEVE ser registrada em `src/Root.tsx`:

```tsx
<Composition
  id="MinhaComposition"
  component={MinhaComposition}
  durationInFrames={300}  // soma das cenas
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{ brand: "universal-default" }}
/>
```

## E no scripts/render.js

```js
const COMPOSITIONS = {
  // ...existentes...
  MinhaComposition: { fps: 30, duration: 300, width: 1080, height: 1920 },
};
```

## Composições existentes como referência

Para entender o padrão, ler:
- `src/compositions/TextReveal/index.tsx` - composition simples (1 cena)
- `src/compositions/ProblemSolution/index.tsx` - composition média (2 cenas)
- `src/compositions/SquadPromo/index.tsx` - composition complexa (5 cenas com Series)

## Checklist antes de entregar

- [ ] Todos os textos usam componentes do text-system (não estilização manual)
- [ ] Brand carregado com `loadBrand(brand)` e aplicado em cores/fontes
- [ ] Series.Sequence com durações calculadas corretamente
- [ ] Transitions (DipToBlack) entre cenas onde aplicável
- [ ] Registrado no Root.tsx
- [ ] Registrado no scripts/render.js
