#!/usr/bin/env python3
"""Verifica o contraste WCAG de cada tema em design-lab/tokens/temas.css.

Uso: python3 -I ferramentas/contraste.py [caminho/temas.css]
Sai com código 1 se algum par reprovar.

Regras:
  texto principal e secundário sobre fundo e superfície ............ ≥ 4.5
  texto sobre o botão de destaque (on-accent / accent) ............. ≥ 4.5
  destaque sobre o fundo (ícones, barras, bordas de foco) .......... ≥ 3.0
Superfícies translúcidas (rgb(... / a)) são misturadas sobre --bg antes do cálculo.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'design-lab', 'tokens', 'temas.css')


def parse(value):
    value = value.strip()
    m = re.fullmatch(r'#([0-9A-Fa-f]{6})', value)
    if m:
        h = m.group(1)
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)), 1.0
    m = re.fullmatch(r'rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[/,]\s*([\d.]+))?\s*\)', value)
    if m:
        return tuple(int(m.group(i)) for i in (1, 2, 3)), float(m.group(4) or 1)
    return None


def blend(fg, bg):
    (c, a), (b, _) = fg, bg
    return tuple(round(c[i] * a + b[i] * (1 - a)) for i in range(3)), 1.0


def lum(rgb):
    out = []
    for x in rgb:
        x /= 255
        out.append(x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4)
    return 0.2126 * out[0] + 0.7152 * out[1] + 0.0722 * out[2]


def ratio(a, b):
    la, lb = lum(a[0]), lum(b[0])
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def main():
    css = open(CSS, encoding='utf-8').read()
    temas = re.findall(r'\[data-tema="([^"]+)"\]\s*\{(.*?)\n\}', css, re.S)
    falhas = 0
    for nome, corpo in temas:
        tok = {k: parse(v) for k, v in re.findall(r'--([\w-]+):\s*([^;]+);', corpo)}
        bg = tok.get('bg')
        if not bg:
            print(f'{nome:14} sem --bg sólido, ignorado')
            continue
        surface = tok.get('surface') or bg
        if surface[1] < 1:
            surface = blend(surface, bg)
        pares = [
            ('texto/fundo', 'text', bg, 4.5),
            ('texto/superfície', 'text', surface, 4.5),
            ('secundário/superfície', 'text-muted', surface, 4.5),
            ('secundário/fundo', 'text-muted', bg, 4.5),
            ('botão', 'on-accent', tok.get('accent'), 4.5),
            ('destaque/fundo', 'accent', bg, 3.0),
        ]
        linha = []
        for rotulo, chave, fundo, minimo in pares:
            cor = tok.get(chave)
            if not cor or not fundo:
                continue
            r = ratio(cor, fundo)
            ok = r >= minimo
            falhas += not ok
            linha.append(f"{rotulo} {r:.1f}{'' if ok else f' ✗ (mín {minimo})'}")
        print(f'{nome:14} ' + ' · '.join(linha))
    if falhas:
        print(f'\n{falhas} par(es) abaixo do mínimo WCAG AA.')
        sys.exit(1)
    print(f'\nOK: {len(temas)} temas passam no WCAG AA.')


if __name__ == '__main__':
    main()
