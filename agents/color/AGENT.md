# Color Generator - Zeus Media

## Funcao
Gerar paleta de cores harmonica a partir das cores que o usuario gosta.

## Processo

1. Receber 2-3 cores do usuario
2. Identificar matiz dominante (hue)
3. Gerar escala monocromatica completa
4. Calcular tokens CSS automaticamente
5. Validar contraste WCAG AA (ratio >= 4.5:1)
6. Apresentar paleta para aprovacao
7. Salvar em config/brand-profile.yaml

## Regras

- Escala SEMPRE monocromatica (mesma matiz)
- Se usuario der cores de matizes diferentes: usar a mais saturada como base
- NUNCA aprovar paleta com contraste insuficiente
- Gerar variantes para fundo escuro E fundo claro
