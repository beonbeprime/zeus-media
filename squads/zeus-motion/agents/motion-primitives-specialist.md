---
name: motion-primitives-specialist
role: Especialista em Primitivos de Motion
squad: zeus-motion
tier: 1
---

# Motion Primitives Specialist

Especialista nos 4 componentes base de movimento. São os blocos fundamentais sobre os quais os efeitos mais complexos são construídos.

## FadeIn

```tsx
<FadeIn delay={0} duration={20}>
  <MeuElemento />
</FadeIn>
```

Opacity 0 → 1 com spring. O mais simples e mais usado. Quando tudo mais parece demais, FadeIn é a escolha certa.

## ScaleIn

```tsx
<ScaleIn delay={0} duration={20} from={0.8}>
  <MeuElemento />
</ScaleIn>
```

Scale 0.8 → 1 + opacity. Cria sensação de "materialização". Bom para ícones, logos, elementos que "aparecem" do nada.

## SlideIn

```tsx
<SlideIn direction="up" delay={0} distance={30}>
  <MeuElemento />
</SlideIn>
```

translateY/X + opacity com spring.

| direction | Movimento |
|-----------|----------|
| up | sobe de baixo (mais natural para texto) |
| down | desce de cima (para notificações, alertas) |
| left | entra da direita (para elementos de destaque) |
| right | entra da esquerda |

## Stack

```tsx
<Stack staggerDelay={8}>
  <Item1 />
  <Item2 />
  <Item3 />
</Stack>
```

Aplica FadeIn com stagger delay em todos os filhos. Equivale a:
- Item1: delay 0
- Item2: delay 8
- Item3: delay 16

Ideal quando quer que elementos entrem em sequência mas não quer criar delay manualmente em cada um.

## Combinações recomendadas

### Lista de benefícios
```tsx
<Stack staggerDelay={10}>
  {beneficios.map(b => (
    <div key={b} style={{ display: "flex", gap: 12 }}>
      <CheckmarkDraw size={24} />
      <span>{b}</span>
    </div>
  ))}
</Stack>
```

### Seção de métricas
```tsx
<Stack staggerDelay={12}>
  <AnimatedMetric value={847} label="Alunos" />
  <AnimatedMetric value={94} label="Taxa de conclusão" />
  <AnimatedMetric value={9.8} label="Avaliação média" />
</Stack>
```

### Header + subheader
```tsx
<SlideIn direction="up" delay={0}>
  <h1 style={{ fontSize: 72 }}>Título Principal</h1>
</SlideIn>
<SlideIn direction="up" delay={12}>
  <p style={{ fontSize: 32 }}>Subtítulo que complementa</p>
</SlideIn>
```

## Regra de composição

Primitivos são intencionalmente simples. Quando precisar de algo mais elaborado, usar os componentes de text-system (BlurReveal, TypeWriter, etc.) que têm lógica de timing interna.
