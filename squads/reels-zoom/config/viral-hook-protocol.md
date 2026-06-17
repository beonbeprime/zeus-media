# PROTOCOL DE GANCHO VIRAL - Reels Zoom

## STATUS: GATE OBRIGATORIO - Nenhum video sai sem gancho aprovado

Todo video precisa de um gancho que faz o espectador PARAR O SCROLL.
Um gancho ruim = video ignorado. Um gancho bom = 10x mais visualizacoes.

---

## OS 10 GATILHOS PSICOLOGICOS (usar pelo menos 1)

### CATEGORIA 1 - Para scroll imediato (mais potentes)

| Gatilho | Como usar | Exemplo |
|---------|-----------|---------|
| CONTRAINTUITIVO | Vai contra o que a pessoa acredita | "Vende antes de criar o produto" |
| PROIBIDO/CENSURADO | Sugere que nao deveria ser dito | "O que nenhum mentor te conta" |
| ERRADO/ACUSACAO | Diz que a pessoa esta errando | "Voce esta destruindo sua mentoria" |
| ESTRANHO/BIZARRO | Causa estranheza ou surpresa | "Aluno entrou no meio da mentoria?" |

### CATEGORIA 2 - Curiosidade irresistivel

| Gatilho | Como usar | Exemplo |
|---------|-----------|---------|
| GAP DE INFORMACAO | Cria uma pergunta que so o video responde | "O que acontece quando voce faz isso?" |
| NUMERO ESPECIFICO | Numero concreto = credibilidade | "3 erros que destroem sua mentoria" |
| ANTES/DEPOIS | Promete transformacao visivel | "De confuso para protocolo claro" |

### CATEGORIA 3 - Identificacao

| Gatilho | Como usar | Exemplo |
|---------|-----------|---------|
| SITUACAO ESPECIFICA | Nomeia a situacao exata | "Voce vende mentoria mas nao sabe o preco?" |
| MEDO/AMEACA | Aponta algo que o espectador teme | "Isso vai matar sua mentoria antes de comecar" |
| VALIDACAO NEGADA | Contraria crenca comum | "Mentoria de sucesso nao depende do conteudo" |

---

## GATE DE APROVACAO AUTOMATICA

### APROVAR automaticamente se:
- Usa pelo menos 1 dos 10 gatilhos acima
- Tem maximo 7 palavras
- Funciona sem o video (stand-alone como texto)
- Cria uma PERGUNTA ou TENSAO na cabeca de quem ve

### REPROVAR automaticamente se:
- E apenas descritivo: "Ritmos Diferentes", "Na Pratica", "Mesma Turma"
- Usa "eu" ou o nome do mentor: "Eu fiz isso...", "Allysson ensina..."
- E generico sem gatilho: "Mentoria funciona assim"
- Tem mais de 8 palavras
- Nao cria curiosidade ou tensao

---

## PROCESSO DE GERACAO (3 passos, SEMPRE)

### PASSO 1: Analisar o conteudo
Ler a transcricao e identificar:
- Qual e a LICAO PRINCIPAL (o que o viewer vai aprender)
- Qual e o MOMENTO DE MAIOR IMPACTO (a frase mais forte do video)
- Qual e a TENSAO do conteudo (problema vs solucao, teoria vs pratica, etc.)
- Para QUEM e o video (mentor? vendedor? educador?)

### PASSO 2: Gerar 3 opcoes rankeadas
- Opcao 1: usar gatilho CONTRAINTUITIVO ou ERRADO (mais arriscado, mais viral)
- Opcao 2: usar gatilho SITUACAO ESPECIFICA ou NUMERO (mais seguro, mais claro)
- Opcao 3: usar gatilho GAP DE INFORMACAO ou MEDO (alternativa equilibrada)

Cada opcao deve ter:
- O texto do gancho (max 7 palavras)
- O gatilho que usa
- Por que vai funcionar (1 linha)

### PASSO 3: PAUSA OBRIGATORIA - usuario escolhe
Apresentar as 3 opcoes ao usuario. Aguardar escolha.
SEM aprovacao do gancho = SEM continuar o pipeline.

---

## EXEMPLOS REAIS (aprovados)

### Bom
- "Aluno entrou no meio da mentoria?" (ESTRANHO/SITUACAO ESPECIFICA)
- "Primeiro, voce vende" (CONTRAINTUITIVO - vende antes de ter o produto)
- "Voce esta destruindo seus alunos" (ACUSACAO)
- "3 passos quando entra aluno novo" (NUMERO + SITUACAO)

### Ruim (reprovar)
- "Ritmos Diferentes" - descritivo, sem tensao
- "Eu estudava o teu caso" - fala do mentor, nao do viewer
- "Mesma Turma" - fragmento sem contexto
- "Na pratica" - vago, sem gancho

---

## FORMULAS PRONTAS POR CONTEXTO

| Contexto do video | Formula de gancho |
|------------------|-------------------|
| Ensina como vender | "Voce [verbo de erro] sua [produto]?" |
| Ensina processo/metodo | "[N] passos para [resultado] quando [situacao especifica]" |
| Revela segredo | "O que nenhum [persona] conta sobre [assunto]" |
| Contraria crenca | "[Coisa comum] nao funciona [contexto especifico]" |
| Situacao especifica | "[Situacao exata que o viewer enfrenta]?" |
| Dado de impacto | "[Numero] [pessoas/mentorados] [resultado inesperado]" |
| Medo/risco | "Isso vai [consequencia negativa] antes de [marco]" |
| Transformacao | "De [estado atual ruim] para [estado desejado]" |

---

## REGRAS ADICIONAIS

1. NUNCA usar palavras do conteudo que venham DEPOIS do gancho (spoiler)
2. SEMPRE conectar com o que e dito nos primeiros 3 segundos do audio
3. NUNCA o mesmo gancho para 2 videos do mesmo mentor
4. O gancho pode ser a frase de abertura OU pode ser retirado do meio/final do video
5. Se o conteudo e de 5 minutos, o gancho vem do trecho mais impactante (pode ser aos 3min)

---

## REGISTRO (atualizar apos cada video)

Ao finalizar um video, adicionar o gancho aprovado em `data/icon-rotation.json`:
```json
"hook": "texto do gancho aprovado"
```

E no `config/errors-learned.md` se o gancho foi rejeitado e reescrito.


---

## ATUALIZAÇÃO: METODOLOGIA LUCAS MACEDO (aula 09/06/2026) - DOSE COMPLETA

Documento mestre: `docs/metodologias/metodo-lucas-macedo-viralizacao.md`.

Regras que passam a valer na extração de hook e na montagem narrativa dos Reels:

1. Hook é MANCHETE, gancho é retenção. O hook extractor deve gerar manchetes estilo jornal de fofoca (Choquei): tensão, curiosidade, palavras como "vazou", "interno", nomes e números. Exemplo validado: "Vazou um vídeo interno do 'pastor' dos carros" (4 milhões de views).
2. Gerar SEMPRE variações do mesmo hook para teste: palavra trocada, 1 linha vs 2 linhas, fundo branco vs preto, com e sem aspas. O mesmo vídeo vai ao Reels Test com hooks diferentes.
3. NUNCA terminar o vídeo: cortar sem fechamento, sem tchau, sem conclusão. Bater a porta na cara. Alternativa avançada: loop (última frase conecta com a primeira).
4. Sem CTA no corte feito para viralizar. A emoção é a CTA. CTA única e leve só em cortes de autoridade.
5. Mapear a emoção por bloco do vídeo (começo, meio, fim). Se a emoção muda, a trilha pode mudar (até 3 músicas).
6. Legenda simples, no meio, organizada. PROIBIDO letra colorida (remete a venda; venda não viraliza). Legendas de chamada pontuais valem mais que transcrição completa.
7. Cortes de no máximo 30 segundos têm prioridade para contas sem histórico de viral.
8. Critério de sucesso no Reels Test: 100 views no primeiro minuto; 3 a 5 mil em 10 minutos = potencial real.
9. Formato episódio/série: cortes que deixam gosto de quero mais geram maratona de perfil, o que o algoritmo mais premia.
