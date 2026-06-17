# Banco de conceitos de cena - PHOTO LYRICS

Catálogo de superfícies onde a frase aparece ESCRITA. Cada conceito tem:
superfície, ambiente, paleta, categoria (regra anti-repetição) e motion default.

## Por sentimento da frase

| Sentimento | Conceitos (superfície com o texto escrito) |
|---|---|
| Amor/desejo | espelho com batom, cartão num drink na praia, tatuagem nas costas, bilhete dobrado na mesa, espuma do café (latte art), post-it no notebook |
| Saudade/melancolia | janela embaçada escrita com o dedo, página de agenda antiga, livro aberto sublinhado, carta manuscrita, polaroide legendada, areia da praia |
| Raiva/atitude | parede grafitada, muro pichado, caminhão com letreiro, camiseta estampada, adesivo de para-choque, luva de boxe gravada |
| Festa/leveza | letreiro neon de bar, garrafa com rótulo, copo com nome escrito, pacote de bala/embalagem, marquise de cinema, bexiga escrita com caneta |
| Fé/superação | placa de rua, outdoor na estrada, faixa de quermesse, pulseira gravada, medalha, mural comunitário |
| Dinheiro/ambição | recibo/ticket, tela de caixa eletrônico, cofre com plaquinha, nota dobrada com escrita, vitrine com adesivo, crachá |
| Genérico/coringa | quadro-negro de café, luminoso de farmácia, capa de caderno, etiqueta de mala, jornal na banca, embalagem de delivery |

Categorias para a regra anti-repetição: `objeto-bebida`, `pele-corpo`,
`parede-rua`, `papel-escrito`, `letreiro-luz`, `natureza`, `tecido-roupa`,
`tela-digital`, `embalagem`.

## Regras de seleção (obrigatórias)

1. Coerência: o conceito conversa com o sentimento da frase (frase de dor não
   vai em letreiro neon de festa).
2. Variação consecutiva: cena N+1 nunca repete a categoria da cena N; alternar
   também ângulo, paleta (quente/frio), ambiente (interno/externo), luz (dia/noite).
3. Máximo 2 cenas no mesmo ambiente por vídeo; nenhum conceito repetido no mesmo vídeo.
4. Tipografia plausível na superfície: giz no quadro, agulha na pele, tinta no
   muro, batom no espelho. Nada de "texto flutuando".
5. Vertical 9:16 nativo: objetos em pé (garrafa, porta, costas, placa) têm
   prioridade sobre cenas panorâmicas.
6. Texto sempre nos 2/3 SUPERIORES do quadro.
7. Rotação entre produções: registrar os conceitos usados em
   `data/concept-rotation.json` para anúncios consecutivos não parecerem iguais.

## Processo do Creative Director (Scena)

Para cada frase: ler o sentimento -> gerar 3 conceitos do catálogo (ou novos,
criatividade é bem-vinda dentro das regras) -> avaliar (impacto visual,
legibilidade, coerência, variação) -> escolher 1 -> gravar `concept` no manifest.
Salvar o raciocínio em `03-conceitos/conceitos.md`.
