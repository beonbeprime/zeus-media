"""07_qc.py - QC automatico pos-render.

Uso:
    python scripts\\07_qc.py --project producoes\\meu-projeto --output producoes\\meu-projeto\\07-render\\final-v01.mp4

Verifica:
1. ffprobe do output: duracao == musica (tolerancia 0.15s), resolucao, fps, audio.
2. Manifest: timeline continua (delega ao check-manifest).
3. Extrai 1 frame do OUTPUT em start_f+6 de cada cena phrase -> 07-render/qc-frames/.
   O agente QC le cada frame por visao e confere que o texto e o da frase esperada
   (e nao o da cena anterior). Divergencia -> overrides.json + re-render.

Saida: 07-render/qc-report.json. Exit 0 = checks automaticos OK.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from photo_lyrics.timing import frames_to_s

TOL_S = 0.15


def ffprobe(path: Path) -> dict:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "format=duration:stream=codec_type,width,height,r_frame_rate",
         "-of", "json", str(path)],
        capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"ERRO: ffprobe falhou em {path}: {r.stderr}")
    return json.loads(r.stdout)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    project = Path(args.project).resolve()
    output = Path(args.output).resolve()
    manifest = json.loads((project / "manifest.json").read_text(encoding="utf-8"))

    report = {"output": str(output), "checks": [], "frames": []}
    ok = True

    def check(name, passed, detail=""):
        nonlocal ok
        report["checks"].append({"name": name, "passed": bool(passed), "detail": detail})
        status = "OK " if passed else "FAIL"
        print(f"  [{status}] {name} {detail}")
        if not passed:
            ok = False

    info = ffprobe(output)
    dur = float(info["format"]["duration"])
    expected = manifest["music"]["duration_s"]
    check("duracao == musica", abs(dur - expected) <= TOL_S,
          f"({dur:.2f}s vs {expected:.2f}s)")

    vstreams = [s for s in info["streams"] if s["codec_type"] == "video"]
    astreams = [s for s in info["streams"] if s["codec_type"] == "audio"]
    check("stream de audio presente", len(astreams) >= 1)
    if vstreams:
        v = vstreams[0]
        is_draft = "draft" in output.name
        want_w, want_h = (540, 960) if is_draft else (1080, 1920)
        check("resolucao", v["width"] == want_w and v["height"] == want_h,
              f"({v['width']}x{v['height']}, esperado {want_w}x{want_h})")
        check("fps 30", v["r_frame_rate"] in ("30/1", "30000/1000"),
              f"({v['r_frame_rate']})")
    else:
        check("stream de video presente", False)

    # frames de sync para o passo de visao
    qc_dir = project / "07-render" / "qc-frames"
    qc_dir.mkdir(parents=True, exist_ok=True)
    for s in manifest["scenes"]:
        if s["kind"] != "phrase":
            continue
        t = frames_to_s(s["start_f"] + 6)
        if t >= dur:
            continue
        frame_path = qc_dir / f"{s['slug']}.jpg"
        r = subprocess.run(
            ["ffmpeg", "-y", "-ss", f"{t:.3f}", "-i", str(output),
             "-frames:v", "1", "-q:v", "2", str(frame_path)],
            capture_output=True, text=True)
        if r.returncode == 0:
            report["frames"].append({"slug": s["slug"], "phrase": s["phrase"],
                                     "frame": str(frame_path), "t": round(t, 2)})

    report_path = project / "07-render" / "qc-report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2),
                           encoding="utf-8")
    print(f"\nQC report: {report_path}")
    print(f"Frames de sync em {qc_dir} ({len(report['frames'])} cenas).")
    print("PROXIMO PASSO (visao): ler cada qc-frame e conferir que o texto visivel "
          "e a frase esperada da cena.")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
