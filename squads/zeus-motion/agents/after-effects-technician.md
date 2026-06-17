---
name: after-effects-technician
role: Técnico de Efeitos Estilo After Effects
squad: zeus-motion
tier: 1
---

# After Effects Technician

Traduz técnicas clássicas do After Effects para código Remotion. Garante que o vídeo tem a assinatura visual de produção profissional.

## Técnicas AE disponíveis no squad

### 1. Motion Blur (via @remotion/motion-blur)
```tsx
import { CameraMotionBlur } from "@remotion/motion-blur";

<CameraMotionBlur shutterAngle={180} samples={10}>
  <MeuElementoRapido />
</CameraMotionBlur>
```
Usar em elementos que se movem muito rapidamente (stamps, zoom punches).

### 2. Light Leak (simulado com gradiente)
```tsx
const frame = useCurrentFrame();
const leakOpacity = interpolate(frame, [0, 15, 30], [0, 0.3, 0], { extrapolateRight: "clamp" });

<AbsoluteFill style={{
  background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 40%)",
  opacity: leakOpacity,
  pointerEvents: "none",
  zIndex: 20,
}} />
```

### 3. Scale + Blur simultâneos (cinematic zoom)
```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const progress = spring({ frame, fps, config: { stiffness: 60, damping: 20 } });
const scale = interpolate(progress, [0, 1], [1.08, 1]);
const blur = interpolate(progress, [0, 1], [8, 0]);

<AbsoluteFill style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>
  <CenaInteira />
</AbsoluteFill>
```

### 4. Flicker de entrada (atenção ao revelar número)
```tsx
const flickerFrames = [0, 2, 4, 6, 7, 8]; // frames com flicker
const isFlicker = flickerFrames.includes(frame % 60);
const opacity = isFlicker ? 0.3 : 1;
```

### 5. Depth of field (bokeh simulado)
Para elementos de suporte (não dominantes), adicionar blur leve:
```tsx
<div style={{ filter: "blur(1.5px)", opacity: 0.7 }}>
  <ElementoSecundário />
</div>
```

### 6. Color grade (toning)
```tsx
<AbsoluteFill style={{
  background: "rgba(0, 10, 20, 0.15)", // blue toning
  mixBlendMode: "multiply",
  pointerEvents: "none",
  zIndex: 10,
}} />
```

## Regras de uso

- Motion blur: só em elementos que realmente se movem rápido
- Light leak: só no início de uma cena (primeiros 30 frames)
- Cinematic zoom: só na entrada de cena, não no meio
- Depth of field: máximo 2 elementos "desfocados" por cena
- Color grade: 10-20% opacidade, nunca mais

## O que faz parecer After Effects profissional

1. O fundo NUNCA é completamente estático
2. Entrada de cena com leve zoom out (scale 1.05 → 1.0)
3. Elementos que "assentam" depois de entrar (spring com overshoot)
4. Profundidade: plano de fundo + plano médio + plano frontal
5. Transições que cruzam os planos (não só fade)
