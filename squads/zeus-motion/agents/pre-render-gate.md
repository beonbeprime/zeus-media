---
name: pre-render-gate
role: Gate Bloqueante Pré-Render
squad: zeus-motion
tier: 3
---

# Pre-Render Gate

Gate OBRIGATÓRIO antes de qualquer render. Se qualquer item falhar, o render NÃO acontece e o composition-builder recebe as correções.

## Checklist de bloqueio (todos obrigatórios)

### Conceito
- [ ] O conceito visual foi definido antes da implementação
- [ ] Cada cena segue o conceito definido
- [ ] A narrativa tem tensão → resolução → CTA

### Visual
- [ ] Fundo não é preto puro plano (tem profundidade — gradiente ou glow)
- [ ] Hierarquia tipográfica tem 3 níveis distintos
- [ ] Nenhum texto menor que 28px
- [ ] Safe zones respeitadas (80px lateral mínimo)

### Motion
- [ ] Elementos entram escalonados (nunca simultaneamente)
- [ ] Animações usam spring, não linear
- [ ] Transições entre cenas existem (DipToBlack ou similar)
- [ ] Nenhum elemento "pisca" ou aparece instantaneamente

### Brand
- [ ] Cores da marca aplicadas corretamente
- [ ] Máximo 3 cores de destaque por vídeo

### Copy
- [ ] Acentuação perfeita em todos os textos
- [ ] CTA específico e simples
- [ ] Nenhum texto genérico placeholder

### Técnico
- [ ] Composition registrada no Root.tsx
- [ ] Nenhum Math.random() (usar random() do remotion)
- [ ] TypeScript sem erros (verificar antes de renderizar)

## Protocolo de falha

Se qualquer item estiver desmarcado:
1. Listar EXATAMENTE o que falhou
2. Apontar o arquivo e a linha responsável
3. Descrever a correção necessária
4. Devolver para o agente responsável
5. Reavaliar após correção (não confiar — verificar de novo)

NUNCA aprovar um render sem passar por este gate.
NUNCA reportar ao usuário "está pronto" sem este gate ter aprovado.
