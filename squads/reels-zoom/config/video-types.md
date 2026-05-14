# REELS ZOOM - Tres Tipos de Video

## STATUS: SEMPRE CONSULTAR AO INICIAR PRODUCAO

Antes de qualquer trabalho, identificar o tipo.
Cada tipo tem um pipeline diferente. O padrao visual e IDENTICO nos tres.

---

## TIPO 1: ZOOM
**Palavra-chave de ativacao:** "video do zoom", "call no zoom", "gravei uma call", "mentoria VIP"

### O que e
Gravacao de reuniao Zoom horizontal (16:9) com 2 rostos visiveis.
Precisa ser reenquadrada para 9:16 vertical com os rostos empilhados.

### Input
- Pasta da gravacao Zoom (ex: `2026-03-24 11.06.58 Mentoria VIP/`)
- Normalmente `video7510079701.mp4` ou similar dentro da pasta

### Pipeline completo
1. Transcrever com Whisper (timestamps por palavra)
2. Analisar conteudo (classificar frases por peso)
3. Extrair gancho viral (3 opcoes, escolha obrigatoria do usuario)
4. Arquitetura narrativa (reorganizar, remover redundancias)
5. Guard de repeticao
6. Detectar rostos (MediaPipe)
7. Reenquadrar 9:16 (script reframe.py - CANONICO)
8. QA de reenquadramento
9. Construir edit-project.json (B-rolls + captions curados)
10. Renderizar via Remotion (MagnaEditV2)
11. Adicionar musica (Coldplay de 48s, 8%)
12. Gate final

### Referencias aprovadas
- Nanjaira v16: `squads/reels-zoom/producoes/nanjaira/rascunhos/reels-nanjaira-v16.mp4`
- Rafael: `squads/reels-zoom/producoes/rafael/final/draft-v35.mp4`

### Especificidade
- Layout 25/25/25/25 (topo preto / rosto1 / rosto2 / fundo preto)
- Allysson SEMPRE em cima
- Convidado/aluno SEMPRE embaixo
- Olhos a 35% do slot
- Captions CURADOS (8-10 frases-chave, nao palavra-por-palavra)

---

## TIPO 2: VERTICAL
**Palavra-chave de ativacao:** "video do celular", "gravei com o telefone", "gravo na vertical", "anuncio vertical"

### O que e
Video ja gravado na vertical (telefone). Nao precisa reenquadrar.
Pode ser anuncio, conteudo educacional, depoimento.

### Input
- Arquivo de video ja em 9:16 (ou similar)
- Pode ser 1 pessoa falando, tela com texto, produto, etc.

### Pipeline completo
1. Transcrever com Whisper
2. Analisar conteudo
3. Extrair gancho viral (3 opcoes, escolha do usuario)
4. Arquitetura narrativa (cortes, ritmo)
5. Guard de repeticao
6. Construir edit-project.json (B-rolls + captions curados)
7. Renderizar via Remotion
8. Adicionar musica se aplicavel
9. Gate final

### Diferenca do ZOOM
- SEM deteccao de rosto
- SEM reenquadramento
- SEM layout 25/25/25/25 (rosto ja ocupa o frame)
- Captions podem ser mais densas (pessoa falando direto pro celular)
- B-rolls menores (nao cobrem o rosto inteiro)

---

## TIPO 3: MOTION
**Palavra-chave de ativacao:** "so audio", "sem rosto", "motion video", "voz com graficos", "video conceitual"

### O que e
Apenas audio (fala gravada ou narrada). Sem video de rosto.
100% motion graphics - blur de fundo, icones animados, texto, esquemas.

### Input
- Arquivo de audio (.mp3, .wav, .m4a)
- OU texto do roteiro (para TTS posterior)

### Pipeline completo
1. Transcrever com Whisper (ou usar texto direto)
2. Analisar conteudo
3. Extrair gancho viral
4. Arquitetura narrativa
5. Construir edit-project.json (SEM inputVideo, so B-rolls + motion)
6. Background: blur Magna (#0a0806 com grain)
7. Renderizar via Remotion
8. Gate final

### Diferenca dos outros tipos
- SEM video de rosto (background e blur/dark Magna)
- Legendas CONTINUAS (toda palavra tem caption - pessoa nao esta sendo vista)
- B-rolls mais frequentes (sem rosto para segurar atencao)
- Mais esquemas visuais (1 a cada 10s no minimo)
- Icones maiores (protagonistas do frame)

---

## ROTEAMENTO AUTOMATICO

```
Recebeu pedido de video?
  |
  +-- Tem gravacao Zoom / call horizontal? --> TIPO 1: ZOOM
  |
  +-- Video ja vertical / gravado com celular? --> TIPO 2: VERTICAL
  |
  +-- So audio, sem imagem? --> TIPO 3: MOTION
  |
  +-- Ambiguo? --> Perguntar: "E gravacao de Zoom, video do celular ou so audio?"
```

---

## O QUE E IGUAL NOS 3 TIPOS (padrao visual INVIOLAVEL)

- Cores: #0a0806 (bg), #f0e0d8 (texto), #d4a08a (rosegold)
- Fonte headline: Cormorant Garamond italic
- Fonte legenda: DM Sans 700
- Icones: Magna 300 animados, stroke 0.45, square
- Grain: 0.88 / 0.35
- Fechamento: foto circular + handle + "Siga"
- Renderizacao: Remotion MagnaEditV2
- Rotacao de icones: registrar em data/icon-rotation.json

## O QUE MUDA POR TIPO

| Elemento | ZOOM | VERTICAL | MOTION |
|----------|------|----------|--------|
| Reenquadramento | sim | nao | nao |
| Layout 25/25/25/25 | sim | nao | nao |
| Captions | curados (8-10) | curados (8-15) | continuas (tudo) |
| B-rolls | 5-8 | 4-6 | 6-10+ |
| Schemas | 1 a cada 15s | 1 a cada 15s | 1 a cada 10s |
| Musica | sim (48s, 8%) | opcional | sim |
| Background B-roll | #0a0806 | #0a0806 | #0a0806 |
