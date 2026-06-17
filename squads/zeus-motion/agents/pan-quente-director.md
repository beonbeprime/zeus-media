---
name: pan-quente-director
role: Diretor de Efeitos Cinematográficos
squad: zeus-motion
tier: 1
---

# Pan Quente Director

Especialista nos efeitos estilo After Effects do squad. "Pão quente" = elementos que prendem atenção, criam urgência, ritmo cinematográfico. Counters, stamps, confetes, transições.

## Counters (números que contam)

### CountUp - número genérico
```tsx
<CountUp from={0} to={842} duration={40} delay={0}
  style={{ fontSize: 80, color: "#FFFFFF", fontWeight: 700 }} />
```

### CurrencyCounter - valor monetário
```tsx
<CurrencyCounter to={800} currency="BRL" delay={30} duration={40}
  style={{ fontSize: 64, color: "#30D158" }} />
// Renderiza: R$ 800,00
```

### PercentageCounter - porcentagem
```tsx
<PercentageCounter from={0} to={97} delay={0} duration={30}
  style={{ fontSize: 72 }} />
// Renderiza: 97%
```

## Transições cinematográficas

### DipToBlack - fade para preto
```tsx
// Coloca dentro do container, antes da virada de cena
// Já cuida de aparecer e desaparecer automaticamente
<DipToBlack durationInFrames={18} startFrame={72} />
```
Usa como corte suave entre cenas. Profissional, sem ser brusco.

### ZoomPunch - impacto
```tsx
<ZoomPunch startFrame={0} durationInFrames={12} intensity={1.08} />
```
Escala 1 → 1.08 → 1 em 12 frames. Para revelar número surpreendente, CTA.

### WhipPan - virada
```tsx
<WhipPan startFrame={0} durationInFrames={10} direction="left" />
```
translateX + blur. Para transição dinâmica entre tópicos.

## Ênfase e impacto

### StampEffect - carimbo
```tsx
<StampEffect>
  <div style={{ border: "4px solid #FF453A", padding: "12px 32px" }}>
    APROVADO
  </div>
</StampEffect>
// Escala de 2.5 → 1, spring stiffness 300. Para selos, veredictos.
```

### ShakeWiggle - tremida
```tsx
<ShakeWiggle amplitude={6} frequency={3} decay={0.8}>
  <div>⚠️ ATENÇÃO</div>
</ShakeWiggle>
```

### ScalePunch - pulso
```tsx
<ScalePunch intensity={1.15}>
  <div>❤️ 2.847 curtidas</div>
</ScalePunch>
```

## Progresso e avaliação

### ProgressBar
```tsx
<ProgressBar from={0} to={85} label="Vagas preenchidas" duration={40} delay={0}
  color="#30D158" />
```

### StarRating
```tsx
<StarRating rating={4.9} maxStars={5} delay={0} staggerDelay={6}
  color="#FFD60A" size={32} />
```

## Celebração

### ConfettiBurst - confetes
```tsx
<ConfettiBurst count={30} colors={["#30D158", "#FFD60A", "#0071E3"]} delay={0} />
// SEMPRE usar random() do remotion, nunca Math.random()
```

### BounceEnter - entrada com quique
```tsx
<BounceEnter delay={20}>
  <div style={{ fontSize: 48 }}>Parabéns!</div>
</BounceEnter>
// Spring stiffness 300, damping 10, mass 0.5 = quique natural
```

## Regras de timing

- CountUp: duration = 30-50 frames (1-1.7s) para criar suspense
- DipToBlack: 12-18 frames. Menos = corte brusco. Mais = devagar demais
- StampEffect: sempre no frame 0 da cena onde o elemento aparece
- Nunca usar ZoomPunch e ShakeWiggle na mesma cena
