"""Gera as falas da cena de teste com vozes neurais gratuitas (edge-tts).

Uso:  python3 vozes.py <pasta_saida>
Cada fala vira um WAV mono 24 kHz em <pasta_saida>/<id>.wav.
"""
import asyncio, os, subprocess, sys, tempfile
import edge_tts

PROXY = os.environ.get("HTTPS_PROXY") or None

# Elenco de vozes (ver README para o porquê de cada uma)
VOZES = {
    # narradora: calma, acolhedora
    "narradora": dict(voice="pt-BR-ThalitaMultilingualNeural", rate="-5%", pitch="+0Hz", speed=1.0),
    # Davi (7 anos): Francisca com tom mais agudo, SEM acelerar o áudio
    # (acelerar deixava a fala com "sotaque japonês")
    "davi": dict(voice="pt-BR-FranciscaNeural", rate="+5%", pitch="+30Hz", speed=1.0),
    # Vovô Elias: Antonio mais grave e pausado
    "vovo": dict(voice="pt-BR-AntonioNeural", rate="-12%", pitch="-12Hz", speed=1.0),
}

FALAS = [
    ("n1", "narradora", "Era uma manhã ensolarada, e o Davi tinha acabado de ganhar um presente muito especial."),
    ("d1", "davi", "Uau! Um videogame novinho! Eu vou jogar o dia inteiro!"),
    ("v1", "vovo", "Que presente bonito, Davi! Só não vá se esquecer de quem a gente ama acima de todas as coisas, hein?"),
]


async def gerar(fid, quem, texto, pasta):
    cfg = VOZES[quem]
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        mp3 = tmp.name
    com = edge_tts.Communicate(texto, cfg["voice"], rate=cfg["rate"], pitch=cfg["pitch"], proxy=PROXY)
    await com.save(mp3)
    filtro = f"asetrate=24000*{cfg['speed']},aresample=24000" if cfg["speed"] != 1.0 else "anull"
    # remove silêncio do início/fim para encaixar certinho na linha do tempo
    filtro += ",silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", mp3, "-af", filtro,
                    "-ac", "1", "-ar", "24000", os.path.join(pasta, f"{fid}.wav")], check=True)
    os.remove(mp3)


async def main(pasta):
    os.makedirs(pasta, exist_ok=True)
    for fid, quem, texto in FALAS:
        await gerar(fid, quem, texto, pasta)
        print("ok", fid)


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1]))
