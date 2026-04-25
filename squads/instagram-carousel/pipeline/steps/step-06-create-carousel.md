---
agent: creator
execution: inline
format: instagram-feed
outputFile: squads/instagram-carousel/output/carousel-draft.md
---

# Criar Carrossel

Carlos Carrossel vai criar o carrossel completo com o ângulo selecionado.

## Instructions

1. Ler o ângulo selecionado pelo usuário
2. Executar as tasks do agente em sequência:
   - create-carousel: criar carrossel com 8-10 slides + legenda + hashtags
   - optimize-carousel: otimizar engajamento, copy e ortografia
3. Apresentar o carrossel completo ao usuário
4. Salvar no outputFile

## Veto Conditions

- Algum slide com menos de 40 ou mais de 80 palavras
- Legenda sem hook nos primeiros 125 caracteres
- CTA genérico no último slide
