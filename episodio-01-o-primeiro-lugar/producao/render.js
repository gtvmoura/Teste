// Renderiza cena.html quadro a quadro e monta o MP4 com o áudio.
// Uso: node render.js <pasta_trabalho> <saida.mp4> [t_inicio t_fim]  (sem t: cena inteira)
//      node render.js <pasta_trabalho> --previa t1,t2,...           (só PNGs de conferência)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

(async () => {
  const [pasta, saida, a, b] = process.argv.slice(2);
  const dados = JSON.parse(fs.readFileSync(path.join(pasta, 'dados.json')));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(__dirname, 'cena.html'));
  await page.evaluate(d => { window.DADOS = d; }, dados);
  await page.evaluate(() => document.fonts.load('800 50px Baloo'));

  if (saida === '--previa') {
    for (const t of a.split(',').map(Number)) {
      await page.evaluate(t => render(t), t);
      await page.screenshot({ path: path.join(pasta, `previa_${t.toFixed(1)}.png`) });
    }
    await browser.close(); return;
  }

  const fps = dados.fps, t0 = a ? Number(a) : 0, t1 = b ? Number(b) : dados.fim;
  const n = Math.round((t1 - t0) * fps);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-ss', String(t0), '-t', String(t1 - t0), '-i', path.join(pasta, 'audio.wav'),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', saida], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => render(t), t0 + i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 48 === 0) process.stdout.write(`quadro ${i}/${n}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('pronto:', saida);
})();
