# YAAD1 — Ecossistema de ferramentas, Claude Code, Figma e skills

**Objetivo:** usar agentes e conectores para aumentar a qualidade sem criar uma colcha de retalhos de ferramentas.

## 1. O que foi identificado nesta sessão

- Figma está conectado nesta conversa do ChatGPT.
- MagicPath está conectado nesta conversa do ChatGPT.
- Superpowers está conectado nesta conversa do ChatGPT.
- O catálogo de skills visível nesta sessão não apresentou uma skill com o nome exato `claude-code-setup`.

Importante: uma conexão feita ao ChatGPT não instala automaticamente o mesmo plugin/MCP dentro do ambiente local de Claude Code. Claude Code precisa da sua própria instalação, autenticação e permissões.

## 2. Figma MCP no Claude Code — recomendado para design-to-code

A documentação atual do Figma orienta usar o servidor remoto para a maioria dos usuários. O endpoint é `https://mcp.figma.com/mcp`; o guia oficial específico do Claude Code também descreve a instalação do plugin Figma.

Opção recomendada (plugin Figma para Claude Code):

```bash
claude plugin install figma@claude-plugins-official
```

Depois, reinicie Claude Code, abra o gerenciador `/plugin`, selecione Figma e autentique. Alternativa manual:

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Em seguida, inicie uma nova sessão, execute `/mcp` e autentique.

### Como usar no Yaad1

1. Criar um arquivo Figma do Yaad1 com páginas: Foundations, Components, Today, Learning, Lesson, Evidence, Forja, Goals, Opportunities e Diary.
2. Criar tokens de cor, tipografia, espaçamento, raios, elevação, motion e estados.
3. Criar variantes responsivas (mobile primeiro) e estados `default`, `active`, `loading`, `offline`, `syncing`, `error`, `empty` e `disabled`.
4. Conectar o design system ao contexto do Claude Code pelo MCP.
5. Implementar por fluxo, não por screenshot isolado.
6. Comparar implementação com Figma e testar em viewport real.
7. Devolver telas implementadas ao Figma como documentação e rastreabilidade, se o plano/permissão permitir.

O MCP do Figma fornece contexto estruturado (componentes, variáveis, layouts, seleção e conteúdo) ao agente. Não transforma automaticamente um frame em software perfeito; Claude Code continua responsável por escrever, adaptar e validar o código. Essa distinção precisa ser preservada.

## 3. Superpowers

As skills relevantes conectadas na conversa incluem:

- `brainstorming` — esclarecer objetivo e opções antes de trabalho grande;
- `writing-plans` — decompor execução em tarefas pequenas com teste;
- `test-driven-development` — teste falha antes do código;
- `dispatching-parallel-agents` — auditorias realmente independentes;
- `requesting-code-review` / `receiving-code-review` — revisão técnica;
- `verification-before-completion` — só afirmar conclusão após rodar verificações.

Se Superpowers também estiver instalado no Claude Code, use essas skills. Se não estiver, o pacote deste projeto já inclui duas skills locais específicas do Yaad1 (`yaad1-product-guardrails` e `yaad1-delivery-workflow`) para manter regras de produto e qualidade.

Não assuma que a conexão de Superpowers no ChatGPT habilita os comandos/skills no Claude Code. Verifique `/plugin`, o diretório `.claude/skills/` e a configuração local.

## 4. MagicPath

MagicPath é útil para exploração rápida de experiências e protótipos visuais no canvas conectado ao ChatGPT. Eu o usaria para testar ideias de interação, fluxos e composição antes de comprometer um design de produção.

Não o colocaria como dependência do runtime do Yaad1, banco de dados, pipeline de conteúdo ou mecanismo de IA em produção. A aplicação deve continuar funcionando sem MagicPath.

## 5. Skills internas que o Yaad1 deve manter

Este pacote contém:

- `.claude/skills/yaad1-product-guardrails/SKILL.md`
- `.claude/skills/yaad1-delivery-workflow/SKILL.md`

Criar outras somente quando houver um processo repetido que mereça um workflow dedicado:

- `design-system-implementation` — tokens, componentes, estados e auditoria visual;
- `learning-content-pipeline` — fonte, licença, extração, lesson blueprint e validação;
- `supabase-security-review` — RLS, grants, MFA, storage, edge auth e testes;
- `opportunity-verification` — fonte oficial, prazo, deduplicação, status e data de checagem;
- `mobile-e2e` — device/viewport/offline e acessibilidade.

Não criar uma skill para cada pequena função. Skill demais pode aumentar contexto e gerar regras duplicadas.

## 6. Subagents e governança

Usar no máximo papéis com fronteiras claras e tarefas read-only no início:

| Agente | Pergunta | Saída |
|---|---|---|
| Product/UX Auditor | Onde o fluxo atual exige esforço ou confunde? | jornada e recomendações priorizadas |
| Architecture Auditor | Como o repo e serviços realmente funcionam? | mapa de arquitetura e riscos |
| Security Auditor | Onde há vazamento, autorização fraca ou prompt injection? | findings com severidade e reprodução |
| Learning Engineer | O fluxo comprova aprendizagem ou só atividade? | critérios, rubricas e desenho da aula |
| Integration Auditor | Quais APIs/MCPs realmente funcionam no site? | matriz live/mock/unavailable |

O agente principal reconcilia os resultados. Não permitir que subagents alterem os mesmos arquivos em paralelo nem deixar agentes conversando sem um objetivo mensurável.

## 7. Pipeline de qualidade

```text
Issue / user need
      ↓
Product Guardrails
      ↓
Read-only audit / subagents
      ↓
ADR + implementation plan
      ↓
Figma design context (when UI changes)
      ↓
TDD → implementation → refactor
      ↓
Typecheck + lint + unit + integration
      ↓
Playwright mobile + a11y + offline + security
      ↓
Staging smoke test with real integrations
      ↓
Independent review
      ↓
Human approval for deploy / migrations
```

## 8. Fontes oficiais consultadas

- Anthropic: métodos de customização do Claude Code — https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more
- Anthropic: uso de subagents — https://claude.com/resources/articles/subagents-in-claude-code
- Figma: configurar MCP com Claude Code — https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server
- Figma: o que o MCP entrega e o que continua sendo responsabilidade do agente — https://help.figma.com/hc/en-us/articles/39252411778583-Figma-MCP-server-FAQs
