# REELS ZOOM - Mapa de Caminhos e Arquivos

## Projeto Remotion (editor de video)

```
C:/Users/Pichau/Desktop/magna-video-editor/
├── src/
│   ├── magna-theme.ts              <- FONTE DE VERDADE: cores, fontes, grain, SX, FONTS
│   ├── ReelsZoomBRolls.tsx         <- COMPOSICAO APROVADA dos B-rolls (4 cards, 45f cada)
│   ├── MagnaEditV2.tsx             <- Editor principal (captions, b-rolls com JSON)
│   ├── Root.tsx                    <- Registro de todas as composicoes
│   ├── components/
│   │   ├── SVGDefs.tsx             <- Gradient rg + glow filter (obrigatorio em todo SVG)
│   │   ├── Caption.tsx             <- Componente de legenda Magna
│   │   └── BRollOverlay.tsx        <- B-roll overlay (usa 'lines', nao 'elements')
│   └── data/
│       └── edit-project.json       <- Config do video atual (b-rolls, captions, etc.)
```

## AIOS - Squad Reels Zoom

```
C:/Users/Pichau/Desktop/aios/squads/reels-zoom/
├── squad.yaml                      <- Config principal do squad (agentes, regras visuais)
├── agents/                         <- Definicoes de cada agente
│   ├── reels-zoom-master.md        <- Orquestrador (Clip)
│   ├── zoom-transcriber.md         <- Whisper transcricao
│   ├── content-analyzer.md         <- Classificacao de frases
│   ├── hook-extractor.md           <- 3 opcoes de gancho
│   ├── narrative-architect.md      <- Reorganizacao narrativa
│   ├── repetition-guard.md         <- Anti-repeticao
│   ├── face-detector.md            <- Mapa de rostos
│   ├── face-reframer.md            <- Crop 9:16
│   ├── face-centering-qa.md        <- Centralizacao de rosto
│   ├── reframe-qa.md               <- QA do reenquadramento
│   ├── caption-stylist.md          <- Legendas .ass
│   ├── highlight-animator.md       <- Efeitos nos momentos-chave
│   ├── spelling-checker.md         <- Ortografia e acentuacao
│   ├── timing-checker.md           <- Sync audio/legenda/video
│   ├── final-qa.md                 <- Gate final 12 pontos
│   └── reels-renderer.md           <- Render 720p/1080p
└── config/
    ├── branding-standard.md        <- ESTE ARQUIVO - estilo imutavel
    ├── paths.md                    <- Mapa de arquivos (este arquivo)
    ├── errors-learned.md           <- 22+ erros documentados com causas e solucoes
    ├── quality-rules.md            <- Regras de qualidade
    ├── reframe-reference.md        <- Referencia visual do enquadramento 25/25/25/25
    ├── reels-closing.md            <- Tela de fechamento padrao
    └── folder-structure.md         <- Estrutura de pastas por producao
```

## Biblioteca de Icones Animados Magna

```
C:/Users/Pichau/Desktop/aios/squads/iconografia/output/
├── magna-icon-animated.html        <- BIBLIOTECA PRINCIPAL - 300 icones animados
│                                      Usar SEMPRE no lugar de criar animacoes novas
├── magna-icon-deluxe.html          <- Referencia estatica deluxe (sem animacao)
└── magna-icon-library.md           <- Documentacao dos icones
```

Como usar os icones animados no Remotion:
1. Abrir magna-icon-animated.html no browser
2. Localizar o icone pelo id (ex: crown, rocket, target...)
3. Copiar paths SVG + bloco @keyframes do CSS
4. No componente React: embutir <style> com os keyframes + SVG inline
5. Aplicar animacao via className no SVG element

Vantagem: zero custo de processamento (CSS puro, sem spring physics por icone)

## Regra de Rotacao de Icones

```
C:/Users/Pichau/Desktop/aios/squads/reels-zoom/data/icon-rotation.json
```

Formato:
```json
{
  "videos": [
    {
      "date": "2026-03-26",
      "guest": "Nanjaira",
      "icons_used": ["target", "crown", "users", "trending-up"]
    }
  ],
  "never_repeat_within": 5
}
```

Criar este arquivo se nao existir. Atualizar apos cada producao.

## Renderizacao

Comando para B-rolls:
```
cd C:/Users/Pichau/Desktop/magna-video-editor
npx remotion render ReelsZoomBRolls output/brolls-[nome-convidado].mp4
```

Comando para video editado completo:
```
npx remotion render MagnaEditV2 output/reels-[nome-convidado]-final.mp4
```

Draft (720p, aprovacao rapida):
```
npx remotion render MagnaEditV2 output/draft-[nome].mp4 --width=720 --height=1280
```

## Pasta por Producao

Para cada video novo, criar em `C:/Users/Pichau/Desktop/magna-reels-zoom/`:
```
[nome-convidado]-[data]/
├── 01-bruto/          <- video Zoom original (.mp4)
├── 02-analise/        <- transcricao, classificacao, gancho escolhido
├── 03-brolls/         <- edit-project.json + frames extraidos
├── 04-renders/        <- draft e versao final
├── 05-final/          <- MP4 aprovado para publicacao
└── _lixo/             <- arquivos temporarios e descartados
```

## Regras Globais que se Aplicam

```
~/.claude/rules/fullsafe-mode.md        <- versionar antes de editar qualquer arquivo
~/.claude/rules/magna-video-standard.md <- DM Sans captions, Cormorant display
~/.claude/rules/magna-video-motion-icons.md <- biblioteca animada obrigatoria
C:/Users/Pichau/Desktop/aios/.claude/rules/consistency-guard.md <- nunca trocar cores
```
