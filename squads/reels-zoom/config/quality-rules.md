# REELS ZOOM - Regras de Qualidade (PADRAO MAGNA COMPLETO)

## STATUS: GATE OBRIGATORIO - Nenhum video sai sem passar por aqui

Estas regras existem porque TODOS os erros listados em errors-learned.md ja aconteceram.
Cada regra corresponde a um erro real. Seguir na ordem.

---

## BLOCO 1: VIDEO BASE (reenquadramento)

| # | Regra | Verificacao |
|---|-------|-------------|
| 1 | JAMAIS distorcer | scale usa `-2`, |fator_x - fator_y| < 0.01 |
| 2 | Zero bordas cinza | Scan brilho antes do crop, crop justo no conteudo real |
| 3 | Zero flash preto | setpts=PTS-STARTPTS em todo segmento |
| 4 | Cortes em silencios | Waveform RMS 25ms, cortar onde RMS < percentil 25 |
| 5 | Rostos centralizados | face-centering-qa, deslocamento < 10px |
| 6 | Pasta organizada | 01-bruto/ 02-analise/ 03-brolls/ 04-renders/ 05-final/ |

## BLOCO 2: EDIT-PROJECT.JSON (conteudo)

| # | Regra | Verificacao |
|---|-------|-------------|
| 7 | Captions CONTINUAS | TODA palavra falada tem caption (1-3 palavras cada) |
| 8 | Captions com highlight | Palavras chave marcadas com highlightWord |
| 9 | B-rolls com icones | Todo brollMoment conceitual tem iconId |
| 10 | B-rolls com layout rotativo | forceStyle e forceAnim diferentes (nunca 2 iguais seguidos) |
| 11 | Schemas visuais | Minimo 1 schema por 15s (path, funnel, checklist, comparison) |
| 12 | Hook definido | Primeiro B-roll = hook com frase de impacto |
| 13 | Tela final | Ultimos 3s: foto Allysson + @fabricadementores |

## BLOCO 3: PADRAO VISUAL MAGNA

| # | Regra | Verificacao |
|---|-------|-------------|
| 14 | Renderizar via Remotion | SEMPRE MagnaEditV2, NUNCA PIL/componente custom |
| 15 | Cores do magna-theme.ts | M.rg1, M.rg2, M.rg3, M.txt, M.bg (rosegold original) |
| 16 | Fontes oficiais | Cormorant Garamond (display) + DM Sans (body) via @remotion/google-fonts |
| 17 | Icones Magna Deluxe | stroke 0.45, square linecap, miter linejoin, gradiente rosegold |
| 18 | Icones animados | Cada icone se movimenta conforme natureza (gear gira, heart pulsa, etc.) |
| 19 | Grain overlay | Ativo em todo B-roll, opacity 0.4 |
| 20 | Spring animations | damping 14, stiffness 55, rotacao de 6 estilos de animacao |

## BLOCO 4: FECHAMENTO DO REELS

| # | Regra | Verificacao |
|---|-------|-------------|
| 21 | Foto profissional | Foto do Allysson nos ultimos 2-3s |
| 22 | Handle Instagram | @fabricadementores visivel |
| 23 | Sem botao "toque" | Reels NAO tem CTA de botao, so foto + handle |

---

## FLUXO OBRIGATORIO PARA CADA REELS

```
1. Criar pasta estruturada (01-05)
2. Copiar video original para 01-bruto/
3. Transcrever com Whisper (timestamps por palavra)
4. Analisar waveform (silencios, blocos de fala)
5. Classificar frases (peso, tipo, gancho)
6. Extrair gancho (3 opcoes, usuario escolhe)
7. Montar narrativa (cortes em silencios, sem repeticao)
8. Detectar rostos + scan de brilho (sem bordas)
9. Reenquadrar (scale=-2, face-centering-qa)
10. Criar edit-project.json COMPLETO:
    - Captions: TODA palavra
    - B-rolls: 4-6 com icones
    - Schemas: minimo 1 por 15s
    - Hook: primeiro B-roll
    - Fechamento: foto + @fabricadementores
11. Copiar base para public/video/source.mp4
12. Renderizar via MagnaEditV2
13. Verificar: frames nos B-rolls, legendas, final
14. Copiar para 05-final/
15. Restaurar edit-project.json original
```

---

## REFERENCIA: edit-project.json do verde-lugar-legal

O verde-lugar-legal e o PADRAO OURO. Quando montar o edit-project de qualquer reels:
- Copiar a ESTRUTURA do verde (nao o conteudo)
- 7 brollMoments com iconId
- 58 captions para 45s de video (~1.3 captions por segundo)
- 3 schemas (path, funnel, checklist)
- Legendas cobrindo 100% da fala
- Cada broll com forceStyle e forceAnim diferentes

Arquivo de referencia: `magna-video-editor/src/data/edit-project-verde-backup.json`
