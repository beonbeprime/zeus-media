// ===================================================================
// narr-timing.ts — Timing sincronizado com narração real
// ⚠️  ARQUIVO AUTO-GERADO por scripts/narr-sync.py — não editar
//     Execute: python scripts/narr-sync.py <audio.mp3>
// ===================================================================

// STATUS: sincronizado com narração real
// Audio: ads 05 narrador.mp3
// Gerado em: 2026-05-21 12:01

export const NARR_STATUS: "original" | "synced" = "synced";

// Timing calculado da transcrição real (faster-whisper, PT-BR)
// Formato: [from, durationInFrames][]
export const NARR_SCENE_TIMING: [number, number][] = [
  [    0,  134],  // C1 — VENDER MENTORIA — 4.5s
  [  127,   94],  // C2 — UM ANO — 3.1s
  [  214,  158],  // C3 — TRES MESES — 5.3s
  [  365,  156],  // C4 — 21 DIAS — 5.2s
  [  514,  152],  // C5 — AREA DE MEMBROS — 5.1s
  [  659,  181],  // C6 — PAGINA / AUTOMACOES / ANUNCIOS — 6.0s
  [  833,  257],  // C7 — AGENDAR UM HORARIO — 8.6s (extendido para cobrir fim do audio)
];

export const TOTAL_FRAMES_NARR = 1090;
