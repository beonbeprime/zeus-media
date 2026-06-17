"""Fonte UNICA de conversao segundos -> frames do squad photo-lyrics.

Nenhum outro modulo pode converter tempo. O Remotion recebe frames prontos.
"""

FPS = 30


def s_to_frames(seconds: float) -> int:
    return round(seconds * FPS)


def frames_to_s(frames: int) -> float:
    return frames / FPS
