/* Cenas 5 a 7 do episódio "Acima de Todas as Coisas". */

// --------------------------------------------------------------- 5. A oração no morro
CENAS.c5 = t => {
  const aj = ini('ajoelha'), co = ini('corre'), ab = ini('abraco'), ch = ini('chegam');
  const yDe = x => lerp(960, 880, clamp((x - 480) / 600));     // chão do morro (mais perto = mais baixo)
  let w = anda(t, 2150, 1000, .6, 3.4, 10);
  if (t >= co) w = anda(t, 1000, 480, co + .3, 1.8, 14);
  const Dv = pp(t, { x: w.x, y: yDe(w.x), esc: 1.55, passo: w.passo, pulo: w.pulo, segura: t < 4.1 ? 'controle' : null, bracoE: -24, bracoD: -24,
    olhar: [-.3, .5], pisca: piscar(t, .2), boca: B('davi', t), triste: .7, sorriso: -.3 });
  if (t >= aj && t < co + .3) {
    Object.assign(Dv, { pose: 'ajoelhado', bracoE: -32, bracoD: -32, olhosFechados: t < ini('bee'), triste: .9, inclina: 4 });
    if (t >= ini('d13b') && t < ini('estrela')) Dv.lagrima = (t * .6) % 1;
    if (t >= ini('estrela')) { Dv.inclina = 0; Dv.triste = .4; }
    if (t >= ini('bee')) { Dv.olhosFechados = false; Dv.olhar = [-1, 0]; Dv.sobr = 1; Dv.triste = 0; Dv.sorriso = .4; }
  }
  if (t >= co + 2.1 && t < ab + .5) Object.assign(Dv, { pose: 'ajoelhado', bracoE: 40, bracoD: 40, olhar: [-1, .3], sobr: .8, triste: .3, sorriso: .5 });
  // Algodão presa no arbusto
  let ax = 225, ay = 985, apulo = 0, ainc = 0, mostraA = true;
  if (t >= ab) { const k = seg(t, ab, ab + .5); ax = lerp(225, 430, k); apulo = -Math.sin(k * Math.PI) * 60; }
  if (t >= ab + .6) {
    mostraA = false;
    Object.assign(Dv, { pose: 'pe', segura: 'algodao', bracoE: -55, bracoD: -55, olhosFechados: true, sorriso: 1.4, triste: 0, inclina: Math.sin(t * 2.5) * 4, piscaA: piscar(t, .9), bocaA: B('algodao', t) });
    if (t >= ini('d15')) { Dv.olhosFechados = false; Dv.olhar = [0, -1]; Dv.sobr = 1; }
    if (t >= ini('lambe')) { Dv.olhosFechados = true; Dv.boca = Math.max(Dv.boca, .4 + .2 * Math.sin(t * 12)); }
  }
  // Vovô e Lucas chegam
  let extra = '';
  if (t >= ch) {
    const vv = anda(t, 1500, 800, ch, 1.6, 9), lc = anda(t, 1700, 1010, ch + .2, 1.5, 11);
    extra += vovo({ x: vv.x, y: yDe(vv.x) - 10, esc: 1.5, resp: Math.sin(t * 2) * 2, bracoE: 8, bracoD: 8, olhar: [-1, .3], pisca: piscar(t, 1.7), boca: B('vovo', t), inclina: 5, sobr: .7 });
    const L = pp(t, { x: lc.x, y: yDe(lc.x), esc: 1.5, passo: lc.passo, pulo: lc.pulo, olhar: [-1, 0], pisca: piscar(t, 1.1), boca: B('lucas', t), sorriso: 1.3, sobr: 1 });
    if (t >= ini('l5')) Object.assign(L, { bracosCima: true, bracoE: 150, bracoD: 150, pulo: -Math.abs(Math.sin((t - ini('l5')) * 7)) * 40 });
    extra += lucas(L);
  }
  let m = morro(t);
  if (t > ini('estrela')) {
    const k = prog(t, ini('estrela'), 1.2), br = .7 + .3 * Math.sin(t * 4);
    m += `<circle cx="520" cy="160" r="${110 * k}" fill="#FFF7C2" opacity="${.35 * k * br}"/>` + estrela(520, 160, 22 + 26 * k * br, t * 20, '#FFF7C2');
  }
  if (t > 4.1) m += controle(1120, 885, 1.1, 4);
  if (mostraA) m += algodao({ x: ax, y: ay, esc: 1.25, passo: 0, pulo: apulo, pisca: piscar(t, .9), boca: B('algodao', t), inclina: ainc });
  if (t < ab + .3) m += [[190, 985, 46], [292, 990, 44], [240, 1000, 40]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2E5E2A" ${contorno(7)}/>`).join('')
    + [...Array(6)].map((_, i) => `<path d="M${170 + i * 26} ${955 + (i % 2) * 14} l-8 -14" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`).join('');
  m += davi(Dv) + extra;
  const cam = camera2(t, [[0, 1420, 560, 1.0], [4.0, 1050, 640, 1.15], [aj + .6, 1000, 650, 1.45], [ini('estrela'), 1000, 650, 1.45], [ini('estrela') + 1.4, 760, 420, 1.05],
    [ini('bee'), 760, 480, 1.0], [co + 1.0, 520, 700, 1.25], [ab, 450, 720, 1.4], [ch, 450, 720, 1.4], [ch + 1.2, 680, 660, 1.05], [DADOS.fim, 680, 660, 1.05]]);
  return comCamera(m, cam);
};

// --------------------------------------------------------------- 6. Marta e Maria
function varandaCena(t, o = {}) {
  let m = varanda(t);
  m += vovo({ x: 1330, y: 952, esc: 1.5, pose: 'sentado', resp: Math.sin(t * 2) * 2, bracoE: 8, bracoD: fala2('vovo', t) ? 30 + Math.max(0, Math.sin(t * 2.2)) * 30 : 10,
    olhar: [-1, .2], pisca: piscar(t, 1.7), boca: B('vovo', t), inclina: Math.sin(t * 1.1) * 3, sobr: o.sobrV || 0 });
  m += davi(pp(t, { x: 690, y: 1010, esc: 1.55, pose: 'sentado', segura: 'algodao', bracoE: -55, bracoD: -55, olhar: [1, -.3], pisca: piscar(t, .2),
    boca: B('davi', t), piscaA: piscar(t, .9), bocaA: B('algodao', t), inclina: Math.sin(t * .9) * 3, ...(o.davi || {}) }));
  return m;
}
const fala2 = (quem, t) => Object.entries(DADOS.t).some(([id, [a, b]]) => DADOS.quem[id] === quem && t >= a && t < b);
const ALVOS_VAR = { vovo: [1250, 680, 1.45], davi: [800, 740, 1.45] };
function banquinho(x, y) { return `<rect x="${x - 70}" y="${y - 120}" width="140" height="22" rx="6" fill="#8B5A2B" ${ctB(3.5)}/><rect x="${x - 60}" y="${y - 100}" width="16" height="100" fill="#8B5A2B" ${ctB(3)}/><rect x="${x + 44}" y="${y - 100}" width="16" height="100" fill="#8B5A2B" ${ctB(3)}/>`; }
function betaniaCena(t) {
  const bt = ini('betania'), se = ini('senta'), cr = ini('correria'), ms = ini('martaSenta');
  let m = betania(t);
  // Jesus chega e senta
  const jw = anda(t, 2200, 1000, bt + .3, 3.2, 8);
  const J = { x: jw.x, y: 960, esc: 1.4, bracoE: jw.andando ? 10 : 35, bracoD: jw.andando ? 10 : 35, olhar: [0, 0], pisca: piscar(t, 2.3), boca: B('jesus', t), inclina: jw.andando ? Math.sin(t * 8) * 2 : 0 };
  if (t >= se) { J.sentado = 'banco'; J.bracoE = 20; J.bracoD = 20; J.olhar = [1, .4]; }
  if (t >= ini('mt1')) J.olhar = [-1, 0];
  if (fala('j1', t)) { J.bracoE = 50 + Math.sin(t * 1.5) * 10; J.olhar = [-1, 0]; }
  // Maria
  const mw = anda(t, 1350, 1250, se + .2, .8, 8);
  const Ma = { x: mw.x, y: 985, esc: 1.32, bracoE: -30, bracoD: -30, olhar: [-1, -.4], pisca: piscar(t, 1.4), boca: 0 };
  if (t >= se + 1.0) { Ma.sentado = 'chao'; Ma.olhar = [-1, -1]; }
  // Marta
  let mx = 470, br = 60, bravo = false, inc = 0;
  if (t < se) { br = 60; }
  if (t >= cr) { const ciclo = (t - cr) / 2.2; mx = 330 + Math.abs(((ciclo % 2) + 2) % 2 - 1) * 420; br = -38; bravo = true; inc = Math.sin(t * 10) * 4; }
  if (t >= ini('mt1')) { mx = lerp(mx, 700, prog(t, ini('mt1'), .6)); br = 60; inc = 6; }
  if (t >= ini('j1') + 6) bravo = false;
  const sentaM = t >= ms + 1.2;
  if (t >= ms) mx = lerp(700, 760, prog(t, ms, 1.0));
  const Mt = { x: mx, y: 985, esc: 1.32, bracoE: br < 0 ? br : 20, bracoD: br > 0 ? br : 20, olhar: [1, 0], pisca: piscar(t, .8), boca: B('marta', t), inclina: inc, bravo };
  if (fala('mt1', t)) { Mt.bracoD = 70 + Math.sin(t * 5) * 8; Mt.bracoE = -38; }
  if (sentaM) Object.assign(Mt, { sentado: 'chao', bracoE: -30, bracoD: -30, olhar: [1, -1], inclina: 0 });
  // gotas de suor durante a correria
  let suor = '';
  if (t >= cr && t < ini('mt1')) for (let i = 0; i < 3; i++) { const k = ((t * 1.5 + i / 3) % 1); suor += `<path d="M${mx + (i - 1) * 40} ${560 - k * 60} q8 12 0 18 q-8 -6 0 -18" fill="#9BD7FF" ${ctB(2)} opacity="${1 - k}"/>`; }
  m += (t >= se ? banquinho(1000, 960) : '');
  m += (t >= ms ? `<g transform="translate(560 975)"><path d="M-30 -10 Q-34 34 0 36 Q34 34 30 -10 Z" fill="#A0522D" ${ctB(3.5)}/><ellipse cx="0" cy="-10" rx="32" ry="9" fill="#7A3E1F" ${ctB(3.5)}/></g>` : '');
  m += maria(Ma) + (sentaM ? biblico(Mt, { ...VIS_MARTA, objeto: null, bravo: false }) : marta(Mt)) + suor + (jw.x < 2150 ? jesus(J) : '');
  const cam = camera2(t, [[bt, 1000, 560, 1.0], [se, 1000, 600, 1.0], [cr, 700, 600, 1.0], [ini('mt1'), 820, 560, 1.15], [ini('j1'), 1000, 500, 1.4], [ms, 1000, 500, 1.4], [ms + 1.2, 1000, 580, 1.08], [DADOS.fim, 1000, 580, 1.08]]);
  return comCamera(m, cam);
}
CENAS.c6 = t => {
  const tr1 = ini('transicao'), tr2 = ini('transicao2');
  const naHistoria = t >= tr1 + 1.0 && t < tr2 + 1.0;
  let s;
  if (naHistoria) s = betaniaCena(t);
  else {
    const o = {};
    if (fala('d16', t)) o.davi = { triste: .8, sorriso: -.4, olhar: [1, .2] };
    if (fala('d17', t)) o.davi = { sobr: 1, sorriso: 1.3 };
    if (t >= ini('d18')) o.davi = { olhar: [1, -.4], inclina: 6, sobr: .5 };
    if (fala('d19', t)) o.davi = { olhar: [0, .6], triste: .6, sorriso: -.1 };
    if (t >= ini('v9')) o.sobrV = .8;
    s = comCamera(varandaCena(t, o), camFalas(t, ALVOS_VAR, [1050, 660, 1.12], t < tr1 ? 0 : tr2));
  }
  s += giroEstrelas(t, tr1) + giroEstrelas(t, tr2);
  return s;
};

// --------------------------------------------------------------- 7. O pote do coração
function poteInsert(t) {
  const cx = 960, cy = 520, R = 330;
  let s = `<defs><clipPath id="pote"><path d="${coracaoPath(cx, cy, R)}"/></clipPath></defs>`;
  s += `<rect width="${W}" height="${H}" fill="#24356B"/><circle cx="960" cy="200" r="700" fill="#FFE7A0" opacity=".12"/>`;
  s += `<rect y="860" width="${W}" height="220" fill="#8B5A2B" ${contorno(8)}/>`;
  const fase2 = t >= ini('esvazia');
  const PED = [['#FF8FB1', 820, 0], ['#7FB3FF', 900, 1], ['#9BE07B', 980, 2], ['#FFB347', 1060, 3], ['#C59BFF', 1120, 4], ['#FF6B6B', 860, 5]];
  let dentro = '';
  // ----- primeira tentativa: areia e pedrinhas primeiro
  let opA = 1 - prog(t, ini('esvazia'), .9), quedaA = prog(t, ini('esvazia'), .9) * 300;
  if (!fase2 || opA > 0) {
    const nivel = lerp(cy + R * .95, cy + 40, prog(t, ini('areia'), 2.2));
    if (t >= ini('areia')) dentro += `<rect x="${cx - R * 1.5}" y="${nivel + quedaA}" width="${R * 3}" height="${R * 2}" fill="#F2D38B" opacity="${opA}"/>`;
    if (t >= ini('areia') && t < ini('areia') + 2.2) s += `<rect x="${cx - 14}" y="0" width="28" height="${nivel}" fill="#F2D38B" opacity=".9"/>`;
    PED.forEach(([c, x, i]) => { const a = ini('pedrinhas') + i * .17, k = prog(t, a, .35);
      if (t >= a) dentro += `<ellipse cx="${x}" cy="${lerp(-100, cy + 10 - (i % 3) * 70, k) + quedaA}" rx="46" ry="34" fill="${c}" ${contorno(6)} opacity="${opA}"/>`; });
  }
  // ----- segunda tentativa: pedra dourada primeiro
  if (fase2) {
    PED.forEach(([c, x, i]) => { const a = ini('pedrinhas2') + i * .17, k = prog(t, a, .35);
      const alvo = [[800, 700], [1120, 700], [860, 560], [1060, 560], [960, 420], [760, 560]][i];
      if (t >= a) dentro += `<ellipse cx="${alvo[0]}" cy="${lerp(-100, alvo[1], k)}" rx="46" ry="34" fill="${c}" ${contorno(6)}/>`; });
    const nivel2 = lerp(cy + R * .95, cy - 40, prog(t, ini('areia2'), 2.4));
    if (t >= ini('areia2')) dentro = `<rect x="${cx - R * 1.5}" y="${nivel2}" width="${R * 3}" height="${R * 2}" fill="#F2D38B"/>` + dentro;
    if (t >= ini('areia2') && t < ini('areia2') + 2.4) s += `<rect x="${cx - 14}" y="0" width="28" height="${nivel2}" fill="#F2D38B" opacity=".9"/>`;
  }
  s += `<path d="${coracaoPath(cx, cy, R)}" fill="#D6F1FF" opacity=".35"/>`;
  s += `<g clip-path="url(#pote)">${dentro}</g>`;
  // pedra dourada
  let px = 1500, py = 760, rot = 0;
  if (t >= ini('tenta') && !fase2) { const k = prog(t, ini('tenta'), .9); px = lerp(1500, cx, k); py = lerp(760, 150, k);
    if (t > ini('tenta') + .9) { py = 150 + Math.abs(Math.sin((t - ini('tenta') - .9) * 9)) * 18 * Math.exp(-(t - ini('tenta') - .9) * 2); rot = Math.sin(t * 20) * 4 * (t < ini('tenta') + 1.6); } }
  if (fase2 && t < ini('pedra1')) { px = 1500; py = 760; }
  if (t >= ini('pedra1')) { const k = prog(t, ini('pedra1'), .8); px = cx; py = lerp(-120, 690, k * k); }
  const ped = `<g transform="translate(${px} ${py}) rotate(${rot})"><ellipse rx="120" ry="88" fill="#FFC93C" ${contorno(7)}/><ellipse cx="-36" cy="-30" rx="34" ry="18" fill="#FFF1A8" opacity=".9"/></g>`;
  if (t >= ini('pedra1')) { s += `<g clip-path="url(#pote)">${ped}</g>`; s = s.replace(`<g clip-path="url(#pote)">${dentro}</g>`, `<g clip-path="url(#pote)">${ped}${dentro}</g>`); }
  else s += ped;
  s += `<path d="${coracaoPath(cx, cy, R)}" fill="none" ${contorno(9)}/><path d="${coracaoPath(cx, cy, R * .93)}" fill="none" stroke="#fff" stroke-width="6" opacity=".35" stroke-dasharray="160 900"/>`;
  // rótulos durante a explicação do Vovô
  const v12 = ini('v12'), dv = durou('v12');
  const rot2 = (txt, x, y, a, cor) => t >= a && t < ini('esvazia') ? `<g opacity="${prog(t, a, .4)}"><rect x="${x - 190}" y="${y - 40}" width="380" height="68" rx="34" fill="${cor}" ${contorno(5)}/><text x="${x}" y="${y + 8}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="36" fill="#fff">${txt}</text></g>` : '';
  s += rot2('coisas legais', 360, 800, v12 + dv * .05, '#E8A33C') + rot2('pessoas que amamos', 360, 520, v12 + dv * .4, '#E85D75') + rot2('amor por Deus', 1500, 600, v12 + dv * .78, '#2F62C9');
  if (t >= ini('d22')) for (let i = 0; i < 10; i++) { const k = ((t - ini('d22')) * .7 + i / 10) % 1, a = i * .63;
    s += estrela(cx + Math.cos(a) * (380 + k * 120), cy + Math.sin(a) * (300 + k * 100), 18 * (1 - k), t * 90 + i * 30, '#FFE45C'); }
  return s;
}
CENAS.c7 = t => {
  const po = ini('pote'), vo = ini('volta');
  if (t >= po && t < vo) return poteInsert(t) + escurece(Math.max(1 - seg(t, po, po + .35), seg(t, vo - .35, vo)));
  const o = {};
  if (fala('d20', t)) o.davi = { sobr: .8, sorriso: 1.1, inclina: 8 };
  if (fala('d23', t)) o.davi = { triste: .5, sorriso: .1, olhar: [1, -.3] };
  if (t >= ini('abraca')) o.davi = { olhosFechados: true, sorriso: 1.4, inclina: Math.sin(t * 3) * 5 };
  if (t >= ini('v15')) o.sobrV = .8;
  return comCamera(varandaCena(t, o), camFalas(t, ALVOS_VAR, [1050, 660, 1.12]));
};
