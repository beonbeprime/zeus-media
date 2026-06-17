# Skill: PHOTO LYRICS

Ativar quando o Allysson pedir: "photo lyrics", "vídeo com música e fotos",
"música em fotos", "letra em fotos", "clipe de fotos", "música do suno em vídeo",
"reels da música", ou mandar uma música do Suno pedindo o vídeo de frases
fotografadas. Retomada: "vídeos prontos", "continua o {projeto}".

## O que o squad faz

Música do Suno (PT-BR) vira Reels 1080x1920: cada frase curta da letra aparece
ESCRITA dentro de uma fotografia realista (garrafa, tatuagem, parede, placa,
drink na praia, livro...), trocando em sincronia exata com a música.

## Passo 0 (obrigatório)

1. Ler `squads/photo-lyrics/squad.yaml` (pipeline e regras de produção).
2. Localizar/criar a pasta `squads/photo-lyrics/producoes/{projeto}/`.
3. Se `manifest.json` existe: RETOMAR da fase em `state.phase`. Nunca reiniciar.
4. Detectar o modo pelo estado da pasta (config/modes.md). Perguntar só se ambíguo.

## Fluxo resumido (MODO B, o principal)

Sessão 1:
```
.venv\Scripts\python scripts\01_separate.py --project producoes\{p}
.venv\Scripts\python scripts\02_align.py    --project producoes\{p}
.venv\Scripts\python scripts\03_phrases.py  --project producoes\{p}
# conceitos (config/scene-concepts.md) + prompts (config/photo-prompt-standard.md)
# gravar concept/photo_prompt/motion_prompt por cena no manifest (rodar 05_manifest.py antes p/ criar)
python scripts\generate-images.py --project producoes\{p}     # python do SISTEMA
python scripts\validate-text.py   --project producoes\{p}     # + GATE de visão
python scripts\make-video-prompts.py --project producoes\{p}  # -> awaiting-videos
```
Avisar o usuário: imagens em `05-imagens/`, prompts em `04-prompts/prompts-video.md`.

Sessão 2 (gatilho "vídeos prontos"):
```
.venv\Scripts\python scripts\04_ingest.py   --project producoes\{p}
# visão: ler build/frames/*.jpg -> build/media-map.json
.venv\Scripts\python scripts\05_manifest.py --project producoes\{p}
powershell -File scripts\06_render.ps1 -Project producoes\{p} -Draft
# aprovação do usuário -> render final + QC por visão dos qc-frames
powershell -File scripts\06_render.ps1 -Project producoes\{p}
```

## Regras inegociáveis

- Texto das imagens: português EXATO com acentos. Gate de visão obrigatório.
- Nunca travar por vídeo faltante (Ken Burns na imagem é fallback automático).
- Render só via CLI com gate do `check-manifest.py`.
- Status ao usuário: curto, ✅/❌, padrão `config/telegram-ux.md`.
