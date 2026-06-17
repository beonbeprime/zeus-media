"""Adapter MANUAL (default): o usuario gera os videos no Freepik na mao."""


def generate_motion(image_path: str, motion_prompt: str,
                    duration_s: int = 5, out_path: str = None) -> dict:
    return {
        "status": "awaiting-user",
        "video_path": None,
        "error": None,
        "instructions": (
            f"Subir {image_path} no Freepik (image-to-video), colar o prompt, "
            f"gerar {duration_s}s e salvar como {out_path or '06-videos/cena-NN.mp4'}."
        ),
    }
