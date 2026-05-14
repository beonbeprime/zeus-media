# REELS ZOOM - Checklist de Garantia Total

## STATUS: EXECUTAR ANTES DE CADA VIDEO

Seguindo este checklist, 10 videos entregam output IDENTICO em:
reenquadramento, centralizacao, branding, legendas, icones, B-rolls.

---

## BLOCO 1 - PREPARACAO (antes de processar o video)

- [ ] Pasta criada com estrutura:
  ```
  {projeto}/
  ├── 01-bruto/     <- video Zoom original aqui
  ├── 02-analise/   <- transcricao, waveform, face-map
  ├── 03-brolls/    <- edit-project.json, renders parciais
  ├── 04-renders/   <- rascunhos 720p
  ├── 05-final/     <- 1080p aprovado
  └── _lixo/        <- arquivos descartados
  ```

- [ ] Dependencias Python instaladas:
  ```bash
  pip install -r squads/reels-zoom/scripts/requirements.txt
  ```

- [ ] icon-rotation.json consultado - identificar icones dos ultimos 5 videos
- [ ] Icones disponiveis selecionados (nenhum dos ultimos 5)

---

## BLOCO 2 - REENQUADRAMENTO (garantia de rostos identicos)

- [ ] Script canonico usado:
  ```bash
  python squads/reels-zoom/scripts/reframe.py 01-bruto/video.mp4 04-renders/draft.mp4
  ```

- [ ] Dois rostos detectados (log confirma "face_0" e "face_1")
- [ ] MediaPipe Face Mesh ativo (nao o fallback OpenCV Haar)
- [ ] Log mostra posicao dos olhos: `"olhos a Y=NNN, slot 320px, crop_y=NNN"`
- [ ] Olhos entre 30% e 42% do topo do slot em cada rosto
- [ ] Face_cx entre 45% e 55% da largura do slot (horizontal ±5%)
- [ ] scale usou W:-2 (proporcional) - confirmado no filter_complex
- [ ] Zero bordas cinza/pretas laterais - extrair frame e conferir
- [ ] Preto puro (#000000) nos 25% de cima e 25% de baixo
- [ ] Allysson no slot de cima, convidado no slot de baixo
- [ ] |fator_x - fator_y| < 0.01 (sem distorcao)
- [ ] setpts=PTS-STARTPTS presente em todo segmento trimado
- [ ] Nenhum flash preto entre cortes (brilho > 15 em toda area de rostos)

---

## BLOCO 3 - AUDIO E CORTES

- [ ] Waveform analisado (RMS por janela de 25ms)
- [ ] Cortes APENAS onde RMS < percentil 25 (silencio real)
- [ ] Nenhuma pausa > 400ms no video final
- [ ] Nenhuma palavra cortada no meio
- [ ] Fade in/out de 15ms em cada segmento de audio
- [ ] Gancho nos primeiros 3 segundos
- [ ] Duracao total entre 30 e 90 segundos

---

## BLOCO 4 - LEGENDAS (padrao visual identico)

- [ ] Legendas continuas cobrindo TODA a fala (zero silencio sem legenda)
- [ ] 1 a 3 palavras por caption (nunca frases inteiras)
- [ ] Fonte: DM Sans 700, 28-36px
- [ ] Cor padrao: #f0e0d8 (champagne)
- [ ] Palavras de destaque: #d4a08a (rosegold rg2) - maximo 3 por reels
- [ ] Posicao: area preta inferior (75%) ou superior (25%) - NUNCA sobre os rostos
- [ ] Sombra difusa aplicada
- [ ] Acentuacao verificada (accent-enforcer.ts ou verificacao manual)
- [ ] Zero palavras sem acento no portugues

---

## BLOCO 5 - B-ROLLS (padrao visual identico)

- [ ] edit-project.json criado para este video
- [ ] B-rolls com campo "elements" (NUNCA "lines")
- [ ] Todo B-roll conceitual tem iconId
- [ ] forceStyle: 1 ou 2 ou 7 quando tem iconId
- [ ] iconId verificado na lista de 30 do ICON_MAP_INLINE
- [ ] iconId diferente de todos os outros B-rolls DO MESMO video
- [ ] iconId diferente dos ultimos 5 videos (consultar icon-rotation.json)
- [ ] icon-rotation.json atualizado apos escolher icones
- [ ] Renderizado via Remotion (NUNCA via PIL ou imagens estaticas)
  ```bash
  npx remotion render MagnaEditV2 04-renders/brolls.mp4
  ```
- [ ] Frame extraido de cada B-roll: icone visivel com halo radial rosegold
- [ ] Frame extraido: fundo #0a0806 (nao #000000 puro)
- [ ] Frame extraido: grain visivel (fractalNoise baseFrequency 0.88, opacity 0.35)
- [ ] Frame extraido: fonte Cormorant Garamond italic no headline
- [ ] Minimo 1 schema visual (funnel, path, checklist) a cada 15 segundos
- [ ] Spring configurado: damping 14, stiffness 55

---

## BLOCO 6 - FECHAMENTO

- [ ] MagnaOutro no final (ultimos 3 segundos)
- [ ] Frame final com foto circular Allysson
- [ ] Handle exatamente como o usuario escreveu (copiar literal)
- [ ] Texto "Siga" visivel

---

## BLOCO 7 - GATE FINAL (12 pontos)

- [ ] Gancho forte nos primeiros 3s
- [ ] Narrativa coerente (nao parece cortada)
- [ ] Zero repeticoes de ideias
- [ ] Rostos visiveis e bem enquadrados em TODO o video
- [ ] Sem bordas pretas/cinza laterais
- [ ] Proporcao 9:16 exata (1080x1920)
- [ ] Legendas sincronizadas e sem erros ortograficos
- [ ] Duracao 30-90 segundos
- [ ] Audio limpo: voz alta, musica baixa (se houver), sem pausas
- [ ] Transicoes suaves entre trechos
- [ ] Identidade visual Magna mantida (cores, fontes, grain)
- [ ] Todos os pedidos do usuario verificados via frame extraido

---

## O QUE E IDENTICO EM TODOS OS VIDEOS

| Elemento | Valor Fixo |
|----------|-----------|
| Fundo dos slots | #000000 puro |
| Fundo dos B-rolls | #0a0806 |
| Cor champagne (texto) | #f0e0d8 |
| Cor rosegold (destaque) | #d4a08a |
| Fonte display (B-rolls) | Cormorant Garamond |
| Fonte body/captions | DM Sans |
| Stroke icones | 0.45 |
| Linecap icones | square |
| Linejoin icones | miter |
| Spring B-rolls | damping 14, stiffness 55 |
| Layout (%) | 25/25/25/25 |
| Centralizacao olhos | 35% do topo do slot |
| Grain | fractalNoise 0.88, opacity 0.35 |
| Reels resolution | 1080x1920 |

## O QUE MUDA A CADA VIDEO

- Conteudo (transcricao, gancho, narrativa)
- Nome do convidado
- iconIds dos B-rolls
- Foto/handle no fechamento
- Textos dos B-rolls (headline, subtitle, elements)
- Timestamps dos segmentos

---

## Referencia Completa

```
squads/reels-zoom/config/branding-standard.md   <- padrao visual completo
squads/reels-zoom/config/paths.md               <- caminhos de arquivos
squads/reels-zoom/config/errors-learned.md      <- 23 erros documentados
squads/reels-zoom/scripts/reframe.py            <- script canonico de reenquadramento
squads/reels-zoom/data/icon-rotation.json       <- controle de icones usados
squads/reels-zoom/squad.yaml                    <- config completa
```
