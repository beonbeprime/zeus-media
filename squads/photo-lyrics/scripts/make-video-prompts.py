"""make-video-prompts.py - Gera 04-prompts/prompts-video.md a partir do manifest.

Uso (qualquer python):
    python scripts\\make-video-prompts.py --project producoes\\meu-projeto

Lista, por cena com imagem aprovada: a imagem a subir no Freepik, o prompt de
motion pronto para colar, a duracao alvo e o NOME EXATO do arquivo a salvar em
06-videos/. Depois marca state.phase = awaiting-videos no manifest.
"""

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    args = ap.parse_args()
    project = Path(args.project).resolve()
    manifest_path = project / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    scenes = [s for s in manifest["scenes"]
              if s["kind"] == "phrase"
              and s.get("image", {}).get("status") == "approved"
              and s.get("motion_prompt")
              and s.get("reuse_of") is None]

    lines = [
        f"# Prompts de video (image-to-video) - {manifest['project']}",
        "",
        "Como usar:",
        "1. Suba a imagem indicada no Freepik (image-to-video).",
        "2. Cole o prompt de motion correspondente. Duracao: 5s.",
        f"3. Baixe o video e salve em `06-videos/` com o NOME EXATO indicado.",
        "4. Quando terminar todos, diga ao Zeus: \"videos prontos\".",
        "",
        "Cena sem video no final NAO trava nada: ela entra com zoom suave",
        "(Ken Burns) na propria imagem.",
        "",
    ]
    for s in scenes:
        dur = s["end_s"] - s["start_s"]
        lines += [
            f"## {s['slug']} - \"{s['phrase']}\" ({dur:.1f}s na musica)",
            "",
            f"Imagem: `{s['image']['path']}`",
            f"Salvar como: `06-videos/{s['slug']}.mp4`",
            "",
            "Prompt:",
            "```",
            s["motion_prompt"],
            "```",
            "",
        ]

    out_dir = project / "04-prompts"
    out_dir.mkdir(exist_ok=True)
    out = out_dir / "prompts-video.md"
    out.write_text("\n".join(lines), encoding="utf-8")

    manifest["state"]["phase"] = "awaiting-videos"
    done = manifest["state"].setdefault("phases_done", [])
    for ph in ("images", "validate", "prompts"):
        if ph not in done:
            done.append(ph)
    manifest["state"]["updated"] = datetime.now(timezone.utc).isoformat()
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2),
                             encoding="utf-8")
    print(f"OK: {out} ({len(scenes)} cenas). Estado: awaiting-videos.")


if __name__ == "__main__":
    main()
