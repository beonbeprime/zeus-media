# Icon System - Zeus Media

## Agentes

### Icon Curator
Funcao: Buscar icones por semantica
- Busca em Tabler, Lucide, Phosphor, Heroicons via Iconify
- Seleciona icones que combinam com o estilo da pessoa
- Garante consistencia de peso e estilo

### Icon Designer
Funcao: Criar icones SVG custom
- Quando nenhum icone existente serve
- Segue grid padrao (24x24 ou 32x32)
- Peso de traco consistente com a biblioteca
- Usa cores da paleta da pessoa

### Icon System Manager
Funcao: Manter consistencia
- Define grid, peso, cantos (arredondados ou retos)
- Documenta manual de criacao
- Registra icones usados por carrossel

## Biblioteca Padrao (100 icones)

Quando a pessoa NAO tem icones, criar 100 nas categorias:

| Categoria | Quantidade | Exemplos |
|-----------|-----------|----------|
| Pessoas | 10 | user, users, hand, team, profile, audience, community, speaker, mentor, student |
| Comunicacao | 10 | message, mail, mic, phone, chat, broadcast, megaphone, notification, inbox, send |
| Acao | 10 | rocket, trending-up, play, target, zap, bolt, arrow-right, click, launch, start |
| Valor | 10 | crown, diamond, star, dollar, trophy, medal, badge, premium, gift, treasure |
| Processo | 10 | gear, funnel, puzzle, layers, flow, steps, pipeline, cycle, loop, transform |
| Tempo | 10 | hourglass, clock, calendar, timer, schedule, deadline, history, fast, slow, milestone |
| Conteudo | 10 | book, camera, image, video, pen, article, blog, podcast, slide, document |
| Seguranca | 10 | lock, shield, key, check, verified, guard, armor, protect, safe, trust |
| Alerta | 10 | flame, lightning, bell, warning, alert, exclamation, urgent, important, flag, signal |
| Dados | 10 | chart, graph, pie, analytics, metric, dashboard, report, insight, trend, growth |

## Estilos de Icone

| Estilo | Caracteristica |
|--------|---------------|
| Line art | Tracos finos (1.5-2px), elegante, minimalista |
| Solid | Preenchido, forte, impacto visual |
| Duotone | Duas cores, moderno, profundidade |
| Outline bold | Tracos grossos (2.5-3px), impacto, visibilidade |

## Manual de Criacao

Salvo em docs/icon-creation-manual.md com:
- Grid padrao do estilo escolhido
- Peso de traco obrigatorio
- Cantos (arredondados ou retos)
- Cores permitidas (--g2 e --g-accent)
- Tamanhos de exportacao (24x24, 32x32, 48x48, 64x64, 80x80)
- Regras de consistencia
