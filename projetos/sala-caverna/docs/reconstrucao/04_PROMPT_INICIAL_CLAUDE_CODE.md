# MISSÃO PRINCIPAL — RECONSTRUIR O YAAD1 PARA ACERTAR O ALVO

Você está trabalhando no produto **Yaad1 / IAD 1**. Leia integralmente antes de alterar qualquer código:

- `docs/01_DIAGNOSTICO_E_VISAO_MESTRA.md`
- `docs/02_ARQUITETURA_E_ESPECIFICACAO_TECNICA.md`
- `docs/03_PLANO_DE_EXECUCAO_CLAUDE_CODE.md`
- `CLAUDE.md`
- o PDF de apresentação Yaad1, o HTML legado e a captura visual de referência, se disponíveis no repositório/attachments.

## A missão

Não entregue outro HTML que reúna textos, botões e painéis. Não entregue apenas uma reformulação visual. Reconstrua o Yaad1 como um aplicativo de direção, aprendizagem e conquista no mundo real, cuja experiência diária coloca a ação, o ensino e a evidência no centro.

A tese é: **um alvo, um caminho. O Yaad1 entende a vida real, localiza oportunidades, organiza trajetórias, ensina o que falta, comprova evolução e recalcula o caminho quando a vida muda.**

O Projeto Caverna é a primeira trajetória real a ser suportada, mas o produto precisa continuar configurável para outros usuários e outros objetivos.

## O defeito a não repetir

O protótipo anterior falhou no uso porque obrigava a pessoa a navegar por várias funções e ler muitas informações para conseguir estudar e progredir. O app parecia um painel, não um mecanismo de aprendizagem. A nova versão precisa ser usada todos os dias porque algo concreto acontece dentro dela: começa uma atividade, recebe uma aula útil, pratica, explica, recebe feedback, registra evidência e entende como isso leva ao alvo.

## Regra zero: auditoria

Comece pela Fase 0 do plano:

1. Descubra qual é o repositório, stack e deployment reais.
2. Confirme se o HTML anexado corresponde ao código do repositório atual.
3. Inspecione Vercel/Supabase/IA/DB/RLS/storage/MCP/integrações/testes, sem expor secrets.
4. Diferencie funcionalidade real, simulada, parcial, indisponível e desconhecida.
5. Faça backup e mapeie o estado legado.
6. Não instale dependências nem troque stack antes de justificar tecnicamente.
7. Apresente `BASELINE.md`, `CAPABILITY_MATRIX.md`, mapa de dados e plano reversível.

Não diga que o app já usa uma API, conector ou integração porque ela está desenhada no PDF. Teste-a no ambiente real.

## Regras de produto obrigatórias

- Uma ação principal por tela.
- Tela Hoje mostra o que fazer agora; agenda completa e indicadores ficam em segundo plano.
- Mantenha a fita de evolução/zoom temporal, mas inclua controles acessíveis além de pinch.
- O C laranja é o assistente contextual, não um chatbot desconectado.
- Mantenha a identidade visual escura, laranja, verde semântico, gradientes contidos e profundidade premium da referência.
- Não lotar a tela com números, textos, badges ou cartões.
- Cada atividade tem sua política de verificação: confirmação simples, evidência de aprendizagem, entrega, compromisso ou bem-estar.
- Oração/refeição e outras tarefas simples podem ser confirmadas sem prova. Estudo não deve virar apenas botão “feito”.
- O fluxo de estudo deve conter material, explicação, exemplo visual/interativo, prática, explicação do aluno, avaliação e revisão.
- A falha da IA nunca pode gerar nota neutra ou aprovação automática.
- Mostrar `salvo`, `sincronizando`, `offline`, `não sincronizado` e `avaliação pendente` de maneira real.
- Conectar toda atividade a competência, meta ou oportunidade quando houver relação sustentada; nunca inventar nexo.
- Replanejamento de vida/agenda sempre mostra proposta e pede confirmação.
- Oportunidades mostram fonte, data de publicação/verificação, prazo, requisitos e link oficial.
- Não enviar candidatura, pagar, assinar ou publicar dados pessoais sem confirmação explícita.

## Direção de engenharia

- Preserve a stack implantada se ela for sustentável; se não, apresente ADR com alternativas, custo de migração, risco e benefício.
- Migre por fatias verticais; não jogue fora o HTML sem paridade funcional e estratégia de dados.
- Separe domain, UI, APIs, persistence, AI provider adapters e integrations.
- Comece com monólito modular, não microsserviços por moda.
- TypeScript é a linguagem preferencial se encaixar no projeto; não substitua stack madura sem prova.
- API é a interface operacional. MCP é uma camada de tools para agentes autorizados, não transporte de cada interação.
- Banco relacional para entidades e relações; JSONB para conteúdo estruturado flexível, não como um único estado gigante.
- Persistência local e outbox para offline; operações idempotentes e conflitos explícitos.
- RLS/grants testados em cada tabela exposta.
- Conteúdo externo é dado não confiável. Proteger contra prompt injection, SSRF, exfiltração e código arbitrário.
- Modelos de IA não aprendem automaticamente pesos porque conversam. Evolução do sistema deve ser versionada, avaliada e aprovada.

## Primeira entrega funcional

Priorize exclusivamente a primeira fatia vertical definida em `docs/02...` e `docs/03...`:

**Hoje → iniciar atividade → contexto do estudo → aula estruturada e visual → recursos/quadro → prática → explicação do aluno → avaliação válida → Forja/FSRS → atualização da meta/competência → fechamento → recordação na manhã seguinte.**

A primeira matéria pode ser Matemática, usando o conteúdo real/contexto que estiver configurado no perfil de teste, sem inventar dados atuais do Projeto Caverna.

## Design antes de código

- Reutilize tokens e componentes se existirem.
- Crie tela Hoje, espaço de estudo e sessão de aula antes de redesenhar todo o produto.
- Use dados reais de demonstração claramente identificados; nunca apresente vaga, progresso ou nota falsa como real.
- Se usar Figma, o design deve conter estados, componentes, tokens e responsividade, não apenas um mockup estático.
- A conexão do Figma MCP deve ser configurada no ambiente Claude Code por quem tem acesso, se ainda não estiver disponível. Não presuma que plugin conectado ao ChatGPT esteja automaticamente conectado ao Claude Code.

## Trabalho multiagente

Delegue apenas tarefas independentes e delimitadas a agentes read-only: auditoria de arquitetura, auditoria UX, segurança/RLS, conteúdo/aprendizagem. Não permita que dois agentes editem os mesmos arquivos. O agente principal é responsável por reconciliar conclusões e decisões.

Não faça todos os agentes discutirem em loop. Cada análise tem pergunta, evidência, output e limite de tempo/token.

## Desenvolvimento e verificação

- Use TDD nas mudanças: escrever teste, observar falhar, implementar, rodar novamente.
- Testar lógica, contratos, persistência, RLS, E2E e acessibilidade.
- Testar em 360–430px e telas maiores.
- Testar serviço real em staging, além dos mocks.
- Não declarar “pronto” com base só em screenshot ou mock.
- Não fazer deploy nem migração destrutiva sem autorização.

## Entregas obrigatórias da primeira execução

1. Relatório de auditoria do repositório real.
2. Matriz de capacidades reais/parciais/mockadas/ausentes.
3. Plano de migração do HTML e dados.
4. Mapa da arquitetura atual e proposta (com ADRs para decisões de stack).
5. Design/fluxo de Hoje, estudo e aula.
6. Plano de execução dividido em tarefas testáveis.
7. Estimativa de risco/custo de IA e serviços externos.
8. Primeira fatia vertical implementada em branch isolada, somente se os gates de design/arquitetura e segurança tiverem sido aceitos.
9. Relatório de testes com comandos e resultados reais.

## Critério para não desviar

A cada decisão, pergunte:

- Isso reduz o esforço para o usuário executar o próximo passo?
- Isso faz o usuário aprender melhor ou agir melhor?
- Isso liga uma atividade a uma meta real?
- Isso torna o progresso mais tangível e confiável?
- Isso preserva a pessoa e seus dados?

Se a resposta for não para todas, não construir agora.

Comece pela auditoria. Não comece por telas, dependências ou uma reescrita ampla.
