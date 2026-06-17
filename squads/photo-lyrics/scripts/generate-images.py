"""generate-images.py - Gera as fotografias das cenas via lovart-py.

IMPORTANTE: rodar com o PYTHON DO SISTEMA (onde o Playwright do lovart-py
esta instalado), NAO com o .venv do squad:
    python scripts\\generate-images.py --project producoes\\meu-projeto [--scene cena-03]

Le manifest.json; para cada cena kind=phrase com image.status em
(pending, rejected) e photo_prompt definido, chama lovart.client.generate_image
e salva em 05-imagens/{slug}.png. Atualiza image.path/status no manifest.

Depois de gerar: o gate de visao (agente Acento) le cada PNG, compara o texto
caractere a caractere com a frase e marca approved/rejected. Imagem rejeitada
volta a ser gerada por este script (ate 3 tentativas; controle no manifest).
"""

import argparse
import json
import shutil
import sys
from pathlib import Path

LOVART_SRC = Path(r"C:\Users\Pichau\Desktop\aios\lovart-py\src")
sys.path.insert(0, str(LOVART_SRC))

MAX_ATTEMPTS = 3


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--scene", help="gera so esta cena (slug, ex: cena-03)")
    args = ap.parse_args()
    project = Path(args.project).resolve()
    manifest_path = project / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    try:
        from lovart.client import generate_image
    except ImportError as e:
        sys.exit(f"ERRO: lovart-py indisponivel ({e}). Rodar com o python do sistema.")

    img_dir = project / "05-imagens"
    img_dir.mkdir(exist_ok=True)
    (img_dir / "_rejeitadas").mkdir(exist_ok=True)

    todo = [s for s in manifest["scenes"]
            if s["kind"] == "phrase"
            and (not args.scene or s["slug"] == args.scene)
            and s.get("photo_prompt")
            and s.get("image", {}).get("status") in (None, "pending", "rejected")]
    if not todo:
        print("Nada a gerar (sem cenas pendentes com photo_prompt).")
        return

    for s in todo:
        img = s.setdefault("image", {})
        attempts = img.get("attempts", 0)
        if attempts >= MAX_ATTEMPTS:
            print(f"PULANDO {s['slug']}: {attempts} tentativas. "
                  "Trocar conceito ou marcar overlay-fallback.")
            continue
        dest = img_dir / f"{s['slug']}.png"
        if dest.exists() and img.get("status") == "rejected":
            rej = img_dir / "_rejeitadas" / f"{s['slug']}-t{attempts}.png"
            shutil.move(str(dest), str(rej))

        print(f"GERANDO {s['slug']} (tentativa {attempts + 1}): {s['phrase']}")
        kwargs = {}
        # tentativa 2+: usa a imagem rejeitada como referencia pedindo so o texto certo
        prev = sorted((img_dir / "_rejeitadas").glob(f"{s['slug']}-t*.png"))
        if prev and attempts >= 1:
            kwargs["reference_image"] = str(prev[-1])
        try:
            path = generate_image(s["photo_prompt"], **kwargs)
        except Exception as e:  # noqa: BLE001
            print(f"  ERRO lovart em {s['slug']}: {e}")
            print("  Fallback manual: scripts\\nano-banana-2.js ou "
                  "freepik-mystic-generator.js (aios/scripts)")
            continue
        shutil.copy2(path, dest)
        img.update({"path": f"05-imagens/{dest.name}", "status": "generated",
                    "attempts": attempts + 1, "validation": None})
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2),
                                 encoding="utf-8")
        print(f"  OK: {dest}")

    print("PROXIMO PASSO: gate de visao (validate-text.py + leitura por visao de "
          "cada PNG; aprovar somente texto EXATO com acentos).")


if __name__ == "__main__":
    main()
