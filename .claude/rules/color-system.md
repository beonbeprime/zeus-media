# Sistema de Cores - Zeus Media

## STATUS: SEMPRE ATIVO

## Regra Fundamental

Os 3 tokens de cor (--g1, --g2, --g-accent) SEMPRE formam escala monocromatica.
Mesma matiz (hue), variando apenas brilho e saturacao.
NUNCA misturar familias (ex: g1 roxo + g2 laranja = ERRADO).

## Algoritmo de Geracao

Entrada: 2-3 cores que o usuario gosta.

Processo:
1. Identificar a matiz dominante (hue) entre as cores
2. Se 2+ matizes diferentes: escolher a mais saturada como base, usar a segunda como accent
3. Gerar escala monocromatica:

```
--g1:       HSL(hue, 60-80%, 25-35%)   // tom escuro, profundo
--g2:       HSL(hue, 55-75%, 50-60%)   // tom vibrante, destaque
--g-accent: HSL(hue, 30-50%, 75-85%)   // tom claro, sutil

--shadow-g: rgba(g2, 0.22-0.35)
--border:   rgba(g2, 0.14)

--bg:       HSL(hue, 10-15%, 3-6%)     // quase preto tintado
--bg-alt:   HSL(hue, 10-15%, 5-8%)
--bg-card:  HSL(hue, 10-15%, 6-9%)
--bg-light: HSL(hue-accent, 30-50%, 94-97%)  // secao clara

--txt-light: proximo ao g-accent
--txt-dark:  derivado escuro do g1 para areas claras
--txt-muted: meio caminho entre g1 e g-accent
```

## Validacao de Contraste

Antes de aprovar a paleta, verificar:
- Texto claro sobre fundo escuro: ratio >= 4.5:1 (WCAG AA)
- Texto escuro sobre fundo claro: ratio >= 4.5:1
- Botao CTA: gradiente legivel com texto branco

## Template de Tokens CSS

```css
:root {
  --g1:         #VALOR;
  --g2:         #VALOR;
  --g-accent:   #VALOR;
  --shadow-g:   rgba(R,G,B, 0.25);
  --bg:         #VALOR;
  --bg-alt:     #VALOR;
  --bg-card:    #VALOR;
  --bg-light:   #VALOR;
  --border:     rgba(R,G,B, 0.14);
  --txt-light:  #VALOR;
  --txt-dark:   #VALOR;
  --txt-muted:  #VALOR;
  --red:        #E05252;
  --green-ok:   #4ade80;
  --radius:     14px;
  --radius-sm:  8px;
  --transition: 0.3s ease;
  --ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
  --font-main:  'VALOR';
  --font-body:  'VALOR';
}
```
