#!/usr/bin/env python3
"""
REELS ZOOM - Script de Reenquadramento Magna
============================================
Transforma video Zoom horizontal em Reels 9:16 vertical.
Centraliza rostos medindo POSICAO DOS OLHOS (nao scan de brilho).
Espacos iguais topo/base e iguais nas laterais.

Padrao Magna fixo: 25% preto / 25% rosto1 / 25% rosto2 / 25% preto

Uso:
  python reframe.py video-zoom.mp4 output-reels.mp4
  python reframe.py video-zoom.mp4 output-reels.mp4 --final
  python reframe.py video-zoom.mp4 output-reels.mp4 --segments "[[2.1,15.4],[18.0,32.5]]"

Dependencias:
  pip install opencv-python mediapipe numpy
  ffmpeg instalado e no PATH
"""

import cv2
import numpy as np
import subprocess
import sys
import os
import json
import argparse
from pathlib import Path

# ─── Tentar importar MediaPipe (mais preciso para olhos) ───────────────────────
try:
    import mediapipe as mp
    USE_MEDIAPIPE = True
except ImportError:
    USE_MEDIAPIPE = False

# ─── PADRAO MAGNA FIXO (nunca alterar) ────────────────────────────────────────
DRAFT_W,  DRAFT_H  = 720,  1280
FINAL_W,  FINAL_H  = 1080, 1920
FACE_FRAC = 0.25      # cada rosto = 25% da altura total
EYE_FRAC  = 0.35      # linha dos olhos fica a 35% do topo do slot
FACE_FILL  = 0.45     # rosto ocupa 45% da largura visivel do slot (zoom apertado, sem sobras)

# MediaPipe: indices dos landmarks relevantes
# Oval do rosto (68 pontos da borda)
OVAL_IDX = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,
            379,378,400,377,152,148,176,149,150,136,172,58,132,93,
            234,127,162,21,54,103,67,109]

# Olho esquerdo (iris + contorno interno)
LEFT_EYE_IDX  = [33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246]
# Olho direito
RIGHT_EYE_IDX = [263,249,390,373,374,380,381,382,362,398,384,385,386,387,388,466]


# ─── Deteccao de rostos ────────────────────────────────────────────────────────

class FaceDetector:
    def __init__(self):
        global USE_MEDIAPIPE
        if USE_MEDIAPIPE:
            try:
                self.fm = mp.solutions.face_mesh.FaceMesh(
                    static_image_mode=False,
                    max_num_faces=2,
                    refine_landmarks=True,
                    min_detection_confidence=0.7,
                    min_tracking_confidence=0.7
                )
            except AttributeError:
                # MediaPipe 0.10.x mudou a API - fallback para OpenCV Haar
                print("  [INFO] MediaPipe solutions API indisponivel (v0.10.x), usando OpenCV Haar.")
                USE_MEDIAPIPE = False
                cascade = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
                self.cascade = cv2.CascadeClassifier(cascade)
        else:
            cascade = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.cascade = cv2.CascadeClassifier(cascade)

    def detect(self, frame_rgb):
        """
        Retorna lista de dicts com info de cada rosto.
        Campos: cx, cy, ex, ey, fw, fh, x1, y1, x2, y2
        ex/ey = centro dos olhos (referencia principal)
        cx/cy = centro do rosto (bounding box)
        """
        h, w = frame_rgb.shape[:2]
        faces = []

        if USE_MEDIAPIPE:
            results = self.fm.process(frame_rgb)
            if not results.multi_face_landmarks:
                return faces

            for lm_set in results.multi_face_landmarks:
                # Bounding box do rosto (oval landmarks)
                oval_pts = [(lm_set.landmark[i].x * w,
                             lm_set.landmark[i].y * h) for i in OVAL_IDX]
                xs = [p[0] for p in oval_pts]
                ys = [p[1] for p in oval_pts]
                x1, y1 = min(xs), min(ys)
                x2, y2 = max(xs), max(ys)

                # Centro dos olhos (media dos pontos de ambos os olhos)
                eye_pts = (
                    [(lm_set.landmark[i].x * w, lm_set.landmark[i].y * h)
                     for i in LEFT_EYE_IDX + RIGHT_EYE_IDX]
                )
                ex = float(np.mean([p[0] for p in eye_pts]))
                ey = float(np.mean([p[1] for p in eye_pts]))

                faces.append({
                    'cx': (x1 + x2) / 2,
                    'cy': (y1 + y2) / 2,
                    'ex': ex,
                    'ey': ey,
                    'fw': x2 - x1,
                    'fh': y2 - y1,
                    'x1': x1, 'y1': y1,
                    'x2': x2, 'y2': y2,
                })

        else:
            # Fallback OpenCV: sem landmarks de olhos, usar posicao aproximada
            gray = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2GRAY)
            dets = self.cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80)
            )
            for (x, y, fw, fh) in dets:
                cx = x + fw / 2
                cy = y + fh / 2
                # Olhos ficam a ~30% da altura do rosto a partir do topo
                ey_approx = y + fh * 0.30
                faces.append({
                    'cx': cx, 'cy': cy,
                    'ex': cx, 'ey': ey_approx,
                    'fw': fw, 'fh': fh,
                    'x1': float(x), 'y1': float(y),
                    'x2': float(x + fw), 'y2': float(y + fh),
                })

        return faces


# ─── Algoritmo de crop centrado nos olhos ─────────────────────────────────────

def eye_centered_crop(face, frame_w, frame_h, slot_w, slot_h,
                      eye_frac=EYE_FRAC, face_fill=FACE_FILL):
    """
    Calcula (crop_x, crop_y, crop_w, crop_h) no frame original tal que:

    VERTICAL:
      - Linha dos olhos fica a EYE_FRAC (35%) do topo do slot
      - Espaco acima dos olhos = EYE_FRAC * slot_h
      - Espaco abaixo dos olhos = (1 - EYE_FRAC) * slot_h

    HORIZONTAL:
      - Rosto centralizado (espaco igual esquerda e direita)
      - Largura do crop = fw / face_fill (rosto ocupa face_fill% da largura)
      - scale=W:-2 depois upscala para slot_w (zero distorcao)

    O crop e sempre proporcional (aspect = slot_w / slot_h).
    Nunca sai dos limites do frame.
    """
    ex, ey = face['ex'], face['ey']
    cx     = face['cx']
    fw     = face['fw']

    slot_aspect = slot_w / slot_h  # ex: 720/320 = 2.25

    # Largura do crop baseada no ROSTO (nao no slot)
    # face_fill=0.45 significa rosto ocupa 45% da largura visivel
    # crop mais apertado = rosto mais proximo = sem sobras laterais
    crop_w = int(fw / face_fill)

    # Minimo razoavel: nunca menor que 1.5x a largura do rosto
    crop_w = max(crop_w, int(fw * 1.5))

    # Maximo: nunca maior que 80% da largura do frame (evita pegar o outro rosto)
    crop_w = min(crop_w, int(frame_w * 0.5))

    # Altura proporcional ao slot_aspect
    crop_h = int(crop_w / slot_aspect)

    # Y: linha dos olhos a EYE_FRAC do topo do crop
    crop_y = int(ey - eye_frac * crop_h)

    # X: rosto centralizado (espaco igual esquerda/direita)
    crop_x = int(cx - crop_w / 2)

    # Clamp para nao sair do frame
    crop_x = max(0, min(crop_x, frame_w - crop_w))
    crop_y = max(0, min(crop_y, frame_h - crop_h))

    # Ajustar se ultrapassar borda direita/inferior
    if crop_x + crop_w > frame_w:
        crop_w = frame_w - crop_x
        crop_h = int(crop_w / slot_aspect)
    if crop_y + crop_h > frame_h:
        crop_h = frame_h - crop_y

    return (crop_x, crop_y, crop_w, crop_h)


def verify_no_distortion(crop, slot_w, slot_h, label=""):
    """Verifica que scale=W:-2 nao vai distorcer"""
    cw, ch = crop[2], crop[3]
    if cw == 0 or ch == 0:
        return
    fx = slot_w / cw
    fy = slot_h / ch
    diff = abs(fx - fy)
    if diff > 0.05:
        print(f"  AVISO [{label}]: scale diferente (fX={fx:.3f} fY={fy:.3f}) "
              f"-> usando scale={slot_w}:-2 + crop para corrigir. Zero distorcao garantido.")


# ─── Mapa de rostos (analise do video) ────────────────────────────────────────

def build_face_map(video_path, sample_every=0.5):
    """
    Amostra o video a cada sample_every segundos.
    Retorna crop mediano de cada rosto (mais estavel que qualquer frame individual).
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise IOError(f"Nao foi possivel abrir: {video_path}")

    fps      = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frame_w  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_h  = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = n_frames / fps

    print(f"  Video: {frame_w}x{frame_h}, {fps:.1f}fps, {duration:.1f}s")

    slot_w = DRAFT_W
    slot_h = int(DRAFT_H * FACE_FRAC)   # 320px (25% de 1280)

    detector  = FaceDetector()
    step      = max(1, int(fps * sample_every))

    crops_host  = []
    crops_guest = []

    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % step == 0:
            rgb   = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            faces = detector.detect(rgb)

            if len(faces) >= 2:
                # Ordenar pela posicao X: lado esquerdo = convidado, direito = host
                faces.sort(key=lambda f: f['cx'])
                guest = faces[0]   # esquerda
                host  = faces[1]   # direita (Allysson)

                ch = eye_centered_crop(host,  frame_w, frame_h, slot_w, slot_h)
                cg = eye_centered_crop(guest, frame_w, frame_h, slot_w, slot_h)

                crops_host.append(ch)
                crops_guest.append(cg)

        frame_idx += 1

    cap.release()

    if not crops_host:
        raise ValueError(
            "Nao foram detectados 2 rostos. "
            "Verifique se o video tem 2 pessoas visíveis."
        )

    print(f"  Amostras com 2 rostos detectados: {len(crops_host)}")

    def median_crop(crops):
        return (
            int(np.median([c[0] for c in crops])),
            int(np.median([c[1] for c in crops])),
            int(np.median([c[2] for c in crops])),
            int(np.median([c[3] for c in crops])),
        )

    return median_crop(crops_host), median_crop(crops_guest), frame_w, frame_h, duration


# ─── FFmpeg filter complex ─────────────────────────────────────────────────────

def build_filter_complex(segments, crop_host, crop_guest, out_w, out_h):
    """
    Monta filter_complex para concatenar segmentos com rostos empilhados.
    Inclui video E audio sincronizados (atrim + asetpts + afade).

    Layout final (9:16):
      [preto 25%] [host 25%] [convidado 25%] [preto 25%]

    Cada rosto: scale=out_w:-2 (proporcional) + crop:out_w:slot_h para slot exato.
    Nunca scale=W:H direto (distorcao zero garantida).
    """
    slot_h = out_h // 4   # 25%
    pad_h  = out_h // 4   # 25%

    cx1, cy1, cw1, ch1 = crop_host
    cx2, cy2, cw2, ch2 = crop_guest

    lines  = []
    concat_inputs = []

    for i, (start, end) in enumerate(segments):
        dur = end - start

        # --- VIDEO ---
        # Split em dois streams (top e bot)
        lines.append(
            f"[0:v]trim=start={start:.3f}:end={end:.3f},"
            f"setpts=PTS-STARTPTS,split[v{i}a][v{i}b];"
        )

        # Host (cima): crop -> scale proporcional -> pad para slot exato
        lines.append(
            f"[v{i}a]crop={cw1}:{ch1}:{cx1}:{cy1},"
            f"scale={out_w}:-2:flags=lanczos,"
            f"pad={out_w}:{slot_h}:(ow-iw)/2:(oh-ih)/2:black[top{i}];"
        )

        # Convidado (baixo)
        lines.append(
            f"[v{i}b]crop={cw2}:{ch2}:{cx2}:{cy2},"
            f"scale={out_w}:-2:flags=lanczos,"
            f"pad={out_w}:{slot_h}:(ow-iw)/2:(oh-ih)/2:black[bot{i}];"
        )

        # Padding preto
        lines.append(f"color=c=black:s={out_w}x{pad_h}:d={dur:.3f}[ptop{i}];")
        lines.append(f"color=c=black:s={out_w}x{pad_h}:d={dur:.3f}[pbot{i}];")

        # Stack 4 camadas
        lines.append(
            f"[ptop{i}][top{i}][bot{i}][pbot{i}]vstack=inputs=4[seg{i}];"
        )

        # --- AUDIO (sincronizado com cada segmento de video) ---
        fade_out_start = dur - 0.015
        lines.append(
            f"[0:a]atrim=start={start:.3f}:end={end:.3f},"
            f"asetpts=PTS-STARTPTS,"
            f"afade=t=in:st=0:d=0.015,"
            f"afade=t=out:st={fade_out_start:.3f}:d=0.015[a{i}];"
        )

        concat_inputs.append(f"[seg{i}][a{i}]")

    # Concat final: video + audio sincronizados
    n = len(segments)
    lines.append(f"{''.join(concat_inputs)}concat=n={n}:v=1:a=1[vout][aout]")

    return "\n".join(lines)


# ─── Pipeline principal ────────────────────────────────────────────────────────

def reframe(video_path, output_path, segments=None, draft=True, flip_sides=False):
    """
    Pipeline completo de reenquadramento.

    flip_sides=True: trocar host e convidado (se Allysson estiver no lado esquerdo)
    """
    out_w = DRAFT_W if draft else FINAL_W
    out_h = DRAFT_H if draft else FINAL_H
    crf   = 28    if draft else 18
    label = "draft 720p" if draft else "final 1080p"

    print(f"\n[1/4] Detectando rostos ({label})...")
    crop_host, crop_guest, fw, fh, dur = build_face_map(video_path)

    if flip_sides:
        crop_host, crop_guest = crop_guest, crop_host
        print("  Lados invertidos (--flip-sides ativo)")

    cx1, cy1, cw1, ch1 = crop_host
    cx2, cy2, cw2, ch2 = crop_guest
    print(f"  Host   (cima):     crop={cw1}x{ch1} em x={cx1},y={cy1}")
    print(f"  Guest  (baixo):    crop={cw2}x{ch2} em x={cx2},y={cy2}")

    slot_h = out_h // 4
    verify_no_distortion(crop_host,  out_w, slot_h, "Host")
    verify_no_distortion(crop_guest, out_w, slot_h, "Guest")

    if segments is None:
        segments = [(0.0, dur)]

    print(f"[2/4] Montando filter_complex ({len(segments)} segmento(s))...")
    fc = build_filter_complex(segments, crop_host, crop_guest, out_w, out_h)

    # Salvar filter para debug
    fc_file = str(output_path).replace(".mp4", "_filter.txt")
    Path(fc_file).write_text(fc, encoding="utf-8")
    print(f"  Filter salvo: {fc_file}")

    print("[3/4] Executando FFmpeg...")
    cmd = [
        "ffmpeg", "-y",
        "-i", str(video_path),
        "-filter_complex_script", fc_file,
        "-map", "[vout]",
        "-map", "[aout]",
        "-c:v", "libx264",
        "-crf",    str(crf),
        "-preset", "fast",
        "-c:a",    "aac",
        "-b:a",    "128k",
        str(output_path),
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ERRO FFmpeg:\n{result.stderr[-2000:]}")
        return False

    print("[4/4] Verificando output...")
    cap = cv2.VideoCapture(str(output_path))
    ow  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    oh  = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()

    if ow != out_w or oh != out_h:
        print(f"ERRO: Dimensoes incorretas {ow}x{oh}, esperado {out_w}x{out_h}")
        return False

    size_mb = os.path.getsize(str(output_path)) / 1024 / 1024
    print(f"\nOK: {output_path}")
    print(f"    Resolucao: {ow}x{oh} | Tamanho: {size_mb:.1f}MB | Modo: {label}")
    print(f"    Padrao Magna: preto(25%) / host(25%) / guest(25%) / preto(25%)")
    print(f"    Olhos posicionados a 35% do topo de cada slot")
    return True


# ─── CLI ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="REELS ZOOM - Reframe Magna (eye-centered, 9:16)"
    )
    parser.add_argument("input",  help="Video Zoom original (.mp4)")
    parser.add_argument("output", help="Reels vertical (.mp4)")
    parser.add_argument("--final",      action="store_true",
                        help="Renderizar em 1080p final (padrao: 720p draft)")
    parser.add_argument("--segments",   type=str, default=None,
                        help='Segmentos JSON: [[start,end],[start,end]...] em segundos')
    parser.add_argument("--flip-sides", action="store_true",
                        help="Inverter host e convidado (se Allysson estiver a esquerda)")
    args = parser.parse_args()

    if not USE_MEDIAPIPE:
        print("AVISO: MediaPipe nao instalado. Usando OpenCV Haar (menos preciso).")
        print("       Para maior precisao: pip install mediapipe")

    segments = json.loads(args.segments) if args.segments else None

    ok = reframe(
        args.input,
        args.output,
        segments=segments,
        draft=not args.final,
        flip_sides=args.flip_sides,
    )
    sys.exit(0 if ok else 1)
