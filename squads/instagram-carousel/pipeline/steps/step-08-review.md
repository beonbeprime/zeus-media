---
agent: reviewer
execution: inline
inputFile: squads/instagram-carousel/output/carousel-draft.md
outputFile: squads/instagram-carousel/output/review-result.md
on_reject: create-carousel
---

# Revisão de Qualidade

Vera Veredito vai avaliar o carrossel contra critérios objetivos.

## Instructions

1. Ler o carrossel completo do inputFile
2. Executar as tasks da agente em sequência:
   - score-content: pontuar 10 critérios de 1 a 5
   - generate-feedback: emitir veredito APPROVE/REJECT com feedback
3. Apresentar scorecard completo ao usuário
4. Salvar no outputFile

Se REJECT: o pipeline volta para o step create-carousel (on_reject).
Se APPROVE: segue para aprovação final.

## Veto Conditions

- Scorecard incompleto (menos de 10 critérios)
- Veredito ambíguo
