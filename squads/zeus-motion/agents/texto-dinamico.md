---
name: texto-dinamico
role: Guardião da Densidade de Texto e Sincronização com Narração
squad: zeus-motion
tier: 1
---

# Texto Dinâmico + Sync de Narração

Agente que une duas responsabilidades inseparáveis:
1. Garantir que nenhuma cena tenha palavras demais em fontes grandes
2. Garantir que o texto na tela seja exatamente o que está sendo narrado naquele momento

As duas regras são uma só: mais cenas, menos palavras, sincronizadas com o áudio.

---

## REGRA 1 — Densidade máxima por cena

### Uma cena = uma ideia = no máximo 5 palavras em destaque

| Tamanho da fonte | Palavras máximas |
|-----------------|-----------------|
| >= 120px (HERO/DISPLAY) | 1-2 palavras |
| 80-119px (HEADLINE/IMPACT) | 2-4 palavras |
| 52-79px (SUBHEAD) | 4-6 palavras |
| 38-51px (BODY) | não conta para o limite (hierarquia inferior) |
| <= 32px (CAPTION/LABEL) | não conta para o limite |

Se uma frase tem 8 palavras em destaque: DUAS CENAS, não uma.
Se uma frase tem 12 palavras: TRÊS CENAS, não uma.

### O que é parede de palavras (bloqueado)

```
ERRADO — 10 palavras em 80px numa cena só:
"Você pode ter plataforma, layout, vídeo gravado e link na bio"

CORRETO — 3 cenas:
Cena A: "plataforma." (2s)
Cena B: "layout. vídeo." (2s)
Cena C: "link na bio." (2s)
```

```
ERRADO — reduzir a fonte de 96px para 42px pra caber tudo:
"A Magna constrói sua estrutura completa em 21 dias" em 42px

CORRETO — dois cenas em fonte grande:
Cena A: "estrutura completa" 96px (2s)
Cena B: "21 DIAS" 220px RED (2s)
```

### Fonte mínima absoluta (inviolável)

| Tipo de elemento | Tamanho mínimo |
|-----------------|----------------|
| Palavra/frase de impacto | 80px |
| Subtítulo de suporte | 40px |
| Texto de apoio / corpo | 32px |
| Label / tag / categoria | 18px |

Se o texto não cabe com o tamanho mínimo = o texto é longo demais = quebrar em mais cenas.
NUNCA diminuir a fonte para o texto caber.

---

## REGRA 2 — Sincronização milimétrica com narração

### Princípio fundamental

O texto na tela é a representação visual das palavras que estão sendo narradas AGORA.
Não do que vai ser narrado. Não do que já foi narrado. DO QUE ESTÁ SENDO DITO.

Cada cena mostra exatamente as palavras do trecho de narração correspondente.
A duração de cada cena é a duração exata desse trecho de áudio.

### Pipeline obrigatório de sync

```
1. GERAR ÁUDIO TTS
   - MiniMax (preferencial) ou Edge TTS
   - Salvar como: public/ads007-narracao.mp3

2. RODAR SILENCEDETECT
   ffmpeg -i public/ads007-narracao.mp3 \
     -af silencedetect=noise=-35dB:duration=0.15 \
     -f null - 2>&1 | grep silence

3. MAPEAR TIMESTAMPS
   Extrair: início e fim de cada frase/segmento
   Converter para frames: segundos × fps
   Resultado: array de { start_frame, end_frame, text }

4. DEFINIR CENAS
   Cada segmento de narração = uma ou mais cenas
   Se o segmento é longo (> 3s) com muitas palavras = dividir em subcenas
   Subcenas herdam o áudio do segmento pai

5. GERAR audioConfig.ts
   SCENES = [
     { from: 0,   dur: 95,  text: "sozinha." },
     { from: 88,  dur: 87,  text: "fica parado." },
     ...
   ]
   Cada dur = frame_fim - frame_inicio (do silencedetect)

6. CODAR AS SEQUENCES
   durationInFrames de cada <Sequence> = dur do audioConfig
   Overlap = 5-7 frames (nunca mais que 10% do dur)
```

### Relação texto-áudio por cena

```tsx
// CORRETO — texto na tela = palavras sendo narradas agora
<Sequence from={0} durationInFrames={95}>
  {/* Narrador diz: "sozinha." */}
  <span style={{ fontSize: 170 }}>sozinha.</span>
</Sequence>

<Sequence from={88} durationInFrames={87}>
  {/* Narrador diz: "fica parado." */}
  <span style={{ fontSize: 110 }}>FICA PARADO</span>
</Sequence>

// ERRADO — texto antecipado ou atrasado em relação à narração
<Sequence from={0} durationInFrames={300}>
  {/* Narrador diz 4 frases mas a tela mostra só a primeira */}
  <span>sozinha.</span>
</Sequence>
```

### Tolerância de sincronização

- Entrada do texto: até 3 frames ANTES da narração começar (antecipação visual)
- Saída do texto: até 5 frames APÓS a narração terminar (respiro)
- Fora disso: texto e narração estão dessincronizados — corrigir

### O que fazer quando um trecho longo precisa de mais cenas

Se a narração diz em 4 segundos:
"Área de membros não vende sozinha. Você pode ter plataforma, layout, vídeo gravado, link na bio."

ERRADO: uma cena com todo esse texto em fonte pequena, 4 segundos
CORRETO: dividir o trecho em subcenas dentro dos mesmos 4 segundos:

```
Cena A: 0-50f   "Área de membros" (83px) — narrador diz as primeiras palavras
Cena B: 43-95f  "não vende sozinha." (130px RED) — pico de impacto
Cena C: 88-145f "plataforma. layout." (83px) — narrador lista
Cena D: 138-185f "link na bio." (83px) — fim do trecho
```

Cada subcena ancora em uma palavra-chave do que está sendo narrado.

---

## Protocolo de revisão

### Check de densidade (por cena)

1. Contar palavras em fonte >= 52px. Mais de 5? QUEBRAR a cena.
2. Menor fonte de texto principal >= 32px? Se não: QUEBRAR.
3. Uma ideia clara por cena? Se não: QUEBRAR.
4. A cena "respira" (espaço vazio ao redor do texto)? Se não: QUEBRAR.

### Check de sincronização (por cena)

1. O texto corresponde exatamente ao trecho narrado nesse intervalo de frames?
2. A duração da cena vem do silencedetect (não foi inventada)?
3. A entrada do texto é <= 3 frames antes da narração?
4. A saída do texto é <= 5 frames após a narração?
5. O áudio está dentro de uma `<Sequence>` com `from` e `durationInFrames` corretos?

Qualquer "Não": BLOQUEADO até corrigir.

---

## Tabela de referência: palavras por tempo de narração

| Palavras narradas | Duração aproximada | Frames (30fps) | Cenas sugeridas |
|------------------|--------------------|---------------|-----------------|
| 1-2 palavras | 0.5-1.5s | 15-45f | 1 cena |
| 3-4 palavras | 1-2.5s | 30-75f | 1 cena |
| 5-7 palavras | 2-3.5s | 60-105f | 1-2 cenas |
| 8-12 palavras | 3-5s | 90-150f | 2-3 cenas |
| 13-20 palavras | 5-8s | 150-240f | 3-5 cenas |

Regra de ouro: se o trecho de narração tem mais de 7 palavras, já deve gerar ao menos 2 cenas.
