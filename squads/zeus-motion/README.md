# ZEUS-MOTION — Squad de Motion Design para Mentores

Animações profissionais nível After Effects, geradas em código com Remotion.
Sem Adobe. Sem freelancer. Em minutos.

---

## Instalação

```bash
cd squads/zeus-motion
npm install
npx remotion studio   # abre o preview no browser
```

Para renderizar:
```bash
node scripts/render.js SquadPromo         # rascunho rápido (50% escala)
node scripts/render.js SquadPromo full    # qualidade final
node scripts/render.js TextReveal         # qualquer composition
```

O vídeo sai em `~/Desktop/zeus-motion-render/`.

---

## Mapa de Pastas

```
zeus-motion/
│
├── src/
│   ├── brand/                    SISTEMA DE MARCA
│   │   ├── loader.ts             → carrega config do cliente (loadBrand)
│   │   ├── types.ts              → interfaces BrandConfig, BrandColors
│   │   └── formats.ts            → formatos de vídeo (VERTICAL, FEED, SQUARE)
│   │
│   ├── compositions/             VÍDEOS PRONTOS (use esses)
│   │   ├── SquadPromo/           → vídeo de marketing do squad (21s)
│   │   ├── TextReveal/           → texto com efeito reveal (3s)
│   │   ├── DeviceDemo/           → app dentro de celular/tablet (5s)
│   │   ├── ProblemSolution/      → problema vs solução (6s)
│   │   ├── DataStory/            → números e métricas (5s)
│   │   ├── PriceReveal/          → reveal de preço com desconto (5s)
│   │   ├── ArrowExplainer/       → explicação com setas (4s)
│   │   ├── AiDemo/               → demo de IA com digitação (5s)
│   │   └── CheckoutDemo/         → checkout animado (4s)
│   │
│   └── modules/                  PEÇAS REUTILIZÁVEIS (construa com essas)
│       │
│       ├── text-system/          TEXTOS ANIMADOS
│       │   ├── BlurReveal        → aparece saindo do blur (elegante)
│       │   ├── TrackingIn        → letras fecham do espaçado (tipográfico)
│       │   ├── CharByChar        → cada letra entra em sequência (dinâmico)
│       │   ├── TypeWriter        → digita com cursor piscando (tech)
│       │   ├── StaggeredFadeUp   → lista sobe com delay entre itens
│       │   ├── ShimmerSweep      → brilho passando no texto (premium)
│       │   ├── WordByWord        → palavra por palavra com blur
│       │   ├── MarkerHighlight   → sublinhado que desenha (destaque)
│       │   ├── MaskedSlide       → revelação de baixo para cima (jornal)
│       │   ├── SlotMachine       → rola como caça-níquel (impacto)
│       │   └── InlineHighlight   → cor muda durante animação
│       │
│       ├── motion-primitives/    MOVIMENTOS BASE
│       │   ├── FadeIn            → aparece suavemente
│       │   ├── ScaleIn           → cresce do centro
│       │   ├── SlideIn           → entra deslizando (up/down/left/right)
│       │   └── Stack             → empilha filhos com delay
│       │
│       ├── shapes/               FORMAS E DESENHOS SVG
│       │   ├── AnimatedArrow     → seta que aparece com spring
│       │   ├── CircleAround      → círculo que desenha ao redor
│       │   ├── CheckmarkDraw     → checkmark verde que se desenha
│       │   ├── UnderlineDraw     → sublinhado que se desenha
│       │   ├── BoxAround         → caixa que se desenha ao redor
│       │   └── AnimatedStar      → estrela com spring
│       │
│       ├── cursor/               CURSORES
│       │   ├── HandCursor        → mão que toca a tela
│       │   └── ArrowCursor       → cursor que clica
│       │
│       ├── pan-quente/           EFEITOS AFTER EFFECTS
│       │   ├── counters/
│       │   │   ├── CountUp       → número contando para cima
│       │   │   ├── CurrencyCounter → valor em moeda (R$, $, €)
│       │   │   └── PercentageCounter → porcentagem animada
│       │   │
│       │   ├── transitions/
│       │   │   ├── DipToBlack    → fade para preto (corte cinematográfico)
│       │   │   ├── ZoomPunch     → zoom de impacto rápido
│       │   │   └── WhipPan       → virada lateral rápida
│       │   │
│       │   ├── emphasis/
│       │   │   ├── StampEffect   → carimbo que bate na tela
│       │   │   ├── ShakeWiggle   → tremida de atenção
│       │   │   └── ScalePunch    → pulso de escala (like reaction)
│       │   │
│       │   ├── progress/
│       │   │   ├── ProgressBar   → barra de progresso animada
│       │   │   └── StarRating    → estrelas que aparecem em sequência
│       │   │
│       │   └── celebration/
│       │       ├── ConfettiBurst → confetes que explodem
│       │       └── BounceEnter   → entrada com quique
│       │
│       ├── device/               MOCKUPS DE DISPOSITIVO
│       │   └── DeviceFrame       → iPhone, Android, iPad, browser
│       │
│       ├── backgrounds/          FUNDOS
│       │   ├── GradientBackground → gradiente estático ou animado
│       │   └── AuroraBackground  → aurora boreal com blur
│       │
│       └── dataviz/              DADOS E MÉTRICAS
│           └── AnimatedMetric    → número com label e delta (↑ verde / ↓ vermelho)
│
├── brand-memory/                 CONFIGS DE MARCA
│   └── _universal-default.yaml  → tema padrão (Apple Minimal, preto)
│
├── scripts/
│   └── render.js                 → renderizador via CLI
│
└── agents/                       AGENTES DO SQUAD
    ├── zeus-motion-master.md     → orquestrador geral
    ├── text-animator.md          → especialista em texto animado
    ├── shape-drawer.md           → especialista em shapes SVG
    └── ...                       → outros 13 agentes
```

---

## Como criar uma nova composition

1. Crie `src/compositions/MeuVideo/index.tsx`
2. Importe os módulos que precisar de `../../modules/`
3. Use `loadBrand(brand)` para cores e fontes do cliente
4. Registre em `src/Root.tsx` com `<Composition id="MeuVideo" ...>`
5. Adicione ao `COMPOSITIONS` em `scripts/render.js`

Exemplo mínimo:

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadBrand } from "../../brand/loader";
import { BlurReveal } from "../../modules/text-system/BlurReveal";

export const MeuVideo: React.FC<{ brand?: string; texto?: string }> = ({
  brand = "universal-default",
  texto = "Olá mundo",
}) => {
  const b = loadBrand(brand);
  return (
    <AbsoluteFill style={{ background: b.colors.bg, justifyContent: "center", alignItems: "center" }}>
      <BlurReveal>
        <div style={{ color: b.colors.text, fontSize: 64, fontFamily: b.typography.display }}>
          {texto}
        </div>
      </BlurReveal>
    </AbsoluteFill>
  );
};
```

---

## Como adicionar marca de cliente

1. Crie `brand-memory/nome-cliente.yaml` (baseado em `_universal-default.yaml`)
2. Em `src/brand/loader.ts`, adicione ao `BRAND_REGISTRY`:

```ts
"nome-cliente": {
  client: "nome-cliente",
  style: "dark",
  colors: {
    primary: "#SUA_COR",
    secondary: "#666",
    accent: "#SUA_COR_ACENTO",
    bg: "#000",
    text: "#fff",
    text_secondary: "#888",
    highlight: "#SUA_COR",
    red: "#FF453A", green: "#30D158", blue: "#0071E3",
    yellow: "#FFD60A", purple: "#5856D6", orange: "#FF9F0A",
  },
  typography: {
    display: "Inter",
    body: "Inter",
    weight_display: 700,
    weight_body: 400,
  },
  motion_preset: "elegant",
  icon_style: "line",
  design_system: false,
}
```

3. Use `brand="nome-cliente"` em qualquer composition.

---

## Compositions disponíveis e duração

| Composition | Frames | Duração | Uso |
|-------------|--------|---------|-----|
| SquadPromo | 630 | 21s | Vídeo de marketing do squad |
| TextReveal | 90 | 3s | Citação, frase de impacto |
| DeviceDemo | 150 | 5s | Demo de app/produto |
| ProblemSolution | 180 | 6s | Antes e depois |
| DataStory | 150 | 5s | Métricas, resultados |
| PriceReveal | 150 | 5s | Oferta, preço riscado |
| ArrowExplainer | 120 | 4s | Passo a passo, explicação |
| AiDemo | 150 | 5s | Demo de ferramenta de IA |
| CheckoutDemo | 120 | 4s | Confirmação de pagamento |

---

## Motion Presets

| Preset | Feeling | Spring config |
|--------|---------|---------------|
| elegant | suave, profissional | stiffness 80, damping 18 |
| smooth | lento, respirado | stiffness 60, damping 20 |
| energetic | rápido, vibrante | stiffness 150, damping 15 |
| bold | impacto, stamp | stiffness 300, damping 20 |

---

## Formatos de vídeo

| Formato | Resolução | Safe Zone | Uso |
|---------|-----------|-----------|-----|
| VERTICAL | 1080×1920 | top/bottom 10% | Reels, Stories, TikTok |
| FEED_PORTRAIT | 1080×1350 | top/bottom 8% | Feed Instagram 4:5 |
| SQUARE | 1080×1080 | top/bottom 8% | Feed quadrado |
| WIDE | 1920×1080 | left/right 5% | YouTube, desktop |
