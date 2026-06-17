# Padrão Aprovado ZEUS-MOTION

> Status: DOCUMENTO DEFINITIVO v3 — incorpora lições do MagnaCaptura B&W Premium aprovado
> Atualizado: 2026-05-17
> Leitura obrigatória: TODO agente do squad antes de escrever uma linha de .tsx

---

## POR QUE ESTE DOCUMENTO EXISTE

Dois vídeos foram aprovados no zeus-motion:

1. AgenteArquiteto v13 — comercial premium com narrador, Apple Minimalista
2. MagnaCaptura v5 — vídeo de captação Mentoria Magna, 10 cenas, B&W Premium 45s

Cada um ensinou algo diferente. Ambos definem o padrão mínimo de qualidade.

Não há "razoável" aqui. Ou é profissional ou é refeito.

---

## PARTE 1 — A FILOSOFIA VISUAL

### O que separa amador de profissional em motion design

Vídeo amador: elementos aparecem com fade, texto todo junto, cores repetidas, sem conceito.
Vídeo profissional: cada cena tem identidade visual única, cada elemento tem propósito, o texto respira, o conceito comunica antes da palavra.

O AgenteArquiteto é profissional porque cada cena responde:
- "Por que esse elemento visual aqui?"
- "O que essa animação está comunicando?"
- "Como esse visual reforça o que está sendo dito?"

O MagnaCaptura v5 é profissional porque:
- Paleta é disciplinada (preto + branco + vermelho apenas em negativos)
- Timing é respeitado (45s, 4.7s por cena, texto tem tempo de ser lido)
- Identidade da marca entra na primeira cena e nunca sai

### Regra do Conceito por Cena

Antes de escrever código, cada cena precisa de um CONCEITO.
Não é "tela com texto". É "o problema sendo mostrado visualmente".

Exemplos do AgenteArquiteto:

| Cena | Conceito | Por que funciona |
|------|----------|-----------------|
| C0 - ChatGPT | Interface real de IA imitada | O produto usa IA, mostrar a ferramenta cria credibilidade imediata |
| C1 - Lista numerada | Círculos numerados + linhas placeholder | Promessa de revelação, o que vai aparecer? Cria tensão visual |
| C2 - Formas se organizando | 16 formas no caos, grid ordenado | Metáfora visual de "organizar o conhecimento", o conceito vira imagem |
| C3 - Celular com ondas de áudio | Botão mic + ondas concêntricas | Ouvir + gravar + entender, três ideias em um visual |
| C4 - Microfone com timer dentro | Timer animado na silhueta do mic | Tempo + gravação fused em uma única forma, minimalismo de alto impacto |
| C5 - Palavras reveladas uma a uma | Cada palavra com entryFrom individual | O ritmo do texto imita o ritmo da voz, parece que o vídeo está falando |
| C6 - Card de checkout | Mockup de checkout real, preço em destaque | A transação parece real, cria ancoragem de preço e senso de produto |
| C7 - Ticket/cupom com corte circular | Borda pontilhada + entalhes, físico | O bônus parece um objeto real, não texto plano |
| C8 - Tela final com botão | Logo + headline + botão, dedo animado | Hierarquia perfeita: produto, promessa, ação |

### Anti-padrões: O que o MagnaCaptura v2 errou

Estes erros foram cometidos, corrigidos, e nunca se repetem:

| Erro | O que foi feito | O que deveria ter sido |
|------|----------------|----------------------|
| Cor de acento em excesso | Ouro em label, borda, texto, botão, barra. Tudo dourado. | Hierarquia de cor: acento reservado para 1-2 elementos críticos. Resto é branco/cinza. |
| Paleta imposta | Ouro + teal juntos sem briefing do produto | Paleta vem da identidade do produto/marca. Para a Mentoria Magna: preto + branco + vermelho só em negativos. |
| Sem conceito por cena | Cena 3 (funil): barras horizontais com percentuais | O funil quebrado precisa de um visual que pareça quebrado. Não gráfico de Excel. |
| Texto sem palavra-por-palavra | Labels e captions entram como bloco | Headlines importantes devem entrar palavra por palavra. Stagger de 2-4f. |
| Timing muito curto | 27s para 10 cenas com muito texto | 45s mínimo para 10 cenas de captação. Texto precisa de tempo pra ser lido. |
| Elementos genéricos | Cards com ícones padrão e bordas | Nenhum card aprovado é genérico. Todos têm função no conceito da cena. |
| Sem hierarquia visual | Tudo em 22px ou 26px, tudo em uppercase, tudo igual | TV scale: hero=128px, headline=96px, sub=64px, body=40px, caption=24px. Contraste radical. |
| Sem identidade da marca na abertura | Cena 1 começa com pergunta sem ancoragem de marca | Primeira cena sempre com eyebrow da marca (ex: "MENTORIA MAGNA" em FONT_MONO). |

---

## PARTE 2 — IDENTIDADE VISUAL (por projeto)

### Regra: Cada vídeo tem sua própria identidade

O AgenteArquiteto é Apple Minimalista: preto puro, branco puro, SF Pro Display, sem cores de acento.
O MagnaCaptura é B&W Premium Magna: preto #080808, hierarquia de brancos, vermelho só em negativos.

Isso não é o padrão único do squad. É o padrão de cada produto, de cada marca, de cada tom.

Antes de codar qualquer composition, a identidade visual precisa estar definida:

```
IDENTIDADE VISUAL OBRIGATÓRIA (definir antes de qualquer código):

1. Cor de fundo
2. Cor primária (texto principal)
3. Cor de acento (máx 2 cores)
4. Fonte principal + pesos usados
5. Estilo de movimento (snappy / fluido / cinemático / agressivo / suave)
6. Tipo de arte (minimalista / maximalista / dark / neon / editorial / corporativo)
7. Tom emocional (urgente / inspirador / técnico / luxuoso / direto)
8. Elementos visuais por cena (mockup / metáfora / UI / abstrato / tipográfico)
```

### Filosofias visuais mapeadas

| Filosofia | Fundo | Texto | Acento | Fonte | Quando usar |
|-----------|-------|-------|--------|-------|-------------|
| Apple Minimalista | #000000 | #FFFFFF / #8E8E93 | nenhum | SF Pro Display | Produto tech, IA, SaaS, premium B2B |
| Zeus Dark | #050505 | #F5F5F7 | #0071E3 | SF Pro Display | Conteúdo Zeus/Fábrica |
| Magna B&W Premium | #080808 | #FFFFFF / rgba branco hierarquia | #FF3B30 apenas negativos | Montserrat 900 + Space Mono | Captação Mentoria Magna, lead gen HT |
| Editorial | #FAFAFA | #0D0D0D | cor editorial | Playfair + mono | Conteúdo autoral, livro, ebook |
| Neon Urgente | #0A0A0A | #FFFFFF | #00FF88 ou #FF3B30 | Montserrat 900 | Ads LT, performance, urgência |
| Vintage Premium | #07080D | #F0E8D0 / #C99A3A | #00C2FF + #D81B60 | fonte serifada bold + sans condensed | Mentoria, conceitual, editorial dramático, peça clássica |

### Magna B&W Premium — Design System aprovado

Esta é a paleta do MagnaCaptura v5. Usada em captação HT da Mentoria Magna.

```typescript
// design-system.ts — PALETA OFICIAL APROVADA v3
export const COLORS = {
  bg:          "#080808",
  white:       "#FFFFFF",
  offWhite:    "rgba(255,255,255,0.92)",   // texto principal
  muted:       "rgba(255,255,255,0.50)",   // texto secundário / labels
  subtle:      "rgba(255,255,255,0.14)",   // bordas, divisores
  cardBg:      "rgba(255,255,255,0.04)",   // fundo de cards
  cardBorder:  "rgba(255,255,255,0.10)",   // borda de cards
  red:         "#FF3B30",   // APENAS elementos negativos — discreto
};

// FONTES APROVADAS
export const FONT_DISPLAY = "Montserrat, 'SF Pro Display', -apple-system, sans-serif";
export const FONT_MONO    = "'Space Mono', 'Courier New', monospace";
```

Hierarquia de uso:
- `COLORS.white` (#FFFFFF): headline principal, o elemento mais importante da cena
- `COLORS.offWhite` (0.92): corpo de texto, texto de alto destaque
- `COLORS.muted` (0.50): labels, captions, eyebrows, texto secundário
- `COLORS.subtle` (0.14): bordas, divisores, fundo sutil
- `COLORS.red` (#FF3B30): APENAS em contexto de negativo (erro, falta, problema)

Regra do acento:
- Ouro, teal, azul: NÃO existem nesta paleta para captação Magna
- Um único elemento por cena pode receber `COLORS.white` (máximo destaque)
- O restante da cena usa `offWhite`, `muted`, `subtle`

### Regra do Eyebrow de Marca (scene 1 obrigatório)

Todo vídeo de captação Magna deve ter a marca ancorada na primeira cena:

```tsx
// Sempre no topo, antes de qualquer headline
const eyebrowOp = ci(frame, [0, 16], [0, 1]);

<div style={{
  opacity: eyebrowOp,
  fontFamily: FONT_MONO,
  fontSize: 12,
  fontWeight: 400,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: COLORS.muted,
  textAlign: "center",
  marginBottom: 40,
}}>
  MENTORIA MAGNA
</div>
```

---

## PARTE 3 — TIMING (obrigatório respeitar)

### Padrão 45s para composições de 10 cenas

Validado no MagnaCaptura v5. Matemática confirmada:

```
142 frames/cena × 10 cenas = 1420 frames
− 7f overlap × 9 transições = − 63 frames
= 1357 frames total = 45.23s @ 30fps
```

Isso nunca é negociável para vídeos de captação com muito texto.
27s para 10 cenas é rápido demais. O texto não tem tempo de ser lido.

### SCENE_TIMING padrão para 10 cenas

```typescript
// index.tsx — SCENE_TIMING padrão MagnaCaptura v5
const SCENE_TIMING: [number, number, React.FC][] = [
  [0,    142, Scene1 ],
  [135,  142, Scene2 ],
  [270,  142, Scene3 ],
  [405,  142, Scene4 ],
  [540,  142, Scene5 ],
  [675,  142, Scene6 ],
  [810,  142, Scene7 ],
  [945,  142, Scene8 ],
  [1080, 142, Scene9 ],
  [1215, 142, Scene10],
];
// durationInFrames={1357}
```

### EXIT_F por número de frames da cena

Para cenas de 142f (4.7s):
- EXIT_F conservador: 100-110 (deixa 32-42f para a animação de saída)
- EXIT_F agressivo: 77-90 (cena simples com pouco conteúdo)
- Última cena: EXIT_F = null (sem saída)

Regra absoluta:
- EXIT_F + 18 deve ser menor que `dur`
- EXIT_F + 22 é o ideal (margem confortável)

### Cascata de timing

Sempre que alterar `dur` de uma cena, propagar em todas as seguintes:

```
delta = dur_novo - dur_antigo
from[N+1] += delta
from[N+2] += delta
... (todas as cenas posteriores)
```

Não propagar a cascata é o Erro 10 do BRABO OS. Gera cenas desalinhadas.

---

## PARTE 4 — CONCEITO POR CENA (obrigatório)

### Antes de codar uma cena, responder essas 5 perguntas

```
1. Qual é o conceito desta cena? (Uma frase - não "mostrar X", mas "visualizar X como Y")
2. Qual elemento visual é o herói? (O que o olho vai para primeiro)
3. Como esse visual reforça o que está sendo dito na narração/texto?
4. O layout desta cena é diferente da cena anterior e da próxima?
5. Se eu removesse o texto, o visual ainda comunicaria alguma coisa?
```

Se a resposta para a pergunta 5 for "não", a cena não tem conceito. Repensar.

### Biblioteca de elementos visuais com conceito

Estes elementos foram aprovados em produção real. Use como referência:

**Mockup de Interface (UI Simulada)**
```
Quando usar: produto digital, app, ferramenta, IA
O que cria: credibilidade, senso de produto real, contexto de uso
Como fazer: top bar com controles MacOS + conteúdo específico + fonte mono
Exemplo: ChatGPT interface (C0 AgenteArquiteto)
```

**Formas Geométricas Animadas (Abstrato Conceptual)**
```
Quando usar: conceito de organização, caos, transformação, processo
O que cria: metáfora visual sem precisar de texto explicativo
Como fazer: múltiplos elementos em posições caóticas, morphProg via ci(), posições ordenadas
Exemplo: 16 formas caos-grid (C2 AgenteArquiteto)
```

**Mindmap Radial Animado**
```
Quando usar: mostrar sistema, organização, metodologia completa
O que cria: sensação de método estruturado, não de informação avulsa
Como fazer: SVG viewBox="-300 -300 600 600", ci() para lineProgress de cada ramo, nodeOpacity staggerado
Exemplo: MAGNA mindmap (Scene9 MagnaCaptura)
```

**Relógio SVG Animado**
```
Quando usar: tempo, prazo, velocidade, urgência
O que cria: âncora visual de tempo real
Como fazer: SVG círculo + ponteiros fixos + segundeiro via ci() do ângulo, ponto de glow no extremo
Exemplo: relógio "21 DIAS" (Scene8 MagnaCaptura)
```

**Mockup de Dispositivo com Animação Funcional**
```
Quando usar: escuta, gravação, input, interação
O que cria: sensação de produto físico, ação real
Como fazer: border-radius + fundo escuro + animação circular radiante + ícone funcional
Exemplo: celular com ondas de áudio + botão mic (C3 AgenteArquiteto)
```

**Card de Produto Real**
```
Quando usar: preço, checkout, resumo de pedido
O que cria: ancoragem visual de produto real, não abstrato
Como fazer: glassmorphism sutil + hierarquia de preço radical (96px para o valor) + divisores
Exemplo: checkout card R$8,05 (C6 AgenteArquiteto)
```

**Texto Cinematográfico Palavra a Palavra**
```
Quando usar: frase de impacto, definição central, promessa principal
O que cria: ritmo que imita voz humana, texto que parece estar sendo dito agora
Como fazer: cada palavra com entryFrom individual, stagger 2-4f, última palavra em destaque
Exemplo: "Um agente de inteligência artificial que te ouve..." (C5 AgenteArquiteto)
```

---

## PARTE 5 — TÉCNICA (as regras que nunca quebram)

### TV Scale para 1080x1920

```typescript
const TV = {
  hero:      { fontSize: 128, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 },
  headline:  { fontSize: 96,  fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 },
  subhead:   { fontSize: 64,  fontWeight: 300, letterSpacing: -1, lineHeight: 1.2  },
  body:      { fontSize: 40,  fontWeight: 400, letterSpacing: 0,  lineHeight: 1.4  },
  caption:   { fontSize: 24,  fontWeight: 500, letterSpacing: 2,  lineHeight: 1.4  },
  eyebrow:   { fontSize: 18,  fontWeight: 600, letterSpacing: 6,  textTransform: "uppercase" },
};
```

Regra de contraste mínimo entre níveis:
- hero (128) + eyebrow (18) = contraste de 7x. Legível e impactante.
- headline (96) + body (40) = contraste de 2.4x. Mínimo aceitável.
- Nunca dois textos em tamanhos próximos (ex: 26px e 28px) na mesma cena.

### Safe Zone Vertical

```
1080x1920 - Conteúdo termina em y=1280 SEMPRE.
Os últimos 640px ficam vazios (overlay Instagram/TikTok).

PAD_TOP    = 160px  (onde o conteúdo COMEÇA)
SAFE_BOTTOM = 1280px (onde o conteúdo TERMINA)
SAFE_X     = 90px   (margem lateral)
CONTENT_HEIGHT = 1120px (altura útil)
```

### Primitivas BRABO — Uso correto

```typescript
// ENTRADA: distância mínima 40px, máximo 120px - nunca mais que isso
// Distância grande = entrance dramática (hero). Distância pequena = sutil (caption).
entryFrom(frame, "bottom", 80, 22)   // normal
entryFrom(frame, "bottom", 120, 28)  // dramático (hero ou mockup)
entryFrom(frame, "top", 40, 18)      // sutil (label/eyebrow)

// STAGGER - sempre por elemento, nunca por grupo
const el1 = entryFrom(frame, "bottom", 80, 22);
const el2 = entryFrom(Math.max(0, frame - 10), "bottom", 80, 22);
const el3 = entryFrom(Math.max(0, frame - 20), "bottom", 80, 22);

// PALAVRA POR PALAVRA - para headlines e frases importantes
const words = "Você já tem o conhecimento".split(" ");
{words.map((word, wi) => {
  const wFrame = Math.max(0, frame - wi * 3);
  return <span key={wi} style={entryFrom(wFrame, "bottom", 30, 14)}>{word}&nbsp;</span>;
})}
```

### Hierarquia de Saída entre Cenas

Cada par de cenas tem direção oposta. Nunca a mesma direção duas vezes seguidas.

```
C1 sai LEFT   - C2 entra RIGHT
C2 sai TOP    - C3 entra BOTTOM
C3 sai RIGHT  - C4 entra LEFT
C4 sai BOTTOM - C5 entra TOP
... e assim por diante (rotação das 4 direções)
```

Variação aceita:
- Z-collapse (scale + blur sem translate) = saída no eixo Z, cena seguinte entra em qualquer direção
- Dissolve (opacity) = raramente, apenas para transições suaves intencionais

### Background — 3 Camadas Sempre

```typescript
// Camada 1: cor sólida
<AbsoluteFill style={{ background: BG_COLOR }} />

// Camada 2: glow radial (define o "clima" da cena)
<AbsoluteFill style={{
  background: `radial-gradient(ellipse 80% 50% at 50% 28%, ${GLOW_COLOR} 0%, transparent 70%)`
}} />

// Camada 3: noise (textura que separa o digital do flat)
<AbsoluteFill style={{ opacity: 0.03 }}>
  <svg width="100%" height="100%">
    <filter id="noise-X">
      <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise-X)" />
  </svg>
</AbsoluteFill>
```

O glow muda de cena para cena para criar variação de "clima".
Na paleta Magna B&W Premium, o glow é sempre branco com opacidade muito baixa:

- Cena neutra: `rgba(255,255,255,0.04)` (quase sem glow)
- Cena de destaque: `rgba(255,255,255,0.06)` (glow sutil)
- Cena de CTA/final: `rgba(255,255,255,0.08-0.12)` (glow máximo)
- Cena de problema/negativo: `rgba(255,59,48,0.05)` (toque vermelho discreto)

Glows dourados ou teal não existem na paleta Magna B&W Premium.

---

## PARTE 6 — CHECKLIST DE CONCEITO (antes de codar)

Executar antes de qualquer composition:

- [ ] A identidade visual foi definida? (fundo, fonte, cor de acento)
- [ ] A paleta está correta para o produto? (B&W Premium para Magna captação HT)
- [ ] Cada cena tem um conceito visual único? (não apenas texto numa tela)
- [ ] O elemento herói de cada cena foi identificado?
- [ ] Se remover o texto de cada cena, o visual ainda comunica algo?
- [ ] A hierarquia tipográfica usa pelo menos 3 tamanhos com contraste radical?
- [ ] As cores de acento aparecem em no máximo 2 elementos por cena?
- [ ] Os layouts mudam entre cenas consecutivas?
- [ ] As direções de saída/entrada são opostas entre cenas?
- [ ] Os textos importantes entram palavra por palavra (stagger)?
- [ ] O conteúdo não ultrapassa y=1280?
- [ ] As 3 camadas de background estão definidas (cor + glow + noise)?
- [ ] O timing foi calculado corretamente? (45s mínimo para 10 cenas de captação)
- [ ] A primeira cena tem eyebrow de marca?
- [ ] Nenhuma cor foi inventada sem briefing do produto?

Se qualquer item falhar antes de codar, parar e definir antes de avançar.

---

## PARTE 7 — EXEMPLOS PROIBIDOS

Estes padrões foram produzidos e rejeitados. Nunca repetir.

### PROIB-VISUAL-1 — Uma cor de acento em tudo

```tsx
// PROIBIDO - cor de acento (ouro, teal, ou qualquer outra) em TODOS os elementos
// Resultado: monotonia, sem hierarquia, parece template genérico
<div style={{ color: COLORS.gold }}>label</div>
<div style={{ border: `1px solid ${COLORS.gold}` }}>card</div>
<div style={{ background: COLORS.gold }}>progress</div>
<div style={{ color: COLORS.gold }}>caption</div>
<svg><circle fill={COLORS.gold} /></svg>  // até ícones dourados
```

```tsx
// CORRETO para Magna B&W Premium - branco hierárquico, vermelho só em negativo
<div style={{ color: COLORS.muted }}>label</div>         // cinza
<div style={{ border: "1px solid rgba(255,255,255,0.10)" }}>card</div>  // sutil
<div style={{ background: "rgba(255,255,255,0.85)" }}>progress</div>   // branco forte
<div style={{ color: COLORS.red }}>-23% conversão</div>  // vermelho APENAS em negativo
```

### PROIB-VISUAL-2 — Paleta inventada sem briefing

```
// PROIBIDO - escolher cor de acento no momento de codar
// "Vou usar ouro porque parece premium"
// "Vou usar teal porque combina com preto"
```

```
// CORRETO - paleta definida ANTES de codar, baseada no produto
// Mentoria Magna HT captação = B&W Premium (#080808 + branco + vermelho negativos)
// Produto digital IA = Apple Minimalista (#000000 + branco puro, sem acento)
// Low Ticket urgência = Neon (#0A0A0A + branco + #FF3B30 ou #00FF88)
```

### PROIB-VISUAL-3 — Mockup sem contexto real

```tsx
// PROIBIDO - apenas border-radius e bolas de tráfego não fazem um mockup
<div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.12)" }}>
  <div style={{ height: 38 }}>
    <div style={{ width: 9, borderRadius: "50%", background: "rgba(255,59,48,0.5)" }} />
    {/* Isso é uma decoração, não um mockup */}
  </div>
  <div>conteúdo genérico</div>
</div>
```

Um mockup precisa simular uma interface real com contexto de uso.
Bolas coloridas MacOS + padding = div estilizada, não mockup.

### PROIB-VISUAL-4 — Cenas com mesma estrutura de layout

Funil com barras horizontais, Engrenagem com cards verticais, Membros com mockup, 21 dias com número.
Todas as quatro têm: label no topo + elemento central + caption embaixo.
Variação zero de composição entre cenas = ritmo visual morto.

### PROIB-VISUAL-5 — Texto sem palavra-por-palavra nas headlines

```tsx
// PROIBIDO para headlines e frases de impacto
<div style={{ ...entryFrom(frame, "top", 40, 18) }}>
  ÁREA DE MEMBROS COMPLETA.
</div>

// CORRETO - cada palavra animada individualmente
{"ÁREA DE MEMBROS COMPLETA.".split(" ").map((word, wi) => (
  <span
    key={wi}
    style={{
      ...entryFrom(Math.max(0, frame - wi * 3), "bottom", 40, 18),
      display: "inline-block",
      marginRight: "0.25em",
    }}
  >
    {word}
  </span>
))}
```

### PROIB-VISUAL-6 — Timing muito curto (27s para 10 cenas)

```
// PROIBIDO - 810 frames para 10 cenas com muito texto
// Resultado: texto pisca sem ser lido, sensação de vídeo quebrado
durationInFrames={810}  // ERRADO para captação HT Magna
```

```
// CORRETO - 1357 frames para 10 cenas
// 142f/cena, 7f overlap = 45.23s - cada cena tem 4.7s para o texto ser lido
durationInFrames={1357}  // CORRETO para captação HT Magna
```

### PROIB-VISUAL-7 — Escala tipográfica comprimida

```tsx
// PROIBIDO - todos os textos em tamanhos próximos
<div style={{ fontSize: 26 }}>label topo</div>
<div style={{ fontSize: 28 }}>headline principal</div>
<div style={{ fontSize: 24 }}>caption baixo</div>

// CORRETO - contraste radical
<div style={{ fontSize: 18, letterSpacing: "0.28em" }}>EYEBROW SUTIL</div>
<div style={{ fontSize: 96, fontWeight: 900 }}>HEADLINE</div>
<div style={{ fontSize: 24, opacity: 0.5 }}>Sub discreto</div>
```

---

## PARTE 8 — BOAS PRÁTICAS TÉCNICAS (resumo)

### BP-T1 — Silencedetect antes do SCENE_TIMING

```bash
ffmpeg -i "narrador.mp3" -af silencedetect=noise=-35dB:d=0.3 -f null - 2>&1 | grep silence
```

Nunca definir timing sem dados reais. Cada correção de sync custa uma versão.

### BP-T2 — Calcular EXIT_F matematicamente

```
EXIT_F = narr_end × 30 - from_absoluto
EXIT_F + 18 <= dur (obrigatório)
EXIT_F + 22 <= dur (recomendado)
```

Para cenas sem narrador (texto puro), EXIT_F entre 100-110 para `dur=142`.

### BP-T3 — Cascata automática ao mudar dur

Qualquer alteração de `dur` em qualquer cena:
```
delta = dur_novo - dur_antigo
from[N+1] += delta
from[N+2] += delta
... (todas as cenas posteriores)
```

### BP-T4 — Validação antes do render

```bash
node scripts/pre-render-validate.js NomeComposition
```

### BP-T5 — FULLSAFE antes de editar

```bash
cp src/compositions/Nome/index.tsx src/compositions/Nome/_versions/index.vN.tsx
```

### BP-T6 — ffmpeg com mapeamento correto

```bash
ffmpeg -i video.mp4 -i audio.mp3 \
  -map 0:v -map 1:a \
  -c:v copy -c:a aac \
  output-final.mp4
```

### BP-T7 — gradient text sem blur no pai

```tsx
// NUNCA filter:blur em pai de WebkitBackgroundClip:text
// SEMPRE usar exitToNB() no wrapper de gradient text
```

### BP-T8 — Render com CLI, nunca pedir para o usuário abrir servidor

```bash
# CORRETO - renderizar direto e entregar o arquivo
npx remotion render MagnaCaptura "C:\Users\Pichau\Desktop\MagnaCaptura-v5.mp4" \
  --props='{}' \
  --codec=h264 \
  --jpeg-quality=90

# PROIBIDO - dizer "abra o Studio" ou "rode npm run dev"
# O usuário quer o arquivo, não o servidor
```

---

## PARTE 9 — FLUXO DE PRODUÇÃO CORRETO

```
ETAPA 0: Roteiro via agente Gemini (https://gemini.google.com/gem/e47a6069b6d5)
         - cena por cena, texto exato, direção visual, timing

ETAPA 1: Definir identidade visual completa (paleta, fonte, estilo)
         - Para Magna HT captação: B&W Premium

ETAPA 2: Definir o conceito visual de cada cena (pergunta 5 do checklist)

ETAPA 3: Se tem narrador - silencedetect - tabela cena x narração - EXIT_F matemático
         Para texto puro (10 cenas): 142f/cena, 7f overlap, EXIT_F 100-110

ETAPA 4: Codar composition com primitivas BRABO

ETAPA 5: pre-render-validate.js - 0 erros obrigatório

ETAPA 6: Render draft - revisar visual

ETAPA 7: Ajustes - render final

ETAPA 8: Se tem narrador - ffmpeg mixing com -map 0:v

ETAPA 9: ffprobe - 1 stream de vídeo + 1 de áudio

ETAPA 10: Entrega do arquivo .mp4 direto ao usuário
```

Pular ETAPA 0, 1, 2 = vídeo sem conceito, sem identidade, sem profissionalismo.
O código começa na ETAPA 4. As 3 primeiras etapas são design thinking, não programação.

---

---

## PARTE 10 — REGRA GLOBAL DE MOVIMENTOS, EFEITOS E TRANSIÇÕES

> Esta seção substitui e amplia qualquer regra anterior de movimento.
> Aplica-se a toda animação, cena, transição, lettering, reveal, motion de interface,
> anúncio, vídeo institucional, apresentação ou peça visual criada no Remotion.
> Status: OBRIGATÓRIO — leitura antes de qualquer linha de código de animação.
> Atualizado: 2026-05-18

---

### 10.1 — Princípio central

Toda animação criada pelo Zeus Motion deve ter aparência de motion design premium,
com acabamento semelhante a animações profissionais criadas no After Effects por um
motion designer experiente.

O objetivo não é criar movimento por movimento.

O objetivo é criar movimento com:

- intenção visual
- suavidade e fluidez
- ritmo e profundidade
- hierarquia e elegância
- clareza e acabamento cinematográfico
- sensação profissional extrema

Nenhum movimento deve parecer amador, infantil, comercial barato, robótico,
exagerado ou feito com template genérico.

---

### 10.2 — Regra global de movimento

Todo movimento no Remotion deve ser suave, refinado e intencional.

Toda entrada, saída, deslocamento, zoom, escala, rotação, opacidade, blur, fade,
reveal, transição ou troca visual deve seguir uma lógica profissional.

Todo movimento deve ter:

- aceleração natural e desaceleração elegante
- easing refinado e blur proporcional
- fade suave e ritmo visual
- sensação de peso e estabilidade
- direção clara e acabamento limpo
- transição sem travas

O padrão visual obrigatório é semelhante ao Easy Ease refinado do After Effects,
mas sem exagero, sem efeito elástico barato e sem comportamento caricatural.

---

### 10.3 — Proibições absolutas de movimento

Está proibido usar:

- wiggle exagerado ou tremedeira decorativa
- shake sem propósito
- bounce chamativo ou pop elástico
- efeito de mola visível
- zoom explosivo ou estouro de escala
- entrada pulando ou objeto quicando
- escala indo além do ponto e voltando (0→110%→100%)
- zigue zague ou chacoalhada
- rotação indo e voltando sem função narrativa
- texto tremendo ou card balançando
- efeito infantil de destaque
- animação de figurinha
- motion parecido com template de Canva
- transição espalhafatosa
- movimento chamativo sem sofisticação

Regra crítica: não usar overshoot, bounce, wiggle ou shake como estética padrão.
Se absolutamente necessário, deve ser quase imperceptível e justificado pela narrativa.
Como regra geral: evitar.

---

### 10.4 — Regra contra escala amadora

É proibido o padrão:

```
0% → 110% → 100%   (clássico amador de entrada com bounce)
80% → 105% → 100%  (variante)
90% → 108% → 100%  (variante)
```

Escala profissional é discreta e cinematográfica.

Padrões aceitos:

```typescript
scale: 0.96 → 1.00   // entrada sutil (padrão)
scale: 0.97 → 1.00   // entrada muito sutil
scale: 0.98 → 1.00   // quase imperceptível
scale: 1.00 → 1.02   // respiração sutil (loop)
scale: 1.04 → 1.00   // push de câmera leve
```

A escala deve parecer câmera, profundidade ou foco visual.
Nunca deve parecer efeito de impacto bobo.

---

### 10.5 — Blur profissional obrigatório

Blur é uma das principais assinaturas visuais do Zeus Motion.

Sempre que houver movimento relevante, deve existir blur proporcional ao movimento.

```
elemento parado:     blur 0px
movimento lento:     blur 1px – 4px
movimento médio:     blur 4px – 10px
movimento rápido:    blur 10px – 24px
transição rápida:    blur até 30px (se não sujar a composição)
```

O blur deve gerar suavidade, profundidade, sensação de velocidade, foco visual e
acabamento cinematográfico.

O blur nunca deve deixar o vídeo embaçado, sujo ou difícil de ler.
Blur profissional é controlado. Blur amador é exagerado.

---

### 10.6 — Smooth motion obrigatório

Todo movimento deve ser suavizado. Nada começa ou para de forma seca.

Evitar interpolação linear em movimentos principais.

Preferir:

```typescript
Easing.out(Easing.cubic)         // saída com desaceleração natural
Easing.inOut(Easing.cubic)       // entrada e saída suaves
Easing.out(Easing.quad)          // saída delicada
Easing.inOut(Easing.sin)         // respiração e loops
smoothstep / smootherstep        // para funções customizadas
spring com damping alto          // sem bounce visível
```

Movimento linear só pode ser usado em: partículas lentas, gradientes em movimento,
texturas contínuas, background drift, loops muito lentos.

---

### 10.7 — Fade profissional

Nenhum elemento importante deve simplesmente aparecer seco na tela.

Entradas devem combinar fade com outros recursos:

```typescript
// Padrão premium de entrada
opacity: 0 → 1
blur:    12px → 0px
y:       20px → 0px
scale:   0.98 → 1
// easing suave, sem bounce, sem quique, sem overshoot
```

```typescript
// Padrão premium de saída
opacity: 1 → 0
blur:    0px → 10px
y:       0px → 16px  (ou -16px)
scale:   1 → 0.985
// easing suave, sem sumir seco, sem voltar para trás
```

O fade deve ajudar o olho a acompanhar a cena.

---

### 10.8 — Lettering e animação letra por letra

São aceitas:

- reveal letra por letra com fade suave
- reveal palavra por palavra ou por linha
- tracking animado sutil
- máscara revelando texto
- blur inicial em letras + opacidade progressiva
- pequeno deslocamento vertical + stagger suave
- texto surgindo com profundidade

São proibidas:

- letra pulando, tremendo, quicando ou girando exageradamente
- letra entrando com bounce
- animação tipo karaokê amador
- máquina de escrever seca e robótica

Padrão profissional para letras:

```typescript
// Cada letra começa:
opacity: 0
blur:    6px – 14px
y:       8px – 18px
// Entra com atraso curto e refinado, estabiliza sem quicar
// O texto completo termina limpo e legível
```

O stagger deve ser rápido, elegante e funcional.
A leitura sempre vem antes do efeito.

---

### 10.9 — Animação palavra por palavra

Padrão aceito para títulos e frases de impacto:

```typescript
const words = "Frase de impacto aqui".split(" ");
{words.map((word, wi) => {
  const wf = Math.max(0, frame - wi * 4);
  return (
    <span key={wi} style={{
      ...entryFrom(wf, "bottom", 24, 14),
      display: "inline-block",
      marginRight: "0.22em",
    }}>
      {word}
    </span>
  );
})}
```

Evitar: palavras explodindo, quicando, girando, tremendo, entrando com escala
exagerada ou disputando atenção entre si.

A animação por palavra deve parecer editorial, premium e moderna.

---

### 10.10 — Máscaras e reveals profissionais

Reveals por máscara são altamente recomendados.

Padrões aceitos:

- reveal vertical de baixo para cima (clipPath ou overflow:hidden + translateY)
- reveal horizontal da esquerda para direita
- wipe suave com blur
- máscara com leve delay por linha
- imagem revelando com parallax interno
- card revelando com borda e sombra suave

```typescript
// Exemplo de reveal por máscara
const progress = ci(frame, [0, 20], [0, 1], Easing.out(Easing.cubic));
const clipY = (1 - progress) * 100;

<div style={{ overflow: "hidden" }}>
  <div style={{ transform: `translateY(${clipY}%)` }}>
    {content}
  </div>
</div>
```

Todo reveal precisa ter easing, fade, blur ou profundidade. Evitar reveals secos.

---

### 10.11 — Transições profissionais entre cenas

Preferir:

- fade com blur
- push de câmera (translateX/Y com blur crescente)
- wipe elegante
- luz passando de forma sutil
- parallax entre camadas
- zoom cinematográfico lento
- transição por profundidade (scale + blur)

Evitar:

- flash exagerado
- zoom explosivo
- giro de tela
- shake de tela
- glitch genérico sem conceito
- cortes secos sem acabamento
- transições de pack comercial genérico

Toda transição deve conduzir o olhar para a próxima informação.

---

### 10.12 — Parallax e profundidade

Sempre que possível, criar sensação de profundidade separando em camadas:

```
Layer 0:  background (movimento lentíssimo ou estático)
Layer 1:  textura / noise
Layer 2:  glow / gradientes secundários
Layer 3:  formas decorativas (movimento lento)
Layer 4:  objetos intermediários
Layer 5:  elementos principais (mais estáveis)
Layer 6:  texto / UI
Layer 7:  foreground (pode ter blur, movimento rápido)
```

Parallax profissional deve ser discreto. O objetivo é dar profundidade, não distrair.

---

### 10.13 — Movimento de câmera

Pensar como câmera, não apenas como objeto.

```typescript
// Push in lento
const push = ci(frame, [0, dur], [1.00, 1.04], Easing.inOut(Easing.sin));
style={{ transform: `scale(${push})` }}

// Pan lateral suave
const panX = ci(frame, [0, dur], [0, 8], Easing.inOut(Easing.cubic));
style={{ transform: `translateX(${panX}px)` }}

// Orbit sutil (MagnaCaptura Scene1 padrão)
const orbitY = ci(frame, [0, 90], [-4, 4], Easing.inOut(Easing.sin));
style={{ transform: `rotateY(${orbitY}deg)` }}
```

Proibido: zoom seco, zoom agressivo, câmera tremendo com impacto artificial,
movimento acelerado demais, câmera com sensação de template.

---

### 10.14 — Microinterações profissionais

Aceitos (quase imperceptíveis):

- brilho sutil em bordas
- sombra respirando
- gradiente se movendo lentamente
- luz passando discreta
- linhas desenhando suavemente
- partículas em baixa opacidade
- pulso de luz discreto
- scan line tecnológico sutil
- borda com glow discreto

Proibidos:

- pulso exagerado, botão quicando, card tremendo
- ícone balançando
- brilho piscando forte
- partículas demais
- efeito poluído
- movimento sem propósito

Microinteração profissional é percebida, mas não grita.

---

### 10.15 — Ritmo visual obrigatório

Nada deve acontecer tudo ao mesmo tempo.

Sequência recomendada por cena:

```
1. fundo ganha vida de forma sutil (frames 0-8)
2. entra a camada principal / elemento herói (frames 6-18)
3. entra o título ou elemento focal (frames 14-26)
4. entram textos de apoio (stagger entre elementos, 3-5f)
5. entram detalhes secundários
6. a cena respira (pausa intencional de leitura)
7. saída suave conduz para a próxima cena
```

Usar delays curtos entre elementos. O ritmo deve conduzir o olhar.
Não criar excesso de movimento competindo pela atenção.

---

### 10.16 — Hierarquia visual do movimento

O elemento mais importante da cena:

- entra primeiro ou com mais presença
- tem movimento mais nobre
- recebe foco visual
- fica mais estável
- tem melhor legibilidade

Elementos secundários:

- entram depois
- têm movimentos menores
- não disputam atenção
- ajudam a compor profundidade

Detalhes decorativos:

- ficam em baixa opacidade
- se movem lentamente
- não competem com o texto
- não prejudicam leitura

A animação deve organizar a atenção da pessoa, não dispersá-la.

---

### 10.17 — Regra de pausa

Motion profissional não é movimento constante.

Toda cena precisa respirar.

Usar pausas curtas para: leitura, impacto, compreensão, autoridade, sofisticação.

```typescript
// Exemplo de beat de pausa intencional
const beatProgress = ci(frame, [EXIT_F - 20, EXIT_F], [0, 1]);
// Nada acontece de EXIT_F - 20 até EXIT_F (pausa = leitura)
// Depois inicia a saída
```

Evitar preencher todo segundo com efeito. Pausa também é parte do motion.

---

### 10.18 — Padrão técnico de entrada premium

```typescript
// Entrada premium padrão
const entry = {
  opacity: ci(frame, [0, 18], [0, 1], Easing.out(Easing.cubic)),
  filter: `blur(${ci(frame, [0, 16], [12, 0], Easing.out(Easing.cubic))}px)`,
  transform: `translateY(${ci(frame, [0, 20], [20, 0], Easing.out(Easing.cubic))}px) scale(${ci(frame, [0, 20], [0.98, 1], Easing.out(Easing.cubic))})`,
};
// Começa: opacity 0, blur 12px, y +20px, scale 0.98
// Termina: opacity 1, blur 0px, y 0px,  scale 1.00
// Sem bounce, sem wiggle, sem overshoot
```

---

### 10.19 — Padrão técnico de saída premium (Saída Quadrupla)

```typescript
// Saída Quadrupla — posição + blur + opacity + scale SEMPRE juntos
const exit = exitTo(frame, EXIT_F, "left", 1100, 18);
// ou manualmente:
const exitProgress = ci(frame, [EXIT_F, EXIT_F + 18], [0, 1], Easing.in(Easing.cubic));
const exitStyle = {
  opacity:   1 - exitProgress,
  filter:    `blur(${exitProgress * 10}px)`,
  transform: `translateX(${exitProgress * -120}px) scale(${1 - exitProgress * 0.015})`,
};
// Sem desaparecer seco, sem voltar para trás, sem quicar
```

---

### 10.20 — Funções auxiliares obrigatórias (helpers)

Sempre criar ou reutilizar helpers para manter consistência e evitar animações amadoras.

Helpers que devem existir ou ser reutilizados:

```typescript
// Nos módulos reutilizáveis do squad
smoothFadeIn(frame, startFrame, duration)
smoothFadeOut(frame, startFrame, duration)
blurIn(frame, startFrame, duration, maxBlur)
blurOut(frame, startFrame, duration, maxBlur)
cinematicMove(frame, startFrame, duration, distance, direction)
subtleScale(frame, startFrame, duration, from, to)
cameraPush(frame, dur, from, to)
wordStagger(frame, words, staggerFrames)
letterStagger(frame, text, staggerFrames)
maskReveal(frame, startFrame, duration)
premiumEntry(frame, startFrame, yOffset, blurAmount)
```

Esses helpers devem impedir bounce exagerado, overshoot, wiggle, shake e pop por padrão.

---

### 10.21 — Revisão obrigatória antes de finalizar

Antes de considerar qualquer animação finalizada, verificar:

- [ ] Existe algum movimento brusco?
- [ ] Existe algum bounce desnecessário?
- [ ] Existe wiggle ou tremedeira?
- [ ] Existe escala passando do ponto (110%)?
- [ ] Existe efeito infantil?
- [ ] Existe elemento aparecendo seco na tela?
- [ ] Existe transição sem blur ou fade?
- [ ] Existe excesso de movimento simultâneo?
- [ ] Existe falta de hierarquia no movimento?
- [ ] O texto está legível durante toda a animação?
- [ ] O movimento conduz o olhar para o elemento certo?
- [ ] O resultado parece premium e profissional?
- [ ] O resultado parece After Effects de motion designer experiente?
- [ ] O resultado parece Remotion bem feito, não CSS amador?

Se qualquer resposta indicar aparência amadora: corrigir antes de finalizar.

---

### 10.22 — Regra final absoluta

O Zeus Motion deve seguir esta lógica em todas as animações:

```
Movimento profissional = suave, preciso, intencional, maduro, elegante, cinematográfico.
Movimento amador      = exagerado, trêmulo, elástico, saltado, barulhento, infantil.
```

Todo motion criado no Remotion DEVE ter:

```
smooth    blur      fade      easing
ritmo     profundidade   hierarquia    intenção
estabilidade   acabamento premium
```

E NUNCA deve ter:

```
wiggle        bounce exagerado     overshoot amador
escala 0→110→100   tremedeira         pop barato
shake decorativo   efeito comercial bobo
```

A regra absoluta:

> Se o movimento parecer bonito por ser exagerado, provavelmente está errado.
> Se o movimento parecer caro por ser sutil, fluido e intencional, provavelmente está certo.

---

## PARTE 11 — TOKENS GLOBAIS DE MOVIMENTO

> Todo `.tsx` deve importar esses tokens em vez de usar números mágicos soltos.
> Arquivo canônico: `src/motion-tokens.ts`

```typescript
// src/motion-tokens.ts
export const MOTION = {
  durations: {
    fast:   12,   // entrada rápida (label, eyebrow)
    medium: 24,   // entrada normal (texto, card)
    slow:   40,   // entrada dramática (hero, mockup)
    scene:  60,   // camera push, parallax de cena
  },

  distance: {
    tiny:   8,    // deslocamento quase imperceptível
    small:  16,   // deslocamento padrão
    medium: 28,   // deslocamento médio (hero entrada)
    large:  48,   // deslocamento dramático (abertura)
  },

  scale: {
    subtleIn:  0.97,   // entrada sutil — padrão obrigatório
    normalIn:  0.98,   // entrada discreta
    subtleOut: 0.985,  // saída sutil
    cameraIn:  1.04,   // câmera push lento (mínimo 60f)
  },

  blur: {
    none:    0,
    soft:    6,    // texto pequeno, detalhe
    medium:  12,   // entrada padrão
    strong:  20,   // transição rápida, saída
    max:     30,   // transição de cena apenas
  },

  stagger: {
    letter: 1.5,   // delay por letra
    word:   3,     // delay por palavra
    line:   5,     // delay por linha
    card:   4,     // delay por card
  },

  easing: {
    enter:    "Easing.out(Easing.cubic)",    // toda entrada
    exit:     "Easing.in(Easing.cubic)",     // toda saída
    morph:    "Easing.inOut(Easing.cubic)",  // troca, loop
    breath:   "Easing.inOut(Easing.sin)",    // respiração, fundo
  },
};
```

Regra de uso:

- Todo `interpolate` com duração usa `MOTION.durations.*`
- Todo deslocamento usa `MOTION.distance.*`
- Toda escala de entrada usa `MOTION.scale.subtleIn` ou `normalIn`
- Todo blur usa `MOTION.blur.*`
- Todo stagger usa `MOTION.stagger.*`

Proibido usar valores numéricos soltos para esses parâmetros fora de contexto específico.

---

## PARTE 12 — PADRÃO ANTI CARA DE IA

### Sinais que identificam vídeo com cara de IA (bloquear todos)

| Sinal | Por que parece IA | Correção |
|-------|-------------------|----------|
| Tudo se mexe ao mesmo tempo | Sem direção de arte, sem stagger | Hierarquia de entrada, delays por elemento |
| Excesso de elementos animados | Prompt pediu "animado e chamativo" | Mínimo necessário, movimento com propósito |
| Textos grandes sem hierarquia | Sem escala tipográfica pensada | TV Scale obrigatório (hero → eyebrow) |
| Frases sem ritmo de leitura | Sem consideração de tempo de leitura | Mínimo 2.5s por frase no screen |
| Transições exageradas | Pack de efeitos, não direção | Fade+blur simples, push de câmera |
| Cores inconsistentes entre cenas | Paleta não definida antes de codar | Paleta fixada antes de qualquer código |
| Legendas fora de timing | Sincronização automática sem revisão | Caption Sync obrigatório |
| Visual bonito mas sem narrativa | Gerado por estética, não por estratégia | Narrative Flow checado por agente |
| Cards com visual de dashboard fake | Template de UI sem contexto real | Mockup com conteúdo específico e real |
| Fontes desalinhadas com conceito | Fonte padrão sem briefing | Fonte definida pelo briefing do produto |

### Checklist anti IA (rodar antes de finalizar qualquer cena)

- [ ] Existe intenção no movimento de cada elemento?
- [ ] Existe hierarquia clara — o que entra primeiro, o que entra depois?
- [ ] Existe respiro — algum beat de pausa antes da saída?
- [ ] O texto está legível durante TODA a animação?
- [ ] As legendas estão sincronizadas com a fala?
- [ ] Os elementos estão alinhados visualmente?
- [ ] A paleta está consistente com a cena anterior?
- [ ] A tipografia combina com o conceito do produto?
- [ ] O movimento parece caro (sutil, fluido, intencional)?
- [ ] Algum efeito chama mais atenção do que a mensagem?
- [ ] Algum elemento parece de template genérico?
- [ ] A cena parece feita por um designer, não por um prompt?

Se parecer apenas "animação bonita sem direção", refazer.

---

## PARTE 13 — LEGENDAS PROFISSIONAIS

### Princípio

Legenda é design. Não é texto jogado na tela.

Legenda profissional deve ter: timing preciso, leitura confortável, quebra inteligente,
destaque seletivo, entrada suave, saída suave, alinhamento consistente e contraste alto.

### Padrões aceitos

- Palavra por palavra com highlight discreto
- Frase por frase com fade curto entre frases
- Linha por linha com reveal suave
- Destaque em palavra-chave (opacity ou escala sutil)
- Sombra ou caixa discreta atrás do texto
- Blur de fundo leve quando fundo é complexo

### Padrões proibidos

- Legenda pulando, tremendo ou com bounce
- Legenda gigante ou muito pequena
- Legenda colada na borda (respeitar safe zone)
- Legenda mudando de posição sem motivo
- Legenda com muitas cores (máximo 2: cor principal + destaque)
- Legenda sem sincronia com a fala
- Legenda aparecendo seca (sem fade)
- Legenda sumindo seca (sem fade out)

### Exemplo correto — palavra por palavra

```tsx
// Legenda editorial premium
const words = ["Crie", "sua", "mentoria", "com", "clareza"];

return (
  <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  }}>
    {words.map((word, index) => {
      const wordStart = captionStart + index * MOTION.stagger.word;
      const p = interpolate(
        frame,
        [wordStart, wordStart + MOTION.durations.fast],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic) }
      );
      return (
        <span key={`${word}-${index}`} style={{
          display: "inline-block",
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [8, 0])}px)`,
          filter: `blur(${interpolate(p, [0, 1], [MOTION.blur.soft, 0])}px)`,
        }}>
          {word}
        </span>
      );
    })}
  </div>
);
```

Por que está correto: cada palavra entra com micro atraso, fade, blur e deslocamento
pequeno — sem bounce, sem tremedeira, leitura confortável, parece editorial premium.

### Exemplo errado — proibido

```tsx
// PROIBIDO — palavra estourando na tela
const scale = interpolate(
  frame, [start, start + 4, start + 8], [0, 1.2, 1]
);
return <span style={{ transform: `scale(${scale})` }}>{word}</span>;
// Por que está errado: estoura, retorna, parece TikTok barato,
// prejudica leitura, remove autoridade da marca
```

---

## PARTE 14 — EXEMPLOS REMOTION CORRETO vs ERRADO

### Entrada premium (correto)

```tsx
const progress = interpolate(
  frame,
  [start, start + MOTION.durations.medium],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  }
);

return (
  <div style={{
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [MOTION.distance.small, 0])}px) `
             + `scale(${interpolate(progress, [0, 1], [MOTION.scale.subtleIn, 1])})`,
    filter: `blur(${interpolate(progress, [0, 1], [MOTION.blur.medium, 0])}px)`,
  }}>
    Texto premium
  </div>
);
// Correto: fade + blur + y curto + escala discreta + easing suave
// Não passa do ponto, não quica, não treme, termina limpo
```

### Entrada amadora (proibido)

```tsx
// PROIBIDO — bounce de escala
const scale = interpolate(
  frame, [start, start + 10, start + 18], [0, 1.1, 1]
);
return <div style={{ transform: `scale(${scale})` }}>Texto</div>;
// Por que está errado: começa do zero, explode, retorna —
// parece botão de app barato, sem blur, sem profundidade
```

### Saída premium (correto)

```tsx
const exitP = interpolate(
  frame,
  [EXIT_F, EXIT_F + MOTION.durations.medium],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  }
);

return (
  <div style={{
    opacity: interpolate(exitP, [0, 1], [1, 0]),
    transform: `translateY(${interpolate(exitP, [0, 1], [0, -MOTION.distance.small])}px) `
             + `scale(${interpolate(exitP, [0, 1], [1, MOTION.scale.subtleOut])})`,
    filter: `blur(${interpolate(exitP, [0, 1], [0, MOTION.blur.medium])}px)`,
  }}>
    Elemento
  </div>
);
// Correto: sai com direção, some com fade e blur, sem sumir seco
```

### Saída amadora (proibido)

```tsx
// PROIBIDO — elemento sumindo seco
if (frame > EXIT_F) return null;
// Cria corte visual, parece bug, parece vídeo feito por IA
// Só usar return null depois que a animação de saída terminou
```

### Letra por letra (correto)

```tsx
const text = "MAGNA";
return (
  <h1 style={{ display: "flex" }}>
    {text.split("").map((letter, i) => {
      const ls = start + i * MOTION.stagger.letter;
      const p = interpolate(
        frame, [ls, ls + MOTION.durations.fast], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad) }
      );
      return (
        <span key={`${letter}-${i}`} style={{
          display: "inline-block",
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
          filter: `blur(${interpolate(p, [0, 1], [MOTION.blur.soft, 0])}px)`,
        }}>
          {letter}
        </span>
      );
    })}
  </h1>
);
// Correto: delay 1.5f por letra, fade + blur + y — sem bounce, sem giro
```

### Transição de cena (correto)

```tsx
const trans = interpolate(
  frame, [sceneEnd - 20, sceneEnd], [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic) }
);
return (
  <div style={{
    opacity: interpolate(trans, [0, 1], [1, 0]),
    transform: `scale(${interpolate(trans, [0, 1], [1, 1.025])})`,
    filter: `blur(${interpolate(trans, [0, 1], [0, 16])}px)`,
  }}>
    Cena atual
  </div>
);
// Correto: sai com fade + blur + zoom lento — parece push de câmera
```

---

## PARTE 15 — SISTEMA DE AGENTES INTERNOS DE REVISÃO

> Nenhum vídeo pode ser considerado finalizado sem passar por todos os agentes abaixo.
> Cada agente revisa uma camada específica. Bloqueio = vídeo volta para correção.

### Agente 1: Motion Director

Função: garantir que todos os movimentos estejam profissionais, suaves e intencionais.

Revisa: easing, blur, fade, timing, entrada, saída, transição, câmera, ritmo, excesso.

Bloqueia: wiggle, bounce, shake, overshoot, escala amadora, movimento seco, elemento
aparecendo do nada, animação com cara de IA, qualquer movimento sem função narrativa.

### Agente 2: Visual Consistency

Função: garantir consistência visual entre todas as cenas.

Revisa: paleta, tipografia, espaçamento, alinhamento, grid, contraste, tamanho dos textos,
estilo dos cards, sombras, glow, bordas, hierarquia visual.

Bloqueia: cena parecendo de outro vídeo, cores inconsistentes, fonte fora do padrão,
texto desalinhado, elementos tortos, excesso de estilos, glow sem padrão.

### Agente 3: Caption Sync

Função: garantir que legendas, textos e falas estejam sincronizados.

Revisa: timing da legenda, início e fim de frase, tempo de leitura, quebra de linha,
destaque de palavras, posicionamento, tamanho, contraste.

Bloqueia: legenda atrasada/adiantada, frase longa demais, quebra ruim, texto mudando
rápido demais, palavra destacada errada, legenda pulando, legenda ilegível.

### Agente 4: Copy Clarity

Função: revisar clareza da copy dentro do vídeo.

Revisa: frase curta, frase forte, clareza da promessa, ausência de enrolação,
progressão lógica, impacto da mensagem, excesso de texto por cena.

Bloqueia: copy confusa, frase genérica, frase longa demais, texto sem objetivo,
promessa fraca, mensagem que não conduz a ação, texto com cara de IA.

### Agente 5: Narrative Flow

Função: garantir que o vídeo tenha narrativa e progressão.

Revisa: começo claro, contexto, tensão, desenvolvimento, virada, prova/demonstração,
conclusão, chamada final, conexão entre cenas.

Bloqueia: cenas soltas, sequência sem lógica, vídeo bonito mas vazio, mudança brusca
de assunto, promessa sem desenvolvimento, conclusão fraca.

### Agente 6: Concept Guardian

Função: garantir que o conceito visual esteja alinhado com a intenção estratégica.

Revisa: visual combinando com a marca, estilo com o público, tom premium, clareza
do conceito, coerência entre motion + copy + estética.

Bloqueia: visual bonito sem conceito, estética genérica, elementos decorativos sem
função, ícones aleatórios, cenas que parecem banco de template.

### Agente 7: Technical Remotion

Função: garantir qualidade técnica no código Remotion.

Revisa: componentes organizados, helpers reutilizáveis, uso correto de `interpolate` /
`spring` / `Easing` / `Sequence`, `extrapolate: "clamp"` em todo interpolate,
ausência de valores mágicos, tokens globais aplicados.

Bloqueia: código bagunçado, animação sem clamp, timing solto, muito CSS inline
sem padrão, spring mal configurado, componente gigante, inconsistência de helpers.

### Agente 8: Anti AI Look

Função: detectar aparência de vídeo gerado por IA ou por prompt fraco.

Revisa: excesso de movimento, efeitos sem motivo, composição genérica, texto artificial,
ritmo estranho, cenas com cara de template, inconsistência visual, falta de direção de arte.

Bloqueia: vídeo com cara de IA, motion barulhento, estética automática, design sem alma,
composição bonita mas falsa, sequência visual sem decisão humana.

### Agente 9: Error Hunter

Função: encontrar erros grosseiros antes da entrega.

Revisa: texto cortado, texto fora da tela, legenda cortada, elemento sobreposto,
ícone desalinhado, cor errada, erro de português, frame quebrado, timing quebrado,
tela piscando, buraco visual, transição com salto.

Bloqueia: qualquer erro visível, qualquer desalinhamento grosseiro, qualquer falha
que uma pessoa perceberia na primeira visualização.

### Agente 10: Final Approval

Função: dar aprovação final somente se todos os outros agentes aprovarem.

Critérios obrigatórios (todos precisam passar):

- Motion está fluido (Motion Director aprovado)
- Copy está clara (Copy Clarity aprovado)
- Narrativa está coerente (Narrative Flow aprovado)
- Legenda está sincronizada (Caption Sync aprovado)
- Visual está alinhado (Visual Consistency aprovado)
- Conceito está forte (Concept Guardian aprovado)
- Código está limpo (Technical Remotion aprovado)
- Não há aparência de IA (Anti AI Look aprovado)
- Não há erro grosseiro (Error Hunter aprovado)
- Não há efeito amador (Motion Director aprovado)

Se qualquer agente reprovar: vídeo volta para correção. Nunca entregar com ressalvas.

---

## PARTE 16 — CHECKLIST FINAL + WORKFLOW OBRIGATÓRIO

### Checklist completo de entrega

**Movimento**
- [ ] Zero movimento brusco
- [ ] Zero wiggle / bounce / shake desnecessário
- [ ] Zero escala passando de 1.0 em entrada
- [ ] Zero elemento aparecendo ou sumindo seco
- [ ] Blur proporcional à velocidade de cada movimento
- [ ] Easing curvo em todos os movimentos principais
- [ ] Câmera estável e com intenção

**Visual**
- [ ] Alinhamento consistente em todas as cenas
- [ ] Texto legível durante toda a animação
- [ ] Paleta consistente com a identidade do produto
- [ ] Tipografia coerente com o conceito
- [ ] Espaços equilibrados, sem crowding
- [ ] Contraste mínimo garantido
- [ ] Visual parece premium, não de template

**Legenda**
- [ ] Sincronizada com a fala
- [ ] Tempo suficiente para leitura (mínimo 1.8s por frase)
- [ ] Quebra de linha inteligente
- [ ] Destaque coerente com a frase
- [ ] Posição dentro da safe zone
- [ ] Sem saltos ou cortes secos

**Copy**
- [ ] Clara, curta e forte
- [ ] Sem enrolação
- [ ] Sem cara de IA
- [ ] Cada frase conduz ao próximo elemento
- [ ] Promessa clara

**Narrativa**
- [ ] Começo, meio e fim identificáveis
- [ ] Uma cena conecta logicamente com a outra
- [ ] Progressão de tensão ou informação
- [ ] Conclusão e chamada final claras

**Técnica**
- [ ] Zero TypeScript errors
- [ ] Tokens globais usados (`MOTION.*`)
- [ ] `extrapolate: "clamp"` em todo `interpolate`
- [ ] Helpers reutilizáveis em vez de código duplicado
- [ ] Spring configs declaradas (sem spring raw)
- [ ] BackgroundBase com 3 camadas

### Workflow obrigatório de produção

```
1. Entender objetivo da peça (o que muda no comportamento do espectador?)
2. Definir estilo visual (paleta, fonte, filosofia — ANTES de qualquer código)
3. Definir estrutura narrativa (começo, tensão, virada, conclusão, CTA)
4. Mapear cenas (conceito visual por cena — pergunta das 5 do PARTE 4)
5. Definir ritmo (timing, beats de pausa, sobreposições)
6. Definir sistema de movimento (tokens, helpers, easings — via MOTION.*)
7. Criar componentes Remotion (BackgroundBase → elementos → texto → saída)
8. Aplicar tokens globais (MOTION.durations, MOTION.blur, MOTION.stagger)
9. Aplicar animações premium (sem bounce, com blur, com fade, com easing)
10. Revisar legendas (Caption Sync)
11. Revisar copy (Copy Clarity)
12. Revisar alinhamento (Visual Consistency)
13. Revisar narrativa (Narrative Flow)
14. Revisar aparência anti IA (Anti AI Look)
15. Caçar erros grosseiros (Error Hunter)
16. Aprovação final (Final Approval — somente se todos os anteriores passaram)
```

### A regra definitiva

```
Se o movimento chama mais atenção do que a mensagem → está errado.
Se o movimento valoriza a mensagem sem roubar a cena → está certo.
Se parece preset → refazer.
Se parece direção de arte → aprovar.
```

---

---

## PARTE 17 — PADRÃO OFICIAL DE PONTO DE PARTIDA: AGENTE ARQUITETO V13

> Status: APROVADO em 2026-05-20 por Allysson Silveira
> Todo motion novo começa aqui. Sem exceção. Sem improvisação.

---

### 17.1 — O que é o padrão V13

O `AgenteArquiteto-FINAL-v13.mp4` é o vídeo de referência oficial aprovado para o Zeus Motion.
Ele define o ponto de partida de todo motion criado neste squad.

Se o usuário pedir um motion sem especificar cores, estilo ou movimento: **replicar V13 integralmente.**
Se pedir "mesmo estilo, outras cores": replicar V13 e trocar apenas a paleta.
Se pedir "outro tema": adaptar as cenas ao novo tema, manter toda a linguagem de motion.

---

### 17.2 — Protocolo obrigatório de perguntas (antes de qualquer código)

Antes de iniciar qualquer motion, SEMPRE perguntar ao usuário:

```
1. Qual é o produto ou serviço? (para definir conceito por cena)
2. Qual é o público? (mentorado, empresário, estudante, etc.)
3. Tem narração? Se sim, qual o arquivo de áudio?
4. Quer paleta diferente do padrão V13? Se sim, quais cores?
5. Tem algum elemento visual obrigatório? (logo, mockup, produto)
6. Quer o mesmo estilo do V13 ou algo diferente?
```

Nunca assumir. Nunca improvisar identidade visual sem resposta do usuário.
Se o usuário responder "faz igual o V13" ou "pode usar o padrão" — aplicar V13 sem perguntar mais.

---

### 17.3 — Lógica de decisão: replicar x adaptar

| O usuário diz | Ação correta |
|---------------|-------------|
| "faz um motion" (sem mais info) | Perguntar as 6 perguntas, então aplicar V13 |
| "igual ao V13" / "padrão" | Replicar V13 completamente |
| "igual mas com outras cores" | V13 completo, trocar apenas a paleta |
| "de outro tema" | Manter motion language V13, adaptar cenas ao tema |
| "mais animado" / "mais colorido" | Perguntar o quanto. Se estético, adaptar mantendo a base |
| "quero algo diferente do padrão" | Briefing completo antes de começar |

---

### 17.4 — Especificação técnica completa do V13

**Formato:** 1080×1920 @ 30fps
**Duração:** 1387 frames = 46.23s
**Composition ID:** `AgenteArquiteto`
**Arquivo canônico:** `src/compositions/AgenteArquiteto/index.tsx`

**Paleta Apple Minimalista:**
```typescript
const COLORS = {
  bg:        "#000000",   // fundo preto puro
  hero:      "#FFFFFF",   // texto principal branco puro
  secondary: "#8E8E93",   // texto secundário cinza iOS
  border:    "rgba(255,255,255,0.08)",
  cardBg:    "rgba(255,255,255,0.04)",
};
const FONT = `"SF Pro Display", -apple-system, "Helvetica Neue", sans-serif`;
```

**Safe zones:**
```
SAFE_X = 90px     (margens laterais)
SAFE_W = 900px    (largura útil de conteúdo)
PAD_TOP = 180px   (topo — onde o conteúdo começa)
PAD_BOTTOM = 730px (fundo — margem inferior até y=1190)
```

---

### 17.5 — Primitivas de motion do V13 (código canônico)

Estas funções definem toda a linguagem de movimento do V13. Usar em todo composition derivado.

```typescript
// Helper central — interpolate com clamp automático
const ci = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing?: (t: number) => number
) => interpolate(frame, input, output, {
  extrapolateLeft:  "clamp",
  extrapolateRight: "clamp",
  easing,
});

// ENTRADA — elemento vindo de uma direção com blur de motion
const entryFrom = (
  frame: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 100,
  dur = 22
) => {
  const axis  = dir === "left" || dir === "right" ? "X" : "Y";
  const sign  = dir === "right" || dir === "bottom" ? 1 : -1;
  const pos   = ci(frame, [0, dur], [distance * sign, 0], Easing.out(Easing.cubic));
  const op    = ci(frame, [0, Math.round(dur * 0.5)], [0, 1]);
  const blur  = ci(frame, [0, Math.round(dur * 0.45)], [12, 0], Easing.out(Easing.quad));
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px)`,
    filter:    `blur(${blur}px)`,
  };
};

// SAÍDA — elemento saindo para uma direção com blur de motion
const exitTo = (
  frame: number,
  start: number,
  dir: "left" | "right" | "top" | "bottom",
  distance = 1200,
  dur = 18
) => {
  const axis  = dir === "left" || dir === "right" ? "X" : "Y";
  const sign  = dir === "right" || dir === "bottom" ? 1 : -1;
  const f     = frame - start;
  const pos   = ci(f, [0, dur], [0, distance * sign], Easing.in(Easing.exp));
  const op    = ci(f, [dur * 0.35, dur], [1, 0]);
  const sc    = ci(f, [0, dur], [1, 0.94], Easing.in(Easing.exp));
  const blur  = ci(f, [0, dur], [0, 20], Easing.in(Easing.cubic));
  return {
    opacity:   op,
    transform: `translate${axis}(${pos}px) scale(${sc})`,
    filter:    `blur(${blur}px)`,
  };
};

// SAÍDA SEM BLUR no pai (para gradient text via WebkitBackgroundClip)
const exitToNB = (frame: number, start: number, dir: "left" | "right" | "top" | "bottom", distance = 1200, dur = 18) => {
  const { filter, ...rest } = exitTo(frame, start, dir, distance, dur);
  return rest;
};

// Combinar estilos (entry + exit juntos)
const mergeStyles = (...styles: React.CSSProperties[]): React.CSSProperties =>
  Object.assign({}, ...styles);
```

---

### 17.6 — Background padrão V13 (3 camadas)

```typescript
// Usar em toda composition derivada do V13
// Camada 1: preto puro
<AbsoluteFill style={{ background: "#000000" }} />

// Camada 2: glow radial sutil (muda sutilmente por cena)
<AbsoluteFill style={{
  background: "radial-gradient(ellipse 80% 50% at 50% 28%, rgba(255,255,255,0.03) 0%, transparent 70%)"
}} />

// Camada 3: grain SVG (textura que diferencia do flat digital)
<AbsoluteFill style={{ opacity: 0.03 }}>
  <svg width="100%" height="100%">
    <filter id="grain-v13">
      <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain-v13)" />
  </svg>
</AbsoluteFill>
```

---

### 17.7 — Estrutura de cenas do V13 (timing oficial)

```typescript
// SCENE_TIMING do AgenteArquiteto V13
// [from_frame, duration_frames, SceneComponent]
const SCENE_TIMING: [number, number, React.FC][] = [
  [0,    120, SceneChatGPT],  // 4.0s  — interface IA simulada
  [110,  182, Scene1      ],  // 6.07s — lista numerada (o que o produto faz)
  [282,   75, Scene2      ],  // 2.5s  — formas no caos → grid ordenado
  [350,  125, Scene3      ],  // 4.17s — celular com ondas de áudio + mic
  [465,  145, Scene4      ],  // 4.83s — microfone com timer animado
  [600,  255, Scene5      ],  // 8.5s  — texto cinematográfico palavra a palavra
  [845,  240, Scene6      ],  // 8.0s  — card de checkout com preço
  [1075, 200, Scene7      ],  // 6.67s — ticket/cupom físico com bônus
  [1265, 122, Scene8      ],  // 4.07s — tela final logo + headline + botão + dedo
];
// durationInFrames={1387}
```

**Overlaps entre cenas:** 10 frames — a cena anterior ainda está visível por 10f quando a nova começa.

---

### 17.8 — Direção de saída por cena (V13 canônico)

Cada saída usa direção diferente da anterior. Nunca a mesma consecutiva.

| Cena | Entra de | Sai para |
|------|----------|---------|
| C0 (ChatGPT) | top | left |
| C1 (Lista) | right | top |
| C2 (Formas) | bottom | right |
| C3 (Celular) | left | bottom |
| C4 (Mic) | top | left |
| C5 (Palavras) | right | top |
| C6 (Checkout) | bottom | right |
| C7 (Ticket) | left | bottom |
| C8 (Final) | top | — (última cena, sem saída) |

Regra: rotação `top → left → top → right → bottom → left → top → right → bottom...`
Ou: padrão 4 direções em sequência, escolhido para que a câmera nunca repita a direção anterior.

---

### 17.9 — Stagger padrão V13

| Elemento | Delay por unidade | Exemplo |
|----------|------------------|---------|
| Letra | 1.5 frames | texto de 5 letras = 7.5f total |
| Palavra | 3 frames | frase de 7 palavras = 21f total |
| Linha | 5 frames | 3 linhas = 15f total |
| Card / item de lista | 11 frames | 4 items = 44f total |
| Tag / label | 12 frames | 3 tags = 36f total |

---

### 17.10 — Tipos de cenas do V13 (templates reusáveis)

**Tipo A - Fluxo de texto (word by word):**
Usado em: C5 (palavras cinematográficas)
Estrutura: cada `<span>` com `entryFrom(Math.max(0, frame - wi * 3), "bottom", 30, 14)`

**Tipo B - Headline + lista numerada:**
Usado em: C1 (lista de benefícios)
Estrutura: eyebrow → headline → 4-5 items com stagger 11f cada

**Tipo C - Mockup de interface/dispositivo:**
Usado em: C0 (ChatGPT), C3 (celular + mic), C6 (checkout), C7 (ticket)
Estrutura: border-radius + cardBg + conteúdo específico simulando produto real

**Tipo D - Animação abstrata com conceito:**
Usado em: C2 (formas caos-grid)
Estrutura: múltiplos elementos animados com `ci()` convergindo para posição de destino

**Tipo E - Tela de CTA final:**
Usado em: C8 (final)
Estrutura: logo → headline → body → botão → dedo animado com spring

---

### 17.11 — Idle animations (quando a cena está estável)

Cenas longas precisam de respiração para não parecer estáticas.

| Frequência | Amplitude | Quando usar |
|------------|-----------|-------------|
| `freq: 0.08` (lentíssimo) | 2-4px | Parallax de fundo, drift do glow |
| `freq: 0.10` (lento) | 3-6px | Card respirando, mockup flutuando |
| `freq: 0.14` (médio) | 2-4px | Sombra suave, borda pulsando |
| `freq: 0.18` (rápido) | 1-2px | Ponteiro animado, cursor piscando |
| `freq: 0.20` (mais rápido) | 1px | Luz de varredura, scan line |

```typescript
// Padrão de idle usado no V13
const idleY = ci(
  Math.sin(frame * 0.08 * Math.PI * 2) * 0.5 + 0.5,
  [0, 1], [-4, 4]  // flutua entre -4px e +4px
);
```

---

### 17.12 — Componentes de UI do V13 (especificações exatas)

**Phone frame (celular):**
```typescript
width: 220px, height: 380px
borderRadius: 36px
border: "1.5px solid rgba(255,255,255,0.15)"
background: "radial-gradient(at 50% 20%, rgba(255,255,255,0.07), rgba(255,255,255,0.02))"
boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)"
```

**Mic SVG (botão de gravação):**
```tsx
<svg width="80" height="80" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="38" fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
  <rect x="31" y="22" width="18" height="28" rx="9" fill="white" />
  <path d="M22 38 Q22 54 40 54 Q58 54 58 38" stroke="white" strokeWidth="2"
        fill="none" strokeLinecap="round" />
  <line x1="40" y1="54" x2="40" y2="62" stroke="white" strokeWidth="2" />
</svg>
```

**Ondas de áudio (3 círculos animados):**
```typescript
// Cada círculo com delay diferente
const wave1 = ci(Math.sin(frame * 0.12) * 0.5 + 0.5, [0, 1], [0.2, 0.6]);
const wave2 = ci(Math.sin(frame * 0.12 + 2) * 0.5 + 0.5, [0, 1], [0.1, 0.4]);
const wave3 = ci(Math.sin(frame * 0.12 + 4) * 0.5 + 0.5, [0, 1], [0.05, 0.2]);

// Raios: 60px, 100px, 140px com borderRadius 50%
```

**Card de produto:**
```typescript
background: "rgba(255,255,255,0.04)"
border: "1px solid rgba(255,255,255,0.10)"
borderRadius: 24px
boxShadow: "0 24px 60px rgba(0,0,0,0.4)"
// Preço em 96px fontWeight 700 — contraste total
```

**Ticket/cupom:**
```typescript
// Borda pontilhada + entalhes circulares nas laterais
border: "2px dashed rgba(255,255,255,0.25)"
borderRadius: 16px
// Entalhes: 2 divs com borderRadius 50%, background preto, position absolute
// Left: { left: -10, top: "50%", width: 20, height: 20, background: "#000" }
// Right: { right: -10, top: "50%", width: 20, height: 20, background: "#000" }
```

**Botão CTA:**
```typescript
background: "rgba(255,255,255,0.06)"
border: "1px solid rgba(255,255,255,0.18)"
borderRadius: 18px
padding: "22px 52px"
// Texto: 28px fontWeight 600 — não 700 (peso médio = mais sofisticado)
// Brilho no hover: animação lenta com ci() — não transformação brusca
```

**Dedo animado (C8):**
```typescript
// Spring para entrada do dedo
const fingerSpring = spring({ frame: Math.max(0, frame - 60), fps,
  config: { damping: 18, stiffness: 140, mass: 0.8 } });
// Click: escala 0.9 → 1.0 no frame de clique, spring rápido
const clickScale = spring({ frame: Math.max(0, frame - 85), fps,
  config: { damping: 14, stiffness: 280, mass: 0.5 } });
```

---

### 17.13 — Regras de adaptação por tipo de pedido

**Cenário 1: Novo commercial/anúncio de produto digital**
- Base: V13 Apple Minimalista completo
- Trocar: textos das cenas, tipo de produto, conceitos visuais por cena
- Manter: paleta #000 + #FFF + #8E8E93, SF Pro, primitivas, timing padrão

**Cenário 2: Captação HT (mentoria, high ticket)**
- Base: MagnaCaptura V5 B&W Premium
- Paleta: #080808 + branco hierárquico + vermelho apenas em negativos
- Referência: `src/compositions/MagnaCaptura/index.tsx`

**Cenário 3: Low Ticket / ads urgência**
- Base: V13 com neon (trocar paleta)
- Paleta sugerida: #0A0A0A + #FFFFFF + #FF3B30 ou #00FF88
- Manter toda a motion language V13

**Cenário 4: Conteúdo educacional / tutorial**
- Base: V13 com editorial (trocar paleta + fonte)
- Paleta sugerida: #FAFAFA + #0D0D0D + cor editorial do produto
- Fonte alternativa: Playfair Display para serifa elegante

**Cenário 5: Outro nicho sem especificação**
- Perguntar as 6 perguntas (17.2)
- Definir paleta com o usuário
- Aplicar toda a motion language V13 com a nova paleta

---

### 17.14 — Como fazer um novo motion do zero seguindo V13

Sequência exata de produção:

```
PASSO 1: Fazer as 6 perguntas (seção 17.2) — NUNCA pular
PASSO 2: Definir identidade visual (paleta, fonte, estilo)
PASSO 3: Definir conceito de cada cena (pergunta das 5, seção PARTE 4)
PASSO 4: Mapear SCENE_TIMING com overlaps de 10 frames
PASSO 5: Copiar as primitivas ci(), entryFrom(), exitTo(), exitToNB(), mergeStyles()
PASSO 6: Criar BackgroundBase com 3 camadas (sólido + glow + grain)
PASSO 7: Codar cada cena com entryFrom() staggerado, exitTo() na direção certa
PASSO 8: Aplicar idle animations em cenas longas (> 120 frames)
PASSO 9: Aplicar tokens MOTION.* para blur, duração, stagger
PASSO 10: Revisar com checklist 10.21 e 17.13 (anti-bounce, sem wiggle, sem seco)
PASSO 11: Renderizar draft e verificar visualmente
PASSO 12: Render final e entregar .mp4 via CLI (nunca pedir para abrir Studio)
```

---

### 17.15 — O que NUNCA pode mudar entre motions derivados do V13

Independente de tema, paleta ou assunto — esses elementos são a DNA do V13 e nunca mudam:

- `ci()` como helper de interpolate com clamp automático
- `entryFrom()` com blur de motion na entrada
- `exitTo()` com Saída Quadrupla (pos + blur + opacity + scale) na saída
- Overlaps de 10 frames entre Sequences
- Stagger entre elementos (nunca entrar tudo junto)
- Background em 3 camadas (sólido + glow + grain)
- Ausência total de bounce, wiggle, overshoot, shake
- Escala de entrada entre 0.97 e 0.98 (nunca de 0 para 1.1)
- Easing `out(cubic)` na entrada, `in(cubic)` na saída
- Direções de saída alternadas (nunca a mesma duas vezes seguidas)
- Blur proporcional ao movimento (sempre)
- Fade suave em toda entrada e saída (nunca seco)

---

---

## PARTE 11 — VIDEO APROVADO #3: MentoriaEstrutura21Dias

> Aprovado: 2026-05-21
> Arquivo: `output/MentoriaEstrutura21Dias/mentoria-estrutura-21dias-v01.mp4`
> Composition: `src/compositions/MentoriaEstrutura21Dias/index.tsx`
> Tipo: Anuncio de captacao HT com narrador sincronizado
> Duracao: 1090 frames = 36.33s @ 30fps
> Musica: `ads-05-v3-music.mp3` (background 12% volume, startFrom=710, fim do video = segundo 60 da musica)

---

### 11.1 — Identidade Visual Aprovada

**Filosofia:** Dark Luxury Tech Premium
Esta filosofia ainda nao existia no documento. E a terceira filosofia mapeada e aprovada.

```typescript
// MentoriaEstrutura21Dias — PALETA APROVADA 2026-05-21
const COLORS = {
  bg:       "#000000",      // preto puro
  white:    "#FFFFFF",      // texto principal
  gray:     "#8E8E93",      // texto secundario (cinza iOS)
  red:      "#FF002E",      // acento vermelho — elemento de destaque e urgencia
  surface1: "#0E0E10",      // fundo de cards e surfaces
};

const FONT = `"SF Pro Display", -apple-system, "Helvetica Neue", sans-serif`;
```

**Quando usar Dark Luxury Tech Premium:**
- Produto digital de ticket alto com urgencia visual
- Mencao a tempo, prazos, transformacao em dias/semanas
- Publico: mentor em fase de escala, empreendedor digital
- Tom: direto, urgente, profissional, premium sem ser frio

**Diferenca das outras filosofias:**
- Apple Minimalista (AgenteArquiteto): sem cor de acento, branco puro sobre preto
- Magna B&W Premium (MagnaCaptura): vermelho apenas em negativos
- Dark Luxury Tech Premium (este): vermelho como cor de acento positivo (destaque, CTA, elemento heroi)

---

### 11.2 — Mapa de Cenas Aprovadas

| Cena | Texto da Narração | Conceito Visual | Elemento Heroi | Frames |
|------|-------------------|-----------------|----------------|--------|
| C1 | "Vender sua mentoria..." | Headline de impacto com contador de tempo decrescente | Numero grande pulsante em vermelho | 0-134 |
| C2 | "...um ano..." | Reveal gigante com texto contextualizador antes | "1 ANO" em display 200px+ | 127-221 |
| C3 | "...tres meses..." | Numero fantasma + ampulheta SVG animada com areia vermelha | Ampulheta com fluido vermelho | 214-372 |
| C4 | "...21 dias..." | Pergunta conversacional + destaque numerico em vermelho | "21 DIAS" em vermelho | 365-521 |
| C5 | "...area de membros..." | Interface de app real — dark UI com header, progresso e modulos | Barra de progresso animada com percentual | 514-666 |
| C6 | "...pagina, automacoes, anuncios..." | Grid de 3 entregas com icones SVG e bullets | Grid 3 colunas com icones lineares | 659-840 |
| C7 | "...agendar um horario..." | CTA final com botao de agendamento | Botao de acao com pulsacao | 833-1090 |

---

### 11.3 — Padroes de Movimento Novos Aprovados

Estes padroes nao existiam nos dois videos anteriores. Extraidos deste video.

**PADRAO-MOV-1 — Numero Fantasma com Spring Bounce**

```tsx
// Numero gigante de fundo como elemento de contexto/atmosfera
// Opacity muito baixa (7%), spring bounce na entrada, float continuo
const tresBounce = spring({ frame, fps, config: { damping: 16, mass: 0.8, stiffness: 220 }, from: 0.6, to: 1.0 });
const tresFloat  = Math.sin(frame * 0.08) * 6;  // float suave continuo
const tresOp     = ci(frame, [0, 18], [0, 1]);

<div style={{
  fontSize: 280,
  fontWeight: 900,
  color: "rgba(255,255,255,0.07)",  // quase invisivel
  transform: `translateX(-50%) scale(${tresBounce}) translateY(${tresFloat}px)`,
  opacity: tresOp,
  lineHeight: 1,
}}>3</div>

// Regra: numero fantasma ocupa metade superior da cena (top ~440)
// Elemento visual (ampulheta, grafico, etc) fica na metade inferior (top ~960+)
// Gap minimo entre os dois: 240px (evitar sobreposicao — ERRO que foi corrigido)
```

**Quando usar:** cenas com numero central (21 dias, 3 meses, 1 ano, etc)
**Gap obrigatorio:** minimo 240px entre numero fantasma e elemento visual abaixo

---

**PADRAO-MOV-2 — Ampulheta SVG com Fluido Animado**

```tsx
// sandProgress: ci(frame, [8, dur - 18], [0, 1])
// Areia superior diminui, inferior aumenta — animacao sincronizada
// Fio de areia cai do estreitamento (dripLen cresce com sandProgress)
// COR DO FLUIDO: sempre a cor de acento do projeto (aqui: vermelho #FF002E)

const sandProgress = ci(frame, [8, EXIT_F - 10], [0, 1], Easing.inOut(Easing.cubic));
const dripLen = ci(frame, [20, EXIT_F - 20], [0, 65]);

// Areia superior (diminuindo):
<polygon fill="rgba(255,0,46,0.50)" clipPath="url(#sandTopClip)" />

// Areia inferior (acumulando):
<polygon fill="rgba(255,0,46,0.40)" clipPath="url(#sandBotClip)" />

// Fio de areia:
<line stroke="rgba(255,0,46,0.75)" strokeWidth="2.5" />
```

**Quando usar:** cenas sobre tempo, prazo, urgencia, escassez
**Regra de cor:** fluido sempre na cor de acento do projeto. Nunca branco ou cinza para fluido.

---

**PADRAO-MOV-3 — Interface de App Real (Dark UI Mockup)**

```
Aprovado em Scene 5 (Area de Membros).
Estrutura: header com logo + avatar + notificacao + barra de progresso animada + lista de modulos com status.

Componentes obrigatorios da interface:
1. Header: nome da area + nome do usuario + avatar emoji + ponto de notificacao
2. Progresso: label "Progresso do programa" + barra animada 0-X% + contador numerico sincronizado
3. Lista de modulos: 4 itens com status visual (check verde / dot vermelho pulsante / cadeado SVG)

Status visuais aprovados:
- done:   check mark SVG branco sobre circulo verde (#22C55E)
- active: circulo vermelho (#FF002E) pulsando com Math.sin(frame * freq) * amplitude
- locked: cadeado SVG (path d="M5,9 V6 a5,5 0 0 1 10,0 v3") em cinza

Regra do card extra:
Abaixo da lista de modulos, adicionar card com borda pulsante em vermelho
para destacar um beneficio urgente ou CTA da cena.
```

---

**PADRAO-MOV-4 — Sincronizacao Musical com Ponto de Marca**

```
Problema que resolve: musica começa/termina em momento sem impacto na faixa.
Solucao: calcular startFrom para que o video TERMINE exatamente no ponto desejado da musica.

Formula:
  duracao_video_em_segundos = durationInFrames / fps
  startFrom_em_frames = (ponto_alvo_segundos - duracao_video_em_segundos) * fps

Exemplo MentoriaEstrutura21Dias:
  duracao = 1090 / 30 = 36.33s
  ponto_alvo = 60s (1 minuto da musica — ponto de fraseado musical)
  startFrom = (60 - 36.33) * 30 = 710 frames

Volume aprovado para musica de fundo com narrador: 0.12 (12%)
  - Abaixo de 0.10: quase inaudivel, perde funcao
  - Acima de 0.18: começa a competir com a voz do narrador
  - Faixa ideal: 0.10 a 0.15
```

---

**PADRAO-MOV-5 — Float Senoidal por Elemento**

```tsx
// Cada elemento visual tem seu proprio float com frequencia diferente
// Cria sensacao organica — nao parece tudo balancando junto

const floatA = Math.sin(frame * 0.08) * 6;   // lento, amplitude media — elementos grandes
const floatB = Math.sin(frame * 0.12) * 4;   // medio — elementos medios
const floatC = Math.sin(frame * 0.16) * 3;   // mais rapido — elementos pequenos

// Icones com pulse adicional:
const iconPulse = 0.6 + Math.sin(frame * 0.16) * 0.3;  // opacity pulsante 0.3 a 0.9
const notifOp   = 0.6 + Math.sin(frame * 0.20) * 0.3;  // notificacao pulsando diferente do icone
```

---

### 11.4 — Erros Cometidos Automaticamente (nao aprovados)

Esta secao documenta o que o sistema fez por padrao e foi corrigido.
Cada erro vira regra proibitiva para o comportamento automatico.

---

**ERRO-AUTO-1 — Cor do fluido da ampulheta era branca**

O que o sistema fez automaticamente:
```tsx
// Sistema colocou areia branca (padrao da paleta — branco sobre preto)
fill="rgba(255,255,255,0.40)"
stroke="rgba(255,255,255,0.60)"
```

O que deveria ter feito:
```tsx
// Fluido de ampulheta = cor de acento do projeto
// Em Dark Luxury Tech Premium: vermelho #FF002E
fill="rgba(255,0,46,0.50)"
stroke="rgba(255,0,46,0.75)"
```

Regra gerada:
FLUIDO EM ELEMENTOS ANIMADOS (ampulheta, barras de liquido, gotas, rios) NUNCA e branco.
Sempre usa a cor de acento do projeto. O branco e para texto, nao para fluido dinamico.

---

**ERRO-AUTO-2 — Numero fantasma e elemento visual ficaram sobrepostos**

O que o sistema fez automaticamente:
```
Numero "3": top=720, fontSize=280px -> ocupa y=720 a y=1000
Ampulheta:  top=800, height=260px  -> ocupa y=800 a y=1060
Gap real: negativo — sobreposicao de 200px no centro da tela
```

O que deveria ter feito:
```
Numero "3": top=440, fontSize=280px -> ocupa y=440 a y=720 (metade superior)
Ampulheta:  top=960, height=260px  -> ocupa y=960 a y=1220 (metade inferior)
Gap real: 240px — sem sobreposicao
```

Regra gerada:
NUMERO FANTASMA e ELEMENTO VISUAL na mesma cena NUNCA compartilham espaco vertical.
Dividir a cena em metade superior (numero, top ~440) e metade inferior (elemento, top ~960+).
Gap minimo obrigatorio: 200px entre o fim de um e o inicio do outro.
Verificar matematicamente antes de codar: top_A + height_A + 200 <= top_B.

---

**ERRO-AUTO-3 — Texto nao estava centralizado lateralmente**

O que o sistema fez automaticamente:
```tsx
// WordByWord sem justifyContent — alinhava a esquerda por padrao do flex
<div style={{ display: "flex", flexWrap: "wrap", gap: "0 0.3em" }}>
  {words}
</div>
```

O que deveria ter feito:
```tsx
// justifyContent: "center" obrigatorio em containers de texto
<div style={{
  display: "flex",
  flexWrap: "wrap",
  gap: "0 0.3em",
  justifyContent: "center",  // <- SEMPRE para textos de cena
}}>
  {words}
</div>
```

Regra gerada:
TODO container de texto (WordByWord, spans, divs de headline) em composicao de video vertical
SEMPRE tem justifyContent: "center" e textAlign: "center".
Alinhamento a esquerda NUNCA e o padrao para textos de cena em formato portrait.

---

**ERRO-AUTO-4 — Musica sem ponto de sincronizacao**

O que o sistema fez automaticamente:
Sem musica de fundo — composition sem trilha.

O que deveria ter feito:
Toda composition com narrador e musica aprovada deve ter trilha de fundo com:
- startFrom calculado para alinhar fim do video com ponto musical relevante
- Volume na faixa 0.10-0.15

Regra gerada:
Compositions com narrador DEVEM perguntar ao usuario se ha trilha de fundo ANTES de renderizar.
Se houver trilha, perguntar qual o ponto da musica que deve coincidir com o fim do video.
Nunca colocar volume acima de 0.15 quando ha narrador.

---

**ERRO-AUTO-5 — Scene de area de membros era generica**

O que o sistema fez automaticamente:
Cena com label simples + barra de progresso + textos soltos.
Sem interface real, sem mockup de app, sem hierarquia visual de produto digital.

O que deveria ter feito:
Toda vez que a narração mencionar "area de membros", "plataforma", "portal" ou produto digital,
a cena deve mostrar uma INTERFACE REAL simulada — nao texto numa tela.
Interface obrigatoria: header, navegacao ou lista de itens, elemento de progresso ou status.

Regra gerada:
Cenas que descrevem produtos digitais (area de membros, app, plataforma, curso)
NUNCA sao representadas com texto solto + ícone generico.
SEMPRE simular uma interface funcional com hierarquia visual real.
Referencia: Scene 5 aprovada (header + progress + modulos com status).

---

**ERRO-AUTO-6 — Texto antes do reveal nao tinha impacto visual**

O que o sistema fez automaticamente:
Na Scene 2, o texto de contexto antes de "1 ANO" aparecia em tamanho pequeno e cinza —
mesmo nivel de destaque do label secundario.

O que deveria ter feito:
O texto de contexto antes de um reveal de impacto deve ter hierarquia propria.
Nao precisa ser do mesmo tamanho do reveal, mas deve ter peso visual suficiente
para criar tensao e preparar o reveal.

Regra gerada:
Texto imediatamente antes de um REVEAL GRANDE (numero grande, palavra de impacto)
deve ter fontSize minimo de 32px e cor com pelo menos 70% de opacidade.
Nunca usar texto de 24px/40% de opacidade antes de uma palavra em 200px.
A preparacao precisa ter peso. Contraste de tamanho: o reveal pode ter 5x o tamanho,
mas o setup nao pode ser 10x menor em visibilidade.

---

### 11.5 — Tabela de Aprendizado Automatico

O que o sistema aprende a fazer automaticamente a partir deste video aprovado:

| Situacao | Comportamento anterior | Comportamento novo (aprovado) |
|----------|----------------------|-------------------------------|
| Fluido em ampulheta/liquido | Branco (cor padrao da paleta) | Cor de acento do projeto |
| Numero fantasma + elemento visual | Mesma posicao vertical | Metade superior (numero) + metade inferior (elemento), gap 200px+ |
| Containers de texto em portrait | Sem justifyContent | justifyContent: "center" obrigatorio |
| Composition com narrador | Sem musica de fundo | Perguntar trilha + calcular startFrom |
| Cena de produto digital | Texto + icone generico | Interface simulada com hierarquia real |
| Texto antes de reveal grande | Pequeno e apagado | fontSize 32px+, opacidade 70%+ |
| Cor de acento em elementos ativos | Branco por padrao | Vermelho/acento em dots pulsantes, CTAs, elementos vivos |

---

### 11.6 — Design System da Filosofia Dark Luxury Tech Premium

Para uso em qualquer video desta categoria (urgencia, transformacao em tempo definido, HT pitch):

```typescript
// DARK LUXURY TECH PREMIUM — Design System v1 (aprovado 2026-05-21)

export const COLORS = {
  bg:       "#000000",
  white:    "#FFFFFF",
  gray:     "#8E8E93",
  red:      "#FF002E",
  surface1: "#0E0E10",
};

export const FONT = `"SF Pro Display", -apple-system, "Helvetica Neue", sans-serif`;

// Safe zones (mesmas de todos os videos)
export const SAFE = { x: 90, padTop: 180, padBottom: 730 };

// Uso de cor:
// white  — headlines, textos principais, elementos heroi
// gray   — texto secundario, labels, captions, corpo
// red    — elementos vivos (botao, ponto ativo, contador, CTA), urgencia, destaque numerico
// surface1 — fundo de cards, interfaces simuladas
// bg     — fundo absoluto

// Regra do vermelho nesta filosofia:
// DIFERENTE do Magna B&W Premium (vermelho apenas em negativos)
// Aqui o vermelho E o acento positivo — elemento de destaque, nao de erro
// Usar em: CTAs, botoes, dots ativos, numeros de destaque, fluidos de ampulheta
```

---

## PARTE 18 — PADRÃO VINTAGE OFICIAL

**Aprovado em 2026-05-23 por Allysson Silveira.**
Composition de referência: `MaquinaMentoria` (31 cenas, 960f, 32s @ 30fps).
Este padrão é o quarto estilo oficial do Zeus Motion, ao lado de Apple Minimalista, Magna B&W Premium e Dark Luxury Tech Premium.

---

### Conceito Central

Vintage Premium não é filtro de câmera nem estética velha. É motion editorial dramático moderno com textura vintage.
O objetivo é impacto visual com caráter: mais expressivo, mais dramático, mais texturizado do que o flat minimalista.
Referência: cinema de autor anos 80 com produção de alto nível — não nostalgia de baixa qualidade.

---

### Paleta Oficial (INVIOLÁVEL)

```typescript
export const VINTAGE = {
  bg:      "#07080D",   // fundo azul-preto muito escuro
  gold:    "#C99A3A",   // ouro vintage quente — destaque principal
  cyan:    "#00C2FF",   // ciano elétrico — contraponto frio
  magenta: "#D81B60",   // magenta profundo — urgência, contraste
  cream:   "#F0E8D0",   // creme — texto principal sobre escuro
  muted:   "rgba(240,232,208,0.55)", // texto secundário, labels
  subtle:  "rgba(240,232,208,0.12)", // bordas, divisores
  cardBg:  "rgba(240,232,208,0.04)", // fundo de cards
};

// Tipografia obrigatória
// Headline: fonte serifada bold (ex: Playfair Display 700, Abril Fatface)
// Sub / corpo: sans condensed (ex: Barlow Condensed 600, Oswald)
// Ícones/SVG: stroke em gold ou cyan, nunca fill sólido
```

---

### As 20 Regras do Padrão Vintage

#### REGRA V-01 — Conceito profissional
Vintage Premium é editorial dramático moderno com textura vintage.
Nunca: filtro de câmera antigo, cor dessaturada, pixel borrado, efeito cassete, vhs grain exagerado.
Grain SVG sutil (baseFrequency 0.75, opacity 0.035) é permitido e recomendado.

#### REGRA V-02 — Diferença do flat
Mais expressivo que minimalista: vinheta, textura, hierarquia tipográfica dramática.
Mais caráter: cor de acento quente (gold) com contraponto frio (cyan).
Mais impacto: contraste luz/sombra mais pronunciado que Apple Minimalista.

#### REGRA V-03 — Ritmo de edição
Cortes rápidos entre cenas, mas cada cena precisa ter tempo de leitura respeitado.
Duração mínima por cena: texto de 2 palavras = 25f, texto de 4-5 palavras = 38f, texto longo = 55f+.
Ritmo acelerado não justifica cenas ilegíveis.

#### REGRA V-04 — Textos rápidos
Energia sem confusão. O espectador DEVE conseguir ler cada cena completamente.
Duração = (número de palavras × 8f) + 15f de padding mínimo.
Se o resultado ficar abaixo de 25f: dividir em 2 cenas.

#### REGRA V-05 — Posição do texto (portrait / Reels)
Conteúdo principal: nos 2/3 superiores da tela (y de 0 a 1280px).
Terço inferior (y > 1280px): SEMPRE livre — não competir com overlay do Instagram/TikTok.
Exceção: CTA final pode ter elemento sutil apontando para baixo (seta vintage), mas o texto fica acima.

#### REGRA V-06 — Espaçamento e agrupamento
Palavras semanticamente relacionadas ficam visualmente próximas.
Nunca espalhar texto pela tela sem intenção de hierarquia.
Gap entre headline e sub: mínimo 16px, máximo 40px — não mais que isso.

#### REGRA V-07 — Hierarquia tipográfica por cena
Toda cena com 2 palavras em destaque DEVE diferenciar as duas: peso diferente, tamanho diferente, ou cor diferente.
Nunca duas palavras principais na mesma escala com a mesma cor.
Hero (principal): 96-128px bold. Sub (secundária): 48-64px regular ou italic.

#### REGRA V-08 — Vinheta
Obrigatória em toda cena. Mas VARIÁVEL por cena — não círculo uniforme em todas.
Cena de impacto: vinheta mais forte (opacity 0.5-0.7). Cena neutra: mais suave (0.2-0.35).
Implementação:
```css
background: radial-gradient(ellipse 80% 60% at 50% 35%, transparent 40%, rgba(0,0,0,OPACIDADE) 100%)
```

#### REGRA V-09 — Blur profissional em movimentos
Todo movimento de entrada, saída e transição usa blur.
Zero movimentos secos. Zero cortes sem suavização.
Entrada: blur 10-14px → 0. Saída: blur 0 → 18-25px. Sempre junto com deslocamento e opacity.

#### REGRA V-10 — Letra por letra (animação de texto)
Cada caractere ou palavra entra individualmente com delay pequeno, blur suave, opacity e deslocamento curto.
Delay entre caracteres: 1.5-2f. Delay entre palavras: 3-4f.
Easing de entrada: `Easing.out(Easing.cubic)`. Nunca linear.
O bloco inteiro animando junto é AMADORISMO — regra V-10 proíbe.

#### REGRA V-11 — Entradas e saídas: quadrupla obrigatória
Toda entrada: fade + blur + slide (deslocamento). Nunca aparecer seco.
Toda saída: fade + blur + slide + scale sutil (0.94-0.96). Nunca desaparecer seco.
Bounce é PROIBIDO em qualquer filosofia. No Vintage ainda mais: rompe o tom editorial.

#### REGRA V-12 — Números sempre animados
Counters e números revelados usam aceleração no início e desaceleração próxima ao alvo.
Micro impacto permitido: scale máximo 1.015 (1.5%) ao atingir o valor — mais que isso vira bounce amador.
Easing: `Easing.out(Easing.exp)` chegando ao valor final.

#### REGRA V-13 — Ícones SVG obrigatórios por cena importante
Toda cena de conteúdo relevante (pilar, benefício, resultado) DEVE ter ícone ou ilustração SVG.
Nunca usar texto flutuante sozinho sem elemento visual de apoio.
Ícones: stroke em gold (#C99A3A) ou cyan (#00C2FF), stroke-width 1.0-1.5, fill none, linecap round.

#### REGRA V-14 — Não inventar elementos sem referência
Ícones: usar bibliotecas aprovadas (Lucide, Tabler, Phosphor) + traçado manual vintage quando necessário.
Nunca inventar forma SVG de baixa qualidade para parecer vintage.
Se não tiver ícone apropriado: usar tipografia estilizada em vez de ícone genérico.

#### REGRA V-15 — Cenas dos quatro pilares: construção progressiva
Quando o vídeo apresentar 4 pilares ou elementos sequenciais, cada nova cena ADICIONA ao visual anterior.
Cena do pilar 1: apenas pilar 1 aparece. Cena do pilar 2: pilares 1 e 2 visíveis (1 já presente, 2 entra).
Cena do pilar 3: todos os 3 visíveis. Cena do pilar 4: todos os 4 visíveis.
Nunca mostrar todos de uma vez — a construção progressiva é o que cria impacto narrativo.

#### REGRA V-16 — Checklist de layout por cena (OBRIGATÓRIO antes de renderizar)
Para cada cena verificar:
- [ ] Texto está nos 2/3 superiores?
- [ ] Hierarquia tipográfica clara (2 pesos/tamanhos diferentes)?
- [ ] Vinheta presente e calibrada para o tom da cena?
- [ ] Ícone SVG presente (se cena de conteúdo)?
- [ ] Movimento de entrada com blur?
- [ ] Movimento de saída com quadrupla (fade+blur+slide+scale)?
- [ ] Nenhuma palavra ilegível pela velocidade?
- [ ] Cor de acento aplicada ao elemento de maior destaque?

#### REGRA V-17 — Cenas genéricas de urgência: remover se desnecessárias
Frases genéricas de urgência sem contexto ("não perca", "corra", "últimas vagas") são eliminadas se forem rápidas demais para o espectador ler E não acrescentam conteúdo ao argumento.
Critério de remoção: cena dura menos de 25f E texto tem mais de 3 palavras E não está no bloco de CTA final.
CTA final (últimas 3-5 cenas) é exceção — urgência ali tem função narrativa clara.

#### REGRA V-18 — CTA final obrigatório
O vídeo DEVE terminar com CTA claro.
Texto padrão adaptável: "Toque no botão e [resultado principal do produto]"
Elemento visual: seta SVG vintage apontando para baixo, cor gold (#C99A3A), stroke animado com draw-on.
Duração do CTA final: mínimo 55f (1.8s) — tempo suficiente para leitura + ação.

#### REGRA V-19 — Auto-revisão de 10 perguntas (por cena, antes de entregar)
```
1. O espectador sabe o que está sendo comunicado nesta cena?
2. O texto é legível na velocidade configurada?
3. Existe hierarquia visual clara (tamanho, peso, cor)?
4. A vinheta está calibrada para o tom da cena?
5. O movimento de entrada tem blur e deslocamento?
6. O movimento de saída tem a quadrupla completa?
7. O texto está acima de y=1280 (safe zone portrait)?
8. Existe ícone ou elemento visual de apoio?
9. A cor de acento está no elemento certo desta cena?
10. Esta cena é necessária? (se não passar nessa pergunta: remover)
```

#### REGRA V-20 — Matriz Vintage Motion (comando de ativação)
Quando o usuário mencionar: vintage, anos 80, retrô, editorial dramático, conceitual, peça clássica, MaquinaMentoria, matriz vintage:
1. Aplicar paleta VINTAGE automaticamente (sem perguntar sobre cores)
2. Aplicar as 20 regras deste padrão
3. Usar MaquinaMentoria como composição de referência
4. Hierarquia tipográfica: serifada bold + sans condensed
5. Grain SVG sutil obrigatório
6. Vinheta variável por cena obrigatória
7. Gold como destaque principal. Cyan como contraponto. Magenta para urgência.

---

### Mapa de Cenas — MaquinaMentoria (referência canônica)

```typescript
// 31 cenas, TOTAL_FRAMES_MM = 960, 32s @ 30fps
// Paleta: BG_DARK #07080D + GOLD #C99A3A + CYAN #00C2FF + MAGENTA #D81B60
// TIMING array: [from, duration] para cada cena

// BLOCO ATIVAÇÃO (C00-C07): abertura + máquina foi ativada
// BLOCO BENEFÍCIOS (C08-C15): resultados, credibilidade, estrutura
// BLOCO PILARES (C16-C19): Posicionamento, Conteúdo, Vendas, Entrega
// BLOCO URGÊNCIA (C20-C29): escassez, vagas limitadas, decisão
// BLOCO CTA (C30): chamada final com seta vintage

// Composition: src/compositions/MaquinaMentoria/index.tsx
```

---

## REFERÊNCIAS

| Item | Caminho/URL |
|------|-------------|
| Composição canônica aprovada (comercial) | `src/compositions/AgenteArquiteto/index.tsx` (v13) |
| Composição canônica aprovada (captação) | `src/compositions/MagnaCaptura/index.tsx` (v5) |
| Composição canônica aprovada (pitch HT) | `src/compositions/MentoriaEstrutura21Dias/index.tsx` (v01) |
| Composição canônica aprovada (vintage) | `src/compositions/MaquinaMentoria/index.tsx` |
| Vídeo canônico comercial | `AgenteArquiteto-FINAL-v13.mp4` |
| Vídeo canônico captação | `MagnaCaptura-v5.mp4` (45.2s, 1357f) |
| Vídeo canônico pitch HT | `output/MentoriaEstrutura21Dias/mentoria-estrutura-21dias-v01.mp4` (36.3s, 1090f) |
| Vídeo canônico vintage | `output/MaquinaMentoria/maquina-mentoria-vNN.mp4` (32s, 960f) |
| Design System B&W Premium | `src/compositions/MagnaCaptura/design-system.ts` |
| Agente de roteiro Gemini | https://gemini.google.com/gem/e47a6069b6d5 |
| BRABO Motion OS (10 Mandamentos) | `docs/brabo-motion-os-v9.md` |
| Guia vídeo com narrador | `docs/guia-video-narrado.md` |
| Post-mortem AgenteArquiteto | `docs/post-mortem-agente-arquiteto.md` |
| Erros técnicos Remotion | `ERROS-REMOTION.md` |
| Validador pré-render | `scripts/pre-render-validate.js` |
