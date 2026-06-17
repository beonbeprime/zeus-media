# Contrato do adapter image-to-video

Toda implementação de motion (manual hoje, API amanhã) cumpre a mesma interface:

```python
def generate_motion(image_path: str, motion_prompt: str,
                    duration_s: int = 5, out_path: str = None) -> dict:
    """Retorna {status, video_path, error}.

    status:
      "ok"            -> video_path aponta o .mp4 gerado
      "awaiting-user" -> fluxo manual: o usuário gera no Freepik e deposita em 06-videos/
      "error"         -> error contém o motivo
    """
```

Implementações:
- `manual.py` (DEFAULT): não gera nada; garante que `prompts-video.md` existe
  (via make-video-prompts.py) e retorna `awaiting-user`.
- `freepik_api.py` (STUB): quando o Allysson disser "quero usar API para o motion",
  pedir a `FREEPIK_API_KEY`, gravar em variável de ambiente ou `.env` do squad e
  implementar: POST image-to-video (Kling via Freepik), polling do job, download
  para `out_path`. Sem a key, retorna `error` orientando o fluxo manual.

O manifest guarda `video.source: "manual" | "api"` por cena. Trocar de adapter
não muda nada no resto do pipeline.
