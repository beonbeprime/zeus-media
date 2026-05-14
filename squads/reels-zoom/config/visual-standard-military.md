# REELS ZOOM - Padrao Visual Nivel Militar

## STATUS: INVIOLAVEL - Nunca modificar sem aprovacao explicita

Este documento define O PADRAO APROVADO de todo material que sai do REELS ZOOM Squad.
Qualquer video que nao siga EXATAMENTE estes valores deve ser retrabalhado antes de publicar.
Aprovado na primeira entrega em 2026-03-26.

---

## PARTE 1: CORES (valores exatos - zero variacao permitida)

| Nome | Hex | Uso |
|------|-----|-----|
| bg_dark | #0a0806 | Fundo de B-rolls |
| bg_black | #000000 | Preto das bandas top/bottom nos rostos |
| txt_champagne | #f0e0d8 | Texto principal, headlines, legendas |
| rg2_rosegold | #d4a08a | Destaques, icones, captions highlight |
| rg1_medio | #c4a88a | Subheadlines, elementos secundarios |
| rg0_escuro | #8a7260 | Elementos sutis, sombras leves |

PROIBIDO:
- Qualquer variacao de #d4a08a (nao usar #d4a090 ou similar)
- Branco puro (#ffffff) em qualquer elemento
- Tons de cinza no fundo (so #000000 puro)
- Dourado (diferente de rosegold - ver memoria feedback-logo-magna-padrao.md)

---

## PARTE 2: TIPOGRAFIA (especificacao exata)

### Fonte Display - B-roll headlines

```
font-family: 'Cormorant Garamond', serif
font-style: italic
font-weight: 400
uso: titulos principais dos B-rolls, frases de impacto
NUNCA usar: Playfair Display (parecida mas diferente)
NUNCA usar: Georgia, Times, qualquer outra serif
```

### Fonte Body - subtextos e contexto

```
font-family: 'DM Sans', sans-serif
font-weight: 400-600
uso: subtitulos de B-rolls, descricoes, textos de apoio
```

### Fonte Legenda - caption continuo

```
font-family: 'DM Sans', sans-serif
font-weight: 700
font-size: 28-36px
cor normal: #f0e0d8
cor destaque: #d4a08a (rosegold rg2)
max_words_per_caption: 3
```

---

## PARTE 3: ICONES (especificacao exata)

Biblioteca: 300 icones animados Magna
Arquivo: squads/iconografia/output/magna-icon-animated.html

```
viewBox: 0 0 24 24
stroke-width: 0.45
stroke-linecap: square
stroke-linejoin: miter
stroke: #d4a08a (rosegold rg2)
fill: none
tamanho no video: ICON_SZ = 320px (B-rolls)
```

Animacao:
- Usar animacao natural do icone (o que o objeto FAZ)
- Nao usar fade/scale generico
- Copiar paths + @keyframes CSS diretamente do arquivo magna-icon-animated.html

Regra de rotacao:
- Nunca repetir o mesmo icone dentro do mesmo video
- Nunca repetir icone dos ultimos 5 videos
- Registrar em: squads/reels-zoom/data/icon-rotation.json

---

## PARTE 4: GRAIN (especificacao exata)

```svg
<feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch"/>
<feColorMatrix type="saturate" values="0"/>
<feBlend in="SourceGraphic" mode="overlay"/>
opacity: 0.35
```

NUNCA remover o grain. E parte fundamental da identidade Magna.

---

## PARTE 5: LAYOUT DO FRAME (distribuicao exata)

```
+----------------------------+  <- topo do frame 9:16 (1080x1920)
|                            |
|    PRETO PURO (#000000)    |  <- 25% da altura = 480px
|                            |
+============================+
|                            |
|    SLOT ROSTO 1 (HOST)     |  <- 25% da altura = 480px
|    (Allysson, sempre cima) |    olhos a 35% do topo do slot
|                            |
+----------------------------+  <- COLADOS (zero gap)
|                            |
|    SLOT ROSTO 2 (CONVIDADO)|  <- 25% da altura = 480px
|    (convidado, sempre baixo)|   olhos a 35% do topo do slot
|                            |
+============================+
|                            |
|    PRETO PURO (#000000)    |  <- 25% da altura = 480px
|    (area de legenda)       |
|                            |
+----------------------------+  <- base do frame
```

Medidas para draft (720x1280):
- Preto top: 320px
- Slot 1: 320px
- Slot 2: 320px
- Preto bottom: 320px

Medidas para final (1080x1920):
- Preto top: 480px
- Slot 1: 480px
- Slot 2: 480px
- Preto bottom: 480px

---

## PARTE 6: CENTRALIZACAO DE ROSTOS (algoritmo exato)

```python
# Algoritmo canonical - implementado em reframe.py

EYE_FRAC = 0.35  # olhos a 35% do topo do slot

# Calcular centro dos olhos via MediaPipe Face Mesh
LEFT_EYE  = [33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246]
RIGHT_EYE = [362,249,390,373,374,380,381,382,362,398,384,385,386,387,388,466]

ex = mean([p.x for p in eye_points]) * frame_width
ey = mean([p.y for p in eye_points]) * frame_height

# Posicionar olhos a 35% do topo
crop_y = ey - EYE_FRAC * crop_h

# Centralizar horizontalmente
crop_x = face_cx - crop_w / 2
```

Verificacao obrigatoria:
- ey/crop_h entre 0.30 e 0.42 (tolerancia aceitavel)
- (face_cx - crop_x)/crop_w entre 0.45 e 0.55

---

## PARTE 7: B-ROLLS (estrutura exata)

### Spring de animacao

```tsx
// Padrao para TODOS os B-rolls
const spring_config = { damping: 14, stiffness: 55 }
```

### Estrutura do JSON

```json
{
  "timestamp": "00:05",
  "subtitle": "frase de contexto curta",
  "headline1": "PALAVRA IMPACTO",
  "headline2": "complemento",
  "iconId": "crown",
  "hasIcon": true,
  "forceStyle": 1,
  "elements": ["item 1", "item 2", "item 3"]
}
```

REGRAS ABSOLUTAS:
- "elements" NUNCA "lines"
- forceStyle 1, 2 ou 7 quando hasIcon = true
- forceStyle 0, 3, 4, 5 ou 6 quando nao tem icone
- iconId deve existir no ICON_MAP_INLINE (30 disponiveis)
- Todos os textos com acentuacao perfeita (accent-enforcer.ts)
- Minimo 1 schema visual (schema, path, checklist) a cada 15s de video

### Renderizacao

```bash
# SEMPRE via Remotion - NUNCA via PIL ou geracao manual
npx remotion render MagnaEditV2 output.mp4

# Projeto Remotion
C:/Users/Pichau/Desktop/magna-video-editor/
```

---

## PARTE 8: AUDIO E CORTES (especificacao exata)

- Cortes SOMENTE em silencios reais (RMS < percentil 25)
- Margem: 50ms antes da fala, 30ms apos a fala
- Sem pausa > 400ms no video final
- Fade in/out de 15ms em cada trecho (evitar clicks)
- setpts=PTS-STARTPTS obrigatorio apos cada trim
- Nenhum frame com brilho < 15 na area de rostos (confirma zero flash preto)

---

## PARTE 9: FECHAMENTO (ultimos 3 segundos)

- MagnaOutro automatico via Remotion
- Foto circular de Allysson
- Handle: copiar LITERALMENTE do pedido do usuario
- Texto "Siga"
- Fundo: #0a0806

---

## PARTE 10: O QUE NUNCA MUDA ENTRE VIDEOS

| Elemento | Valor | Nunca mudar para |
|----------|-------|-----------------|
| Fundo B-roll | #0a0806 | qualquer outro escuro |
| Fundo slots | #000000 | cinza, quasi-preto |
| Texto principal | #f0e0d8 | branco, creme |
| Destaque/rosegold | #d4a08a | dourado, laranja |
| Fonte headline | Cormorant Garamond italic | Playfair, Georgia |
| Fonte legenda | DM Sans 700 | Inter, Roboto |
| Stroke icones | 0.45 | 1.0, 1.5 |
| Linecap | square | round |
| Layout | 25/25/25/25 | qualquer outro split |
| Spring | damping 14, stiffness 55 | outros valores |
| Grain | 0.88 / 0.35 | sem grain |
| Renderizacao | Remotion | PIL, Canvas |

---

## PARTE 11: O QUE MUDA ENTRE VIDEOS

| Elemento | Origem |
|----------|--------|
| Nome do convidado | Usuario fornece |
| Conteudo (gancho, narrativa) | Transcricao Whisper |
| iconIds dos B-rolls | icon-rotation.json (evitar repeticao) |
| Textos dos B-rolls | Transcricao + @narrative-architect |
| Handle do fechamento | Usuario fornece (copiar literal) |
| Foto do convidado (se necessario) | Usuario fornece |
| Timestamps dos segmentos | Waveform + roteiro |

---

## PARTE 12: VIDEOS DE REFERENCIA CANONICOS (NAO MODIFICAR)

O padrao visual e UNICO. O que varia e a COMPOSICAO.
Estes dois videos sao a prova de como o padrao deve ser replicado.
Qualquer video novo deve parecer da mesma familia que estes dois.

### ZOOM #1 - Nanjaira v16
```
Arquivo: squads/reels-zoom/producoes/nanjaira/rascunhos/reels-nanjaira-v16.mp4
Data: 2026-03-26
Gancho: "Primeiro, voce vende"
Tipo: ZOOM (2 rostos, 25/25/25/25)
Duracao: 22.36s
Icones usados: lightbulb, dollar, target, star, gear, crown, rocket
Layouts: V05 (gancho), V02, V02, V01, V03, V02, V01, S01
Captions: 9 frases curadas (nao palavra-por-palavra)
```

### ZOOM #2 - Rafael
```
Arquivo: squads/reels-zoom/producoes/rafael/final/draft-v35.mp4
Data: 2026-03-27
Gancho: "Aluno entrou no meio da mentoria?"
Tipo: ZOOM (2 rostos, 25/25/25/25)
Icones usados: users, document, clock
Layouts: V05, V01, V02, V01
Captions: 4 frases curadas
```

REGRA: Antes de montar qualquer video novo, rever UM desses dois como referencia visual.
Perguntar: "Isso parece da mesma familia?"

---

## PARTE 13: REGRAS DE VARIACAO DE COMPOSICAO

O padrao visual e IDENTICO. A composicao VARIA.

### O que e composicao
- Qual layout de B-roll usar (V01-V15)
- Qual schema usar (S01-S15)
- Quantos B-rolls (5-8 para ZOOM, 4-6 para VERTICAL, 6-10+ para MOTION)
- Ordem dos layouts no video
- Quais icones usar (sempre diferentes dos ultimos 5 videos)

### Como variar
1. Ler `config/layout-variations.md` antes de montar o edit-project
2. Ler `data/icon-rotation.json` para ver icones bloqueados
3. Escolher layouts que NAO foram usados nos 2 videos anteriores
4. Montar sequencia variada: gancho sem icone -> B-rolls com icone -> schema -> B-rolls -> fechamento

### Regras de sequencia recomendada
1. B-roll 0: V05 ou V07 ou V08 (sem icone, impacto maximo - gancho)
2. B-rolls 1-3: V01, V02, V03 alternando (com icone)
3. Schema: no meio (S01-S04 para processos simples)
4. B-rolls 4-6: V04, V14, V13 (variacao visual)
5. Fechamento: V06 ou V14 (frase de impacto final)

### O que NUNCA varia
- Cores, fontes, grain, stroke, spring - tudo em PARTE 10
- Layout 25/25/25/25 dos rostos (so para ZOOM)
- Remotion MagnaEditV2 como renderizador
- Icones da biblioteca Magna (300 animados)

---

## REFERENCIAS

```
Scripts:
  squads/reels-zoom/scripts/reframe.py        <- reenquadramento canonico
  squads/reels-zoom/scripts/requirements.txt  <- dependencias

Configuracao:
  squads/reels-zoom/config/branding-standard.md
  squads/reels-zoom/config/GUARANTEE-CHECKLIST.md
  squads/reels-zoom/config/errors-learned.md
  squads/reels-zoom/config/video-types.md          <- 3 tipos: ZOOM / VERTICAL / MOTION
  squads/reels-zoom/config/layout-variations.md    <- 15 B-roll styles + 15 schemas
  squads/reels-zoom/config/viral-hook-protocol.md  <- 10 gatilhos psicologicos
  squads/reels-zoom/data/icon-rotation.json

Remotion:
  C:/Users/Pichau/Desktop/magna-video-editor/
  Composicao: MagnaEditV2

Icones animados:
  squads/iconografia/output/magna-icon-animated.html
```
