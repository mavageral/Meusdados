# YAAD1 — Pacote de reconstrução

Este pacote reúne a análise dos materiais fornecidos, a direção de produto, a arquitetura-alvo e as instruções para continuar o trabalho no Claude Code.

## Arquivos

1. `01_DIAGNOSTICO_E_VISAO_MESTRA.md` — o que existe, o que falhou, o que preservar e o produto que devemos construir.
2. `02_ARQUITETURA_E_ESPECIFICACAO_TECNICA.md` — arquitetura, dados, IA, aprendizagem, APIs, segurança e tecnologia.
3. `03_PLANO_DE_EXECUCAO_CLAUDE_CODE.md` — plano incremental com tarefas e critérios de aceitação.
4. `04_PROMPT_INICIAL_CLAUDE_CODE.md` — texto para iniciar a missão no Claude Code.
5. `05_AUDITORIA_DO_HTML_E_DADOS_DE_ENTRADA.md` — pontos concretos do código legado e correções temporais do Projeto Caverna.
6. `CLAUDE.md` — instruções persistentes sugeridas para a raiz do repositório.
7. `.claude/skills/yaad1-product-guardrails/SKILL.md` — skill local para impedir regressão de produto/UX.
8. `.claude/skills/yaad1-delivery-workflow/SKILL.md` — skill local para disciplinar análise, implementação e validação.
9. `06_ECOSISTEMA_CLAUDE_CODE_FIGMA_E_SKILLS.md` — recomendações práticas para Figma MCP, Claude Code, Superpowers e MagicPath.

## Como usar

1. Faça backup do repositório real e do banco. Não sobrescreva o HTML original.
2. Coloque `CLAUDE.md` e a pasta `.claude/skills/` na raiz do repositório real.
3. Copie a pasta `docs/` para o repositório, sem substituir documentos existentes; mescle se já houver arquivos com o mesmo nome.
4. Abra Claude Code na raiz do repositório.
5. Anexe também `Yaad1.html`, `Yaad1-apresentacao-completa.pdf` e a montagem de telas original, ou disponibilize-os no repositório em uma pasta de referências.
6. Cole `04_PROMPT_INICIAL_CLAUDE_CODE.md` como primeira missão.
7. Autorize primeiro auditoria e plano. Não autorize migração destrutiva, publicação ou troca de stack sem revisão.

## Limite desta análise

A análise foi feita sobre o PDF de apresentação, o HTML anexado, a imagem composta de telas e o briefing textual desta conversa. Não tive acesso ao repositório Git real, ao projeto Vercel, ao Supabase, ao banco de produção, às variáveis de ambiente nem ao histórico completo de deploy. Portanto, este pacote não afirma que a implantação atual foi auditada ou que os conectores descritos no PDF estão funcionando hoje. Claude Code deve verificar isso no ambiente real antes de implementar.
