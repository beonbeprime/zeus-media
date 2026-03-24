# Zeus Media

Sistema autonomo de producao de midia visual para Instagram.
Cria carrosseis profissionais e edita videos com overlays visuais automaticamente.

Funciona para qualquer pessoa, nicho ou segmento.

## O que faz

- Carrosseis para Instagram (feed, stories, reels)
- Edicao de video com frases marcantes, ganchos e efeitos visuais
- Geracao de paleta de cores personalizada
- Biblioteca de 100 icones no seu estilo
- Copy adaptada ao seu tom de comunicacao
- Hashtags relevantes por post
- Caption pronta para colar

## Instalacao (1 comando)

Abra o PowerShell e cole:

```powershell
irm https://raw.githubusercontent.com/beonbeprime/zeus-media/main/install.ps1 | iex
```

Ou clone manualmente:

```bash
git clone https://github.com/beonbeprime/zeus-media.git
cd zeus-media
```

## Como usar

1. Abra a pasta `zeus-media` no Claude Code
2. O sistema vai fazer perguntas para configurar sua marca
3. Responda todas as perguntas
4. Mande um texto, audio ou video
5. Escolha: carrossel ou video
6. Receba o rascunho, aprove ou ajuste
7. Exporte a versao final

## Comandos rapidos

| Comando | O que faz |
|---------|-----------|
| /config | Mostra sua configuracao atual |
| /cores | Mostra sua paleta de cores |
| /estilo | Mostra estilo visual e tom |
| /reset | Refaz o onboarding do zero |
| /carrossel [tema] | Cria carrossel sobre o tema |
| /video [descricao] | Edita video com overlays |
| /icones | Mostra biblioteca de icones |
| /hashtags [tema] | Gera hashtags para um tema |

## Estrutura

```
zeus-media/
  CLAUDE.md              <- Cerebro do sistema (lido automaticamente)
  .claude/rules/         <- Regras de cor, carrossel, video, qualidade
  agents/                <- Definicoes dos agentes
  templates/             <- Templates HTML (preto e branco por padrao)
  config/                <- Configuracoes e perfil da marca
  assets/                <- Seus carrosseis, videos e icones gerados
  docs/                  <- Guias e manuais
```

## Requisitos

- Claude Code (claude.ai/claude-code)
- Opcional: API Key do Google AI Studio ou OpenAI (para geracao de imagens)
