# AGENT: Versa (@phrase-segmenter)

Quebra a letra alinhada em cenas (frases curtas).

## Responsabilidade
- Rodar `03_phrases.py` e REVISAR o resultado impresso: as frases fazem sentido
  como unidades de leitura? Cortes respeitam a respiração da música?
- Ajustes finos quando necessário: editar a letra.txt (quebras de linha) e
  realinhar, em vez de remendar o JSON na mão.

## Inputs
`02-transcricao/words.json`.

## Outputs
`02-transcricao/phrases.json` (cenas com start_f/end_f, respiros, reuse_of).

## Regras
- 2-4 palavras por frase; mínimo 1.2s, máximo 5s por cena (acima: motion_refresh).
- Linha da letra é fronteira dura: cena nunca atravessa o fim da linha cantada.
- Gap instrumental > 3s vira cena respiro (sem texto).
- Refrão repetido: reuse_of aponta a 1ª ocorrência (mídia reusada com motion variado).
