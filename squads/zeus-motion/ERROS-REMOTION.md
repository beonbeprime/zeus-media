# ERROS REMOTION — Registro Definitivo de Bugs e Regras

> Documento criado para que nenhum bug listado aqui se repita.
> Atualizar sempre que um novo erro for identificado ou corrigido.

---

## ERRO CRÍTICO 1 — Retângulo Sólido ao Invés de Texto Gradiente

### O que aconteceu
Um elemento com `WebkitBackgroundClip: "text"` renderizava como um retângulo
colorido sólido em vez de exibir o texto com gradiente.

Afetados:
- INCLUSO em Scene4 (gradient verde→azul)
- Header da PhoneScreen (gradient verde→azul)
- Qualquer `background-clip: text` dentro de SceneWrapper

### Por que acontece
Bug de compositing do Chromium (e Remotion usa Chromium para renderizar).

Quando um elemento pai tem `filter: blur()`, o motor de compositing cria uma
camada de composição separada para esse pai. Dentro dessa camada, o
`background-clip: text` perde a referência ao background do elemento e renderiza
o background inteiro preenchendo o bounding box - resultado: retângulo sólido.

A mesma regra se aplica a `backdrop-filter: blur()` em filhos de elementos
com `filter`.

### Regra Permanente - NUNCA VIOLAR

```
CSS filter: blur() no elemento PAI = PROIBIDO se qualquer filho usa:
  - background-clip: text  (gradient text)
  - backdrop-filter: blur()  (glass morphism)
  - WebkitBackgroundClip: text
  - WebkitBackdropFilter
```

### Como corrigir
Separar em camadas:

```tsx
// ERRADO — filter no pai quebra filhos
<div style={{ filter: "blur(8px)" }}>
  <span style={{ WebkitBackgroundClip: "text", background: gradient }}>TEXTO</span>
</div>

// CORRETO — filter apenas na camada de fundo
<>
  {/* Blur só no fundo (aurora, orbs, texturas) */}
  <div style={{ filter: "blur(8px)" }}>
    <AuroraBg />
    <GlowOrbs />
  </div>
  {/* Conteúdo com texto: opacity + scale, ZERO filter */}
  <div style={{ opacity: entryOpacity, transform: `scale(${scale})` }}>
    <span style={{ WebkitBackgroundClip: "text" }}>TEXTO</span>
  </div>
</>
```

### Solução aplicada (v9)
SceneWrapper reestruturado:
- Camada 0: `<AbsoluteFill style={{ filter: blur }}>` com AuroraBg + GlowOrbs
- Camada 1: `<AbsoluteFill style={{ opacity, transform: scale }}>` com children (SEM filter)

Efeito visual preservado:
- Fundo vai de desfocado para nítido (depth-of-field cinematográfico)
- Conteúdo faz fade-in + scale (surgimento profissional)

### Versões afetadas
- v7: Corrigiu o `filter: drop-shadow` no span, MAS deixou o `filter: blur` no pai
- v8: Aumentou o blur do pai (stiffness=38 overdamped) tornando o bug PIOR
- v9: Correção arquitetural definitiva — blur nunca na camada de conteúdo

---

## ERRO 2 — Efeito de Desfoque (Blur) Overdamped

### O que aconteceu
O SceneWrapper usava uma spring overdamped (stiffness=38, damping=28, mass=1.2)
para o blur de entrada. A spring overdamped converge muito lentamente, então o
blur ainda era alto quando os primeiros elementos importantes apareciam.

### Por que acontece
Damping ratio = damping / (2 * sqrt(stiffness * mass))
= 28 / (2 * sqrt(38 * 1.2))
= 28 / 13.5
= 2.07 → overdamped (ratio > 1 = convergência muito lenta)

### Regra Permanente
Para blur de entrada que deve sumir antes de frame 20-30:
- stiffness >= 65
- damping <= 18
- mass <= 0.85
- Verificar: `damping / (2 * sqrt(stiffness * mass)) < 1.0` (underdamped = rápido)

### Configuração aprovada (v9)
```tsx
spring({ frame, fps, config: { stiffness: 72, damping: 16, mass: 0.8 } })
// damping ratio = 16 / (2 * sqrt(72 * 0.8)) = 16 / 15.2 = 1.05 ≈ crítico
// Converge em ~18-22 frames. Blur zera antes de qualquer texto aparecer.
```

---

## ERRO 3 — Exit Blur no Conteúdo

### O que aconteceu
SceneWrapper v8 adicionou `exitBlur: 0 → 8px` nos últimos 14 frames da cena.
Isso aplicava `filter: blur()` ao conteúdo no final da cena, reintroduzindo
o bug ERRO 1 quando elementos com `background-clip: text` ainda estavam visíveis.

### Regra Permanente
Nunca aplicar `filter: blur()` à camada de conteúdo, nem na saída.
Saídas de cena são gerenciadas pelo cross-fade da TransitionSeries (20 frames).
Não duplicar a transição com blur de saída no conteúdo.

### Solução aplicada (v9)
exitBlur removido do conteúdo. A saída é feita apenas pelo cross-fade do
TransitionSeries (`linearTiming({ durationInFrames: 20 })`).

---

## ERRO 4 — Sons Feios Gerados Programaticamente (Tons Puros)

### O que aconteceu
Sons gerados com Python usando `math.sin()` puro em frequências simples.
Resultado: bipes eletrônicos artificiais, sem envelope ADSR, sem textura.
User disse: "efeito de som muito feio".

### Regra Permanente
Sons programáticos precisam de:
1. ADSR envelope (attack, decay, sustain, release) — nunca onda sem envelope
2. Múltiplas frequências (fundamental + harmônicos) — nunca tom único
3. Ruído com textura (noise burst para transientes, não toms puros)
4. Soft clipping com `math.tanh()` para evitar distorção digital
5. Duração mínima: 300ms para sons de impacto

### Arquivo de geração corrigido
`scripts/gen-sounds.py` — usa additive synthesis + noise + envelopes ADSR

### Sons criados corretamente (v9)
- `impact.wav`: Sub bass 65Hz sweeping + mid punch 220Hz + click transient
- `whoosh.wav`: Noise + sweeping resonances 3200Hz→400Hz
- `stamp.wav`: Deep thud 90Hz + crack 400Hz + reverb tail

---

## ERRO 5 — Timing de Sons em Triggers Técnicos, Não em Momentos Visuais

### O que aconteceu
Sons eram posicionados nos frames de trigger interno dos componentes
(delay do FlipReveal, delay do CheckmarkDraw), não nos momentos onde o
espectador sente o impacto visual.

### Regra Permanente
Sons devem estar nos MOMENTOS DE ENERGIA VISUAL, não em triggers técnicos:
- Quando um número grande/preço aparece
- Quando a palavra de maior impacto é revelada
- Nas transições de cena (cross-fade)
- Quando um elemento de CTA aparece

### Mapeamento correto (v9)
```
Frame 24:  R$800 aparece     → impact.wav (impacto dramático)
Frame 68:  Transição S1→S2   → whoosh.wav
Frame 138: Transição S2→S3   → whoosh.wav
Frame 268: Transição S3→S4   → whoosh.wav
Frame 326: INCLUSO aparece   → impact.wav (máximo momento)
Frame 368: Transição S4→S5   → whoosh.wav
Frame 378: Stamp CTA Scene5  → stamp.wav
```

Removidos:
- `reveal.wav` em cada início de cena (redundante com whoosh + feio)
- `tick.wav` em cada flip do phone (não sincroniza com energia visual)
- Checkmark ticks (topo tecnicamente correto mas inestético)

---

## ERRO 6 — Retângulo Reapareceu Após Correção Parcial

### O que aconteceu
v7 removeu o `filter: drop-shadow` do span INCLUSO (correto), mas deixou
o `filter: blur()` no container pai (SceneWrapper). O bug continuou existindo
porque a causa raiz (pai com filter) não foi resolvida.

v8 tornou o bug PIOR ao aumentar o blur do pai (24px, spring overdamped)
e adicionar exitBlur, expondo o bug mais vezes.

### Lição
Quando um bug de compositing é identificado, a correção deve ser na ARQUITETURA
(separar camadas), não em remover apenas o sintoma mais visível no filho.

---

## ERRO 7 — Áudio Triplo no Vídeo Final

### O que aconteceu
O vídeo final tinha áudio duplicado/triplo com reverb estranho.
Produção: AgenteArquiteto v9-v11.

### Por que acontece
Remotion embute um stream AAC em TODOS os .mp4 gerados, mesmo quando nenhum
componente de áudio é adicionado à composition. É um stream tecnicamente silencioso
mas detectável. Quando o ffmpeg faz `-map 0` ou `-map 0:a`, ele inclui esse stream
embutido junto com a narração e a trilha: resultado = triplo áudio.

Agravante: o filtro `aecho` cria reverb que soa como eco/duplicação mesmo sem o stream duplicado.

### Regra Permanente (NUNCA VIOLAR)

```bash
# PROIBIDO — inclui stream embutido do Remotion = triplo
-map 0
-map 0:a
-filter_complex "[0:a][1:a]..."   # 0:a = stream embutido

# CORRETO — vídeo do Remotion, áudio exclusivamente do filter_complex
-map 0:v
-map "[out]"
```

### Comando de mixing aprovado (v13)
```bash
ffmpeg -y \
  -i "RENDER.mp4" \
  -i "narrador.mp3" \
  -i "trilha.mp3" \
  -filter_complex "[1:a]volume=1.0[narr];[2:a]volume=0.20,afade=t=out:st=42:d=4[music];[narr][music]amix=inputs=2:duration=longest[out]" \
  -map 0:v \
  -map "[out]" \
  -c:v copy \
  -c:a aac -b:a 192k \
  -shortest \
  "OUTPUT-FINAL.mp4"
```

### Como verificar antes de entregar
```bash
ffprobe -v quiet -show_streams "OUTPUT-FINAL.mp4" | grep codec_type
# Deve retornar exatamente: video + audio (apenas 1 stream de áudio)
```

---

## ERRO 8 — Timing Definido Sem silencedetect = 7+ Iterações de Sync

### O que aconteceu
O timing de cada cena foi definido "no olho", assistindo ao vídeo e ajustando.
Isso gerou 7+ iterações de correção de sync que teriam sido eliminadas com
uma análise de 15 minutos.

### Regra Permanente

ANTES de definir qualquer SCENE_TIMING, OBRIGATORIAMENTE rodar:

```bash
ffmpeg -i "narrador.mp3" \
  -af silencedetect=noise=-35dB:d=0.3 \
  -f null - 2>&1 | grep -E "silence_(start|end)"
```

Cada par `silence_end + silence_start` define as bordas de um segmento de fala.
Converter para frames: `segundos × 30 = frames`.

### Como calcular SCENE_TIMING a partir do silencedetect

```
from_C[n]  = (narr_start_C[n] × 30) - overlap_anterior
dur_C[n]   = (narr_end_C[n] × 30) - from_C[n] + overlap_proxima + EXIT_ANIM_DUR
EXIT_F_C[n] = (narr_end_C[n] × 30) - from_C[n]
```

### Verificação obrigatória após calcular
```
EXIT_F + 18 ≤ dur    (animação de saída cabe dentro da Sequence)
overlap = 7-12f      (BRABO: 5-12f obrigatório)
from_última + dur_última = totalFrames
```

---

## ERRO 9 — Estender Cena Sem Verificar Narração = Cena Errada na Tela

### O que aconteceu
Foi pedido que a Cena 2 "ficasse mais tempo na tela". EXIT_F2 foi aumentado de 45
para 100, e dur de 75 para 120. Resultado: a C2 ficava visível até 13.4s enquanto
o narrador já falava sobre C3 (a partir de 11.65s).

### Por que aconteceu
A narração da C2 dura apenas 0.99 segundos (9.90s a 10.89s). Qualquer cena que
permaneça após 10.89s mostra conteúdo visual incompatível com a narração em curso.

### Regra Permanente

"Deixar a cena mais tempo na tela" NÃO significa aumentar dur além do narr_end.
Significa adicionar uma pausa visual ANTES do EXIT_F, não depois.

```
dur_máximo = narr_end × 30 - from
EXIT_F_máximo = narr_end × 30 - from

# A cena PODE ter dur > EXIT_F_máximo apenas se houver pausa na narração
# e o visual faz sentido sem narração (música de fundo, elemento de transição)
```

Se o usuário pede "deixar mais tempo":
1. Verificar silencedetect: até quando o narrador permite?
2. Se a narração não permite, a cena não pode durar mais sem conflito de sync
3. Alternativa: adicionar mais informação visual dentro do tempo já existente

---

## ERRO 10 — Não Propagar Cascata de Timing

### O que aconteceu
Quando C2 foi estendida (+45f), as cenas C3, C4 não receberam o ajuste de `from`.
Resultado: C3 começava no from antigo (392) mas deveria estar em (392+45=437) para
evitar que C2 ficasse na tela simultânea com C3 por 45f a mais do que o esperado.

### Regra Permanente

Toda vez que uma cena tem `dur` alterado:
```
TODAS as cenas após ela: from += (dur_novo - dur_antigo)
```

Verificar com script:
```bash
node scripts/pre-render-validate.js [Composition]
# Se houver gap ou overlap errado entre cenas, o script reporta
```

---

## CHECKLIST OBRIGATÓRIO — Antes de Qualquer Edição no SquadPromo

Verificar antes de editar SceneWrapper ou qualquer cena:

- [ ] Algum filho usa `WebkitBackgroundClip: "text"` ou `backdropFilter`?
      → Se sim, o pai dessas cenas NÃO pode ter `filter: blur()`

- [ ] Adicionei `filter:` em algum container?
      → Verificar se algum filho abaixo usa background-clip ou backdrop-filter

- [ ] Spring de blur converge antes do frame 30?
      → Calcular damping ratio: deve ser próximo a 1 ou menor

- [ ] Sons estão nos momentos de energia visual?
      → R$800 (f24), INCLUSO (f326), transições (f68,138,268,368), stamp (f378)

- [ ] FULLSAFE foi feito (backup em _versions/)?
      → Sempre antes de editar arquivo existente

---

## Referências Técnicas

### Quando `filter` cria camada de compositing (e quebra background-clip:text):
- https://developer.mozilla.org/en-US/docs/Web/CSS/filter
- Chromium issue: parent filter creates stacking context that isolates background-clip

### Configuração de spring para blur rápido:
```tsx
// Converge em ~20 frames (blur zera antes de qualquer texto aparecer)
spring({ frame, fps, config: { stiffness: 72, damping: 16, mass: 0.8 } })
```

### Geração de som com qualidade:
```python
# Sempre usar ADSR + múltiplas frequências + noise + tanh clipping
import math
sample = math.tanh((bass * bass_env + mid + noise_burst) * 1.8) * 0.82
```
