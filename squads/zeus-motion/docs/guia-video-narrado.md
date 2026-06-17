# Guia Completo: Vídeo Motion com Narração (Estilo AgenteArquiteto)

> Estilo aprovado em: 2026-05-15
> Referência canônica: `src/compositions/AgenteArquiteto/index.tsx` (v13)
> Formato: Vertical 1080×1920, 30fps, Apple Minimalista

---

## AGENTE DE ROTEIRO — OBRIGATÓRIO

Todo roteiro de vídeo motion DEVE ser gerado por este agente Gemini:

```
https://gemini.google.com/gem/e47a6069b6d5
```

Esse agente entrega roteiro no padrão detalhado: cena por cena, texto exato por cena,
direção visual, timing previsto, narração estruturada.

PROIBIDO criar roteiro simples, roteiro "no olho" ou roteiro amador.
O roteiro define o que vai para o código. Se o roteiro for fraco, o vídeo é fraco.

- Cores, estilos e formatos podem variar entre projetos
- Profissionalismo e estrutura de produção são sempre os do AgenteArquiteto v13
- Qualquer vídeo novo começa no agente de roteiro acima, depois vai para o pipeline

---

## VISÃO GERAL DO ESTILO APROVADO

Este é o padrão de comercial premium do squad ZEUS-MOTION.
Vídeo com narrador (voz over), múltiplas cenas, elementos tipográficos e visuais,
fundo escuro Apple Minimalista.

**Características que definem esse estilo:**
- Fundo preto absoluto (#000000) com 3 camadas: cor + radial gradient + noise SVG
- Tipografia exclusiva SF Pro Display (fallback: -apple-system, Helvetica Neue)
- Textos sempre palavra por palavra (stagger 1-4f, nunca linha inteira)
- Saída Quadrupla em todo elemento: posição + blur + opacity + scale
- Áudio NUNCA dentro do Remotion — sempre mixing pós-render via ffmpeg
- Overlaps de 7-12f entre Sequences (nunca frames vazios)

---

## PASSO 1 — PRÉ-PRODUÇÃO (OBRIGATÓRIO, não pular)

### 1.1 Receber os assets de áudio

Antes de escrever uma linha de código:
- [ ] Narrador gravado e entregue como `.mp3`
- [ ] Trilha sonora definida e entregue como `.mp3`
- [ ] Verificar duração exata: `ffprobe -i narrador.mp3 -show_format | grep duration`

### 1.2 Rodar silencedetect NA NARRAÇÃO

```bash
ffmpeg -i "narrador.mp3" \
  -af silencedetect=noise=-35dB:d=0.3 \
  -f null - 2>&1 | grep -E "silence_(start|end)"
```

Extrair todos os pares `silence_end` → `silence_start` (cada par = um segmento de fala).

**Formato esperado do output:**
```
silence_end: 3.41   → speech começa em 0.000
silence_start: 4.15 → speech termina em 4.15
silence_end: 9.04   → próximo speech começa em 4.15
silence_start: 9.90 → speech termina em 9.90
...
```

### 1.3 Mapear segmentos para cenas (OBRIGATÓRIO)

Para cada cena do roteiro, identificar:
- `narr_start`: segundo em que o narrador começa a falar DESSA cena
- `narr_end`: segundo em que o narrador termina de falar DESSA cena

**Tabela de mapeamento (preencher antes de codar):**

| Cena | Conteúdo visual | narr_start (s) | narr_end (s) | narr_start (f) | narr_end (f) |
|------|----------------|---------------|-------------|----------------|--------------|
| C0   | ...            | 0.00          | X.XX        | 0              | X×30         |
| C1   | ...            | X.XX          | X.XX        | X×30           | X×30         |
| ...  | ...            | ...           | ...         | ...            | ...          |

### 1.4 Calcular SCENE_TIMING matematicamente

**Fórmula para cada cena:**
```
from_C[n] = narr_start_C[n] × 30 - overlap_com_anterior
dur_C[n]  = narr_end_C[n] × 30 - from_C[n] + overlap_para_proxima
EXIT_F    = narr_end_C[n] × 30 - from_C[n]   (onde a saída começa)
```

**Regras invioláveis:**
```
EXIT_F + 18 ≤ dur        (animação de saída cabe dentro da Sequence)
EXIT_F + 22 ≤ dur        (margem segura recomendada)
overlap = 7-12f          (BRABO OS: 5-12f mínimo)
from_C[n+1] = from_C[n] + dur_C[n] - overlap
```

**Verificação final:**
```
from_última_cena + dur_última_cena = total_frames
```

---

## PASSO 2 — ESTRUTURA DO ARQUIVO .TSX

### 2.1 Template base obrigatório

```tsx
/**
 * [NomeComposição] - v1 (XX.XXs / NNNN frames @ 30fps)
 * N cenas sincronizadas com narração (XX.XXs)
 * Apple Minimalista | Safe zone Reels: texto NUNCA abaixo y=1200
 *
 * Timing (narração — silencedetect -35dB:d=0.3):
 *  C0 from=0    dur=NNN   | [Descrição]  Xs – Xs | exit@NNf→absNNN=Xs
 *  ...
 *  Total: from_último + dur_último = NNNN
 */
```

### 2.2 Primitivas BRABO obrigatórias

```tsx
// ci — Clamped Interpolate (NUNCA usar interpolate sem clamp)
const ci = (frame, [f0, f1], [v0, v1], ease?) =>
  interpolate(frame, [f0, f1], [v0, v1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// entryFrom — Entrada com blur + direção + easeOut cubic
const entryFrom = (frame, dir, distance = 100, dur = 22): CSSProperties => {...}

// exitTo — Saída Quadrupla (posição + blur + opacity + scale)
const exitTo = (frame, start, dir, distance = 1200, dur = 18): CSSProperties => {...}

// exitToNB — Saída SEM blur (para wrappers de gradient text)
const exitToNB = (frame, start, dir, distance = 1200, dur = 18): CSSProperties => {...}

// mergeStyles — combina entry + exit
const mergeStyles = (entry, exit): CSSProperties => ({
  ...entry, ...exit,
  opacity: (entry.opacity ?? 1) * (exit.opacity ?? 1),
  transform: [entry.transform, exit.transform].filter(Boolean).join(" "),
  filter: [entry.filter, exit.filter].filter(Boolean).join(" "),
})
```

### 2.3 BackgroundBase — 3 camadas obrigatórias

```tsx
const BackgroundBase: React.FC<{ glowColor?: string }> = ({
  glowColor = "rgba(255,255,255,0.04)"
}) => (
  <AbsoluteFill>
    {/* Camada 1: cor sólida */}
    <AbsoluteFill style={{ background: "#000000" }} />
    {/* Camada 2: radial gradient (glow direcional) */}
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse 80% 50% at 50% 28%, ${glowColor} 0%, transparent 70%)`
    }} />
    {/* Camada 3: noise SVG (textura cinematográfica) */}
    <AbsoluteFill style={{ opacity: 0.03 }}>
      <svg width="100%" height="100%">
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
)
```

### 2.4 Estrutura de cada cena

```tsx
const CenaN: React.FC = () => {
  const frame = useCurrentFrame();
  const EXIT_DIR: Direction = "left"; // | "right" | "top" | "bottom"
  const EXIT_FN = NNN;                // calculado no Passo 1.4
  const REVEAL_DELAY = 0;             // calculado se necessário

  // Entradas
  const entry_elemento = entryFrom(frame, "bottom", 80, 22);
  const exit_elemento  = exitTo(frame, EXIT_FN, EXIT_DIR);
  const style_elemento = mergeStyles(entry_elemento, exit_elemento);

  // Texto palavra por palavra
  const words = ["palavra", "por", "palavra"];
  return (
    <AbsoluteFill>
      <BackgroundBase glowColor="rgba(255,255,255,0.04)" />
      {/* conteúdo */}
      {words.map((word, wi) => {
        const f = Math.max(frame - REVEAL_DELAY - wi * 2, 0);
        const notStarted = frame < REVEAL_DELAY + wi * 2;
        if (notStarted) return <span key={wi} style={{ opacity: 0 }}>{word}</span>;
        return (
          <span key={wi} style={mergeStyles(
            entryFrom(f, "bottom", 40, 18),
            exitToNB(frame, EXIT_FN, EXIT_DIR) // NB se for gradient text
          )}>
            {word}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};
```

### 2.5 SCENE_TIMING — single source of truth

```tsx
const SCENE_TIMING: [number, number, React.FC][] = [
  [0,    NNN, SceneChatGPT],  // C0: Xs–Xs | exit@NNf=Xs
  [NNN,  NNN, Scene1],         // C1: ...
  // ...
];

export const NomeComposição: React.FC = () => (
  <AbsoluteFill style={{ background: "#000000" }}>
    {SCENE_TIMING.map(([from, dur, SceneComp], i) => (
      <Sequence key={i} from={from} durationInFrames={dur}>
        <SceneComp />
      </Sequence>
    ))}
  </AbsoluteFill>
);
```

---

## PASSO 3 — DESENVOLVIMENTO

### 3.1 Ordem de codificação por cena

Para cada cena, seguir esta ordem:
1. Definir EXIT_DIR e EXIT_F (já calculados no Passo 1.4)
2. Implementar BackgroundBase com glowColor específico da cena
3. Implementar entradas dos elementos principais
4. Implementar saída (exitTo ou exitToNB dependendo do conteúdo)
5. Implementar textos palavra por palavra
6. Verificar se EXIT_F + 18 ≤ dur (sempre antes de passar para próxima cena)

### 3.2 Direções de saída — lei das direções opostas

A cena atual sai em uma direção; a próxima entra da direção oposta.

| Cena sai para | Próxima cena entra de |
|--------------|----------------------|
| esquerda     | direita               |
| direita      | esquerda              |
| cima         | baixo                 |
| baixo        | cima                  |

Direções consecutivas iguais são PROIBIDAS.

### 3.3 Gradient text — regra de ouro

Se o elemento usa `WebkitBackgroundClip: "text"`:
- Nunca usar `exitTo()` no wrapper → usar `exitToNB()`
- O blur NÃO pode estar no mesmo elemento ou em pai desse elemento
- O blur deve estar em uma div absolutamente posicionada com z-index inferior

```tsx
// PROIBIDO
<div style={{ ...exitTo(frame, EXIT_F, dir) }}>
  <span style={{ WebkitBackgroundClip: "text" }}>TEXTO</span>
</div>

// CORRETO — blur em camada separada
<>
  <div style={{ position: "absolute", zIndex: 0, filter: `blur(${blurV}px)` }}>
    {/* efeitos de fundo */}
  </div>
  <div style={{ position: "absolute", zIndex: 1, ...exitToNB(frame, EXIT_F, dir) }}>
    <span style={{ WebkitBackgroundClip: "text" }}>TEXTO</span>
  </div>
</>
```

---

## PASSO 4 — VALIDAÇÃO PRÉ-RENDER

```bash
# Rodar obrigatoriamente antes de qualquer render
node scripts/pre-render-validate.js AgenteArquiteto
```

O script verifica:
- Todos os EXIT_F satisfazem EXIT_F + 18 ≤ dur
- Nenhum overlap é menor que 5f
- Nenhum gap entre cenas (frame vazio)
- Total de frames igual ao definido em Root.tsx e render.js
- Nenhum EXIT_F no limite absoluto (EXIT_F + 18 = dur, sem margem)

**Não renderizar se o script reportar erros.**

---

## PASSO 5 — RENDER

```bash
# Draft (verificar visual rapidamente, 540px, jpeg 80%)
node scripts/render.js [CompositionName] draft

# Full quality (entrega final, 1080p, jpeg 95%)
node scripts/render.js [CompositionName] full
```

Output em: `~/Desktop/zeus-motion-render/`

---

## PASSO 6 — MIXING DE ÁUDIO (NUNCA PULAR)

### 6.1 Inspecionar o render antes de misturar

```bash
ffprobe -v quiet -show_streams "RENDER.mp4" | grep -E "codec_type|codec_name"
```

Esperado: `video: h264` + `audio: aac` (stream embutido do Remotion).
O stream de áudio embutido DEVE ser excluído do mix.

### 6.2 Comando de mixing aprovado

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

**Parâmetros ajustáveis:**
- `volume=0.20`: volume da trilha (0.15-0.25 para trilha de fundo)
- `afade=t=out:st=42:d=4`: fade out da trilha começando em 42s com 4s de duração
- `-b:a 192k`: bitrate do áudio final

### 6.3 PROIBIDO no mixing

```bash
# PROIBIDO — inclui stream de áudio embutido do Remotion = triplo
-map 0

# PROIBIDO — inclui stream de áudio embutido = duplo
-map 0:a

# PROIBIDO — cria reverb artificial que soa como eco/duplicação
-af aecho=...

# PROIBIDO — mesma razão
-filter_complex "[0:a][1:a]..."  # 0:a = stream embutido do Remotion
```

### 6.4 Verificação do arquivo final

```bash
ffprobe -v quiet -show_streams "OUTPUT-FINAL.mp4" | grep -E "codec_type|codec_name|sample_rate"
# Deve ter: 1 video (h264) + 1 audio (aac, 44100 Hz)

# Verificar que não há áudio duplo (ouvir os primeiros 3 segundos)
ffplay "OUTPUT-FINAL.mp4" -nodisp -autoexit -t 5
```

---

## PASSO 7 — CHECKLIST FINAL

Antes de entregar:

**Visual:**
- [ ] Todas as cenas aparecem e saem na ordem correta
- [ ] Nenhuma cena mostra texto de outra cena (overlap visual indesejado)
- [ ] Gradient texts aparecem como texto (não como retângulo colorido)
- [ ] Palavra por palavra funcionando (stagger visível)
- [ ] Saídas são quadruplas (posição + blur + opacity + scale)
- [ ] Overlaps visualmente suaves (sem corte brusco)
- [ ] Safe zone respeitada (nenhum texto abaixo de y=1200)

**Sync:**
- [ ] Cada cena aparece quando o narrador começa a falar dela
- [ ] Cada cena some quando o narrador termina de falar dela (ou logo depois)
- [ ] Não há cena errada visível durante narração de outra cena
- [ ] Palavras animadas aparecem sincronizadas com a fala

**Áudio:**
- [ ] ffprobe confirma: 1 video stream + 1 audio stream
- [ ] Não há eco, reverb ou duplicação
- [ ] Narrador audível e claro
- [ ] Trilha como fundo sutil (não abafando narrador)
- [ ] Fade out da trilha antes do fim do vídeo

**Arquivo:**
- [ ] FULLSAFE backup criado (version N em `_versions/`)
- [ ] Comentário de versão atualizado no topo do .tsx
- [ ] Root.tsx com durationInFrames correto
- [ ] render.js com duration correto

---

## REFERÊNCIAS

- Primitivas BRABO: `docs/brabo-motion-os-v9.md`
- Post-mortem (todos os erros): `docs/post-mortem-agente-arquiteto.md`
- Script de validação: `scripts/pre-render-validate.js`
- Referência canônica: `src/compositions/AgenteArquiteto/index.tsx` (v13)
- Erros CSS/Remotion: `ERROS-REMOTION.md`
