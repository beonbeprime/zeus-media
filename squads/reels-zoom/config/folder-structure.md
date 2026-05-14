# Estrutura de Pastas - PADRAO OBRIGATORIO

## STATUS: SEMPRE ATIVO em todo projeto REELS ZOOM

Todo projeto de Reels segue esta estrutura. Sem excecao.

## Estrutura

```
magna-reels-zoom/
  {nome-projeto}/                 <- nome do cliente/video
    01-bruto/                     <- video original do Zoom (nao modificar)
      video-original.mp4
    02-analise/                   <- material de analise (transcricao, frames, audio)
      audio.wav                   <- audio extraido para waveform
      transcricao.json            <- saida do Whisper
      frame_XXs.png              <- frames de referencia para crop
    03-brolls/                    <- B-rolls gerados (imagens/videos)
      broll-01-nome.png
      broll-02-nome.png
    04-renders/                   <- versoes intermediarias (draft, base)
      draft-720p.mp4             <- rascunho para aprovacao
      base-1080p.mp4             <- video base sem b-rolls
    05-final/                     <- versao final aprovada
      reels-{nome}-v1.mp4        <- versao 1 final
      reels-{nome}-v2.mp4        <- versao 2 (se iteracao)
    _lixo/                        <- versoes descartadas (auto-cleanup)
```

## Regras

1. Video original NUNCA sai de `01-bruto/`
2. Cada versao de render vai em `04-renders/` com nome descritivo
3. So o render APROVADO vai em `05-final/`
4. Screenshots de debug vao direto para `_lixo/`
5. `_lixo/` pode ser apagado a qualquer momento (nao e backup, e descarte)
6. Nomear arquivos finais: `reels-{nome}-v{N}.mp4`

## Criacao Automatica

O maestro (@reels-zoom-master) cria essa estrutura no inicio de cada projeto:
```bash
mkdir -p {projeto}/{01-bruto,02-analise,03-brolls,04-renders,05-final,_lixo}
```
