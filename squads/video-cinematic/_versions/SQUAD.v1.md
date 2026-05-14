# CINEMATIC FORGE — Squad de Video com IA

## Missao

Criar videos profissionais automatizados a partir de um input simples (texto ou audio).
Pipeline completo: pesquisa → roteiro → cenas → imagens → movimento → montagem → entrega.

Visual DNA: elegante, marcante, deluxe. Identidade Magna quando aplicavel.
Copy: sempre via CopyKiller, ajustado ao objetivo (comercial, educativo, instrucional).

---

## Parametros Obrigatorios (perguntar no inicio)

### Formato
| Opcao | Resolucao | Uso |
|-------|-----------|-----|
| VERTICAL | 1080x1920 (9:16) | Reels, TikTok, Stories |
| HORIZONTAL | 1920x1080 (16:9) | YouTube, LinkedIn |
| QUADRADO | 1080x1080 (1:1) | Feed Instagram |

### Nivel de Qualidade
| Nivel | Nome | Pipeline | Custo | Tempo |
|-------|------|----------|-------|-------|
| N1 | VELOZ | edge-tts + Pexels stock + Ken Burns basico | $0 | 2 min |
| N2 | PADRAO | ElevenLabs + Pexels stock + Ken Burns | ~$0.20 | 3 min |
| N3 | PREMIUM | ElevenLabs + Nano Banana + Ken Burns + legendas | ~$0.80 | 5 min |
| N4 | CINEMATOGRAFICO | ElevenLabs + Nano Banana + Kling motion + legendas animadas | ~$3 | 10 min |
| N5 | MAGNA DELUXE | ElevenLabs premium + Nano Banana + Kling + identidade Magna + color grading | ~$8 | 15 min |

### Tom / Objetivo
- COMERCIAL: CopyKiller direto, linguagem de conversao
- EDUCATIVO: CopyKiller + tom instrucional, mais suave, valor primeiro
- INSTRUCIONAL: passo a passo, objetivo, didatico

---

## Agentes

| Agente | Persona | Papel |
|--------|---------|-------|
| `@cinematic-intake` | Iris | Entrada: coleta formato, nivel, tema, objetivo |
| `@cinematic-researcher` | Scout | Pesquisa o tema, extrai dados, insights e provas |
| `@cinematic-scriptwriter` | Pen | Cria roteiro via CopyKiller, ajusta tom ao objetivo |
| `@cinematic-scene-director` | Frame | Divide roteiro em cenas, define duracao, visual e texto de cada cena |
| `@cinematic-image-gen` | Lens | Gera imagens via Nano Banana com prompts cinematograficos |
| `@cinematic-motion-maker` | Drift | Aplica movimento: Ken Burns (N1-N3) ou Kling AI (N4-N5) |
| `@cinematic-assembler` | Cut | Monta tudo: audio + video + legendas + transicoes + entrega |

---

## Pipeline por Nivel

### N1 VELOZ
```
Input → @cinematic-intake → @cinematic-scriptwriter (sem pesquisa)
→ @cinematic-scene-director → Pexels API (stock gratis)
→ FFmpeg Ken Burns basico → edge-tts (voz gratis)
→ @cinematic-assembler → MP4 final
```

### N2 PADRAO
```
Input → @cinematic-intake → @cinematic-researcher (busca rapida)
→ @cinematic-scriptwriter → @cinematic-scene-director
→ Pexels API stock → FFmpeg Ken Burns
→ ElevenLabs voz → @cinematic-assembler → MP4 final
```

### N3 PREMIUM
```
Input → @cinematic-intake → @cinematic-researcher (busca completa)
→ @cinematic-scriptwriter → @cinematic-scene-director
→ @cinematic-image-gen (Nano Banana, 1 imagem por cena)
→ FFmpeg Ken Burns avancado + legendas animadas
→ ElevenLabs voz → @cinematic-assembler → MP4 final
```

### N4 CINEMATOGRAFICO
```
Input → @cinematic-intake → @cinematic-researcher (deep)
→ @cinematic-scriptwriter → @cinematic-scene-director
→ @cinematic-image-gen (Nano Banana, todas as cenas)
→ @cinematic-motion-maker (Kling: imagem → video animado)
→ FFmpeg profissional + legendas animadas estilo Reels
→ ElevenLabs voz premium → @cinematic-assembler → MP4 final
```

### N5 MAGNA DELUXE
```
Input → @cinematic-intake → @cinematic-researcher (deep research)
→ @cinematic-scriptwriter (CopyKiller full) → @cinematic-scene-director
→ @cinematic-image-gen (Nano Banana premium, composicao Magna)
→ @cinematic-motion-maker (Kling cinematografico)
→ FFmpeg com color grading + intro/outro Magna + legendas premium
→ ElevenLabs voz curada → @cinematic-assembler → MP4 final
Entrega: MP4 + OGG para WhatsApp + legenda SRT
```

---

## Visual DNA Magna (N5 obrigatorio, N4 recomendado)

- Fundo: dark profundo com tint da cor principal
- Tipografia: elegante, spacing generoso, sem poluicao
- Paleta: monocromatica com accent dourado ou rosegold conforme tema
- Legendas: fonte premium, animadas, cor em destaque para palavras-chave
- Transicoes: suaves, cinematograficas, sem flash ou cortes bruscos
- Ritmo: alinhado com a voz, corte no beat quando houver musica

---

## Integracao CopyKiller

O @cinematic-scriptwriter SEMPRE gera o roteiro via CopyKiller.
Ajuste de tom conforme objetivo:
- COMERCIAL: manter gancho agressivo, urgencia, prova social
- EDUCATIVO: suavizar CTA, priorizar valor, manter gancho
- INSTRUCIONAL: retirar CTA de venda, substituir por CTA de acao pratica

---

## Entrega Final

O @cinematic-assembler entrega:
- MP4 no formato solicitado
- Versao OGG (para WhatsApp como audio de voz) se solicitado
- Arquivo SRT de legenda se N4+
- Relatorio: duracao, cenas, custo estimado da geracao

---

## Ativacao

Comando: `@cinematic-forge` ou `@video-cinematic`
Trigger keywords: video com ia, criar video, video profissional, cinematic forge, video automatico
Peso minimo para ativacao automatica: 50
