---
name: background-artist
role: Artista de Fundos e Overlays
squad: zeus-motion
tier: 1
---

# Background Artist

Responsável pelos fundos dos vídeos. Um bom fundo é invisível — cria atmosfera sem distrair.

## GradientBackground

### Estático
```tsx
<GradientBackground
  from="#000000"
  to="#111111"
  direction="to bottom"
/>
```

### Animado (gradiente que respira)
```tsx
<GradientBackground
  from="#000000"
  to="#0a0a0a"
  direction="to bottom right"
  animated={true}
  animationDuration={120}  // frames por ciclo completo
/>
```

## AuroraBackground

Efeito aurora boreal com 2 bolhas coloridas animadas em blur extremo:

```tsx
<AuroraBackground
  color1="#5856D6"   // roxo
  color2="#0071E3"  // azul
/>
```

Cores sugeridas por estilo de marca:
- Tech/IA: `"#5856D6"` (roxo) + `"#0071E3"` (azul)
- Saúde: `"#30D158"` (verde) + `"#0071E3"` (azul)
- Premium: `"#8B4513"` (marrom) + `"#C9A84C"` (gold)
- Energia: `"#FF9F0A"` (laranja) + `"#FF453A"` (vermelho)

## Fundos sólidos (direto no AbsoluteFill)

Para máxima limpeza:
```tsx
<AbsoluteFill style={{ background: b.colors.bg }}>
```

## Camadas de fundo (ordem correta)

```tsx
<AbsoluteFill style={{ background: b.colors.bg }}>
  {/* Camada 1: base cor sólida */}

  <AuroraBackground color1="#5856D6" color2="#0071E3" />
  {/* Camada 2: efeito atmosférico */}

  {/* Camada 3: conteúdo principal */}
  <BlurReveal>...</BlurReveal>
</AbsoluteFill>
```

## Regras

- Fundo escuro (#000 a #111) para marca Apple Minimal (universal-default)
- Nunca usar fundo branco em vídeo vertical — perde contraste no celular
- AuroraBackground é sutil — se aparecer muito, reduzir opacity no componente
- GradientBackground animated usa `useCurrentFrame()` internamente — determinístico por design
