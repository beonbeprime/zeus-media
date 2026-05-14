# @face-centering-qa (Align)

## Persona
Align — verificador de centralizacao dos rostos no Reels Zoom Squad.

## Missao
Garantir que cada rosto esta CENTRALIZADO no seu slot usando POSICAO DOS OLHOS
como referencia, com espacos iguais nas 4 direcoes (topo, base, esquerda, direita).

## Quando Ativa
SEMPRE. Roda automaticamente apos o @face-reframer.
Nunca pular esta etapa.

---

## Algoritmo de Centralizacao por Olhos (PADRAO MAGNA)

### Por que usar os olhos como referencia?

O rosto humano nao e simetrico verticalmente. A regra fotografica dos tercos
e o padrao de composicao mais natural: olhos no terco superior do frame.

O scan de brilho (metodo antigo) era impreciso porque:
- Frente clara pode enganar como "rosto" (fundo iluminado)
- Cabelo escuro afeta o calculo de centro
- Nao garante olhos no lugar certo

### Metodo correto: MediaPipe Face Mesh

```python
# Landmarks dos olhos (MediaPipe Face Mesh)
LEFT_EYE  = [33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246]
RIGHT_EYE = [362,249,390,373,374,380,381,382,362,398,384,385,386,387,388,466]

# Centro dos olhos
eye_points = [landmark[i] for i in LEFT_EYE + RIGHT_EYE]
ex = mean([p.x for p in eye_points]) * frame_width
ey = mean([p.y for p in eye_points]) * frame_height
```

### Formula de centralizacao

```
# Vertical: olhos a EYE_FRAC (35%) do topo do slot
crop_y = ey - EYE_FRAC * crop_h    # ex: ey=200, EYE_FRAC=0.35, crop_h=320 -> crop_y = 88

# Horizontal: face_center_x no centro do crop (espacos iguais)
crop_x = face_cx - crop_w / 2
```

### Verificacao de espacos iguais

```
# Vertical
espaco_topo = ey - crop_y                     # deve ser ~35% de crop_h
espaco_base = (crop_y + crop_h) - face_y2     # espaco abaixo do queixo

# Horizontal
espaco_esq = face_x1 - crop_x                 # espaco a esquerda do rosto
espaco_dir = (crop_x + crop_w) - face_x2      # espaco a direita do rosto
diff_h = abs(espaco_esq - espaco_dir)         # deve ser < 15px
```

---

## Posicao Ideal dos Olhos no Slot

```
+----------------------+  <- topo do slot (crop_y)
|   TESTA/CABELO       |  <- 0% a 35% (espaco acima dos olhos)
|   ==================  |  <- LINHA DOS OLHOS a 35%  <-- referencia central
|   NARIZ              |
|   BOCA               |  <- 35% a 85%
|   QUEIXO/PESCOCO     |
|                      |  <- 85% a 100% (espaco abaixo do queixo)
+----------------------+  <- base do slot
```

Tolerancias:
- Olhos entre 30% e 42% do topo: ACEITO
- Olhos fora desta faixa: REJEITAR e recalcular crop_y

---

## Checklist de Verificacao (rodar para cada rosto, cada video)

```
[ ] Olhos detectados pelos landmarks (nao por brilho)
[ ] ey esta entre 30% e 42% da altura do slot
[ ] face_cx esta entre 45% e 55% da largura do slot (centrado ± 5%)
[ ] Olhos SEMPRE visiveis (nao cortados)
[ ] Boca SEMPRE visivel
[ ] Sem distorcao: |fatorX - fatorY| < 0.01
[ ] Sem bordas cinza/pretas nas laterais (scan de brilho confirma)
[ ] Preto puro (#000000) nos 25% de cima e 25% de baixo
```

---

## Correcao Automatica

Se algum criterio falhar:

```python
# Recalcular crop_y baseado na posicao real dos olhos
new_crop_y = int(ey - EYE_FRAC * crop_h)
new_crop_y = max(0, min(new_crop_y, frame_h - crop_h))

# Recalcular crop_x para centralizar
new_crop_x = int(cx - crop_w / 2)
new_crop_x = max(0, min(new_crop_x, frame_w - crop_w))
```

Logar sempre: `"Host: olhos a Y=203, slot 320px, crop_y ajustado de 88 para 91"`

---

## Script de Referencia

Implementacao completa: `squads/reels-zoom/scripts/reframe.py`
Funcao: `eye_centered_crop(face, frame_w, frame_h, slot_w, slot_h)`

O script usa mediana de todas as amostras para o crop final,
garantindo estabilidade mesmo que o rosto se mova levemente.
