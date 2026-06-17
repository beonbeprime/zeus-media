"""Smoke test da Fase 0: imports + faster-whisper em GPU (fallback CPU)."""

import os
import tempfile

import numpy as np
import soundfile as sf

print("--- imports ---")
import demucs  # noqa: F401,E402
print("demucs OK")
import stable_whisper  # noqa: F401,E402
print("stable-ts OK")
from faster_whisper import WhisperModel  # noqa: E402
print("faster-whisper OK")

print("--- faster-whisper small GPU ---")
sr = 16000
t = np.linspace(0, 5, sr * 5)
wav = (0.1 * np.sin(2 * np.pi * 220 * t)).astype("float32")
tmp = os.path.join(tempfile.gettempdir(), "pl-smoke.wav")
sf.write(tmp, wav, sr)

try:
    m = WhisperModel("small", device="cuda", compute_type="int8_float16")
    segs, info = m.transcribe(tmp, language="pt")
    list(segs)
    print("GPU faster-whisper OK")
except Exception as e:  # noqa: BLE001
    print("GPU faster-whisper FALHOU:", e)
    m = WhisperModel("small", device="cpu", compute_type="int8")
    segs, info = m.transcribe(tmp, language="pt")
    list(segs)
    print("CPU fallback OK")
