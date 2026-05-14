# REELS ZOOM - Registro Completo de Erros, Causas e Resolucoes

## STATUS: DOCUMENTO VIVO - Consultar ANTES de cada video novo

Este documento registra TODOS os erros cometidos na primeira sessao de desenvolvimento
do squad REELS ZOOM (2026-03-24). Cada erro tem causa, solucao e atalho rapido.
Se o erro acontecer de novo, ir direto na secao RAPIDO sem precisar diagnosticar.

---

## CATEGORIA 1: REENQUADRAMENTO DE VIDEO

### ERRO #1: Rosto distorcido (esticado/achatado)
- POR QUE ACONTECEU: Usei `scale=720:320` forcando largura E altura fixas. Isso muda a proporcao.
- COMO EVITAR: Sempre usar `scale=720:-2` (ffmpeg calcula altura proporcional)
- RAPIDO: Trocar `scale=W:H` por `scale=W:-2,crop=W:H:0:(ih-H)/2`
- VERIFICACAO: |fator_x - fator_y| < 0.01

### ERRO #2: Bordas cinza/pretas nas laterais (Nanjaira)
- POR QUE ACONTECEU: A pessoa filmava pelo celular e a tela no Zoom era menor que o painel. O crop pegava a area inteira incluindo as bordas escuras do Zoom.
- COMO EVITAR: Scan de brilho horizontal para encontrar onde comeca e termina o conteudo REAL
- RAPIDO: Scan brilho > 50 por coluna, crop justo na area real, zoom in para preencher 720px
- VERIFICACAO: Extrair frame e conferir que nenhum pixel cinza/preto aparece nas laterais

### ERRO #3: Flash preto entre cortes de segmento
- POR QUE ACONTECEU: O ffmpeg concat sem `setpts=PTS-STARTPTS` causava gap de 1 frame entre segmentos
- COMO EVITAR: SEMPRE colocar `setpts=PTS-STARTPTS` apos cada `trim`
- RAPIDO: Verificar filter_complex, adicionar setpts. Audio fade 15ms.
- VERIFICACAO: Extrair todos os frames, nenhum com brilho < 15 na area de rostos

### ERRO #6: Rosto descentralizado no crop (cortando testa demais)
- POR QUE ACONTECEU: Offset Y do crop fixo sem verificar onde o rosto realmente esta dentro do recorte
- COMO EVITAR: Rodar @face-centering-qa apos cada crop (scan brilho vertical)
- RAPIDO: face_center_y vs crop_height/2, se diferenca > 10px ajustar offset
- VERIFICACAO: Olhos no terco superior, boca visivel

---

## CATEGORIA 2: AUDIO E CORTES

### ERRO #4: Pausas/silencios longos no audio (especialmente no gancho)
- POR QUE ACONTECEU: Copiei timestamps da transcricao sem analisar silencios. O falante fazia pausas de 2+ segundos.
- COMO EVITAR: SEMPRE analisar waveform (RMS por janela 25ms) antes de definir cortes
- RAPIDO: Extrair WAV 16kHz, calcular RMS, dividir em sub-segmentos nos silencios > 400ms
- VERIFICACAO: Ouvir o audio. Nenhuma pausa > 400ms no video final.

### ERRO #5: Corte no meio de palavras
- POR QUE ACONTECEU: Timestamps definidos manualmente sem checar onde a fala comeca/termina
- COMO EVITAR: Cortar APENAS onde RMS < percentil 25 (silencio real)
- RAPIDO: Waveform + margem 50ms antes da fala e 30ms apos
- VERIFICACAO: Ouvir cada transicao. Palavra completa antes e depois do corte.

---

## CATEGORIA 3: B-ROLLS E VISUAL MAGNA

### ERRO #7: B-rolls estaticos (imagens PIL em vez de Remotion)
- POR QUE ACONTECEU: Tentei gerar B-rolls como imagens PNG com PIL/Pillow. Resultado sem animacao, fontes erradas, cores erradas.
- COMO EVITAR: SEMPRE usar MagnaEditV2 via Remotion. NUNCA gerar B-rolls fora do Remotion.
- RAPIDO: Criar edit-project.json com brollMoments, renderizar via `npx remotion render MagnaEditV2`
- VERIFICACAO: Frame do B-roll deve ter: grain, gradiente radial, fonte Playfair/Cormorant, animacao spring

### ERRO #9: B-rolls sem icones Magna
- POR QUE ACONTECEU: edit-project.json nao tinha iconId nos brollMoments
- COMO EVITAR: Todo B-roll conceitual DEVE ter iconId
- RAPIDO: Adicionar iconId de um dos 30 disponiveis no ICON_MAP_INLINE
- VERIFICACAO: Frame do B-roll deve mostrar icone com halo radial rosegold

### ERRO #13: Fontes erradas nos B-rolls
- POR QUE ACONTECEU: Componente custom sem @remotion/google-fonts. PIL usava Arial.
- COMO EVITAR: SEMPRE renderizar via MagnaEditV2 que ja carrega Playfair + DM Sans
- RAPIDO: Renderizar via Remotion, nunca criar componente custom para B-rolls
- VERIFICACAO: Conferir que o texto e serif italic (Playfair/Cormorant), nao sans-serif

### ERRO #14: Cores nao eram da Magna original
- POR QUE ACONTECEU: Cores hardcoded em vez de importar do magna-theme.ts
- COMO EVITAR: SEMPRE importar de magna-theme.ts
- RAPIDO: import { M } from magna-theme
- VERIFICACAO: Texto champagne (#f0e0d8), sub rosegold (#d4a08a), fundo (#0a0806)

### ERRO #15: forceStyle ignorado (icones nao apareciam mesmo com iconId)
- POR QUE ACONTECEU: MagnaBRoll usava rotacao fixa por index e ignorava content.forceStyle. Estilos sem icone (0,3,4,5,6) eram atribuidos a B-rolls que tinham iconId.
- COMO EVITAR: MagnaEditV2.tsx ja foi corrigido para respeitar forceStyle
- RAPIDO: Se tem iconId, forceStyle DEVE ser 1 (ICON+HEAD), 2 (FULL) ou 7 (ICON+SUB+HEAD)
- VERIFICACAO: Estilo 1/2/7 = com icone. Estilo 0/3/4/5/6 = sem icone.

### ERRO #16: Renomear 'elements' para 'lines' quebrou B-rolls
- POR QUE ACONTECEU: Tentei usar BRollOverlay.tsx (que usa 'lines') mas MagnaEditV2 usa MagnaBRoll (que usa 'elements')
- COMO EVITAR: MagnaBRoll usa content.elements, NUNCA content.lines
- RAPIDO: Sempre usar 'elements' no edit-project.json
- VERIFICACAO: JSON deve ter "elements": [...], nao "lines": [...]

### ERRO #17: Icone nao existe no ICON_MAP_INLINE
- POR QUE ACONTECEU: Usei 'book' e 'unlock' mas nao existiam no ICON_MAP_INLINE (so no ICON_MAP do IconOverlay.tsx)
- COMO EVITAR: Consultar ICON_MAP_INLINE antes de usar qualquer iconId
- RAPIDO: 30 icones disponiveis: crown, trending-up, dollar, star, gear, rocket, clock, lightbulb, target, shield, zap, heart, key, users, user, bell, unlock, megaphone, layout, document, eye, message, funnel, puzzle, layers, diamond, mic, hand, book, calendar
- VERIFICACAO: Se icone nao aparece no frame, provavelmente nao existe no ICON_MAP_INLINE

### ERRO #20: Icones repetidos entre B-rolls no mesmo video
- POR QUE ACONTECEU: Poucos icones disponiveis (10), forcando repeticao
- COMO EVITAR: ICON_MAP_INLINE expandido para 30. Regra: NUNCA repetir no mesmo video.
- RAPIDO: Escolher 1 icone diferente para cada B-roll do video
- VERIFICACAO: Listar todos iconIds usados, conferir que nao ha duplicata

### ERRO #22: Mesmo icone (estrela/star) repetido entre videos diferentes - 2026-03-26
- POR QUE ACONTECEU: Icone nao era rotacionado entre producoes. O mesmo iconId era escolhido por padrao.
- COMO EVITAR: Manter registro em `squads/reels-zoom/data/icon-rotation.json`. NUNCA repetir o mesmo icone nos ultimos 5 videos.
- RAPIDO: Antes de escolher iconId, abrir icon-rotation.json e ver quais foram usados recentemente. Escolher um que nao apareceu.
- VERIFICACAO: Listar icones dos ultimos 5 videos, confirmar que o icone novo nao esta na lista.
- REGRA: A ESTRELA (star) nao e icone padrao. Ela entra na rotacao como qualquer outro.

### ERRO #23: Criando animacao de icone do zero em vez de usar a biblioteca - 2026-03-26
- POR QUE ACONTECEU: Desconhecimento ou esquecimento da biblioteca de 300 icones animados
- COMO EVITAR: ANTES de qualquer codigo de animacao de icone, verificar magna-icon-animated.html
- RAPIDO: Abrir squads/iconografia/output/magna-icon-animated.html, localizar pelo id, copiar paths + @keyframes CSS
- VERIFICACAO: O icone no video tem a animacao natural do objeto (nao efeito generico de fade/scale)
- VANTAGEM: Icone da biblioteca = CSS puro, zero spring physics, zero custo de processamento por frame

---

## CATEGORIA 4: LEGENDAS E TEXTO

### ERRO #10: Legendas incompletas (poucas captions)
- POR QUE ACONTECEU: Criei apenas 18 captions para 22s. O verde-lugar-legal tem 58 para 45s (~1.3/s).
- COMO EVITAR: Legenda CONTINUA cobrindo TODA a fala. 1-3 palavras por caption.
- RAPIDO: Pegar transcricao Whisper, dividir em blocos de 1-3 palavras, gerar caption por bloco
- VERIFICACAO: Toda palavra falada deve ter caption correspondente

### ERRO #21: Acentuacao falha nos textos do video
- POR QUE ACONTECEU: Textos no edit-project.json escritos manualmente sem acentos
- COMO EVITAR: accent-enforcer.ts corrige automaticamente 80+ palavras
- RAPIDO: Rodar enforceAccents() em todo texto antes de salvar no JSON
- VERIFICACAO: Conferir nos frames: voce, nao, conteudo, construcao, mentoria, etc.

---

## CATEGORIA 5: ESTRUTURA E ORGANIZACAO

### ERRO #8: Pasta bagunçada (30+ arquivos misturados)
- POR QUE ACONTECEU: Nao criou estrutura de pastas no inicio
- COMO EVITAR: Criar 01-bruto/ 02-analise/ 03-brolls/ 04-renders/ 05-final/ _lixo/ ANTES de tudo
- RAPIDO: `mkdir -p {projeto}/{01-bruto,02-analise,03-brolls,04-renders,05-final,_lixo}`
- VERIFICACAO: Video original em 01-bruto, versao final em 05-final, lixo em _lixo

### ERRO #11: Zero schemas visuais
- POR QUE ACONTECEU: Nao incluiu schemas (funnel, path, checklist) no edit-project
- COMO EVITAR: Minimo 1 schema por cada 15s de video
- RAPIDO: Se lista itens = schema. Se processo = path. Se compara = comparison.
- VERIFICACAO: Conferir que existem schemas no edit-project.json

### ERRO #12: Sem foto/nome no final do video
- POR QUE ACONTECEU: Nao incluiu tela de fechamento
- COMO EVITAR: MagnaOutro atualizado com foto circular + handle + siga
- RAPIDO: Ultimo 3s do video ja tem MagnaOutro automatico
- VERIFICACAO: Frame final com foto Allysson + black.fabricadementores

---

## CATEGORIA 6: COMUNICACAO E EXECUCAO

### ERRO #18: Nao executou TUDO que o usuario pediu (execucao parcial)
- POR QUE ACONTECEU: Fez parte dos pedidos e ignorou ou esqueceu outros
- COMO EVITAR: ANTES de executar, listar TODOS os pedidos em TodoWrite. Executar CADA UM. Verificar CADA UM via frame.
- RAPIDO: Reler mensagem do usuario, listar em bullets, executar na ordem, marcar cada um
- VERIFICACAO: Cada pedido tem item no todo, cada item verificado via frame extraido

### ERRO #19: Handle errado (texto diferente do que o usuario escreveu)
- POR QUE ACONTECEU: Interpretei "@fabricadementores" em vez de copiar o exato "black.fabricadementores"
- COMO EVITAR: Copiar LITERALMENTE o texto que o usuario escreveu. Nao interpretar.
- RAPIDO: Ctrl+C do texto do usuario para o JSON
- VERIFICACAO: Conferir no frame que o texto e IDENTICO ao pedido

---

## CHECKLIST PRE-RENDER (executar antes de CADA renderizacao)

### Video base:
- [ ] scale usa `-2` (nunca altura fixa)
- [ ] Scan brilho feito para cada pessoa
- [ ] Waveform analisado, cortes em silencios
- [ ] face-centering-qa rodou
- [ ] setpts=PTS-STARTPTS em todo segmento
- [ ] Pasta estruturada 01-05

### edit-project.json:
- [ ] Captions cobrindo TODA a fala (1-3 palavras cada)
- [ ] B-rolls com iconId (todos diferentes, nenhum repetido)
- [ ] forceStyle 1/2/7 quando tem iconId
- [ ] 'elements' (nunca 'lines')
- [ ] iconIds existem no ICON_MAP_INLINE (30 disponiveis)
- [ ] Schemas visuais (minimo 1 por 15s)
- [ ] Acentuacao verificada em todos os textos
- [ ] outroMode e outroHandle corretos

### Pos-render:
- [ ] Extrair frames de CADA B-roll e verificar icone visivel
- [ ] Extrair frame do fechamento e verificar foto + handle
- [ ] Verificar audio: voz alta, musica baixa, sem pausas
- [ ] Todos os pedidos do usuario verificados via frame
