"""check-manifest.py - Gate de validacao do manifest antes de cada fase.

Uso:
    python scripts\\check-manifest.py --project producoes\\meu-projeto [--gate render]

Sem --gate: valida estrutura geral. Com --gate render: exige tudo pronto para
renderizar (zero unmatched, timeline continua, midia existente em disco).
Exit code 0 = pode seguir; 1 = bloqueado (motivos no stdout).
"""

import argparse
import json
import sys
from pathlib import Path

PHASES = ["intake", "transcribe", "segment", "concepts", "prompts", "images",
          "validate", "awaiting-videos", "ingest", "sync", "render-draft",
          "awaiting-approval", "render-final", "done"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--gate", choices=["render"], default=None)
    args = ap.parse_args()
    project = Path(args.project).resolve()
    path = project / "manifest.json"
    if not path.exists():
        sys.exit("BLOQUEADO: manifest.json nao existe (rode 05_manifest.py).")
    m = json.loads(path.read_text(encoding="utf-8"))

    errors = []
    phase = m.get("state", {}).get("phase")
    if phase not in PHASES:
        errors.append(f"state.phase invalida: {phase}")
    if m.get("fps") != 30 or m.get("width") != 1080 or m.get("height") != 1920:
        errors.append("fps/width/height devem ser 30/1080/1920")
    if not (project / m["music"]["file"]).exists():
        errors.append(f"musica nao encontrada: {m['music']['file']}")

    scenes = m.get("scenes", [])
    if not scenes:
        errors.append("manifest sem cenas")
    for i, s in enumerate(scenes):
        if s["end_f"] <= s["start_f"]:
            errors.append(f"cena {s['slug']}: duracao <= 0 frames")
        if i + 1 < len(scenes) and s["end_f"] != scenes[i + 1]["start_f"]:
            errors.append(f"gap/overlap entre {s['slug']} e {scenes[i+1]['slug']} "
                          f"({s['end_f']} != {scenes[i+1]['start_f']})")
    if scenes:
        if scenes[0]["start_f"] != 0:
            errors.append(f"primeira cena comeca em {scenes[0]['start_f']}, nao em 0")
        effective = m["music"]["duration_frames"] \
            - m["music"].get("start_offset_f", 0) - m["music"].get("end_trim_f", 0)
        if scenes[-1]["end_f"] != effective:
            errors.append(f"ultima cena termina em {scenes[-1]['end_f']}, "
                          f"timeline efetiva tem {effective} frames")

    if args.gate == "render":
        un = m.get("unmatched", {})
        if un.get("phrases"):
            errors.append(f"{len(un['phrases'])} frases sem midia: "
                          f"{[u['phrase'] for u in un['phrases']]}")
        for s in scenes:
            if s["kind"] == "respiro" and s.get("motion") == "extend-previous":
                continue
            media = s.get("media")
            if not media or not media.get("file"):
                errors.append(f"cena {s['slug']} sem midia")
                continue
            if not (project / media["file"]).exists():
                errors.append(f"cena {s['slug']}: arquivo nao existe: {media['file']}")
            if media["type"] == "video":
                if media["trim_out_f"] > media["duration_f"]:
                    errors.append(f"cena {s['slug']}: trim_out > duracao do clipe")

    if errors:
        print("BLOQUEADO:")
        for e in errors:
            print("  -", e)
        sys.exit(1)
    print(f"OK: manifest valido (fase atual: {phase}).")


if __name__ == "__main__":
    main()
