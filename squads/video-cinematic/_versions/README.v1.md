# CINEMATIC FORGE — Squad de Video com IA

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

| Nivel | Nome | Voz | Visual | Movimento | Legenda | Custo |
|-------|------|-----|--------|-----------|---------|-------|
| N1 | VELOZ | edge-tts (gratis) | Pexels stock | Ken Burns basico | Nao | $0 |
| N2 | PADRAO | ElevenLabs | Pexels stock | Ken Burns | Nao | ~$0.20 |
| N3 | PREMIUM | ElevenLabs | Nano Banana (1 img/cena) | Ken Burns + | Sim | ~$0.80 |
| N4 | CINEMATOGRAFICO | ElevenLabs | Nano Banana (todas cenas) | Kling AI | Sim animada | ~$3 |
| N5 | MAGNA DELUXE | ElevenLabs premium | Nano Banana premium | Kling cinematografico | Premium + color grade | ~$8 |

## Pipeline

```
Input → @cinematic-intake
→ @cinematic-researcher (N2+)
→ @cinematic-scriptwriter (CopyKiller)
→ @cinematic-scene-director
→ @cinematic-image-gen (N3+)
→ @cinematic-motion-maker
→ @cinematic-assembler
→ MP4 entregue no Telegram
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

## Visual DNA Magna (N5 obrigatorio, N4 recomendado)

- Fundo: dark profundo (#050201 a #0F0603)
- Accent: dourado (#D4A017) ou rosegold (#C4788E)
- Tipografia legenda: Montserrat Bold, palavras-chave em cor de destaque
- Transicoes: suaves, cinematograficas
- Ritmo: corte no beat, pausa dramatica nos dados

## Estrutura de Arquivos

```
squads/video-cinematic/
├── SQUAD.md            - definicao completa do squad
├── README.md           - este arquivo
├── agents/
│   ├── cinematic-intake.md
│   ├── cinematic-researcher.md
│   ├── cinematic-scriptwriter.md
│   ├── cinematic-scene-director.md
│   ├── cinematic-image-gen.md
│   ├── cinematic-motion-maker.md
│   └── cinematic-assembler.md
└── templates/
    └── scene-plan-template.yaml

scripts/
└── cinematic-forge.py  - script principal de execucao
```
