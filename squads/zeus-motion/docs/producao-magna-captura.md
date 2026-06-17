# Produção: MagnaCaptura

> Composition Remotion para captação de leads via formulário para a Mentoria Magna.
> Arquivo de rastreamento — atualizar a cada versão.

---

## Objetivo

Vídeo motion de alto impacto para trazer leads qualificados via formulário
que se convertem em compradores da Mentoria Magna (ticket alto).

Não é vídeo de venda direta — é vídeo de captação/convite para preencher formulário.
Público: mentores que querem escalar, já conhecem o problema, precisam de autoridade e prova.

---

## Identidade Visual

- Fonte principal: `Montserrat` (display) + `Space Mono` (código/números)
- Paleta: `#08080A` bg, `#E6C15C` gold, `#34D399` teal, `#FF3B30` red accent
- Estilo de movimento: Dark Luxury & Cyber-Premium (BRABO v9.0)
- Estilo de arte: hero 3D blocks, perspective orbit, handheld shake, sweep light, mindmap, clock SVG
- Atmosfera: cinematográfico, premium, urgência controlada
- Narrador: sem narração (timing pré-definido pelo roteiro)
- Sem silencedetect (vídeo 100% visual)

Roteiro: https://gemini.google.com/gem/e47a6069b6d5

---

## Composição

| Campo | Valor |
|-------|-------|
| Resolução | 1080x1920 (vertical) |
| FPS | 30 |
| Duração total | 810 frames = 27.0s |
| Total de cenas | 10 cenas |
| Composição Remotion | `MagnaCaptura` |
| Pasta | `src/compositions/MagnaCaptura/` |

---

## Histórico de Versões

| Versão | Data | Status | Render | O que mudou |
|--------|------|--------|--------|-------------|
| v1 | 2026-05-17 | Draft renderizado | MagnaCaptura-DRAFT-v1.mp4 | Primeira versão — 10 cenas, Dark Luxury, sem narração |

---

## Pipeline

- [x] Etapa 0: roteiro — agente Gemini (10 cenas, Dark Luxury)
- [x] Etapa 1: silencedetect — N/A (sem narração)
- [x] Etapa 2: tabela cena x timing — pré-definido no roteiro
- [x] Etapa 3: calcular SCENE_TIMING — 810f, 7f overlap
- [x] Etapa 4: codar composition — 10 cenas + design-system
- [x] Etapa 5: pre-render-validate.js — APROVADO (0 erros, 5 avisos de margem)
- [x] Etapa 6: render draft — MagnaCaptura-DRAFT-v1.mp4 (3MB, 27s)
- [ ] Etapa 7: assistir draft e ajustar
- [ ] Etapa 8: render full quality
- [ ] Etapa 9: adicionar trilha sonora (opcional)
- [ ] Etapa 10: entrega final

---

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/compositions/MagnaCaptura/index.tsx` | Código principal (versão atual) |
| `src/compositions/MagnaCaptura/_versions/` | Backups FULLSAFE por versão |
| `docs/producao-magna-captura.md` | Este documento |
| `renders/MagnaCaptura-DRAFT-v1.mp4` | Rascunho v1 (quando existir) |
| `renders/MagnaCaptura-FINAL-v1.mp4` | Final v1 com áudio (quando existir) |

---

## Regra de Versionamento

Cada iteração que produz render = nova versão.
Código: FULLSAFE antes de editar (`_versions/index.vN.tsx`).
Render: `MagnaCaptura-FINAL-vN.mp4` onde N = número da versão aprovada.

Nunca apagar versões anteriores.
Se v1 não funcionar → corrigir → v2. Documentar o que mudou na tabela acima.

---

## Erros a Nunca Repetir (resumo do post-mortem AgenteArquiteto)

1. Timing sem silencedetect = iterações de sync. Sempre silencedetect PRIMEIRO.
2. filter:blur() em pai de gradient text = retângulo sólido. Separar camadas.
3. -map 0 no ffmpeg = triplo áudio. Sempre -map 0:v + -map "[out]".
4. EXIT_F sem margem = corte visual. Sempre EXIT_F + 22 <= dur (mínimo +18).
5. Não propagar cascata = cenas fora de sync. Ao mudar dur, atualizar todos os from.

Referência completa: `docs/post-mortem-agente-arquiteto.md`
