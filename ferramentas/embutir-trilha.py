"""Valida o curso do IBGE (projetos/sala-caverna/conteudo/trilha-ibge/*.json) e o embute no app.
Uso: python3 -I ferramentas/embutir-trilha.py [--so-validar]
O conteúdo fica entre os marcadores TRILHA-IBGE no index.html, como <script type="application/json" id="trilha-ibge">."""
import json, sys, os, collections
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(RAIZ, "projetos/sala-caverna/conteudo/trilha-ibge")
APP = os.path.join(RAIZ, "projetos/sala-caverna/index.html")
ORDEM = [("tec", ["tecnicos-1.json", "tecnicos-2.json"]), ("mat", ["matematica.json"]), ("por", ["portugues.json"])]
INI, FIM = "<!-- TRILHA-IBGE:INICIO -->", "<!-- TRILHA-IBGE:FIM -->"

def validar():
    erros, dados, ids, letras = [], {}, set(), collections.Counter()
    for disc, arqs in ORDEM:
        dados[disc] = []
        for a in arqs:
            with open(os.path.join(PASTA, a), encoding="utf-8") as f:
                dados[disc] += json.load(f)
    extra_p = os.path.join(PASTA, "tecnicos-extra.json")
    if os.path.exists(extra_p):
        with open(extra_p, encoding="utf-8") as f: extra = json.load(f)
        for L in dados["tec"]:
            L["qs"] = L["qs"] + extra.get(L["id"], [])
        sobra = set(extra) - {L["id"] for L in dados["tec"]}
        if sobra: erros.append(f"questões extras para aulas inexistentes: {sobra}")
    for disc, ls in dados.items():
        for L in ls:
            i = L.get("id", "?")
            if i in ids: erros.append(f"{i}: id repetido")
            ids.add(i)
            if L.get("disc") != disc: erros.append(f"{i}: disc {L.get('disc')} no arquivo de {disc}")
            for k in ("titulo", "nivel", "porque", "blocos", "exemplos", "pegadinhas", "resumo", "qs"):
                if not L.get(k): erros.append(f"{i}: falta {k}")
            if disc == "tec" and not L.get("pag"): erros.append(f"{i}: aula técnica sem página da apostila")
            qs = L.get("qs", [])
            if len(qs) not in (5, 10): erros.append(f"{i}: {len(qs)} questões (esperado 5 ou 10)")
            vistos = [q.get("p", "").strip().lower() for q in qs]
            if len(set(vistos)) != len(vistos): erros.append(f"{i}: enunciado repetido")
            for n, q in enumerate(qs, 1):
                o = q.get("o", [])
                if len(o) != 5: erros.append(f"{i} q{n}: {len(o)} alternativas")
                if len(set(x.strip().lower() for x in o)) != len(o): erros.append(f"{i} q{n}: alternativas repetidas")
                if not isinstance(q.get("c"), int) or not 0 <= q["c"] < len(o): erros.append(f"{i} q{n}: gabarito inválido")
                else: letras["ABCDE"[q["c"]]] += 1
                if not q.get("e"): erros.append(f"{i} q{n}: sem comentário")
                if q.get("nv") not in (1, 2, 3): erros.append(f"{i} q{n}: nível inválido")
    return dados, erros, letras

def main():
    dados, erros, letras = validar()
    n = sum(len(v) for v in dados.values())
    print(f"{n} aulas ({', '.join(f'{k}: {len(v)}' for k, v in dados.items())}), {sum(letras.values())} questões")
    print("gabaritos por letra:", dict(sorted(letras.items())))
    if erros:
        print("\n".join("ERRO " + e for e in erros)); sys.exit(1)
    if "--so-validar" in sys.argv: return
    txt = json.dumps(dados, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    bloco = f'{INI}\n<script type="application/json" id="trilha-ibge">{txt}</script>\n{FIM}'
    with open(APP, encoding="utf-8") as f: s = f.read()
    if INI in s:
        a, b = s.index(INI), s.index(FIM) + len(FIM)
        s = s[:a] + bloco + s[b:]
    else:
        assert "\n<script>\n" in s, "não achei o <script> principal do app"
        s = s.replace("\n<script>\n", "\n" + bloco + "\n<script>\n", 1)
    ap = os.path.join(RAIZ, "projetos/sala-caverna/conteudo/apostila-ibge/apostila.json")
    if os.path.exists(ap):
        with open(ap, encoding="utf-8") as f: A = json.load(f)
        assert len(A.get("paginas", [])) > 50, "apostila incompleta"
        atxt = json.dumps(A, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
        ab = f'<!-- APOSTILA-IBGE:INICIO -->\n<script type="application/json" id="apostila-ibge">{atxt}</script>\n<!-- APOSTILA-IBGE:FIM -->'
        if "<!-- APOSTILA-IBGE:INICIO -->" in s:
            a2, b2 = s.index("<!-- APOSTILA-IBGE:INICIO -->"), s.index("<!-- APOSTILA-IBGE:FIM -->") + len("<!-- APOSTILA-IBGE:FIM -->")
            s = s[:a2] + ab + s[b2:]
        else:
            s = s.replace(FIM, FIM + "\n" + ab, 1)
        print(f"apostila: {len(A['paginas'])} páginas ({len(atxt)//1024} KB)")
    with open(APP, "w", encoding="utf-8") as f: f.write(s)
    print(f"embutido em {os.path.relpath(APP, RAIZ)} ({len(txt)//1024} KB)")

if __name__ == "__main__":
    main()
