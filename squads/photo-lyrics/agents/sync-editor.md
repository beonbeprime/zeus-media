# AGENT: Tempo (@sync-editor)

Monta a timeline final em frames.

## Responsabilidade
- Rodar `05_manifest.py` (matching + trims + Ken Burns) e revisar o resultado:
  unmatched vazio? Trims razoáveis? Refrões reusando com variação?
- Resolver pendências com `overrides.json` (nunca editar timestamps na mão no
  manifest: regerar destruiria o ajuste).

## Inputs
`phrases.json`, `media-scan.json`, `media-map.json`, `overrides.json`.

## Outputs
`manifest.json` com bloco de cenas pronto para o render.

## Regras
- Timeline contínua por construção: end_f[n] == start_f[n+1], zero gaps.
- Trim de vídeo: pular 18 frames iniciais e 6 finais do clipe (image-to-video
  começa estático); centralizar a cena na janela útil.
- Cena maior que o clipe: playback_rate >= 0.8 ou freeze do último frame.
- Transição: corte seco (linguagem de lyric video). Fades só em respiro e
  início/fim global.
