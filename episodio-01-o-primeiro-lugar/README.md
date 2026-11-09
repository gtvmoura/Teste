# Série "No Quintal do Vovô": Episódio 1, "Acima de Todas as Coisas"

Animação 2D infantil sobre o **1º mandamento**: *amar a Deus acima de todas as coisas* (Mateus 22:37-38).

- 🎬 **Episódio completo:** cerca de 10min45s, 1920×1080, 24 fps, com vozes, música e efeitos (veja "Gerar o episódio" abaixo)
- 📝 **Roteiro:** [`roteiro.md`](roteiro.md)
- 🧒 **Personagens:** [`personagens.md`](personagens.md) · [ficha](saida/ficha-personagens.png) · [cenários](saida/cenarios.png)

## Cenas
| # | Cena | Duração |
|---|---|---|
| 0 | Abertura (música-tema com letra para cantar junto) | 0:31 |
| 1 | O presente | 0:28 |
| 2 | Dia após dia | 0:59 |
| 3 | O convite do Lucas | 0:36 |
| 4 | Cadê o Algodão? | 0:30 |
| 5 | A oração no morro | 0:50 |
| 6 | Marta e Maria (história bíblica, Lucas 10) | 1:21 |
| 7 | O pote do coração | 1:33 |
| 8 | Um novo dia | 0:38 |
| 9 | Hora da Lição com o Vovô | 3:04 |
| 10 | Encerramento | 0:14 |

## Como tudo é feito
Tudo é gerado por código, com ferramentas gratuitas:

| Etapa | Arquivo | Ferramenta |
|---|---|---|
| Roteiro em dados (falas, pausas, efeitos, trilhas) | `producao/episodio.py` | Python |
| Vozes, trilha por clima, efeitos e sincronia labial | `producao/producao.py` (+ `audio.py`) | [edge-tts](https://github.com/rany2/edge-tts) + numpy (ukulele, sinos, harpa, grilos, vento, riacho… tudo sintetizado) |
| Personagens (bonecos articulados SVG) | `producao/personagens.js` | JavaScript/SVG |
| Cenários | `producao/cenarios.js` | JavaScript/SVG |
| Animação de cada cena | `producao/cenas_a.js`, `cenas_b.js`, `cenas_c.js` + `motor.js` | JavaScript/SVG |
| Quadros e vídeo | `producao/render_cena.js`, `juntar.sh` | Playwright (Chromium) + ffmpeg (H.264) |

## Gerar o episódio
```bash
pip install edge-tts numpy
cd producao
python3 producao.py /tmp/ep                 # vozes + áudio + dados de todas as cenas
for c in c0 c1 c2 c3 c4 c5 c6 c7 c8 c9 c10; do node render_cena.js /tmp/ep $c video; done
./juntar.sh /tmp/ep ../saida/episodio-01.mp4
# Prévia de uma cena (folha de contato): node render_cena.js /tmp/ep c5 previa
```
- Para mudar uma fala ou um tempo, edite `episodio.py` e rode `producao.py` de novo. A animação se ajusta sozinha à nova duração.
- Prévias auxiliares: `ficha.html` (personagens), `cenarios.html` (cenários), `poses.html` (poses e expressões).

## Observações
- **Vozes:** o edge-tts é gratuito, mas não é um serviço oficial. Para um canal monetizado, use o **Azure Speech** (mesmas vozes, oficial, com cota grátis mensal) ou grave vozes humanas.
- **Música e efeitos:** compostos e sintetizados no próprio código. Não há uso de material de terceiros.
- **Fonte:** Baloo 2 (SIL Open Font License), em `assets/`.
- Revise o conteúdo bíblico com um pastor ou professor antes de publicar.
- `cena.html`, `render.js`, `audio.py` e `vozes.py` são da cena de teste original (`saida/cena-teste.mp4`).
