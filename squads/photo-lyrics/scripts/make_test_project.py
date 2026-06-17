"""Cria a producao de teste _teste-pipeline (dados sinteticos) para validar
03_phrases -> 05_manifest -> check-manifest -> render -> 07_qc sem Lovart/Freepik.
"""

import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PROJ = ROOT / "producoes" / "_teste-pipeline"

# pastas
for d in ["01-musica", "02-transcricao", "05-imagens", "06-videos", "build", "07-render"]:
    (PROJ / d).mkdir(parents=True, exist_ok=True)

# musica sintetica 12s (acordes simples para ter audio audivel)
sr = 44100
dur = 12.0
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
freqs = [220, 277, 330, 220]
audio = np.zeros_like(t)
for i, f in enumerate(freqs):
    mask = (t >= i * 3) & (t < (i + 1) * 3)
    audio[mask] = 0.2 * np.sin(2 * np.pi * f * t[mask])
sf.write(PROJ / "01-musica" / "musica.wav", audio.astype("float32"), sr)

# letra
(PROJ / "01-musica" / "letra.txt").write_text(
    "Quem quer\nser mentor\nvem comigo\nagora já\n", encoding="utf-8")

# words.json sintetico (como se viesse do 02_align)
words = {
    "language": "pt",
    "audio_duration_s": dur,
    "source_mode": "align",
    "lines": [
        {"idx": 0, "text": "Quem quer", "start": 0.4, "end": 2.0,
         "words": [{"text": "Quem", "start": 0.4, "end": 1.1},
                   {"text": "quer", "start": 1.2, "end": 2.0}]},
        {"idx": 1, "text": "ser mentor", "start": 3.0, "end": 4.8,
         "words": [{"text": "ser", "start": 3.0, "end": 3.6},
                   {"text": "mentor", "start": 3.8, "end": 4.8}]},
        {"idx": 2, "text": "vem comigo", "start": 6.1, "end": 7.9,
         "words": [{"text": "vem", "start": 6.1, "end": 6.7},
                   {"text": "comigo", "start": 6.9, "end": 7.9}]},
        {"idx": 3, "text": "agora já", "start": 9.0, "end": 10.5,
         "words": [{"text": "agora", "start": 9.0, "end": 9.8},
                   {"text": "já", "start": 10.0, "end": 10.5}]},
    ],
}
(PROJ / "02-transcricao" / "words.json").write_text(
    json.dumps(words, ensure_ascii=False, indent=2), encoding="utf-8")

# imagens dummy 1080x1920 com o texto nos 2/3 superiores
phrases = ["QUEM QUER", "SER MENTOR", "VEM COMIGO", "AGORA JÁ"]
colors = [(40, 20, 10), (10, 30, 50), (30, 10, 40), (15, 40, 20)]
try:
    font = ImageFont.truetype("arialbd.ttf", 120)
except OSError:
    font = ImageFont.load_default()
for i, (ph, col) in enumerate(zip(phrases, colors), start=1):
    im = Image.new("RGB", (1080, 1920), col)
    dr = ImageDraw.Draw(im)
    dr.text((540, 500), ph, fill=(240, 240, 230), font=font, anchor="mm")
    im.save(PROJ / "05-imagens" / f"cena-{i:02d}.png")

print(f"OK: {PROJ}")
print("Proximo: 03_phrases -> 04_ingest -> 05_manifest -> check -> render -Draft")
