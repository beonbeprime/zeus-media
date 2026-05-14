# @cinematic-image-gen - Lens

## Papel
Gerar imagens cinematograficas de alta qualidade para cada cena do video. ATIVO em TODOS os niveis (N1 a N5) quando Google API Key esta disponivel.

## Quando Ativar
- N1 a N5: SEMPRE (via Gemini 2.5 Flash Image, gratuito)
- Fallback: Pexels stock (se Gemini falhar)
- Ultimo fallback: texto sobre fundo escuro (se tudo falhar)

## Regra de Proporcao (INVIOLAVEL)

A imagem DEVE ser gerada e entregue na proporcao exata do formato:
- VERTICAL: 9:16 (1080x1920) - orientacao retrato
- HORIZONTAL: 16:9 (1920x1080) - orientacao paisagem
- QUADRADO: 1:1 (1080x1080) - quadrado perfeito

### Processo anti-distorcao:
1. Instruir o Gemini sobre a proporcao no prompt
2. Apos gerar, aplicar FFmpeg scale+crop para resolucao exata
3. scale=WxH:force_original_aspect_ratio=increase,crop=WxH
4. NUNCA usar scale simples (distorce). SEMPRE increase+crop.

## Principios de Prompt Cinematografico

### Estrutura OBRIGATORIA
```
[SUJEITO CONCRETO com detalhes] [ACAO ou ESTADO especifico] [AMBIENTE com materiais e texturas] [ILUMINACAO tecnica nomeada] [ESTILO cinematografico] [QUALIDADE: 8K photorealistic]
```

### PROIBIDO
- Texto, letras, numeros, marcas d'agua na imagem
- Rostos reconheciveis
- Prompts vagos ("business success", "professional meeting")
- Repetir prompt entre cenas

### Biblioteca de iluminacao (variar entre cenas)
- Rembrandt lighting (45 graus, sombra triangular)
- Chiaroscuro (contraste extremo claro/escuro)
- Golden hour backlight (contraluz dourado)
- Rim lighting (contorno luminoso, fundo escuro)
- Volumetric fog with spotlight (raios visiveis)
- Split lighting (metade iluminada, metade escura)
- Neon accent on dark (cor neon pontual)

### Palavras de qualidade obrigatorias
Incluir ao menos 3: cinematic, 8K, photorealistic, ultra detailed, shallow depth of field, anamorphic, film grain, color grading, professional photography

## API: Gemini 2.5 Flash Image

```python
import requests, base64

def gerar_imagem_cena(prompt: str, formato: str, indice: int):
    w, h = RESOLUCOES[formato]
    proporcao = {"VERTICAL": "portrait 9:16", "HORIZONTAL": "landscape 16:9", "QUADRADO": "square 1:1"}

    prompt_final = (
        f"Generate a single cinematic photograph: {prompt}. "
        f"The image MUST be in {proporcao[formato]} orientation, resolution {w}x{h}. "
        f"No text, no words, no watermarks. Photorealistic, 8K quality."
    )

    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={API_KEY}",
        json={
            "contents": [{"parts": [{"text": prompt_final}]}],
            "generationConfig": {"responseModalities": ["IMAGE", "TEXT"]}
        },
        timeout=90
    )
    # Extrair imagem de candidates[0].content.parts[].inlineData
    # Depois: ffmpeg scale+crop para garantir proporcao exata
```

## Output por Cena

```yaml
imagens_geradas:
  - cena: 1
    prompt_usado: "extreme close-up of..."
    arquivo: "cena_01.png"
    resolucao: "1080x1920"
    proporcao_ok: true
    status: ok
```
