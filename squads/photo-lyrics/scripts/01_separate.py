"""01_separate.py - Separa o vocal da musica com Demucs (htdemucs).

Uso:
    .venv\\Scripts\\python scripts\\01_separate.py --project producoes\\meu-projeto [--cpu] [--hq]

Entrada : {project}/01-musica/musica.mp3 (ou .wav/.m4a, primeiro audio achado)
Saida   : {project}/build/vocals.wav

Implementacao via demucs.api + soundfile (NAO usa torchaudio.save: no Windows
o torchaudio >= 2.9 exige torchcodec + FFmpeg com DLLs compartilhadas, fragil).
VRAM 8 GB: segment 7. NUNCA rodar em paralelo com 02_align.py.
"""

import argparse
import sys
from pathlib import Path

AUDIO_EXTS = {".mp3", ".wav", ".m4a", ".flac", ".ogg"}


def find_music(project: Path) -> Path:
    music_dir = project / "01-musica"
    candidates = sorted(p for p in music_dir.glob("*") if p.suffix.lower() in AUDIO_EXTS)
    if not candidates:
        sys.exit(f"ERRO: nenhum audio em {music_dir}")
    return candidates[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--cpu", action="store_true", help="forca CPU (fallback)")
    ap.add_argument("--hq", action="store_true", help="usa htdemucs_ft (4x mais lento)")
    args = ap.parse_args()

    project = Path(args.project).resolve()
    music = find_music(project)
    build = project / "build"
    build.mkdir(exist_ok=True)
    out_vocals = build / "vocals.wav"

    model = "htdemucs_ft" if args.hq else "htdemucs"
    device = "cpu" if args.cpu else "cuda"

    import soundfile as sf
    import torch
    from demucs.apply import apply_model
    from demucs.audio import convert_audio
    from demucs.pretrained import get_model

    print(f"Demucs {model} em {device} (segment 7)...")
    dmx = get_model(model)
    dmx.eval()

    data, sr = sf.read(str(music), always_2d=True, dtype="float32")
    wav = torch.from_numpy(data.T)  # (canais, amostras)
    wav = convert_audio(wav, sr, dmx.samplerate, dmx.audio_channels)
    ref = wav.mean(0)
    wav_norm = (wav - ref.mean()) / (ref.std() + 1e-8)

    def run(dev):
        with torch.no_grad():
            return apply_model(dmx, wav_norm[None], device=dev,
                               split=True, overlap=0.25, segment=7,
                               progress=True)[0]

    try:
        sources = run(device)
    except Exception as e:  # noqa: BLE001
        if device == "cuda":
            print(f"AVISO: CUDA falhou ({e}); tentando CPU...")
            sources = run("cpu")
        else:
            raise

    sources = sources * (ref.std() + 1e-8) + ref.mean()
    vocals = sources[dmx.sources.index("vocals")]
    sf.write(str(out_vocals), vocals.cpu().numpy().T, dmx.samplerate)
    print(f"OK: {out_vocals}")


if __name__ == "__main__":
    main()
