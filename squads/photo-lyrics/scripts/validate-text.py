"""validate-text.py - Prepara crops ampliados para o gate de visao de texto.

Uso (qualquer python com Pillow):
    python scripts\\validate-text.py --project producoes\\meu-projeto

Para cada 05-imagens/cena-NN.png com image.status == generated:
- recorta os 2/3 superiores (zona obrigatoria do texto) e amplia 1.5x
- salva em build/validation/{slug}-crop.png

O agente Acento entao LE cada crop por visao e compara o texto renderizado
caractere a caractere com a frase do manifest (acento, cedilha, til).
Aprovada  -> image.status = approved, image.validation = {text_read, ok: true}
Reprovada -> image.status = rejected + motivo (regenerar via generate-images.py)
"""

import argparse
import json
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("ERRO: Pillow ausente neste python. pip install Pillow")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    args = ap.parse_args()
    project = Path(args.project).resolve()
    manifest = json.loads((project / "manifest.json").read_text(encoding="utf-8"))

    out_dir = project / "build" / "validation"
    out_dir.mkdir(parents=True, exist_ok=True)

    pend = [s for s in manifest["scenes"]
            if s["kind"] == "phrase"
            and s.get("image", {}).get("status") == "generated"]
    if not pend:
        print("Nenhuma imagem com status generated para validar.")
        return

    for s in pend:
        src = project / s["image"]["path"]
        if not src.exists():
            print(f"AVISO: {src} nao existe")
            continue
        im = Image.open(src)
        w, h = im.size
        crop = im.crop((0, 0, w, int(h * 2 / 3)))
        crop = crop.resize((int(crop.width * 1.5), int(crop.height * 1.5)))
        dest = out_dir / f"{s['slug']}-crop.png"
        crop.save(dest)
        print(f"{s['slug']}: frase esperada = \"{s['phrase']}\" -> {dest}")

    print("\nAGORA: ler cada crop por visao e atualizar o manifest "
          "(image.status approved/rejected + image.validation).")


if __name__ == "__main__":
    main()
