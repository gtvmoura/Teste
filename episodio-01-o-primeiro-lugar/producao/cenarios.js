/* Cenários do episódio 1 (além do quintal, que está em cena.html).
   Cada função devolve o SVG de um mundo 1920x1080 no instante t (s). */

// ---------------------------- quarto do Davi ----------------------------
// op.noite: janela escura + abajur aceso · op.hora: ponteiros do relógio (0..12)
function quarto(t, op = {}) {
  const sw = 7, noite = !!op.noite, hora = op.hora ?? 10;
  let s = '';
  s += `<rect x="-400" y="-300" width="2720" height="1700" fill="#BFE3F2"/>`;
  for (let x = -360; x < 2300; x += 140) for (let y = 40; y < 800; y += 140)        // estrelinhas do papel de parede
    s += `<path d="M${x + (y % 280 ? 70 : 0)} ${y - 10} l4 10 10 0 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 0z" fill="#fff" opacity=".6"/>`;
  s += `<rect x="-400" y="800" width="2720" height="600" fill="#D9A066" ${contorno(sw)}/>`;
  for (let x = -400; x < 2320; x += 160) s += `<path d="M${x} 800 L${x - 120} 1400" stroke="#B9824A" stroke-width="4"/>`;
  s += `<rect x="-400" y="780" width="2720" height="26" fill="#fff" ${contorno(5)}/>`;   // rodapé
  // janela
  const ceu = noite ? '#1E2A5A' : '#8FD3F5';
  s += `<rect x="150" y="190" width="400" height="380" rx="14" fill="${ceu}" ${contorno(sw)}/>`;
  if (noite) { s += `<circle cx="450" cy="290" r="44" fill="#FFF3B0"/><circle cx="472" cy="276" r="40" fill="${ceu}"/>`;
    for (const [x, y] of [[230, 260], [300, 420], [500, 470], [380, 240]]) s += `<circle cx="${x}" cy="${y}" r="${3 + Math.sin(t * 3 + x) * 1.2}" fill="#fff"/>`; }
  else s += `<circle cx="440" cy="300" r="50" fill="#FFD447" ${contorno(5)}/><path d="M150 500 Q300 450 550 500 V570 H150Z" fill="#8ED46F"/>`;
  s += `<path d="M350 190 V570 M150 380 H550" stroke="#fff" stroke-width="16"/><rect x="150" y="190" width="400" height="380" rx="14" fill="none" ${contorno(sw)}/>`;
  for (const d of [-1, 1]) { const x = d < 0 ? 110 : 520; const bal = Math.sin(t * 1.3 + d) * 6;
    s += `<path d="M${x} 160 H${x + 70} Q${x + 60 + bal} 400 ${x + 80} 600 H${x - 10} Q${x + 10 + bal} 400 ${x} 160Z" fill="#FF9F43" ${contorno(sw)}/>`; }
  s += `<rect x="90" y="150" width="520" height="20" rx="10" fill="#8A5A3B" ${contorno(5)}/>`;
  // relógio
  const ah = rad(hora * 30), am = rad((hora % 1) * 360 + t * (op.relogioRapido ? 900 : 0));
  s += `<g transform="translate(980 210)"><circle r="70" fill="#fff" ${contorno(sw)}/>
    ${[...Array(12)].map((_, i) => `<circle cx="${Math.sin(rad(i * 30)) * 54}" cy="${-Math.cos(rad(i * 30)) * 54}" r="4" fill="${OL}"/>`).join('')}
    <line x2="${Math.sin(ah) * 32}" y2="${-Math.cos(ah) * 32}" ${contorno(8)}/><line x2="${Math.sin(am) * 50}" y2="${-Math.cos(am) * 50}" ${contorno(5)}/><circle r="7" fill="${OL}"/></g>`;
  // pôster de futebol
  s += `<g transform="rotate(-4 680 260)"><rect x="600" y="160" width="170" height="210" fill="#2DBE60" ${contorno(sw)}/>${bola(685, 250, 46)}
    <text x="685" y="345" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="34" fill="#fff">GOL!</text></g>`;
  // TV + rack
  const brilho = 0.5 + 0.5 * Math.sin(t * 6);
  s += `<rect x="560" y="660" width="420" height="140" rx="10" fill="#A0603A" ${contorno(sw)}/><path d="M770 660 V800" stroke="${OL}" stroke-width="5"/>
    <rect x="590" y="430" width="360" height="220" rx="16" fill="#2b2b3a" ${contorno(sw)}/>
    <rect x="612" y="450" width="316" height="180" rx="8" fill="hsl(${200 + Math.sin(t) * 40} 80% ${55 + brilho * 8}%)"/>
    <path d="M612 600 Q700 560 780 600 T928 590 V630 H612Z" fill="#4CD964"/>
    <rect x="${700 + Math.sin(t * 3) * 60}" y="${555 - Math.abs(Math.sin(t * 5)) * 30}" width="30" height="30" rx="6" fill="#FFD447" ${contorno(4)}/>
    <text x="770" y="490" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="30" fill="#fff">FASE 7</text>
    <rect x="740" y="650" width="60" height="14" fill="#2b2b3a" ${contorno(4)}/>
    <rect x="600" y="700" width="140" height="40" rx="8" fill="#fff" ${contorno(5)}/><circle cx="715" cy="720" r="7" fill="#4CD964"/>`;
  // tapete
  s += `<ellipse cx="800" cy="960" rx="420" ry="80" fill="#7B4FD6" ${contorno(sw)}/><ellipse cx="800" cy="960" rx="320" ry="56" fill="none" stroke="#B28DFF" stroke-width="10"/>`;
  // criado-mudo com Bíblia e abajur
  s += `<rect x="1090" y="640" width="150" height="160" rx="10" fill="#C9874A" ${contorno(sw)}/><rect x="1110" y="690" width="110" height="10" rx="5" fill="${OL}" opacity=".5"/>
    <rect x="1112" y="610" width="80" height="30" rx="5" fill="#8B4513" ${contorno(5)}/><path d="M1152 614 V636 M1144 622 H1160" stroke="#FFD447" stroke-width="4"/>
    <path d="M1205 640 V560" stroke="${OL}" stroke-width="6"/><path d="M1175 560 L1235 560 L1222 510 L1188 510 Z" fill="#FFE082" ${contorno(5)}/>`;
  if (noite) s += `<circle cx="1205" cy="545" r="160" fill="#FFE9A0" opacity=".25"/>`;
  // cama
  s += `<rect x="1300" y="470" width="40" height="340" rx="10" fill="#2F62C9" ${contorno(sw)}/>
    <rect x="1300" y="660" width="560" height="110" rx="16" fill="#fff" ${contorno(sw)}/>
    <ellipse cx="1420" cy="645" rx="80" ry="34" fill="#fff" ${contorno(sw)}/>
    <path d="M1470 640 H1860 V780 H1470 Q1450 710 1470 640Z" fill="#FF7A1A" ${contorno(sw)}/>
    ${[1540, 1640, 1740].map(x => `<path d="M${x} 640 V780" stroke="#FFD447" stroke-width="10"/>`).join('')}
    <rect x="1320" y="770" width="24" height="50" fill="#2F62C9" ${contorno(5)}/><rect x="1820" y="770" width="24" height="50" fill="#2F62C9" ${contorno(5)}/>`;
  if (noite) s += `<rect x="-400" y="-300" width="2720" height="1700" fill="#0B1640" opacity=".35"/>`;
  return s;
}

// ---------------------------- morro ao pôr do sol ----------------------------
function morro(t) {
  const sw = 7;
  let s = `<defs><linearGradient id="por" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B3C88"/><stop offset=".45" stop-color="#E8628A"/><stop offset=".8" stop-color="#FFB347"/></linearGradient></defs>`;
  s += `<rect x="-400" y="-300" width="2720" height="1700" fill="url(#por)"/>`;
  s += `<circle cx="1320" cy="640" r="150" fill="#FFD36B" opacity=".9"/><circle cx="1320" cy="640" r="210" fill="#FFE5A0" opacity=".25"/>`;
  const est = 0.5 + 0.5 * Math.sin(t * 2.5);
  s += estrela(520, 160, 16 + est * 6, t * 10, '#FFF7C2');
  for (const [x, y] of [[300, 260], [900, 120], [1600, 200], [1100, 300]]) s += `<circle cx="${x}" cy="${y}" r="${2.5 + est}" fill="#fff" opacity=".8"/>`;
  for (let i = 0; i < 3; i++) { const x = 1500 + i * 60 - t * 30 % 2400, y = 330 + i * 25;   // passarinhos
    s += `<path d="M${x} ${y} q12 -12 24 0 q12 -12 24 0" fill="none" stroke="#3a2340" stroke-width="5" stroke-linecap="round"/>`; }
  s += `<path d="M-400 700 Q200 560 700 660 T1700 640 T2320 660 V1400 H-400Z" fill="#8E5A9E" opacity=".85"/>`;
  s += `<path d="M-400 780 Q300 690 900 760 T2320 740 V1400 H-400Z" fill="#B5739C" opacity=".8"/>`;
  s += `<path d="M-400 900 Q400 640 1000 700 Q1500 740 2320 880 V1400 H-400Z" fill="#4E8F3E" ${contorno(sw)}/>`;
  // árvore solitária
  s += `<path d="M1530 760 Q1520 640 1500 560 L1530 556 Q1550 640 1570 760Z" fill="#5B3A2E" ${contorno(sw)}/>
    ${[[1520, 520, 80], [1450, 560, 55], [1590, 560, 60]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3E7A33" ${contorno(sw)}/>`).join('')}`;
  // riacho e arbusto de espinhos
  s += `<path d="M-400 1000 Q100 960 400 1010 T900 1080 V1400 H-400Z" fill="#5DADE2" ${contorno(sw)}/>`;
  for (let i = 0; i < 4; i++) s += `<path d="M${-200 + i * 220 + Math.sin(t * 2 + i) * 20} ${1040 + i * 8} q20 -8 40 0" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/>`;
  s += `<g transform="translate(260 930)">${[[0, 0, 70], [-60, 20, 50], [60, 20, 55]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2E5E2A" ${contorno(sw)}/>`).join('')}
    ${[...Array(10)].map((_, i) => { const a = rad(i * 36); return `<path d="M${Math.cos(a) * 62} ${Math.sin(a) * 50} l${Math.cos(a) * 16} ${Math.sin(a) * 16}" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`; }).join('')}</g>`;
  s += `<rect x="-400" y="-300" width="2720" height="1700" fill="#FF8A3D" opacity=".08"/>`;
  return s;
}

// ---------------------------- varanda à noite ----------------------------
function varanda(t) {
  const sw = 7;
  let s = `<defs><linearGradient id="noite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F1B4D"/><stop offset="1" stop-color="#2E4A8C"/></linearGradient>
    <radialGradient id="luz"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient></defs>`;
  s += `<rect x="-400" y="-300" width="2720" height="1700" fill="url(#noite)"/>`;
  for (let i = 0; i < 60; i++) { const x = rnd(i) * 1300 - 200, y = rnd(i + 99) * 520; s += `<circle cx="${x}" cy="${y}" r="${1.5 + rnd(i + 7) * 2.5 + Math.sin(t * 3 + i) * .8}" fill="#fff" opacity="${.5 + rnd(i + 3) * .5}"/>`; }
  s += `<circle cx="330" cy="180" r="70" fill="#FFF3C4"/><circle cx="360" cy="160" r="64" fill="#16245A"/>`;
  s += `<path d="M-400 760 Q300 680 1100 740 V1400 H-400Z" fill="#1E4D3A"/>`;
  // parede da casa e teto da varanda
  s += `<rect x="1050" y="120" width="1300" height="720" fill="#E8C98E" ${contorno(sw)}/>`;
  for (let y = 150; y < 840; y += 50) s += `<path d="M1050 ${y} H2350" stroke="#C9A66B" stroke-width="4"/>`;
  s += `<rect x="1520" y="380" width="220" height="250" rx="10" fill="#FFD27A" ${contorno(sw)}/><path d="M1630 380 V630 M1520 505 H1740" stroke="${OL}" stroke-width="6"/>`;
  s += `<rect x="-400" y="60" width="2720" height="70" fill="#8A5A3B" ${contorno(sw)}/>`;
  for (const x of [80, 1060]) s += `<rect x="${x}" y="130" width="44" height="720" fill="#A0603A" ${contorno(sw)}/>`;
  // lampião
  const osc = Math.sin(t * 1.5) * 3;
  s += `<g transform="rotate(${osc} 700 130)"><path d="M700 130 V220" stroke="${OL}" stroke-width="5"/><rect x="670" y="220" width="60" height="80" rx="12" fill="#FFE082" ${contorno(sw)}/><circle cx="700" cy="260" r="260" fill="url(#luz)"/></g>`;
  // assoalho e grade
  s += `<rect x="-400" y="840" width="2720" height="600" fill="#B9824A" ${contorno(sw)}/>`;
  for (let x = -400; x < 2320; x += 120) s += `<path d="M${x} 840 L${x - 60} 1400" stroke="#9C6B3A" stroke-width="4"/>`;
  s += `<rect x="-400" y="640" width="1450" height="22" fill="#A0603A" ${contorno(5)}/>`;
  for (let x = -380; x < 1040; x += 70) s += `<rect x="${x}" y="660" width="18" height="180" fill="#A0603A" ${contorno(4)}/>`;
  // cadeira de balanço
  const bal = Math.sin(t * 1.2) * 3;
  s += `<g transform="rotate(${bal} 1330 930)"><path d="M1180 940 Q1330 990 1480 940" fill="none" stroke="#6B3E26" stroke-width="16" stroke-linecap="round"/>
    <rect x="1220" y="560" width="200" height="40" rx="12" fill="#8B5A2B" ${contorno(sw)}/>
    ${[1240, 1290, 1340, 1390].map(x => `<rect x="${x}" y="600" width="14" height="200" fill="#8B5A2B" ${contorno(4)}/>`).join('')}
    <rect x="1200" y="790" width="260" height="34" rx="10" fill="#8B5A2B" ${contorno(sw)}/><rect x="1215" y="820" width="18" height="130" fill="#8B5A2B" ${contorno(5)}/><rect x="1425" y="820" width="18" height="130" fill="#8B5A2B" ${contorno(5)}/></g>`;
  // mesinha com o pote do coração
  s += `<rect x="840" y="800" width="200" height="22" rx="6" fill="#8B5A2B" ${contorno(sw)}/><rect x="860" y="820" width="16" height="110" fill="#8B5A2B" ${contorno(5)}/><rect x="1004" y="820" width="16" height="110" fill="#8B5A2B" ${contorno(5)}/>`;
  s += `<path d="M940 800 C 880 760 880 700 915 690 C 930 686 940 700 940 708 C 940 700 950 686 965 690 C 1000 700 1000 760 940 800Z" fill="#D6F1FF" fill-opacity=".7" ${contorno(5)}/>
    <ellipse cx="992" cy="790" rx="16" ry="11" fill="#FFD447" ${contorno(4)}/><circle cx="870" cy="792" r="7" fill="#FF8FB1" ${contorno(3)}/><circle cx="885" cy="794" r="6" fill="#7FB3FF" ${contorno(3)}/>`;
  // vagalumes
  for (let i = 0; i < 8; i++) { const x = 100 + rnd(i) * 800 + Math.sin(t * .8 + i) * 40, y = 700 + rnd(i + 5) * 120 + Math.cos(t * 1.1 + i) * 30;
    s += `<circle cx="${x}" cy="${y}" r="${5 + 3 * Math.sin(t * 4 + i * 2)}" fill="#F7FF8A" opacity="${.5 + .5 * Math.sin(t * 4 + i * 2)}"/>`; }
  return s;
}

// ---------------------------- vila de Betânia (livro antigo) ----------------------------
function betania(t) {
  const sw = 3.5;
  let s = `<defs><linearGradient id="ceuB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3D9A4"/><stop offset="1" stop-color="#F8E9CC"/></linearGradient>
    <filter id="graoB" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .28  0 0 0 0 .15  0 0 0 .2 0"/></filter></defs>`;
  s += `<rect x="-400" y="-300" width="2720" height="1700" fill="url(#ceuB)"/>`;
  s += `<circle cx="1600" cy="190" r="80" fill="#F4C76B" opacity=".85"/>`;
  s += `<path d="M-400 560 Q200 450 800 520 T2320 500 V1400 H-400Z" fill="#B9B27A" ${ctB(sw)}/>`;
  // casinhas ao fundo
  for (const [x, w, h, c] of [[120, 220, 170, '#E6C79A'], [380, 180, 220, '#D9B07C'], [1380, 240, 180, '#E6C79A'], [1660, 200, 240, '#D4A373']]) {
    s += `<rect x="${x}" y="${600 - h}" width="${w}" height="${h}" fill="${c}" ${ctB(sw)}/><path d="M${x - 8} ${600 - h} h${w + 16}" stroke="#8B5A2B" stroke-width="10"/>
      <path d="M${x + w / 2 - 22} 600 V${560} a22 22 0 0 1 44 0 V600Z" fill="#7A4A2A" ${ctB(sw)}/><rect x="${x + 22}" y="${600 - h + 40}" width="30" height="30" fill="#5A3B28" opacity=".7"/>`;
  }
  // palmeira
  s += `<path d="M1240 620 Q1230 450 1270 330" fill="none" stroke="#8B5A2B" stroke-width="22" stroke-linecap="round"/>
    ${[-60, -20, 20, 60, 100, 150].map(a => `<path d="M1270 330 q${Math.cos(rad(a)) * 80} ${-30 + Math.sin(rad(a)) * 40} ${Math.cos(rad(a)) * 150 + Math.sin(t + a) * 4} ${Math.sin(rad(a)) * 90 + 30}" fill="none" stroke="#6E8B3D" stroke-width="16" stroke-linecap="round"/>`).join('')}`;
  // pátio da casa de Marta: chão, muro, forno de barro, potes, tapete
  s += `<path d="M-400 640 H2320 V1400 H-400Z" fill="#DCC08E" ${ctB(sw)}/>`;
  for (let i = 0; i < 40; i++) s += `<ellipse cx="${rnd(i) * 1900}" cy="${700 + rnd(i + 40) * 340}" rx="${10 + rnd(i + 2) * 14}" ry="5" fill="#C9A874" opacity=".7"/>`;
  s += `<rect x="-400" y="600" width="560" height="120" fill="#E3C391" ${ctB(sw)}/><rect x="1760" y="600" width="600" height="120" fill="#E3C391" ${ctB(sw)}/>`;
  s += `<path d="M120 900 Q120 760 220 760 Q320 760 320 900Z" fill="#B0703F" ${ctB(sw)}/><path d="M190 900 V840 a30 30 0 0 1 60 0 V900Z" fill="#3a2418"/>
    <circle cx="220" cy="${860 - Math.sin(t * 6) * 4}" r="${8 + Math.sin(t * 9) * 2}" fill="#FF9F43" opacity=".9"/>
    <path d="M220 750 q-14 -30 4 -50 q16 -20 -2 -48" fill="none" stroke="#9E9E9E" stroke-width="6" stroke-linecap="round" opacity=".5"/>`;
  for (const [x, h, c] of [[1720, 120, '#A0522D'], [1800, 90, '#B5651D'], [1650, 70, '#C2643C']])
    s += `<path d="M${x - 32} ${900 - h} Q${x - 50} ${900 - h * .4} ${x - 26} 900 H${x + 26} Q${x + 50} ${900 - h * .4} ${x + 32} ${900 - h}Z" fill="${c}" ${ctB(sw)}/><ellipse cx="${x}" cy="${900 - h}" rx="26" ry="7" fill="#5A3B28"/>`;
  s += `<ellipse cx="1000" cy="960" rx="420" ry="70" fill="#A63D32" ${ctB(sw)}/><ellipse cx="1000" cy="960" rx="340" ry="52" fill="none" stroke="#E9C46A" stroke-width="8" stroke-dasharray="20 14"/>`;
  s += `<rect x="-400" y="-300" width="2720" height="1700" filter="url(#graoB)"/>`;
  return s;
}
