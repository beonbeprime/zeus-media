# Padrão de prompt de fotografia - PHOTO LYRICS

Prompt SEMPRE em inglês. O texto da cena SEMPRE em português, entre aspas
duplas, EXATO (com acento, cedilha, til). Vertical 9:16.

## Template base

```
vertical 9:16 photograph, [SCENE: amber glass bottle on a wet bar counter at night],
with the text "QUEM QUER VOCÊ" [hand-painted on the label], text positioned in the
upper two thirds of the frame, large and clearly readable, shot on [Canon 5D Mark IV,
50mm f/1.4], [warm tungsten lighting], shallow depth of field, natural imperfections,
film grain, dust particles, slight motion blur in background, candid documentary
composition, realistic materials and textures
```

## Bloco negativo anti-IA (anexar SEMPRE)

```
no CGI look, no 3D render, no illustration, no smooth plastic skin, no perfect
symmetry, no oversaturated HDR colors, no watermark, no extra fingers, no warped
or distorted letters
```

## Estratégia de texto legível (a parte crítica)

- Máximo 4 palavras por imagem (ideal 2-3). Frase maior: o segmenter divide.
- CAIXA ALTA por padrão (o gerador erra menos formas de letra), MANTENDO
  acentos: "VOCÊ", "NÃO", "CORAÇÃO". NUNCA remover acento para "facilitar".
- Tipografia da cena no prompt: "bold hand-painted letters",
  "stick-and-poke tattoo lettering", "chalk handwriting", "neon tube letters",
  coerente com a superfície.
- Frase com acento: reforço explícito no prompt:
  `the text must read exactly "VOCÊ" including the circumflex accent`.

## 3 variações de estilo fotográfico (alternar entre cenas)

1. Film look: `shot on Kodak Portra 400, 35mm film, natural grain, soft halation`
2. Flash direto: `direct on-camera flash, paparazzi style, hard shadows, candid`
3. Editorial natural: `golden hour window light, editorial photography, 85mm f/1.8`

## Regeneração (máx 3 tentativas por cena)

- Tentativa 2: usar `reference_image` da tentativa 1 pedindo SÓ a correção do
  texto (o lovart-py suporta).
- Tentativa 3: simplificar a frase ou trocar a superfície (com o Scena).
- Falhou 3x: marcar `overlay-fallback` (texto aplicado via Remotion com
  tipografia integrada à cena) e registrar em errors-learned.md.
