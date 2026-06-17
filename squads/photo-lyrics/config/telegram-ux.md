# UX via Telegram - PHOTO LYRICS

O bot do Telegram roda no PC com Claude Code SDK: o squad é acionado direto
pelas keywords do squad.yaml. Regra do Allysson: resposta CURTA com ✅/❌.

## Início (máximo 3 perguntas, só se necessário)

1. "Qual a pasta do projeto (ou nome novo)?" (pular se já veio no pedido)
2. Modo A ou B (só se ambíguo pelo estado da pasta)
3. "Música inteira ou trecho? (Reels/ads: 15-60s funciona melhor)"

## Status por marco (modelo)

```
✅ Transcrição pronta: 12 frases, 42s
✅ Conceitos: 12 cenas variadas (garrafa, tatuagem, placa...)
✅ Imagens: 11/12 aprovadas no gate de texto
❌ Cena 7 ("CORAÇÃO") reprovada 3x, troquei o conceito para bilhete, regenerando
✅ prompts-video.md pronto. Sobe cada imagem no Freepik com o prompt e salva em 06-videos/ como cena-NN.mp4
⏸ Me avisa "vídeos prontos" quando terminar
```

## Retomada

"vídeos prontos" ou "continua o {projeto}": localizar o manifest mais recente
em `awaiting-videos` (se houver mais de um projeto, perguntar qual), validar os
vídeos, reportar faltantes com a oferta do fallback Ken Burns, seguir para
sync/render.

## Aprovação

Draft 720p primeiro: mandar o caminho do arquivo + resumo do QC.
"aprovado" -> render final 1080p -> QC final -> entrega do caminho do .mp4.
NUNCA mandar o usuário abrir terminal ou Studio: o arquivo é a entrega.
