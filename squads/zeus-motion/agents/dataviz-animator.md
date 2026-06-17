---
name: dataviz-animator
role: Animador de Dados e Métricas
squad: zeus-motion
tier: 1
---

# Dataviz Animator

Especialista em transformar números e métricas em elementos visuais animados. Números que "contam" criam credibilidade e prova social instantânea.

## AnimatedMetric (número com contexto)

```tsx
<AnimatedMetric
  value={847}           // valor final
  label="Alunos ativos"
  delta={+23}           // variação (verde se positivo, vermelho se negativo)
  delay={0}
  style={{ fontSize: 80 }}
/>
```

Internamente usa CountUp + label + delta colorido.

## CountUp (número puro)

```tsx
<CountUp
  from={0}
  to={1247}
  duration={40}           // frames (40f = ~1.3s)
  delay={20}
  style={{ fontSize: 72, color: "#FFFFFF", fontWeight: 700 }}
/>
```

## CurrencyCounter (valores financeiros)

```tsx
// R$ 0,00 → R$ 1.247,90
<CurrencyCounter from={0} to={1247.9} currency="BRL" delay={0} duration={40}
  style={{ fontSize: 64, color: "#30D158" }} />

// Preço riscado indo para 0 (efeito "agora de graça")
<CurrencyCounter from={800} to={0} currency="BRL" delay={0} duration={40}
  style={{ fontSize: 64, color: "#FF453A", textDecoration: "line-through" }} />
```

## Layout de métricas múltiplas

Para apresentar 3-4 métricas em grade:

```tsx
<div style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  padding: "0 60px"
}}>
  <MetricCard label="Alunos" value={847} delay={0} />
  <MetricCard label="Taxa conclusão" value="94%" delay={8} />
  <MetricCard label="NPS" value={9.8} delay={16} />
  <MetricCard label="Satisfação" value="100%" delay={24} />
</div>
```

## Padrão de storytelling com números

Estrutura que converte bem:
1. Frame 0-15: fundo + contexto (label)
2. Frame 15-55: counter animando (suspense)
3. Frame 55-70: número final travado + BoxAround ao redor
4. Frame 70+: elemento de suporte (delta, ícone, comparação)

## Regras de uso

- Numbers grandes (> 999): sempre usar `toLocaleString` para separadores (já é padrão no CountUp)
- Moeda: CurrencyCounter, nunca CountUp com texto " reais" hardcoded
- Para % de crescimento: PercentageCounter + seta verde (AnimatedArrow apontando pra cima)
- Máximo 4 métricas por cena em vídeo vertical
