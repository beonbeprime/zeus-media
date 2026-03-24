# Regras de Edicao de Video - Zeus Media

## STATUS: SEMPRE ATIVO em qualquer edicao de video

## Regra Principal

NAO legendar o video inteiro. APENAS frases marcantes e bullets visuais.
O video original e a base. Os overlays sao complementos visuais estrategicos.

## O Que Colocar no Video

1. GANCHOS (primeiros 3 segundos):
   - Frase curta, impactante, que prende atencao
   - Fonte grande, animacao de entrada rapida
   - Pode ter emoji se o estilo da pessoa permitir

2. FRASES MARCANTES (ao longo do video):
   - Peso 7-10 no Content Analyzer = mostrar como overlay
   - Peso 4-6 = considerar, so mostrar se complementa
   - Peso 0-3 = ignorar, nao mostrar
   - Max 5-8 frases por video de 60s

3. BULLETS / ITENS:
   - Listas curtas (3-5 itens)
   - Aparecem sequencialmente com stagger
   - Icone + texto curto

4. DESTAQUES:
   - Palavras-chave em cor accent
   - Max 1-2 palavras destacadas por frase
   - Usar --g-accent ou --g2

## Animacoes de Texto

### Entradas:
- fadeInUp: opacidade 0>1 + translateY 30px>0 (0.4s)
- slideInLeft: translateX -100%>0 (0.3s)
- scaleIn: scale 0.8>1 + opacidade 0>1 (0.35s)
- typewriter: letra por letra (para ganchos curtos)

### Saidas:
- fadeOut: opacidade 1>0 (0.3s)
- slideOutRight: translateX 0>100% (0.25s)

### Efeitos especiais (MAX 3 por video):
- zoomPulse: scale 1>1.05>1 rapido (momento de impacto)
- flash: tela branca 0.1s (transicao forte)
- shake: tremor sutil (surpresa/choque)

### Timing:
- Permanencia de cada frase: 2-4 segundos
- Gap entre frases: minimo 1 segundo
- Gancho inicial: aparece em 0.5s, permanece 3-4s

## Estilos Visuais (baseados no perfil da pessoa)

### Conceitual:
- Caixas com bordas finas (1px solid var(--border))
- Layout limpo, alinhamento centralizado
- Fundo semi-transparente atras do texto

### Vintage:
- Texturas sutis sobre o texto
- Cores quentes, fontes serif
- Efeito de grain mais forte

### Moderno:
- Gradientes sutis atras do texto
- Sans-serif geometrica
- Linhas e formas geometricas como decoracao

### Minimalista:
- Texto grande, sem decoracao
- Fundo com blur do video (backdrop-filter)
- Poucos elementos, muito espaco

### Impactante:
- Texto bold, grande
- Cores vibrantes
- Mais efeitos de animacao

## Padrao Tecnico

| Propriedade | Reels/Stories | YouTube |
|------------|---------------|---------|
| Resolucao | 1080x1920 (9:16) | 1920x1080 (16:9) |
| Fonte minima | 36px | 28px |
| Area segura texto | 100px das bordas | 80px das bordas |
| Sombra no texto | 2px 2px 8px rgba(0,0,0,0.7) | 2px 2px 6px rgba(0,0,0,0.5) |

## Fluxo de Analise do Video

1. Transcrever audio (identificar todas as frases)
2. Classificar cada frase (peso 0-10):
   - 0-3: conteudo de transicao, ignorar
   - 4-6: conteudo relevante, avaliar
   - 7-10: frase marcante, MOSTRAR como overlay
3. Identificar momentos de emocao (mudanca de tom, enfase)
4. Mapear timestamps para posicionamento dos overlays
5. Selecionar ganchos (pode vir do meio/final do video)

## Ortografia

VERIFICAR toda frase antes de inserir no video.
Acentuacao perfeita obrigatoria.
Se tiver duvida, consultar dicionario.

## O Que NAO Fazer

- NAO legendar frase por frase
- NAO usar mais de 3 efeitos especiais por video
- NAO colocar texto em areas onde o rosto da pessoa esta
- NAO usar cores que nao sao da paleta configurada
- NAO colocar texto nos primeiros 0.5s (esperar o video carregar)
- NAO sobrepor 2 textos ao mesmo tempo
