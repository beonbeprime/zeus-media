# REELS ZOOM - Biblioteca de Variacoes de Layout

## STATUS: CONSULTAR ANTES DE MONTAR CADA VIDEO

O padrao visual e UNICO (mesmas cores, fontes, icones).
O que varia e a COMPOSICAO - como texto, icone e espaco se organizam.
Nunca usar o mesmo layout duas vezes consecutivas no mesmo video.
Nunca usar exatamente os mesmos layouts em videos diferentes da mesma semana.

---

## PARTE 1: 15 VARIACOES DE B-ROLL (texto + icone)

Cada B-roll usa um `forceStyle`. Os estilos disponiveis no MagnaEditV2:

### ESTILOS COM ICONE (usar quando tem iconId)

**V01 - ICON+HEAD (forceStyle=1)**
```
Icone centralizado (320px)
[HEADLINE GRANDE]
```
Ideal para: conceito simples, palavra de impacto unica
Exemplo: icone "target" + "FOCO NO ALUNO"

**V02 - FULL (forceStyle=2)**
```
icone centralizado (320px)
sub pequeno (contexto)
[HEADLINE GRANDE]
```
Ideal para: revelar algo importante com contexto
Exemplo: icone "dollar" + "depois da venda" + "DEFINA O CONTEUDO"

**V03 - ICON+SUB+HEAD menor (forceStyle=7)**
```
icone centralizado (menor)
sub texto
[headline media]
```
Ideal para: momento emocional, conceito suave
Exemplo: icone "heart" + "o que importa" + "A Transformacao"

**V04 - FULL animado (forceStyle=0)**
```
[SUBTEXTO pequeno]
HEADLINE GRANDE
icone embaixo
```
Ideal para: revelacao com inversao de hierarquia
Exemplo: "voce estava errando" + "A ORDEM CORRETA" + icone "crown"

### ESTILOS SEM ICONE (gancho, contraste, texto puro)

**V05 - TAG+HEAD (forceStyle=5)**
```
[tag pequena]
HEADLINE GIGANTE
```
Ideal para: gancho do inicio, afirmacao maxima
Exemplo: "Primeiro você vende," + "depois você constrói o conteúdo"

**V06 - HEADLINE PURA (forceStyle=3)**
```
HEADLINE GRANDE CENTRALIZADA
(sem mais nada)
```
Ideal para: momento de pausa, afirmacao forte sozinha
Exemplo: "VENDE PRIMEIRO"

**V07 - letterBlur (type: text-animation, forceStyle=5)**
```
Texto surge letra por letra com blur
```
Ideal para: gancho inicial, frase de abertura
Exemplo: "mentoria funciona diferente / No Mundo Real"

**V08 - DUPLA linha (forceStyle=5, 2 elements)**
```
linha pequena acima
LINHA GRANDE ABAIXO
```
Ideal para: comparacao problema/solucao em 2 linhas
Exemplo: "a pergunta errada" + "O Que Falar na Mentoria?"

**V09 - STAGGER texto (animation: stagger)**
```
elemento 1  ->  elemento 2  ->  elemento 3
```
Ideal para: processo, sequencia, antes/depois
Exemplo: "DESCOBRE" -> "APLICA" -> "VENDE"

**V10 - NUMERO GRANDE (style: number-impact)**
```
[NUMERO GIGANTE]
contexto pequeno
```
Ideal para: dado, estatistica, prova social
Exemplo: "7.000" + "reais por mentoria"

**V11 - PERGUNTA (forceStyle=5)**
```
frase pequena de contexto
PERGUNTA GRANDE?
```
Ideal para: engajar reflexao, virar o jogo
Exemplo: "voce ja parou para pensar" + "POR QUE NAO VENDE?"

**V12 - CONTRASTE (forceStyle=5, 2 linhas contrastantes)**
```
linha riscada/negativa pequena
LINHA POSITIVA GRANDE
```
Ideal para: mito vs verdade, errado vs certo
Exemplo: "nao e sobre o conteudo" + "E SOBRE A VENDA"

**V13 - LISTA curta (forceStyle=2, 3 elements)**
```
[icone]
- item 1
- item 2
- item 3
```
Ideal para: enumerar passos, beneficios, razoes
Exemplo: icone "document" + "1. Vende / 2. Entende a Dor / 3. Cria"

**V14 - FULL sem sub (forceStyle=2, 1 element)**
```
[icone grande]
[HEADLINE GRANDE]
```
Ideal para: conceito central do video, climax
Exemplo: icone "crown" + "MENTORIA QUE TRANSFORMA"

**V15 - TRANSICAO narrativa (forceStyle=3, sem icone)**
```
[FRASE DE TRANSICAO]
(muda de assunto no video)
```
Ideal para: quando o gancho vem do meio e precisa conectar
Exemplo: "mas antes disso" ou "E POR ISSO QUE"

---

## PARTE 2: 15 VARIACOES DE SCHEMA VISUAL

Schemas aparecem 1x a cada 15s (ZOOM/VERTICAL) ou 10s (MOTION).
Cada schema usa `type` e `layout` diferentes.

**S01 - PATH horizontal 2 (type=path, layout=horizontal)**
```
[icone A] ---> [icone B]
ELEMENTO 1     ELEMENTO 2
```
Ideal para: causa-efeito, sequencia simples
Exemplo: "Vende Primeiro" -> "Constrói Depois"

**S02 - FLOW horizontal 3 (type=flow, layout=horizontal)**
```
[A] ---> [B] ---> [C]
```
Ideal para: processo de 3 etapas
Exemplo: "DIRECIONA" -> "PLANO DE ACAO" -> "CONTEUDO"

**S03 - FLOW horizontal 4 (type=flow, layout=horizontal)**
```
[A] -> [B] -> [C] -> [D]
```
Ideal para: funil, jornada de 4 passos
Exemplo: "Lead" -> "Sessao" -> "Proposta" -> "Venda"

**S04 - CHECKLIST 3 itens (type=checklist)**
```
[x] item 1
[x] item 2
[x] item 3
```
Ideal para: lista de acoes, requisitos, gatilhos
Exemplo: "Definiu a dor / Montou o plano / Entregou resultado"

**S05 - CHECKLIST 5 itens (type=checklist)**
```
[x] item 1
[x] item 2
[x] item 3
[x] item 4
[x] item 5
```
Ideal para: protocolo completo, checklist de vendas

**S06 - COMPARACAO lado a lado (type=comparison)**
```
ERRADO        CERTO
[x] item A    [v] item A
[x] item B    [v] item B
```
Ideal para: mito vs verdade, antes/depois, certo/errado

**S07 - PIRAMIDE (type=pyramid)**
```
      [topo]
   [meio esq][meio dir]
[base esq][base meio][base dir]
```
Ideal para: hierarquia, estrutura de mentoria, prioridades

**S08 - VERTICAIS empilhados (type=flow, layout=vertical)**
```
[A]
 |
[B]
 |
[C]
```
Ideal para: dependencia em cadeia, pre-requisitos

**S09 - TIMELINE (type=timeline)**
```
PASSADO --> PRESENTE --> FUTURO
   [A]         [B]         [C]
```
Ideal para: evolucao, jornada do mentorado

**S10 - DIVISAO 1:N (type=split)**
```
      [ORIGEM]
     /    |    \
  [A]    [B]   [C]
```
Ideal para: 1 causa -> 3 efeitos, 1 produto -> 3 beneficios

**S11 - CONVERGENCIA N:1 (type=merge)**
```
[A]    [B]   [C]
   \    |    /
    [DESTINO]
```
Ideal para: 3 inputs -> 1 resultado, multiples razoes -> 1 conclusao

**S12 - GRID 2x2 (type=grid)**
```
[A] | [B]
---------
[C] | [D]
```
Ideal para: 4 pilares, 4 tipos, quadrante de decisao

**S13 - ICEBERG (type=iceberg)**
```
    [visivel - pequeno]
=======================
    [invisivel - grande]
```
Ideal para: o que aparece vs o que sustenta, resultado vs processo

**S14 - CICLO (type=cycle)**
```
[A] --> [B]
 ^       |
 |       v
[D] <-- [C]
```
Ideal para: processo que se repete, ciclo de aprendizado

**S15 - DESTAQUE UNICO (type=spotlight)**
```
     [ELEMENTO CENTRAL GIGANTE]
contexto pequeno embaixo
```
Ideal para: o ponto central do video, a grande sacada

---

## REGRAS DE USO

### Dentro de um mesmo video
- NUNCA usar o mesmo B-roll style (V01-V15) mais de 2x
- NUNCA usar o mesmo schema (S01-S15) 2x
- Variar: se o B-roll anterior foi "icone grande + headline", o proximo deve ser diferente

### Entre videos diferentes
- Registrar quais layouts foram usados em cada video
- Evitar repetir os mesmos 3 layouts em sequencia entre videos

### Ordem recomendada dentro de um video
1. B-roll 0: gancho visual (V05, V07 ou V08 - sem icone, impacto maximo)
2. B-rolls 1-3: com icone (V01, V02, V03 alternando)
3. Schema: no meio do video (S01-S04 para processos simples)
4. B-rolls 4-6: com icone (V04, V14, V13)
5. Fechamento: V06 ou V14 (frase de impacto final)

---

## COMBINACOES PROIBIDAS

- Dois V07 (letterBlur) no mesmo video
- Dois S01 (path 2 elementos) no mesmo video
- V06 (headline pura) seguido de V06 - precisa alternar
- 3+ B-rolls com forceStyle=2 seguidos (parece repetitivo)

---

## REFERENCIA RAPIDA forceStyle

| forceStyle | Estilo | Tem icone? |
|-----------|--------|------------|
| 0 | FULL com sub | SIM |
| 1 | ICON+HEAD | SIM |
| 2 | FULL (sub + head) | SIM |
| 3 | HEAD puro | NAO |
| 4 | (variacao interna) | NAO |
| 5 | TAG + HEAD | NAO |
| 6 | (variacao interna) | NAO |
| 7 | ICON+SUB+HEAD menor | SIM |
