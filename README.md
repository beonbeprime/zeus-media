# Zeus Media — Squad de Carrosseis Instagram

Sistema autônomo de produção de carrosseis para Instagram com 3 agentes de IA especializados.

Pesquisa tendências, cria os slides com copy completa e revisa qualidade antes de entregar.

## Requisito

Claude Code — disponível em [claude.ai/code](https://claude.ai/code)

## Instalação (1 comando)

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

## Como usar

Após instalar, abra a pasta `zeus-media` no Claude Code e diga o tema:

> "carrossel sobre inteligência artificial para mentores"

O squad faz o resto.

## O que você recebe

- 8 a 10 slides com headline + texto de suporte (40-80 palavras cada)
- Direção visual por slide (cor de fundo, palavras em destaque, sugestão de foto)
- Legenda completa com hook nos primeiros 125 caracteres
- 5 a 15 hashtags (mix de nicho, médio e amplo)
- Scorecard de qualidade com nota em 10 critérios

## Os 3 Agentes

| Agente | Função |
|--------|--------|
| Raul Radar | Pesquisa 8-12 notícias e rankeia as top 5 |
| Carlos Carrossel | Cria os slides, legenda e hashtags |
| Vera Veredito | Revisa com scorecard — aprova só se score >= 4.0 |

## Pipeline de 9 Etapas

1. Você define o tema
2. Raul pesquisa notícias
3. Você escolhe a notícia
4. Carlos gera 5 ângulos emocionais
5. Você escolhe o ângulo
6. Carlos cria o carrossel completo
7. Você aprova o conteúdo
8. Vera faz a revisão de qualidade
9. Aprovação final

## Estrutura

```
zeus-media/
  CLAUDE.md                      <- Cérebro do sistema
  squads/instagram-carousel/
    squad.yaml
    agents/                      <- 3 agentes especializados
    pipeline/steps/              <- 9 etapas do pipeline
    pipeline/data/               <- Frameworks e critérios de qualidade
    output/                      <- Carrosseis gerados
```
