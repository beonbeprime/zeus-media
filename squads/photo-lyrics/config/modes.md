# Modos de operação - PHOTO LYRICS

## Detecção automática (ordem)

1. `manifest.json` existe? RETOMAR de `state.phase`. Nunca reiniciar.
2. `05-imagens/` ou `06-videos/` têm arquivos + música presente? Sugerir MODO A.
3. Só música (e opcionalmente letra)? Sugerir MODO B.
4. Ambíguo? Perguntar: "Modo A (você já tem as imagens/vídeos) ou Modo B (eu gero as imagens)?"

## MODO A - mídia pronta

Usuário coloca imagens e/ou vídeos prontos + música.
Pipeline: transcrição -> segmentação -> 04_ingest -> visão da mídia
(media-map.json) -> 05_manifest (matching) -> render -> QC.
Matching por slug do arquivo primeiro; sem slug, por texto visto na imagem.

## MODO B - squad gera imagens (principal, 2 sessões)

Sessão 1: transcrição -> segmentação -> conceitos -> prompts -> lovart-py ->
gate de visão -> prompts-video.md -> estado `awaiting-videos`.
Mensagem ao usuário: onde estão as imagens, como usar o prompts-video.md no
Freepik, nome exato dos arquivos (`cena-NN.mp4` em `06-videos/`).

Sessão 2 (gatilho "vídeos prontos"): 04_ingest -> 05_manifest -> draft ->
aprovação -> final -> QC.

## MODO C - API (futuro, stub pronto)

Igual ao B, mas `scripts/video-adapter/freepik_api.py` gera os vídeos.
Ativação: o Allysson diz "quero usar API para o motion" -> pedir a
`FREEPIK_API_KEY`, gravar no ambiente, implementar o fluxo descrito no stub.
O manifest guarda `video.source` por cena; nada mais muda.

## Regra híbrida (INVIOLÁVEL)

Por cena: vídeo válido em `06-videos/` -> usa o vídeo; senão -> imagem com
Ken Burns. O squad NUNCA bloqueia o render por vídeo faltante. Com vídeos
parciais (ex: 7 de 12): avisar quais faltam e perguntar "renderizo agora com
zoom nas que faltam ou espero?".
