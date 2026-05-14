# Zeus Media - Sistema de Producao de Midia com IA

Sistema autonomo de producao de videos e carrosseis para Instagram com squads de IA especializados.

## Requisito

Claude Code - disponivel em [claude.ai/code](https://claude.ai/code)

## Instalacao (1 comando)

Abra o PowerShell e cole:

```powershell
irm https://raw.githubusercontent.com/beonbeprime/zeus-media/master/install.ps1 | iex
```

Ou clone manualmente:

```bash
git clone https://github.com/beonbeprime/zeus-media.git
cd zeus-media
claude
```

---

## Squads de Video

### ZEUS EDITOR - Edicao de Video Profissional

Squad autonomo de edicao de video no padrao conceitual Magna.
Recebe o video bruto e entrega MP4 editado com legendas, B-roll, icones animados e corte de silencios.

Como usar:

> "edita esse video: C:/Videos/minha-aula.mp4"

O que entrega:
- Corte automatico de silencios, erros e vicios de linguagem
- Legendas no padrao Magna (1-3 palavras, destaque em rosegold)
- B-rolls conceituais animados
- Tratamento de imagem cinematico
- Rascunho 720p para aprovacao + final 1080p

---

### REELS ZOOM - Call Zoom em Reels Vertical

Transforma gravacoes de call Zoom em Reels verticais prontos para o Instagram.
Reenquadra os dois rostos, extrai o gancho viral, corta o que nao agrega e entrega MP4 9:16.

Como usar:

> "video do zoom: C:/Users/Zoom/reuniao.mp4"

O que entrega:
- Reenquadramento automatico dos rostos (empilhados verticalmente)
- 3 opcoes de gancho para voce escolher
- Narrativa reorganizada sem repeticoes
- Legendas sincronizadas
- Rascunho 720p para aprovacao + final 1080x1920

---

### REELS ZOOM ALTERNADO - Depoimentos e Entrevistas

Para quando o convidado fala em tela cheia, alternando com o host.
Ideal para depoimentos de alunos e entrevistas de mentoria.

Como usar:

> "depoimento zoom: C:/Users/Zoom/mentoria.mp4"

---

### CINEMATIC FORGE - Video com IA do Zero

Cria videos profissionais a partir de um tema ou roteiro, sem precisar de gravacao.
Pesquisa, roteiro, imagens geradas, movimento, legendas e entrega MP4 final.

5 niveis de qualidade:
- N1 VELOZ: gratuito, 2 minutos
- N2 PADRAO: voz ElevenLabs, 3 minutos
- N3 PREMIUM: imagens Nano Banana + legendas, 5 minutos
- N4 CINEMATOGRAFICO: movimento Kling AI, 10 minutos
- N5 MAGNA DELUXE: identidade visual completa, 15 minutos

Como usar:

> "cria um video sobre marketing para mentores, nivel N3, formato vertical"

---

### CUTFLOW EDITOR - Editor Web com Validacao de Qualidade

Squad que previne os problemas mais comuns de exportacao de video no editor web.
Garante resolucao, bitrate, codec e sincronizacao corretos antes de entregar.

Valida automaticamente para: Instagram Reels, Feed, YouTube, TikTok e Meta Ads.

---

## Squad de Carrossel

### INSTAGRAM CAROUSEL - Carrossel com 3 Agentes

Sistema autonomo de producao de carrosseis para Instagram.
Pesquisa tendencias, cria os slides com copy completa e revisa qualidade antes de entregar.

Como usar:

> "carrossel sobre inteligencia artificial para mentores"

O que voce recebe:
- 8 a 10 slides com headline + texto de suporte
- Direcao visual por slide (cor de fundo, palavras em destaque, sugestao de foto)
- Legenda completa com hook nos primeiros 125 caracteres
- 5 a 15 hashtags
- Scorecard de qualidade com nota em 10 criterios

Os 3 agentes:
- Raul Radar: pesquisa 8-12 noticias e rankeia as top 5
- Carlos Carrossel: cria os slides, legenda e hashtags
- Vera Veredito: revisa com scorecard, aprova so se score >= 4.0

---

## Estrutura

```
zeus-media/
  CLAUDE.md
  squads/
    video-editor-magna/     <- ZEUS EDITOR (edicao de video bruto)
    reels-zoom/             <- REELS ZOOM (call Zoom em Reels)
    reels-zoom-alternado/   <- REELS ALTERNADO (depoimentos)
    video-cinematic/        <- CINEMATIC FORGE (video com IA do zero)
    cutflow-editor/         <- CUTFLOW (editor web com QA)
    instagram-carousel/     <- CARROSSEL (3 agentes, 9 etapas)
```

---

Desenvolvido por [Allysson Silveira](https://fabricadementores.com)
