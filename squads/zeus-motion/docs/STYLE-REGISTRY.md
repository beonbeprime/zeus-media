# Style Registry — Zeus Motion

Catálogo de estilos. ON-DEMAND: cada estilo só carrega quando seus gatilhos aparecem.

## Estáveis (replicáveis)

| Estilo | Gatilhos | Doc | Base aprovada |
|--------|----------|-----|---------------|
| Navy Arquiteto Vintage | navy, arquiteto, vintage editorial, conhecimento brian, autoridade adulta | `STYLE-NAVY-ARQUITETO-VINTAGE.md` | ConhecimentoBrian v07 |
| Neo-Analógica | neo-analógica, brutalismo funcional, dark premium, rosa, verde acid | `STYLE-NEOANALOGIACA.md` | MaquinaNeoanalogiaca2 v12 |

## Em uso (docs no header das compositions, sem MD dedicado)

| Estilo | Gatilhos | Composition | Paleta |
|--------|----------|-------------|--------|
| Dark Luxury Tech Premium | luxury tech, laser red, nível 5 | MagnaUltraPremium, Ads007, MentoriaEstrutura21Dias | dark + `#FF001E` |
| Vintage Premium Anos 80 | anos 80, retrowave, vintage 80 | MaquinaMentoria | dark + gold + cyan + magenta |
| Vintage Sepia Quente | sepia, vintage quente | Conhecimento | paper + sepia + rust + gold |
| Apple Minimalist Kinetic | apple minimalista, pitch minimal | MentoriaPitch | minimal |
| Brabo Edition | brabo, diretor brabo | AgenteArquiteto, V2 | (ver `brabo-motion-os-v9.md`) |

## Como escolher

| Objetivo | Estilo |
|----------|--------|
| Autoridade adulta, explicar produto | Navy Arquiteto Vintage |
| Anúncio moderno direto | Neo-Analógica |
| Lançamento high ticket nível 5 | Dark Luxury Tech Premium |
| Feminino premium viral | Neo-Analógica Rosa |
| Low ticket agressivo | Vintage Premium Anos 80 |
| Storytelling emocional | Vintage Sepia Quente |
| Pitch minimal | Apple Minimalist Kinetic |
| Institucional Magna direto | Brabo Edition |

## Convenções globais Zeus Motion

- Portrait 1080×1920, 30fps, h264
- Áudio: trilha + narração em camadas
- Whisper word-timestamps obrigatório
- FULLSAFE em `_versions/` antes de editar
- Tag `-APROVADO-1080x1920` após aprovação
- Type-check zero erros antes de render

## Criar novo estilo

Estilo novo nasce de composition real aprovada. Quando aprovada:
1. Criar `docs/STYLE-NOME.md` enxuto (modelo: Navy Arquiteto Vintage)
2. Adicionar linha aqui no registry com gatilhos
