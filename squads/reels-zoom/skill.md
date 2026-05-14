# Skill: reels-zoom
# Habilidade: Transformar video Zoom em Reels vertical padrao Magna
# Status: APROVADO (primeiro video entregue e aprovado em 2026-03-26)

---

## Descricao

Transforma uma gravacao de reuniao Zoom (horizontal, 2 rostos) em Reels vertical
para Instagram, seguindo o padrao visual Magna aprovado.

Entrada: MP4 horizontal (1920x1080 ou similar), 2 pessoas visíveis
Saida: MP4 vertical (1080x1920), 30-90 segundos, legendas Magna, B-rolls animados

---

## Ativacao

Acionar quando o usuario enviar ou mencionar:
- video de zoom / gravacao de reuniao
- reels zoom / zoom para reels
- video vertical de call / video de entrevista

Comando: `@reels-zoom-master` ou `*reels [caminho-do-video]`

---

## Pipeline de 13 Passos (resumo)

```
1. TRANSCRICAO     Ear (zoom-transcriber)      <- Whisper + timestamps + speakers
2. ANALISE         Lens (content-analyzer)     <- classifica frases por impacto
3. GANCHO          Snap (hook-extractor)       <- 3 opcoes rankeadas, usuario aprova
4. NARRATIVA       Arc (narrative-architect)   <- reorganiza, remove redundancias, 30-90s
5. ANTI-REPETICAO  Filter (repetition-guard)   <- ultima verificacao
6. ROSTOS          Eye (face-detector)         <- mapa de posicoes por timestamp
7. CROP            Crop (face-reframer)        <- 9:16 vertical, empilha rostos
7.5 CENTRALIZACAO  Align (face-centering-qa)   <- ajuste offset automatico
8. QA CROP         Check (reframe-qa)          <- verifica 5 pontos
9. LEGENDAS        Type + Glow                 <- .ass sincronizado + highlights (max 3)
10. ORTOGRAFIA     Spell                       <- zero erros de acentuacao
11. TIMING         Sync                        <- audio/legenda/video alinhados
12. GATE FINAL     Gate (final-qa)             <- 12 pontos de conferencia
13. RENDER         Render                      <- 720p draft -> aprovacao -> 1080p final
```

---

## Configuracao por Video (o que muda)

Criar `edit-project.json` para cada video com:

```json
{
  "guestName": "Nome do Convidado",
  "date": "2026-03-26",
  "sourceVideo": "01-bruto/video-original.mp4",
  "brolls": [
    {
      "timestamp": "00:05",
      "subtitle": "frase de contexto pequena",
      "headline1": "PALAVRA PRINCIPAL",
      "headline2": "complemento",
      "iconId": "crown",
      "hasIcon": true
    }
  ],
  "captions": [...],
  "outroHandle": "black.fabricadementores"
}
```

REGRAS do JSON:
- 'elements' (NUNCA 'lines')
- iconId deve existir em ICON_MAP_INLINE
- forceStyle 1/2/7 quando tem iconId
- acentuacao 100% correta em todos os textos
- icone diferente para cada B-roll
- icones diferentes dos ultimos 5 videos (ver icon-rotation.json)

---

## Visual Padrao (imutavel - ver branding-standard.md)

Cores: magna-theme.ts (bg #0a0806, rosegold rg2 #d4a08a, texto #f0e0d8)
Fontes: Cormorant Garamond (display) + DM Sans (body/captions)
Grain: fractalNoise baseFrequency 0.88, opacity 0.35
Icones: biblioteca animada (300+), stroke 0.45, linecap square
Reenquadramento: 25/25/25/25 (preto/rosto1/rosto2/legenda)
Spring: damping 14, stiffness 55 (padrao B-roll)

---

## Erros Conhecidos (ver errors-learned.md)

22 erros documentados. Os mais criticos:

- Distorcao de rosto: usar scale=W:-2, NUNCA scale=W:H fixo
- Bordas cinza: scan de brilho antes do crop
- Flash preto: setpts=PTS-STARTPTS em todo segmento
- Icone repetido: registrar em icon-rotation.json, nunca repetir em 5 videos
- Fontes erradas: SEMPRE renderizar via Remotion, nunca PIL
- Acentuacao: accent-enforcer.ts antes de salvar JSON
- Icone estrela: nao usar como padrao, rotacionar obrigatoriamente

---

## Checklist Pre-Render (resumido)

Video:
- scale usa -2 (proporcional)
- waveform analisado, cortes em silencios
- face-centering-qa rodou
- setpts em todo segmento

JSON:
- captions cobrindo toda a fala
- b-rolls com iconId (todos diferentes)
- elements (nunca lines)
- acentuacao verificada
- outroHandle correto

---

## Referencia Completa

```
squads/reels-zoom/config/branding-standard.md   <- estilo imutavel
squads/reels-zoom/config/paths.md               <- todos os caminhos
squads/reels-zoom/config/errors-learned.md      <- 22+ erros documentados
squads/reels-zoom/config/reframe-reference.md   <- padrao visual 25/25/25/25
squads/reels-zoom/squad.yaml                    <- config completa do squad
```
