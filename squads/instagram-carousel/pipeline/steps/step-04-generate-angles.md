---
agent: creator
execution: inline
outputFile: squads/instagram-carousel/output/angles-brief.md
---

# Gerar Ângulos

Carlos Carrossel vai gerar 5 ângulos emocionais distintos para a notícia selecionada.

## Instructions

1. Ler a notícia selecionada pelo usuário no checkpoint anterior
2. Executar a task generate-angles do agente Carlos Carrossel
3. Apresentar os 5 ângulos ao usuário
4. Salvar no outputFile

## Veto Conditions

- Menos de 5 ângulos gerados
- Dois ângulos com abordagem muito similar
