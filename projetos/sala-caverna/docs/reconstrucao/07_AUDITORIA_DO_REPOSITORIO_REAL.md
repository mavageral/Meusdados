# Auditoria do repositório real (27/11/2026)

Esta é a Fase 0 do plano de reconstrução (`03_PLANO_DE_EXECUCAO_CLAUDE_CODE.md`), feita no repositório e não só no HTML anexado. Tudo o que aparece como "verificado" foi observado em execução nesta sessão. O que não foi observado aparece com outro status.

## 1. Stack encontrada

| Peça | O que é | Onde |
|---|---|---|
| App | Um arquivo HTML autocontido (cerca de 890 KB), sem framework e sem build | `projetos/sala-caverna/index.html` |
| Runtime A | Artifact do claude.ai, com as capacidades `sample`, `db`, `user`, `mcp`, `assets`, `downloads`, `dictation` e `tts` | https://claude.ai/artifact/5HB7Qx6NTyuqaV4qxNxhgS |
| Runtime B | Site na Vercel: o mesmo HTML, mais `yaad1-shim.js`, que imita `window.claude.use` | `projetos/yaad1-site/` (gerado por `ferramentas/build-site.py`) |
| Servidor | `api/claude.js` (Anthropic SDK, com web_search e web_fetch) e `api/manter.js` (tarefa diária) | Vercel Functions |
| Banco | Supabase "yaad1" (sa-east-1): `user_docs` com RLS, `app_owner`, `ai_usage`, `registrar_uso()`, bucket privado `fotos` e MFA com sessão aal2 | `projetos/yaad1-site/supabase/schema.sql` |
| Testes | Bateria Playwright com IA, conectores, ditado e voz simulados, em 375 e 390 px | `ferramentas/testes/yaad1.test.js` |
| Qualidade | `checar-sintaxe.py` (hook a cada edição), revisores `revisor-ui` e `revisor-seguranca`, e as skills `testar-yaad1`, `publicar-yaad1` e as duas do pacote | `.claude/` |

**Decisão:** a stack é preservada. Não há package.json no app, nem React ou TypeScript. Migrar para React, TypeScript e PWA é uma decisão de arquitetura e está registrada como pendente no item 4.

## 2. Matriz de capacidades

| Capacidade | Status | Evidência |
|---|---|---|
| Fluxo de estudo (aula, foco, explicação, prova, Forja, revisão) | verificado com IA simulada | bateria de testes |
| Correção aberta com IA indisponível | **corrigido em 27/11** | antes dava 0,5 de nota. Agora fica "correção pendente", sem aprovação, e sobrevive a fechar e retomar (teste "Correção pendente…") |
| Gravação na nuvem com falha | **corrigido em 27/11** | antes o `catch` era vazio. Agora aparece um aviso visível, com até 4 novas tentativas e um botão para tentar de novo (mesmo teste) |
| Revisões FSRS-4.5 | verificado (intervalos e teto na data da prova) | teste "FSRS" |
| Radar: busca (Parallel Search) | parcial | conector usado no Artifact. No site, a busca é do servidor e depende da chave da IA |
| Radar: Gupy | verificado no Artifact, em chamada real de 27/11 (83 vagas em RR) | indisponível no site (servidor ainda sem a ferramenta) |
| Radar: distância e mapa (TomTom) | verificado no Artifact, em chamada real (Iracema → Caracaraí, 43 km) | indisponível no site |
| IA no site | **indisponível** | falta `ANTHROPIC_API_KEY` na Vercel. O endpoint responde `no_ai` |
| Login, MFA e RLS no site | configurado. Não houve teste A/B com duas contas nesta sessão | `schema.sql`. O teste de isolamento continua pendente |
| GAME: Operação Cidade, missão 03 | **novo, verificado** | jogo completo sem IA, com regras determinísticas, retomada e evidências na Forja, na revisão, no Currículo vivo e nas conquistas |
| Jogos Relâmpago, Pares e Linha do tempo | verificado com IA simulada | conteúdo com verificação dupla |
| Notificações | indisponível | só arquivo .ics com alarme. Web Push depende do PWA |
| Offline | parcial | `localStorage` com a cópia local e nova tentativa de envio. Não há IndexedDB nem service worker |

## 3. Defeitos do documento 05 e situação

| Item do 05 | Situação |
|---|---|
| A. Gravação sem confirmação | corrigido (aviso e novas tentativas). O outbox em IndexedDB fica para a migração |
| B. Nota neutra quando o avaliador falha | corrigido e testado |
| C. Dependência do runtime | o shim do site já cobre. Falta a chave da IA |
| D. Conteúdo sem registro de proveniência | aberto. Hoje: verificação dupla e marcação "gabarito não conferido". O Content Registry fica para a migração |
| E. Sala Viva só textual | parcial. Há quadro com linhas, vozes e pausas. Faltam componentes de cena (fórmula, gráfico, simulação) |
| F. Busca vazia no site | aberto. Depende da chave e de levar Gupy e TomTom ao servidor |
| G. Perfil pessoal embutido | aberto. **Depende de decisão da dona** (tirar `perfilBase`/`NAME_DEFAULT` do código e passar para o perfil da conta) |
| Deriva de datas (Serasa e dia X) | o "dia X" já é calculado. O marco da Serasa depende da dona confirmar a inscrição |

## 4. Decisões que dependem da dona

1. **Migração de stack:** continuar no arquivo único (rápido, funciona no Artifact) ou migrar por fatias para TypeScript, React e PWA no site, com o Artifact como versão "leve". O próprio pacote recomenda migração progressiva e só depois do gate da Fase 0.
2. **Perfil pessoal fora do código** (item G).
3. **Chave da IA na Vercel:** sem ela, o site não ensina nem busca.
