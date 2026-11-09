"""Monta a trilha de áudio da cena de teste e os dados de sincronia labial.

Uso: python3 audio.py <pasta_trabalho>
Lê   <pasta>/vozes/*.wav  (gerados por vozes.py)
Gera <pasta>/audio.wav    (vozes + música + efeitos)
     <pasta>/dados.json   (linha do tempo + abertura de boca por quadro)
"""
import json, os, subprocess, sys
import numpy as np

SR = 48000
FPS = 24

# ---------------- linha do tempo (segundos) ----------------
FIM = 24.3
FALAS = [  # (id, personagem, início)
    ("n1", "narradora", 2.8),
    ("d1", "davi", 9.3),
    ("v1", "vovo", 15.0),
]
EVENTOS = {
    "titulo_fim": 2.6,
    "davi_chega": 6.4,      # Davi termina de andar até o centro
    "abre_caixa": 8.3,      # tampa voa, brilhos, controle sobe
    "balido": 13.8,         # Algodão bale e pula
    "fim": FIM,
}


def ler_wav(caminho):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", caminho, "-f", "f32le",
                          "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def env(n, a=0.005, r=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / r)


# ---------------- instrumentos sintetizados ----------------
def corda(freq, dur, brilho=0.996):
    """Corda dedilhada (Karplus-Strong) - som de ukulele."""
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    rng = np.random.default_rng(int(freq * 10))
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = brilho * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out * env(n, 0.002, 0.6)


def sino(freq, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * freq * m * t) * np.exp(-t * d)
            for m, a, d in [(1, 1, 3), (2.76, .4, 6), (5.4, .2, 9)])
    return s * env(n, 0.002, 10)


def balido(dur=0.75):
    """'Béééé' sintetizado: dente-de-serra com tremolo e filtros de vogal."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = 520 + 60 * np.sin(2 * np.pi * 1.2 * t) - 120 * t
    fase = 2 * np.pi * np.cumsum(f0) / SR
    s = sum(np.sin(k * fase) / k for k in range(1, 18))
    s *= 0.55 + 0.45 * np.sin(2 * np.pi * 26 * t)          # o "tremido" do bé
    # formantes de "é" (~550 Hz e ~1900 Hz) via ressonadores simples
    from_f = []
    for fc, bw, g in [(560, 90, 1.0), (1900, 160, 0.6), (2600, 200, 0.3)]:
        r = np.exp(-np.pi * bw / SR); th = 2 * np.pi * fc / SR
        a1, a2 = -2 * r * np.cos(th), r * r
        y = np.zeros(n)
        for i in range(2, n):
            y[i] = s[i] - a1 * y[i - 1] - a2 * y[i - 2]
        from_f.append(g * y / np.max(np.abs(y)))
    out = sum(from_f)
    e = np.minimum(1, t / 0.04) * np.minimum(1, (dur - t) / 0.15)
    return out * e


def whoosh(dur=0.5):
    n = int(dur * SR)
    rng = np.random.default_rng(3)
    x = rng.normal(0, 1, n)
    y = np.zeros(n); c = 0.0
    for i in range(n):                      # passa-baixa com corte subindo
        k = 0.02 + 0.25 * (i / n)
        c += k * (x[i] - c); y[i] = c
    t = np.arange(n) / SR
    return y * np.sin(np.pi * t / dur) ** 2


def nota(nome):
    idx = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}[nome[0]]
    return 440 * 2 ** ((idx + 12 * (int(nome[1:]) - 4) - 9) / 12)


def musica(dur):
    out = np.zeros(int(dur * SR) + SR * 2)
    bpm = 96; colcheia = 60 / bpm / 2
    acordes = [("C3", ["C4", "E4", "G4", "C5"]), ("G2", ["B3", "D4", "G4", "D5"]),
               ("A2", ["A3", "C4", "E4", "A4"]), ("F2", ["A3", "C4", "F4", "C5"])]
    padrao = [0, 1, 2, 3, 2, 1, 2, 3]
    melodia = ["E5", "G5", "C6", "B5", "G5", "D5", "C5", "E5", "A5", "G5", "F5", "A5", "C6", "A5", "G5", "E5"]
    t = 0.0; i = 0
    while t < dur:
        baixo, notas = acordes[(i // 8) % 4]
        if i % 8 == 0:
            b = corda(nota(baixo), 2.0, 0.998); k = int(t * SR)
            out[k:k + len(b)] += 0.55 * b
        c = corda(nota(notas[padrao[i % 8]]), 1.2); k = int(t * SR)
        out[k:k + len(c)] += 0.32 * c
        if i % 4 == 0:  # sininho de melodia
            s = sino(nota(melodia[(i // 4) % len(melodia)]), 1.2); k = int(t * SR)
            out[k:k + len(s)] += 0.07 * s
        t += colcheia; i += 1
    return out[:int(dur * SR)]


def colocar(trilha, som, inicio, ganho=1.0):
    k = int(inicio * SR)
    if k < 0:
        som, k = som[-k:], 0
    m = min(len(som), len(trilha) - k)
    if m > 0:
        trilha[k:k + m] += ganho * som[:m]


def main(pasta):
    n = int(FIM * SR)
    vozes = np.zeros(n)
    boca = {}
    info_falas = []
    nq = int(FIM * FPS)
    for fid, quem, ini in FALAS:
        v = ler_wav(os.path.join(pasta, "vozes", f"{fid}.wav"))
        v = v / (np.max(np.abs(v)) + 1e-9) * 0.9
        colocar(vozes, v, ini)
        info_falas.append(dict(id=fid, quem=quem, ini=ini, fim=ini + len(v) / SR))
        # boca: volume (RMS) por quadro, normalizado
        arr = boca.setdefault(quem, np.zeros(nq))
        jan = SR // FPS
        for q in range(nq):
            a = int((q / FPS - ini) * SR)
            if 0 <= a < len(v):
                arr[q] = np.sqrt(np.mean(v[a:a + jan] ** 2))
    for quem, arr in boca.items():
        ref = np.percentile(arr[arr > 0], 90) if np.any(arr > 0) else 1
        arr = np.clip(arr / ref, 0, 1)
        arr[arr < 0.12] = 0
        boca[quem] = [round(float(x), 3) for x in arr]

    # balido do Algodão também mexe a boca dele
    b = balido()
    colocar(vozes, b, EVENTOS["balido"], 0.45)
    al = np.zeros(nq)
    q0 = int(EVENTOS["balido"] * FPS)
    al[q0:q0 + int(0.75 * FPS)] = 1
    boca["algodao"] = [float(x) for x in al]

    # efeitos
    sfx = np.zeros(n)
    colocar(sfx, whoosh(0.5), EVENTOS["abre_caixa"] - 0.1, 0.5)
    for j, nm in enumerate(["C6", "E6", "G6", "C7", "E7"]):
        colocar(sfx, sino(nota(nm)), EVENTOS["abre_caixa"] + 0.05 + j * 0.07, 0.22)

    # música com "ducking" (abaixa quando alguém fala)
    mus = musica(FIM)
    duck = np.ones(n) * 0.55
    for f in info_falas:
        a, z = int((f["ini"] - 0.25) * SR), int((f["fim"] + 0.25) * SR)
        duck[max(0, a):z] = 0.22
    k = int(0.03 * SR)                                   # suaviza as transições
    duck = np.convolve(duck, np.ones(k) / k, mode="same")
    t = np.arange(n) / SR
    fade = np.minimum(1, t / 1.0) * np.clip((FIM - t) / 1.5, 0, 1)
    mix = vozes + sfx + mus * duck * 0.6
    mix = mix * np.where(t > FIM - 1.5, fade, 1)
    mix = mix / max(1.0, np.max(np.abs(mix)) / 0.95)

    raw = (np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1",
                    "-i", "-", os.path.join(pasta, "audio.wav")], input=raw, check=True)
    json.dump(dict(fps=FPS, fim=FIM, eventos=EVENTOS, falas=info_falas, boca=boca),
              open(os.path.join(pasta, "dados.json"), "w"))
    print("falas:", info_falas)


if __name__ == "__main__":
    main(sys.argv[1])
