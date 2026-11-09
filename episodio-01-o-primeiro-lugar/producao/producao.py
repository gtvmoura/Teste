"""Gera vozes, trilha, efeitos e dados de animação de cada cena do episódio.

Uso: python3 producao.py <pasta_trabalho> [c1 c2 ...]   (sem ids: todas as cenas)
Saída por cena: <pasta>/<id>/audio.wav e <pasta>/<id>/dados.json
"""
import asyncio, hashlib, json, os, subprocess, sys, tempfile
import numpy as np
import edge_tts
from audio import SR, ler_wav, corda, sino, balido, whoosh, nota, colocar, env
from episodio import CENAS, VOZES

FPS = 24
PROXY = os.environ.get("HTTPS_PROXY") or None
RNG = np.random.default_rng(7)


# ------------------------------------------------------------------ vozes
async def gerar_voz(quem, texto, rate, cache):
    cfg = dict(VOZES[quem])
    if rate:
        cfg["rate"] = rate
    chave = hashlib.sha1(json.dumps([cfg, texto], sort_keys=True).encode()).hexdigest()[:16]
    wav = os.path.join(cache, chave + ".wav")
    if os.path.exists(wav):
        return wav
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        mp3 = tmp.name
    for tentativa in range(4):
        try:
            await edge_tts.Communicate(texto, cfg["voice"], rate=cfg["rate"], pitch=cfg["pitch"], proxy=PROXY).save(mp3)
            break
        except Exception:
            if tentativa == 3:
                raise
            await asyncio.sleep(2 ** tentativa)
    filtro = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    if cfg.get("eco"):  # leve eco: soa como "história contada"
        filtro += ",aecho=0.8:0.5:60|120:0.22|0.12"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", mp3, "-af", filtro, "-ac", "1", "-ar", "24000", wav], check=True)
    os.remove(mp3)
    return wav


# ------------------------------------------------------------------ efeitos sintetizados
def ruido(n, seed=0):
    return np.random.default_rng(seed).normal(0, 1, n)

def passa_baixa(x, k):
    y = np.zeros_like(x); c = 0.0
    for i in range(len(x)):
        c += k * (x[i] - c); y[i] = c
    return y

def sfx(tipo):
    t = lambda d: np.arange(int(d * SR)) / SR
    if tipo == "balido":
        return balido()
    if tipo == "whoosh":
        return whoosh(0.5)
    if tipo == "brilho":
        out = np.zeros(int(1.8 * SR))
        for j, nm in enumerate(["C6", "E6", "G6", "C7", "E7"]):
            colocar(out, sino(nota(nm)) * .22, 0.05 + j * 0.07)
        return out
    if tipo == "plim":
        out = np.zeros(int(1.4 * SR))
        colocar(out, sino(nota("G6")) * .3, 0); colocar(out, sino(nota("C7")) * .3, .09)
        return out
    if tipo == "toc":  # duas batidas na porta de madeira
        out = np.zeros(int(1.2 * SR))
        for k in (0, .22, .5):
            x = t(.12); b = (np.sin(2 * np.pi * 180 * x) + .5 * np.sin(2 * np.pi * 410 * x)) * np.exp(-x * 45)
            b += passa_baixa(ruido(len(x), int(k * 10)), .3) * np.exp(-x * 80) * .6
            colocar(out, b * .9, k)
        return out
    if tipo == "porta":
        x = t(.5); b = np.sin(2 * np.pi * 70 * x) * np.exp(-x * 14) + passa_baixa(ruido(len(x), 4), .08) * np.exp(-x * 20) * 2
        return b * .8
    if tipo == "bip":
        x = t(.09); return np.sign(np.sin(2 * np.pi * 880 * x)) * .12 * np.exp(-x * 10)
    if tipo == "gameover":
        out = np.zeros(int(1.4 * SR))
        for j, f in enumerate([523, 392, 330, 262]):
            x = t(.3); colocar(out, np.sign(np.sin(2 * np.pi * f * x)) * .1 * np.exp(-x * 4), j * .26)
        return out
    if tipo == "harpa":  # glissando mágico para entrar/sair da história
        out = np.zeros(int(2.6 * SR))
        escala = ["C5", "D5", "E5", "G5", "A5", "C6", "D6", "E6", "G6", "A6", "C7"]
        for j, nm in enumerate(escala):
            colocar(out, corda(nota(nm), 1.4, .997) * .25, j * .07)
        return out
    if tipo == "panela":
        x = t(.6); return (np.sin(2 * np.pi * 620 * x) + .6 * np.sin(2 * np.pi * 1530 * x) + .3 * np.sin(2 * np.pi * 2710 * x)) * np.exp(-x * 7) * .18
    if tipo == "areia":
        x = t(2.0); return passa_baixa(ruido(len(x), 9), .5) * np.sin(np.pi * x / 2.0) ** 2 * .12
    if tipo == "pedrinhas":
        out = np.zeros(int(1.6 * SR))
        for j in range(6):
            x = t(.08); colocar(out, np.sin(2 * np.pi * (1800 + 300 * j) * x) * np.exp(-x * 60) * .25, j * .17 + .05)
        return out
    if tipo == "pedra":
        x = t(.3); return (np.sin(2 * np.pi * 240 * x) * np.exp(-x * 30) + passa_baixa(ruido(len(x), 5), .2) * np.exp(-x * 40)) * .5
    return np.zeros(1)


def ambiente(tipo, dur):
    n = int(dur * SR); x = np.arange(n) / SR
    if tipo == "vento":
        b = passa_baixa(ruido(n, 11), .015)
        return b / (np.max(np.abs(b)) + 1e-9) * (.05 + .03 * np.sin(2 * np.pi * .13 * x))
    if tipo == "riacho":
        b = passa_baixa(ruido(n, 12), .25) - passa_baixa(ruido(n, 12), .02)
        return b / (np.max(np.abs(b)) + 1e-9) * .05
    if tipo == "grilos":
        out = np.zeros(n)
        for k in np.arange(0.3, dur, 0.9):
            for j in range(3):
                xx = np.arange(int(.05 * SR)) / SR
                colocar(out, np.sin(2 * np.pi * 4300 * xx) * np.sin(np.pi * xx / .05) * .035, k + j * .07)
        return out
    if tipo == "passaros":
        out = np.zeros(n); r = np.random.default_rng(5)
        k = 0.8
        while k < dur:
            xx = np.arange(int(.18 * SR)) / SR
            f = 2600 + 900 * np.sin(2 * np.pi * 9 * xx) + r.uniform(-300, 300)
            colocar(out, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * xx / .18) * .03, k)
            k += r.uniform(1.5, 4.0)
        return out
    return np.zeros(n)


# ------------------------------------------------------------------ música por clima
ESTILOS = {
    "alegre": dict(bpm=96, ac=[("C3", "C4 E4 G4 C5"), ("G2", "B3 D4 G4 D5"), ("A2", "A3 C4 E4 A4"), ("F2", "A3 C4 F4 C5")],
                   mel="E5 G5 C6 B5 G5 D5 C5 E5 A5 G5 F5 A5 C6 A5 G5 E5", passo=1, cada=4, gm=.07, g=1.0),
    "tema":   dict(bpm=112, ac=[("C3", "C4 E4 G4 C5"), ("A2", "A3 C4 E4 A4"), ("F2", "A3 C4 F4 C5"), ("G2", "B3 D4 G4 D5")],
                   mel="G5 G5 E5 G5 A5 G5 E5 C5 A5 A5 F5 A5 G5 E5 D5 C5", passo=1, cada=2, gm=.13, g=1.05),
    "triste": dict(bpm=68, ac=[("A2", "A3 C4 E4 A4"), ("F2", "F3 A3 C4 F4"), ("C3", "C4 E4 G4 C5"), ("E2", "E3 G#3 B3 E4")],
                   mel="", passo=2, cada=0, gm=0, g=.8),
    "suspense": dict(bpm=84, ac=[("D2", "D3 F3 A3 D4"), ("C#2", "C#3 E3 A3 C#4")],
                   mel="", passo=2, cada=0, gm=0, g=.75),
    "noite":  dict(bpm=66, ac=[("F2", "F3 A3 C4 F4"), ("C3", "E3 G3 C4 E4"), ("D2", "D3 F3 A3 D4"), ("A#2", "A#3 D4 F4 A#4")],
                   mel="A5 C6 A5 G5 F5 G5 A5 F5", passo=1, cada=8, gm=.05, g=.75),
    "biblico": dict(bpm=84, ac=[("D2", "D4 E4 F4 A4"), ("D2", "G4 A4 C5 A4"), ("C2", "E4 G4 A4 C5"), ("D2", "F4 E4 D4 A3")],
                   mel="", passo=1, cada=0, gm=0, g=.9, drone="D2 A2"),
    "oracao": dict(bpm=60, ac=[("C3", "C4 E4 G4"), ("A2", "A3 C4 E4"), ("F2", "F3 A3 C4"), ("G2", "G3 B3 D4")],
                   mel="", passo=0, cada=0, gm=0, g=.7, pad=True),
}

def nt(nm):
    sus = "#" in nm
    base = nota(nm.replace("#", ""))
    return base * (2 ** (1 / 12) if sus else 1)

def musica(estilo, dur):
    e = ESTILOS[estilo]
    out = np.zeros(int(dur * SR) + SR * 3)
    col = 60 / e["bpm"] / 2
    padrao = [0, 1, 2, 3, 2, 1, 2, 3]
    mel = e["mel"].split()
    if e.get("drone"):
        x = np.arange(len(out)) / SR
        for nm in e["drone"].split():
            out += .05 * np.sin(2 * np.pi * nt(nm) * x) * (1 + .3 * np.sin(2 * np.pi * .2 * x))
    tt = 0.0; i = 0
    while tt < dur:
        baixo, notas = e["ac"][(i // 8) % len(e["ac"])]
        notas = notas.split(); k = int(tt * SR)
        if e.get("pad"):
            if i % 8 == 0:
                x = np.arange(int(col * 8 * SR + SR)) / SR
                p = sum(np.sin(2 * np.pi * nt(n) * x) + .3 * np.sin(4 * np.pi * nt(n) * x) for n in notas)
                p *= np.minimum(1, x / 1.2) * np.minimum(1, (x[-1] - x) / 1.0)
                colocar(out, p, tt, .045)
                b = corda(nt(baixo), 3.0, .999); colocar(out, b, tt, .3)
        else:
            if i % 8 == 0:
                b = corda(nt(baixo), 2.0, .998); colocar(out, b, tt, .55)
            if e["passo"] and i % e["passo"] == 0:
                c = corda(nt(notas[padrao[i % 8] % len(notas)]), 1.2); colocar(out, c, tt, .32)
            if e["cada"] and mel and i % e["cada"] == 0:
                s = sino(nt(mel[(i // e["cada"]) % len(mel)]), 1.2); colocar(out, s, tt, e["gm"])
        tt += col; i += 1
    return out[:int(dur * SR)] * e["g"]


# ------------------------------------------------------------------ montagem de uma cena
async def montar(cena, pasta, cache):
    # 1) gera as vozes e mede durações
    falas = {}
    for it in cena["itens"]:
        if it["k"] == "fala":
            wav = await gerar_voz(it["quem"], it["texto"], it.get("rate"), cache)
            falas[it["id"]] = ler_wav(wav)
    # 2) linha do tempo
    T = {}; cur = 0.0; ult_ini = 0.0
    for it in cena["itens"]:
        if it["k"] == "fala":
            ini = ult_ini if it["junto"] else cur + it["gap"]
            dur = len(falas[it["id"]]) / SR
            T[it["id"]] = [ini, ini + dur]; ult_ini = ini
            cur = max(cur, ini + dur)
        elif it["k"] == "pausa":
            cur += it["seg"]
        elif it["k"] == "marca":
            cur += it["gap"]; T[it["id"]] = [cur, cur]
    fim = T.get("fim", [cur])[0]
    n = int(fim * SR) + 1
    nq = int(fim * FPS) + 1
    vozes = np.zeros(n); boca = {}; quem_de = {}
    for it in cena["itens"]:
        if it["k"] != "fala":
            continue
        v = falas[it["id"]]; v = v / (np.max(np.abs(v)) + 1e-9) * .9
        ini = T[it["id"]][0]
        colocar(vozes, v, ini)
        quem_de[it["id"]] = it["quem"]
        arr = boca.setdefault(it["quem"], np.zeros(nq)); jan = SR // FPS
        for q in range(int(ini * FPS), min(nq, int(T[it["id"]][1] * FPS) + 2)):
            a = int((q / FPS - ini) * SR)
            if 0 <= a < len(v):
                arr[q] = max(arr[q], np.sqrt(np.mean(v[a:a + jan] ** 2)))
    for quem, arr in boca.items():
        ref = np.percentile(arr[arr > 0], 90) if np.any(arr > 0) else 1
        arr = np.clip(arr / ref, 0, 1); arr[arr < .12] = 0
        boca[quem] = [round(float(x), 3) for x in arr]
    # 3) efeitos
    efx = np.zeros(n); al = np.zeros(nq)
    for it in cena["itens"]:
        if it["k"] == "sfx" and it["em"] in T:
            t0 = T[it["em"]][0] + it["desloc"]
            colocar(efx, sfx(it["tipo"]) * it["ganho"], t0)
            if it["tipo"] == "balido":
                al[int(t0 * FPS):int((t0 + .75) * FPS)] = 1
    boca["algodao"] = [float(x) for x in al]
    amb = np.zeros(n)
    for tipo, a, b in cena.get("ambiente", []):
        ta, tb = T[a][0], T[b][0]
        colocar(amb, ambiente(tipo, tb - ta), ta)
    # 4) música (troca de estilo com fade curto) + ducking
    mus = np.zeros(n)
    trocas = [(est, T[m.lstrip("@")][0]) for est, m in cena["musica"]] + [(None, fim)]
    for (est, a), (_, b) in zip(trocas, trocas[1:]):
        trecho = musica(est, b - a + 1.0)
        e = np.ones(len(trecho)); fi = int(.6 * SR)
        e[:fi] = np.linspace(0, 1, fi); e[-int(1.0 * SR):] = np.linspace(1, 0, int(1.0 * SR))
        colocar(mus, trecho * e, a)
    duck = np.ones(n) * .55
    for fid, (a, b) in T.items():
        if fid in falas:
            duck[max(0, int((a - .25) * SR)):int((b + .25) * SR)] = .2
    k = int(.05 * SR); duck = np.convolve(duck, np.ones(k) / k, mode="same")
    x = np.arange(n) / SR
    mix = vozes + efx + amb + mus * duck * .6
    mix *= np.minimum(1, x / .4) * np.clip((fim - x) / .6, 0, 1)
    mix /= max(1.0, np.max(np.abs(mix)) / .95)
    os.makedirs(os.path.join(pasta, cena["id"]), exist_ok=True)
    raw = (np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    os.path.join(pasta, cena["id"], "audio.wav")], input=raw, check=True)
    textos = {it["id"]: it["texto"] for it in cena["itens"] if it["k"] == "fala"}
    json.dump(dict(id=cena["id"], fps=FPS, fim=fim, t=T, boca=boca, quem=quem_de, textos=textos),
              open(os.path.join(pasta, cena["id"], "dados.json"), "w"), ensure_ascii=False)
    print(f"{cena['id']} ({cena['nome']}): {fim:.1f}s")


async def main(pasta, ids):
    cache = os.path.join(pasta, "vozes_cache"); os.makedirs(cache, exist_ok=True)
    for c in CENAS:
        if not ids or c["id"] in ids:
            await montar(c, pasta, cache)


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1], sys.argv[2:]))
