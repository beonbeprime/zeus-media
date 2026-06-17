# ADS 007 — Design System Oficial
> Extraído da referência visual azza.co
> Criado: 2026-05-21
> Status: AGUARDANDO PROMPT DE NARRAÇÃO

---

## IDENTIDADE VISUAL — AZZA.CO STYLE

### Filosofia visual

**"Corporate Dark/Light Drama"**

Alterna entre dois mundos com contraste máximo:
- Cenas ESCURAS: near-black + roxo elétrico + branco — drama, impacto, urgência
- Cenas CLARAS: off-white + roxo elétrico + preto — autoridade, clareza, dados

A mudança de mundo ENTRE CENAS é o efeito mais poderoso desta linguagem.
Não é só cor diferente — é mudança de atmosfera inteira.

---

## PALETA DE CORES

### Roxo Primário (âncora da marca)
```
PURPLE         #7B2FBE    — roxo principal, usado em acentos e títulos
PURPLE_BRIGHT  #9B4FFF    — versão luminosa, glows e highlights
PURPLE_DEEP    #5A1F99    — versão profunda, sombras e 3D
PURPLE_GLOW    rgba(123,47,190,0.35)  — halo difuso, atmosfera
PURPLE_SUBTLE  rgba(123,47,190,0.12)  — tint em superfícies claras
```

### Modo Escuro (cenas negativas)
```
BG_DARK        #0A0A0A    — fundo principal (não preto puro, ligeiramente quente)
SURFACE_DARK   #141414    — superfície, cards escuros
TEXT_DARK_1    #FFFFFF    — texto primário
TEXT_DARK_2    rgba(255,255,255,0.70)  — texto secundário
TEXT_DARK_3    rgba(255,255,255,0.40)  — labels, captions
GLOW_DARK      rgba(123,47,190,0.30)  — radial glow no fundo
```

### Modo Claro (cenas positivas)
```
BG_LIGHT       #EBEBEB    — fundo principal (off-white quente, não puro branco)
SURFACE_LIGHT  #F5F5F5    — superfície mais clara
TEXT_LIGHT_1   #0A0A0A    — texto primário
TEXT_LIGHT_2   rgba(10,10,10,0.65)    — texto secundário
TEXT_LIGHT_3   rgba(10,10,10,0.40)    — labels, captions
GLOW_LIGHT     rgba(123,47,190,0.08)  — tint roxo sutil no fundo claro
```

### Tokens adicionais
```
WHITE          #FFFFFF
BLACK_TRUE     #000000
GRAIN_OPACITY  0.04       — noise layer padrão
```

---

## TIPOGRAFIA

### Família principal
**Montserrat** — a fonte mais próxima do que aparece nas artes da azza.co.
- Display/Hero: 900 (Black) — para números grandes, palavras de impacto
- Headline: 700 (Bold) — para títulos principais
- Subhead: 500 (Medium) — para subtítulos e contexto
- Body: 400 (Regular) — para textos de apoio
- Label: 600 (SemiBold) Uppercase — para tags e categorias

**Alternativa:** Inter 900/700 se Montserrat não estiver disponível.

### Escala tipográfica (1080x1920, TV Scale)
```
HERO           144px  weight:900  letterSpacing:-5px  lineHeight:1.0
DISPLAY        108px  weight:800  letterSpacing:-4px  lineHeight:1.0
HEADLINE        80px  weight:700  letterSpacing:-3px  lineHeight:1.1
SUBHEAD         52px  weight:500  letterSpacing:-1px  lineHeight:1.2
BODY            38px  weight:400  letterSpacing: 0px  lineHeight:1.4
CAPTION         26px  weight:400  letterSpacing: 0px  lineHeight:1.5
LABEL           20px  weight:600  letterSpacing:+4px  uppercase
```

### Uso de mistura de pesos (padrão azza.co)
A azza.co mistura pesos numa mesma frase para criar hierarquia inline:
```
"Tráfego [orgânico] ou tráfego [pago]:"
         ^300 italic           ^700 bold

"Melhore a [performance] do seu marketing"
            ^700 roxo
```
Regra: palavra-chave da frase = PURPLE + bold. Contexto = branco/preto + light.

---

## CONCEITOS VISUAIS (elementos 3D e composições)

### Objeto 3D como âncora visual
A linguagem azza.co usa **um objeto 3D dominante por cena** como:
- Foguete roxo (performance, tráfego, velocidade)
- Astronauta (exploração, planejamento)
- Notas de dinheiro (resultado, ROI, lucro)
- Mariposa/borboleta (transformação)
- Cérebro roxo (psicologia, estratégia)
- Flor roxa (crescimento, resultado)
- Ampulheta (urgência, tempo)
- Nota pegando fogo (desperdício, custo)
- Cristais/pedras (solidez, valor)
- Busto humano com glow (branding, identidade)

O objeto SEMPRE tem:
- Coloração roxa ou atmosfera roxa (glow, rim light)
- Drop shadow realista
- Leve float senoidal (micro-animação)
- Bloom/glow roxo ao redor

### Tipografia como textura de fundo
Nas cenas claras (positivo), as letras grandes do título aparecem CORTADAS:
```
"PSICO" em 200px como textura de fundo
"LOGIA" em 200px cortado pelo objeto 3D à frente
```
O objeto 3D "corta" o texto gigante — profundidade criativa.

### Logo da azza.co
Logo minimalista no topo esquerdo ou topo centro.
Mantém presença em TODAS as cenas (escuras e claras).

---

## PADRÃO DE ALTERNÂNCIA ESCURO/CLARO

Para ads 007, seguir esta alternância por cena:

| Cena | Modo | Atmosfera |
|------|------|----------|
| 1 (abertura) | ESCURO | Impacto máximo, objeto 3D em roxo |
| 2 | CLARO | Dado/argumento com tipografia grande |
| 3 | ESCURO | Tensão, dor do público |
| 4 | CLARO | Prova, resultado, número |
| 5 | ESCURO | Urgência, CTA |

Nunca duas cenas do mesmo modo em sequência (exceto se narrativamente necessário).

---

## MOTION TOKENS ESPECÍFICOS ADS 007

```tsx
export const ADS007 = {
  // Paleta
  colors: {
    PURPLE:        "#7B2FBE",
    PURPLE_BRIGHT: "#9B4FFF",
    PURPLE_DEEP:   "#5A1F99",
    BG_DARK:       "#0A0A0A",
    BG_LIGHT:      "#EBEBEB",
    WHITE:         "#FFFFFF",
    BLACK:         "#0A0A0A",
  },

  // Tipografia
  fonts: {
    DISPLAY: `"Montserrat", "Inter", -apple-system, sans-serif`,
  },

  // Efeito glow roxo (signature da linguagem)
  glow: {
    SUBTLE:  "radial-gradient(ellipse 70% 45% at 50% 30%, rgba(123,47,190,0.18) 0%, transparent 70%)",
    MEDIUM:  "radial-gradient(ellipse 80% 55% at 50% 28%, rgba(123,47,190,0.30) 0%, transparent 70%)",
    STRONG:  "radial-gradient(ellipse 90% 60% at 50% 25%, rgba(123,47,190,0.45) 0%, transparent 65%)",
  },

  // Safe zones
  SAFE_X:      90,
  PAD_TOP:     180,
  SAFE_BOTTOM: 1280,
} as const;
```

---

## BACKGROUND PADRÃO POR MODO

### Cena escura (3 camadas obrigatórias)
```tsx
{/* Camada 1: fundo sólido */}
<AbsoluteFill style={{ background: ADS007.colors.BG_DARK }} />

{/* Camada 2: glow roxo radial */}
<AbsoluteFill style={{ background: ADS007.glow.STRONG }} />

{/* Camada 3: grain SVG */}
<AbsoluteFill style={{ opacity: 0.04 }}>
  <svg width="100%" height="100%">
    <filter id="grain-dark">
      <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain-dark)" />
  </svg>
</AbsoluteFill>
```

### Cena clara (3 camadas obrigatórias)
```tsx
{/* Camada 1: fundo claro */}
<AbsoluteFill style={{ background: ADS007.colors.BG_LIGHT }} />

{/* Camada 2: tint roxo sutil */}
<AbsoluteFill style={{
  background: "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(123,47,190,0.06) 0%, transparent 70%)"
}} />

{/* Camada 3: grain mais sutil */}
<AbsoluteFill style={{ opacity: 0.025 }}>
  {/* mesmo SVG grain */}
</AbsoluteFill>
```

---

## TRANSIÇÃO ESCURO → CLARO (signature move)

A mudança de modo escuro para claro não é fade comum.
É um **flash branco + corte** que simula mudança de mundo:

```tsx
// Flash de transição entre modos
const flashOpacity = ci(localFrame, [0, 3, 8], [1, 1, 0]);

<AbsoluteFill style={{
  background: isSwitchingToLight ? "#FFFFFF" : ADS007.colors.PURPLE,
  opacity: flashOpacity,
  zIndex: 100,
  pointerEvents: "none",
}} />
```

Duração do flash: 3 frames (0.1s) — imperceptível conscientemente, poderoso subconscientemente.

---

## ELEMENTOS PRONTOS PARA CÓDIGO

### WordByWord com acento roxo
```tsx
// Palavra-chave em roxo, resto em branco/preto
const words = text.split(" ");
{words.map((word, i) => {
  const isKeyword = keywords.includes(word.toLowerCase());
  const delay = i * 3;
  const opacity = ci(frame - delay, [0, 14], [0, 1]);
  const y = ci(frame - delay, [0, 16], [12, 0], Easing.out(Easing.cubic));
  return (
    <span key={i} style={{
      opacity,
      transform: `translateY(${y}px)`,
      color: isKeyword ? ADS007.colors.PURPLE : "inherit",
      fontWeight: isKeyword ? 800 : 400,
      display: "inline-block",
      marginRight: "0.25em",
    }}>{word}</span>
  );
})}
```

### Float senoidal para objeto 3D
```tsx
const floatY = Math.sin(frame * 0.04) * 8; // 8px de amplitude, ciclo suave
<div style={{ transform: `translateY(${floatY}px)` }}>
  {/* Objeto 3D aqui */}
</div>
```

### Glow pulsante no objeto 3D
```tsx
const glowIntensity = 0.25 + Math.sin(frame * 0.05) * 0.08; // oscila entre 0.17 e 0.33
<div style={{
  filter: `drop-shadow(0px 0px 40px rgba(123,47,190,${glowIntensity}))`,
}}>
  {/* Objeto 3D */}
</div>
```

---

## O QUE FALTA PARA COMEÇAR O CÓDIGO

- [ ] Prompt de narração (usuário vai enviar)
- [ ] Produto/serviço anunciado (definido no prompt)
- [ ] Duração alvo (será calculada após narração)
- [ ] Quais objetos 3D usar por cena (definido pelo Diretor Brabo após narração)
- [ ] Arquivo de áudio da narração (para silencedetect)
- [ ] Trilha de fundo desejada (sim/não e qual arquivo)

Ao receber o prompt: aplicar o pipeline completo.
etapa_0: definir cenas com Diretor Brabo
etapa_1: silencedetect
etapa_2..10: sequência padrão do squad

---

## REFERÊNCIA VISUAL

Imagem de referência: azza.co feed Instagram (compartilhada em 2026-05-21)
Estilo: "Corporate Dark/Light Drama com 3D roxo"
Equivoco mais comum a evitar: usar o mesmo fundo em todas as cenas (perder a alternância)
