#!/usr/bin/env bash
# Bloqueia edições nas referências pétreas e nos arquivos de design licenciados (regra da casa no CLAUDE.md).
entrada=$(cat)
arquivo=$(printf '%s' "$entrada" | python3 -I -c 'import json,sys; d=json.load(sys.stdin); print((d.get("tool_input") or {}).get("file_path",""))' 2>/dev/null)
case "$arquivo" in
  *design-lab/referencias-petreas.md|*design-lab/fontes-privadas/*)
    echo "Este arquivo é protegido (referências pétreas ou design licenciado). Só altere com pedido explícito do Renner; peça a ele que confirme." >&2
    exit 2 ;;
esac
exit 0
