# REELS ZOOM - Branding Standard APROVADO
# STATUS: IMUTAVEL - aprovado pelo usuario em 2026-03-26
# Aplicar IDENTICAMENTE em todos os 200 videos

---

## O QUE E FIXO (nunca muda entre videos)

Tudo neste documento e IDENTICO em todos os videos.
O unico elemento variavel e o CONTEUDO (texto vindo da transcricao).

---

## 1. CORES OFICIAIS (magna-theme.ts)

```
bg:       #0a0806   <- fundo base (preto quente)
bgAlt:    #0c0a06   <- fundo alternativo
bgCard:   #080604   <- fundo card
rg1:      #b8887a   <- rosegold escuro
rg2:      #d4a08a   <- rosegold medio (destaque principal)
rg3:      #f0c8b0   <- rosegold claro (highlight)
txt:      #f0e0d8   <- texto creme rosado (champagne)
border:   rgba(200,155,140,0.12)
```

Gradiente rosegold: `linear-gradient(135deg, #d4a08a, #f0c8b0, #b8887a)`
Gradiente H: `linear-gradient(90deg, #b8887a, #f0c8b0)`

---

## 2. TIPOGRAFIA APROVADA

```
display: 'Cormorant Garamond', Georgia, serif
  - uso: headlines dos B-rolls, titulos de impacto
  - weight: 700 (com italic obrigatorio em titulos de B-roll)
  - tamanhos: 60-72px nos B-rolls

body: 'DM Sans', system-ui, sans-serif
  - uso: subtitulos, tags, labels, legendas
  - weight: 400 (subtitulo), 600 (tag/label)
  - tamanhos: 18-36px

caption: 'DM Sans', system-ui, sans-serif
  - SEMPRE DM Sans nas legendas do video
```

REGRA: NUNCA usar Inter, Playfair Display ou outra fonte.
UNICA excecao: Inter nos B-rolls tipo "slam" do MagnaKineticV2 (composicao separada).

---

## 3. ICONES - REGRAS ABSOLUTAS

Fonte da verdade: `squads/iconografia/output/magna-icon-animated.html`
Total disponivel: 300 icones animados

Spec tecnica (todos os icones DEVEM seguir):
- viewBox: 0 0 24 24
- stroke-width: 0.45 (DELUXE - nunca 1.0, nunca outro valor)
- stroke-linecap: square (NUNCA round)
- stroke-linejoin: miter (NUNCA round)
- fill: none
- stroke: url(#rg) via SVGDefs
- filter: url(#glow) via SVGDefs
- Animacao: o que o objeto FAZ na vida real (nao efeitos genericos)

Tamanho em B-rolls sobre video: 320px (ICON_SZ = 320)
Tamanho em composicoes puras (MagnaKineticV2): 80-116px

REGRAS DE SELECAO:
- Um icone diferente por B-roll no mesmo video
- NUNCA repetir o mesmo icone no mesmo video
- NUNCA repetir o mesmo icone nos ultimos 5 videos produzidos
- Registrar icone usado em `squads/reels-zoom/data/icon-rotation.json`
- A ESTRELA (star) NAO pode ser icone padrao repetido em todos os videos

EXEMPLO de rotacao entre videos:
- Video 1: crown, rocket, target, diamond
- Video 2: zap, users, lightbulb, trending-up
- Video 3: shield, gear, key, layers
- Video 4: bell, dollar, puzzle, heart
...nunca repetindo ate completar o ciclo

Como usar a biblioteca animada no Remotion:
1. Abrir magna-icon-animated.html, localizar o icone pelo id
2. Copiar paths SVG + CSS @keyframes
3. Embutir como <style> + SVG no componente React
4. OU usar MagnaAnimatedIcon.tsx (componente centralizado - criar se nao existir)

---

## 4. GRAIN OVERLAY (textura premium - padrao Magna)

```
backgroundImage: GRAIN_SVG  <- importar de magna-theme.ts
opacity: 0.35 (B-rolls standalone)
opacity: 0.45 (composicoes puras)
```

Nunca remover o grain. E parte do DNA visual Magna.

---

## 5. SPRING PHYSICS APROVADOS

Todos os B-rolls usam spring com:
```
entrada rapida:   { damping: 14, stiffness: 55 }  <- padrao B-roll
entrada tag:      { damping: 14, stiffness: 60 }  <- badge/tag
fechamento:       { damping: 16, stiffness: 50 }  <- card de fechamento
icone:            { damping: 12, stiffness: 55 }  <- icone com breathe
legendas:         { damping: 14, stiffness: 60 }  <- captions
```

Breathe do icone: `1 + Math.sin(frame * 0.07) * 0.022`
Delays em cascata: 0, 6, 12, 18 frames (cada elemento espera 6 frames do anterior)

---

## 6. ESTRUTURA DOS B-ROLLS

Cada B-roll: 45 frames (1.5s a 30fps)
Sequencia de entrada dos elementos:
1. Subtitulo/label: frame 0 (translateY 20px -> 0)
2. Headline linha 1: frame 6 (translateY 30px -> 0 + blur 6->0)
3. Headline linha 2: frame 12 (identico)
4. Divider/elemento final: frame 18 (width 0 -> 100px)

Layout padrao:
```
[subtitulo rosegold pequeno - DM Sans 24-28px weight 400]
[HEADLINE GRANDE italic - Cormorant 60-72px weight 700 - cor champagne]
[COMPLEMENTO italic - Cormorant 60-72px weight 700 - cor rosegold claro]
[divider: line rosegold 3px altura, gradient, 100px largura]
```

Background de cada B-roll:
- Fundo solido: M.bg (#0a0806)
- Gradiente radial sobreposto: `radial-gradient(ellipse 90% 55% at 50% 45%, rgba(212,168,148,0.12) 0%, transparent 70%)`
- Grain overlay: GRAIN_SVG opacity 0.35

---

## 7. REENQUADRAMENTO DE ROSTOS

Padrao FIXO para todo video com 2 pessoas:

```
TOPO:    25% da altura = preto puro #000000
ROSTO 1: 25% da altura = Allysson (host) - crop justo, testa pode cortar
ROSTO 2: 25% da altura = Convidado - crop justo, colado no rosto 1
BASE:    25% da altura = preto puro (area para legenda)
```

ZERO gap entre rostos (gap_between_faces = 0)
Rostos preenchem 100% da largura
Escala: olhos no terco superior do crop

Resolucao draft: 720x1280 (crf 28)
Resolucao final: 1080x1920 (crf 18)

---

## 8. LEGENDAS PADRAO MAGNA

Estilo: selective (NAO continua)
Maximo: 4-6 destaques por reels de 30-60s
Tipo: cards de destaque nos momentos de impacto

Nunca sobrepor rostos.
Posicao: area inferior (75%) ou superior (25%)
Shadow: difusa

Animacoes disponiveis: slideUp, slideLeft, slideRight, scaleUp, blur-in, slideDown
NUNCA 2 animacoes iguais seguidas.

---

## 9. DIMENSOES E FPS

Formato: 9:16 vertical
Resolucao final: 1080x1920
FPS: 30
Duracao alvo: 30-90 segundos
Gancho: max 8 segundos

---

## 10. GRADIENTE SVG DEFS (embutir em todo SVG)

```xml
<defs>
  <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#c4a88a" />
    <stop offset="50%" stop-color="#e0cdb8" />
    <stop offset="100%" stop-color="#8a7260" />
  </linearGradient>
  <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="0.22" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</defs>
```

---

## 11. O QUE VARIA ENTRE VIDEOS (lista completa)

- Textos dos B-rolls (vem da transcricao do video)
- Icones escolhidos (rotacao obrigatoria)
- Timestamps dos cortes (vem do roteiro final)
- Gancho (extraido da transcricao pelo hook-extractor)
- Nome do convidado

TUDO MAIS E IDENTICO. Sem excecao.
