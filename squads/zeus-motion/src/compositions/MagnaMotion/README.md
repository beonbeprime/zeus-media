# MagnaMotion — Padrão Magna em vídeo (APROVADO 2026-06-10)

Composição Remotion que replica o padrão visual das apresentações Magna
(rosegold dark luxury, blur palavra por palavra) com texto sincronizado
ao instante exato da fala. Reels 1080x1920 @ 30fps, texto nos 2/3 superiores.

REGRA COMPLETA DO PADRÃO (leitura obrigatória antes de mexer):
`docs/rules-on-demand/magna-motion-standard.md`

## Pipeline rápido

```bash
cd squads/zeus-motion
# 1. áudio entra em public/audio/magna-motion/
python scripts/transcribe-words.py public/audio/magna-motion/<audio>.mp3
# 2. montar data/scenes.ts com os índices do transcript (FULLSAFE antes)
# 3. trilha: escolher por BPM/banda da voz/LUFS, setar MUSIC_FILE em scenes.ts
npx remotion render src/index.ts MagnaMotion "output/MagnaMotion/<nome>-draft-vNN.mp4" --jpeg-quality 80 --scale 0.5
# 4. conferir frames + mix, entregar, e após aprovação:
npx remotion render src/index.ts MagnaMotion "output/MagnaMotion/<nome>-final-vNN.mp4" --jpeg-quality 95 --scale 1
```

## Arquivos aprovados (hash de integridade — verificar antes de sobrescrever)

- magna-motion-anuncio-draft-v03-trilha.mp4 | md5: c0afbfb20b6fea995e307b699b740898 | aprovado: 2026-06-10
  (narração anuncio-allysson.mp3 + trilha iron-surge.mp3 @ 0.06, 92 BPM | paleta rosegold)
- MAGNA-MOTION-netflix-FINAL-v01.mp4 | md5: 536f641ddb0bdd8d07eadca8633adf1a | final: 2026-06-10
  (narração narracao-dourado.mp3 + trilha iron-surge-1.mp3 @ 0.055, 129 BPM | paleta red Netflix + Bebas Neue tracking 0.018em)

## Histórico de roteiros (data/_versions/)

- scenes.v1.ts — validação com conhecimento.mp3 (83 palavras)
- scenes.v2.ts — stories ebook viralização (narracao-allysson.mp3, 97 palavras)
- scenes.ts ATUAL — anúncio máquina de vendas (anuncio-allysson.mp3, 102 palavras)
