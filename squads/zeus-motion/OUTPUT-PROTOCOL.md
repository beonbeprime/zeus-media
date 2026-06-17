# Protocolo de Salvamento — Zeus Motion

## REGRA: Todo output de video vai para a pasta correta. Nunca para Desktop, Downloads ou raiz.

---

## Estrutura de Pastas

```
squads/zeus-motion/output/
├── kinetic-waves/          ← foto + audio + ondas sincronizadas
│   ├── kinetic-waves-v01.mp4
│   ├── kinetic-waves-v02.mp4
│   └── ...
│
├── reels-zoom/             ← gravacoes Zoom cortadas e reformatadas
│   └── ...
│
├── AgenteArquiteto/        ← videos de campanha Agente Arquiteto
├── MagnaCaptura/           ← videos de campanha Magna Captura
├── MentoriaPitch/          ← videos de pitch de mentoria
├── SquadPromo/             ← promocionais do squad
│
└── _old/                   ← arquivos antigos (nao apagar, apenas arquivar)
```

---

## Padrao de Nomenclatura

| Estilo / Efeito           | Pasta                   | Nome do arquivo              |
|---------------------------|-------------------------|------------------------------|
| Kinetic Wave (foto+audio) | `kinetic-waves/`        | `kinetic-waves-vNN.mp4`      |
| Reels Zoom (call Zoom)    | `reels-zoom/`           | `{titulo}-vNN.mp4`           |
| Video de campanha         | `{NomeCampanha}/`       | `{nome-descritivo}-vNN.mp4`  |
| Remotion (programatico)   | `{NomeCampanha}/`       | `{composicao}-vNN.mp4`       |

- `NN` = numero de versao com 2 digitos (01, 02, 03...)
- Sempre incrementar — nunca sobrescrever versao existente
- Versao 01 = primeiro entregavel. Nao e rascunho, e entregavel real.

---

## Scripts de Geracao

Cada estilo tem seu script dedicado:

| Estilo         | Script                               | Gera output em             |
|----------------|--------------------------------------|----------------------------|
| Kinetic Waves  | `scripts/kinetic-wave-gen.py`        | `kinetic-waves/`           |
| Reels Zoom     | `squads/reels-zoom/pipeline/`        | `reels-zoom/`              |
| Remotion       | `src/` + `npx remotion render`       | pasta da composicao        |

Os scripts DEVEM ter auto-incremento de versao embutido.

---

## O Que NUNCA Fazer

- Salvar .mp4 na raiz do projeto
- Salvar .mp4 no Desktop
- Salvar .mp4 em Downloads
- Salvar .mp4 em `output/` da raiz (esse output e para paginas/outros)
- Sobrescrever versao existente

---

## Output da Raiz vs Output do Squad

| Pasta                        | Para que serve                         |
|------------------------------|----------------------------------------|
| `aios/output/`               | Paginas HTML, ebooks, criativos visuais|
| `squads/zeus-motion/output/` | Videos (todos os estilos)              |
| `squads/book-forge/output/`  | Ebooks e PDFs                          |

---

## Verificacao Obrigatoria Apos Gerar

Antes de reportar o video ao usuario:

```python
import os
path = "squads/zeus-motion/output/kinetic-waves/kinetic-waves-v01.mp4"
assert os.path.exists(path), f"ERRO: video nao existe em {path}"
assert os.path.getsize(path) > 100_000, "ERRO: video muito pequeno, possivelmente corrompido"
print("OK:", os.path.getsize(path) // 1024, "KB")
```

---

Criado em: 2026-05-19
