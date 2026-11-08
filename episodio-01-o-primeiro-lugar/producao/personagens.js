/* Personagens da série (bonecos articulados em SVG).
   Usado por cena.html e ficha.html. */
const W = 1920, H = 1080, OL = '#2a1a12';
const COR = {
  pele: '#B0703F', peleVo: '#BC7D4E', cabelo: '#24170F', camisa: '#FF7A1A', short: '#2F62C9', tenis: '#E8352E',
  cardiga: '#4F8A5B', calca: '#6B5A4E', sapato: '#5B3A2E', branco: '#FFFFFF', boca: '#7a1f1f', lingua: '#ff8a8a',
  ceu1: '#62C3F2', ceu2: '#CDEFFC', morro1: '#8ED46F', morro2: '#6CCB54', chao: '#5DBB4A', chao2: '#47AE3A'
};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const suave = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => clamp((t - a) / (b - a));
const rad = d => d * Math.PI / 180;
const contorno = sw => `stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"`;
function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

// membro com contorno (linha grossa sobre linha mais grossa escura)
const membro = (x1, y1, x2, y2, w, c, sw) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${OL}" stroke-width="${w + 2 * sw}" stroke-linecap="round"/>` +
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

// valor da boca (0..1) para um personagem no instante t
function boca(quem, t) {
  const arr = (window.DADOS && DADOS.boca[quem]) || [];
  const f = t * DADOS.fps, i = Math.floor(f), k = f - i;
  return lerp(arr[i] || 0, arr[i + 1] || 0, k);
}
// piscar: fechado por ~0.12s a cada alguns segundos
function piscar(t, semente) {
  const per = 3.2 + semente * 0.7, fase = (t + semente * 1.3) % per;
  return fase < 0.12 ? Math.sin(fase / 0.12 * Math.PI) : 0;
}

/* ------------------------------- olhos e boca ------------------------------- */
function olhosGrandes(cx, cy, r, look, fech, sw, sobr = 0) {
  let s = '';
  for (const d of [-1, 1]) {
    const x = cx + d * r * 0.36, y = cy + r * 0.06;
    const rx = r * 0.19, ry = r * 0.24;
    if (fech > 0.75) {
      s += `<path d="M${x - rx} ${y} Q${x} ${y + ry * 0.5} ${x + rx} ${y}" fill="none" ${contorno(sw)}/>`;
    } else {
      const k = 1 - fech;
      s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry * k}" fill="#fff" ${contorno(sw)}/>`;
      const px = x + look[0] * r * 0.07, py = y + look[1] * r * 0.07;
      s += `<ellipse cx="${px}" cy="${py}" rx="${r * 0.115}" ry="${r * 0.12 * k}" fill="#1d120c"/>`;
      s += `<circle cx="${px + r * 0.04}" cy="${py - r * 0.05 * k}" r="${r * 0.045}" fill="#fff"/>`;
    }
    // sobrancelha
    const by = y - ry - r * 0.12 - sobr * r * 0.12;
    s += `<path d="M${x - rx * 0.9} ${by + d * 0} Q${x} ${by - r * 0.08} ${x + rx * 0.9} ${by}" fill="none" stroke="${OL}" stroke-width="${sw * 1.3}" stroke-linecap="round"/>`;
  }
  return s;
}
function bocaCartoon(cx, y, r, m, sw, t, sorriso = 1) {
  if (m < 0.12) {
    const w = r * 0.24;
    return `<path d="M${cx - w} ${y} Q${cx} ${y + r * 0.22 * sorriso} ${cx + w} ${y}" fill="none" ${contorno(sw)}/>`;
  }
  const varia = 0.85 + 0.3 * Math.abs(Math.sin(t * 23)); // varia a largura: parece sílabas diferentes
  const w = r * (0.17 + 0.07 * m) * varia, h = r * (0.1 + 0.32 * m);
  return `<path d="M${cx - w} ${y - 2} Q${cx} ${y - 6} ${cx + w} ${y - 2} Q${cx + w * 0.9} ${y + h} ${cx} ${y + h} Q${cx - w * 0.9} ${y + h} ${cx - w} ${y - 2} Z" fill="${COR.boca}" ${contorno(sw)}/>` +
    `<ellipse cx="${cx}" cy="${y + h * 0.72}" rx="${w * 0.55}" ry="${h * 0.24}" fill="${COR.lingua}"/>`;
}

/* ---------------------------------- Davi ---------------------------------- */
function controle(x, y, s, sw) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-38 -14 Q-38 -22 -26 -22 H26 Q38 -22 38 -14 L44 12 Q46 24 34 24 Q26 24 20 12 H-20 Q-26 24 -34 24 Q-46 24 -44 12 Z" fill="#7B4FD6" ${contorno(sw)}/>
    <path d="M-24 -6 v12 M-30 0 h12" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <circle cx="20" cy="-6" r="4.5" fill="#FFD447"/><circle cx="28" cy="2" r="4.5" fill="#4CD964"/>
    <circle cx="12" cy="2" r="4.5" fill="#FF5A5A"/></g>`;
}
function caixa(x, y, s, sw, comTampa = true, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <rect x="-37" y="-56" width="74" height="56" rx="4" fill="#E8352E" ${contorno(sw)}/>
    <rect x="-8" y="-56" width="16" height="56" fill="#FFD447" ${contorno(sw * 0.6)}/>
    ${comTampa ? tampa(0, -56, 1, sw) : ''}</g>`;
}
function tampa(x, y, s, sw, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M-10 -16 Q-30 -40 -34 -20 Q-34 -12 -10 -16 Z" fill="#FFD447" ${contorno(sw * 0.8)}/>
    <path d="M10 -16 Q30 -40 34 -20 Q34 -12 10 -16 Z" fill="#FFD447" ${contorno(sw * 0.8)}/>
    <rect x="-42" y="-17" width="84" height="19" rx="4" fill="#F0453B" ${contorno(sw)}/>
    <rect x="-8" y="-17" width="16" height="19" fill="#FFD447" ${contorno(sw * 0.6)}/></g>`;
}

const VIS_DAVI = { pele: COR.pele, cabelo: COR.cabelo, camisa: COR.camisa, short: COR.short, tenis: COR.tenis, penteado: 'cachos', estampa: 'cruz' };
function davi(p) { return crianca(p, VIS_DAVI); }
function crianca(p, v) {
  const sw = 4.5, hr = 66, hy = -168;
  let s = '';
  // pernas
  const pernas = [[-11, Math.sin(p.passo) * 0.45], [11, -Math.sin(p.passo) * 0.45]];
  for (const [hx, a] of pernas) {
    const fx = hx + Math.sin(a) * 44, fy = -52 + Math.cos(a) * 44;
    s += membro(hx, -52, fx, fy - 4, 15, v.pele, sw);
    s += `<ellipse cx="${fx + (hx < 0 ? -4 : 4)}" cy="${fy}" rx="16" ry="8" fill="${v.tenis}" ${contorno(sw)}/>`;
  }
  s += `<path d="M-32 -66 H32 V-34 H6 L0 -44 L-6 -34 H-32 Z" fill="${v.short}" ${contorno(sw)}/>`;
  const braco = (lado, ang) => {
    const ox = lado * 34, oy = -106, L = 54;
    const hx = ox + lado * Math.sin(rad(ang)) * L, hyy = oy + Math.cos(rad(ang)) * L;
    return { svg: membro(ox, oy, hx, hyy, 14, v.pele, sw) + `<circle cx="${hx}" cy="${hyy}" r="9.5" fill="${v.pele}" ${contorno(sw)}/>`, x: hx, y: hyy };
  };
  const bE = braco(-1, p.bracoE), bD = braco(1, p.bracoD);
  // tronco
  s += `<path d="M-34 -116 Q0 -126 34 -116 L40 -56 Q0 -49 -40 -56 Z" fill="${v.camisa}" ${contorno(sw)}/>`;
  if (v.estampa === 'cruz') s += `<path d="M-11 -92 h22 M0 -105 v32" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
  if (v.estampa === '10') s += `<path d="M-14 -119 Q0 -108 14 -119" fill="none" stroke="#fff" stroke-width="5"/><text x="0" y="-70" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="34" fill="#fff" stroke="${OL}" stroke-width="3" paint-order="stroke">10</text>`;
  const mangas = `<circle cx="-34" cy="-108" r="12" fill="${v.camisa}" ${contorno(sw)}/><circle cx="34" cy="-108" r="12" fill="${v.camisa}" ${contorno(sw)}/>`;
  if (!p.bracosCima) s += bE.svg + bD.svg + mangas;
  // cabeça
  let c = '';
  c += `<circle cx="${-hr * 0.98}" cy="${hy + hr * .1}" r="${hr * .2}" fill="${v.pele}" ${contorno(sw)}/>`;
  c += `<circle cx="${hr * 0.98}" cy="${hy + hr * .1}" r="${hr * .2}" fill="${v.pele}" ${contorno(sw)}/>`;
  c += `<circle cx="0" cy="${hy}" r="${hr}" fill="${v.pele}" ${contorno(sw)}/>`;
  if (v.penteado === 'cachos') {
    for (let a = 195; a <= 345; a += 25) { const r = rad(a); c += `<circle cx="${Math.cos(r) * hr * .86}" cy="${hy + Math.sin(r) * hr * .86}" r="${hr * .34}" fill="${v.cabelo}" ${contorno(sw)}/>`; }
    c += `<circle cx="0" cy="${hy - hr * .78}" r="${hr * .42}" fill="${v.cabelo}" ${contorno(sw)}/>`;
  } else {  // liso com franja espetadinha
    const pts = [[.8, -.22], [.58, -.4], [.36, -.2], [.12, -.42], [-.12, -.22], [-.36, -.44], [-.6, -.24], [-.84, -.32]];
    c += `<path d="M${-hr * 1.03} ${hy + 4} A${hr * 1.05} ${hr * 1.08} 0 0 1 ${hr * 1.03} ${hy + 4} ${pts.map(([x, y]) => `L${x * hr} ${hy + y * hr}`).join(' ')} Z" fill="${v.cabelo}" ${contorno(sw)}/>`;
    c += `<path d="M-6 ${hy - hr * 1.02} q10 -26 26 -22 q-10 8 -8 24" fill="${v.cabelo}" ${contorno(sw)}/>`;
  }
  if (v.sardas) for (const d of [-1, 1]) for (const [ox, oy] of [[0, 0], [9, 5], [-8, 6], [3, 11]])
    c += `<circle cx="${d * (hr * .5 + ox)}" cy="${hy + hr * .26 + oy}" r="2.4" fill="#A0522D" opacity=".7"/>`;
  c += olhosGrandes(0, hy, hr, p.olhar, p.pisca, sw, p.sobr || 0);
  for (const d of [-1, 1]) c += `<circle cx="${d * hr * .58}" cy="${hy + hr * .34}" r="${hr * .13}" fill="#ff7b7b" opacity=".45"/>`;
  c += bocaCartoon(0, hy + hr * 0.44, hr, p.boca, sw, p.t, p.sorriso ?? 1);
  s += `<g transform="rotate(${p.inclina || 0} 0 -110)">${c}</g>`;
  if (p.bracosCima) s += bE.svg + bD.svg + mangas;
  // objeto nas mãos
  if (p.segura === 'caixa') s += caixa(0, -48, 1, sw, true, p.caixaRot || 0);
  if (p.segura === 'controle') s += controle(0, -74, 1, sw);
  if (p.segura === 'controleCima') s += controle(bD.x + 6, bD.y - 10, 0.9, sw);
  return `<g transform="translate(${p.x} ${p.y}) scale(${p.esc}) translate(0 ${p.pulo || 0})">${s}</g>`;
}

/* ---------------------------------- Vovô ---------------------------------- */
function vovo(p) {
  const sw = 4.5, hr = 58, hy = -300;
  let s = '';
  for (const d of [-1, 1]) {
    s += membro(d * 17, -118, d * 19, -16, 28, COR.calca, sw);
    s += `<ellipse cx="${d * 24}" cy="-10" rx="24" ry="11" fill="${COR.sapato}" ${contorno(sw)}/>`;
  }
  s += `<path d="M-50 -250 Q0 -262 50 -250 L60 -112 Q0 -100 -60 -112 Z" fill="${COR.cardiga}" ${contorno(sw)}/>`;
  s += `<path d="M-18 -254 L0 -214 L18 -254 Z" fill="#fff" ${contorno(sw * 0.8)}/>`;
  for (const y of [-192, -164, -136]) s += `<circle cx="0" cy="${y}" r="5" fill="#E9D8A6" ${contorno(2.5)}/>`;
  s += `<path d="M-40 -150 h22 v22 h-22 z" fill="#43794E" ${contorno(sw * 0.7)}/>`; // bolso
  const braco = (lado, ang) => {
    const ox = lado * 52, oy = -236, L = 92;
    const hx = ox + lado * Math.sin(rad(ang)) * L, hyy = oy + Math.cos(rad(ang)) * L;
    return membro(ox, oy, hx, hyy, 24, COR.cardiga, sw) + `<circle cx="${hx}" cy="${hyy}" r="13" fill="${COR.peleVo}" ${contorno(sw)}/>`;
  };
  s += braco(-1, p.bracoE) + braco(1, p.bracoD);
  let c = '';
  for (const d of [-1, 1]) c += `<circle cx="${d * hr * 0.98}" cy="${hy + 6}" r="${hr * .2}" fill="${COR.peleVo}" ${contorno(sw)}/>`;
  c += `<circle cx="0" cy="${hy}" r="${hr}" fill="${COR.peleVo}" ${contorno(sw)}/>`;
  c += `<ellipse cx="-18" cy="${hy - 38}" rx="14" ry="7" fill="#fff" opacity=".35" transform="rotate(-20 -18 ${hy - 38})"/>`; // brilho da careca
  for (const d of [-1, 1]) {           // cabelo branco nas laterais
    c += `<circle cx="${d * 54}" cy="${hy - 14}" r="18" fill="#F2F2F2" ${contorno(sw)}/>`;
    c += `<circle cx="${d * 48}" cy="${hy - 34}" r="14" fill="#F2F2F2" ${contorno(sw)}/>`;
    c += `<circle cx="${d * 58}" cy="${hy + 6}" r="13" fill="#F2F2F2" ${contorno(sw)}/>`;
  }
  // olhos atrás dos óculos
  for (const d of [-1, 1]) {
    const x = d * 21, y = hy - 4;
    if (p.pisca > 0.6) c += `<path d="M${x - 7} ${y} q7 4 14 0" fill="none" ${contorno(3.5)}/>`;
    else c += `<ellipse cx="${x + p.olhar[0] * 3}" cy="${y}" rx="5.5" ry="${7 * (1 - p.pisca)}" fill="#1d120c"/><circle cx="${x + p.olhar[0] * 3 + 2}" cy="${y - 2}" r="1.8" fill="#fff"/>`;
    c += `<circle cx="${x}" cy="${y}" r="17" fill="#fff" fill-opacity=".18" stroke="#5B3A2E" stroke-width="4.5"/>`;
    const by = hy - 30 - (p.sobr || 0) * 7;
    c += `<path d="M${x - 15} ${by + 3} Q${x} ${by - 9} ${x + 15} ${by + 3}" fill="none" stroke="#F2F2F2" stroke-width="9" stroke-linecap="round"/>`;
    c += `<path d="M${x - 15} ${by + 3} Q${x} ${by - 9} ${x + 15} ${by + 3}" fill="none" stroke="${OL}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
  }
  c += `<path d="M-4 ${hy - 4} H4" stroke="#5B3A2E" stroke-width="4"/>`;
  // boca (sob o bigode)
  const m = p.boca;
  if (m > 0.12) c += `<ellipse cx="0" cy="${hy + 33 + m * 4}" rx="${10 + 4 * m}" ry="${5 + 11 * m}" fill="${COR.boca}" ${contorno(3.5)}/>`;
  else c += `<path d="M-14 ${hy + 32} Q0 ${hy + 42} 14 ${hy + 32}" fill="none" ${contorno(3.5)}/>`;
  c += `<circle cx="0" cy="${hy + 12}" r="11" fill="#A9693E" ${contorno(sw * 0.8)}/>`; // nariz
  c += `<path d="M0 ${hy + 22} Q-14 ${hy + 16} -30 ${hy + 26} Q-24 ${hy + 36} -10 ${hy + 32} Q-4 ${hy + 30} 0 ${hy + 26} Q4 ${hy + 30} 10 ${hy + 32} Q24 ${hy + 36} 30 ${hy + 26} Q14 ${hy + 16} 0 ${hy + 22} Z" fill="#F7F7F7" ${contorno(sw * 0.8)}/>`;
  for (const d of [-1, 1]) c += `<circle cx="${d * 36}" cy="${hy + 22}" r="8" fill="#ff7b7b" opacity=".35"/>`;
  s += `<g transform="rotate(${p.inclina || 0} 0 -250)">${c}</g>`;
  return `<g transform="translate(${p.x} ${p.y}) scale(${p.esc}) translate(0 ${p.resp || 0})">${s}</g>`;
}

/* -------------------------------- Algodão -------------------------------- */
function algodao(p) {
  const sw = 4.5;
  let s = '';
  const pern = [-22, -8, 12, 24];
  pern.forEach((x, i) => { const a = Math.sin(p.passo + i * Math.PI / 2) * 6; s += `<rect x="${x - 4 + a}" y="-30" width="9" height="28" rx="4" fill="#3a2e2a" ${contorno(sw * 0.7)}/>`; });
  const lã = [[-30, -50, 18], [-12, -60, 20], [8, -58, 20], [24, -48, 17], [-18, -38, 17], [4, -36, 18], [-36, -60, 12]];
  for (const [x, y, r] of lã) s += `<circle cx="${x}" cy="${y}" r="${r + sw}" fill="${OL}"/>`;
  for (const [x, y, r] of lã) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`;
  let c = '';
  c += `<ellipse cx="34" cy="-66" rx="9" ry="5" fill="#3a2e2a" ${contorno(sw * .7)} transform="rotate(-25 34 -66)"/>`;
  c += `<ellipse cx="44" cy="-62" rx="16" ry="19" fill="#3a2e2a" ${contorno(sw)}/>`;
  c += `<ellipse cx="60" cy="-68" rx="9" ry="5" fill="#3a2e2a" ${contorno(sw * .7)} transform="rotate(25 60 -68)"/>`;
  c += `<circle cx="42" cy="-80" r="10" fill="#fff" ${contorno(sw * .7)}/><circle cx="50" cy="-82" r="8" fill="#fff" ${contorno(sw * .7)}/>`;
  if (p.pisca > 0.6) c += `<path d="M44 -64 q4 3 8 0" stroke="#fff" stroke-width="2.5" fill="none"/>`;
  else c += `<circle cx="48" cy="-64" r="5" fill="#fff"/><circle cx="49.5" cy="-64" r="2.6" fill="#111"/>`;
  if (p.boca > 0.1) c += `<ellipse cx="50" cy="-50" rx="5" ry="${3 + 4 * p.boca}" fill="#c0392b" stroke="#fff" stroke-width="1.5"/>`;
  s += `<g transform="rotate(${p.inclina || 0} 34 -55)">${c}</g>`;
  return `<g transform="translate(${p.x} ${p.y}) scale(${p.esc}) translate(0 ${p.pulo || 0})">${s}</g>`;
}


/* ---------------------------------- Lucas ---------------------------------- */
const VIS_LUCAS = { pele: '#E8B48A', cabelo: '#8A5A2B', camisa: '#2DBE60', short: '#FFFFFF', tenis: '#2F62C9', penteado: 'liso', estampa: '10', sardas: true };
function lucas(p) {
  let s = crianca(p, VIS_LUCAS);
  if (p.bola) s += `<g transform="translate(${p.x} ${p.y}) scale(${p.esc})">${bola(78, -24, 24)}</g>`;
  return s;
}
function bola(x, y, r) {
  let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${contorno(4)}/>`;
  const pent = k => [...Array(5)].map((_, i) => { const a = rad(i * 72 - 90); return `${x + Math.cos(a) * r * k} ${y + Math.sin(a) * r * k}`; });
  s += `<path d="M${pent(0.38).join(' L')} Z" fill="${OL}"/>`;
  pent(0.38).forEach((pt, i) => { const a = rad(i * 72 - 90); s += `<path d="M${pt} L${x + Math.cos(a) * r * .95} ${y + Math.sin(a) * r * .95}" stroke="${OL}" stroke-width="3"/>`; });
  return s;
}

/* -------------------------------- Mamãe Ana -------------------------------- */
function mamae(p) {
  const sw = 4.5, hr = 56, hy = -305, pele = '#A8683A', vest = '#E85D75', cab = '#24170F';
  let s = '';
  for (const d of [-1, 1]) {
    s += membro(d * 14, -95, d * 15, -16, 16, pele, sw);
    s += `<ellipse cx="${d * 19}" cy="-10" rx="17" ry="8" fill="#C2185B" ${contorno(sw)}/>`;
  }
  const braco = (lado, ang) => {
    const ox = lado * 40, oy = -240, L = 82;
    const hx = ox + lado * Math.sin(rad(ang)) * L, hyy = oy + Math.cos(rad(ang)) * L;
    return membro(ox, oy, hx, hyy, 14, pele, sw) + `<circle cx="${hx}" cy="${hyy}" r="10.5" fill="${pele}" ${contorno(sw)}/>`;
  };
  s += braco(-1, p.bracoE ?? 12) + braco(1, p.bracoD ?? 12);
  s += `<rect x="-12" y="-266" width="24" height="24" fill="${pele}" ${contorno(sw)}/>`;
  s += `<path d="M-40 -250 Q0 -260 40 -250 L72 -92 Q0 -78 -72 -92 Z" fill="${vest}" ${contorno(sw)}/>`;
  for (const [x, y] of [[-20, -220], [16, -200], [-30, -160], [8, -150], [36, -125], [-44, -110], [-6, -105], [26, -170]])
    s += `<circle cx="${x}" cy="${y}" r="5" fill="#fff" opacity=".85"/>`;
  s += `<path d="M-46 -180 Q0 -172 46 -180" fill="none" stroke="#FFD447" stroke-width="7"/>`;
  s += `<circle cx="-40" cy="-244" r="16" fill="${vest}" ${contorno(sw)}/><circle cx="40" cy="-244" r="16" fill="${vest}" ${contorno(sw)}/>`;
  let c = '';
  c += `<circle cx="0" cy="${hy - hr * 1.15}" r="${hr * .62}" fill="${cab}" ${contorno(sw)}/>`;            // coque
  for (let a = 150; a <= 390; a += 20) { const r = rad(a); c += `<circle cx="${Math.cos(r) * hr * .92}" cy="${hy + Math.sin(r) * hr * .92 - 4}" r="${hr * .3}" fill="${cab}" ${contorno(sw)}/>`; }
  for (const d of [-1, 1]) c += `<circle cx="${d * hr * .98}" cy="${hy + 8}" r="${hr * .2}" fill="${pele}" ${contorno(sw)}/><circle cx="${d * hr * .98}" cy="${hy + 24}" r="5" fill="#FFD447" ${contorno(2.5)}/>`;
  c += `<circle cx="0" cy="${hy}" r="${hr}" fill="${pele}" ${contorno(sw)}/>`;
  c += `<path d="M${-hr * .95} ${hy - hr * .2} Q0 ${hy - hr * 1.25} ${hr * .95} ${hy - hr * .2} Q${hr * .5} ${hy - hr * .62} 0 ${hy - hr * .6} Q${-hr * .5} ${hy - hr * .62} ${-hr * .95} ${hy - hr * .2} Z" fill="${cab}" ${contorno(sw)}/>`;
  c += `<path d="M${-hr * .7} ${hy - hr * .82} Q0 ${hy - hr * 1.18} ${hr * .7} ${hy - hr * .82}" fill="none" stroke="#FFD447" stroke-width="9" stroke-linecap="round"/>`; // faixa
  c += olhosGrandes(0, hy, hr, p.olhar || [0, 0], p.pisca || 0, sw, p.sobr || 0);
  for (const d of [-1, 1]) {           // cílios
    const x = d * hr * .36 + d * hr * .17, y = hy + hr * .06 - hr * .16;
    c += `<path d="M${x} ${y} l${d * 9} -6 M${x - d * 4} ${y - 5} l${d * 7} -8" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`;
  }
  for (const d of [-1, 1]) c += `<circle cx="${d * hr * .58}" cy="${hy + hr * .36}" r="${hr * .13}" fill="#ff7b7b" opacity=".45"/>`;
  c += (p.boca || 0) > 0.12 ? bocaCartoon(0, hy + hr * .46, hr, p.boca, sw, p.t || 0)
    : `<path d="M${-hr * .22} ${hy + hr * .46} Q0 ${hy + hr * .7} ${hr * .22} ${hy + hr * .46}" fill="none" stroke="#B0204A" stroke-width="5" stroke-linecap="round"/>`;
  s += `<g transform="rotate(${p.inclina || 0} 0 -250)">${c}</g>`;
  return `<g transform="translate(${p.x} ${p.y}) scale(${p.esc})">${s}</g>`;
}

/* ====================== estilo "livro antigo" (história bíblica) ====================== */
const OLB = '#5A3B28';
const ctB = (sw = 3.5) => `stroke="${OLB}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"`;
const membroB = (x1, y1, x2, y2, w, c, sw = 3.5) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${OLB}" stroke-width="${w + 2 * sw}" stroke-linecap="round"/>` +
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

function olhosB(hy, r, v, p) {
  let s = '';
  for (const d of [-1, 1]) {
    const x = d * r * .36, y = hy + r * .02;
    if ((p.pisca || 0) > .6 || v.olhosFechados) s += `<path d="M${x - 7} ${y} q7 5 14 0" fill="none" ${ctB(3)}/>`;
    else {
      s += `<ellipse cx="${x}" cy="${y}" rx="7.5" ry="8.5" fill="#fff" ${ctB(2.5)}/>`;
      s += `<circle cx="${x + (p.olhar?.[0] || 0) * 2}" cy="${y + 1 + (p.olhar?.[1] || 0) * 2}" r="5" fill="#2b1a10"/><circle cx="${x + 1.8}" cy="${y - 1}" r="1.6" fill="#fff"/>`;
    }
    if (v.cilios) s += `<path d="M${x + d * 7} ${y - 6} l${d * 6} -4" ${ctB(2.5)}/>`;
    const inc = v.bravo ? d * 5 : (v.gentil ? -d * 2 : 0), by = hy - r * (v.gentil ? .32 : .26);
    s += `<path d="M${x - 9} ${by + inc} Q${x} ${by - 6} ${x + 9} ${by - inc}" fill="none" stroke="${v.sobrancelha || OLB}" stroke-width="${v.gentil ? 3 : 4}" stroke-linecap="round"/>`;
    if (v.gentil) s += `<path d="M${x - 8} ${y + 9} q8 4 16 0" fill="none" stroke="${OLB}" stroke-width="1.8" opacity=".5"/>`;
  }
  return s;
}

function biblico(p, v) {
  const sw = 3.5, hr = 46, hy = -318;
  let s = '';
  if (v.brilho) s += `<circle cx="0" cy="${hy}" r="${hr * 1.9}" fill="#FFE9A8" opacity=".55"/><circle cx="0" cy="${hy}" r="${hr * 1.45}" fill="#FFF3CF" opacity=".6"/>`;
  // cabelo de trás / véu de trás
  if (v.cabeloTras) s += `<path d="M${-hr * 1.05} ${hy - 6} Q${-hr * 1.15} ${hy + 60} ${-hr * .85} ${hy + 78} H${hr * .85} Q${hr * 1.15} ${hy + 60} ${hr * 1.05} ${hy - 6} Z" fill="${v.cabeloTras}" ${ctB(sw)}/>`;
  if (v.veu) s += `<path d="M${-hr * 1.25} ${hy - 20} Q${-hr * 1.5} ${hy + 80} ${-hr * 1.35} ${hy + 120} L${hr * 1.35} ${hy + 120} Q${hr * 1.5} ${hy + 80} ${hr * 1.25} ${hy - 20} Z" fill="${v.veu}" ${ctB(sw)}/>`;
  // pés com sandálias
  for (const d of [-1, 1]) s += `<ellipse cx="${d * 22}" cy="-7" rx="16" ry="7" fill="${v.pele}" ${ctB(sw)}/><path d="M${d * 22 - 10} -9 h20" stroke="#8B5A2B" stroke-width="4"/>`;
  // túnica
  s += `<path d="M-40 -270 Q0 -280 40 -270 Q58 -262 60 -240 L74 -18 Q0 -6 -74 -18 L-60 -240 Q-58 -262 -40 -270 Z" fill="${v.tunica}" ${ctB(sw)}/>`;
  s += `<path d="M-30 -60 Q-34 -150 -24 -230 M26 -40 Q34 -140 22 -230" fill="none" stroke="${OLB}" stroke-width="1.6" opacity=".35"/>`; // dobras
  if (v.avental) s += `<path d="M-38 -190 H38 L44 -60 Q0 -52 -44 -60 Z" fill="${v.avental}" ${ctB(sw)}/><path d="M-48 -192 H48" stroke="${v.faixa || '#8B5A2B'}" stroke-width="8"/><circle cx="-14" cy="-130" r="6" fill="#C9A27A" opacity=".6"/><circle cx="12" cy="-100" r="4" fill="#C9A27A" opacity=".6"/>`;
  if (v.manto) s += `<path d="M-46 -262 Q-20 -270 4 -258 L64 -120 Q56 -96 34 -92 L-30 -230 Z" fill="${v.manto}" ${ctB(sw)}/>`;
  if (v.faixa && !v.avental) s += `<path d="M-58 -150 Q0 -140 58 -150" fill="none" stroke="${v.faixa}" stroke-width="10"/>`;
  // braços (mangas largas)
  const braco = (lado, ang) => {
    const ox = lado * 48, oy = -252, L = 92;
    const hx = ox + lado * Math.sin(rad(ang)) * L, hyy = oy + Math.cos(rad(ang)) * L;
    return membroB(ox, oy, hx, hyy, 26, v.manga || v.tunica) + `<circle cx="${hx}" cy="${hyy}" r="11" fill="${v.pele}" ${ctB(sw)}/>`;
  };
  s += braco(-1, p.bracoE ?? 8) + braco(1, p.bracoD ?? 8);
  if (v.objeto === 'panela') s += `<g transform="translate(${-48 + Math.sin(rad(p.bracoE ?? 8)) * -92 + 0} ${-252 + Math.cos(rad(p.bracoE ?? 8)) * 92 - 4})">
     <path d="M-30 -10 Q-34 34 0 36 Q34 34 30 -10 Z" fill="#A0522D" ${ctB(sw)}/><ellipse cx="0" cy="-10" rx="32" ry="9" fill="#7A3E1F" ${ctB(sw)}/>
     <path d="M-6 -24 q-6 -10 2 -18 M8 -24 q-6 -10 2 -18" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/></g>`;
  // cabeça
  s += `<rect x="-11" y="-282" width="22" height="20" fill="${v.pele}" ${ctB(sw)}/>`;
  for (const d of [-1, 1]) s += `<ellipse cx="${d * hr * .96}" cy="${hy + 4}" rx="8" ry="11" fill="${v.pele}" ${ctB(sw)}/>`;
  s += `<ellipse cx="0" cy="${hy}" rx="${hr * .92}" ry="${hr}" fill="${v.pele}" ${ctB(sw)}/>`;
  if (v.barba) s += `<path d="M${-hr * .86} ${hy - 4} Q${-hr * .9} ${hy + hr * 1.05} 0 ${hy + hr * 1.18} Q${hr * .9} ${hy + hr * 1.05} ${hr * .86} ${hy - 4} Q${hr * .6} ${hy + hr * .5} 0 ${hy + hr * .5} Q${-hr * .6} ${hy + hr * .5} ${-hr * .86} ${hy - 4} Z" fill="${v.barba}" ${ctB(sw)}/>`;
  if (v.cabeloFrente) s += `<path d="M${-hr * .95} ${hy + 6} Q${-hr * 1.05} ${hy - hr * 1.15} 0 ${hy - hr * 1.06} Q${hr * 1.05} ${hy - hr * 1.15} ${hr * .95} ${hy + 6} Q${hr * .8} ${hy - hr * .5} ${hr * .08} ${hy - hr * .66} L0 ${hy - hr * .52} L${-hr * .08} ${hy - hr * .66} Q${-hr * .8} ${hy - hr * .5} ${-hr * .95} ${hy + 6} Z" fill="${v.cabeloFrente}" ${ctB(sw)}/>`;
  if (v.lenco) s += `<path d="M${-hr * 1.02} ${hy + 4} Q${-hr * 1.1} ${hy - hr * 1.2} 0 ${hy - hr * 1.12} Q${hr * 1.1} ${hy - hr * 1.2} ${hr * 1.02} ${hy + 4} Q${hr * .7} ${hy - hr * .55} 0 ${hy - hr * .58} Q${-hr * .7} ${hy - hr * .55} ${-hr * 1.02} ${hy + 4} Z" fill="${v.lenco}" ${ctB(sw)}/>
      <path d="M${hr * .95} ${hy - hr * .5} q22 -6 26 8 q-14 4 -22 10 M${hr * .95} ${hy - hr * .5} q20 10 16 26" fill="${v.lenco}" ${ctB(sw)}/>
      <path d="M${-hr * .5} ${hy - hr * .58} q-6 10 -18 12 M${hr * .4} ${hy - hr * .6} q6 10 16 10" fill="none" stroke="${v.cabeloFrente || '#2b1a10'}" stroke-width="5" stroke-linecap="round"/>`;
  if (v.veu) s += `<path d="M${-hr * 1.15} ${hy + 10} Q${-hr * 1.2} ${hy - hr * 1.3} 0 ${hy - hr * 1.2} Q${hr * 1.2} ${hy - hr * 1.3} ${hr * 1.15} ${hy + 10} Q${hr * .9} ${hy - hr * .7} 0 ${hy - hr * .74} Q${-hr * .9} ${hy - hr * .7} ${-hr * 1.15} ${hy + 10} Z" fill="${v.veu}" ${ctB(sw)}/>`;
  s += olhosB(hy, hr, v, p);
  s += `<path d="M-4 ${hy + 14} q4 4 8 0" fill="none" ${ctB(2.5)}/>`;   // nariz
  for (const d of [-1, 1]) s += `<circle cx="${d * hr * .52}" cy="${hy + hr * .32}" r="8" fill="#E07A5F" opacity=".35"/>`;
  const my = hy + hr * .5;
  if ((p.boca || 0) > .12) s += `<ellipse cx="0" cy="${my + 3}" rx="${8 + 3 * p.boca}" ry="${3 + 9 * p.boca}" fill="#7a2a1f" ${ctB(2.5)}/>`;
  else if (v.bravo) s += `<path d="M-10 ${my + 4} Q0 ${my - 2} 10 ${my + 4}" fill="none" ${ctB(3)}/>`;
  else if (v.barba) s += `<path d="M-15 ${my - 2} Q0 ${my + 14} 15 ${my - 2} Q0 ${my + 4} -15 ${my - 2} Z" fill="#fff" ${ctB(2.5)}/>`;
  else s += `<path d="M-12 ${my} Q0 ${my + 9} 12 ${my}" fill="none" ${ctB(3)}/>`;
  if (v.barba) s += `<path d="M-14 ${my - 5} Q-6 ${my - 10} 0 ${my - 6} Q6 ${my - 10} 14 ${my - 5}" fill="none" stroke="${v.barba}" stroke-width="5" stroke-linecap="round"/>`;
  return `<g transform="translate(${p.x} ${p.y}) scale(${p.esc}) rotate(${p.inclina || 0} 0 -150)">${s}</g>`;
}

const VIS_JESUS = { pele: '#B9835A', tunica: '#F3E9D2', manto: '#A63D32', cabeloTras: '#4A2E1E', cabeloFrente: '#4A2E1E', barba: '#4A2E1E', sobrancelha: '#4A2E1E', brilho: true, gentil: true };
const VIS_MARTA = { pele: '#C08A5E', tunica: '#D9A441', manga: '#D9A441', avental: '#EFE3C8', faixa: '#8B5A2B', lenco: '#C2643C', cabeloFrente: '#2b1a10', cilios: true, objeto: 'panela' };
const VIS_MARIA = { pele: '#C99467', tunica: '#7E9CB8', veu: '#EADFC6', cabeloTras: '#2b1a10', faixa: '#B5823C', cilios: true };
const jesus = p => biblico(p, VIS_JESUS);
const marta = p => biblico(p, { ...VIS_MARTA, bravo: p.bravo });
const maria = p => biblico(p, VIS_MARIA);

/* ------------------------------- utilitários ------------------------------- */
function estrela(x, y, r, rot, cor) {
  let d = '';
  for (let i = 0; i < 10; i++) { const a = rad(i * 36 - 90), rr = i % 2 ? r * 0.45 : r; d += `${i ? 'L' : 'M'}${x + Math.cos(a) * rr} ${y + Math.sin(a) * rr}`; }
  return `<path d="${d}Z" fill="${cor}" ${contorno(3.5)} transform="rotate(${rot} ${x} ${y})"/>`;
}
