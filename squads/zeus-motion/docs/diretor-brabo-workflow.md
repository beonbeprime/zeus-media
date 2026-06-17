# Diretor Brabo — Workflow de Especificação Visual

> Metodologia de direção de comerciais premium para Remotion
> Adaptado da Gem "Diretor Brabo" — caso real: Agente Arquiteto de Mentoria

---

## O QUE É O DIRETOR BRABO

O Diretor Brabo é o **pensamento visual completo** de um comercial antes do código.
Ele descreve cada cena com precisão de engenharia: câmera, animação, transição,
movimento, hierarquia tipográfica e conexão entre cenas.

Não é um roteiro de texto. É um **mapa de execução** que os agentes de código seguem.

### Output do Diretor Brabo

1. Tabela de cenas (visão geral)
2. Especificação completa por cena:
   - Posição/movimento de câmera (eixos x,y,z)
   - Design de background e elementos
   - Hierarquia tipográfica por palavra
   - Animações de entrada com spring configs
   - Micro-animações na fase estável
   - Saída Quadrupla com specs exatas
3. Tabela de transições consolidada
4. Checklist BRABO validado

---

## QUANDO USAR

- Briefing novo de comercial (produto, serviço, lançamento)
- Vídeo com 5+ cenas que precisam de continuidade cinematográfica
- Cliente que precisa de direção visual antes da execução
- Projetos premium onde o visual precisa de justificativa técnica

---

## PROTOCOLO DE BRIEFING (3 perguntas antes de especificar)

1. **Paleta de Cores:** marca tem identidade? ou vai de Tech Premium Dark / Apple Minimalista?
2. **Formato Principal:** Vertical 1080×1920 (Reels/Stories/Ads) ou Horizontal 1920×1080 (YouTube/VSL)?
3. **Estilo de Câmera:** orgânica+fluida (cinematográfica) ou rápida+geométrica (snappy tech)?

---

## FILOSOFIAS VISUAIS DISPONÍVEIS

### 1. Apple Minimalista (Tech Premium)

Paleta: `#000000` (bg), `#0A0A0C` (surface), `#FFFFFF` (accent), `#8E8E93` (secundário)
Tom: Contraste absoluto preto/branco. Tipografia cirúrgica. Sem ornamentos.
Câmera: Movimentos lineares puros em eixos tridimensionais. Scanner óptico.
Movimento: Snappy premium. Molas de alta tensão. Montagem mecânica e imponente.
Safe Zone: Todos os elementos dentro de 900×900px centralizado.

### 2. Zeus Dark (Marca Magna)

Paleta: `#050505` (bg), `#F5F5F7` (primary), `#0071E3` (blue accent), `#30D158` (green)
Tom: Premium tech com personalidade. Elementos com profundidade e glow.
Câmera: Sem câmera virtual. Composição flat com parallax de profundidade Z.
Movimento: Físico e orgânico via springs validados.

### 3. Personalizada (marca do cliente)

Usar `brand-configurator.md` para onboarding das cores, fonte e estilo.

---

## ESTRUTURA PADRÃO DE ESPECIFICAÇÃO POR CENA

```markdown
### CENA N — [Nome/Conceito]
Frames: [inicio-fim] (duração em segundos) | Complexidade: ALTA/MÉDIA/BAIXA

**Narrativa:** O que esta cena precisa comunicar emocionalmente.

**MOVIMENTO DE CÂMERA**
| Frame | Posição (x,y,z) | Rotação | Easing | Propósito |
|-------|----------------|---------|--------|-----------|

**DESIGN — Background**
- Base, gradiente, noise

**DESIGN — Elemento Principal**
- Tipo, dimensões, anatomia por camadas Z

**TIPOGRAFIA**
| Palavra | Tamanho | Peso | Cor | Tracking | Z-Position |

**ANIMAÇÕES — Entrada (frames N-N)**
| Elemento | Frame Início | Propriedades | Spring Config | Z-Interaction |

**ANIMAÇÕES — Micro (fase estável)**
- Float, glow, scanner, breathing

**ANIMAÇÕES — Saída (frames N-N)**
- Direção, blur, opacity, scale, easing

**CONEXÃO COM PRÓXIMA CENA**
- Modo: Direcional / Morph / Criativa
- Overlap, interpolação de câmera
```

---

## TABELA DE TRANSIÇÕES CONSOLIDADA

| De → Para | Modo | Direção Saída | Direção Entrada | Câmera | Overlap |
|-----------|------|---------------|-----------------|--------|---------|
| C1 → C2 | Direcional | esquerda | direita | Orbit → Dolly In | 7f |
| C2 → C3 | Direcional | baixo (tilt) | cima | Dolly In → Tilt Down | 7f |
| C3 → C4 | Morph | geometria contínua | expansão interna | Pan Horiz. → Crane Up | 10f |
| C4 → C5 | Direcional | direita | esquerda | Crane Up → Dolly Out | 7f |
| C5 → C6 | Criativa | blur central | expansão radial | Zoom Ótico | 7f |
| C6 → C7 | Direcional | cima | baixo | Pan Horiz. → Crane Down | 7f |
| C7 → C8 | Alpha | crossfade | fade in | Dolly In → Handheld | 7f |

---

## CASO REAL — AGENTE ARQUITETO DE MENTORIA

**Cliente:** Agente Arquiteto (produto LT R$67)
**Briefing:** Comercial mostrando que mentor caótico + Agente = estrutura em 8 minutos
**Paleta:** Apple Minimalista (preto/branco)
**Formato:** Vertical 1080×1920 Stories
**Estilo câmera:** Snappy tech (eleito pelo diretor)
**Duração:** 20s (600 frames @ 30fps)

### Tabela de Cenas

| # | Copy | Visual | Câmera | Complexidade |
|---|------|--------|--------|-------------|
| 1 | "Quando você pensa em vender mentoria..." | Caos de áudio 3D | Orbit 360° | ALTA |
| 2 | "Qual é a primeira coisa que tem que fazer?" | Grid de dados fragmentado | Dolly In | ALTA |
| 3 | "Organizar e estruturar seu conhecimento." | Fusão mecânica de blocos | Pan Horiz. | MÉDIA |
| 4 | "...criamos o Agente Arquiteto..." | Mockup do app 3D | Crane Up + Orbit | ALTA |
| 5 | "...ouve áudio e organiza em 8 minutos." | Timer HUD holográfico | Dolly Out + Zoom ótico | ALTA |
| 6 | "Estrutura de vendas pronta." | Dashboard de vendas | Pan Horizontal | MÉDIA |
| 7 | "Comprar por 67 reais..." | Card Hero / Preço | Dolly In + Shake | ALTA |
| 8 | "...e ganhar consultoria individual." | Lockup final + CTA | Handheld micro | BAIXA |

### Filosofia Visual do Projeto

Minimalismo radical estilo Apple. Contraste absoluto preto/branco elimina distração,
forçando foco em tipografia cirúrgica e geometria 3D. "Luxo utilitário."

Tom do movimento: controlado, mecânico e imponente (snappy premium).
A câmera age como scanner óptico: orbita estruturas de dados, mergulha
(dolly in) em detalhes milimétricos transmitindo precisão matemática.

**Safe Zone Central:** 900×900px centralizado no frame 1080×1920.

### Paleta Técnica

| Função | Cor | Uso |
|--------|-----|-----|
| Background | `#000000` | Base absoluta |
| Surface 1 | `#0A0A0C` | Cards principais |
| Surface 2 | `#121214` | Elementos flutuantes |
| Accent | `#FFFFFF` | Linhas ativas, realces |
| Text Primary | `#FFFFFF` | Títulos, impacto máximo |
| Text Secondary | `#8E8E93` | Labels, dados secundários |
| Glow | `rgba(255,255,255,0.08)` | Iluminação volumétrica |

---

## REGRAS DO DIRETOR BRABO NO CÓDIGO

Ao implementar uma spec do Diretor Brabo em código Remotion:

1. Câmera 3D = CSS `perspective(1400px)` + `rotateY/X` + `translateX/Y/Z`
2. Orbit = `Math.sin/cos(angle) * radius` no transform
3. Dolly In = z aproximando (não tem z real no CSS — simular com scale crescente)
4. Pan Horizontal = translateX suave no container
5. Micro-shake = `Math.sin(frame * 0.4) * 1.5` no x/y
6. Scanner line = `top: animado` numa div `height: 1px` dentro do container
7. Blur expand = FOV invertido com blur em `Easing.in(Easing.exp)`

---

## COMO ACIONAR

O agente `diretor-brabo` é acionado quando:
- O usuário pede especificação visual completa antes da implementação
- O briefing é complexo (5+ cenas, produto premium, cliente pagante)
- O usuário quer aprovar o conceito antes de renderizar

O agente `composition-builder` consome a spec do diretor e gera o código.
