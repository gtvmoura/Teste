/* Motor das cenas: utilitários de tempo, câmera, textos e transições.
   window.DADOS (de producao.py) traz os tempos de cada fala/marcador da cena. */
const CENAS = {};
const ini = id => DADOS.t[id][0];
const fim = id => DADOS.t[id][1];
const durou = id => DADOS.t[id][1] - DADOS.t[id][0];
const fala = (id, t) => t >= ini(id) && t < fim(id);
const apos = (id, t) => t >= ini(id);
const entre = (t, a, b) => t >= ini(a) && t < ini(b);
const prog = (t, a, d) => suave(seg(t, a, a + d));            // 0→1 suave a partir do instante a
const ida = (a, b, k) => lerp(a, b, suave(clamp(k)));
const B = (quem, t) => boca(quem, t);

// parâmetros padrão de um personagem
const pp = (t, o) => ({ t, passo: 0, pisca: 0, boca: 0, inclina: 0, olhar: [0, 0], bracoE: 10, bracoD: 10, ...o });
// andar de xa até xb começando em a, durando d (devolve x e passo/pulinho)
function anda(t, xa, xb, a, d, freq = 11) {
  const k = seg(t, a, a + d), andando = t > a && t < a + d;
  return { x: lerp(xa, xb, k), passo: andando ? t * freq : 0, pulo: andando ? -Math.abs(Math.sin(t * freq)) * 5 : 0, andando };
}

// câmera: lista de [tempo, x, y, zoom]; interpola suavemente
function camera2(t, keys) {
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const [t0, x0, y0, z0] = keys[i], [t1, x1, y1, z1] = keys[Math.min(i + 1, keys.length - 1)];
  const k = t1 > t0 ? suave(seg(t, t0, t1)) : 1;
  return [lerp(x0, x1, k), lerp(y0, y1, k), lerp(z0, z1, k)];
}
const comCamera = (svg, [cx, cy, z]) => `<g transform="translate(${W / 2} ${H / 2}) scale(${z}) translate(${-cx} ${-cy})">${svg}</g>`;

// faixa de texto (ex.: "Segunda-feira") que desce, fica e sobe
function faixa(t, a, d, texto, cor = '#2F62C9', yFim = 110) {
  if (t < a || t > a + d) return '';
  const k = Math.min(prog(t, a, .35), 1 - prog(t, a + d - .35, .35));
  const w = 60 + texto.length * 30;
  return `<g transform="translate(960 ${lerp(-80, yFim, k)})"><rect x="${-w / 2}" y="-50" width="${w}" height="92" rx="46" fill="${cor}" ${contorno(7)}/>
    <text y="18" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="56" fill="#fff">${texto}</text></g>`;
}
// texto grande na parte de baixo (versículos, oração, karaokê)
function legenda(texto, op = 1, y = 960, tam = 58, cor = '#fff', fundo = 'rgba(42,26,18,.72)') {
  if (op <= 0) return '';
  const w = Math.min(1840, 120 + texto.length * tam * .5);
  return `<g opacity="${op}"><rect x="${960 - w / 2}" y="${y - tam * 1.1}" width="${w}" height="${tam * 1.6}" rx="${tam * .8}" fill="${fundo}"/>
    <text x="960" y="${y + tam * .05}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="${tam}" fill="${cor}">${texto}</text></g>`;
}
// transição em círculo de estrelinhas (para entrar/sair da história bíblica)
function giroEstrelas(t, a, d = 2.0) {
  if (t < a || t > a + d) return '';
  const k = seg(t, a, a + d), cob = Math.sin(k * Math.PI);
  let s = `<rect width="${W}" height="${H}" fill="#1B1240" opacity="${cob * .95}"/>`;
  for (let i = 0; i < 40; i++) {
    const ang = i * 0.9 + k * 6, r = 80 + (i * 37) % 700 * (0.4 + k);
    s += estrela(960 + Math.cos(ang) * r, 540 + Math.sin(ang) * r * .7, 10 + (i % 5) * 4, k * 400 + i * 10, i % 3 ? '#FFE45C' : '#fff');
  }
  return `<g opacity="${cob}">${s}</g>`;
}
const escurece = (op, cor = '#000') => op > 0 ? `<rect width="${W}" height="${H}" fill="${cor}" opacity="${op}"/>` : '';
// balão de pensamento/fala simples
function balao(x, y, texto, tam = 40, op = 1) {
  const w = 60 + texto.length * tam * .55;
  return `<g opacity="${op}"><rect x="${x - w / 2}" y="${y - tam * 1.2}" width="${w}" height="${tam * 1.9}" rx="${tam * .9}" fill="#fff" ${contorno(6)}/>
    <path d="M${x - 14} ${y + tam * .65} L${x} ${y + tam * 1.4} L${x + 16} ${y + tam * .65}" fill="#fff" ${contorno(6)}/>
    <rect x="${x - 20}" y="${y + tam * .5}" width="40" height="12" fill="#fff"/>
    <text x="${x}" y="${y + tam * .25}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="${tam}" fill="${OL}">${texto}</text></g>`;
}
function coracaoPath(cx, cy, s) {
  return `M${cx} ${cy + s * .9} C${cx - s * 1.4} ${cy} ${cx - s * 1.1} ${cy - s * 1.1} ${cx - s * .5} ${cy - s * .95} C${cx - s * .2} ${cy - s * .88} ${cx} ${cy - s * .6} ${cx} ${cy - s * .45} C${cx} ${cy - s * .6} ${cx + s * .2} ${cy - s * .88} ${cx + s * .5} ${cy - s * .95} C${cx + s * 1.1} ${cy - s * 1.1} ${cx + s * 1.4} ${cy} ${cx} ${cy + s * .9} Z`;
}

function render(t) {
  let s = CENAS[DADOS.id](t);
  s += escurece(1 - seg(t, 0, .45));                      // entra do preto
  s += escurece(seg(t, DADOS.fim - .5, DADOS.fim));      // sai para o preto
  document.getElementById('tela').innerHTML = s;
}
window.render = render;

// câmera que segue quem está falando: alvos = { quem: [x, y, zoom] }; janela opcional [a, b] em segundos
function camFalas(t, alvos, padrao, a0 = 0, b0 = DADOS.fim) {
  const ev = Object.entries(DADOS.t).filter(([id, [a]]) => DADOS.quem[id] && alvos[DADOS.quem[id]] && a >= a0 && a < b0).sort((x, y) => x[1][0] - y[1][0]);
  const keys = [[a0, ...padrao]]; let cur = padrao;
  for (const [id, [a]] of ev) {
    const nv = alvos[DADOS.quem[id]];
    if (nv === cur) continue;
    const ult = keys[keys.length - 1][0];
    if (a - .05 > ult) keys.push([a - .05, ...cur]);
    keys.push([Math.max(a + .6, ult + .3), ...nv]); cur = nv;
  }
  keys.push([Math.max(b0, keys[keys.length - 1][0] + .1), ...cur]);
  return camera2(t, keys);
}
