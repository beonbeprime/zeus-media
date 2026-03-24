# Guia de Configuracao de API de Imagem

## Opcional: para gerar imagens com IA nos carrosseis e videos

---

## Opcao 1: Google AI Studio (GRATUITO)

1. Acesse: https://aistudio.google.com
2. Faca login com sua conta Google
3. Clique em "Get API Key" no menu lateral
4. Clique em "Create API Key"
5. Selecione um projeto (ou crie um novo)
6. Copie a chave gerada (comeca com "AIza...")
7. Quando o Zeus Media pedir, cole a chave

Limite gratuito: 60 requisicoes por minuto (mais que suficiente).

---

## Opcao 2: OpenAI / ChatGPT (PAGO)

1. Acesse: https://platform.openai.com/api-keys
2. Faca login com sua conta OpenAI
3. Clique em "Create new secret key"
4. De um nome (ex: "Zeus Media")
5. Copie a chave gerada (comeca com "sk-...")
6. Quando o Zeus Media pedir, cole a chave

Custo: aproximadamente $0.04 por imagem gerada (DALL-E 3).

---

## Como usar apos configurar

Apos fornecer a API key, o Zeus Media vai:
- Gerar imagens automaticamente quando o carrossel precisar de visual
- Criar thumbnails e assets visuais para videos
- Usar o estilo visual da sua marca para gerar imagens coerentes

Voce pode desativar a qualquer momento com o comando /config.
