"""Confere se o JavaScript embutido no app (scripts sem src) continua válido.
Uso: python3 -I ferramentas/checar-sintaxe.py [caminho/do/index.html]
Sai com código 1 e mostra o erro se o código não compila. Um erro desses deixa o app em branco."""
import re, subprocess, sys, tempfile, os
alvo = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "projetos", "sala-caverna", "index.html")
html = open(alvo, encoding="utf-8").read()
blocos = [m.group(1) for m in re.finditer(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, re.S)]
ok = True
for i, js in enumerate(blocos):
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(js); nome = f.name
    r = subprocess.run(["node", "--check", nome], capture_output=True, text=True)
    os.unlink(nome)
    if r.returncode != 0:
        ok = False
        print(f"ERRO de sintaxe no script {i+1} de {alvo}:\n{r.stderr.strip()[:1500]}", file=sys.stderr)
print(f"{len(blocos)} script(s) verificados: {'ok' if ok else 'COM ERRO'}")
sys.exit(0 if ok else 1)
