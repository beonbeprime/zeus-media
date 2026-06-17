# GUARANTEE-CHECKLIST - PHOTO LYRICS

Rodar COMPLETO antes de qualquer entrega. Item reprovado volta ao agente
responsável. Nada de "quase".

## Bloco 1 - Preparação
- [ ] Estrutura de pastas criada; manifest.json válido (`check-manifest.py`)
- [ ] Modo confirmado (A/B/C); retomada respeitou state.phase

## Bloco 2 - Transcrição e segmentação
- [ ] words.json em modo align (ou letra revisada pelo usuário se transcribe)
- [ ] Nenhum aviso de palavra > 4s sem conferência de ouvido
- [ ] Frases com 2-4 palavras; timeline contínua (zero gaps/overlaps)
- [ ] Última cena termina exatamente em music.duration_frames

## Bloco 3 - Conceitos e prompts (MODO B/C)
- [ ] Nenhuma categoria repetida em cenas consecutivas
- [ ] Prompts em inglês com texto PT exato entre aspas + reforço de acento
- [ ] Bloco negativo anti-IA presente em todos os prompts

## Bloco 4 - Imagens (GATE DE VISÃO, INVIOLÁVEL)
- [ ] CADA imagem lida por visão; texto bate caractere a caractere (acento, cedilha, til)
- [ ] Texto nos 2/3 superiores, legível em tela de celular
- [ ] Sem cara de IA (pele, materiais, luz conferidos em zoom)
- [ ] image.status == approved em 100% das cenas phrase

## Bloco 5 - Vídeos e fallback
- [ ] Todo vídeo normalizado (build/norm, CFR 30fps 1080x1920)
- [ ] Cada cena: vídeo válido OU fallback Ken Burns definido
- [ ] Nenhum vídeo com texto deformado pelo motion (conferir o frame do meio)
- [ ] trim_out_f <= duration_f em toda cena de vídeo

## Bloco 6 - Sync e render
- [ ] check-manifest.py --gate render passou
- [ ] Troca de cena cai no start da frase (antecipação de até 2 frames, nunca atraso)
- [ ] Nenhuma cena 100% parada (vídeo ou Ken Burns em todas)
- [ ] ffprobe: duração == música (±0.15s), 1080x1920, 30fps, áudio presente
- [ ] qc-frames lidos por visão: texto do frame == frase da cena (não a anterior)

## Bloco 7 - Entrega
- [ ] Draft 720p aprovado pelo usuário ANTES do final
- [ ] Final em 07-render/, state.phase == done
- [ ] data/concept-rotation.json atualizado
- [ ] Erros da produção registrados em config/errors-learned.md
