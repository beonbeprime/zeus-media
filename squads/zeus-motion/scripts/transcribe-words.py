#!/usr/bin/env python3
"""
transcribe-words.py - Transcricao word-level para composicoes sincronizadas (MagnaMotion)

Uso:
    python scripts/transcribe-words.py <audio.mp3> [--out <narration.json>] [--mode narration|lyrics]

Requer:
    pip install faster-whisper

O que faz:
    1. Transcreve o audio com faster-whisper (word_timestamps=True, PT-BR)
    2. Mantem o texto ORIGINAL de cada palavra (acentos e pontuacao preservados)
    3. Sanitiza timestamps (monotonia minima de 1 frame a 30fps)
    4. Exporta narration.json com TODAS as palavras: { i, text, start, end }
    5. Imprime o transcript numerado (#0 #1 #2...) para montagem manual do roteiro

Derivado de narr-sync.py (que mapeia triggers de cena). Este script NAO mexe
em narr-timing.ts: ele apenas gera dados brutos de palavras para o pipeline
MagnaMotion (data/narration.json + data/scenes.ts manual).
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

# Acentos no console do Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

FPS = 30
MIN_STEP = 1.0 / FPS  # passo minimo entre starts consecutivos (1 frame)

SCRIPTS_DIR = Path(__file__).parent
ZEUS_MOTION_DIR = SCRIPTS_DIR.parent
PUBLIC_DIR = ZEUS_MOTION_DIR / "public"
DEFAULT_OUT = ZEUS_MOTION_DIR / "src" / "compositions" / "MagnaMotion" / "data" / "narration.json"


def transcribe(audio_path: str) -> tuple[list[dict], float]:
    """Transcreve audio com faster-whisper. Retorna ([{text,start,end}], duracao_s)."""
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("\nERRO: faster-whisper nao instalado.")
        print("Instale com: pip install faster-whisper")
        sys.exit(1)

    print("[transcribe-words] Carregando modelo Whisper large-v2 (CPU, int8)...")
    model = WhisperModel("large-v2", device="cpu", compute_type="int8")

    print(f"[transcribe-words] Transcrevendo '{Path(audio_path).name}'...")
    segments, info = model.transcribe(
        audio_path,
        language="pt",
        word_timestamps=True,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 200},
    )

    words: list[dict] = []
    for seg in segments:
        if seg.words:
            for w in seg.words:
                text = w.word.strip()
                if text:
                    words.append({"text": text, "start": float(w.start), "end": float(w.end)})

    duration = float(info.duration)
    print(f"[transcribe-words] {len(words)} palavras | duracao: {duration:.2f}s")
    return words, duration


def sanitize(words: list[dict]) -> list[dict]:
    """Garante monotonia: start[i] >= start[i-1] + 1 frame; end[i] >= start[i] + 1 frame."""
    fixed = 0
    for i, w in enumerate(words):
        if i > 0 and w["start"] < words[i - 1]["start"] + MIN_STEP:
            w["start"] = words[i - 1]["start"] + MIN_STEP
            fixed += 1
        if w["end"] < w["start"] + MIN_STEP:
            w["end"] = w["start"] + MIN_STEP
            fixed += 1
    if fixed:
        print(f"[transcribe-words] {fixed} timestamps ajustados (monotonia minima de 1 frame)")
    for i, w in enumerate(words):
        w["i"] = i
        w["start"] = round(w["start"], 3)
        w["end"] = round(w["end"], 3)
    return words


def resolve_audio_file(audio_path: Path) -> str:
    """Caminho relativo a public/ (formato esperado por staticFile())."""
    try:
        rel = audio_path.resolve().relative_to(PUBLIC_DIR.resolve())
        return rel.as_posix()
    except ValueError:
        print(f"AVISO: '{audio_path}' esta fora de public/. Copie o arquivo para")
        print(f"       {PUBLIC_DIR} e ajuste 'audioFile' no narration.json.")
        return audio_path.name


def main() -> None:
    parser = argparse.ArgumentParser(description="Transcricao word-level (MagnaMotion)")
    parser.add_argument("audio", help="caminho do arquivo de audio (mp3/wav)")
    parser.add_argument("--out", default=str(DEFAULT_OUT), help="saida do narration.json")
    parser.add_argument("--mode", default="narration", choices=["narration", "lyrics"])
    args = parser.parse_args()

    audio_path = Path(args.audio)
    if not audio_path.exists():
        print(f"ERRO: arquivo nao encontrado: {audio_path}")
        sys.exit(1)

    words, duration = transcribe(str(audio_path))
    words = sanitize(words)

    data = {
        "audioFile": resolve_audio_file(audio_path),
        "durationSec": round(duration, 3),
        "language": "pt",
        "mode": args.mode,
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "words": words,
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[transcribe-words] narration.json salvo em: {out_path}")

    print("\n[transcribe-words] Transcript numerado (use os indices no scenes.ts):")
    line = []
    for w in words:
        line.append(f"#{w['i']} {w['text']}")
        if len(line) == 8:
            print("  " + "  ".join(line))
            line = []
    if line:
        print("  " + "  ".join(line))


if __name__ == "__main__":
    main()
