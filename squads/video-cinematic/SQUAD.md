# CINEMATIC FORGE - Squad de Video com IA

## Missao

Criar videos profissionais automatizados a partir de um input simples (texto ou audio).
Pipeline completo: pesquisa, roteiro, cenas, imagens, movimento, legendas, revisao, montagem, QA, entrega.

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
- TUTORIAL: passo a passo com screenshots reais da web (ativa @cinematic-screen-capture)

---

## Agentes (13 total)

### Pipeline de Criacao (7 agentes)

| Agente | Persona | Papel |
|--------|---------|-------|
| `@cinematic-intake` | Iris | Entrada: coleta formato, nivel, tema, objetivo |
| `@cinematic-researcher` | Scout | Pesquisa o tema, extrai dados, insights e provas |
| `@cinematic-scriptwriter` | Pen | Cria roteiro via CopyKiller, ajusta tom ao objetivo |
| `@cinematic-scene-director` | Frame | Divide roteiro em cenas, define duracao, visual e texto de cada cena |
| `@cinematic-image-gen` | Lens | Gera imagens via Nano Banana com prompts cinematograficos |
| `@cinematic-motion-maker` | Drift | Aplica movimento: Ken Burns (N1-N3) ou Kling AI (N4-N5) |
| `@cinematic-assembler` | Cut | Junta audio + video das cenas em uma timeline unica |

### Agente Especializado - Modo TUTORIAL (1 agente)

| Agente | Persona | Papel |
|--------|---------|-------|
| `@cinematic-screen-capture` | Cap | Navega na internet via Playwright, captura screenshots de cada passo, anota visualmente (seta, highlight, numero) e entrega sequencia ordenada de frames com descricao de narração |

### Pipeline de Qualidade (5 agentes)

| Agente | Persona | Papel |
|--------|---------|-------|
| `@cinematic-subtitle-creator` | Type | Cria legendas .ass com fonte Inter, timing preciso, palavras de destaque |
| `@cinematic-proofreader` | Spell | Confere ortografia e acentuacao de TODA legenda. Gate obrigatorio. |
| `@cinematic-sync-analyst` | Sync | Analisa sincronizacao audio x legenda x video. Confere alinhamento. |
| `@cinematic-finalizer` | Render | Renderiza MP4 final com color grading, metadados, versoes extras |
| `@cinematic-qa` | Check | Gate FINAL: 12 pontos de conferencia. Nada sai sem aprovacao dele. |

---

## Pipeline Completo

```
INPUT (tema, formato, nivel, objetivo)
    |
    v
@cinematic-intake (Iris) - coleta parametros
    |
    v
@cinematic-researcher (Scout) - pesquisa o tema [N2+]
    |
    v
@cinematic-scriptwriter (Pen) - roteiro CopyKiller
    |
    v
@cinematic-scene-director (Frame) - divide em cenas tecnicas
    |
    v
@cinematic-image-gen (Lens) - gera imagens por cena [N3+]
    |
    v
@cinematic-motion-maker (Drift) - anima imagens (Ken Burns ou Kling)
    |
    v
@cinematic-assembler (Cut) - junta video + audio
    |
    v
@cinematic-subtitle-creator (Type) - cria legendas Inter [N3+]
    |
    v
@cinematic-proofreader (Spell) - confere ortografia/acentuacao
    |                                  |
    | APROVADO                         | REPROVADO -> volta p/ Type
    v
@cinematic-sync-analyst (Sync) - confere sincronizacao
    |                                  |
    | APROVADO                         | REPROVADO -> volta p/ Cut ou Type
    v
@cinematic-finalizer (Render) - renderiza MP4 final
    |
    v
@cinematic-qa (Check) - conferencia final 12 pontos
    |                          |
    | APROVADO                 | REPROVADO -> volta pro agente responsavel
    v
ENVIO TELEGRAM + arquivos locais
```

---

## Pipeline por Nivel

### N1 VELOZ
```
Intake -> Scriptwriter (sem pesquisa) -> Scene Director
-> Pexels stock -> Ken Burns basico -> Assembler
-> edge-tts -> Finalizer -> QA -> MP4
```
Legendas: NAO (N1 nao tem legendas)

### N2 PADRAO
```
Intake -> Researcher (rapida) -> Scriptwriter -> Scene Director
-> Pexels stock -> Ken Burns -> Assembler
-> ElevenLabs voz -> Finalizer -> QA -> MP4
```
Legendas: NAO (N2 nao tem legendas)

### N3 PREMIUM
```
Intake -> Researcher (completa) -> Scriptwriter -> Scene Director
-> Image Gen (Nano Banana) -> Ken Burns avancado -> Assembler
-> ElevenLabs voz -> Subtitle Creator (Inter) -> Proofreader -> Sync Analyst
-> Finalizer -> QA -> MP4
```

### N4 CINEMATOGRAFICO
```
Intake -> Researcher (deep) -> Scriptwriter -> Scene Director
-> Image Gen (Nano Banana todas cenas) -> Motion Maker (Kling)
-> Assembler -> ElevenLabs voz premium
-> Subtitle Creator (Inter animadas) -> Proofreader -> Sync Analyst
-> Finalizer (color grading) -> QA -> MP4 + SRT
```

### N5 MAGNA DELUXE
```
Intake -> Researcher (deep research) -> Scriptwriter (CopyKiller full)
-> Scene Director -> Image Gen (Nano Banana premium, composicao Magna)
-> Motion Maker (Kling cinematografico) -> Assembler
-> ElevenLabs voz curada
-> Subtitle Creator (Inter premium) -> Proofreader -> Sync Analyst
-> Finalizer (color grading + intro/outro Magna) -> QA -> MP4 + SRT + OGG
```

### TUTORIAL (objetivo = TUTORIAL, qualquer nivel N1-N3)
```
Intake -> Screen Capture (Cap) -> navega na web via Playwright
                                  -> tira screenshots de cada passo
                                  -> anota com seta + highlight + numero
                                  -> gera steps-manifest.json
         |
         v
Scriptwriter (Pen) -> cria narração a partir do manifest
         |
         v
Assembler (Cut) -> usa os frames como video (sem Image Gen, sem Motion Maker)
         |
         v
ElevenLabs voz (N2+) ou edge-tts (N1)
         |
         v
Subtitle Creator -> Proofreader -> Sync Analyst
         |
         v
Finalizer -> QA -> MP4 entregue no Telegram
```

Obs: No modo TUTORIAL, @cinematic-image-gen e @cinematic-motion-maker ficam DORMENTES.
Os frames do Screen Capture substituem as imagens geradas.
Cada frame fica visivel por 3-8 segundos conforme complexidade do passo.

---

## Visual DNA Magna (N5 obrigatorio, N4 recomendado)

- Fundo: dark profundo com tint da cor principal
- Tipografia: Inter para legendas, spacing generoso
- Paleta: monocromatica com accent dourado ou rosegold conforme tema
- Legendas: Inter bold para destaque, cor accent nas palavras-chave
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

O @cinematic-qa libera a entrega com:
- MP4 no formato solicitado
- SRT de legenda (N4+)
- OGG para WhatsApp (N5 ou se solicitado)
- Relatorio: duracao, cenas, custo estimado, score QA

Envio automatico pelo Telegram apos aprovacao do QA.

---

## Ativacao

Comando: `@cinematic-forge` ou `@video-cinematic`
Trigger keywords: video com ia, criar video, video profissional, cinematic forge, video automatico, tutorial em video, video tutorial, video passo a passo, explica como fazer, screencast
Peso minimo para ativacao automatica: 50
