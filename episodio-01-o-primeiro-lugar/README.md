# Série infantil cristã: Episódio 1, "Acima de Todas as Coisas"

Animação 2D sobre o **1º mandamento**: *amar a Deus acima de todas as coisas* (Mateus 22:37-38).

- 🎬 **Cena de teste:** [`saida/cena-teste.mp4`](saida/cena-teste.mp4) (cena 1, 24 s, 1920×1080, com vozes, música e efeitos)
- 📝 **Roteiro completo (10 a 12 min, com a "Hora da Lição com o Vovô"):** [`roteiro.md`](roteiro.md)
- 🧒 **Personagens:** [`personagens.md`](personagens.md)

## Como tudo é feito
Tudo é gerado por código e com ferramentas gratuitas:

| Etapa | Arquivo | Ferramenta |
|---|---|---|
| Vozes | `producao/vozes.py` | [edge-tts](https://github.com/rany2/edge-tts) (vozes neurais do Microsoft Edge) + ffmpeg |
| Música, efeitos e sincronia labial | `producao/audio.py` | Python + numpy (ukulele e sininhos sintetizados) |
| Desenho e animação | `producao/cena.html` | SVG + JavaScript: cada personagem é um "boneco articulado" |
| Quadros e vídeo final | `producao/render.js` | Playwright (Chromium) + ffmpeg (H.264, 24 fps) |

## Gerar o vídeo de novo
```bash
pip install edge-tts numpy
cd producao
python3 vozes.py /tmp/ep1/vozes   # gera as falas
python3 audio.py /tmp/ep1         # mixa áudio e calcula a boca de cada quadro
node render.js /tmp/ep1 ../saida/cena-teste.mp4
# Prévia rápida (só imagens):  node render.js /tmp/ep1 --previa 5,10,15
```
Para mudar uma fala, edite `FALAS` em `vozes.py`. Para mudar os tempos, edite `FALAS`/`EVENTOS` em `audio.py`.

## Observações
- **Vozes:** o edge-tts é gratuito, mas não é um serviço oficial. Para um canal monetizado, use o **Azure Speech** (mesmas vozes, oficial, com cota grátis mensal) ou grave vozes humanas.
- **Fonte:** Baloo 2 (SIL Open Font License), em `assets/`.
- Revise o conteúdo bíblico com um pastor ou professor antes de publicar.
