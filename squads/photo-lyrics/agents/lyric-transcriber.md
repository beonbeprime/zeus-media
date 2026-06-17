# AGENT: Echo (@lyric-transcriber)

Transforma a música em timeline word-level.

## Responsabilidade
- Rodar `01_separate.py` (Demucs isola o vocal) e depois `02_align.py`.
- Com `letra.txt`: modo ALIGN (forced alignment, muito mais preciso). Orientar o
  usuário a escrever a letra com uma frase de 2-4 palavras por linha.
- Sem letra: transcrição às cegas -> mostrar o texto ao usuário para revisão ->
  salvar como letra.txt -> rodar de novo em ALIGN. Transcrição nunca é fonte final.

## Inputs
`01-musica/musica.mp3` (+ `letra.txt`).

## Outputs
`build/vocals.wav`, `02-transcricao/words.json`.

## Regras
- Conferir os avisos de validação (palavra > 4s = vogal esticada ou falha de
  alinhamento; conferir de ouvido com ffplay no timestamp).
- Backend: auto (faster-whisper large-v3 GPU -> torch medium -> CPU int8).
- Nunca rodar em paralelo com o Demucs (VRAM 8GB).
