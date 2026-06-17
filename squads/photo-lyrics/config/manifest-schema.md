# manifest.json - Contrato central e máquina de estados

Gerado/atualizado por `05_manifest.py`. O lead e os scripts atualizam blocos;
`overrides.json` é aplicado POR ÚLTIMO (ajustes manuais sobrevivem a regeração).
Validar com `check-manifest.py` antes de cada fase. FULLSAFE ao editar à mão.

## Fases de state.phase

```
intake -> transcribe -> segment -> concepts -> prompts -> images -> validate
-> awaiting-videos -> ingest -> sync -> render-draft -> awaiting-approval
-> render-final -> done
```

(MODO A pula concepts..awaiting-videos.)

## Estrutura

```json
{
  "project": "saudade-de-voce",
  "mode": "B",
  "fps": 30, "width": 1080, "height": 1920,
  "music": {"file": "01-musica/musica.mp3", "lyrics_file": "01-musica/letra.txt",
             "duration_s": 42.7, "duration_frames": 1281},
  "state": {"phase": "awaiting-videos", "phases_done": ["transcribe", "segment"],
             "updated": "2026-06-10T14:32:00Z"},
  "scenes": [
    {
      "id": 1, "kind": "phrase", "slug": "cena-01",
      "phrase": "QUEM QUER VOCÊ",
      "start_s": 0.0, "end_s": 3.4, "start_f": 0, "end_f": 102,
      "motion_refresh": false, "reuse_of": null,
      "concept": {"surface": "garrafa âmbar", "environment": "bar à noite",
                   "palette": "âmbar/escuro", "category": "objeto-bebida"},
      "photo_prompt": "vertical 9:16 photograph ... \"QUEM QUER VOCÊ\" ...",
      "motion_prompt": "slow orbital camera move ...",
      "image": {"path": "05-imagens/cena-01.png", "status": "approved",
                 "attempts": 1,
                 "validation": {"text_read": "QUEM QUER VOCÊ", "ok": true}},
      "video": {"path": "06-videos/cena-01.mp4", "status": "valid", "source": "manual"},
      "media": {"file": "build/norm/cena-01.mp4", "type": "video",
                 "duration_f": 144, "trim_in_f": 42, "trim_out_f": 100,
                 "playback_rate": 1.0, "freeze_after_f": null},
      "motion": "video",
      "match": {"method": "slug", "score": 100}
    }
  ],
  "unmatched": {"phrases": [], "media": []},
  "timeline": {"transition": "cut"},
  "render": {"draft": "07-render/draft-v01.mp4", "final": null, "approved": false}
}
```

## Campos importantes

- `image.status`: pending -> generated -> approved | rejected
- `video.status`: missing | valid; `video.source`: manual | api
- `motion`: video | kenburns-in | kenburns-out | extend-previous
- `kind: respiro`: cena instrumental sem texto (mídia de `05-imagens/respiro/`)
- `reuse_of`: id da 1ª ocorrência da mesma frase (refrão); reusa mídia variando o motion
- Invariantes: `start_f` da 1ª cena = 0; `end_f[n] == start_f[n+1]`;
  última cena termina em `music.duration_frames`.

## overrides.json (ajustes manuais)

```json
{"scenes": {"cena-07": {"start_f": 612, "media": {"trim_in_f": 30}}}}
```
