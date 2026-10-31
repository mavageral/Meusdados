#!/usr/bin/env node
// Lê um arquivo .fig (zip exportado ou fig-kiwi puro) e resume cores, fontes, tamanhos e telas.
// Uso: node ferramentas/figma/figdump.js arquivo.fig [--json] [--thumb pasta-de-saida]
// Primeira vez: npm install --prefix ferramentas/figma

const fs = require('fs');
const path = require('path');
const { unzipSync, inflateSync } = require('fflate');
const { decompress: zstd } = require('fzstd');
const kiwi = require('kiwi-schema');

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
const asJson = args.includes('--json');
const thumbDir = args.includes('--thumb') ? args[args.indexOf('--thumb') + 1] : null;
if (!file) {
  console.error('Uso: node figdump.js arquivo.fig [--json] [--thumb pasta]');
  process.exit(1);
}

let buf = fs.readFileSync(file);
let meta = null;

// .fig exportado pelo app vem como zip: canvas.fig + meta.json + thumbnail.png + images/
if (buf[0] === 0x50 && buf[1] === 0x4b) {
  const z = unzipSync(buf);
  if (z['meta.json']) meta = JSON.parse(Buffer.from(z['meta.json']).toString());
  if (thumbDir && z['thumbnail.png']) {
    fs.mkdirSync(thumbDir, { recursive: true });
    fs.writeFileSync(path.join(thumbDir, 'thumbnail.png'), z['thumbnail.png']);
  }
  buf = Buffer.from(z['canvas.fig']);
}

if (buf.subarray(0, 8).toString() !== 'fig-kiwi') {
  console.error('Formato não reconhecido (esperava "fig-kiwi").');
  process.exit(1);
}

const chunks = [];
for (let off = 12; off < buf.length;) {
  const n = buf.readUInt32LE(off);
  off += 4;
  chunks.push(buf.subarray(off, off + n));
  off += n;
}
const unpack = c => (c[0] === 0x28 && c[1] === 0xb5 && c[2] === 0x2f && c[3] === 0xfd) ? zstd(c) : inflateSync(c);
const schema = kiwi.compileSchema(kiwi.decodeBinarySchema(unpack(chunks[0])));
const msg = schema.decodeMessage(unpack(chunks[1]));
const nodes = msg.nodeChanges || [];

const key = g => g && `${g.sessionID}:${g.localID}`;
const byId = new Map(nodes.map(n => [key(n.guid), n]));
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const count = (o, k) => { o[k] = (o[k] || 0) + 1; };
const top = (o, k) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, k);

const colors = {}, fonts = {}, sizes = {}, radii = {}, screens = [];
for (const n of nodes) {
  for (const f of n.fillPaints || []) {
    if (f.type === 'SOLID' && f.visible !== false && f.color && (f.opacity ?? 1) > 0.3) count(colors, hex(f.color));
    if (f.type && f.type.startsWith('GRADIENT') && f.stops) count(colors, 'gradiente ' + [...new Set(f.stops.map(s => hex(s.color)))].join('→'));
  }
  if (n.fontName) count(fonts, `${n.fontName.family} ${n.fontName.style}`);
  if (n.fontSize) count(sizes, String(Math.round(n.fontSize)));
  if (n.cornerRadius) count(radii, String(Math.round(n.cornerRadius)));
  const parent = n.parentIndex && byId.get(key(n.parentIndex.guid));
  if (n.type === 'FRAME' && parent && parent.type === 'CANVAS' && n.size) {
    screens.push(`${n.name} (${Math.round(n.size.x)}×${Math.round(n.size.y)})`);
  }
}

const out = {
  arquivo: meta?.file_name || path.basename(file),
  nos: nodes.length,
  cores: top(colors, 20),
  fontes: top(fonts, 10),
  tamanhos: top(sizes, 14),
  raios: top(radii, 8),
  telas: screens.slice(0, 80)
};

if (asJson) {
  console.log(JSON.stringify(out, null, 2));
} else {
  const fmt = arr => arr.map(([k, v]) => `${k} (${v})`).join(', ');
  console.log(`# ${out.arquivo}  (${out.nos} nós)`);
  console.log(`Cores: ${fmt(out.cores)}`);
  console.log(`Fontes: ${fmt(out.fontes)}`);
  console.log(`Tamanhos de fonte: ${fmt(out.tamanhos)}`);
  console.log(`Raios: ${fmt(out.raios)}`);
  console.log(`Telas (${screens.length}): ${out.telas.join(' | ')}`);
}
