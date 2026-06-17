"""04_ingest.py - Inventaria e normaliza a midia do projeto.

Uso:
    .venv\\Scripts\\python scripts\\04_ingest.py --project producoes\\meu-projeto

Faz:
1. Lista {project}/05-imagens/*.png|jpg|webp e {project}/06-videos/*.mp4|mov.
2. ffprobe em cada video (duracao, fps, resolucao).
3. Normaliza TODO video para CFR 30fps 1080x1920 h264 yuv420p sem audio
   em build/norm/ (video cru NUNCA renderiza: VFR quebra trim por frames).
4. Extrai o frame do meio de cada video em build/frames/ (para o passo de
   visao: o agente le o frame e extrai o texto escrito na cena).
Saida: build/media-scan.json
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from photo_lyrics.timing import s_to_frames

IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp"}
VID_EXTS = {".mp4", ".mov", ".webm", ".mkv"}


def ffprobe_duration(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True)
    if r.returncode != 0 or not r.stdout.strip():
        sys.exit(f"ERRO: ffprobe falhou em {path}: {r.stderr}")
    return float(r.stdout.strip())


def normalize_video(src: Path, dst: Path):
    cmd = ["ffmpeg", "-y", "-i", str(src),
           "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,"
                  "crop=1080:1920,fps=30",
           "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
           "-an", "-movflags", "+faststart", str(dst)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"ERRO: ffmpeg normalizacao falhou em {src}:\n{r.stderr[-800:]}")


def extract_mid_frame(video: Path, dst: Path, duration: float):
    r = subprocess.run(
        ["ffmpeg", "-y", "-ss", f"{duration / 2:.2f}", "-i", str(video),
         "-frames:v", "1", "-q:v", "2", str(dst)],
        capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"ERRO: extracao de frame falhou em {video}:\n{r.stderr[-400:]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--skip-normalized", action="store_true",
                    help="nao renormaliza videos ja presentes em build/norm")
    args = ap.parse_args()
    project = Path(args.project).resolve()

    build = project / "build"
    (build / "norm").mkdir(parents=True, exist_ok=True)
    (build / "frames").mkdir(parents=True, exist_ok=True)

    items = []

    img_dir = project / "05-imagens"
    if img_dir.exists():
        for p in sorted(img_dir.iterdir()):
            if p.suffix.lower() in IMG_EXTS and p.parent.name != "_rejeitadas":
                items.append({
                    "file": f"05-imagens/{p.name}", "type": "image",
                    "slug": p.stem.lower(), "frame_file": f"05-imagens/{p.name}",
                })
        resp = img_dir / "respiro"
        if resp.exists():
            for p in sorted(resp.iterdir()):
                if p.suffix.lower() in IMG_EXTS:
                    items.append({
                        "file": f"05-imagens/respiro/{p.name}", "type": "image",
                        "slug": "respiro", "frame_file": f"05-imagens/respiro/{p.name}",
                    })

    vid_dir = project / "06-videos"
    if vid_dir.exists():
        for p in sorted(vid_dir.iterdir()):
            if p.suffix.lower() not in VID_EXTS:
                continue
            dur = ffprobe_duration(p)
            norm = build / "norm" / f"{p.stem}.mp4"
            if not (args.skip_normalized and norm.exists()):
                print(f"Normalizando {p.name}...")
                normalize_video(p, norm)
            norm_dur = ffprobe_duration(norm)
            frame = build / "frames" / f"{p.stem}.jpg"
            extract_mid_frame(norm, frame, norm_dur)
            items.append({
                "file": f"06-videos/{p.name}", "type": "video",
                "slug": p.stem.lower(),
                "norm_file": f"build/norm/{norm.name}",
                "frame_file": f"build/frames/{frame.name}",
                "duration_s": round(norm_dur, 3),
                "duration_f": s_to_frames(norm_dur),
            })

    out = build / "media-scan.json"
    out.write_text(json.dumps({"items": items}, ensure_ascii=False, indent=2),
                   encoding="utf-8")
    n_img = sum(1 for i in items if i["type"] == "image")
    n_vid = len(items) - n_img
    print(f"OK: {out} ({n_img} imagens, {n_vid} videos)")
    if items:
        print("PROXIMO PASSO (visao): ler cada frame_file, extrair o texto escrito "
              "e gravar build/media-map.json: [{file, seen_text, confidence}]")


if __name__ == "__main__":
    main()
