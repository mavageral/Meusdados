#!/usr/bin/env python3
"""Gera projetos/yaad1-site/index.html a partir do app (projetos/sala-caverna/index.html).
O app continua sendo um arquivo só; o site acrescenta o Supabase e a ponte de login (yaad1-shim.js)."""
import pathlib, sys
raiz = pathlib.Path(__file__).resolve().parent.parent
app = (raiz / "projetos/sala-caverna/index.html").read_text(encoding="utf-8")
cabeca = """<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#05060A">
<meta name="description" content="Yaad1: um alvo, um caminho. O app de direção que traça a sua rota e organiza a sua rotina de estudos.">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js"></script>
<script src="/yaad1-shim.js"></script>
"""
marca = "</style>"
if app.count(marca) < 1: sys.exit("não achei o </style> do app")
i = app.index(marca) + len(marca)
html = cabeca + app[:i] + "\n</head><body>" + app[i:] + "\n</body></html>\n"
destino = raiz / "projetos/yaad1-site/index.html"
destino.write_text(html, encoding="utf-8")
print("site gerado:", destino.relative_to(raiz), len(html), "bytes")
