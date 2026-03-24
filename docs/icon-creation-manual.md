# Manual de Criacao de Icones - Zeus Media

## Introducao

Este manual define as regras para criar novos icones que sejam consistentes
com a biblioteca existente da sua marca.

---

## Grid

Todos os icones seguem um grid padrao:

- Tamanho base: 24x24px
- Area segura: 2px de margem em cada lado (area util: 20x20px)
- Tamanhos de exportacao: 24x24, 32x32, 48x48, 64x64, 80x80

## Peso do Traco

O peso do traco DEVE ser consistente em toda a biblioteca:

| Estilo | Peso do traco |
|--------|--------------|
| Line art | 1.5px |
| Outline bold | 2.5px |
| Solid | preenchimento total |
| Duotone | 2px (cor primaria) + preenchimento parcial (cor secundaria com opacity) |

## Cantos

Definido no onboarding:
- Arredondados: border-radius proporcional ao tamanho
- Retos: sem border-radius, angulos vivos

## Cores

Icones usam APENAS cores da paleta configurada:
- Cor principal: var(--g2) para o traco/preenchimento
- Cor accent: var(--g-accent) para detalhes secundarios
- Em fundo claro: usar var(--txt-dark)

## Estrutura SVG

```xml
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">
  <!-- paths do icone -->
</svg>
```

Para icones solid:
```xml
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     fill="currentColor">
  <!-- paths do icone -->
</svg>
```

## Nomenclatura

Formato: `icon-{numero}-{nome}.svg`
Exemplo: `icon-001-rocket.svg`, `icon-042-chart.svg`

## Categorias Obrigatorias

Manter pelo menos 10 icones por categoria:
1. Pessoas
2. Comunicacao
3. Acao
4. Valor
5. Processo
6. Tempo
7. Conteudo
8. Seguranca
9. Alerta
10. Dados

## Testes

Antes de adicionar um icone a biblioteca:
- Testar em fundo escuro E fundo claro
- Testar em 24px (menor) e 80px (maior)
- Verificar que e reconhecivel em todos os tamanhos
- Verificar consistencia de peso com os demais icones
