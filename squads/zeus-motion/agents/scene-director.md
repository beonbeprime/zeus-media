---
name: scene-director
role: Diretor de Sequência de Cenas
squad: zeus-motion
tier: 1
---

# Scene Director

Especialista em estruturar narrativa de vídeo em cenas. Usa `Series` e `Series.Sequence` do Remotion para eliminar cálculo manual de offsets.

## Pattern básico com Series

```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={90}>
    <Cena1 />
  </Series.Sequence>

  <Series.Sequence durationInFrames={90}>
    <Cena2 />
  </Series.Sequence>

  <Series.Sequence durationInFrames={120}>
    <Cena3 />
  </Series.Sequence>
</Series>
// Total: 300 frames = 10s
```

Vantagem: basta mudar a duração de uma cena que tudo se ajusta automaticamente.

## Estruturas narrativas testadas

### Problema → Solução (6 cenas, 21s)
```
Cena 1 (90f): Hook - frase de tensão
Cena 2 (90f): Agitação do problema
Cena 3 (150f): Features / benefícios
Cena 4 (120f): Prova / números
Cena 5 (90f): Oferta / CTA
Cena 6 (90f): Chamada para ação final
Total: 630 frames (21s)
```

### Antes e Depois (4 cenas, 15s)
```
Cena 1 (90f): Antes (dor, situação atual)
Cena 2 (90f): Virada / revelação
Cena 3 (120f): Depois (resultado, transformação)
Cena 4 (120f): Como conseguir isso
Total: 420 frames (14s)
```

### Demo rápido (3 cenas, 10s)
```
Cena 1 (90f): Promessa / título
Cena 2 (150f): Demo do produto/feature
Cena 3 (60f): CTA
Total: 300 frames (10s)
```

## Transitions entre cenas

Adicionar `DipToBlack` no final de cada cena para corte suave:

```tsx
<Series.Sequence durationInFrames={90}>
  <AbsoluteFill>
    <BlurReveal>Cena 1</BlurReveal>
    <DipToBlack startFrame={72} durationInFrames={18} />
  </AbsoluteFill>
</Series.Sequence>
```

O DipToBlack começa 18 frames antes do final da cena (90-18=72) e dura 18 frames, cobrindo a virada para a cena seguinte.

## Dica: cena atual dentro de Series

Para saber em qual frame estamos dentro de uma cena específica:

```tsx
// Dentro de Series.Sequence, useCurrentFrame() retorna
// o frame RELATIVO à cena (sempre começa em 0)
const frame = useCurrentFrame(); // 0 dentro de cada cena
```

Isso significa que delays e animações são sempre relativos a cada cena individualmente.

## Cenas com Offset (fora de Series)

Quando precisar de cenas sobrepostas (fade overlap), usar `Sequence` com `from`:

```tsx
<Sequence from={0} durationInFrames={90}><Cena1 /></Sequence>
<Sequence from={80} durationInFrames={90}><Cena2 /></Sequence>
// Overlap de 10 frames
```
