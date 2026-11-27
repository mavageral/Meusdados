#!/usr/bin/env bash
# Depois de editar o app do Yaad1, confere se o JavaScript embutido continua válido (erro de sintaxe deixa o app em branco).
entrada=$(cat)
arquivo=$(printf '%s' "$entrada" | python3 -I -c 'import json,sys; d=json.load(sys.stdin); print((d.get("tool_input") or {}).get("file_path",""))' 2>/dev/null)
case "$arquivo" in
  *projetos/sala-caverna/index.html)
    if ! saida=$(python3 -I "$CLAUDE_PROJECT_DIR/ferramentas/checar-sintaxe.py" "$arquivo" 2>&1); then
      echo "O app do Yaad1 ficou com erro de sintaxe depois desta edição. Corrija antes de seguir:" >&2
      echo "$saida" >&2
      exit 2
    fi ;;
esac
exit 0
