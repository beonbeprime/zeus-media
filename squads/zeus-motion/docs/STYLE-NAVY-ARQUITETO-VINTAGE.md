# Estilo: Navy Arquiteto Vintage

ON-DEMAND. Ler apenas quando usuário mencionar: navy, arquiteto, vintage editorial, conhecimento brian, autoridade adulta.

Base: `ConhecimentoBrian` v07-APROVADO-1080x1920.
Perfil: editorial adulto, navy + terracota, motion AE pesado em blur. Para autoridade séria.

---

## DNA

Paleta:
```ts
paper "#F2E8DC"  // claro
plum "#101F22"   // escuro 1
purple "#193940" // escuro 2
magenta "#D97B59" // acento quente
orange "#733C1D"  // sombra DISPLAY
```

Fontes (Google Fonts):
- DISPLAY Ultra → palavras gigantes (106-210px) com stroke 4-5px + textShadow orange
- GROOVY Bagel Fat One → médio (52-86px)
- BODY DM Sans → contexto (28-38px, weight 300, opacity 0.45-0.65)
- MONO JetBrains Mono → tags (18-20px, letterSpacing 0.36em)

Áudio: 2 camadas. Trilha `trilha-vintage.mp3` volume 0.18 ANTES da narração.

---

## Motion (4 primitives)

| Componente | Uso | back/scale | stagger |
|-----------|-----|-----------|---------|
| LetraALetra | letra por letra impacto | back(2.2) | 0.9-2.5 |
| PalavraBlur | palavra por palavra contexto | back(1.8) | 4-7 |
| Cinematic Desblur | clímax sincronizado (palavra inteira) | back(2.0-2.4) | 0 |
| fadeBlur | ícones/headers | back(1.6) | 0 |

PROIBIDO:
- `back()` em itens de lista → tremor → usar `Easing.out(Easing.exp)`
- `frame % N` em pulse contínuo → soluço → usar `Math.sin(frame * 0.22) * 0.025`
- X translate + back simultâneo → diagonal jiggle

---

## Regra suprema: alternância de fundos

NUNCA dois fundos iguais adjacentes. NUNCA dois navy escuros (plum/purple) colados.

Esquema 9 cenas:
```
plum → paper → purple → paper → plum → paper → purple → magenta → plum
```

Esquema 6 cenas: `plum → paper → purple → paper → plum → magenta`
Esquema 4 cenas: `plum → paper → purple → magenta`

Mínimo: 8+ cenas precisam 1 magenta + 2 paper. 4+ cenas precisam 1 paper.

---

## Overlays obrigatórios

Em toda cena, dentro de `SceneWrap`: Ken Burns + Grain + Vignette (0.18 claro / 0.42-0.52 escuro) + Border + Aura. Entry/exit alternados (bottom/top/left/right).

---

## Pipeline (replicar)

1. Áudio (ElevenLabs voz Brian, salvar em `public/audio/`)
2. Whisper word-timestamps: `python -c "import whisper; m=whisper.load_model('base'); r=m.transcribe('PATH', word_timestamps=True, language='pt'); [print(f'{round(w[\"start\"]*30):4d}f {w[\"word\"]}') for s in r['segments'] for w in s.get('words',[])]"`
3. Mapear S array: cada palavra-âncora = `S[i].s`, soma `d` = TOTAL_FRAMES, buffer trailing 50f
4. Fundos alternados (regra suprema)
5. Direções alternadas (bottom→right→top→left ciclo)
6. `cp -r ConhecimentoBrian/ NovaComp/` e editar
7. Registrar em `Root.tsx` (1080×1920, 30fps)
8. `npx tsc --noEmit --skipLibCheck` zero erros
9. `npx remotion render NovaComp "PATH/nome-v01.mp4" --codec=h264`
10. Após aprovação verbal: copiar para `nome-v01-APROVADO-1080x1920.mp4`

---

## Checklist final

- [ ] Fundos alternados, sem repetição adjacente
- [ ] Pelo menos 1 paper, 1 magenta se 8+ cenas
- [ ] Palavras-âncora no frame exato do whisper
- [ ] Lista usa expo (não back)
- [ ] Pulse senoidal (não modulo)
- [ ] Trilha vintage volume 0.18 antes da narração
- [ ] Type-check zero erros
- [ ] Tag `-APROVADO-1080x1920` após aprovação

---

## Instâncias

| Composition | Versão | Status |
|-------------|--------|--------|
| `ConhecimentoBrian` | v07-APROVADO-1080x1920 | OK |
