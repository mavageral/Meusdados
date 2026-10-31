#!/usr/bin/env python3
"""Lê um arquivo .sketch (zip com JSON) e resume cores, fontes, tamanhos e artboards.

Uso: python3 -I ferramentas/sketchdump.py arquivo.sketch [--thumb pasta-de-saida]
"""
import collections
import json
import os
import sys
import zipfile


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    path = args[0]
    thumb = args[args.index('--thumb') + 1] if '--thumb' in args else None

    colors, fonts, sizes, boards = collections.Counter(), collections.Counter(), collections.Counter(), []

    def walk(o):
        if isinstance(o, dict):
            cls = o.get('_class')
            if cls == 'color' and o.get('alpha', 1) > 0.3:
                colors['#%02X%02X%02X' % tuple(round(o[k] * 255) for k in ('red', 'green', 'blue'))] += 1
            elif cls == 'fontDescriptor':
                a = o.get('attributes', {})
                fonts[a.get('name')] += 1
                sizes[a.get('size')] += 1
            elif cls == 'artboard':
                f = o.get('frame', {})
                boards.append(f"{o.get('name')} ({round(f.get('width', 0))}×{round(f.get('height', 0))})")
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)

    with zipfile.ZipFile(path) as z:
        for name in z.namelist():
            if name.startswith('pages/') and name.endswith('.json'):
                walk(json.loads(z.read(name)))
        if thumb and 'previews/preview.png' in z.namelist():
            os.makedirs(thumb, exist_ok=True)
            with open(os.path.join(thumb, 'preview.png'), 'wb') as fh:
                fh.write(z.read('previews/preview.png'))

    fmt = lambda c, n: ', '.join(f'{k} ({v})' for k, v in c.most_common(n))
    print(f'# {os.path.basename(path)}')
    print('Cores:', fmt(colors, 20))
    print('Fontes:', fmt(fonts, 10))
    print('Tamanhos de fonte:', fmt(sizes, 14))
    print(f'Artboards ({len(boards)}):', ' | '.join(boards[:80]))


if __name__ == '__main__':
    main()
