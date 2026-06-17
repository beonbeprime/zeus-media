"""02_align.py - Alinha a letra sobre o vocal (ou transcreve, fallback).

Uso:
    .venv\\Scripts\\python scripts\\02_align.py --project producoes\\meu-projeto
        [--backend auto|faster|torch|cpu] [--no-vocals]

Modos:
- ALIGN (padrao, quando {project}/01-musica/letra.txt existe): forced alignment
  da letra conhecida sobre build/vocals.wav via stable-ts. Uma frase de 2-4
  palavras por linha na letra = segmentacao quase pronta (original_split=True).
- TRANSCRIBE (sem letra.txt): transcricao as cegas word-level. O texto resultante
  NUNCA e fonte final: revisar, salvar como letra.txt e rodar de novo em ALIGN.

Saida: {project}/02-transcricao/words.json
  {language, audio_duration_s, source_mode, lines: [{idx, text, start, end,
   words: [{text, start, end}]}]}

Backends (cascata em --backend auto):
  1. faster : stable-ts + faster-whisper large-v3 int8_float16 (GPU, ~3 GB VRAM)
  2. torch  : stable-ts + whisper medium fp16 (GPU, ~5 GB VRAM)
  3. cpu    : faster-whisper medium int8 (lento, sempre funciona)
"""

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from photo_lyrics.textnorm import nfc, read_text_utf8


def audio_duration(path: Path) -> float:
    import soundfile as sf
    info = sf.info(str(path))
    return info.frames / info.samplerate


def load_model(backend: str):
    """Retorna (model, label). Cascata documentada no header."""
    import stable_whisper

    order = {"auto": ["faster", "torch", "cpu"], "faster": ["faster"],
             "torch": ["torch"], "cpu": ["cpu"]}[backend]
    last_err = None
    for b in order:
        try:
            if b == "faster":
                m = stable_whisper.load_faster_whisper(
                    "large-v3", device="cuda", compute_type="int8_float16")
            elif b == "torch":
                m = stable_whisper.load_model("medium", device="cuda")
            else:
                m = stable_whisper.load_faster_whisper(
                    "medium", device="cpu", compute_type="int8")
            print(f"BACKEND: {b}")
            return m, b
        except Exception as e:  # noqa: BLE001 - cascata intencional
            print(f"AVISO: backend {b} falhou ({e}); tentando o proximo...")
            last_err = e
    sys.exit(f"ERRO: nenhum backend funcionou. Ultimo erro: {last_err}")


def to_words_json(result, mode: str, duration: float) -> dict:
    lines = []
    for i, seg in enumerate(result.segments):
        words = [{"text": w.word.strip(), "start": round(w.start, 3),
                  "end": round(w.end, 3)} for w in (seg.words or [])]
        if not words:
            continue
        lines.append({
            "idx": i,
            "text": nfc(seg.text.strip()),
            "start": words[0]["start"],
            "end": words[-1]["end"],
            "words": words,
        })
    return {"language": "pt", "audio_duration_s": round(duration, 3),
            "source_mode": mode, "lines": lines}


def validate(data: dict):
    problems = []
    prev_end = 0.0
    for line in data["lines"]:
        for w in line["words"]:
            if w["start"] < prev_end - 0.5:
                problems.append(f"timestamp nao monotonico em '{w['text']}' ({w['start']}s)")
            if w["end"] - w["start"] > 4.0:
                problems.append(f"palavra > 4s (vogal esticada ou falha): '{w['text']}' {w['start']}-{w['end']}s")
            prev_end = max(prev_end, w["end"])
    if problems:
        print("AVISOS DE VALIDACAO (conferir de ouvido):")
        for p in problems:
            print("  -", p)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--backend", default="auto",
                    choices=["auto", "faster", "torch", "cpu"])
    ap.add_argument("--no-vocals", action="store_true",
                    help="alinha sobre a mixagem completa (sem Demucs)")
    args = ap.parse_args()

    project = Path(args.project).resolve()
    vocals = project / "build" / "vocals.wav"
    if args.no_vocals or not vocals.exists():
        audio_candidates = sorted((project / "01-musica").glob("*"))
        audio = next((p for p in audio_candidates
                      if p.suffix.lower() in {".mp3", ".wav", ".m4a", ".flac"}), None)
        if audio is None:
            sys.exit("ERRO: rode 01_separate.py antes, ou coloque o audio em 01-musica/")
        print(f"AVISO: alinhando sobre a mixagem completa ({audio.name}). "
              "Precisao melhor com build/vocals.wav (rode 01_separate.py).")
    else:
        audio = vocals

    lyrics_file = project / "01-musica" / "letra.txt"
    duration = audio_duration(audio)
    model, backend = load_model(args.backend)

    if lyrics_file.exists():
        letra = read_text_utf8(lyrics_file).strip()
        print(f"MODO ALIGN: letra de {lyrics_file.name} ({len(letra.splitlines())} linhas)")
        try:
            result = model.align(str(audio), letra, language="pt",
                                 original_split=True, suppress_silence=True,
                                 regroup=False)
            mode = "align"
        except (AttributeError, NotImplementedError) as e:
            print(f"AVISO: align indisponivel neste backend ({e}); "
                  "caindo para transcricao + a letra continua sendo a fonte do texto.")
            result = transcribe(model, backend, audio)
            mode = "transcribe-fallback"
    else:
        print("MODO TRANSCRIBE: sem letra.txt. REVISE o texto, salve como "
              "01-musica/letra.txt e rode de novo (align e mais preciso).")
        result = transcribe(model, backend, audio)
        mode = "transcribe"

    data = to_words_json(result, mode, duration)
    validate(data)

    out_dir = project / "02-transcricao"
    out_dir.mkdir(exist_ok=True)
    out = out_dir / "words.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: {out} ({len(data['lines'])} linhas)")


def transcribe(model, backend: str, audio: Path):
    kwargs = dict(language="pt", word_timestamps=True,
                  condition_on_previous_text=False, temperature=0.0,
                  no_speech_threshold=0.5, compression_ratio_threshold=2.4)
    if backend in ("faster", "cpu"):
        return model.transcribe(str(audio), beam_size=5, vad_filter=False, **kwargs)
    return model.transcribe(str(audio), **kwargs)


if __name__ == "__main__":
    main()
