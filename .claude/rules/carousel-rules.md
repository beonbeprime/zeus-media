# Regras de Carrossel - Zeus Media

## STATUS: SEMPRE ATIVO em qualquer criacao de carrossel

## Safe Zone (margem de seguranca)

Instagram pode cortar bordas. Conteudo importante DENTRO da zona segura:

| Formato | Margem topo/base | Margem lateral |
|---------|-----------------|----------------|
| 1080x1350 (4:5) | 200px | 80px |
| 1080x1080 (1:1) | 150px | 80px |
| 1080x1920 (9:16) | 250px | 80px |

## Estrutura Padrao de Slides

Slide 1 (Capa):
- Gancho forte (frase que para o scroll)
- Icone principal (da biblioteca da pessoa)
- Label/tag do tema
- Fundo escuro com grain overlay

Slides 2-8 (Conteudo):
- 1 ideia por slide
- Headline curto
- Texto de apoio (max 3 linhas)
- Icone tematico
- Numeracao discreta (opcional)

Slide Final (CTA):
- Chamada para acao clara
- Foto da pessoa em circulo
- @ do Instagram
- "Salve este post" ou acao especifica

## Elementos Visuais Obrigatorios

1. Grain overlay (textura sutil, opacity 0.3-0.5)
2. Icone por slide (da biblioteca configurada)
3. Hierarquia tipografica (headline > corpo > detalhe)
4. Dots de navegacao discretos (indicam slide atual)
5. Consistencia de cores em TODOS os slides

## Rotacao de Icones

- NUNCA repetir o icone da capa em 2 carrosseis seguidos
- Max 2 icones iguais entre carrosseis consecutivos
- Registrar icones usados em config/icon-registry.md

## CSS Base do Carrossel

```css
.slide {
  width: 1080px;
  height: 1350px;
  background: var(--bg);
  padding: 200px 80px;
  position: relative;
  overflow: hidden;
  font-family: var(--font-body);
}

.slide::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}

.slide-headline {
  font-family: var(--font-main);
  font-size: 64px;
  line-height: 1.1;
  color: var(--txt-light);
}

.slide-body {
  font-size: 28px;
  line-height: 1.5;
  color: var(--txt-muted);
}

.slide-icon {
  width: 80px;
  height: 80px;
  color: var(--g2);
}

.grad {
  background: linear-gradient(135deg, var(--g2), var(--g-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slide-dots {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--txt-muted);
  opacity: 0.3;
}

.dot.active {
  background: var(--g2);
  opacity: 1;
}
```

## Copy dos Slides

Ganchos para capa (adaptar ao tom da pessoa):
- Pergunta provocativa
- Numero + beneficio
- Contraste (antes/depois)
- Afirmacao ousada
- "O que ninguem te conta sobre..."

CTA final (adaptar ao objetivo):
- Vender: "Link na bio" / "Arrasta pra cima"
- Autoridade: "Salve para consultar depois"
- Comunidade: "Marca alguem que precisa ver isso"
- Educar: "Compartilha com quem precisa aprender isso"
