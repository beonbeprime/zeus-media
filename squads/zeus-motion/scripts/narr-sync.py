#!/usr/bin/env python3
"""
narr-sync.py - Sincronizacao de narracao com cenas do MentoriaEstrutura21Dias

Uso:
    python scripts/narr-sync.py <audio.mp3>

Requer:
    pip install faster-whisper

O que faz:
    1. Transcreve o audio com faster-whisper (word-level timestamps, PT-BR)
    2. Mapeia palavras-gatilho de cada cena para timestamps reais
    3. Calcula nova duracao em frames (30fps) com minimo de 60f por cena
    4. Sobrescreve narr-timing.ts com os novos timings (NARR_STATUS = "synced")
    5. Exibe tabela comparativa original vs novo
"""

import sys
import os
import re
import unicodedata
from pathlib import Path
from datetime import datetime

# ---------------------------------------------------------------------------
# Configuracao
# ---------------------------------------------------------------------------

FPS     = 30
OVERLAP = 7    # frames de overlap entre cenas (identico ao scene-config.ts)
MIN_DUR = 60   # duracao minima por cena em frames (~2s)
PAD_END = 0.5  # segundos de respiro apos ultima palavra na cena final

SCRIPTS_DIR     = Path(__file__).parent
ZEUS_MOTION_DIR = SCRIPTS_DIR.parent
COMPOSITION_DIR = ZEUS_MOTION_DIR / "src" / "compositions" / "MentoriaEstrutura21Dias"
OUTPUT_TS       = COMPOSITION_DIR / "narr-timing.ts"

# ---------------------------------------------------------------------------
# Dados das cenas (espelham SCENES_META do scene-config.ts)
# ---------------------------------------------------------------------------

SCENE_LABELS = [
    "C1 — VENDER MENTORIA",
    "C2 — UM ANO",
    "C3 — TRES MESES",
    "C4 — 21 DIAS",
    "C5 — AREA DE MEMBROS",
    "C6 — PAGINA / AUTOMACOES / ANUNCIOS",
    "C7 — AGENDAR UM HORARIO",
]

ORIGINAL_TIMING: list[tuple[int, int]] = [
    (0,    135),
    (128,  157),
    (278,  157),
    (425,  190),
    (608,  217),
    (818,  307),
    (1118, 232),
]

# Palavras-gatilho para INICIO de cada cena na narracao oficial:
# "Quando voce pensa em VENDER MENTORIA... voce sabe que precisa estruturar
#  algo que sozinho nao vai levar menos do que UM ANO...Com alguem
#  direcionando voce leva uns TRES MESES para voce colocar a mao na massa
#  e construir.Agora se eu te falasse que a gente constroi a estrutura da
#  sua mentoria em 21 DIAS... te entrega uma AREA DE MEMBROS e tambem uma
#  PESSOA PARA FAZER AS VENDAS no seu lugar...Criamos a sua PAGINA DE VENDAS,
#  as AUTOMACOES, os ANUNCIOS, as CAMPANHAS DE TRAFEGO... E voce comeca a
#  vender mentoria em 21 DIAS. Para conhecer, e voce tocar no botao aqui
#  embaixo e AGENDAR UM HORARIO."
#
# Formato: (trigger_normalizado, proximo_word_contexto, ocorrencia_N)
# - trigger_normalizado: sem acentos, minusculas
# - proximo_word_contexto: palavra seguinte para desambiguar repeticoes (ou None)
# - ocorrencia_N: 1=primeira vez que aparece, 2=segunda etc.
TRIGGERS: list[tuple[str | None, str | None, int]] = [
    (None,      None,       1),  # C1: inicio do audio
    ("sozinho", None,       1),  # C2: "sozinho nao vai levar"
    ("alguem",  None,       1),  # C3: "com alguem direcionando"
    ("agora",   "se",       1),  # C4: "agora se eu te falasse" — "agora" com proxima="se"
    ("entrega", "uma",      1),  # C5: "te entrega uma AREA DE MEMBROS"
    ("criamos", None,       1),  # C6: "criamos a sua PAGINA DE VENDAS"
    ("comeca",  None,       1),  # C7: "voce comeca a vender"
]

# ---------------------------------------------------------------------------
# Normalizacao de texto
# ---------------------------------------------------------------------------

def normalize(text: str) -> str:
    """Remove acentos e converte para minusculas (para matching robusto)."""
    nfkd = unicodedata.normalize("NFKD", text)
    ascii_str = "".join(c for c in nfkd if not unicodedata.combining(c))
    return ascii_str.lower()


def clean_word(raw: str) -> str:
    """Remove pontuacao de uma palavra transcrita."""
    return re.sub(r"[^\w]", "", raw.strip())


# ---------------------------------------------------------------------------
# Busca de triggers
# ---------------------------------------------------------------------------

def find_trigger_index(
    words_norm: list[str],
    trigger: str,
    context_next: str | None,
    occurrence: int,
) -> int | None:
    """
    Retorna o indice da palavra trigger (normalizada) no array words_norm.
    Se context_next for fornecido, exige que a palavra seguinte comece com esse contexto.
    occurrence define qual ocorrencia encontrar (1=primeira, 2=segunda, etc.).
    """
    count = 0

    # Tentativa 1: match exato
    for i, w in enumerate(words_norm):
        if w == trigger:
            if context_next is None:
                count += 1
                if count == occurrence:
                    return i
            else:
                # Verificar as proximas 2 palavras para contexto
                for j in range(i + 1, min(i + 3, len(words_norm))):
                    if words_norm[j].startswith(context_next):
                        count += 1
                        if count == occurrence:
                            return i
                        break

    if count >= occurrence:
        return None  # ja encontrado acima

    # Tentativa 2: match parcial (trigger eh substring da palavra transcrita)
    count = 0
    for i, w in enumerate(words_norm):
        if trigger in w and len(trigger) >= 4:
            count += 1
            if count == occurrence:
                return i

    return None


# ---------------------------------------------------------------------------
# Transcricao
# ---------------------------------------------------------------------------

def transcribe(audio_path: str) -> tuple[list[tuple[str, float, float]], float]:
    """
    Transcreve audio com faster-whisper.
    Retorna: ([(palavra, start_s, end_s), ...], duracao_total_s)
    """
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("\nERRO: faster-whisper nao instalado.")
        print("Instale com:")
        print("  pip install faster-whisper")
        print("\nSe nao tiver pip:")
        print("  python -m pip install faster-whisper")
        sys.exit(1)

    print("[narr-sync] Carregando modelo Whisper large-v2 (CPU, int8)...")
    print("            (primeira execucao: faz download do modelo ~1.5GB)")
    model = WhisperModel("large-v2", device="cpu", compute_type="int8")

    print(f"[narr-sync] Transcrevendo '{Path(audio_path).name}'...")
    segments, info = model.transcribe(
        audio_path,
        language="pt",
        word_timestamps=True,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 200},
    )

    words: list[tuple[str, float, float]] = []
    for seg in segments:
        if seg.words:
            for w in seg.words:
                cleaned = clean_word(w.word)
                if cleaned:
                    words.append((cleaned, w.start, w.end))

    duration = info.duration
    print(f"[narr-sync] {len(words)} palavras | duracao: {duration:.2f}s")
    return words, duration


# ---------------------------------------------------------------------------
# Calculo de timing
# ---------------------------------------------------------------------------

def build_timing(
    words: list[tuple[str, float, float]],
    audio_duration: float,
) -> list[tuple[int, int]]:
    """
    Mapeia triggers para timestamps e constroi SCENE_TIMING.
    Retorna lista de (from_frame, duration_frames).
    """
    words_norm  = [normalize(w[0]) for w in words]
    word_starts = [w[1] for w in words]

    print("\n[narr-sync] Mapeando triggers de cena:")

    # Encontrar timestamp de inicio de cada cena
    trigger_times_s: list[float] = []

    for i, (trigger, context, occurrence) in enumerate(TRIGGERS):
        label = SCENE_LABELS[i]

        if trigger is None:
            # C1 sempre comeca no frame 0
            t = 0.0
            trigger_times_s.append(t)
            print(f"  {label}: inicio do audio ({t:.2f}s)")
            continue

        idx = find_trigger_index(words_norm, trigger, context, occurrence)

        if idx is not None:
            t = word_starts[idx]
            trigger_times_s.append(t)
            print(f"  {label}: '{words[idx][0]}' em {t:.2f}s (palavra #{idx})")
        else:
            # Fallback: estimar proporcional a duracao do audio
            orig_from, _ = ORIGINAL_TIMING[i]
            orig_total   = ORIGINAL_TIMING[-1][0] + ORIGINAL_TIMING[-1][1]
            ratio        = orig_from / orig_total
            t            = ratio * audio_duration
            trigger_times_s.append(t)
            print(f"  {label}: TRIGGER '{trigger}' NAO ENCONTRADO — estimativa em {t:.2f}s")

    # Calcular duracao de cada cena (em frames)
    # Cena i dura: proximo_trigger - trigger_atual
    durations_f: list[int] = []
    for i in range(len(trigger_times_s)):
        start_s = trigger_times_s[i]
        if i + 1 < len(trigger_times_s):
            end_s = trigger_times_s[i + 1]
        else:
            end_s = audio_duration + PAD_END

        dur_s = max(0.0, end_s - start_s)
        dur_f = max(MIN_DUR, round(dur_s * FPS))
        durations_f.append(dur_f)

    # Recalcular FROM com overlap entre cenas
    result: list[tuple[int, int]] = []
    for i, dur_f in enumerate(durations_f):
        if i == 0:
            from_f = 0
        else:
            prev_from, prev_dur = result[i - 1]
            from_f = prev_from + prev_dur - OVERLAP
        result.append((from_f, dur_f))

    return result


# ---------------------------------------------------------------------------
# Escrita do arquivo TypeScript
# ---------------------------------------------------------------------------

def write_narr_timing(
    timing: list[tuple[int, int]],
    audio_path: str,
) -> None:
    """Sobrescreve narr-timing.ts com o novo timing calculado."""
    total_frames = timing[-1][0] + timing[-1][1]
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    audio_name = Path(audio_path).name

    lines: list[str] = []
    for i, (from_f, dur_f) in enumerate(timing):
        dur_s = dur_f / FPS
        # Reconstituir label com acentuacao para o comentario TS
        labels_accented = [
            "C1 — VENDER MENTORIA",
            "C2 — UM ANO",
            "C3 — TRES MESES",
            "C4 — 21 DIAS",
            "C5 — AREA DE MEMBROS",
            "C6 — PAGINA / AUTOMACOES / ANUNCIOS",
            "C7 — AGENDAR UM HORARIO",
        ]
        label = labels_accented[i]
        lines.append(f"  [{from_f:5d}, {dur_f:4d}],  // {label} — {dur_s:.1f}s")

    timing_block = "\n".join(lines)

    content = f"""// ===================================================================
// narr-timing.ts — Timing sincronizado com narração real
// ⚠️  ARQUIVO AUTO-GERADO por scripts/narr-sync.py — não editar
//     Execute: python scripts/narr-sync.py <audio.mp3>
// ===================================================================

// STATUS: sincronizado com narração real
// Audio: {audio_name}
// Gerado em: {now}

export const NARR_STATUS: "original" | "synced" = "synced";

// Timing calculado da transcrição real (faster-whisper, PT-BR)
// Formato: [from, durationInFrames][]
export const NARR_SCENE_TIMING: [number, number][] = [
{timing_block}
];

export const TOTAL_FRAMES_NARR = {total_frames};
"""

    OUTPUT_TS.write_text(content, encoding="utf-8")


# ---------------------------------------------------------------------------
# Relatorio comparativo
# ---------------------------------------------------------------------------

def print_report(new_timing: list[tuple[int, int]]) -> None:
    """Exibe tabela comparativa original vs novo timing."""
    print("\n" + "=" * 72)
    print("  COMPARATIVO — Original (briefing) vs Sincronizado (narracao real)")
    print("=" * 72)
    print(
        f"  {'Cena':<32} "
        f"{'Orig from':>9} {'Orig dur':>8} "
        f"{'Novo from':>9} {'Novo dur':>8} {'Delta':>7}"
    )
    print("-" * 72)

    for i, ((new_from, new_dur), (orig_from, orig_dur)) in enumerate(
        zip(new_timing, ORIGINAL_TIMING)
    ):
        parts  = SCENE_LABELS[i].split(" — ")
        label  = (parts[1] if len(parts) > 1 else parts[0])[:30]
        delta  = new_dur - orig_dur
        d_str  = f"{delta:+d}f"
        print(
            f"  {label:<32} "
            f"{orig_from:>9} {orig_dur:>7}f "
            f"{new_from:>9} {new_dur:>7}f {d_str:>7}"
        )

    orig_total = ORIGINAL_TIMING[-1][0] + ORIGINAL_TIMING[-1][1]
    new_total  = new_timing[-1][0] + new_timing[-1][1]
    print("-" * 72)
    print(
        f"  {'TOTAL':<32} "
        f"{orig_total:>17}f {new_total:>17}f {new_total - orig_total:>+7}f"
    )
    print(
        f"  {'':<32} "
        f"{orig_total / FPS:>16.1f}s {new_total / FPS:>16.1f}s"
    )
    print("=" * 72)


# ---------------------------------------------------------------------------
# Ponto de entrada
# ---------------------------------------------------------------------------

def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        print("Exemplo:")
        print("  python scripts/narr-sync.py public/narracao.mp3")
        sys.exit(0)

    audio_path = sys.argv[1]

    if not Path(audio_path).exists():
        print(f"ERRO: arquivo nao encontrado: {audio_path}")
        sys.exit(1)

    if not OUTPUT_TS.parent.exists():
        print(f"ERRO: pasta de composicao nao encontrada: {OUTPUT_TS.parent}")
        sys.exit(1)

    print(f"\n[narr-sync] MentoriaEstrutura21Dias — Sincronizacao de narracao")
    print(f"[narr-sync] Audio:  {audio_path}")
    print(f"[narr-sync] Output: {OUTPUT_TS}\n")

    # 1. Transcrever
    words, audio_duration = transcribe(audio_path)

    # 2. Exibir transcript (para validacao manual)
    print("\n[narr-sync] Transcript completo:")
    transcript = " ".join(w[0] for w in words)
    # Quebrar em linhas de ~80 chars
    for chunk in re.findall(r".{1,80}(?:\s|$)", transcript):
        print(f"  {chunk.rstrip()}")

    # 3. Calcular timing
    new_timing = build_timing(words, audio_duration)

    # 4. Exibir relatorio
    print_report(new_timing)

    # 5. Escrever narr-timing.ts
    write_narr_timing(new_timing, audio_path)
    print(f"\n[narr-sync] narr-timing.ts atualizado com NARR_STATUS = 'synced'")
    print("[narr-sync] Pronto! Reinicie o Remotion Studio para ver o novo timing.")
    print("            npx remotion studio  (execute em squads/zeus-motion/)")


if __name__ == "__main__":
    main()
