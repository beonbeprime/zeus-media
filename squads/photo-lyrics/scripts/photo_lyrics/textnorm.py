"""Normalizacao de texto para matching fuzzy e slugs.

- normalize(): NFC, minusculas, sem acento, sem pontuacao (SO para comparacao;
  o texto exibido nas imagens SEMPRE mantem acentos).
- slugify(): nome de arquivo a partir da frase ("Quem quer" -> "quem-quer").
"""

import re
import unicodedata


def nfc(text: str) -> str:
    return unicodedata.normalize("NFC", text)


def strip_accents(text: str) -> str:
    decomposed = unicodedata.normalize("NFD", text)
    return "".join(c for c in decomposed if unicodedata.category(c) != "Mn")


def normalize(text: str) -> str:
    """Forma canonica para comparacao fuzzy (nunca para exibicao)."""
    text = strip_accents(nfc(text)).lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def slugify(text: str) -> str:
    text = normalize(text)
    return re.sub(r"\s+", "-", text)


def read_text_utf8(path) -> str:
    """Le arquivo texto tolerando BOM e CRLF do Windows."""
    with open(path, "r", encoding="utf-8-sig") as f:
        return nfc(f.read().replace("\r\n", "\n"))
