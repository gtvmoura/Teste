// Renderiza uma cena do episódio (ou prévias) a partir de <pasta>/<id>/dados.json e audio.wav
// Uso: node render_cena.js <pasta> <id> video             -> <pasta>/<id>/cena.mp4
//      node render_cena.js <pasta> <id> previa t1,t2,...  -> <pasta>/<id>/previa.png (folha de contato)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');

(async () => {
  const [pasta, id, modo, lista] = process.argv.slice(2);
  const dir = path.join(pasta, id);
  const dados = JSON.parse(fs.readFileSync(path.join(dir, 'dados.json')));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.log('ERRO na página:', e.message));
  await page.goto('file://' + path.join(__dirname, 'episodio.html'));
  await page.evaluate(d => { window.DADOS = d; }, dados);
  await page.evaluate(() => document.fonts.load('800 50px Baloo'));

  if (modo === 'previa') {
    const ts = lista ? lista.split(',').map(Number) : [...Array(12)].map((_, i) => (i + 0.5) * dados.fim / 12);
    const arqs = [];
    for (const t of ts) {
      await page.evaluate(t => render(t), t);
      const f = path.join(dir, `p_${t.toFixed(1)}.png`);
      await page.screenshot({ path: f }); arqs.push(f);
    }
    await browser.close();
    execFileSync('montage', [...ts.flatMap((t, i) => ['-label', `${t.toFixed(1)}s`, arqs[i]]), '-tile', '4x', '-geometry', '640x360+3+3', '-pointsize', '22', path.join(dir, 'previa.png')]);
    arqs.forEach(f => fs.unlinkSync(f));
    console.log(path.join(dir, 'previa.png')); return;
  }

  const fps = dados.fps, n = Math.round(dados.fim * fps);
  const saida = path.join(dir, 'cena.mp4');
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-i', path.join(dir, 'audio.wav'), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-r', String(fps), '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2', '-shortest', saida], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => render(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('pronto:', saida);
})();
