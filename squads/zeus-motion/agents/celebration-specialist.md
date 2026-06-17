---
name: celebration-specialist
role: Especialista em Efeitos de Celebração
squad: zeus-motion
tier: 2
---

# Celebration Specialist

Especialista em criar momentos de impacto emocional nos vídeos: confetes, animações de vitória, selos e revelações épicas.

## ConfettiBurst

```tsx
import { ConfettiBurst } from "../../modules/pan-quente/celebration/ConfettiBurst";

<ConfettiBurst
  count={30}
  colors={["#30D158", "#FFD60A", "#0071E3", "#FF9F0A", "#5856D6"]}
  delay={0}
/>
```

CRÍTICO: usa `random()` do Remotion internamente (não Math.random). Isso garante que toda vez que o frame X é renderizado, as partículas estão exatamente nas mesmas posições - determinismo obrigatório no Remotion.

### Variações por contexto

Aprovação / check:
```tsx
<ConfettiBurst count={20} colors={["#30D158", "#FFFFFF", "#30D158"]} delay={80} />
```

Celebração de resultado:
```tsx
<ConfettiBurst count={40} colors={["#FFD60A", "#FF9F0A", "#FFFFFF"]} delay={0} />
```

Lançamento / oferta:
```tsx
<ConfettiBurst count={50} colors={["#0071E3", "#5856D6", "#FFFFFF"]} delay={0} />
```

## BounceEnter

```tsx
<BounceEnter delay={20}>
  <div style={{ fontSize: 48, fontWeight: 700 }}>
    Parabéns!
  </div>
</BounceEnter>
```

Spring stiffness 300, damping 10, mass 0.5. Cria quique natural (overshoot + settle).

## StampEffect (celebração por aprovação)

```tsx
<StampEffect delay={0}>
  <div style={{
    border: "6px solid #30D158",
    borderRadius: 8,
    padding: "16px 48px",
    color: "#30D158",
    fontSize: 48,
    fontWeight: 800,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  }}>
    APROVADO
  </div>
</StampEffect>
```

Ideal para selos de garantia, confirmações, aprovações.

## Sequência de celebração recomendada

Para cena final de vitória:
```
Frame 0:   ConfettiBurst explode
Frame 10:  BounceEnter com título de vitória
Frame 20:  SlideIn com subtítulo de benefício
Frame 35:  StampEffect com CTA
Frame 50+: ProgressBar ou StarRating como prova social
```

## Timing da cena de celebração

Cena de celebração deve ter pelo menos 150 frames (5s):
- Primeiros 30f: impacto (confetes + bounce)
- F30-90: desenvolve o benefício / resultado
- F90-150: CTA + call to action

Menos de 5s = usuário não processa o momento emocional.
