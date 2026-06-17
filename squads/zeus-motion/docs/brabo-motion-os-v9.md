# BRABO Motion O.S. v9.0 — Regras Canônicas do Squad

> Fonte: `C:/Users/Pichau/Downloads/brabo motion design IA/Skill-motion-brabo.md`
> Versão: 9.0 — 08 de Abril de 2026
> Status: OBRIGATÓRIO para toda composition gerada pelo squad zeus-motion

---

## O QUE É

O BRABO Motion OS é o sistema operacional de direção de motion design que define
COMO animações são construídas neste squad. Não é sugestão. É lei.

Todo agente que gera código Remotion (.tsx) neste squad DEVE seguir os 10 Mandamentos abaixo.

---

## OS 10 MANDAMENTOS

### Mandamento 1 — Análise Antes de Animar

Antes de escrever qualquer animação, responder por cena:
1. O que existe nesta cena? (Texto? Card? Shape? Ícone? Dashboard?)
2. Qual é o elemento PRINCIPAL e o SECUNDÁRIO?
3. Qual animação de entrada representa melhor ESTE elemento?
4. Qual é o texto? Como vou quebrá-lo palavra por palavra?
5. Qual direção de saída prepara melhor a entrada da PRÓXIMA cena?

Repertório de animações por tipo:
| Elemento | Animações Recomendadas |
|----------|----------------------|
| Texto/Título | posição de baixo para cima (palavra a palavra) + blur |
| Card/Container | entrada 3D (perspectiva rotacionada) + slide direcional |
| Shape/Forma | abertura horizontal (scaleX 0→1) ou scale geral |
| Ícone/Badge | scale + bounce (Easing.back) |
| Dashboard | cascata por linha, dados preenchendo progressivamente |
| Background | corte seco ou opacidade simples — NUNCA posição |

### Mandamento 2 — Palavra por Palavra, Nunca Linha por Linha

```
Stagger entre palavras: 1 a 4 frames (NUNCA mais que isso)
Cada palavra entra separadamente, de baixo para cima + blur
Elemento por elemento, não grupo por grupo
```

### Mandamento 3 — O Vocabulário das Curvas

| Fase | Curva | Efeito |
|------|-------|--------|
| ENTRADA | `Easing.out(Easing.cubic)` ou `spring` | Começa rápido, desacelera - sensação de aterrissagem |
| SAÍDA | `Easing.in(Easing.exp)` | Começa lento, acelera ao sair - sensação de arremesso |
| MORPH | `Easing.inOut(Easing.cubic)` | Simétrica - sensação de fluência |
| MICRO | `Math.sin(frame * 0.025)` | Float, pulse, glow contínuos |

### Mandamento 4 — Desfoque de Movimento (Motion Blur)

```
ENTRADA: blur alto (10-14px) → 0   - "Chegou de longe"
SAÍDA:   0 → blur alto (15-25px)   - "Partindo para longe"
ESTÁVEL: sem blur                  - Elemento parado = sem desfoque

Saída explosiva: 0 → 25-30px
```

### Mandamento 5 — Stagger É Lei

```
Nenhum grupo de elementos JAMAIS entra ou sai junto.

Stagger de entrada (palavras):   1-4 frames entre palavras
Stagger de saída:                2 frames entre elementos
Stagger de elementos grandes:    3-6 frames
Ordem de saída = mesma ordem de entrada (escadinha)
```

### Mandamento 6 — Direções Opostas Sempre

```
Saem ESQUERDA → próxima cena entra da DIREITA
Saem DIREITA  → próxima cena entra da ESQUERDA
Saem CIMA     → próxima cena entra de BAIXO
Saem BAIXO    → próxima cena entra de CIMA

Variação padrão:
  C1→C2: Saem ESQUERDA  → Entram da DIREITA
  C2→C3: Saem CIMA      → Entram de BAIXO
  C3→C4: Saem DIREITA   → Entram da ESQUERDA
  C4→C5: Saem BAIXO     → Entram de CIMA
```

### Mandamento 7 — Zero Frames Vazios

```
Overlap OBRIGATÓRIO: 5-12 frames entre Sequences.
FÓRMULA: from[N] = from[N-1] + duration[N-1] - OVERLAP

Quando a saída da cena N terminar, o primeiro elemento da cena N+1
JÁ DEVE estar aparecendo.
```

### Mandamento 8 — Background Entra em Corte Seco

```
NUNCA: background se move com translateX, translateY
SEMPRE: background aparece em corte seco OU opacity simples

Background muda de cena para cena sem animação direcional.
Micro-animações (pulse, breathe) são permitidas.
```

### Mandamento 9 — Saída Quadrupla Universal

```
Toda saída combina OBRIGATORIAMENTE:
  1. posição    - direção de arremesso (translateX ou translateY)
  2. blur       - 0 → 15-25px
  3. opacity    - 1 → 0 (começa em ~40-50% do progresso)
  4. scale      - 1 → 0.93-0.96 (contração sutil)

Fade puro = AMADORISMO. Sempre os 4 juntos.
```

### Mandamento 10 — Layouts Variados Entre Cenas

```
NUNCA repetir a mesma composição de layout em cenas consecutivas.

Exemplo de variação:
  Cena 1: Texto esquerda + elemento visual direita
  Cena 2: Elemento visual centralizado + texto abaixo
  Cena 3: Texto direita + elemento visual esquerda
  Cena 4: Split horizontal (superior/inferior)
  Cena 5: Elemento central único (texto dominante)
```

---

## SISTEMA DE TIMING

### Estrutura de Frames por Cena (local)

```
Fase 1 — ENTRADA (frames 0 a ~22)
  - Todos os elementos começam a aparecer
  - Texto palavra por palavra (stagger 1-4f)
  - Cards com perspectiva 3D ou slide direcional
  - Micro-animações podem começar durante entrada (overlap 5-8f)

Fase 2 — BUILD-UP + LEITURA (frames ~15 a dur-20)
  - Animações internas: countUp, barras crescendo, checks
  - Micro-animações: float, pulse, glow breathing
  - Tempo de leitura: respeitar leitura humana
    2-4 palavras  → 45-60f estáveis
    5-8 palavras  → 60-75f estáveis
    9-12 palavras → 75-105f estáveis

Fase 3 — SAÍDA (últimos 15-20 frames)
  - Saída Quadrupla: posição + blur + opacity + scale
  - Stagger de 2f entre elementos (escadinha)
  - Próxima cena começa 5-12f antes desta terminar
```

### Tabela de Referência de Animações (30fps)

| Tipo | Frames |
|------|--------|
| Entrada rápida | 15-22f |
| Entrada normal | 22-30f |
| Entrada bounce | 20-28f |
| Saída rápida | 12-18f |
| Saída explosiva | 10-12f |
| Overlap entre cenas | 5-12f |
| Stagger texto (por palavra) | 1-4f |
| Stagger elementos grandes | 2-6f |
| Stagger saída | 2f |

---

## PRIMITIVAS DE CÓDIGO (USE SEMPRE ESTAS)

### ci — Clamped Interpolate (NUNCA usar interpolate sem clamp)

```typescript
const ci = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  ease?: (t: number) => number
): number =>
  interpolate(frame, [f0, f1], [v0, v1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
```

### Spring Configs Validados

```typescript
const SPRING = {
  text:   { damping: 14, mass: 0.8 },
  card:   { damping: 13, mass: 0.9 },
  badge:  { damping: 12, mass: 0.7, stiffness: 120 },
  icon:   { damping: 10, mass: 0.8, stiffness: 120 },
  snappy: { damping: 18, mass: 0.6, stiffness: 200 },
  bouncy: { damping: 8,  mass: 0.8, stiffness: 150 },
  heavy:  { damping: 16, mass: 1.2 },
};
```

### exitTo — Saída Quadrupla Padrão

```typescript
const exitTo = (
  frame: number,
  start: number,
  direction: 'left' | 'right' | 'top' | 'bottom',
  distance = 1200,
  dur = 16
): React.CSSProperties => {
  const p   = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.exp));
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  const pos  = ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp));
  const bl   = ci(frame, [start, start + dur], [0, 20]);
  const sc   = ci(frame, [start, start + dur], [1, 0.94]);
  const op   = ci(frame, [start + dur * 0.35, start + dur], [1, 0]);
  return { opacity: op, transform: `translate${axis}(${pos}px) scale(${sc})`, filter: `blur(${bl}px)` };
};
```

### exitToNB — Saída sem Blur (para parent de WebkitBackgroundClip:text)

```typescript
// REGRA ERROS-REMOTION ERRO1: filter: blur() no parent QUEBRA WebkitBackgroundClip:text
// Use exitToNB quando o filho tem background-clip:text (gradient text)
const exitToNB = (
  frame: number, start: number,
  direction: 'left' | 'right' | 'top' | 'bottom',
  distance = 1200, dur = 16
): React.CSSProperties => {
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  const pos  = ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp));
  const sc   = ci(frame, [start, start + dur], [1, 0.94]);
  const op   = ci(frame, [start + dur * 0.35, start + dur], [1, 0]);
  return { opacity: op, transform: `translate${axis}(${pos}px) scale(${sc})` };
};
```

### mergeStyles — Combina entrada + saída

```typescript
const mergeStyles = (
  e: React.CSSProperties,
  x: React.CSSProperties
): React.CSSProperties => ({
  opacity: ((typeof e.opacity === 'number' ? e.opacity : 1) *
            (typeof x.opacity === 'number' ? x.opacity : 1)),
  transform: [e.transform, x.transform].filter(Boolean).join(' ') || undefined,
  filter:    [e.filter,    x.filter   ].filter(Boolean).join(' ') || undefined,
});
```

### BackgroundBase — 3 Camadas (SEMPRE presente)

```typescript
const BackgroundBase: React.FC<{ color?: string; glowColor?: string }> = ({
  color = '#080A0C', glowColor = 'rgba(255,255,255,0.04)',
}) => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', inset: 0, backgroundColor: color }} />
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at 50% 40%, ${glowColor} 0%, transparent 70%)`,
    }} />
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml,...")`, // SVG fractal noise
      opacity: 0.03, mixBlendMode: 'overlay',
    }} />
  </AbsoluteFill>
);
```

### AnimatedText — Palavra por Palavra (Mandamento 2)

```typescript
// Cada palavra: entrada de baixo+blur, saída direcional em escadinha
// Uso: <AnimatedText text="..." delay={0} exitStart={EXIT} exitDir="left" />
```

---

## TIPOGRAFIA VERTICAL (1080x1920) — TV

```typescript
const TV = {
  hero:     { fontSize: 128, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 },
  headline: { fontSize: 96,  fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 },
  subhead:  { fontSize: 64,  fontWeight: 300, letterSpacing: -1, lineHeight: 1.2  },
  body:     { fontSize: 40,  fontWeight: 400, letterSpacing: 0,  lineHeight: 1.4  },
  caption:  { fontSize: 24,  fontWeight: 500, letterSpacing: 2,  lineHeight: 1.4  },
};
```

---

## CHECKLIST PRÉ-ENTREGA (executar internamente antes de entregar código)

- [ ] `ci` em TODOS os interpolate (clamp dos dois lados)?
- [ ] Spring configs usando SPRING definido (nunca spring sem config)?
- [ ] Texto animado PALAVRA POR PALAVRA?
- [ ] Stagger 1-4f entre palavras?
- [ ] Toda saída tem os 4 elementos (posição + blur + opacity + scale)?
- [ ] Direções de saída/entrada são opostas entre cenas?
- [ ] Sequences com overlap (5-12f entre cenas)?
- [ ] Background aparece sem animação direcional?
- [ ] 3 camadas no background (cor + radial + noise)?
- [ ] Layouts diferentes entre cenas consecutivas?
- [ ] Quando filho tem WebkitBackgroundClip:text → usar NB variants (sem blur)?
- [ ] Zero erros TypeScript?

---

## ERROS CONHECIDOS (ERROS-REMOTION.md)

### ERRO 1 — filter: blur() no parent QUEBRA WebkitBackgroundClip:text

**Problema:** Ao aplicar `filter: blur(Xpx)` num elemento pai, qualquer filho
com `WebkitBackgroundClip: 'text'` perde o gradient e exibe cor sólida.

**Solução:**
1. Separar o glow/blur em uma div absolutamente posicionada separada (zIndex: 0)
2. Colocar o conteúdo com gradient text em `position: relative; zIndex: 1`
3. Usar `exitToNB` e `entryFromNB` (sem blur) no wrapper do gradient text

```tsx
{/* ERRADO */}
<div style={{ filter: 'blur(10px)' }}>
  <span style={{ WebkitBackgroundClip: 'text', ... }}>TEXTO</span>
</div>

{/* CORRETO */}
<div style={{ position: 'relative' }}>
  <div style={{ position: 'absolute', inset: -80, filter: 'blur(50px)', zIndex: 0 }} /> {/* glow */}
  <div style={{ position: 'relative', zIndex: 1 }}>
    <span style={{ WebkitBackgroundClip: 'text', ... }}>TEXTO</span>
  </div>
</div>
```
