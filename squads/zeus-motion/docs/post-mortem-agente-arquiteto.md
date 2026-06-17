# Post-Mortem: AgenteArquiteto — 13 Versões para 1 Vídeo Aprovado

> Status: DOCUMENTO PERMANENTE — leitura obrigatória antes de qualquer novo comercial premium
> Aprovado: v13 (AgenteArquiteto-FINAL-v13.mp4)
> Data: 2026-05-15

---

## RESUMO EXECUTIVO

Um comercial de 46 segundos gerou 13 versões de arquivo e 9+ sessões de edição.
O que deveria ter levado 2-3 iterações levou 13.
Este documento cataloga cada erro cometido, por que aconteceu e qual regra o teria evitado.

---

## LINHA DO TEMPO DE VERSÕES

| Versão | Estado | Principal problema |
|--------|--------|-------------------|
| v1-v3 | Reprovadas | Estrutura inicial errada, timing inventado sem análise |
| v4-v5 | Reprovadas | CSS filter:blur() no pai quebrando gradient text |
| v6-v8 | Reprovadas | Blur overdamped, exit blur no conteúdo, sons ruins |
| v9-v10 | Parcialmente reprovadas | Áudio duplicado (triplo na verdade) |
| v11 | Parcialmente aprovada | Sync de algumas cenas ainda errado |
| v12 | Parcialmente aprovada | C2 muito longa, C6 ainda fora de sync |
| v13 | APROVADA | Silencedetect aplicado em todas as cenas |

**13 versões. O ideal seriam 3.**

---

## ERROS EM DETALHES

---

### ERRO A1 — filter:blur() no pai quebra WebkitBackgroundClip:text

**Versões afetadas:** v4, v5, v6, v7, v8

**O que aconteceu:**
Qualquer elemento com `WebkitBackgroundClip: "text"` dentro de um container que
tem `filter: blur()` renderiza como um retângulo sólido colorido, não como texto
com gradiente. Afetou todos os gradient texts do vídeo.

**Por que acontece:**
Chromium (engine do Remotion) cria uma camada de compositing separada para elementos
com `filter`. Dentro dessa camada, `background-clip: text` perde a referência ao
background e preenche o bounding box inteiro.

**A correção aplicada:**
```tsx
// PROIBIDO — blur no pai destrói gradient text nos filhos
<div style={{ filter: "blur(10px)", opacity: entryOp }}>
  <span style={{ WebkitBackgroundClip: "text", background: gradient }}>TEXTO</span>
</div>

// CORRETO — duas camadas separadas
<>
  <AbsoluteFill style={{ filter: "blur(10px)" }}><AuroraBg /></AbsoluteFill>
  <AbsoluteFill style={{ opacity: entryOp }}>  {/* SEM filter aqui */}
    <span style={{ WebkitBackgroundClip: "text", background: gradient }}>TEXTO</span>
  </AbsoluteFill>
</>
```

**Regra criada:** Primitiva `exitToNB()` — exit sem blur para wrappers de gradient text.

**Como teria sido evitado:**
Checklist de compositing antes de codar: "há gradient text? → o pai NUNCA terá filter."

---

### ERRO A2 — Spring overdamped deixou blur visível por tempo demais

**Versões afetadas:** v7, v8

**O que aconteceu:**
Spring com `{ stiffness: 38, damping: 28, mass: 1.2 }` para blur de entrada.
Damping ratio = 2.07 (overdamped). O blur ainda era alto quando os textos já
estavam na tela.

**Cálculo que teria evitado:**
```
damping_ratio = damping / (2 * sqrt(stiffness * mass))
2.07 = overdamped → converge lentamente → ERRADO para blur de entrada

Config correta para blur sumir antes do frame 22:
{ stiffness: 72, damping: 16, mass: 0.8 }
damping_ratio = 16 / (2 * sqrt(72 * 0.8)) = 1.05 ≈ crítico → OK
```

**Como teria sido evitado:**
Calcular damping ratio antes de usar spring para blur. Deve ser < 1.1 para blur de entrada.

---

### ERRO A3 — Áudio triplo no vídeo final

**Versões afetadas:** v9, v10, v11

**O que aconteceu:**
O vídeo final tinha áudio duplicado/triplo com reverb estranho.

**A causa raiz:**
Remotion embute um stream AAC no arquivo .mp4 gerado, mesmo quando nenhum
componente de áudio é adicionado à composition. É um stream silencioso tecnicamente,
mas o ffmpeg o detecta e o inclui no mix por padrão.

O comando ffmpeg incorreto era:
```bash
ffmpeg -i video.mp4 -i narrador.mp3 -i trilha.mp3 \
  -filter_complex "[0:a][1:a][2:a]amix..." \  # ERRADO: inclui stream embutido do Remotion
  ...
```

Resultado: narração × (embedded_silent + narração + trilha) = triplo áudio.

Agravante: o filtro `aecho` que foi adicionado criava reverb que soava como eco/duplicação.

**O comando correto:**
```bash
ffmpeg -y \
  -i video_remotion.mp4 \
  -i narrador.mp3 \
  -i trilha.mp3 \
  -filter_complex "[1:a]volume=1.0[narr];[2:a]volume=0.20,afade=t=out:st=42:d=4[music];[narr][music]amix=inputs=2:duration=longest[out]" \
  -map 0:v \        # APENAS vídeo do Remotion, sem o stream de áudio embutido
  -map "[out]" \    # áudio vem EXCLUSIVAMENTE do filter_complex
  -c:v copy \
  -c:a aac -b:a 192k \
  -shortest \
  "OUTPUT-FINAL.mp4"
```

**Regra criada:** NUNCA usar `-map 0:a` ou `-map 0` em mix de Remotion. Sempre `-map 0:v`.

**Como teria sido evitado:**
Inspecionar o render com `ffprobe -v quiet -show_streams` antes de misturar.
Verificar que o .mp4 do Remotion SEMPRE tem 1 video stream + 1 audio stream embutido.

---

### ERRO B1 — Timing inventado sem análise quantitativa

**Versões afetadas:** v1 até v12

**O que aconteceu:**
O timing de cada cena foi definido "no olho", assistindo ao vídeo e ajustando.
Resultado: 7+ iterações apenas para corrigir sync, quando 1 análise de silencedetect
teria resolvido na primeira vez.

**O que deveria ter sido feito:**
```bash
# Análise silencedetect — roda UMA vez, entrega ms exatos de cada segmento de fala
ffmpeg -i "narrador.mp3" \
  -af silencedetect=noise=-35dB:d=0.3 \
  -f null - 2>&1 | grep -E "silence_(start|end)"
```

Output (exemplo real do AgenteArquiteto):
```
silence_end: 3.41099  | speech 1 → 0.000-3.411s
silence_end: 9.04036  | speech 2 → 4.149-9.040s
silence_end: 10.8896  | speech 3 → 9.898-10.890s
silence_end: 14.9539  | speech 4 → 11.646-14.954s
...
```

Com isso: cada segmento de fala vira um `from` e `dur` calculados em frames (×30).

**Regra criada:** OBRIGATÓRIO rodar silencedetect antes de definir qualquer SCENE_TIMING.
Nunca definir timing por tentativa e erro.

---

### ERRO B2 — Estender cena sem verificar onde a narração dela termina

**Versões afetadas:** v11, v12

**O que aconteceu:**
O usuário pediu que a Cena 2 ("organizar o conhecimento") ficasse mais tempo na tela.
Aumentei dur de 75f para 120f e EXIT_F2 de 45f para 100f.

Resultado: a cena 2 ficava na tela até 13.4s enquanto a narração da cena 3
("no celular") já havia começado em 11.65s. Cena errada + narração errada.

**Por que aconteceu:**
Não consultei o silencedetect antes de estender. A narração da C2 durava apenas
0.99 segundos (9.90s a 10.89s). Estender a cena além de 10.89s = cena visível
enquanto o narrador já fala de outro assunto.

**A equação que define duração máxima de uma cena:**
```
dur_max = (narration_end × 30) - from + overlap_para_proxima_cena + 18
```

No caso de C2:
```
narr_end = 10.89s × 30 = 327f (absoluto)
from = 282
dur_max = (327 - 282) + 7 + 18 = 70f
EXIT_F2 = 45 (onde a narração termina: 282+45=327 = 10.9s)
```

**Regra criada:** Qualquer pedido de "deixar mais tempo na tela" exige consultar
silencedetect primeiro. Duração máxima = (narr_end - from). Nunca ultrapassar.

---

### ERRO B3 — EXIT_F no limite absoluto sem margem

**Versões afetadas:** v10, v11

**O que aconteceu:**
A Scene6 (checkout) tinha dur=195f e EXIT_F6=177. Regra: EXIT_F + 18 ≤ dur.
177+18=195 = EXATAMENTE no limite. Sem margem.

Resultado: a animação de saída terminava no último frame da Sequence. Qualquer
imprecisão de timing fazia a cena não sair antes da próxima cena aparecer.

**Regra criada:**
```
EXIT_F + 18 ≤ dur         (regra absoluta — nunca violar)
EXIT_F + 22 ≤ dur         (margem segura recomendada)
```

---

### ERRO B4 — Não propagar cascata de timing após mudança em uma cena

**Versões afetadas:** v11, v12

**O que aconteceu:**
Quando a Cena 2 foi estendida de 75f para 120f (diferença: +45f), as cenas C3-C8
não tiveram seus `from` atualizados proporcionalmente. Algumas foram atualizadas
parcialmente, outras foram esquecidas.

**A regra de cascata:**
Se uma cena muda de `dur_antigo` para `dur_novo`, TODAS as cenas seguintes
recebem `from += (dur_novo - dur_antigo)`.

```
Mudança: C2 dur 75→120 (+45f)
C3 from: 357 → 402 (+45) ✓ (foi feito)
C4 from: ... → ... (+45) ✗ (foi esquecido)
C5 from: ... → ... (+45) ✗ (foi esquecido)
...
```

**Como teria sido evitado:**
Script de validação que verifica se todos os `from` são sequenciais e consistentes.
O script `pre-render-validate.js` resolve isso automaticamente.

---

### ERRO B5 — REVEAL_DELAY5 errado na Cena 5

**Versões afetadas:** v10, v11

**O que aconteceu:**
A Cena 5 tinha REVEAL_DELAY5=42 (1.4s de delay) para sincronizar as palavras com
a narração. Depois foi trocado para 0. Nenhum dos dois estava certo.

A narração de C5 começa em 20.10s. C5 from=647 = 21.57s. Diferença: -1.47s
(narração começa ANTES da cena aparecer). Com from=600 (20.0s) e REVEAL_DELAY5=3
(palavras em 20.1s = 600+3=603 frames), o sync ficou exato.

**Regra criada:**
```
REVEAL_DELAY = (narr_start_seg - from_absoluto_em_segundos) × 30
```
Calcular matematicamente. Nunca no olho.

---

## PADRÃO QUE FUNCIONOU (v13)

1. Rodar silencedetect na narração → extrair todos os segmentos com timestamps exatos
2. Mapear cada segmento para uma cena
3. Calcular from, dur e EXIT_F matematicamente
4. Verificar overlaps (5-12f entre Sequences)
5. Verificar EXIT_F + 18 ≤ dur para cada cena
6. Codar uma vez
7. Render full quality
8. ffmpeg com `-map 0:v` (nunca `-map 0` ou `-map 0:a`)

---

## CUSTO REAL DOS ERROS

| Tipo de erro | Versões extras geradas | Horas perdidas (estimativa) |
|-------------|----------------------|-----------------------------|
| CSS filter/compositing | 5 versões | 3-4h |
| Spring overdamped | 2 versões | 1h |
| Áudio triplo | 3 versões | 2h |
| Sync por tentativa e erro | 7 versões | 5-6h |
| EXIT_F sem margem | 2 versões | 1h |
| Cascata de timing | 2 versões | 1h |
| **Total** | **10 versões extras** | **13-15h perdidas** |

Uma análise de 15 minutos (silencedetect + cálculo) teria eliminado 10 versões.

---

## COMPOSIÇÃO APROVADA COMO REFERÊNCIA CANÔNICA

`squads/zeus-motion/src/compositions/AgenteArquiteto/index.tsx` (v13)

Características que definem o estilo aprovado:
- Fundo: `#000000` + radial gradient sutil + noise SVG (3 camadas)
- Tipografia: SF Pro Display, textos palavra por palavra
- Paleta: branco puro sobre preto absoluto. Acentos em `rgba(255,255,255,0.7)`
- Entradas: `entryFrom()` com easeOut cubic + blur 12px → 0
- Saídas: `exitTo()` Saída Quadrupla (posição + blur + opacity + scale)
- Overlaps: 7-10f entre cenas
- Áudio: NUNCA em Remotion. Sempre ffmpeg pós-render
- Total: 1387f = 46.23s com narração de 45.79s
