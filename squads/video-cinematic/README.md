# CINEMATIC FORGE - Squad de Video com IA

Pipeline completo para criacao de videos profissionais com IA.
Input simples -> video MP4 entregue no Telegram.

## Ativacao

```
@cinematic-forge
```

Ou via keywords: "criar video", "video com ia", "cinematic forge", "video profissional"

## Parametros Iniciais

O @cinematic-intake coleta obrigatoriamente:

1. Tema / texto / roteiro bruto
2. Formato: VERTICAL (Reels) | HORIZONTAL (YouTube) | QUADRADO (Feed)
3. Nivel: N1 a N5 (ver tabela abaixo)
4. Objetivo: COMERCIAL | EDUCATIVO | INSTRUCIONAL

## Niveis de Qualidade

| Nivel | Nome | Voz | Visual | Movimento | Legenda | QA | Custo |
|-------|------|-----|--------|-----------|---------|-----|-------|
| N1 | VELOZ | edge-tts (gratis) | Pexels stock | Ken Burns basico | Nao | Basico | $0 |
| N2 | PADRAO | ElevenLabs | Pexels stock | Ken Burns | Nao | Basico | ~$0.20 |
| N3 | PREMIUM | ElevenLabs | Nano Banana | Ken Burns + | Sim (Inter) | Completo | ~$0.80 |
| N4 | CINEMATOGRAFICO | ElevenLabs | Nano Banana | Kling AI | Sim animada | Completo | ~$3 |
| N5 | MAGNA DELUXE | ElevenLabs premium | Nano Banana premium | Kling cinematografico | Premium + color grade | Completo | ~$8 |

## Pipeline (12 agentes)

```
@cinematic-intake (Iris) - coleta parametros
    |
@cinematic-researcher (Scout) - pesquisa tema [N2+]
    |
@cinematic-scriptwriter (Pen) - roteiro CopyKiller
    |
@cinematic-scene-director (Frame) - divide em cenas
    |
@cinematic-image-gen (Lens) - gera imagens [N3+]
    |
@cinematic-motion-maker (Drift) - anima cenas
    |
@cinematic-assembler (Cut) - junta video + audio
    |
@cinematic-subtitle-creator (Type) - legendas Inter [N3+]
    |
@cinematic-proofreader (Spell) - ortografia/acentuacao
    |
@cinematic-sync-analyst (Sync) - sincronizacao audio/video/legenda
    |
@cinematic-finalizer (Render) - MP4 final, color grading
    |
@cinematic-qa (Check) - gate final 12 pontos -> ENVIO TELEGRAM
```

## Script CLI

```bash
# Execucao direta
python scripts/cinematic-forge.py \
  --tema "como aumentar suas vendas em 30 dias" \
  --formato VERTICAL \
  --nivel N3 \
  --objetivo COMERCIAL

# Com briefing YAML
python scripts/cinematic-forge.py --briefing briefing.yaml

# Com scene plan pre-gerado
python scripts/cinematic-forge.py --briefing briefing.yaml --scene-plan scene_plan.yaml
```

## Variaveis de Ambiente Necessarias

```
ELEVENLABS_API_KEY=    # N2+ (voz premium)
NANO_BANANA_API_KEY=   # N3+ (imagens IA)
KLING_API_KEY=         # N4+ (animacao IA)
PEXELS_API_KEY=        # N1/N2 (stock gratuito com key)
TELEGRAM_BOT_TOKEN=    # envio automatico
TELEGRAM_CHAT_ID=      # 820674354 (Allysson)
```

## Estrutura de Arquivos

```
squads/video-cinematic/
├── SQUAD.md                - definicao completa do squad
├── README.md               - este arquivo
├── agents/
│   ├── cinematic-intake.md          - coleta parametros
│   ├── cinematic-researcher.md      - pesquisa tema
│   ├── cinematic-scriptwriter.md    - roteiro
│   ├── cinematic-scene-director.md  - cenas tecnicas
│   ├── cinematic-image-gen.md       - imagens IA
│   ├── cinematic-motion-maker.md    - animacao
│   ├── cinematic-assembler.md       - montagem
│   ├── cinematic-subtitle-creator.md - legendas Inter
│   ├── cinematic-proofreader.md     - ortografia/acentuacao
│   ├── cinematic-sync-analyst.md    - sincronizacao
│   ├── cinematic-finalizer.md       - renderizacao final
│   └── cinematic-qa.md             - gate final qualidade
└── templates/
    └── scene-plan-template.yaml

scripts/
└── cinematic-forge.py  - script principal de execucao
```

## Gates de Qualidade

O pipeline tem 3 gates obrigatorios (N3+):

1. @cinematic-proofreader: ZERO erro de ortografia/acentuacao nas legendas
2. @cinematic-sync-analyst: audio, video e legenda perfeitamente sincronizados
3. @cinematic-qa: 12 pontos de conferencia antes de enviar

Se qualquer gate reprovar, o video volta para o agente responsavel. Nada sai com erro.
