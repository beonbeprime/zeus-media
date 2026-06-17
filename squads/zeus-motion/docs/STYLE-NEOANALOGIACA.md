# Motion Style: Neo-Analógica (Aprovado v12)

> Documentação interna do estilo de motion aprovado.
> Base: MaquinaNeoanalogiaca2 — v12 final aprovada em 24/05/2026.
> Para criar novos vídeos neste estilo: ler este documento inteiro antes de escrever uma linha de código.

---

## 1. O QUE É ESTE ESTILO

**Nome interno:** Neo-Analógica
**Perfil visual:** Dark premium moderno — fundo preto, acento de cor vibrante, grid sutil, grain de filme
**Público:** Empreendedores, mentores, infoprodutores. Tom de autoridade jovem, direto, urgente.
**Referência mental:** Apple Keynote + Instagram Reels de alta performance + Awwwards dark UI
**Formato:** Portrait 1080x1920 (Reels/Stories), 30fps

Este estilo funciona para qualquer produto digital de alto valor:
- Mentorias
- Cursos
- Lançamentos
- Produtos low ticket
- Criativos de anúncio

Trocar o acento de cor muda o "sabor" do estilo sem quebrar a linguagem:
- Rosa (#FF2D78): mentorias femininas, premium, iOS feel
- Verde neon (#D6FF00): brutalismo tech, mais agressivo
- Ciano (#00C2FF): tech, masculino, startup
- Gold (#C99A3A): luxury, premium, vintage

---

## 2. TOKENS VISUAIS (não alterar sem motivo)

### Cores
```
BG    = "#050505"    — fundo quase preto (não puro preto, evita crush no encode)
WHITE = "#F2F2F2"    — branco sujo (não puro branco, mais orgânico)
DARK2 = "#1A1A1A"   — superfícies secundárias, tracks de barra

ACENTO PRINCIPAL (variar por projeto):
  Rosa:   ROSE1 = "#FF2D78" / ROSE2 = "#FF85B3"
  Verde:  ACID1 = "#D6FF00" / ACID2 = "#EAFF66"
  Ciano:  CYAN1 = "#00C2FF" / CYAN2 = "#66DDFF"
```

### Tipografia
```
FONT = "SF Pro Display", "Inter", -apple-system, "Helvetica Neue", sans-serif
MONO = "Space Mono", "Courier New", monospace

Hierarquia aprovada:
  COLOSSAL:  fontSize 162-198, fontWeight 900, letterSpacing -7 a -10  (números, palavras de impacto)
  HEADLINE:  fontSize 52-60,  fontWeight 600-800, letterSpacing -1 a -2  (frases principais)
  SUBTÍTULO: fontSize 30-34,  fontWeight 400,     letterSpacing 2-3, UPPERCASE, opacity 0.45
  LABEL:     fontSize 22-26,  MONO, letterSpacing 1-4  (tags, labels de progresso)
  BODY:      fontSize 36-44,  fontWeight 600, letterSpacing -1  (listas, itens)

Regra de peso: títulos grandes usam FONT. Labels técnicos usam MONO.
```

### Espaçamento
```
SAFE_X = 80px  — padding lateral de segurança (nunca menos que isso)
Margens entre blocos verticais: 16-52px conforme hierarquia
```

### Background composto (3 camadas obrigatórias)
```
Camada 1: AbsoluteFill com cor BG (#050505)
Camada 2: Radial gradient de acento (glow por cena) — opacity varia por cena
Camada 3: Grid de linhas finas — opacity 0.07, stroke 0.5px
Camada 4: Grain SVG (feTurbulence baseFrequency 0.88) — opacity 0.035, mixBlendMode overlay
```

O grain é obrigatório. Sem grain, o fundo parece digital e sintético. Com grain, tem profundidade de filme.

---

## 3. PRIMITIVAS DE ANIMAÇÃO

Estas funções são o coração do estilo. Não reinventar, usar sempre estas.

### `ci()` — interpolate com clamp
```tsx
const ci = (frame, [f0, f1], [v0, v1], easing?) =>
  interpolate(frame, [f0, f1], [v0, v1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
```
Usar SEMPRE com clamp. Nunca usar interpolate raw (causa overshooting fora do range).

### `entryFrom()` — entrada direcional
```tsx
entryFrom(frame, dir, distance=80, dur=20)
// dir: "left" | "right" | "top" | "bottom"
```
O que faz:
- Opacity: 0 → 1 nos primeiros 60% da duração
- Translate: desloca `distance` px → 0 com Easing.out(cubic)
- Blur: 10px → 0 nos primeiros 45% da duração com Easing.out(quad)

Parâmetros aprovados por tipo de elemento:
```
Subtítulo label:   distance=40-60,  dur=18
Headline principal: distance=80,    dur=20-24
Bloco de lista:    distance=60-80,  dur=18-22
CTA button:        distance=100,    dur=26
Elementos tardios: passar frame-offset (Math.max(0, frame - N))
```

### `exitTo()` — saída direcional (acelerada)
```tsx
exitTo(frame, start, dir, distance=1100, dur=16)
```
O que faz:
- Opacity: 1 → 0 nos últimos 65% da duração (começa a sumir no meio)
- Translate: 0 → `distance` px com Easing.in(exp) — acelera exponencialmente
- Scale: 1 → 0.94 com Easing.in(exp) — leve encolhimento
- Blur: 0 → 18px com Easing.in(cubic)

Parâmetros aprovados por direção:
```
exit LEFT/RIGHT:  distance=1200, dur=16
exit TOP/BOTTOM:  distance=1300, dur=17
```

### `exitScaleOut()` — saída por escala (para números/elementos centrais)
```tsx
exitScaleOut(frame, start, dur=18)
// scale: 1 → 0.72 + opacity: 1 → 0 + blur: 0 → 12
```
Usar em elementos que ocupam o centro da tela e não têm direção natural de saída.

### Spring configs aprovadas
```tsx
SPRING_PUNCH  = { damping: 24, stiffness: 220, mass: 0.7 }  // entrada rápida, snap
SPRING_TEXT   = { damping: 16, stiffness: 130, mass: 0.8 }  // texto natural
SPRING_COLOS  = { damping: 12, mass: 1.4, stiffness: 90 }   // número colossal, elástico
SPRING_SNAP   = { damping: 14, stiffness: 260, mass: 0.7 }  // "21 DIAS" — snap com spring
```

### Easing para movimento de bolinha/tracker
```tsx
// EXTREME AE EASE — aprovado, não usar outro
Easing.bezier(0.87, 0, 0.13, 1)
// Equivale a: aceleração lenta (17% inicial), explosão no meio, desaceleração lenta (17% final)
// Resultado: a bolinha fica "presa" no início e no fim — movimento dramático e profissional
```

### Chromatic Aberration
```tsx
// Usar APENAS em momentos de impacto (entrada de cena, palavra colossal)
// intensity: 0 → 1, onde 1 = máximo (px = 22)
// Dura apenas os primeiros 12-20 frames da cena, depois some
ChromaAberration: intensity * 0.35 opacity, screen blend mode
```

---

## 4. ESTRUTURA DE CENAS

### Padrão de timing por cena
```
Cada cena = Sequence (from, durationInFrames)
- As cenas podem sobrepor-se ligeiramente (ex: S2 começa 12f antes de S1 terminar)
- Sobreposição cria transição fluida sem corte seco
- Exit da cena anterior começa ~22f antes do fim da Sequence

Cálculo padrão:
  isExiting = frame >= (durationInFrames - 22)
  exitStyle = exitTo(frame, isExiting_threshold, dir, 1200, 16)
```

### Direções de saída alternadas (padrão aprovado)
```
S1 → exit LEFT
S2 → exit BOTTOM
S3 → exit RIGHT
S4 → exit TOP
S5 → exitScaleOut (sem direção)
S6 → exit LEFT
S7 → exit BOTTOM
S8 → fade opacity (masterOp) — última cena nunca sai em direção
```
A alternância LEFT/BOTTOM/RIGHT/TOP/SCALE cria variedade e evita monotonia.

### Sequência de tipos de cena (padrão aprovado)
```
Cena 1 — PROBLEMA/MITO:    palavra-chave Word-by-Word + cursor piscando
Cena 2 — IMPACTO:          palavra colossal (fontSize 188-198) + chroma aberration
Cena 3 — CHECKLIST:        itens com X/check + risco progressivo + card border
Cena 4 — SOLUÇÃO VISUAL:   infográfico (funil, círculos, diagrama)
Cena 5 — DADO NUMÉRICO:    countup de número grande + acento colossal
Cena 6 — PRAZO/PROGRESSO:  título "X DIAS" spring + progress bar milestone
Cena 7 — GARANTIA/PROVA:   círculo animado com counter + glow pulsante
Cena 8 — CTA:              headline + subtítulo + botão pulsante + seta + logo
```

Esta sequência resolve o arco emocional completo de um ad:
Problema → Negação → O que não precisa → O que precisa → Prova → Prazo → Garantia → CTA

---

## 5. COMPONENTES ESPECIAIS

### WordByWord
Revelação palavra por palavra com stagger.
```tsx
<WordByWord
  text="texto completo aqui"
  startFrame={22}          // quando começa a revelar
  stagger={7}              // frames entre cada palavra (7 = lento/dramático, 3-4 = rápido)
  style={{ fontSize: 52, ... }}
  highlights={{
    "palavrachave": {       // chave = palavra em minúsculas, sem pontuação
      color: ACENTO,
      shadow: `0 0 18px ${ACENTO}cc, 0 0 42px ${ACENTO}66, 0 0 80px ${ACENTO}33`,
    },
  }}
/>
```
Destaca palavras-chave em cor acento com glow em 3 camadas de blur.
A chave é a palavra em minúsculas sem pontuação: "mentoria", "pronto", "resultado".

### Progress Bar com Milestone Ball
```tsx
// STOPS = centros de cada label com flex:1
// 5 milestones = [10, 30, 50, 70, 90]  (centros de 20% cada)
// 4 milestones = [12.5, 37.5, 62.5, 87.5]
// 3 milestones = [17, 50, 83]

// Easing: Easing.bezier(0.87, 0, 0.13, 1) — extreme AE
// Travel: 18 frames por segmento
// Labels: flex:1, textAlign:center — SEMPRE garante alinhamento com ball
// Markers: dot 7x7 discreto em cada STOP (apagado antes, invisível depois)
// Ball glow: 3 sombras (14px, 28px, 42px) — efeito profundidade
```

### Círculo com Counter (Garantia)
```tsx
// SVG com 4 círculos sobrepostos:
// 1. Glow espesso (strokeWidth 24, blur 16px, opacity 0.38)
// 2. Glow suave (strokeWidth 14, blur 8px, opacity 0.22)
// 3. Track de fundo (opacity 0.13, sem animação)
// 4. Arco principal (strokeWidth 10, sem filter — nítido)
// O SVG gira (rotation = frame * 1.6 deg/frame)
// Counter interno: 0 → 100 com ci() + Easing.out(cubic)
```

---

## 6. AUDIO SYNC — PROTOCOLO OBRIGATÓRIO

### Regra fundamental
**Não definir timing de cena sem transcrição Whisper do áudio real.**

O fluxo correto é:
```
1. Gravar/gerar narração (ElevenLabs ou similar)
2. Copiar arquivo para /public/audio/[projeto]/full-v2.mp3
3. Transcrever com Whisper word_timestamps=True
4. Salvar JSON em Downloads/[projeto]-transcricao.json
5. Calcular: local_frame = (global_seconds * 30) - scene_start_frame
6. Aplicar timing nos Sequences e nos itemStarts/delays internos
```

### Cálculo de timing
```python
# global_frame_de_palavra = timestamp_em_segundos * 30
# local_frame = global_frame - from_da_sequence

# Exemplo: palavra "funil" em 39.76s, cena começa em global 1000
# local = (39.76 * 30) - 1000 = 192.8 ≈ 193
```

### Regra de chegada da bolinha
```
ball_chega_em = local_frame_da_palavra  (exatamente quando a palavra começa)
ball_parte_em = local_frame_da_palavra - 18  (18 frames de travel antes)
```

### Audio layout aprovado
```tsx
// 1 arquivo de narração único (não dividir em cenas — sincronização mais fácil)
<Audio src={staticFile("audio/[projeto]/full-v2.mp3")} />

// Trilha de fundo opcional (baixo volume)
<Audio src={staticFile("one-life.mp3")} volume={0.12} startFrom={0} />

// Cada cena não tem seu próprio Audio — o áudio toca globalmente
<Sequence from={N} durationInFrames={D}><SceneN /></Sequence>
```

### Overlap de cenas (padrão aprovado)
```
S2 começa ~12f antes de S1 terminar
S3 começa ~10f antes de S2 terminar
... e assim por diante
Isso cria transição fluida, não corte seco
```

---

## 7. O QUE DEU ERRADO (erros desta sessão — não repetir)

### ERRO 1 — Ball não centrava nas palavras
**Problema:** Ball usava `justifyContent: space-between` nas labels, então os extremos ficavam em 0% e 100% — não nos centros das palavras.
**Causa:** Posição 0/25/50/75/100% não corresponde ao centro visual dos textos.
**Solução aplicada:** Labels com `flex: 1; textAlign: center`. Centros ficam em 10/30/50/70/90%.
**Regra:** SEMPRE usar `flex:1` nas labels e STOPS=[10,30,50,70,90] para 5 milestones.

### ERRO 2 — Movimento da bolinha não era profissional
**Problema:** Primeiro tentativa usou `Easing.bezier(0.45, 0, 0.55, 1)` — suavização genérica.
**Causa:** Bezier simétrico não tem o "peso" do AE.
**Solução aplicada:** `Easing.bezier(0.87, 0, 0.13, 1)` — handles de 87% de influência.
**Regra:** Para movimento de bolinha/tracker: SEMPRE usar bezier(0.87, 0, 0.13, 1).

### ERRO 3 — Timing de cenas sem base em transcrição real
**Problema:** Timings foram estimados manualmente sem olhar para os timestamps reais das palavras.
**Causa:** Timing definido antes de transcrever o áudio.
**Solução aplicada:** Whisper com word_timestamps=True, cálculo de local_frame por palavra.
**Regra:** NUNCA definir timing de progress bar sem transcrição real primeiro.

### ERRO 4 — Texto no código diferente da narração
**Problema:** S1 dizia "Você acha que sua mentoria" (faltava "a"). S8 dizia "Quer faturar 50 mil" mas narração dizia "receber essa máquina".
**Causa:** Texto escrito a priori sem conferir contra a transcrição final.
**Regra:** SEMPRE comparar todo texto visível contra a transcrição Whisper antes de renderizar.

### ERRO 5 — Scene 8 timing (masterOp)
**Problema:** masterOp estava em `ci(frame, [230, 268], [1, 0])` — o fade começava em 230 mas com dur=245, frame 268 ficava fora da sequência.
**Causa:** Timing foi copiado da versão anterior sem ajustar para a nova duração.
**Regra:** masterOp da última cena = `ci(frame, [dur - 30, dur - 1], [1, 0])`.

### ERRO 6 — Glow circular com máscara retangular
**Problema:** `drop-shadow` no SVG criava um glow retangular em volta do círculo.
**Causa:** CSS filter `drop-shadow` herda o bounding box do elemento SVG.
**Solução:** 2-3 círculos SVG sobrepostos com `filter: "blur(Npx)"` diretamente no elemento + `overflow: "visible"` no container.
**Regra:** NUNCA usar drop-shadow em SVGs circulares. Usar blur direto no elemento SVG.

---

## 8. O QUE FUNCIONOU (padrões aprovados)

### Por que o estilo foi aprovado

1. **Fundo preto com grain** — dá profundidade orgânica, parece produção cara
2. **Grid 54x54 com 7% opacity** — sem grid fica flat demais; com muito fica poluído
3. **Chroma aberration no impacto** — reforça o momento de "choque" sem exagerar
4. **Palavra colossal (fontSize 188)** — "MENTIRA" na S2 cria corte emocional forte
5. **WordByWord com stagger=7** — revelação lenta e dramática, viewer acompanha
6. **Exit exponencial** — a cena "explode" para fora, não desliza suavemente
7. **Alternância de direções de saída** — LEFT/DOWN/RIGHT/UP evita monotonia
8. **Extreme AE bezier na bolinha** — movimento tem peso e intenção, não é genérico
9. **Progress bar sync com narração** — viewer vê a palavra exatamente quando ouve
10. **Círculo girando** — elemento dinâmico que mantém atenção durante o counter

### Padrão de cores que funcionou
```
Fundo 95% escuro + 5% acento = alto contraste sem agressividade
Acento em texto: opacity cc-ff (forte)
Acento em glow: opacity 44-99 (aura)
Acento em background: opacity 04-12 (muito sutil, quase invisível)
```

### Ritmo de cenas que funcionou
```
S1: 5.7s (frase longa, WordByWord precisa de tempo)
S2: 2.3s (palavra de impacto — curta e brutal)
S3: 10.3s (3 itens com X sequencial — precisa de tempo)
S4: 9.7s (funil com 3 seções reveladas)
S5: 8.3s (countup + contexto)
S6: 12.3s (21 dias + progress bar completo)
S7: 7.2s (círculo preenchendo + counter)
S8: 8.2s (CTA precisa de tempo para a pessoa processar)

Total: ~59.5s (ideal para Reels/Stories de anúncio)
```

---

## 9. TEMPLATE PARA NOVO VÍDEO

Para criar um vídeo novo baseado neste estilo, o processo é:

### Passo 1 — Definir o acento de cor
```tsx
const ACCENT1 = "#XX0000"   // cor principal
const ACCENT2 = "#XX4444"   // variação mais clara para gradientes
```

### Passo 2 — Receber a narração
```
- Arquivo: public/audio/[projeto]/full-v[N].mp3
- Transcrever: python3 whisper_transcribe.py [arquivo]
- Salvar JSON: Downloads/[projeto]-transcricao.json
```

### Passo 3 — Mapear cenas e timestamps
```python
# Para cada cena, anotar:
# - Segmento de narração (start_s, end_s)
# - Palavras-chave que disparam elementos visuais
# - global_frame_start = start_s * 30
# - local_frame_de_palavra = (timestamp_palavra * 30) - global_frame_start
```

### Passo 4 — Calcular Sequences
```
from[N]  = arredondar(end_s[N-1] * 30) - 12  (começa 12f antes do fim anterior)
dur[N]   = arredondar((end_s[N] - start_s[N]) * 30) + 60  (narração + 2s de tail)
total    = from[última] + dur[última]
```

### Passo 5 — Codificar cenas na ordem
```
Usar os mesmos componentes:
- entryFrom() para entrada
- exitTo() para saída
- ci() para toda interpolação
- SPRING_* para elementos que precisam de mola
- WordByWord para texto revelado
- exitScaleOut() para números centrais
```

### Passo 6 — Verificação obrigatória antes do render
```
[ ] Todo texto visível conferido contra transcrição
[ ] isExiting threshold = durationInFrames - 22 (mínimo)
[ ] Última cena usa masterOp (fade opacity), não exitTo
[ ] SAFE_X = 80 em todos os AbsoluteFill principais
[ ] Audio: 1 arquivo único, sem split por cena
[ ] Root.tsx: durationInFrames = soma correta dos Sequences
[ ] FULLSAFE feito antes de qualquer edição
```

---

## 10. VARIAÇÕES APROVADAS DO ESTILO

| Variação | Cor acento | Onde usar |
|---|---|---|
| Rosa (esta) | #FF2D78 / #FF85B3 | Mentorias femininas, iOS premium |
| Verde Neon | #D6FF00 / #EAFF66 | Tech, brutalismo, masculino agressivo |
| Ciano | #00C2FF / #66DDFF | Startup, masculino clean |
| Gold | #C99A3A / #D4B86A | Luxury, premium, high ticket |
| Branco puro | #F2F2F2 / #CCCCCC | Neutro, universal |

Tudo mais permanece igual (fundo, grid, grain, tipografia, easing, estrutura de cenas).

---

## 11. ARQUIVOS DE REFERÊNCIA

```
Composição aprovada:
  squads/zeus-motion/src/compositions/MaquinaNeoanalogiaca2/index.tsx

Versão aprovada (v12):
  squads/zeus-motion/src/compositions/MaquinaNeoanalogiaca2/_versions/index.v14.tsx

Render final:
  Desktop/zeus-motion-render/MaquinaNeoanalogiaca2/v12.mp4

Transcrição de referência:
  Downloads/neoanalogiaca2-transcricao.json

Script Whisper:
  python3 -c "
  import whisper, json
  m = whisper.load_model('base')
  r = m.transcribe('[arquivo].mp3', language='pt', word_timestamps=True)
  with open('transcricao.json', 'w') as f: json.dump(r, f, ensure_ascii=False)
  "
```

---

*Documento criado em 24/05/2026. Atualizar após cada novo vídeo aprovado neste estilo.*
