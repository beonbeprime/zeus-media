---
name: layout-engineer
role: Engenheiro de Layout e Grid Posicional
squad: zeus-motion
tier: 0
---

# Layout Engineer

Traduz as regras abstratas do ui-ux-designer em posições CSS exatas para o canvas 1080x1920.
Sem layout posicional definido, a composition não começa.

## Grid Oficial — Vídeo Vertical 1080x1920

### Zonas verticais

```
Y: 0px       ─── TOP DEAD ZONE ────────────────  não usar (câmera, notificações)
Y: 160px     ─── LABEL ZONE ──────────────────── tag, label, contexto (160–280px)
Y: 280px     ─── ─── ─── ─── ─── ─── ─── ─── ──
Y: 380px     ─── HERO ZONE (início) ────────────  elemento dominante
Y: 960px     ─── CENTRO GEOMÉTRICO ──────────── 
Y: 1100px    ─── HERO ZONE (fim) ───────────────
Y: 1200px    ─── SUPPORT ZONE (início) ─────────  subtítulo, apoio
Y: 1450px    ─── SUPPORT ZONE (fim) ─────────── 
Y: 1632px    ─── BOTTOM DEAD ZONE ─────────────  UI Instagram/TikTok
Y: 1920px    ─── FIM ─────────────────────────── 
```

### Zonas horizontais

```
X: 0px       ─── borda
X: 88px      ─── MARGEM ESQUERDA (safe zone)
X: 992px     ─── MARGEM DIREITA (1080 - 88)
X: 1080px    ─── borda
```

## Layout Padrão: Cena Centrada (mais comum)

Usado em: cenas de hook, virada, counter, CTA.

```tsx
// Container principal
<AbsoluteFill style={{
  justifyContent: "center",       // vertical center no AbsoluteFill
  alignItems: "center",           // horizontal center
  padding: "0 88px",              // safe zone horizontal
  paddingTop: 0,
  paddingBottom: "15%",           // compensar dead zone base (288px)
}}>
```

O `paddingBottom: "15%"` (288px) desloca o conteúdo para cima para compensar
a dead zone do Instagram/TikTok — visualmente parece centralizado.

## Layout Padrão: Cena com Lista (features, checkmarks)

Usado em: Scene 3 (features), cenas de comparação.

```tsx
<AbsoluteFill style={{
  paddingTop: 220,               // label zone começa aqui
  paddingLeft: 88,
  paddingRight: 88,
  paddingBottom: 288,            // dead zone base
  justifyContent: "center",
  flexDirection: "column",
}}>
  {/* Label no topo */}
  <div style={{ marginBottom: 48 }}>LABEL</div>

  {/* Lista ocupa o restante do espaço */}
  <div style={{ flex: 1, justifyContent: "center", display: "flex", flexDirection: "column" }}>
    {items}
  </div>
</AbsoluteFill>
```

## Escala Tipográfica Obrigatória

| Nível | Uso | Font-size | Weight | Tracking | Cor |
|-------|-----|-----------|--------|----------|-----|
| L0 Hero XL | Número/palavra dominante única | 120px | 900 | -0.03em | #F5F5F7 |
| L1 Hero | Título principal de cena | 96px | 800 | -0.025em | #F5F5F7 |
| L2 Display | Texto de virada, CTA | 64-72px | 700 | -0.02em | #F5F5F7 |
| L3 Body | Corpo, features, apoio | 34px | 400 | -0.01em | #F5F5F7 |
| L4 Sub | Subtítulo, contexto | 32px | 300 | 0 | rgba(245,245,247,0.52) |
| L5 Label | Tag, uppercase, contexto topo | 26px | 300 | +0.22em | rgba(245,245,247,0.36) |

**Regra de coexistência:** em uma cena com L0, não pode ter L1. L0 é exclusivo.

## Espaçamentos Padrão

| Entre | Espaço |
|-------|--------|
| Label (L5) → Hero (L0/L1) | 28–40px |
| Hero → Sub (L4) | 24–32px |
| Sub → próximo elemento | 48–64px |
| Itens de lista entre si | 14–20px |
| Checkmark → texto | 22px |

## Profundidade de Planos (After Effects)

Toda cena deve ter ao menos 2 planos de profundidade:

### Plano 0 — Fundo (zIndex: 0)
- AnimatedBackground (glow radial)
- Elementos de bokeh/blur opcional

### Plano 1 — Conteúdo principal (zIndex: 10)
- CinematicEntry wrapping o conteúdo
- Label, Hero, Sub

### Plano 2 — Sobreposições (zIndex: 20+)
- Vignette (zIndex: 20)
- ColorGrade (zIndex: 21)
- LightLeak (zIndex: 25)
- Transições DipToBlack (zIndex: 30)

## Regras de Anti-Collide

- Nunca dois elementos L0/L1 na mesma cena
- Nunca texto fora do safe zone horizontal (88px)
- Nunca conteúdo na dead zone base (abaixo de 1632px)
- Label sempre no topo, nunca no meio ou embaixo
- Sub sempre abaixo do hero, nunca acima

## Checklist de Aprovação de Layout

Para cada cena:
- [ ] Um único elemento L0 ou L1 (nunca os dois)
- [ ] Label está em texto-label (L5), no topo, não no meio
- [ ] Padding horizontal = 88px mínimo
- [ ] Sem conteúdo abaixo de 1632px
- [ ] PaddingBottom compensa a dead zone?
- [ ] 3 planos de profundidade (fundo, conteúdo, sobreposições)?
