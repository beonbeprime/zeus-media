# Erros aprendidos - PHOTO LYRICS

Formato padrão do AIOS. Cada erro vira regra. 2ª ocorrência do mesmo tipo = CRÍTICO.

## ERRO #0 - pré-registrado (regra global do Allysson)
ASSUNTO: acentuação em imagem gerada
PROBLEMA: gerador de imagem escreve texto PT sem acento ("VOCE", "NAO", "CORACAO")
CAUSA: modelos de imagem tratam acentos como ruído tipográfico
CORREÇÃO: gate de visão obrigatório (Acento) + reforço explícito de acento no prompt
REGRA: nenhuma imagem aprovada sem image.validation.ok == true
CRÍTICO: SIM (pré-escalado, erro recorrente conhecido)

## ERRO #0.1 - pré-registrado
ASSUNTO: motion deformando letras
PROBLEMA: image-to-video pode redesenhar/morfar o texto durante o movimento
PREVENÇÃO: prompts de motion proíbem animação sobre o texto + rodapé obrigatório;
QC confere o frame do meio de cada vídeo antes do render

## ERRO #0.2 - pré-registrado
ASSUNTO: cena parada
PROBLEMA: vídeo faltante sem fallback deixa a cena congelada
PREVENÇÃO: 05_manifest.py define Ken Burns para TODA cena sem vídeo; cena longa
ganha motion_refresh (inverte a direção na metade)

## ERRO #1 - 2026-06-10
ASSUNTO: ambiente de áudio
PROBLEMA: demucs separou na GPU mas falhou ao salvar o WAV (ImportError torchcodec)
CAUSA: torchaudio >= 2.9 delega o save para o torchcodec, que não vinha no requirements
CORREÇÃO: pip install torchcodec no .venv; adicionado ao requirements.txt
REGRA: torchcodec faz parte do ambiente de áudio obrigatório do squad
CRÍTICO: NÃO (1ª ocorrência)

## ERRO #0.3 - pré-registrado (herdado do AIOS, ERRO #5 global)
ASSUNTO: entrega de vídeo
PROBLEMA: mandar o usuário abrir terminal/Studio em vez de entregar o arquivo
REGRA: renderizar via CLI e entregar o caminho do .mp4. O usuário quer o arquivo.
