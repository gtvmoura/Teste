/* Cenas 8 a 10 do episódio "Acima de Todas as Coisas". */

// --------------------------------------------------------------- 8. Um novo dia
function poltrona(x, y) {
  return `<rect x="${x - 120}" y="${y - 260}" width="240" height="190" rx="40" fill="#5C7CFA" ${contorno(7)}/>
    <rect x="${x - 135}" y="${y - 150}" width="270" height="80" rx="24" fill="#748FFC" ${contorno(7)}/>
    <rect x="${x - 160}" y="${y - 200}" width="50" height="140" rx="22" fill="#5C7CFA" ${contorno(7)}/><rect x="${x + 110}" y="${y - 200}" width="50" height="140" rx="22" fill="#5C7CFA" ${contorno(7)}/>
    <rect x="${x - 120}" y="${y - 70}" width="18" height="70" fill="#5B3A2E" ${contorno(5)}/><rect x="${x + 102}" y="${y - 70}" width="18" height="70" fill="#5B3A2E" ${contorno(5)}/>`;
}
const coracaozinho = (x, y, s, op = 1) => `<path d="${coracaoPath(x, y, s)}" fill="#FF5A7A" ${contorno(5)} opacity="${op}"/>`;
CENAS.c8 = t => {
  const mo = ini('montagem'), m2 = ini('m2'), m3 = ini('m3'), na = ini('narra');
  let s;
  if (t < mo) {
    let m = quarto(t, { hora: 7.2 });
    const Dv = pp(t, { x: 1260, y: 1000, esc: 1.55, olhar: [0, 0], pisca: piscar(t, .2), boca: B('davi', t), sorriso: 1.1 });
    if (t >= ini('espreguica') && t < ini('olha')) Object.assign(Dv, { bracosCima: true, bracoE: 165, bracoD: 165, olhosFechados: true, boca: .7 * Math.sin(seg(t, 1, 3) * Math.PI), pulo: -6 });
    if (t >= ini('olha')) Dv.olhar = t < ini('olha') + 1.2 ? [-1, -.3] : [1, .3];
    if (t >= ini('olha') + 1.2) Dv.sobr = .8;
    if (t >= ini('ajoelha')) Object.assign(Dv, { x: lerp(1260, 1165, prog(t, ini('ajoelha'), .5)), pose: 'ajoelhado', segura: 'biblia', bracoE: -30, bracoD: -30, olhar: [0, -.6], sorriso: 1.3, sobr: .6 });
    m += davi(Dv);
    s = comCamera(m, camera2(t, [[0, 1150, 650, 1.25], [ini('ajoelha'), 1150, 650, 1.25], [ini('d25'), 1170, 700, 1.5], [mo, 1170, 700, 1.55]]));
  } else if (t < m2) {          // Mamãe dá um beijo na testa
    const k = prog(t, mo + 1.0, .6) * (1 - prog(t, mo + 2.4, .5));
    let m = quintal(t);
    m += mamae({ x: 830, y: 935, esc: 1.6, bracoE: 12, bracoD: lerp(12, 60, k), olhar: [1, .6], pisca: piscar(t, 2.1), boca: 0, inclina: 14 * k, t });
    m += davi(pp(t, { x: 1050, y: 935, esc: 1.7, olhar: [-1, -.5], olhosFechados: k > .5, sorriso: 1.4, pisca: piscar(t, .2), bracoE: -24, bracoD: -24 }));
    if (t > mo + 1.4) m += coracaozinho(1000, 520 - (t - mo - 1.4) * 60, 34 * prog(t, mo + 1.4, .3), 1 - prog(t, mo + 3.2, .6));
    s = comCamera(m, [950, 640, 1.35]);
  } else if (t < m3) {          // toca aqui com o Lucas + bola com o Algodão
    let m = quintal(t);
    const hi = t > m2 + .5 && t < m2 + 1.4;
    const bx = t < m2 + 1.6 ? 960 : lerp(960, 1700, prog(t, m2 + 1.6, 2.2));
    const Dv = pp(t, { x: 820, y: 935, esc: 1.7, olhar: [1, 0], pisca: piscar(t, .2), sorriso: 1.4, sobr: .8, bracoE: 10, bracoD: hi ? 150 : 10, bracosCima: hi, pulo: hi ? -20 : 0 });
    const L = pp(t, { x: 1110, y: 935, esc: 1.7, olhar: [-1, 0], pisca: piscar(t, 1.1), sorriso: 1.4, sobr: .8, bracoE: hi ? 150 : 10, bracoD: 10, bracosCima: hi, pulo: hi ? -20 : 0 });
    if (t > m2 + 1.6) { Dv.olhar = [1, .3]; L.olhar = [1, .3]; L.pulo = Dv.pulo = -Math.abs(Math.sin(t * 8)) * 18; }
    const a = anda(t, 300, bx - 120, m2 + 1.8, 2.2, 15);
    m += algodao({ x: t < m2 + 1.8 ? 300 : a.x, y: 950, esc: 1.45, passo: a.passo, pulo: a.andando ? -Math.abs(Math.sin(t * 8)) * 26 : 0, pisca: piscar(t, .9), boca: 0 });
    m += davi(Dv) + lucas(L) + `<g transform="rotate(${(bx - 960) * 1.2} ${bx} 950)">${bola(bx, 950, 30)}</g>`;
    if (hi) m += estrela(965, 520, 40 * Math.sin(seg(t, m2 + .5, m2 + 1.4) * Math.PI), t * 200, '#FFE45C');
    s = comCamera(m, [1000, 640, 1.2]);
  } else if (t < na) {          // videogame com o Vovô
    let m = quarto(t, { noite: true, hora: 20 }) + poltrona(1330, 1000);
    const ri = Math.abs(Math.sin(t * 9));
    m += vovo({ x: 1330, y: 1000, esc: 1.45, pose: 'sentado', resp: Math.sin(t * 3) * 3, bracoE: -30, bracoD: -30, olhar: [-1, -.2], pisca: piscar(t, 1.7), boca: .5 * ri, inclina: Math.sin(t * 4) * 5, sobr: 1 });
    m += controle(1330, 1000 - 132 * 1.45, 1.3, 4);
    m += davi(pp(t, { x: 930, y: 1010, esc: 1.6, pose: 'sentado', segura: 'controle', bracoE: -24, bracoD: -24, olhar: [1, -.4], pisca: piscar(t, .2), boca: .5 * ri, sorriso: 1.5, inclina: Math.sin(t * 4 + 1) * 5 }));
    for (let i = 0; i < 4; i++) { const k = ((t - m3) * .5 + i / 4) % 1;
      m += `<text x="${i % 2 ? 1450 : 800}" y="${560 - k * 160}" font-family="Baloo" font-weight="800" font-size="54" fill="#FFD447" stroke="${OL}" stroke-width="6" paint-order="stroke" opacity="${Math.sin(k * Math.PI)}">HA HA!</text>`; }
    s = comCamera(m, [1120, 680, 1.25]);
  } else {                      // todos juntos
    let m = quintal(t, { tarde: .45 });
    m += `<circle cx="960" cy="560" r="${380 + 20 * Math.sin(t * 2)}" fill="#FFE27A" opacity=".25"/>`;
    m += mamae({ x: 380, y: 925, esc: 1.5, bracoE: 12, bracoD: 12, olhar: [1, 0], pisca: piscar(t, 2.1), boca: 0, t });
    m += vovo({ x: 1500, y: 920, esc: 1.55, resp: Math.sin(t * 2) * 2, bracoE: 8, bracoD: 8, olhar: [-1, 0], pisca: piscar(t, 1.7), boca: 0, inclina: 3, sobr: .5 });
    m += lucas(pp(t, { x: 1220, y: 930, esc: 1.6, olhar: [-1, 0], pisca: piscar(t, 1.1), sorriso: 1.3, bola: true }));
    m += davi(pp(t, { x: 820, y: 935, esc: 1.7, segura: 'algodao', bracoE: -55, bracoD: -55, olhosFechados: true, sorriso: 1.4, inclina: Math.sin(t * 2) * 4, piscaA: piscar(t, .9) }));
    s = comCamera(m, camera2(t, [[na, 960, 560, 1.15], [DADOS.fim, 960, 580, 1.05]]));
  }
  for (const b of [mo, m2, m3, na]) s += escurece(Math.max(0, 1 - Math.abs(t - b) / .25) * .9);
  return s;
};

// --------------------------------------------------------------- 9. Hora da Lição com o Vovô
function vinhetaLivro(t) {
  const k = prog(t, .6, 1.2);
  let s = `<rect width="${W}" height="${H}" fill="#FFD447"/>`;
  for (let i = 0; i < 14; i++) s += estrela(rnd(i) * W, rnd(i + 30) * H, 14 + rnd(i + 5) * 16, t * 60 + i * 20, '#fff');
  s += `<g transform="translate(960 560)">
    <rect x="-470" y="-280" width="940" height="560" rx="20" fill="#8B4513" ${contorno(9)}/>
    <rect x="-440" y="-255" width="430" height="510" rx="10" fill="#FFF8E7" ${contorno(6)}/>
    <g transform="scale(${lerp(1, -1, k)} 1)"><rect x="10" y="-255" width="430" height="510" rx="10" fill="${k < .5 ? '#C0392B' : '#FFF8E7'}" ${contorno(6)}/></g>
    <rect x="10" y="-255" width="430" height="510" rx="10" fill="#FFF8E7" ${contorno(6)} opacity="${k > .5 ? 1 : 0}"/></g>`;
  if (k > .6) {
    const o = prog(t, 1.6, .5);
    s += `<g opacity="${o}"><text x="745" y="520" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="76" fill="#2F62C9">Hora da</text>
      <text x="745" y="610" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="76" fill="#2F62C9">Lição</text>
      <text x="1180" y="540" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="62" fill="#E8352E">com o</text>
      <text x="1180" y="620" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="76" fill="#E8352E">Vovô!</text></g>`;
  }
  return s;
}
const VERSO = ['Amarás o Senhor, teu Deus,', 'de todo o teu coração,', 'de toda a tua alma', 'e de todo o teu entendimento.', 'Mateus 22:37'];
const GESTO = [{ bracosCima: true, bracoE: 10, bracoD: 172 }, { bracoE: -48, bracoD: -48 }, { bracoE: -72, bracoD: -72, olhosFechados: true },
  { bracosCima: true, bracoE: 152, bracoD: 152 }, { bracosCima: true, bracoE: 140, bracoD: 140 }];
function cartao(y, n, texto, cor, icone, op) {
  return `<g opacity="${op}" transform="translate(${lerp(2100, 1460, op)} ${y})"><rect x="-400" y="-70" width="800" height="140" rx="40" fill="#fff" ${contorno(7)}/>
    <circle cx="-330" cy="0" r="46" fill="${cor}" ${contorno(6)}/><text x="-330" y="20" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="60" fill="#fff">${n}</text>
    <text x="-260" y="14" font-family="Baloo" font-weight="800" font-size="38" fill="${OL}">${texto}</text><g transform="translate(330 0)">${icone}</g></g>`;
}
const ICONES = [
  `<rect x="-38" y="-28" width="76" height="56" rx="6" fill="#8B4513" ${contorno(5)}/><path d="M0 -20 V20 M-12 -6 H12" stroke="#FFD447" stroke-width="6"/>`,
  `<path d="${coracaoPath(0, 0, 40)}" fill="#FF5A7A" ${contorno(5)}/><path d="M-14 4 Q0 18 14 4" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="-12" cy="-10" r="4" fill="#fff"/><circle cx="12" cy="-10" r="4" fill="#fff"/>`,
  `<g transform="translate(-20 30) scale(.55)">${algodao({ x: 0, y: 0, esc: 1, passo: 0, pisca: 0, boca: 0 })}</g><path d="${coracaoPath(26, -24, 20)}" fill="#FF5A7A" ${contorno(4)}/>`];
CENAS.c9 = t => {
  const fa = ini('fala');
  if (t < fa) return vinhetaLivro(t) + escurece(seg(t, fa - .3, fa));
  const ve = ini('versiculo'), de = ini('desafio'), ora = ini('oracao');
  const tarde = prog(t, ora, 3) * (1 - prog(t, ini('a1'), 1.5));
  // gesto atual (versículo com gestos)
  let gi = -1;
  ['g1', 'g2', 'g3', 'g4', 'g5'].forEach((id, i) => { if (t >= ini(id) - .2 && t < ini(id) + Math.max(1.1, durou(id) + .3)) gi = i; });
  ['h1', 'h2', 'h3', 'h4', 'h5'].forEach((id, i) => { if (t >= ini(id) - .15 && t < ini(id) + Math.max(.8, durou(id) + .2)) gi = i; });
  const Dv = pp(t, { x: 660, y: 930, esc: 1.7, olhar: [-1, -.2], pisca: piscar(t, .2), boca: B('davi', t), sorriso: 1.2, sobr: .4 });
  if (fala('d26', t)) Object.assign(Dv, { bracosCima: true, bracoD: 165, olhar: [0, 0], sobr: 1, sorriso: 1.4 });
  if (fala('d27', t)) Object.assign(Dv, { olhar: [-1, -.6], inclina: 7, triste: .5, sorriso: .2 });
  if (fala('d30', t) || (t > ini('d30') && t < ora)) Object.assign(Dv, { olhar: [0, 0], sobr: .8, sorriso: 1.4 });
  if (gi >= 0) Object.assign(Dv, GESTO[gi], { olhar: [0, 0], sobr: .8, sorriso: 1.4, pulo: gi === 4 ? -Math.abs(Math.sin(t * 8)) * 30 : 0 });
  const V = { x: 380, y: 920, esc: 1.65, resp: Math.sin(t * 2) * 2, bracoE: 8, bracoD: fala2('vovo', t) ? 30 + Math.max(0, Math.sin(t * 2.2)) * 35 : 8,
    olhar: [0, 0], pisca: piscar(t, 1.7), boca: B('vovo', t), inclina: Math.sin(t * 1.1) * 3, sobr: .4 };
  if (gi >= 0) { V.bracoD = [172, -40, -60, 150, 140][gi]; V.bracoE = [8, -40, -60, 150, 140][gi]; }
  const A = { x: 860, y: 944, esc: 1.45, passo: 0, pisca: piscar(t, .9), boca: B('algodao', t), inclina: Math.sin(t * 1.5) * 3 };
  if (t >= ini('bee') && t < ini('bee') + .9) A.pulo = -Math.sin(seg(t, ini('bee'), ini('bee') + .6) * Math.PI) * 50;
  if (t >= ora && t < ini('a1')) {
    Object.assign(Dv, { bracosCima: false, bracoE: -32, bracoD: -32, olhosFechados: true, sorriso: .9, olhar: [0, 0], inclina: 3, pulo: 0 });
    Object.assign(V, { bracoE: -30, bracoD: -30, pisca: 1 }); A.inclina = 18;
  }
  if (t >= ini('bem')) { Dv.boca = .5 + .3 * Math.sin(t * 12); V.boca = .5 + .3 * Math.sin(t * 11); Dv.olhosFechados = true; Dv.sorriso = 1.5; }
  let m = quintal(t, { tarde }) + borboleta(t) + vovo(V) + algodao(A) + davi(Dv);
  let s = comCamera(m, [880, 560, 1.0]);
  // três jeitinhos
  if (t >= ini('um') && t < ve) {
    const ops = ['um', 'dois', 'tres'].map(id => t >= ini(id) ? prog(t, ini(id), .5) : 0).map(o => o * (1 - prog(t, ve - .6, .6)));
    s += cartao(330, 1, 'Dar o nosso tempo pra Deus', '#2F62C9', ICONES[0], ops[0]);
    s += cartao(530, 2, 'Obedecer com alegria', '#E85D75', ICONES[1], ops[1]);
    s += cartao(730, 3, 'Amar as pessoas', '#2DBE60', ICONES[2], ops[2]);
  }
  // versículo com gestos
  if (t >= ve && t < de) {
    const op = prog(t, ve, .5) * (1 - prog(t, de - .5, .5));
    s += `<g opacity="${op}"><rect x="1080" y="220" width="780" height="560" rx="40" fill="#FFF8E7" ${contorno(7)}/>`;
    VERSO.forEach((l, i) => { const on = gi === i;
      s += `<text x="1470" y="${330 + i * 100}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="${on ? 52 : 44}" fill="${on ? '#E8352E' : OL}">${l}</text>`; });
    s += `</g>`;
  }
  // desafio da semana
  if (t >= de && t < ora) {
    const op = prog(t, de, .5) * (1 - prog(t, ora - .5, .5));
    const pin = ini('d30') + 3.2;
    s += `<g opacity="${op}"><rect x="1060" y="200" width="820" height="480" rx="40" fill="#FFF8E7" ${contorno(7)}/>
      <text x="1470" y="290" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="50" fill="#2F62C9">Desafio da semana</text>
      <text x="1470" y="360" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="44" fill="${OL}">Os primeiros 5 minutos pra Deus</text>`;
    ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach((d, i) => { const x = 1170 + i * 100, cheio = i === 0 && t >= pin;
      const pop = cheio ? 1 + .3 * Math.sin(seg(t, pin, pin + .4) * Math.PI) : 1;
      s += `<path d="${coracaoPath(x, 490, 38 * pop)}" fill="${cheio ? '#FFD447' : '#fff'}" ${contorno(5)}/><text x="${x}" y="600" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="34" fill="${OL}">${d}</text>`; });
    s += `</g>`;
  }
  // oração (frases na tela)
  const ids = ['o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7'];
  ids.forEach((id, i) => {
    const a = ini(id), b = i < ids.length - 1 ? ini(ids[i + 1]) : ini('a1');
    if (t >= a - .1 && t < b) {
      const op = Math.min(prog(t, a - .1, .3), 1 - prog(t, b - .3, .3));
      s += legenda(DADOS.textos[id], op, 960, 60);
      if (t > fim(id) + .2) s += `<text x="960" y="1040" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="36" fill="#fff" stroke="${OL}" stroke-width="6" paint-order="stroke" opacity="${op}">(repita comigo)</text>`;
    }
  });
  if (t >= ini('a1') && t < ini('a1') + 2.5) s += legenda('Amém!', 1 - prog(t, ini('a1') + 2, .5), 960, 80);
  return s + escurece(1 - seg(t, fa, fa + .4));
};

// --------------------------------------------------------------- 10. Encerramento
CENAS.c10 = t => {
  const acena = (f) => 150 + Math.sin(t * 7 + f) * 22;
  let m = quintal(t) + borboleta(t);
  m += mamae({ x: 330, y: 925, esc: 1.5, bracoE: 12, bracoD: acena(0), olhar: [1, 0], pisca: piscar(t, 2.1), boca: 0, t });
  m += vovo({ x: 1150, y: 920, esc: 1.55, resp: Math.sin(t * 2) * 2, bracoE: 8, bracoD: acena(1), olhar: [0, 0], pisca: piscar(t, 1.7), boca: B('vovo', t), inclina: Math.sin(t * 2) * 3, sobr: .6 });
  m += algodao({ x: 900, y: 944, esc: 1.45, passo: 0, pulo: -Math.abs(Math.sin(t * 5)) * 16, pisca: piscar(t, .9), boca: 0 });
  m += lucas(pp(t, { x: 1450, y: 930, esc: 1.6, olhar: [0, 0], pisca: piscar(t, 1.1), sorriso: 1.4, bracosCima: true, bracoE: 10, bracoD: acena(2), bola: true }));
  m += davi(pp(t, { x: 640, y: 930, esc: 1.7, olhar: [0, 0], pisca: piscar(t, .2), boca: B('davi', t), sorriso: 1.4, sobr: .8, bracosCima: true, bracoE: 10, bracoD: acena(3) }));
  let s = comCamera(m, camera2(t, [[0, 900, 560, 1.12], [ini('versiculo'), 900, 560, 1.12], [DADOS.fim, 900, 540, 1.05]]));
  const ve = ini('versiculo');
  if (t >= ve) {
    const op = prog(t, ve, .6);
    s += `<g opacity="${op}"><rect width="${W}" height="${H}" fill="#FFF8E7" opacity=".6"/>
      <rect x="260" y="200" width="1400" height="330" rx="50" fill="#fff" ${contorno(8)}/>
      <text x="960" y="320" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="62" fill="${OL}">"Amarás o Senhor, teu Deus,</text>
      <text x="960" y="400" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="62" fill="${OL}">de todo o teu coração."</text>
      <text x="960" y="480" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="44" fill="#2F62C9">Mateus 22:37</text>
      <text x="960" y="700" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="84" fill="#FFD447" stroke="${OL}" stroke-width="11" stroke-linejoin="round" paint-order="stroke">Até o próximo episódio!</text></g>`;
  }
  return s;
};
