# YAAD1 — Plano de execução para Claude Code

> **Para agentes implementadores:** usar TDD, tarefas pequenas, revisão independente e evidência de execução. Não iniciar produção sem a auditoria e a aprovação da direção de produto.

**Objetivo:** reconstruir Yaad1 por migração progressiva e entregar o primeiro fluxo vertical completo de direção + aprendizagem + evidência + revisão.  
**Arquitetura:** preservar a stack implantada; separar domínio, UI, APIs, IA e integrações; coexistir temporariamente com o HTML legado; migrar por módulos verificáveis.  
**Stack:** conforme auditoria; TypeScript/React/PWA/Postgres/Supabase são alvos condicionais, não pressupostos.  
**Especificação:** `docs/02_ARQUITETURA_E_ESPECIFICACAO_TECNICA.md`.

## Restrições globais

- Nunca apagar ou sobrescrever `Yaad1.html` original.
- Fazer backup antes de alteração de banco ou migração de dados.
- Não vazar perfil da idealizadora para o cliente ou repositório público.
- Não usar IA sem chave/serviço de forma silenciosa.
- Falha de avaliação não pode virar nota neutra nem aprovação.
- Toda gravação deve expor estado de sincronização/erro.
- Toda mudança de agenda deve ter diff e consentimento.
- Nenhuma ação externa sensível sem consentimento explícito.
- Nenhum dado de oportunidade sem fonte/data/status de verificação.
- Nenhum recurso visual pode ser apenas decoração sem função/usabilidade.
- Nenhuma tela principal pode virar mural de texto.

## Foco de revisão

1. Perda ou duplicação de dados durante sincronização e retomada de sessão.
2. Usuário sem internet ou com internet instável.
3. Modelo de IA indisponível, output inválido, timeout ou conteúdo inseguro.
4. Isolamento RLS entre duas contas, inclusive arquivos privados.
5. Atividade não realizada, parcialmente realizada, interrompida ou declarada sem evidência.

---

## Fase 0 — Inventário e auditoria do sistema real

### Tarefa 0.1 — Identificar repositório e stack

- [ ] Inspecionar arquivos, package manager, scripts, frameworks, rotas, build e deploy.
- [ ] Identificar Vercel/Functions, Supabase, tabelas, migrations, RLS, buckets, APIs e secrets configurados (nunca imprimir valores secretos nos relatórios).
- [ ] Identificar MCPs, skills, plugin configs, `CLAUDE.md`, hooks e testes disponíveis.
- [ ] Mapear o HTML anexado com o que existe no repositório. Não assumir que é o mesmo commit/deploy.
- [ ] Registrar versões e status atual dos testes/build.

**Saída:** `docs/audit/BASELINE.md`, mapa de rotas, dependências, integrações e riscos.

### Tarefa 0.2 — Verificar funcionalidades no ambiente real

- [ ] Testar login, logout, MFA, persistência local/remota e backup com conta de teste.
- [ ] Testar chamada real à IA e comportamento com chave ausente/limite atingido.
- [ ] Verificar funções de pesquisa, leitura de página, Gupy e mapas no site, não só no Artifact.
- [ ] Verificar .ics/notificações e limites por dispositivo.
- [ ] Comparar os resultados com o PDF e marcar `verified`, `partial`, `mocked`, `unavailable` ou `unknown`.

**Saída:** `docs/audit/CAPABILITY_MATRIX.md`.

### Tarefa 0.3 — Inventário e backup de dados

- [ ] Exportar modelo atual e amostra sanitizada de dados.
- [ ] Documentar `main`, `d_YYYY-MM-DD`, `revisoes`, `frentes`, projetos e anexos.
- [ ] Não copiar dados pessoais para logs ou docs versionados.
- [ ] Definir plano de rollback.

**Saída:** `docs/audit/LEGACY_DATA_MAP.md` e backup validado.

**Gate:** apresentar baseline e riscos antes de scaffolding, migrações ou mudança de stack.

---

## Fase 1 — Design e contratos do novo fluxo

### Tarefa 1.1 — Design tokens e componentes

- [ ] Identificar tokens e componentes reutilizáveis existentes.
- [ ] Mapear os componentes da direção visual: preto profundo, laranja C, verde semântico, gradientes por área, cards de imagem, vidro contido.
- [ ] Criar tokens semânticos, estados, foco, acessibilidade e variantes mobile.
- [ ] Prototipar Hoje, sala de estudo e evidência primeiro.

**Saída:** design system e protótipo clicável revisável, alinhado à imagem de referência.

### Tarefa 1.2 — Contratos de domínio

- [ ] Definir tipos de Goal, Front, Schedule, Activity, LessonBlueprint, LearningEvidence, ReviewItem e Opportunity.
- [ ] Definir máquina de estados da atividade.
- [ ] Definir política de evidência por tipo.
- [ ] Definir evento e idempotency key.
- [ ] Criar schemas e testes de contratos.

**Saída:** `packages/contracts` ou local equivalente e diagramas versionados.

### Tarefa 1.3 — UX flows e acceptance tests

- [ ] Descrever fluxo normal, offline, falha de IA, retomada, interrupção, agenda alterada e erro de avaliação.
- [ ] Criar cenários E2E executáveis.
- [ ] Fazer teste de usabilidade rápido com a idealizadora e pelo menos 2–3 pessoas com perfis diversos antes de expandir.

**Gate:** só iniciar a fatia vertical depois que os contratos e os critérios estiverem claros.

---

## Fase 2 — Fundação de dados e persistência confiável

### Tarefa 2.1 — Data layer

- [ ] Implementar repositórios de domínio mantendo acesso ao banco fora de componentes de UI.
- [ ] Criar migrations aditivas.
- [ ] Habilitar RLS e grants para cada tabela exposta.
- [ ] Criar testes que comprovem allow/deny para select/insert/update/delete em papéis diferentes.
- [ ] Implementar storage privado e URL assinada, se necessário.

### Tarefa 2.2 — Sync/outbox

- [ ] Implementar armazenamento local persistente em IndexedDB.
- [ ] Criar fila de comandos offline com idempotency key.
- [ ] Mostrar `offline`, `saving`, `saved`, `sync_error` e `conflict`.
- [ ] Implementar retry e resolução de conflito explícita.
- [ ] Testar duplo toque, retry e reabertura.

### Tarefa 2.3 — Adaptador de dados legados

- [ ] Criar importador idempotente e não destrutivo.
- [ ] Mapear legado para esquema novo.
- [ ] Produzir relatório de registros importados/conflitados/ignorados.
- [ ] Validar totais e amostra manual antes de usar novo sistema como principal.

**Gate:** persistência e migração precisam estar verificadas antes de ligar o diário novo.

---

## Fase 3 — Primeiro fluxo vertical: Hoje → Aprender → Evidência

### Tarefa 3.1 — Tela Hoje

- [ ] Saudação/data/fase/contexto da meta.
- [ ] Um único NextActionHero.
- [ ] Próximos 2–3 itens em resumo.
- [ ] Fita temporal com níveis Hoje/Dia/Semana/Projeto, suporte a pinça e controles acessíveis.
- [ ] Estado de sincronização persistente.
- [ ] C contextual.

### Tarefa 3.2 — Activity Runtime

- [ ] Começar atividade e persistir evento.
- [ ] Distinguir acknowledgment, learning, deliverable, appointment e wellbeing.
- [ ] Permitir pausa/retomada.
- [ ] Simples: confirmação direta, sem prova desnecessária.
- [ ] Estudo: exige contexto antes de gerar uma aula.

### Tarefa 3.3 — Ingestão de material de estudo

- [ ] Aceitar assunto, texto, link, imagem e PDF dentro de limites.
- [ ] Validar formato/tamanho e armazenar privadamente.
- [ ] Extrair informação com OCR/vision/parsing conforme serviço real.
- [ ] Mostrar resumo da extração e permitir correção do aluno.
- [ ] Não tratar o material como instrução executável.

### Tarefa 3.4 — Aula estruturada

- [ ] Criar LessonBlueprint schema.
- [ ] Criar pipeline de fonte e citação.
- [ ] Gerar objetivo, ativação, explicação, exemplo, visual, prática e síntese.
- [ ] Renderizar cenas por componentes: texto, fórmula, tabela, diagrama, imagem, vídeo linkado, simulação.
- [ ] Salvar progresso por cena e retomar.

### Tarefa 3.5 — Prática e evidência

- [ ] Solicitar explicação livre do aluno.
- [ ] Criar prática apropriada ao conceito (não só múltipla escolha).
- [ ] Avaliar por rubrica e critérios explícitos.
- [ ] Verificar saídas de IA e cálculos determinísticos.
- [ ] Se avaliador falhar: salvar evidência com `evaluation_pending`, sem aprovação automática.
- [ ] Permitir segunda tentativa com explicação de lacuna.

### Tarefa 3.6 — Meta, competência e próxima revisão

- [ ] Conectar estudo a meta/frente.
- [ ] Registrar evidência de competência, com grau de confiança e fonte.
- [ ] Criar cartão Forja para erro útil.
- [ ] Programar FSRS.
- [ ] Atualizar agenda somente com estados reais.

**Gate:** demo E2E no celular, com backend e serviço de IA reais em staging; sem mock como única prova.

---

## Fase 4 — Diário, revisão e Caverna

### Tarefa 4.1 — Revisão matinal

- [ ] Recuperar conteúdo de ontem.
- [ ] Misturar perguntas de recall, explicação e aplicação.
- [ ] Exibir gabarito e explicação.
- [ ] Atualizar Forja/FSRS.

### Tarefa 4.2 — Revisão semanal

- [ ] Segunda-feira (configurável) consolida conteúdos da semana anterior.
- [ ] Mapeia acertos, erros, tópicos frágeis e retenção.
- [ ] Gera plano da próxima semana como proposta.

### Tarefa 4.3 — Fechamento noturno

- [ ] Pendências com motivo sem julgamento.
- [ ] Recordação por tema estudado.
- [ ] Resumo produzido a partir do registro real e revisado pelo usuário.
- [ ] Nota/reflexão opcional.
- [ ] Síntese e próxima prioridade.
- [ ] Gratidão/oração opcional conforme perfil do usuário; não presumir prática religiosa para todos.

### Tarefa 4.4 — Perfil Caverna

- [ ] Migrar rotina, metas, estudos, ANBIMA, compromissos e datas para configuração da pessoa.
- [ ] Nenhum dado pessoal fixo no código.
- [ ] Exibir a ligação entre cada estudo e alvo/projeto.

---

## Fase 5 — Módulos de expansão

Executar em ondas separadas, cada uma com seu próprio plano:

1. Oportunidades e fontes oficiais, deduplicação, last-verified, alertas.
2. Leitura de edital e criação de frente.
3. Currículo Vivo e preparação de candidatura.
4. Simulados com questões autorizadas/oficiais, sem reproduzir material protegido indevidamente.
5. GAME com mecânicas além de quiz.
6. Comunidades/grupos somente após moderação, privacidade e segurança.
7. Capacitor/lojas após PWA estável.

---

## Fase 6 — IA, skills, agentes e qualidade contínua

### Tarefa 6.1 — AI gateway

- [ ] Interface por provedor.
- [ ] seleção de modelo por tarefa, risco, custo e disponibilidade.
- [ ] prompts versionados.
- [ ] schemas fortes.
- [ ] verificação independente para conteúdo de avaliação/oportunidade.
- [ ] trace de modelo, custo, tempo, input minimizado e resultado.
- [ ] rate limit e kill switch.

### Tarefa 6.2 — MCP

- [ ] Criar servidor com ferramentas específicas.
- [ ] Identidade do usuário derivada da sessão autenticada, nunca de `userId` arbitrário enviado pelo modelo.
- [ ] Ferramentas read/propose/apply separadas.
- [ ] Sem SQL livre ou segredo.
- [ ] Testes de autorização e prompt injection.

### Tarefa 6.3 — Claude Code

- [ ] `CLAUDE.md` curto, com mapa, comandos e políticas.
- [ ] Skills locais para product guardrails, TDD, migração de dados, UI review, segurança e testes E2E.
- [ ] Subagents read-only para auditorias paralelas: UX, backend, IA/segurança, conteúdo/educação.
- [ ] Hooks para rodar lint/test/schema checks antes de finalizar, sem criar loops.
- [ ] Se Superpowers estiver instalado no Claude Code, usar brainstorming/writing-plans/TDD/verification; não assumir que a conexão deste ChatGPT o instala automaticamente.
- [ ] Figma MCP somente depois de conectar/autorizar no Claude Code.

---

## Fase 7 — Release e validação real

- [ ] Testar em dispositivos Android reais, inclusive baixo custo.
- [ ] Testar 360–430px e tablet/desktop.
- [ ] Testar offline/online e perda de conexão durante envio.
- [ ] Testar conta A/B para provar isolamento.
- [ ] Executar RLS tests.
- [ ] Executar E2E com backend real.
- [ ] Fazer auditoria de custo/latência da IA.
- [ ] Fazer teste de acessibilidade WCAG 2.2 AA.
- [ ] Observar 2–4 semanas de uso real antes de anunciar sucesso do produto.
- [ ] Deploy apenas com autorização explícita.

---

## Critérios globais para declarar uma entrega funcional

- o usuário consegue executar a jornada no celular sem instrução verbal do criador;
- a tela indica a ação correta e a razão;
- toda conclusão tem o tipo de evidência correto;
- estado é preservado em refresh, fechamento e sincronização;
- falha de rede/IA é explícita e recuperável;
- dado sensível está isolado;
- a aula contém material útil e visual, não só texto longo;
- o app relaciona aprendizado, meta e oportunidade sem inventar ligação;
- os testes provam comportamento, não apenas renderização;
- o changelog e a documentação descrevem exatamente o que foi implementado.
