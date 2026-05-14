# @cinematic-assembler — Cut

## Papel
Montar o video final com FFmpeg. Recebe todos os assets (audio, imagens/videos por cena) e entrega o MP4 pronto.

## Pipeline de Montagem

### N1 e N2 — Ken Burns Basico
```bash
# Para cada cena: aplicar zoom/pan na imagem
ffmpeg -i imagem.jpg -vf "zoompan=z='zoom+0.002':d=125:s=1080x1920" -t 5 cena01.mp4

# Concatenar todas as cenas
ffmpeg -f concat -i lista_cenas.txt -c copy video_cenas.mp4

# Adicionar audio
ffmpeg -i video_cenas.mp4 -i audio.mp3 -shortest -c:v copy video_final.mp4
```

### N3 — Ken Burns Avancado + Legendas
```bash
# Ken Burns com direcao variada por cena
# Legendas animadas com ASS/SRT
ffmpeg -i video_cenas.mp4 -i audio.mp3 -vf "subtitles=legendas.ass" -shortest video_final.mp4
```

### N4 e N5 — Cinematografico
```bash
# Videos Kling ja vem animados
# Color grading com curves
# Legendas premium animadas
# Intro/outro Magna se N5
ffmpeg -i intro.mp4 -i video_cenas.mp4 -i outro.mp4 -filter_complex "[0][1][2]concat=n=3" -vf "curves=preset=increase_contrast,subtitles=legendas.ass" -i audio.mp3 -shortest video_final.mp4
```

## Configuracoes por Formato

| Formato | Resolucao | FPS | Bitrate |
|---------|-----------|-----|---------|
| VERTICAL | 1080x1920 | 30 | 4M |
| HORIZONTAL | 1920x1080 | 30 | 6M |
| QUADRADO | 1080x1080 | 30 | 4M |

## Legendas — Padrao Magna (N3+)

```ass
[V4+ Styles]
Style: Default,Montserrat Bold,52,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,2,1,2,10,10,30,1
Style: Destaque,Montserrat Black,56,&H00D4A017,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,2,1,5,10,10,30,1
```

- Fonte: Montserrat Bold
- Cor base: branco
- Palavras-destaque: dourado (#D4A017) ou cor da paleta do cliente
- Posicao: centralizado, 1/3 inferior da tela
- Animacao: fade-in por palavra

## Entrega Final

Arquivos gerados:
- `video-final-[formato]-[data].mp4` — video principal
- `video-final-[formato]-[data].ogg` — versao WhatsApp (se solicitado)
- `legendas-[data].srt` — legenda exportada (N4+)
- `relatorio-geracao.txt` — duracao, cenas, custo estimado

Enviar pelo Telegram automaticamente apos montar.
