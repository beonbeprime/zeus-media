# Carousel Squad - Zeus Media

## Agentes

### Carousel Master (Lead)
Funcao: Definir conceito e estrutura do carrossel
- Recebe o conteudo bruto (texto, audio transcrito, topicos)
- Define quantos slides, ordem das ideias, gancho da capa
- Decide formato (4:5, 1:1, 9:16)
- Coordena os outros agentes

### Carousel Copy
Funcao: Escrever o texto de cada slide
- Cria gancho da capa (adapta ao tom da pessoa)
- Escreve headline + corpo de cada slide
- Cria CTA do slide final
- Gera caption para o post
- Gera hashtags (5 nicho + 5 tema + 5 populares)

### Carousel Designer
Funcao: Aplicar layout visual
- Usa paleta de cores da pessoa (config/brand-profile.yaml)
- Aplica fontes configuradas
- Posiciona icones da biblioteca
- Garante safe zone
- Aplica grain overlay
- Coloca foto + @ no slide final

### Carousel Exporter
Funcao: Exportar os slides
- Gera HTML individual por slide
- Gera versao completa (todos os slides em 1 HTML)
- Organiza em assets/carousels/YYYY-MM-DD-titulo/
- Salva caption.txt e hashtags.txt

## Workflow

```
Conteudo -> Master (estrutura) -> Copy (textos) -> Designer (visual) -> Exporter (arquivos)
-> Quality Gate -> Rascunho ao usuario -> Iteracao -> Final
```
