# YAAD1 — Arquitetura e especificação técnica

**Versão:** 1.0 — 27/11/2026  
**Princípio:** arquitetura pragmática, modular, testável, mobile-first e orientada a evidências.

---

## 1. Diretrizes de engenharia

1. Preservar a stack já implantada até a auditoria demonstrar motivo para mudar.
2. Separar interface, domínio, persistência, integrações e execução de IA.
3. Começar com monólito modular; extrair serviços independentes somente quando carga, isolamento, escalabilidade ou autonomia operacional justificarem.
4. Regras determinísticas sempre que possível; IA para interpretação, explicação, geração e recomendação.
5. IA nunca deve ser fonte única de verdade para notas, pontuação de domínio, regras de edital, prazo de candidatura ou status de pagamento.
6. Todas as mutações devem ser auditáveis, idempotentes e autorizadas.
7. A aplicação deve continuar útil em internet fraca e durante interrupções.
8. Nenhuma credencial de IA, banco privilegiado ou conector privado no cliente.
9. O conteúdo precisa ter proveniência, licença e versão.
10. A interface deve refletir o estado real do servidor e nunca fingir sincronização.

---

## 2. Arquitetura-alvo

```text
Mobile Web / PWA / Capacitor
        │
        ▼
Presentation Layer (React/TypeScript se compatível)
        │
        ├── Hoje / Agenda
        ├── Aprender / Sala de Aula
        ├── Game / Experiências
        ├── Alvo / ROTA / Oportunidades
        ├── Diário / Evolução
        └── Assistente C contextual
        │
        ▼
Application Layer (Use Cases / Command Handlers)
        │
        ├── StartActivity
        ├── PrepareLesson
        ├── SubmitLearningEvidence
        ├── EvaluateEvidence
        ├── ScheduleReview
        ├── RecalculateTrajectory
        ├── SearchOpportunities
        └── PrepareApplication
        │
        ├──────── Domain Layer ────────┐
        │                              │
        ▼                              ▼
PostgreSQL / Supabase            AI Orchestrator
RLS, Storage, Realtime           Provider Router
Audit Events                     Tools + Validators
Queues (if justified)            Independent Evaluators
        │                              │
        └──────────────┬───────────────┘
                       ▼
External Integrations
official sources · search · video/resource catalog · maps · vacancy providers · calendar
```

### Decisão estrutural

A interface atual pode ser migrada para React + TypeScript se o repositório confirmar que isso é viável e que a arquitetura atual não possui framework comparável. Se o site já usa outro framework maduro, não substituir apenas por preferência. O que é obrigatório é separar módulos e contratos, não usar uma marca específica de framework.

### Recomendação de módulos de código

```text
apps/
  web/                         # experiência web/PWA
  mobile/                      # apenas se houver cliente nativo separado; evitar duplicação
packages/
  domain/                      # tipos e regras de negócio puros
  contracts/                   # schemas de API/eventos
  design-system/               # tokens, componentes, estados e motion
  learning-engine/             # domínio de aprendizagem e evidências
  scheduling-engine/           # agenda e regras de capacidade
  game-engine/                 # mecânicas, quando entrar na fase de jogos
  ai-orchestration/             # interfaces, prompts versionados, validators
  integrations/                 # contratos/adapters de fornecedores
services/
  api/                          # servidor/API segura
  workers/                      # ingestão, geração, notificações, tarefas de fundo
  mcp/                          # servidor MCP opcional para agentes autorizados
docs/
  product/ architecture/ adr/ security/ runbooks/ research/
supabase/
  migrations/ tests/ functions/ # se Supabase confirmado
.claude/
  skills/ agents/ rules/         # workflows e especialistas do Claude Code
```

Não criar todos os diretórios como scaffolding sem necessidade. O desenho é lógico; a estrutura final deve seguir o repositório existente.

---

## 3. Stack recomendada (condicional à auditoria)

| Área | Recomendação | Condição/razão |
|---|---|---|
| Linguagem | TypeScript | Contratos e regras compartilhados entre cliente e servidor |
| UI | React ou framework já implantado | Componentização e interação complexa |
| PWA | Manifest + Service Worker + IndexedDB | App instalável e utilidade offline |
| Persistência | PostgreSQL/Supabase se já em uso | Dados relacionais, RLS, storage e auth |
| Backend | API server-side existente; Vercel Functions/Edge Functions se já implantadas | Não expor segredos e centralizar autorização |
| IA | Gateway de provedores com adaptadores | Claude principal, outros avaliadores/provedores como opção, sem acoplamento a um SDK único |
| Filas | Supabase Queues/pgmq se Supabase confirmado e tarefas justificarem | Ingestão, geração, verificação e notificações assíncronas |
| Busca semântica | Postgres FTS + pgvector se a necessidade justificar | RAG baseado em conteúdo aprovado |
| Sync | IndexedDB + outbox + API idempotente | Funcionar offline e sincronizar depois |
| Testes | Vitest/Jest conforme stack + Playwright + testes SQL/RLS | Unidade, contrato, E2E e autorização |
| App nativo | Capacitor depois da PWA estar estável | Reutiliza app web e habilita recursos nativos |

O documento oficial atual do Capacitor 8 descreve um runtime nativo multiplataforma para aplicações web com acesso a recursos de iOS e Android; push notification possui integração própria e configuração nativa. Não introduzir Capacitor antes de validar PWA, offline e fluxos principais. (Fontes no capítulo 15.)

---

## 4. Domínio e dados

### 4.1 Modelos principais

```typescript
export type ActivityVerification =
  | "acknowledgment"
  | "learning_evidence"
  | "deliverable"
  | "appointment"
  | "wellbeing";

export type ActivityStatus =
  | "planned"
  | "context_needed"
  | "ready"
  | "in_progress"
  | "evidence_submitted"
  | "evaluating"
  | "verified"
  | "partially_verified"
  | "declared_only"
  | "evaluation_pending"
  | "blocked"
  | "skipped";

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  goalType: "primary" | "front" | "aspiration";
  status: "active" | "paused" | "achieved" | "archived";
  targetDate?: string;
  priority: number;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledActivity {
  id: string;
  userId: string;
  goalIds: string[];
  subjectId?: string;
  title: string;
  category: string;
  verification: ActivityVerification;
  status: ActivityStatus;
  startsAt: string;
  endsAt: string;
  timezone: string;
  expectedMinutes?: number;
  completionPolicyId: string;
  createdBy: "user" | "planner" | "assistant";
  revision: number;
}

export interface LearningEvidence {
  id: string;
  userId: string;
  sessionId: string;
  conceptIds: string[];
  evidenceType:
    | "self_explanation"
    | "worked_problem"
    | "transfer_task"
    | "artifact"
    | "oral_explanation"
    | "simulation";
  artifactRefs: string[];
  learnerResponse?: string;
  rubricId: string;
  status: "submitted" | "validating" | "accepted" | "partial" | "needs_revision" | "pending_human";
  evaluatorVersion?: string;
  confidence?: number;
  createdAt: string;
}

export interface OpportunityRecord {
  id: string;
  sourceId: string;
  externalId?: string;
  title: string;
  organization: string;
  city?: string;
  region?: string;
  description: string;
  officialUrl: string;
  publishedAt?: string;
  deadlineAt?: string;
  lastVerifiedAt: string;
  salaryText?: string;
  requirements: string[];
  barriers: string[];
  status: "open" | "closing" | "closed" | "unverified";
}
```

### 4.2 Tabelas sugeridas

- `profiles` — dados editáveis do perfil, preferências e timezone;
- `life_contexts` — momento de vida e restrições com data/consentimento;
- `goals` e `goal_links` — objetivos, frentes e relações;
- `goal_milestones` — marcos;
- `weekly_plans`, `scheduled_activities`, `activity_events` — agenda e execução;
- `subjects`, `concepts`, `concept_prerequisites` — mapa de conhecimento;
- `learning_programs`, `courses`, `lessons`, `lesson_versions` — currículo e aulas;
- `content_sources`, `content_assets`, `content_chunks` — proveniência/licença;
- `lesson_sessions`, `learning_evidence`, `assessment_attempts` — sessões e provas;
- `rubrics`, `misconceptions`, `error_cards` — critérios e Forja;
- `review_items` — estado FSRS por conceito/cartão;
- `competencies`, `competency_evidence` — Currículo Vivo;
- `opportunity_sources`, `opportunities`, `opportunity_snapshots` — origem e histórico;
- `applications`, `application_milestones` — candidaturas;
- `user_events` — ledger de eventos imutável/append-only;
- `ai_runs`, `ai_artifacts`, `ai_feedback`, `ai_proposals` — auditabilidade da IA;
- `device_sync_state`, `outbox_commands` — sync offline;
- `notification_preferences`, `notifications` — avisos com consentimento.

JSONB é adequado para blocos de conteúdo versionados e configurações flexíveis, não para substituir todas as relações por um documento gigante `M`.

### 4.3 Migração do estado legado

- Criar `LegacyProjectAdapter` que leia `main`, `d_YYYY-MM-DD`, revisões, frentes, metas e estado de projeto existentes.
- Importar para tabelas novas em processo idempotente, com `legacy_id` e `migration_batch_id`.
- Produzir relatório por registro: importado, duplicado, inválido, conflito ou pendente.
- Fazer backup antes de qualquer alteração.
- Não apagar nem modificar os dados antigos até validação e aceite explícito.
- Não sincronizar uma cópia completa de dados privados para analytics.

---

## 5. Agenda inteligente e motor de decisão

O planner é principalmente determinístico e auditável. IA pode propor ajustes, mas não deve rearranjar compromissos silenciosamente.

### Entradas

- blocos fixos e recorrentes;
- duração e janela temporal disponível;
- fuso horário;
- prioridades de metas e frentes;
- deadlines e dependências;
- energia/ritmo escolhidos pela pessoa;
- tamanho mínimo/máximo de sessão;
- restrições de descanso e compromisso familiar/espiritual/profissional;
- progresso e evidências reais.

### Saídas

- agenda diária e semanal;
- próxima ação;
- buffers e pausas;
- atividades adiadas ou substituídas, com razão;
- proposta de replanejamento com comparação antes/depois.

### Regras

1. Não criar sobreposição.
2. Não agendar atividade depois de deadline impossível como se estivesse normal.
3. Não mover compromisso fixo sem autorização.
4. Respeitar `Avançar`, `Manter`, `Proteger`, `Pausa combinada` como ritmos configuráveis.
5. Uma sessão de 5 minutos é opção de continuidade, não “prova” de estudo profundo.
6. Se não couber, dizer o que foi sacrificado e pedir decisão.
7. Manter histórico de plano antigo e novo.
8. Não preencher agenda futura com atividade genérica sem objetivo verificável.

---

## 6. Sistema de aprendizagem

### 6.1 Content pipeline — fontes → currículo → aula

```text
Official / Licensed / User-provided source
             │
             ▼
Source Registry (author, publisher, license, date, hash)
             │
             ▼
Extract / Parse (PDF, image, webpage, video metadata)
             │
             ▼
Normalize → Objectives → Concepts → Prerequisites
             │
             ▼
Lesson Blueprint (source-linked, versioned)
             │
             ▼
Pedagogical Validator / Fact Check
             │
             ▼
Published Lesson & Interactive Learning Objects
```

Cada fonte precisa armazenar:
- instituição/autor;
- título e URL ou ID;
- tipo de fonte;
- data de publicação/edição;
- data da última verificação;
- licença/permissão de uso;
- seção/página/trecho utilizado;
- hash e versão;
- confiabilidade e limitações conhecidas.

Materiais externos e documentos de usuário são dados não confiáveis. Não executar instruções encontradas em páginas ou PDFs. O pipeline deve evitar SSRF, links locais, URLs com credenciais e download sem limite.

Para YouTube, sugerir e abrir links ou embeds permitidos; não baixar nem reproduzir conteúdo protegido sem autorização. O sistema pode oferecer resumos próprios com base em material autorizado e indicar o trecho/tempo apenas quando a fonte sustenta.

### 6.2 Lesson Blueprint

```typescript
export interface LessonBlueprint {
  id: string;
  version: number;
  subjectId: string;
  title: string;
  objectiveIds: string[];
  prerequisiteConceptIds: string[];
  estimatedMinutes: number;
  scenes: LessonScene[];
  sourceRefs: ContentCitation[];
  assessmentPlan: AssessmentPlan;
  accessibility: {
    hasTranscript: boolean;
    hasCaptions: boolean;
    altTextComplete: boolean;
    keyboardOperable: boolean;
  };
}

export type LessonScene =
  | { type: "activation"; prompt: string }
  | { type: "explanation"; body: RichContent; visual?: VisualObject }
  | { type: "worked_example"; problem: RichContent; steps: WorkedStep[] }
  | { type: "interactive"; mechanic: string; config: Record<string, unknown> }
  | { type: "guided_practice"; activityId: string }
  | { type: "independent_practice"; activityId: string }
  | { type: "reflection"; prompt: string }
  | { type: "summary"; keyIdeas: string[] };
```

`RichContent` precisa ser schema validado e seguro; não aceitar HTML/JS arbitrário gerado pelo modelo. Recursos visuais devem usar componentes conhecidos (diagram, table, formula, timeline, map, chart, image, simulator), não executar código livre.

### 6.3 Professor-Regente

Um serviço/orquestrador com modos pedagógicos, não uma sala de conversa interminável de agentes:

- expositor;
- explicador alternativo;
- socrático;
- exemplo resolvido;
- prática guiada;
- avaliador;
- revisor.

O professor recebe somente o contexto necessário: objetivo, nível/evidências, plano da aula, fontes aprovadas, pergunta atual, acessibilidade e estado da sessão.

A resposta deve poder apresentar fonte, incerteza, pré-requisito e explicação alternativa. A voz é opcional, com texto equivalente. O aluno pode pausar, retomar, mudar de formato e escrever no quadro/caderno.

### 6.4 Evidência e avaliação

Não existe um percentual único válido para todos os tipos de conhecimento. Cada objetivo tem uma rubrica:

- correção conceitual;
- procedimento;
- justificativa;
- aplicação em novo contexto;
- consistência ao longo do tempo;
- autonomia e uso de pistas.

A avaliação de IA deve retornar evidências e justificativas alinhadas a uma rubrica, não uma nota arbitrária. Cálculos verificáveis devem usar funções determinísticas. Conteúdos de alto impacto devem exigir double-check, referência ou revisão humana.

Se o avaliador falhar:
- não inventar nota;
- preservar a resposta enviada;
- marcar `evaluation_pending`;
- mostrar que a sincronização/avaliação será retomada;
- não transformar falha de API em aprovação.

### 6.5 Recuperação e FSRS

- Usar implementação FSRS mantida e testar contra versão definida.
- Armazenar estado de cada cartão/conceito e histórico de revisão.
- Misturar recuperação livre, itens de aplicação e explicação do raciocínio.
- Atualizar dificuldade/estabilidade com respostas válidas.
- Não tratar taxa de acerto recente como conhecimento estável.
- Permitir revisão diária breve, semanal e por edital/objetivo.

---

## 7. Oportunidades reais

Oportunidade não é um card gerado. É um registro rastreável e temporal.

Cada resultado deve ter:
- fonte e link oficial;
- entidade responsável;
- data da publicação;
- data da última verificação;
- prazo e status;
- localidade/modalidade;
- remuneração/benefícios quando publicados;
- requisitos obrigatórios e desejáveis;
- custos/documentos/obstáculos de acesso;
- data de prova/etapas;
- explicação de aderência e lacunas;
- relação com alvo e competências;
- observação de incerteza.

O Radar deve deduplicar por ID, URL canônica, entidade, título, localidade e intervalo de datas. Não mostrar vaga fechada como aberta. Não afirmar cobertura completa de município/estado. Mostrar horário de verificação.

### Fontes e integrações

- Gupy e outras fontes apenas por canais permitidos e condições de uso vigentes;
- editais em páginas oficiais;
- diários oficiais/Querido Diário se API e cobertura forem comprovadas;
- SINE/Emprega Brasil não devem ser tratados como API pública disponível sem verificação;
- rotas/distância por serviço geográfico dedicado; distância em linha reta não equivale a tempo de viagem.

O website precisa executar a busca no servidor; o código atual tem um caminho de busca server-side que retorna string vazia e o PDF aponta mapas/Gupy pendentes para o site. Esse gap é bloqueador para considerar Radar online completo.

---

## 8. Inteligência multi-modelo: governança, não espetáculo

### Componentes

- `AIProvider` — adaptador para cada provedor de modelo;
- `ModelRouter` — seleciona modelo por tarefa, risco, custo e latência;
- `TaskOrchestrator` — coordena execução com estado persistido;
- `PromptRegistry` — prompts versionados por tarefa;
- `SchemaValidator` — valida entradas/saídas com schema versionado;
- `EvidenceChecker` — confere fatos, cálculos e citações;
- `HumanApprovalGate` — exige confirmação para ações externas/sensíveis;
- `AITraceStore` — registra modelo, versão, custo, ferramentas e resultado;
- `FeedbackLoop` — armazena correções e propõe melhoria de prompt/política com aprovação.

### Papéis especializados opcionais

1. `source_researcher` — busca e resume fontes, sem alterar dados.
2. `lesson_designer` — converte objetivos e fonte em blueprint de aula.
3. `fact_checker` — verifica fontes, datas, cálculos e alegações.
4. `learning_assessor` — avalia evidências por rubrica.
5. `trajectory_planner` — propõe plano e trade-offs.
6. `opportunity_analyst` — compara vaga/edital com perfil real.

Eles não devem ser instâncias independentes que cada uma decide por conta própria. O orquestrador possui estado e seleciona papel conforme a tarefa. O mesmo resultado não exige debate de todos os modelos.

### Ferramentas/ações com permissão

| Classe | Exemplo | Regra |
|---|---|---|
| Read-only | ler agenda, perfil permitido, fontes | pode executar após auth |
| Propose | mover bloco, criar plano, preparar candidatura | sempre apresenta diff/resumo |
| User-confirmed write | aplicar mudança de agenda, marcar marco, salvar dado | confirmar antes de persistir |
| Sensitive external | enviar candidatura, assinar, pagar, publicar dados | aprovação explícita em contexto e resumo final |
| Forbidden by default | revelar segredo, executar código arbitrário, enviar dado privado a URL externa | bloquear |

### MCP

MCP é interface para agentes autorizados, não transporte de interações da UI. API é o contrato operacional do app. O servidor MCP deve chamar os mesmos casos de uso e serviços com identidade e permissões verificadas.

Ferramentas candidatas:
- `get_user_trajectory_context`
- `get_today_actions`
- `get_learning_goals`
- `get_verified_lesson_sources`
- `prepare_lesson`
- `submit_learning_evidence`
- `get_review_due_items`
- `propose_schedule_change`
- `search_verified_opportunities`
- `prepare_application_draft`

Não expor `service_role`, secrets, SQL raw ou função genérica `execute_anything` ao modelo.

---

## 9. API de domínio (contrato sugerido)

Rotas podem seguir REST se esse for o padrão do repositório.

```http
GET    /api/v1/today
GET    /api/v1/schedule?from=&to=
POST   /api/v1/activities/:id/start
POST   /api/v1/activities/:id/acknowledge
POST   /api/v1/activities/:id/evidence
POST   /api/v1/activities/:id/complete
POST   /api/v1/schedule/recalculate/propose
POST   /api/v1/schedule/recalculate/apply

GET    /api/v1/learning/subjects
GET    /api/v1/learning/subjects/:id/concepts
POST   /api/v1/learning/sessions
POST   /api/v1/learning/sessions/:id/lesson-plan
POST   /api/v1/learning/sessions/:id/events
POST   /api/v1/learning/sessions/:id/evidence
POST   /api/v1/learning/evidence/:id/evaluate
GET    /api/v1/learning/reviews/due
POST   /api/v1/learning/reviews/:id/grade
GET    /api/v1/learning/forja

GET    /api/v1/goals
POST   /api/v1/goals
GET    /api/v1/opportunities
GET    /api/v1/opportunities/:id
POST   /api/v1/opportunities/:id/front-proposal
POST   /api/v1/applications/:id/prepare

POST   /api/v1/assistant/turns
POST   /api/v1/assistant/proposals/:id/approve
POST   /api/v1/assistant/proposals/:id/reject
```

Os nomes finais devem acompanhar as convenções já existentes. Nunca publicar API por preferência sem auditar endpoint/SDK atual.

### Eventos de domínio

Exemplos:
- `ActivityStarted`
- `ActivityEvidenceSubmitted`
- `ActivityVerified`
- `LessonPrepared`
- `LessonSceneCompleted`
- `MisconceptionDetected`
- `ReviewScheduled`
- `ReviewCompleted`
- `GoalProgressUpdated`
- `OpportunityVerified`
- `ScheduleProposalCreated`
- `ScheduleProposalApplied`
- `LifeContextChanged`

Cada evento tem `eventId`, `userId`, `occurredAt`, `schemaVersion`, `source`, `correlationId`, `idempotencyKey` e payload mínimo. Eventos não devem conter dados sensíveis desnecessários.

---

## 10. Offline, persistência e sincronização

### Requisitos

- a home, agenda, aulas já baixadas, caderno e atividades leves abrem offline;
- o usuário consegue registrar estudo offline sem perder conteúdo;
- comandos locais entram numa outbox IndexedDB;
- cada comando possui idempotency key;
- sync envia por ordem de dependência e recebe status do servidor;
- conflito entre dois dispositivos é resolvido por regra explícita, nunca por overwrite silencioso;
- a UI informa sincronização e recuperação.

### Estratégia

- Service Worker: cache de shell, assets e recursos explicitamente escolhidos;
- IndexedDB/Dexie: estado local de agenda, sessões e outbox;
- servidor: fonte de verdade para dados sincronizados;
- `sync_version`/`revision` para concorrência otimista;
- filas para jobs assíncronos, quando justificadas.

---

## 11. Segurança e LGPD

- RLS habilitada em todas as tabelas expostas; testar grants e políticas por operação, não confiar só em auth.
- MFA para operações/configurações de maior risco, se exigido pelo perfil de ameaça.
- storage privado com URL assinada e curta duração.
- Segredos somente no servidor.
- validação MIME e tamanho de arquivo; varredura de uploads quando aplicável.
- conteúdo externo tratado como dado não confiável (anti prompt-injection).
- allowlist ou política de URL e bloqueio de IP privado/local para fetchers.
- rate limit, limite diário de gastos, quotas por usuário e kill switch de IA.
- logging sem conteúdo pessoal integral quando não necessário.
- consentimento e finalidade para dados pessoais e memória de IA.
- exportação e exclusão de dados conforme LGPD.
- não usar câmera, áudio, comportamento ou inferência emocional para medir esforço/atenção.
- não usar resultados como diagnóstico psicológico/cognitivo.

---

## 12. Design system e UX

### Direção

**Dark premium, editorial-tech, acolhedora, viva e precisa.** Não cyberpunk genérico, não dashboard bancário, não painel administrativo.

### Tokens iniciais (validar com design)

```css
:root {
  --color-bg: #07090E;
  --color-surface: #10141D;
  --color-surface-raised: #171D28;
  --color-text: #F4F6FA;
  --color-muted: #9AA4B5;
  --color-accent: #FF6A1A; /* C / próxima ação */
  --color-success: #5EE6A0;
  --color-warning: #FFC24B;
  --color-danger: #FF6B81;
  --radius-card: 22px;
  --tap-min: 44px;
}
```

A paleta deve ser refinada com contraste WCAG AA. O gradiente por área de estudo pode existir, mas a cor nunca deve ser a única forma de comunicar significado.

### Componentes essenciais

- `NextActionHero`
- `DailyTimeline` (zoom acessível)
- `GoalBridgeChip`
- `LearningSessionCard`
- `LessonSceneRenderer`
- `InteractiveBoard`
- `EvidenceComposer`
- `AssessmentFeedback`
- `ForjaReviewCard`
- `OpportunityCard` com proveniência
- `GoalConstellation`
- `AssistantOrb` + painel contextual
- `SyncStatusIndicator`
- `LifeChangeProposal`

### Motion

- entrada e transição rápidas, com spring leve;
- brilho/pulso restrito ao elemento prioritário;
- animação de progresso somente em eventos reais;
- `prefers-reduced-motion` respeitado;
- evitar movimento contínuo e partículas como decoração permanente.

### Acessibilidade

- WCAG 2.2 AA como alvo;
- navegação teclado;
- VoiceOver/TalkBack labels;
- transcript e captions para áudio/vídeo;
- contraste e zoom do sistema;
- foco visível e ordem lógica;
- não depender de pinch, cor, som ou animação como único meio de uso.

---

## 13. Testes e qualidade

### Pirâmide

1. Unitários: regras ROTA, scheduler, estados, FSRS wrapper, políticas de evidência.
2. Contrato: payloads API/MCP e schemas IA.
3. Integração: DB/RLS, storage, outbox, workers e adapters.
4. E2E real: fluxo Hoje → estudo → aula → evidência → avaliação → revisão → meta.
5. Smoke no staging com provedores/serviços reais (chaves de teste e limites).
6. Acessibilidade automatizada + revisão manual.
7. Resiliência: offline, timeout, falha do modelo, duplicidade, conflito, rate limit e retry.

### Viewports mínimos

- 360×800
- 375×812
- 390×844
- 430×932
- 768×1024
- 1280×800

### Critérios de aceite de integração

- não vale teste apenas com mock para declarar API integrada;
- cada serviço externo precisa de contrato e smoke test no staging;
- teste deve provar o fallback e o estado de erro;
- medir a sincronização real e comportamento offline;
- 100% das tabelas expostas com RLS/grants testados;
- falha de IA não promove usuário nem perde resposta;
- conteúdo gerado com citações verificáveis e esquema validado.

---

## 14. Primeira fatia vertical

### Feature: “Meu próximo estudo”

1. `Today` carrega próximo bloco e razão.
2. O aluno toca `Começar`; atividade passa a `in_progress`.
3. Informa assunto/fonte ou envia foto/arquivo.
4. O serviço de ingestão cria um contexto de estudo; aluno confirma extração.
5. O Teacher Orchestrator gera `LessonBlueprint` referenciado e validado.
6. O app renderiza cenas visuais e materiais.
7. O aluno interage com quadro, demonstração e treino.
8. O aluno explica com suas palavras e envia evidências.
9. O Assessment Engine avalia rubrica; falha gera pendência, não nota inventada.
10. Erro detectado cria cartão Forja e programa revisão.
11. Uma competência ligada ao objetivo recebe evidência.
12. A agenda atualiza; fechamento do dia sintetiza somente atividades reais.
13. Na abertura seguinte, o aluno faz recuperação ativa do conteúdo anterior.

### Teste de aceitação do fluxo

- iniciar atividade sem assunto → solicita contexto, não gera aula genérica silenciosamente;
- anexar imagem → extrai e pede confirmação de leitura;
- IA indisponível → estado claro e sessão salva como pendente;
- fechar e reabrir → retoma etapa e respostas;
- enviar evidência duas vezes → idempotente, sem duplicar progresso;
- resposta correta em alternativa com justificativa errada → não atribuir domínio automático;
- finalizar → meta e revisão atualizadas somente após validação;
- dia seguinte → revisão recupera conceitos estudados e suas evidências.

---

## 15. Fontes técnicas atuais consultadas

- Claude Code — instruções, skills, subagents, hooks e organização de customização: https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more
- Claude Code — uso de subagents e limites de delegação: https://claude.com/resources/articles/subagents-in-claude-code
- Figma MCP para Claude Code: https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server
- Figma MCP FAQ (o servidor fornece contexto estruturado, o agente escreve código; não é conversão mágica de design): https://help.figma.com/hc/en-us/articles/39252411778583-Figma-MCP-server-FAQs
- Supabase RLS (grants + policies + testes por tabela): https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Queues / pgmq (mensageria durável para processos de fundo): https://supabase.com/docs/guides/queues
- Capacitor 8: https://capacitorjs.com/docs
- Capacitor Push Notifications: https://next.capacitorjs.com/docs/apis/push-notifications
- PWA offline e Service Worker: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation

As versões, permissões e disponibilidade dos serviços devem ser novamente verificadas no momento da implementação. O uso de biblioteca ou plataforma acima é recomendação condicionada à auditoria, não decisão de stack já aprovada.
