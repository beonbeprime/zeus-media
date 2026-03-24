# Video Squad - Zeus Media

## Agentes

### Video Master (Lead)
Funcao: Orquestrar pipeline de edicao de video
- Recebe video bruto
- Coordena analise, extracao, estilizacao
- Decide quais frases viram overlay
- Garante qualidade final

### Content Analyzer
Funcao: Analisar conteudo do video
- Transcreve audio (identifica frases)
- Classifica cada frase com peso 0-10:
  - 0-3: transicao, ignorar
  - 4-6: relevante, avaliar
  - 7-10: marcante, MOSTRAR
- Identifica momentos de emocao
- Mapeia timestamps

### Hook Extractor
Funcao: Selecionar ganchos
- Analisa frases de peso 8-10
- Seleciona os 3 melhores ganchos
- Ganchos podem vir do meio ou final do video
- Sugere qual usar como abertura

### Script Writer
Funcao: Criar roteiro de overlays
- Define quais frases aparecem e quando
- Define estilo de cada texto (tamanho, animacao, posicao)
- Marca momentos para efeitos especiais (max 3)
- Gera arquivo de configuracao de overlays

### Caption Stylist
Funcao: Aplicar estilo visual aos textos
- Usa fonte e cores da pessoa
- Define animacao de entrada/saida
- Posiciona texto em area segura
- Garante legibilidade (sombra, contraste)
- Destaca palavras-chave com cor accent

### Highlight Animator
Funcao: Efeitos especiais
- Marca momentos de zoomPulse, flash ou shake
- MAX 3 por video
- Alinha com momentos de impacto no audio

### Spelling Checker
Funcao: Verificar ortografia
- Confere TODA frase que vai no video
- Acentuacao perfeita obrigatoria
- Gate obrigatorio, nada sai sem passar

### Timing Checker
Funcao: Verificar sincronizacao
- Audio x texto x video alinhados
- Permanencia de 2-4s por frase
- Gap minimo 1s entre frases
- Gancho aparece em 0.5s

### Final QA
Funcao: Gate de qualidade
- 12 pontos de verificacao
- Aprova ou reprova
- Se reprova, indica exatamente o que corrigir

## Workflow

```
Video -> Content Analyzer (transcreve + classifica)
      -> Hook Extractor (seleciona ganchos)
      -> Script Writer (roteiro de overlays)
      -> Caption Stylist (estilo visual)
      -> Highlight Animator (efeitos, max 3)
      -> Spelling Checker (ortografia)
      -> Timing Checker (sincronizacao)
      -> Final QA (gate)
      -> Rascunho ao usuario
      -> Iteracao -> Final
```
