#!/usr/bin/env bash
# PostToolUse: depois de editar design-lab/tokens/temas.css, verifica o contraste WCAG de todos os temas.
# Se algum par reprovar, devolve exit 2 para o Claude ver o relatório e corrigir.
input=$(cat)
file=$(printf '%s' "$input" | python3 -I -c 'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("file_path",""))' 2>/dev/null)
case "$file" in
  *design-lab/tokens/temas.css) ;;
  *) exit 0 ;;
esac
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
if ! report=$(python3 -I "$root/ferramentas/contraste.py" "$root/design-lab/tokens/temas.css" 2>&1); then
  printf 'Contraste reprovado após editar temas.css:\n%s\n' "$report" >&2
  exit 2
fi
exit 0
