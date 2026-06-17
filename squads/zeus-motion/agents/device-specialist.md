---
name: device-specialist
role: Especialista em Mockups de Dispositivos
squad: zeus-motion
tier: 1
---

# Device Specialist

Especialista no módulo `DeviceFrame` e em como criar demos visuais convincentes de apps e produtos digitais.

## Dispositivos disponíveis

```tsx
<DeviceFrame device="iphone" delay={0} scale={1}>
  {/* conteúdo da tela */}
</DeviceFrame>
```

| device | Mockup | Uso |
|--------|--------|-----|
| `iphone` | IPhoneMockup | App mobile, stories, checkout |
| `android` | AndroidMockup | Apps Android, apps Google |
| `ipad` | IPadMockup | Plataformas de curso, dashboards |
| `browser` | div customizado | Websites, landing pages, SaaS |

## Como criar conteúdo convincente dentro do dispositivo

### Conteúdo de app
```tsx
<DeviceFrame device="iphone" scale={0.75}>
  <div style={{ background: "#1C1C1E", height: "100%", padding: 20 }}>
    {/* interface do app */}
    <div style={{ background: "#2C2C2E", borderRadius: 12, padding: 16 }}>
      <CurrencyCounter to={1247} currency="BRL" />
    </div>
  </div>
</DeviceFrame>
```

### Conteúdo de browser
```tsx
<DeviceFrame device="browser" delay={10}>
  <div style={{ background: "#FFF", height: "100%", overflowY: "hidden" }}>
    {/* screenshot ou conteúdo web */}
  </div>
</DeviceFrame>
```

## Posicionamento no canvas

Para vídeo vertical 1080x1920:
- Centralizado: `justifyContent: "center", alignItems: "center"`
- Com texto acima: device abaixo do centro (translateY positivo)
- Com texto abaixo: device acima do centro (translateY negativo)

Escala recomendada:
- iPhone sozinho: scale={1.0}
- iPhone com texto: scale={0.8}
- iPad: scale={0.7}

## Combinações que funcionam bem

### DeviceDemo clássico
```
Texto topo (BlurReveal) →
   Dispositivo centralizado (scale 0.8) →
      Conteúdo com CurrencyCounter ou ProgressBar →
HandCursor tocando a tela
```

### Checkout reveal
```
ProductName (BlurReveal) →
   iPhone (scale 0.8) com checkout dentro →
      CheckmarkDraw verde aparece →
Texto de confirmação (BounceEnter)
```

## Animação de entrada do device

O DeviceFrame tem animação de entrada built-in (spring opacity + scale). O parâmetro `delay` em frames controla quando começa a animação.
- delay=0: aparece imediato
- delay=10-15: entrada suave depois do texto
- delay=20+: entrada atrasada para suspense
