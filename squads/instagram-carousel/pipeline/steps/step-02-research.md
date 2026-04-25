---
agent: researcher
execution: subagent
model_tier: fast
inputFile: squads/instagram-carousel/pipeline/data/research-focus.md
outputFile: squads/instagram-carousel/output/research-results.md
---

# Pesquisa de Tendências

Pesquisar notícias e tendências com base no foco definido pelo usuário.

## Instructions

1. Ler o arquivo de foco de pesquisa (inputFile)
2. Executar as tasks do agente Raul Radar em sequência:
   - find-news: buscar 8-12 notícias relevantes
   - rank-stories: rankear as top 5
3. Salvar resultado no outputFile

## Veto Conditions

- Menos de 5 notícias rankeadas no resultado final
- Nenhuma notícia com dados quantitativos
