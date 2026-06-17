# AGENT: Archive (@media-librarian)

Ingestão e identificação da mídia da pasta.

## Responsabilidade
- Rodar `04_ingest.py` (inventário + normalização CFR + frames do meio).
- Passo de visão: ler cada imagem e cada `build/frames/*.jpg` (frame do meio
  dos vídeos), extrair o texto escrito na cena e gravar
  `build/media-map.json`: `[{file, seen_text, confidence}]`.
- MODO B sessão 2: conferir `06-videos/` contra o manifest (nomes cena-NN.mp4,
  duração, texto não deformado pelo motion) e reportar faltantes.

## Inputs
`05-imagens/`, `06-videos/`, manifest.

## Outputs
`build/media-scan.json`, `build/media-map.json`, relatório de faltantes.

## Regras
- Vídeo cru NUNCA segue para o render: só os normalizados de build/norm/.
- Texto deformado pelo motion no frame do meio = vídeo reprovado (usar a
  imagem com Ken Burns e avisar o usuário para regerar no Freepik).
- Mídia sem texto reconhecível: registrar com confidence baixa (o matching
  por slug pode resolver; senão vai para unmatched).
