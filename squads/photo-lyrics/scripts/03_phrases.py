"""03_phrases.py - Segmenta a letra alinhada em cenas (frases curtas).

Uso:
    .venv\\Scripts\\python scripts\\03_phrases.py --project producoes\\meu-projeto

Entrada : {project}/02-transcricao/words.json
Saida   : {project}/02-transcricao/phrases.json

Regras (ver plano do squad):
- Frases de 2-4 palavras (linha da letra = fronteira dura; nunca atravessa).
- Linha > 4 palavras: divide no maior gap de silencio interno.
- Linha de 1 palavra: funde com a vizinha de menor duracao combinada.
- start da cena = primeira palavra; end = start da proxima (timeline continua).
- Cena < 1.2s: funde com vizinha (prioriza a da mesma linha da letra).
- Cena que segura > 5s: marca motion_refresh (Remotion troca o Ken Burns no meio).
- Gap instrumental > 3s entre vocais: cena "respiro" sem texto.
- Refrao repetido: dedup por texto normalizado -> reuse_of aponta a 1a ocorrencia.
"""

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from photo_lyrics.timing import s_to_frames
from photo_lyrics.textnorm import normalize, slugify

MIN_SCENE = 1.2
MAX_SCENE = 5.0
GAP_RESPIRO = 3.0
MAX_WORDS = 4
LEAD_FRAMES = 2  # cena entra 2 frames ANTES da palavra (nunca depois)


def split_line(words: list) -> list[list]:
    """Divide uma linha em pedacos de ate MAX_WORDS no maior gap de silencio."""
    chunks = [words]
    while any(len(c) > MAX_WORDS for c in chunks):
        out = []
        for c in chunks:
            if len(c) <= MAX_WORDS:
                out.append(c)
                continue
            gaps = [(c[i + 1]["start"] - c[i]["end"], i) for i in range(len(c) - 1)]
            # maior gap; empate resolve no corte mais equilibrado
            best = max(gaps, key=lambda g: (g[0], -abs((g[1] + 1) - len(c) / 2)))
            i = best[1]
            out.extend([c[: i + 1], c[i + 1:]])
        chunks = out
    return chunks


def main():
    global MAX_WORDS
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--by-line", action="store_true",
                    help="uma linha da letra = uma cena (frases completas nas imagens)")
    ap.add_argument("--max-words", type=int, default=None,
                    help="maximo de palavras por cena (default 4)")
    args = ap.parse_args()
    if args.by_line:
        MAX_WORDS = 999
    elif args.max_words:
        MAX_WORDS = args.max_words
    project = Path(args.project).resolve()

    data = json.loads((project / "02-transcricao" / "words.json").read_text(encoding="utf-8"))
    duration = data["audio_duration_s"]

    # 1. linhas -> pedacos de 2-4 palavras (fronteira dura na linha)
    raw = []
    for line in data["lines"]:
        for chunk in split_line(line["words"]):
            raw.append({
                "line_idx": line["idx"],
                "words": chunk,
                "text": " ".join(w["text"] for w in chunk),
                "vocal_start": chunk[0]["start"],
                "vocal_end": chunk[-1]["end"],
            })

    # 2. funde pedacos de 1 palavra com a vizinha (mesma linha de preferencia)
    def merge(i, j):
        a, b = raw[min(i, j)], raw[max(i, j)]
        a["words"] += b["words"]
        a["text"] = " ".join(w["text"] for w in a["words"])
        a["vocal_end"] = b["vocal_end"]
        del raw[max(i, j)]

    i = 0
    while i < len(raw):
        if len(raw[i]["words"]) == 1 and len(raw) > 1:
            nxt_ok = i + 1 < len(raw) and len(raw[i + 1]["words"]) < MAX_WORDS
            prv_ok = i > 0 and len(raw[i - 1]["words"]) < MAX_WORDS
            nxt_same = nxt_ok and raw[i + 1]["line_idx"] == raw[i]["line_idx"]
            prv_same = prv_ok and raw[i - 1]["line_idx"] == raw[i]["line_idx"]
            if nxt_same or (nxt_ok and not prv_same):
                merge(i, i + 1)
                continue
            if prv_ok:
                merge(i - 1, i)
                i -= 1
                continue
        i += 1

    # 3. funde cenas mais curtas que MIN_SCENE (duracao = start a start do proximo)
    changed = True
    while changed and len(raw) > 1:
        changed = False
        for i in range(len(raw) - 1):
            if raw[i + 1]["vocal_start"] - raw[i]["vocal_start"] < MIN_SCENE \
                    and len(raw[i]["words"]) + len(raw[i + 1]["words"]) <= MAX_WORDS + 2:
                merge(i, i + 1)
                changed = True
                break

    # 4. monta cenas continuas com respiros
    scenes = []
    seen: dict[str, int] = {}

    def add_respiro(start, end):
        scenes.append({"kind": "respiro", "phrase": "", "start_s": round(start, 3),
                       "end_s": round(end, 3)})

    if raw and raw[0]["vocal_start"] > GAP_RESPIRO:
        add_respiro(0.0, raw[0]["vocal_start"])

    for i, ch in enumerate(raw):
        start = ch["vocal_start"]
        if i + 1 < len(raw):
            nxt = raw[i + 1]["vocal_start"]
            gap = nxt - ch["vocal_end"]
            end = ch["vocal_end"] if gap > GAP_RESPIRO else nxt
        else:
            gap = duration - ch["vocal_end"]
            end = ch["vocal_end"] if gap > GAP_RESPIRO else duration

        norm = normalize(ch["text"])
        scene = {
            "kind": "phrase",
            "phrase": ch["text"],
            "start_s": round(start, 3),
            "end_s": round(end, 3),
            "motion_refresh": (end - start) > MAX_SCENE,
            "reuse_of": seen.get(norm),
        }
        if norm not in seen:
            seen[norm] = len(scenes)
        scenes.append(scene)

        if gap > GAP_RESPIRO:
            add_respiro(ch["vocal_end"], nxt if i + 1 < len(raw) else duration)

    # 5. ids, slugs, frames (antecipacao LEAD_FRAMES, nunca atrasar)
    phrase_n = 0
    for idx, s in enumerate(scenes):
        s["id"] = idx + 1
        if s["kind"] == "phrase":
            phrase_n += 1
            s["slug"] = f"cena-{phrase_n:02d}"
            s["slug_text"] = slugify(s["phrase"])
        else:
            s["slug"] = f"respiro-{idx + 1:02d}"
        s["start_f"] = max(0, s_to_frames(s["start_s"]) - (LEAD_FRAMES if s["kind"] == "phrase" else 0))
    # timeline cobre a musica inteira: a 1a cena estende ate o frame 0
    if scenes:
        scenes[0]["start_f"] = 0
        scenes[0]["start_s"] = 0.0
    for i, s in enumerate(scenes):
        s["end_f"] = scenes[i + 1]["start_f"] if i + 1 < len(scenes) else s_to_frames(duration)
        if s["end_f"] <= s["start_f"]:
            sys.exit(f"ERRO: cena {s['id']} com duracao <= 0 frames. Revisar words.json.")

    out = {
        "audio_duration_s": duration,
        "duration_frames": s_to_frames(duration),
        "scenes": scenes,
    }
    path = project / "02-transcricao" / "phrases.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    n_phrase = sum(1 for s in scenes if s["kind"] == "phrase")
    n_resp = len(scenes) - n_phrase
    print(f"OK: {path} ({n_phrase} frases, {n_resp} respiros)")
    for s in scenes:
        label = s["phrase"] or "(respiro)"
        print(f"  #{s['id']:02d} {s['start_s']:7.2f}s-{s['end_s']:7.2f}s  {label}")


if __name__ == "__main__":
    main()
