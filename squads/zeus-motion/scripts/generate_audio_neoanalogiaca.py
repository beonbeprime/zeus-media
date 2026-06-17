import asyncio
import edge_tts
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "neoanalogiaca")

SCENES = [
    ("scene-1", "Você acha que sua mentoria não saiu do papel porque você não grava conteúdo."),
    ("scene-2", "Mentira."),
    ("scene-3", "Você não precisa gravar conteúdo todo dia. Não precisa ter muitos seguidores. Não precisa ser famoso nas redes sociais."),
    ("scene-4", "O que você precisa é: um funil de vendas, uma página que atrai as pessoas certas, e uma oferta irresistível."),
    ("scene-5", "Com low ticket, você tem leads por um real. Por lead. Sem postar todo dia. Sem audiência."),
    ("scene-6", "A gente monta sua máquina em vinte e um dias. Pronta a operar. Briefing, funil, página, oferta, ativo."),
    ("scene-7", "Garantia total. Cem mil por mês. Te acompanho até você bater. Sem desculpa. Sem prazo aberto."),
    ("scene-8", "Quer faturar cinquenta mil por mês com mentoria? Toque no botão abaixo agora. Quero minha máquina."),
]

VOICE = "pt-BR-AntonioNeural"

async def generate():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for name, text in SCENES:
        out_path = os.path.join(OUTPUT_DIR, f"{name}.mp3")
        if os.path.exists(out_path):
            print(f"[SKIP] {name}.mp3 já existe")
            continue
        print(f"[GEN]  {name}.mp3 ...")
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(out_path)
        print(f"[OK]   {name}.mp3")

asyncio.run(generate())
print("Todos os áudios gerados.")
