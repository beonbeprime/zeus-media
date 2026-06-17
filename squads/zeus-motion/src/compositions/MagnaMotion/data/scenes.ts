// ===================================================================
// MagnaMotion — Roteiro de cenas (MONTADO MANUALMENTE)
// Áudio: netflix-v2.mp3 (43.5s, 122 palavras, fala acelerada) — V2
// Tema: red Netflix (Bebas Neue) + trilha iron-surge-1 — IGUAL à v1
// Contexto: aplicativo + recorrência 30 mil + matemática das mentorias
// Correções de grafia do whisper via displayOverride (timing intacto):
//   #73 "copiar"→"colar" | #104-105 "criado zero"→"criado do zero"
// Roteiros anteriores: _versions/scenes.v1-v5
// ===================================================================

import type { MagnaScene } from "../types";

/** Correção global de drift do whisper (ms). + atrasa, - adianta. */
export const GLOBAL_OFFSET_MS = 0;

/** Trilha igual à v1 Netflix: iron-surge-1 (129 BPM), ~13 dB abaixo da voz */
export const MUSIC_FILE: string | null = "audio/magna-motion/iron-surge-1.mp3";
export const MUSIC_VOLUME = 0.055;

export const SCENES: MagnaScene[] = [
  {
    // "você vai criar o seu aplicativo"
    id: "c01-hero",
    layout: "hero",
    lines: [
      { words: [0, 2], size: "headline" },
      { words: [3, 5], size: "hero", emphasis: "gradient" },
    ],
  },
  {
    // "capaz de gerar 30 mil em recorrência todos os meses"
    id: "c02-phrase",
    layout: "phrase",
    accentIcon: "dollar",
    lines: [
      { words: [6, 8], size: "subhead" },
      { words: [9, 12], size: "hero", emphasis: "gradient" },
      { words: [13, 15], size: "subhead", emphasis: "muted" },
    ],
  },
  {
    // "e essas pessoas que assinaram o seu aplicativo também vão comprar mentorias"
    id: "c03-phrase",
    layout: "phrase",
    accentIcon: "users",
    lines: [
      { words: [16, 23], size: "subhead" },
      { words: [24, 27], size: "headline", emphasis: "gradient" },
    ],
  },
  {
    // "se você vender uma mentoria de 3 mil você fez só 3 mil"
    id: "c04-phrase",
    layout: "phrase",
    lines: [
      { words: [28, 31], size: "subhead" },
      { words: [32, 35], size: "headline", emphasis: "gradient" },
      { words: [36, 40], size: "subhead", emphasis: "muted" },
    ],
  },
  {
    // "agora se você vender 10 mentorias de 3 mil você fez 30 mil"
    id: "c05-phrase",
    layout: "phrase",
    lines: [
      { words: [41, 44], size: "subhead" },
      { words: [45, 49], size: "headline" },
      { words: [50, 53], size: "hero", emphasis: "gradient" },
    ],
  },
  {
    // "mais a recorrência do seu aplicativo" — giro de câmera na saída
    id: "c06-phrase",
    layout: "phrase",
    exit: "rotate",
    accentIcon: "trend",
    lines: [
      { words: [54, 56], size: "headline", emphasis: "gradient" },
      { words: [57, 59], size: "subhead" },
    ],
  },
  {
    // "eu vou te entregar tudo o que você precisa saber"
    id: "c07-phrase",
    layout: "phrase",
    lines: [
      { words: [60, 63], size: "subhead" },
      { words: [64, 69], size: "subhead", emphasis: "gradient" },
    ],
  },
  {
    // "para copiar e colar a operação que os meus mentorados estão usando"
    id: "c08-phrase",
    layout: "phrase",
    lines: [
      { words: [70, 73], size: "headline", emphasis: "gradient", displayOverride: ["para", "copiar", "e", "colar"] },
      { words: [74, 75], size: "headline" },
      { words: [76, 81], size: "subhead", emphasis: "muted" },
    ],
  },
  {
    // "para fazer mais de 30 mil todos os meses"
    id: "c09-phrase",
    layout: "phrase",
    lines: [
      { words: [82, 84], size: "subhead" },
      { words: [85, 87], size: "hero", emphasis: "gradient" },
      { words: [88, 90], size: "subhead", emphasis: "muted" },
    ],
  },
  {
    // "se você quiser entender como receber a sua operação"
    id: "c10-act",
    layout: "act",
    lines: [
      { words: [91, 94], size: "headline" },
      { words: [95, 99], size: "headline", emphasis: "gradient" },
    ],
  },
  {
    // "para vender seu aplicativo criado do zero e vender mentoria"
    id: "c11-phrase",
    layout: "phrase",
    lines: [
      { words: [100, 103], size: "subhead" },
      { words: [104, 105], size: "headline", emphasis: "gradient", displayOverride: ["criado", "do zero"] },
      { words: [106, 108], size: "subhead" },
    ],
  },
  {
    // "você vai tocar no botão que tá aqui embaixo entender um pouquinho mais"
    id: "c12-phrase",
    layout: "phrase",
    accentIcon: "arrowDown",
    lines: [
      { words: [109, 113], size: "headline", emphasis: "gradient" },
      { words: [114, 117], size: "subhead" },
      { words: [118, 121], size: "subhead", emphasis: "muted" },
    ],
  },
];
