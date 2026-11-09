/* Cenas 0 a 4 do episódio "Acima de Todas as Coisas". */

// --------------------------------------------------------------- 0. Abertura
const LETRA = ['Lá no quintal do vovô,', 'tem história pra contar,', 'com a Bíblia no coração,', 'a gente aprende a amar!',
  'Davi, Algodão e o Vovô,', 'vem com a gente, vem também,', 'descobrir o jeito de Deus', 'de fazer o bem!'];
function logoSerie(k, t) {
  return `<g transform="translate(960 300) scale(${k * (1 + .03 * Math.sin(t * 3))})">
    <path d="${coracaoPath(0, 20, 170)}" fill="#FFD447" ${contorno(11)}/>
    <text y="-6" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="66" fill="#fff" stroke="${OL}" stroke-width="11" stroke-linejoin="round" paint-order="stroke">No Quintal</text>
    <text y="66" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="66" fill="#fff" stroke="${OL}" stroke-width="11" stroke-linejoin="round" paint-order="stroke">do Vovô</text></g>`;
}
function tituloEp(t, a) {
  const k = prog(t, a, .5), pop = 1 + .15 * Math.sin(seg(t, a, a + .6) * Math.PI);
  return `<g opacity="${k}"><rect width="${W}" height="${H}" fill="#FFF8E7" opacity=".55"/>
    <g transform="translate(960 480) scale(${k * pop})"><text text-anchor="middle" font-family="Baloo" font-weight="800" font-size="132" fill="#FFD447" stroke="${OL}" stroke-width="14" stroke-linejoin="round" paint-order="stroke">Acima de Todas as Coisas</text></g>
    <g transform="translate(960 610)"><rect x="-170" y="-50" width="340" height="80" rx="40" fill="#2F62C9" ${contorno(7)}/>
    <text text-anchor="middle" y="12" font-family="Baloo" font-weight="800" font-size="52" fill="#fff">Episódio 1</text></g></g>`;
}
CENAS.c0 = t => {
  let m = quintal(t) + borboleta(t);
  m += vovo({ x: 1440, y: 920, esc: 1.62, resp: Math.sin(t * 2) * 2, bracoE: 8, bracoD: t > 5 ? 150 + Math.sin(t * 7) * 18 : 8,
    olhar: [-1, 0], pisca: piscar(t, 1.7), boca: 0, inclina: Math.sin(t) * 3, sobr: .6 });
  const a = anda(t, -300, 2400, 0.4, 6.0, 14);
  m += algodao({ x: a.x, y: 944, esc: 1.45, passo: a.passo, pulo: a.andando ? -Math.abs(Math.sin(t * 7)) * 34 : 0, pisca: piscar(t, .9), boca: 0, inclina: Math.sin(t * 7) * 6 });
  const d = anda(t, -560, 2300, 1.0, 6.2, 13);
  m += davi(pp(t, { x: d.x, y: 930, esc: 1.7, passo: d.passo, pulo: d.pulo * 3, bracoE: 60 + Math.sin(t * 13) * 35, bracoD: 60 - Math.sin(t * 13) * 35,
    boca: .45, olhar: [1, 0], sobr: 1, pisca: piscar(t, .2) }));
  let s = comCamera(m, camera2(t, [[0, 960, 540, 1], [8, 960, 540, 1], [27, 960, 520, 1.06], [31, 960, 520, 1.08]]));
  const kl = Math.min(prog(t, 7.0, .8), 1 - prog(t, 27.0, .5));
  if (kl > 0) s += escurece(.3 * kl, '#FFF8E7') + logoSerie(kl, t);
  const t0 = 8.6, dl = 2.35, i = Math.floor((t - t0) / dl);
  if (i >= 0 && i < LETRA.length) {
    const kk = t - t0 - i * dl, op = Math.min(1, kk / .25, (dl - kk) / .25);
    s += legenda('♪ ' + LETRA[i] + ' ♪', op, 900, 64);
    s += `<text x="960" y="1010" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="34" fill="#fff" stroke="${OL}" stroke-width="6" paint-order="stroke" opacity="${op}">Cante com a gente!</text>`;
  }
  if (t > 27.3) s += tituloEp(t, 27.4);
  return s;
};

// --------------------------------------------------------------- 1. O presente
CENAS.c1 = t => {
  const chao = 930, ab = ini('abre'), d1 = ini('d1'), v1 = ini('v1'), corre = ini('corre'), ov = ini('ovelha');
  const w = anda(t, -220, 820, ini('n1'), 3.6);
  const Dv = pp(t, { x: w.x, y: chao, esc: 1.7, passo: w.passo, pulo: w.pulo, bracoE: -24, bracoD: -24, olhar: [.6, .2], pisca: piscar(t, .2), boca: B('davi', t), segura: 'caixa' });
  if (!w.andando && t > ini('n1')) { Dv.olhar = [0, 1]; Dv.inclina = -4; }
  if (t > ab - .7 && t < ab) Dv.caixaRot = Math.sin(t * 40) * 5;
  if (t >= ab) { Dv.segura = null; Dv.bracoE = 70; Dv.bracoD = 70; Dv.olhar = [0, -1]; Dv.sobr = 1; Dv.inclina = 0; Dv.boca = Math.max(Dv.boca, .5 * (1 - seg(t, ab + .5, ab + .9))); }
  if (t >= ab + .7) { Dv.segura = 'controle'; Dv.bracoE = -24; Dv.bracoD = -24; Dv.sobr = .5; Dv.olhar = [0, .3]; }
  if (t >= d1 && t < d1 + 1.9) { Dv.bracosCima = true; Dv.bracoE = 150; Dv.bracoD = 150; Dv.segura = 'controleCima'; Dv.sobr = 1; Dv.pulo = -Math.abs(Math.sin((t - d1) * Math.PI * 1.6)) * 38; Dv.olhar = [0, -.3]; }
  if (t >= d1 + 1.9) { Dv.segura = 'controle'; Dv.bracoE = -24; Dv.bracoD = -24; Dv.pulo = -Math.abs(Math.sin((t - d1) * 6)) * 6 * (t < fim('d1')); Dv.olhar = [.2, 0]; Dv.sobr = .4; }
  if (t >= ini('balido') && t < v1) { Dv.olhar = [-1, .3]; Dv.inclina = 6; Dv.pulo = 0; }
  if (t >= v1) { Dv.olhar = [1, -.2]; Dv.inclina = -5 + Math.sin(t * 2) * 2; Dv.pulo = 0; Dv.sobr = .3; Dv.sorriso = 1.1; }
  if (t >= ini('d1b')) { Dv.sobr = 1; Dv.sorriso = 1.3; Dv.inclina = 0; }
  let mostraDavi = true;
  if (t >= corre) {
    const c = anda(t, 820, 1615, corre, 1.6, 14);
    Object.assign(Dv, { x: c.x, passo: c.passo, pulo: c.pulo * 2, olhar: [1, 0] });
    mostraDavi = t < corre + 1.75;
  }
  // Algodão
  const wa = anda(t, -480, 560, ini('n1') + .3, 3.8, 14);
  const A = { x: wa.x, y: chao + 14, esc: 1.45, passo: wa.passo, pulo: wa.andando ? -Math.abs(Math.sin(t * 7)) * 22 : 0, pisca: piscar(t, .9), boca: B('algodao', t), inclina: Math.sin(t * 1.5) * 3 };
  if (t >= ini('balido') && t < ini('balido') + .9) { A.pulo = -Math.sin(seg(t, ini('balido'), ini('balido') + .6) * Math.PI) * 50; A.inclina = -15; }
  if (t >= ov) A.inclina = -14 * prog(t, ov + .3, .4);
  // Vovô
  const V = { x: 1440, y: chao - 10, esc: 1.62, resp: Math.sin(t * 2) * 2, bracoE: 8, bracoD: 8, olhar: [-1, 0], pisca: piscar(t, 1.7), boca: B('vovo', t), inclina: Math.sin(t * 1.1) * 2, sobr: 0 };
  if (t > d1 && t < v1) { V.inclina = 4; V.sobr = .6; }
  if (fala('v1', t)) { V.bracoD = 30 + Math.max(0, Math.sin((t - v1) * 2.2)) * 35; V.inclina = -3 + Math.sin(t * 3) * 3; }
  if (t > fim('v1') - 1.2 && t < fim('v1') + .6) { V.sobr = 1; V.inclina = 8; }
  if (t > corre) V.olhar = [1, 0];
  // objetos da caixa
  let objs = '';
  if (t >= ab) {
    const bx = 820, by = chao - 48 * 1.7, k = t - ab;
    if (k < 1.6) objs += tampa(bx - k * 320, by - 56 * 1.7 - (520 * k - 520 * k * k), 1.7, 4.5, -k * 400);
    const kc = seg(t, ab, ab + .35);
    objs += caixa(lerp(bx, bx + 150, kc), lerp(by, chao + 10, kc * kc), 1.5, 4.5, false, lerp(0, 8, kc));
    if (k < 1.6) for (let i = 0; i < 16; i++) {
      const ang = rad(-170 + rnd(i) * 160), dist = suave(clamp(k / 1.2)) * (220 + rnd(i + 9) * 260);
      const r = (14 + rnd(i + 3) * 18) * (1 - clamp((k - .6) / 1.0));
      if (r > .5) objs += estrela(bx + Math.cos(ang) * dist, by - 60 + Math.sin(ang) * dist, r, k * 300 + i * 20, i % 3 ? '#FFE45C' : '#fff');
    }
    if (k < .7) { const kk = suave(clamp(k / .7)); objs += controle(bx, lerp(by - 30, chao - 74 * 1.7 - 160, Math.sin(kk * Math.PI * .5)) + kk * kk * 100, 1.7 * (.6 + .4 * kk), 4.5); }
  }
  const porta = t > corre + 1.2 && t < corre + 2.0;
  let m = quintal(t, { porta }) + borboleta(t) + vovo(V) + objs + algodao(A) + (mostraDavi ? davi(Dv) : '');
  if (t > ov + .6) m += balao(A.x + 60, A.y - 190, '?', 60, prog(t, ov + .6, .3));
  const cam = camera2(t, [[0, 960, 540, 1], [ini('n1') + 3, 900, 560, 1.08], [ab + .4, 880, 600, 1.28], [fim('d1'), 900, 600, 1.22],
    [v1, 1130, 560, 1.12], [corre, 1130, 560, 1.12], [corre + 1.4, 1150, 560, 1.0], [ov, 1150, 560, 1.0], [ov + 1.0, 600, 830, 1.8], [DADOS.fim, 600, 830, 1.85]]);
  return comCamera(m, cam);
};

// --------------------------------------------------------------- 2. Dia após dia
function pratoInsert(k) {      // close no prato esfriando
  const vapor = 1 - clamp(k / 2.2);
  let s = `<rect width="${W}" height="${H}" fill="#F6D7A7"/><rect y="640" width="${W}" height="440" fill="#B9824A" ${contorno(8)}/>
    <ellipse cx="960" cy="720" rx="420" ry="120" fill="#fff" ${contorno(8)}/><ellipse cx="960" cy="712" rx="300" ry="80" fill="#F2F2F2"/>
    <ellipse cx="880" cy="700" rx="130" ry="50" fill="#fff" stroke="#e0e0e0" stroke-width="4"/>
    <ellipse cx="1060" cy="705" rx="110" ry="46" fill="#6D3B1F"/><ellipse cx="960" cy="740" rx="60" ry="22" fill="#E8352E"/>
    <rect x="520" y="640" width="30" height="160" rx="12" fill="#B0B0B0" ${contorno(5)}/><rect x="1380" y="640" width="30" height="160" rx="12" fill="#B0B0B0" ${contorno(5)}/>`;
  for (let i = 0; i < 3; i++) s += `<path d="M${880 + i * 90} ${620 - (k * 30) % 40} q-20 -40 0 -80 q20 -40 0 -80" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity="${vapor * .8}"/>`;
  s += `<text x="960" y="230" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="70" fill="${OL}" opacity="${prog(k, .8, .5)}">...esfriando</text>`;
  return s;
}
function coracaoInsert(k) {     // o videogame tomando conta do coração
  let s = `<rect width="${W}" height="${H}" fill="#2B1B3D"/>`;
  s += `<path d="${coracaoPath(960, 560, 360)}" fill="#FFE3EC" ${contorno(10)}/>`;
  const g = 1 - .8 * suave(clamp((k - .15) / .6));
  const lx = lerp(960, 1150, suave(clamp((k - .15) / .6))), ly = lerp(520, 380, suave(clamp((k - .15) / .6)));
  s += `<circle cx="${lx}" cy="${ly}" r="${200 * g}" fill="#FFE27A" opacity=".55"/><circle cx="${lx}" cy="${ly}" r="${120 * g}" fill="#FFD447"/>`;
  const sai = suave(clamp((k - .3) / .5));
  const icones = [[760, 520, -1, `<circle r="34" fill="#FF5A5A" ${contorno(6)}/>`],
    [1000, 680, 1, `<ellipse rx="60" ry="22" fill="#fff" ${contorno(6)}/><ellipse rx="34" ry="12" fill="#6D3B1F"/>`],
    [880, 380, -1, `<rect x="-45" y="-35" width="90" height="70" fill="#fff" ${contorno(6)}/><circle cx="-10" cy="-5" r="10" fill="#FF7A1A"/><circle cx="18" cy="8" r="12" fill="#ddd" ${contorno(3)}/>`]];
  for (const [x, y, d, g2] of icones) s += `<g transform="translate(${x + d * sai * 700} ${y - sai * 200 + sai * sai * 500}) rotate(${sai * 300 * d})">${g2}</g>`;
  s += controle(960, 600, 2 + 4.5 * suave(clamp((k - .1) / .7)), 4);
  return s;
}
CENAS.c2 = t => {
  const marcos = ['segunda', 'terca', 'quarta', 'quinta', 'coracao'].map(ini);
  const bloco = t < marcos[0] ? 0 : t < marcos[1] ? 1 : t < marcos[2] ? 2 : t < marcos[3] ? 3 : t < marcos[4] ? 4 : 5;
  if (bloco === 5) return coracaoInsert(seg(t, marcos[4] + .4, fim('n3') - .5)) + escurece(1 - seg(t, marcos[4], marcos[4] + .4));
  if (bloco === 2 && t >= ini('prato')) return pratoInsert(t - ini('prato')) + escurece(Math.max(1 - seg(t, ini('prato'), ini('prato') + .3), seg(t, marcos[2] - .3, marcos[2])));
  const noite = bloco === 4;
  const horas = [10, 15.5, 12.1, 16.6, 21.4];
  let m = quarto(t, { noite, hora: horas[bloco], relogioRapido: bloco === 0 });
  const sono = [0, .2, .4, .6, 1][bloco];
  const Dv = pp(t, { x: 1000, y: 1000, esc: 1.6, pose: 'sentado', segura: 'controle', bracoE: -24, bracoD: -24, olhar: [-.4, -.6], sono,
    pisca: piscar(t, .2), boca: B('davi', t), inclina: Math.sin(t * 9) * 2 });
  if (fala('d2', t) || fala('d5', t)) { Dv.triste = -1; Dv.sorriso = -.3; }
  let extra = '';
  if (bloco === 1) {       // Algodão quer brincar
    const ent = anda(t, 2150, 1260, ini('ovelhaEntra'), 1.8, 14);
    let ax = ent.x, vira = -1, inc = 0, pulo = ent.andando ? -Math.abs(Math.sin(t * 7)) * 14 : 0;
    if (t > ini('ovelhaEntra') + 1.8 && t < ini('d2')) ax += Math.max(0, Math.sin((t - ini('ovelhaEntra')) * 6)) * -22;
    if (t >= ini('ovelhaSai')) { const s2 = anda(t, 1260, 2150, ini('ovelhaSai') + .5, 2.4, 9); ax = s2.x; vira = 1; inc = 18; pulo = 0; }
    extra += algodao({ x: ax, y: 1010, esc: 1.4, vira, passo: ent.andando || t > ini('ovelhaSai') + .5 ? t * 10 : 0, pulo, pisca: piscar(t, .9), boca: 0, inclina: inc });
    if (t < ini('ovelhaSai')) extra += `<circle cx="${ax - 72 * 1.4}" cy="${1010 - 50 * 1.4 + pulo}" r="20" fill="#FF5A5A" ${contorno(6)}/>`;
  }
  if (bloco === 3) {       // Mamãe e o desenho
    const ent = anda(t, -260, 430, ini('mamaeEntra'), 1.3, 10);
    let mx = ent.x, br = 40, inc = 0;
    if (fala('m2', t)) br = 125;
    if (t >= ini('mamaeSai')) { br = 20; inc = -6; mx = anda(t, 430, -300, ini('mamaeSai') + .9, 2.0, 10).x; }
    const hx = 40 + Math.sin(rad(br)) * 82, hy = -240 + Math.cos(rad(br)) * 82;
    extra += mamae({ x: mx, y: 1000, esc: 1.45, bracoE: 12, bracoD: br, olhar: [1, .2], pisca: piscar(t, 2.1), boca: B('mamae', t), inclina: inc, t, sobr: t >= ini('mamaeSai') ? 0 : .6 });
    if (t < ini('mamaeSai') + .9) extra += `<g transform="translate(${mx + hx * 1.45 + 10} ${1000 + hy * 1.45 - 70}) rotate(${br > 100 ? -6 : 8})"><rect x="-60" y="-50" width="120" height="100" fill="#fff" ${contorno(5)}/>
      <circle cx="-22" cy="-12" r="12" fill="#B0703F" ${contorno(3)}/><path d="M-22 0 v24 M-34 10 h24" stroke="${OL}" stroke-width="4"/><circle cx="24" cy="12" r="16" fill="#fff" ${contorno(3)}/><circle cx="34" cy="6" r="7" fill="#333"/>
      <circle cx="40" cy="-34" r="10" fill="#FFD447"/></g>`;
    else extra += `<g transform="translate(340 1040) rotate(-12)"><rect x="-60" y="-40" width="120" height="80" fill="#fff" ${contorno(5)}/><circle cx="-20" cy="-6" r="10" fill="#B0703F"/><circle cx="24" cy="8" r="13" fill="#fff" ${contorno(3)}/></g>`;
  }
  if (bloco === 4) {       // Vovô chama para orar
    let vx = anda(t, 2150, 1460, ini('vovoEntra'), 1.2, 9).x, inc = Math.sin(t * 1.2) * 2, br = 10;
    if (fala('v2', t)) br = 30 + Math.max(0, Math.sin((t - ini('v2')) * 2)) * 25;
    if (t >= ini('vovoSai')) { inc = -7; if (t > ini('vovoSai') + .9) vx = anda(t, 1460, 2200, ini('vovoSai') + .9, 2.0, 8).x; }
    extra += vovo({ x: vx, y: 990, esc: 1.45, resp: Math.sin(t * 2) * 2, bracoE: 10, bracoD: br, olhar: [-1, .2], pisca: piscar(t, 1.7), boca: B('vovo', t), inclina: inc, sobr: 0 });
  }
  m += extra + davi(Dv);
  const cam = bloco === 0 ? [960, 600, lerp(1, 1.08, seg(t, 0, marcos[0]))] : [1060, 690, 1.25];
  let s = comCamera(m, cam);
  const nomes = ['', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira, à noite'];
  if (bloco > 0) s += faixa(t, marcos[bloco - 1], 1.7, nomes[bloco], bloco === 4 ? '#3B3F8F' : '#2F62C9', 960);
  for (const b of marcos.slice(0, 4)) s += escurece(Math.max(0, 1 - Math.abs(t - b) / .3) * .9);
  return s;
};

// --------------------------------------------------------------- 3. O convite do Lucas
CENAS.c3 = t => {
  const chao = 930, sai = ini('lucasSai'), pt = ini('portao');
  const portaAberta = t >= ini('abre') && t < ini('fecha');
  // Lucas
  const wl = anda(t, 1290, -800, sai, 4.6, 10);
  const passouPortao = sai + 4.6 * (1290 - 210) / 2090;
  const L = pp(t, { x: wl.x, y: chao, esc: 1.65, passo: wl.passo, pulo: wl.pulo, bola: !wl.andando || true, bracoE: 10, bracoD: 10,
    olhar: [1, -.1], pisca: piscar(t, 1.1), boca: B('lucas', t), sorriso: 1.2, sobr: .5, inclina: 3 });
  if (fala('l2', t)) { L.sobr = 1; L.sorriso = .6; }
  if (t > ini('l3') - .3) { L.triste = 1; L.sorriso = -.2; L.olhar = [1, .3]; L.sobr = 0; }
  if (wl.andando) { L.olhar = [-1, .5]; L.inclina = 6; }
  // Davi na porta
  const Dv = pp(t, { x: 1615, y: 872, esc: 1.55, segura: 'controle', bracoE: -24, bracoD: -24, sono: .8, olhar: [-1, 0],
    pisca: piscar(t, .2), boca: B('davi', t), sobr: 0 });
  if (fala('d6', t) || fala('d7', t)) { Dv.triste = -.8; Dv.sorriso = .2; }
  if (fala('d8', t)) { Dv.olhar = [0, -1]; Dv.inclina = -6; }
  // Algodão e a borboleta
  let ax = 560, vira = 1, ap = 0, pulo = 0, bx, by;
  if (t >= pt) {
    vira = -1;
    const w = anda(t, 560, -260, pt + 1.4, 3.0, 12); ax = w.x; ap = w.passo; pulo = w.andando ? -Math.abs(Math.sin(t * 6)) * 14 : 0;
    bx = 280 - (t - pt) * 70 + Math.sin(t * 1.7) * 30; by = 640 + Math.sin(t * 2.3) * 40;
  }
  const A = { x: ax, y: chao + 14, esc: 1.45, vira, passo: ap, pulo, pisca: piscar(t, .9), boca: 0, inclina: t > pt && t < pt + 1.4 ? -10 : Math.sin(t) * 3 };
  let m = quintal(t, { porta: portaAberta, portao: seg(t, passouPortao, passouPortao + .5) }) + (t >= pt ? borboleta(t, bx, by) : '');
  m += algodao(A) + lucas(L) + (portaAberta ? davi(Dv) : '');
  const cam = camera2(t, [[0, 1460, 620, 1.35], [sai, 1460, 620, 1.35], [sai + 2.4, 900, 560, 1.0], [pt, 900, 560, 1.0], [pt + 1.3, 430, 660, 1.4], [DADOS.fim, 360, 660, 1.45]]);
  return comCamera(m, cam);
};

// --------------------------------------------------------------- 4. Cadê o Algodão?
function controleInsert(k, a0) {
  let s = `<rect width="${W}" height="${H}" fill="#3B2A4D"/><circle cx="960" cy="560" r="520" fill="#4A3660"/>`;
  s += controle(960, 640, 9, 3);
  const bip = [.3, .7, 1.0].some(b => k > b && k < b + .15);
  if (bip) s += `<circle cx="${960 + 20 * 9}" cy="${640 - 6 * 9}" r="70" fill="#fff" opacity=".6"/>`;
  if (k > 1.6) {
    const kk = prog(k, 1.6, .3);
    s += `<g transform="translate(960 260) scale(${kk})"><rect x="-330" y="-80" width="660" height="140" rx="16" fill="#111" ${contorno(8)}/>
      <text y="30" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-weight="bold" font-size="96" fill="#FF3B3B">GAME OVER</text></g>`;
  }
  return s;
}
CENAS.c4 = t => {
  const chao = 930, pr = ini('procura');
  if (t >= ini('controle') && t < ini('d12') - .1)
    return controleInsert(t - ini('controle')) + escurece(Math.max(1 - seg(t, ini('controle'), ini('controle') + .25), seg(t, ini('d12') - .4, ini('d12') - .1)));
  // Davi
  let w = anda(t, 1615, 1100, .3, 1.4, 11);
  if (t >= pr) w = t < pr + 1.5 ? anda(t, 1100, 330, pr, 1.5, 14) : anda(t, 330, 880, pr + 2.3, 1.4, 14);
  const Dv = pp(t, { x: w.x, y: chao, esc: 1.7, passo: w.passo, pulo: w.pulo, segura: 'controle', bracoE: -24, bracoD: -24,
    olhar: [Math.sin(t * 1.3), -.2], pisca: piscar(t, .2), boca: B('davi', t), sobr: .6, sorriso: -.2, triste: .5 });
  if (fala('d9', t) || fala('d10', t)) { Dv.segura = null; Dv.bracosCima = true; Dv.bracoE = 135; Dv.bracoD = 135; Dv.sobr = 1; Dv.triste = .3; Dv.olhar = [-1, 0]; }
  if (t > pr + 1.5 && t < pr + 2.3) { Dv.olhar = [Math.sin(t * 5), 0]; }
  if (t >= ini('d11')) { Dv.triste = 1; Dv.sorriso = -.9; Dv.lagrima = (t * .9) % 1; Dv.olhar = [1, 0]; }
  if (t >= ini('lucas')) Dv.olhar = [-1, 0];
  if (t >= ini('controle')) { Dv.olhar = [0, 1]; Dv.inclina = 6; Dv.triste = 1; Dv.sorriso = -.8; Dv.lagrima = (t * .7) % 1; }
  // Vovô
  let vx = null;
  if (t >= ini('vovo')) vx = anda(t, 1615, 1250, ini('vovo'), 1.3, 9).x;
  const V = { x: vx, y: chao - 10, esc: 1.62, resp: Math.sin(t * 2) * 2, bracoE: 8, bracoD: fala('v3', t) ? 40 : 8, olhar: [-1, .2], pisca: piscar(t, 1.7), boca: B('vovo', t), inclina: 4, sobr: .3 };
  // Lucas
  let lx = null;
  if (t >= ini('lucas')) lx = anda(t, -260, 470, ini('lucas'), 1.8, 11);
  const L = lx && pp(t, { x: lx.x, y: chao, esc: 1.65, passo: lx.passo, pulo: lx.pulo, olhar: [1, 0], pisca: piscar(t, 1.1), boca: B('lucas', t), triste: .6, sorriso: .3, bola: false });
  let m = quintal(t, { tarde: 1, portao: 1, porta: t < 1.6 || (t > ini('vovo') - .2 && t < ini('vovo') + 1.4) });
  if (vx !== null) m += vovo(V);
  if (L) m += lucas(L);
  m += davi(Dv);
  const cam = camera2(t, [[0, 1350, 580, 1.2], [pr, 1050, 580, 1.0], [ini('d11'), 900, 610, 1.3], [ini('vovo'), 1060, 590, 1.12], [ini('lucas'), 820, 590, 1.0],
    [ini('controle'), 820, 590, 1.0], [ini('d12'), 880, 640, 1.45], [DADOS.fim, 880, 650, 1.5]]);
  return comCamera(m, cam);
};
