"""Adapter API Freepik (STUB - ativar quando o Allysson mandar a API key).

Quando ativado, implementar:
1. POST https://api.freepik.com/v1/ai/image-to-video (modelo Kling/equivalente)
   headers: {"x-freepik-api-key": FREEPIK_API_KEY}
   body: imagem base64 + prompt + duration
2. Polling do job ate status completed.
3. Download do mp4 para out_path.

Ate la, retorna erro orientando o fluxo manual.
"""

import os


def generate_motion(image_path: str, motion_prompt: str,
                    duration_s: int = 5, out_path: str = None) -> dict:
    key = os.environ.get("FREEPIK_API_KEY")
    if not key:
        return {
            "status": "error",
            "video_path": None,
            "error": ("FREEPIK_API_KEY ausente. Pedir a key ao Allysson e gravar "
                      "no ambiente; ate la usar o adapter manual (prompts-video.md)."),
        }
    return {
        "status": "error",
        "video_path": None,
        "error": ("Adapter API ainda nao implementado (stub). Implementar o fluxo "
                  "descrito no docstring quando o modo API for ativado."),
    }
