"""05_manifest.py - Monta/atualiza o manifest.json (contrato central).

Uso:
    .venv\\Scripts\\python scripts\\05_manifest.py --project producoes\\meu-projeto

Junta:
- 02-transcricao/phrases.json   (cenas com frames)
- build/media-scan.json         (midia inventariada)
- build/media-map.json          (opcional: texto visto por visao em cada midia)
- overrides.json                (opcional: ajustes manuais, aplicados POR ULTIMO)
- manifest.json existente       (preserva state, concept, prompts, validacao)

Matching frase x midia (3 niveis):
1. slug exato do arquivo == slug da cena (cena-01) ou slug do texto (quem-quer)
2. fuzzy do texto visto por visao (rapidfuzz token_set_ratio >= 70)
3. sem match -> entra em unmatched (bloqueia render; resolver via overrides)

Trim de video (cena precisa de N frames, clipe tem M):
- janela util = [18, M-6] (inicio de image-to-video e estatico; fim pode ter fade)
- centraliza a cena no meio da janela; reuso de refrao desloca a janela
- cena > janela: playback_rate = util/needed se >= 0.8, senao freeze do ultimo frame
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from photo_lyrics.textnorm import normalize, slugify

try:
    from rapidfuzz import fuzz
except ImportError:
    fuzz = None

FUZZ_ACCEPT = 70
FUZZ_REVIEW = 50
HEAD_SKIP = 18
TAIL_SKIP = 6
PREROLL_F = 30   # respiro maximo antes da 1a frase (1s) ao cortar silencio
OUTRO_F = 60     # respiro maximo depois da ultima frase (2s)


def load_json(path: Path, default=None):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def match_media(scene, media_items, media_map, used_videos):
    """Retorna (video_item, image_item, method, score)."""
    s_slug = scene.get("slug", "")            # cena-01
    t_slug = scene.get("slug_text", "")       # quem-quer
    norm_phrase = normalize(scene.get("phrase", ""))

    def seen_text(item):
        for m in media_map:
            if m.get("file") == item["file"]:
                return m.get("seen_text", "")
        return ""

    best = {"video": None, "image": None, "method": None, "score": 0}
    for item in media_items:
        if item["slug"] == "respiro":
            continue
        if item["type"] == "video" and item["file"] in used_videos and scene.get("reuse_of") is None:
            continue  # video ja consumido por outra frase (refrao reusa de proposito)
        stem = item["slug"]
        method, score = None, 0
        if stem in (s_slug, t_slug) or slugify(stem) in (s_slug, t_slug):
            method, score = "slug", 100
        elif fuzz and norm_phrase:
            st = normalize(seen_text(item))
            if st:
                sc = fuzz.token_set_ratio(st, norm_phrase)
                if sc >= FUZZ_ACCEPT:
                    method, score = "vision-fuzzy", int(sc)
        if not method:
            continue
        kind = item["type"]
        if best[kind] is None or score > best[kind][1]:
            best[kind] = (item, score)
        if score > best["score"]:
            best["method"], best["score"] = method, score
    return best


def compute_trim(needed_f, clip_f, reused: bool):
    """Retorna (trim_in, trim_out, rate, loop). NUNCA congela: cena maior que a
    janela util roda em camera lenta sutil (>= 0.8) e, se ainda faltar, faz LOOP
    da janela. Video parado e proibido (regra do squad)."""
    usable_start, usable_end = HEAD_SKIP, max(HEAD_SKIP + 1, clip_f - TAIL_SKIP)
    usable = usable_end - usable_start
    if usable >= needed_f:
        if reused:
            trim_in = usable_start
        else:
            trim_in = usable_start + (usable - needed_f) // 2
        return trim_in, trim_in + needed_f, 1.0, False
    rate = usable / needed_f
    if rate >= 0.8:
        return usable_start, usable_end, round(rate, 3), False
    # estica ate 0.85 para suavizar e repete a janela em loop pelo restante
    return usable_start, usable_end, 0.85, True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    args = ap.parse_args()
    project = Path(args.project).resolve()

    phrases = load_json(project / "02-transcricao" / "phrases.json")
    if not phrases:
        sys.exit("ERRO: rode 03_phrases.py antes.")
    scan = load_json(project / "build" / "media-scan.json", {"items": []})
    media_map = load_json(project / "build" / "media-map.json", [])
    overrides = load_json(project / "overrides.json", {})
    old = load_json(project / "manifest.json", {})

    old_scenes = {s.get("slug"): s for s in old.get("scenes", [])}
    music_files = sorted((project / "01-musica").glob("*"))
    music = next((f"01-musica/{p.name}" for p in music_files
                  if p.suffix.lower() in {".mp3", ".wav", ".m4a", ".flac"}), None)
    if not music:
        sys.exit("ERRO: sem musica em 01-musica/")

    respiro_pool = [i for i in scan["items"] if i["slug"] == "respiro"]
    respiro_idx = 0
    used_videos: set[str] = set()
    scenes_out, unmatched_phrases = [], []

    for sc in phrases["scenes"]:
        needed_f = sc["end_f"] - sc["start_f"]
        prev = old_scenes.get(sc.get("slug"), {})
        out = {
            "id": sc["id"], "kind": sc["kind"], "slug": sc.get("slug"),
            "phrase": sc.get("phrase", ""),
            "start_s": sc["start_s"], "end_s": sc["end_s"],
            "start_f": sc["start_f"], "end_f": sc["end_f"],
            "motion_refresh": sc.get("motion_refresh", False),
            "reuse_of": sc.get("reuse_of"),
            # preservados entre regeracoes:
            "concept": prev.get("concept"),
            "photo_prompt": prev.get("photo_prompt"),
            "motion_prompt": prev.get("motion_prompt"),
            "image": prev.get("image", {"path": None, "status": "pending",
                                        "validation": None}),
            "video": prev.get("video", {"path": None, "status": "missing",
                                        "source": "manual"}),
        }

        if sc["kind"] == "respiro":
            if respiro_pool:
                item = respiro_pool[respiro_idx % len(respiro_pool)]
                respiro_idx += 1
                out["media"] = {"file": item["file"], "type": "image"}
                out["motion"] = "kenburns-in" if sc["id"] % 2 == 0 else "kenburns-out"
            else:
                out["media"] = None
                out["motion"] = "extend-previous"
            scenes_out.append(out)
            continue

        best = match_media(out, scan["items"], media_map, used_videos)
        vid = best["video"][0] if best["video"] else None
        img = best["image"][0] if best["image"] else None
        reused = out["reuse_of"] is not None

        if vid:
            used_videos.add(vid["file"])
            trim_in, trim_out, rate, loop = compute_trim(
                needed_f, vid["duration_f"], reused)
            out["media"] = {"file": vid["norm_file"], "type": "video",
                            "duration_f": vid["duration_f"],
                            "trim_in_f": trim_in, "trim_out_f": trim_out,
                            "playback_rate": rate, "loop": loop}
            out["motion"] = "video"
            out["video"] = {"path": vid["file"], "status": "valid",
                            "source": out["video"].get("source", "manual")}
        elif img:
            out["media"] = {"file": img["file"], "type": "image"}
            base = "kenburns-out" if reused else (
                "kenburns-in" if sc["id"] % 2 == 0 else "kenburns-out")
            out["motion"] = base
            out["image"]["path"] = img["file"]
        else:
            out["media"] = None
            out["motion"] = None
            unmatched_phrases.append({"id": sc["id"], "phrase": out["phrase"]})

        out["match"] = {"method": best["method"], "score": best["score"]}
        scenes_out.append(out)

    matched_files = {s["media"]["file"] for s in scenes_out
                     if s.get("media") and s["media"].get("file")}
    matched_src = {s["video"]["path"] for s in scenes_out
                   if s.get("video") and s["video"].get("path")}
    unmatched_media = [i["file"] for i in scan["items"]
                       if i["slug"] != "respiro"
                       and i["file"] not in matched_files
                       and i.get("norm_file") not in matched_files
                       and i["file"] not in matched_src]

    manifest = {
        "project": project.name,
        "mode": old.get("mode", "A"),
        "fps": 30, "width": 1080, "height": 1920,
        "music": {"file": music,
                  "lyrics_file": "01-musica/letra.txt"
                  if (project / "01-musica" / "letra.txt").exists() else None,
                  "duration_s": phrases["audio_duration_s"],
                  "duration_frames": phrases["duration_frames"]},
        "state": old.get("state", {"phase": "sync", "phases_done": []}),
        "scenes": scenes_out,
        "unmatched": {"phrases": unmatched_phrases, "media": unmatched_media},
        "timeline": old.get("timeline", {"transition": "cut"}),
        "render": old.get("render", {"draft": None, "final": None, "approved": False}),
    }

    # overrides por ultimo (sobrevivem a regeracao)
    for slug, ov in overrides.get("scenes", {}).items():
        for s in manifest["scenes"]:
            if s["slug"] == slug:
                for k, v in ov.items():
                    if isinstance(v, dict) and isinstance(s.get(k), dict):
                        s[k].update(v)
                    else:
                        s[k] = v

    # corte de silencio (padrao: ativo; desativar com {"trim_silence": false} no overrides)
    start_offset = 0
    end_trim = 0
    if overrides.get("trim_silence", True):
        sc = manifest["scenes"]
        first = sc[0] if sc else None
        if first and first["kind"] == "respiro" and not first.get("media") \
                and (first["end_f"] - first["start_f"]) > PREROLL_F:
            start_offset = (first["end_f"] - first["start_f"]) - PREROLL_F
        last = sc[-1] if sc else None
        if last and last["kind"] == "respiro" \
                and (last["end_f"] - last["start_f"]) > OUTRO_F:
            end_trim = (last["end_f"] - last["start_f"]) - OUTRO_F
        if start_offset:
            for s in sc:
                s["start_f"] = max(0, s["start_f"] - start_offset)
                s["end_f"] = max(0, s["end_f"] - start_offset)
        if end_trim:
            sc[-1]["end_f"] -= end_trim
    manifest["music"]["start_offset_f"] = start_offset
    manifest["music"]["end_trim_f"] = end_trim
    if start_offset or end_trim:
        print(f"  Silencio cortado: {start_offset} frames na intro, {end_trim} no final")

    manifest["state"]["updated"] = datetime.now(timezone.utc).isoformat()
    out_path = project / "manifest.json"
    out_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2),
                        encoding="utf-8")

    n_vid = sum(1 for s in scenes_out if s.get("motion") == "video")
    n_kb = sum(1 for s in scenes_out if (s.get("motion") or "").startswith("kenburns"))
    print(f"OK: {out_path}")
    print(f"  {n_vid} cenas com video, {n_kb} com Ken Burns")
    if unmatched_phrases:
        print(f"  PENDENTE: {len(unmatched_phrases)} frases sem midia (bloqueia render):")
        for u in unmatched_phrases:
            print(f"    #{u['id']} {u['phrase']}")
    if unmatched_media:
        print(f"  AVISO: {len(unmatched_media)} arquivos de midia sem frase: {unmatched_media}")


if __name__ == "__main__":
    main()
