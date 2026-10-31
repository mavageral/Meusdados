#!/usr/bin/env node
// Abre uma página no Chromium (Playwright) em celular e desktop, tira screenshots e aponta problemas.
// Uso: node ferramentas/verificar-pagina.js caminho/index.html [pasta-de-saida]
// Sai com código 1 se encontrar erro grave (erro de JS ou rolagem lateral).

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const alvo = process.argv[2];
if (!alvo) {
  console.error('Uso: node ferramentas/verificar-pagina.js caminho/index.html [pasta-de-saida]');
  process.exit(1);
}
const url = /^https?:/.test(alvo) ? alvo : 'file://' + path.resolve(alvo);
const saida = process.argv[3] || path.join(require('os').tmpdir(), 'verificacao');
fs.mkdirSync(saida, { recursive: true });

const tamanhos = [
  { nome: 'celular', width: 390, height: 844 },
  { nome: 'desktop', width: 1280, height: 800 }
];

(async () => {
  const browser = await chromium.launch();
  let graves = 0;
  for (const t of tamanhos) {
    const page = await browser.newPage({ viewport: { width: t.width, height: t.height } });
    const erros = [];
    page.on('pageerror', e => erros.push(e.message));
    page.on('console', m => m.type() === 'error' && erros.push(m.text()));
    await page.goto(url, { waitUntil: 'networkidle' }).catch(e => erros.push(e.message));
    await page.waitForTimeout(800);

    const r = await page.evaluate(() => {
      const vis = el => {
        const b = el.getBoundingClientRect(), s = getComputedStyle(el);
        return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0;
      };
      const rotulo = el => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 40);
      const clicaveis = [...document.querySelectorAll('a[href], button, [role="button"], input, select, textarea')].filter(vis);
      const pequenos = clicaveis.filter(el => {
        const b = el.getBoundingClientRect();
        return b.width < 44 && b.height < 44 && !el.closest('nav, p, li');
      }).map(rotulo);
      const semNome = clicaveis.filter(el =>
        (el.tagName === 'BUTTON' || el.tagName === 'A') && !el.textContent.trim() && !el.getAttribute('aria-label') && !el.getAttribute('title')
      ).length;
      const imgsSemAlt = [...document.images].filter(i => !i.hasAttribute('alt')).length;
      const textoMiudo = [...document.querySelectorAll('body *')].filter(el =>
        vis(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 11
      ).length;
      return {
        largura: document.documentElement.scrollWidth,
        pequenos: [...new Set(pequenos)].slice(0, 8),
        semNome, imgsSemAlt, textoMiudo,
        temViewport: !!document.querySelector('meta[name="viewport"]')
      };
    });

    const arq = path.join(saida, `${t.nome}.png`);
    await page.screenshot({ path: arq, fullPage: true });

    const rolagem = r.largura > t.width;
    graves += erros.length + (rolagem ? 1 : 0);
    console.log(`\n## ${t.nome} ${t.width}×${t.height} → ${arq}`);
    console.log(`${rolagem ? '✗' : '✓'} rolagem lateral: largura ${r.largura}px`);
    console.log(`${erros.length ? '✗' : '✓'} erros de JS/console: ${erros.length ? erros.slice(0, 5).join(' | ') : 'nenhum'}`);
    console.log(`${r.pequenos.length ? '!' : '✓'} alvos de toque < 44px: ${r.pequenos.length ? r.pequenos.join(', ') : 'nenhum'}`);
    console.log(`${r.semNome ? '!' : '✓'} botões/links sem nome acessível: ${r.semNome}`);
    console.log(`${r.imgsSemAlt ? '!' : '✓'} imagens sem alt: ${r.imgsSemAlt}`);
    console.log(`${r.textoMiudo ? '!' : '✓'} textos menores que 11px: ${r.textoMiudo}`);
    if (t.nome === 'celular' && !r.temViewport && !/^https?:/.test(alvo)) {
      console.log('! sem <meta name="viewport"> (ok para Artifacts, que adicionam um; obrigatório em site próprio)');
    }
    await page.close();
  }
  await browser.close();
  console.log(graves ? `\n✗ ${graves} problema(s) grave(s).` : '\n✓ Nenhum problema grave.');
  process.exit(graves ? 1 : 0);
})();
