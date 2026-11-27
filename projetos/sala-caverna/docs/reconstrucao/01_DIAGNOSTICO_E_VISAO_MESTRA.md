# YAAD1 — Diagnóstico e visão-mestra de reconstrução

**Versão:** 1.0 — 27/11/2026  
**Base analisada:** apresentação Yaad1 de 37 páginas, HTML de 883.804 bytes/3.865 linhas, captura composta de telas e briefing informal da idealizadora.

---

## 1. Decisão executiva

O Yaad1 não deve ser reduzido a uma agenda, a uma plataforma de cursos, a um agregador de vagas ou a um chatbot. A tese mais valiosa do material original continua correta:

> **Um alvo, um caminho — um sistema que entende a vida real, revela possibilidades concretas, organiza uma trajetória, ensina o que falta, comprova a evolução e recalcula a rota quando a vida muda.**

A reconstrução deve preservar essa tese e corrigir o defeito central revelado pelo uso: a pessoa ainda precisa navegar entre funções e interpretar informação demais para conseguir fazer a próxima coisa certa. A experiência deve inverter essa relação: o produto entende o contexto e traz a ação, a aula, o material e o apoio até a pessoa.

### Recomendação

**Migração progressiva por fatias verticais, com reconstrução da camada de produto e da arquitetura, preservando o HTML atual como referência funcional e fonte de regras até cada capacidade ter substituto testado.**

Não recomendo:

- continuar ampliando o arquivo HTML monolítico;
- descartar o que já foi desenvolvido antes de mapear regras e dados;
- fazer uma reescrita total sem plano de migração de dados;
- construir 20 telas antes de provar um percurso real;
- lançar uma interface futurista que dependa de IA indisponível ou de dados demonstrativos.

---

## 2. O que o Yaad1 realmente é

O Yaad1 é uma **plataforma pessoal de direção, aprendizagem e conquista no mundo real**. O seu diferencial não é possuir IA, calendário, jogo ou vagas isoladamente. É conectar os elementos num mesmo ciclo:

1. **Realidade:** entender rotina, recursos, restrições, cidade, família, competências, interesses e momento de vida.
2. **Oportunidades:** localizar oportunidades reais, com origem, prazo, requisitos, barreiras e benefícios verificáveis.
3. **Trajetórias:** comparar caminhos possíveis, manter uma Faixa Agora e uma Faixa Sonho, reconhecer competências transferíveis e estimar etapas.
4. **Ação:** converter a rota em uma próxima ação pequena, executável e acompanhada.
5. **Aprendizagem:** ensinar o que falta, gerar prática, avaliar evidências e programar revisões.
6. **Recalcular:** adaptar o plano quando a vida mudar, preservando o progresso e a decisão humana.

O projeto Caverna é o primeiro caso de uso profundo do Yaad1, não o produto inteiro. Deve existir como uma **trajetória/projeto pessoal configurável** dentro do Yaad1. Outros usuários poderão ter percursos diferentes: ENEM, faculdade, concurso, emprego, requalificação, empreendedorismo ou descoberta profissional.

### Arquitetura conceitual do produto

- **Yaad1 Core:** identidade, contexto de vida, ROTA, objetivos, regras de direção e permissões.
- **Today / Hoje:** interface diária que escolhe e apresenta o próximo passo.
- **Learning / Aprender:** sala de aula, currículo de aprendizagem, conteúdos, professor, práticas, avaliações e revisões.
- **Game / Experimentar:** mecânicas de jogo e simulações para aplicar o conhecimento.
- **Opportunities / Oportunidades:** radar, editais, vagas, cursos, bolsas, processos seletivos e frentes.
- **Progress / Evolução:** competências, evidências, diário, metas, conquistas e histórico.
- **C Assistant:** assistente contextual que pode observar, preparar propostas e executar ações somente após autorização.

Essas áreas são módulos de uma só experiência, e não aplicativos independentes.

---

## 3. Auditoria: o que os materiais demonstram

### 3.1 O que está bem resolvido na visão

1. **Tese forte e diferenciada.** O documento não descreve uma agenda com IA; descreve direção pessoal conectada a oportunidades e execução.
2. **ROTA é um bom ciclo de domínio.** Realidade, Oportunidades, Trajetórias e Ação articulam produto, inteligência e jornada.
3. **Faixa Agora / Faixa Sonho.** Evita o falso dilema entre sobrevivência imediata e projeto de longo prazo.
4. **Frentes paralelas.** Permitem transformar uma vaga ou edital numa rota curta sem apagar o alvo principal.
5. **Minha vida mudou.** É uma das melhores decisões do produto: preservar histórico e ajustar o plano em vez de tratar pausa como fracasso.
6. **Passo de hoje.** A tela inicial deve responder à pergunta “o que faço agora?”, e não despejar todo o sistema.
7. **Evidência de aprendizagem.** A proposta de explicar com as próprias palavras, realizar prática e revisar erros é melhor do que contar horas de vídeo.
8. **Forja e revisão espaçada.** Aproveitam erros como dados de aprendizagem e sustentam memória de longo prazo.
9. **Oportunidade com proveniência.** Fonte, data, prazo, cidade, requisito, salário/benefício e barreira de acesso são indispensáveis.
10. **Assistente com níveis de autonomia.** Observar, preparar e executar após consentimento reduz riscos.
11. **Filtro de inovação.** Uma função só entra se resolve necessidade, aproxima de oportunidade ou torna a evolução perceptível.
12. **Inclusão e baixa conectividade.** O produto considera condições reais, em vez de pressupor aparelhos e internet perfeitos.

### 3.2 O que já existe no HTML (não confundir com produto pronto)

O HTML fornecido é um protótipo funcional relativamente rico, não apenas uma imagem. A leitura do código identificou:

- CSS com tokens, tema escuro, acento laranja e cores por área de estudo;
- layout responsivo e navegação por folhas/telas sobrepostas;
- estado local em `localStorage` e tentativa de sincronização por adaptador de banco;
- agenda, blocos, metas e projetos;
- fluxo de estudo `plano → aula → foco → explicar → prova → resultado`;
- geração de aula por IA a partir de assunto, link e imagens;
- conteúdo de aula com analogia, passos, exemplo resolvido, quadro, armadilhas, treino e sugestões de pesquisa;
- Sala Viva com cenas, professor, personagens, pausas e voz;
- perguntas, provas, diário, finalização do dia e revisão matinal/semanal;
- FSRS/revisões e caderno de erros (Forja);
- jogos Relâmpago, Pares e Linha do tempo;
- metas conectadas à agenda;
- fita temporal com níveis de zoom e gesto de pinça;
- preparação, frentes, radar, oportunidades, candidatura e assistente;
- mecanismos de busca, mapas e Gupy, com caminhos diferentes conforme o runtime.

**Aproveitar:** as regras de domínio, a linguagem do produto, as interações comprovadamente úteis, a lógica de horários, as rotas, os conceitos e os exemplos.  
**Não preservar como arquitetura de futuro:** a estrutura monolítica, a dependência do runtime do Claude Artifact para IA, a persistência silenciosa, a mistura de dados pessoais no código e o acoplamento entre interface, regra de negócio e chamadas de IA.

### 3.3 O que o código mostra como fragilidade concreta

1. **Monólito:** 883.804 bytes, 3.865 linhas e 242 funções de topo em um único arquivo. É uma forma compreensível para um Artifact autocontido, mas torna evolução, isolamento de bugs, testes e trabalho paralelo mais difíceis.
2. **Runtime implícito:** a IA é detectada por `window.claude.use(...)` e `SAMPLE`. Sem esse ambiente, `aiOn()` é falso e várias experiências ficam indisponíveis ou mudam para fallback manual. O arquivo sozinho não é a aplicação completa prometida.
3. **Persistência pouco observável:** a gravação local é imediata, mas a gravação remota é debounced e erros são engolidos (`catch(()=>{})`). Isso pode criar a sensação de que o dado foi salvo quando a sincronização falhou.
4. **Avaliação permissiva em falha de IA:** na rotina de avaliação da resposta aberta, uma exceção cai num resultado neutro de 0,5 para a nota e 0,5 para a descrição. O cálculo final ainda pode produzir aprovação. Isso precisa ser removido: falha de avaliação deve gerar `pending_review`/`evaluation_unavailable`, nunca domínio presumido.
5. **Conclusão ambígua:** há caminhos que registram um estudo manual ou sem prova quando a IA não está ligada. O usuário precisa distinguir estudo declarado, material estudado, evidência enviada, avaliação pendente e domínio demonstrado.
6. **Aula predominantemente textual:** a aula tem estrutura, mas o centro da experiência ainda é texto gerado, listas, links e diálogos. A Sala Viva é opcional e produz cenas faladas; não substitui uma experiência de quadro, demonstração, atividade visual e participação do aluno.
7. **Conteúdo pouco governado:** `genLesson()` pede JSON útil, mas o código apresentado não prova um pipeline de fontes revisadas, atribuição, licenças, versão ou verificação factual sistemática.
8. **Busca no site com caminhos vazios:** `ferramentasBusca()` devolve ferramentas server-side com `execute` que retorna string vazia no caminho `YAAD_SITE`; o PDF também registra que mapas e Gupy ainda precisam ser levados ao site. A documentação de integração não deve ser confundida com conector validado no produto hospedado.
9. **Dados privados no cliente:** o HTML contém contexto fixo do Projeto Caverna, incluindo interesses, rotina, alvo e contexto pessoal. Isso precisa migrar para perfil autorizado no banco, nunca para um bundle público.
10. **Verdade de teste:** o PDF cita 12 cenários / 104 verificações Playwright em dois tamanhos de celular, mas informa que IA, conectores, ditado e voz foram simulados. É evidência de regressão de interface, não de integração real de ponta a ponta.
11. **Falhas sem estado visível:** alguns erros de persistência, serviços ou integrações não têm uma experiência de recuperação clara. Um app principal de rotina precisa mostrar `salvo`, `sincronizando`, `offline` e `não sincronizado`.
12. **Muitas funções sem hierarquia diária:** o usuário encontra muitas áreas e ferramentas, mas o valor de abrir o app não está concentrado numa ação que já inclui conteúdo, método e avaliação.

### 3.4 O que as telas mostram

A captura composta tem uma identidade reconhecível: fundo preto/azul profundo, laranja no assistente central, verde para sucesso, cartões com gradientes, tipografia grande e uma interface pensada para telefone. A imagem mostra preparação por matéria, radar, oportunidades, conquistas, jogos, assistente, biblioteca e calendário.

Essa identidade deve ser mantida como linguagem, não copiada literalmente em cada tela. O redesign deve:

- preservar o preto profundo e o laranja do C;
- usar verde como semântica de êxito, não decoração;
- manter gradientes por domínio, com contenção;
- usar vidro/translucidez apenas em superfícies que precisam de profundidade;
- introduzir imagens, diagramas, quadros, demonstrações e objetos interativos onde ajudam a aprender;
- diminuir texto visível no primeiro nível e revelar detalhe sob demanda;
- garantir que cada tela tenha uma ação principal, não um conjunto de CTAs competindo.

---

## 4. O alvo e a régua de sucesso

O produto acerta o alvo se a pessoa:

1. abre o Yaad1 porque algo concreto está acontecendo na sua trajetória;
2. entende em poucos segundos o que fazer agora e por que isso importa;
3. consegue executar a atividade dentro do app, inclusive aprender quando a atividade é de estudo;
4. deixa evidência de que estudou ou realizou o que foi combinado;
5. recebe feedback útil e uma próxima ação específica;
6. vê como essa ação alimenta uma meta, uma competência ou uma oportunidade real;
7. consegue voltar após interrupção sem perder o que construiu.

### Métrica principal

**Taxa de próximas ações significativas concluídas e confirmadas dentro de 14 dias após início ou retomada de uma trajetória.**

### Métricas de apoio

- primeira ação significativa após onboarding;
- retorno após pausa e taxa de reentrada;
- sessões de aprendizagem com evidência completa;
- retenção de aprendizagem em revisão espaçada;
- erro recorrente que foi superado;
- metas/marcos concretizados;
- oportunidades verificadas e candidaturas confirmadas pelo usuário;
- taxa de sincronização bem-sucedida e perda de evidência;
- tempo/custo por tarefa de IA;
- frescor e precisão das oportunidades;
- acessibilidade e desempenho em dispositivos de baixo custo.

**Não usar tempo de tela como métrica norteadora.**

---

## 5. Conceito de experiência: Yaad1 em movimento

### 5.1 A tela Hoje

A tela inicial precisa fazer uma pergunta e dar uma resposta: **“Qual é o próximo passo certo agora?”**

Hierarquia sugerida:

1. saudação curta, data, fase e identidade visual pessoal;
2. imagem do destino ou um símbolo da meta, sem ocupar a tela inteira sempre;
3. uma única ação principal (“Agora”): nome, duração, razão, resultado esperado e botão iniciar;
4. fita de evolução compacta, com zoom progressivo: bloco atual → hoje → ontem/amanhã → semana → ciclo inteiro;
5. próximos dois ou três compromissos, em resumo;
6. uma conexão contextual com a meta (ex.: “esta sessão fortalece SQL exigido no alvo Analytics”);
7. assistente C disponível, sem roubar o foco.

O gesto de pinça existente é uma ideia boa. Manter, mas fornecer controles acessíveis explícitos: Hoje, Dia, Semana, Projeto; botão “voltar para agora”; navegação por teclado/leitor de tela. O gesto nunca pode ser a única forma de navegar.

### 5.2 Navegação principal

Evitar 7–10 abas simultâneas. Proposta mobile:

- **Hoje** — passo atual e agenda;
- **Aprender** — matérias, sala de aula, práticas e jogos;
- **Alvo** — mapa de metas, competências, frentes e oportunidades;
- **Diário** — histórico, revisão e evolução;
- **C flutuante** — assistente contextual, acionável de qualquer área.

Dentro de `Alvo`, Radar, oportunidades e candidaturas ficam em subnavegação. Dentro de `Aprender`, currículo, conteúdos, biblioteca, Forja e jogos ficam ligados à disciplina atual. A organização final deve ser testada com usuários, não decidida só por preferência estética.

### 5.3 Uma atividade é uma experiência completa, não um botão de OK

Cada atividade terá tipo e política de evidência:

- `acknowledgment`: oração, refeição, deslocamento, compromisso simples; confirmar e, se necessário, registrar nota breve;
- `learning`: informar assunto/fonte → receber plano de aula → aprender no Yaad1 → praticar → explicar com palavras próprias → anexar evidência opcional/necessária → avaliação → revisar;
- `deliverable`: produzir arquivo, projeto, consulta SQL, dashboard, apresentação ou código e anexar/linkar resultado;
- `appointment`: comparecimento/compromisso com estado, sem exigir prova invasiva;
- `wellbeing`: autocuidado, exercício, pausa, sono — confirmação respeitosa, sem gamificar de forma punitiva.

Estados distintos:

`planned → context_needed → ready → in_progress → evidence_submitted → evaluating → verified | partially_verified | declared_only | evaluation_pending | blocked | skipped`

O sistema não deve fingir que `declared_only` é `verified`. Também não deve impedir que o usuário registre honestamente uma sessão quando o serviço de IA está fora do ar. Deve guardar evidência e avaliar depois.

### 5.4 Aula real dentro do Yaad1

Uma sessão de aula deve ser composta por cenas pedagógicas que possam ser visualizadas e manipuladas:

1. objetivo e conexão com a meta;
2. ativação de conhecimento prévio;
3. explicação curta com mídia/diagrama/quadros;
4. exemplo resolvido passo a passo;
5. pergunta de previsão ou checagem;
6. manipulação/simulação quando apropriado;
7. prática guiada;
8. prática independente;
9. explicação de volta pelo aluno;
10. verificação de transferência em problema novo;
11. resumo, anotação e revisão programada.

A IA deve escolher entre exposição, investigação, exemplo trabalhado, simulação, flashcard, mapa conceitual, problema prático, leitura guiada e jogo. Nem todo conteúdo vira quiz. O app deve renderizar os objetos de aprendizagem em componentes apropriados.

### 5.5 Revisão: Forja e memória

A Forja precisa converter cada erro em unidade de aprendizagem:

- resposta e raciocínio do aluno;
- resposta esperada e fundamento;
- tipo de erro (conceito, procedimento, interpretação, distração, desconhecimento, chute);
- pré-requisito possivelmente ausente;
- explicação curta;
- novo exemplo;
- prática de reparo;
- próxima data de revisão.

Revisão matinal: recuperação do que foi estudado no dia anterior, 2–5 itens curtos, com mistura de pergunta fácil, explicação livre e aplicação.  
Revisão de segunda-feira: síntese dos assuntos da semana, avaliação por tópico, gabarito explicado e foco nas lacunas.  
Revisão noturna: resumo produzido a partir das atividades reais, recordação do aluno, reflexão e preparação do próximo dia.

FSRS deve programar cartão/conceito, não declarar domínio acadêmico sozinho. O domínio deve combinar diferentes evidências, aplicação em contexto novo e retenção.

---

## 6. O projeto Caverna como primeira trajetória

O Caverna deve continuar como primeira configuração real e servir para validar a experiência sem contaminar o produto com contexto pessoal hardcoded.

### 6.1 Dados de perfil editáveis

O perfil deve permitir configurar:
- metas principais e secundárias;
- prioridade e janela temporal;
- disciplinas/áreas;
- rotina fixa e compromissos recorrentes;
- janelas de estudo;
- limites de esforço, descanso e saúde;
- recursos disponíveis e custos;
- preferência de acessibilidade e baixa conectividade;
- fontes e cursos usados;
- imagem/âncora pessoal, opcional.

Nenhum dado da pessoa deve estar fixo em `perfilBase()` ou em arquivos estáticos da aplicação.

### 6.2 Prioridades do caso Caverna

A sequência registrada no briefing pode servir como primeira configuração da trajetória, com prioridade espiritual/familiar e pastoral, Matemática, formação acadêmica, dados e programação, Economia, ANBIMA e oportunidades profissionais. A rotina e os horários devem ser configuráveis e confirmados; não assumir que datas, vagas, editais, certificações ou cronogramas antigos permanecem atuais.

### 6.3 Integração meta ↔ agenda ↔ aula

Cada bloco de estudo deve apontar para:

- uma disciplina;
- um ou mais objetivos/conceitos;
- um plano de aprendizagem;
- a meta ou frente que ele alimenta;
- um critério de conclusão;
- uma evidência;
- uma data de revisão;
- uma consequência/ação posterior.

Exemplo: `SQL → JOINs → prática com dados de crédito → evidência em consulta versionada → competência SQL demonstrada → meta estágio Analytics`.

### 6.4 ANBIMA

A área ANBIMA deve ser uma trilha específica, com matriz/syllabus oficial vigente, aulas, material, exercícios, simulados e indicadores por tema. O aplicativo não deve deixar a IA inventar formato, nome de certificação, taxa, conteúdo ou regra de exame. Deve verificar a fonte oficial e a data. No caso Caverna, a regra de horário e de prova após a fase do projeto precisa ser configurável, não codificada no produto para todos.

---

## 7. O cérebro: uma inteligência coordenada, não uma conversa infinita entre robôs

A ambição de usar várias inteligências é válida, mas precisa ser traduzida em engenharia controlável.

Proposta: **Yaad1 Intelligence Fabric**.

- um orquestrador principal, que mantém o estado do caso e escolhe a capacidade necessária;
- papéis especializados quando há motivo: pesquisador de fontes, designer pedagógico, verificador factual, avaliador, planejador de agenda, analista de oportunidades;
- modelos/provedores intercambiáveis atrás de adaptadores;
- artefatos compartilhados, tipados, versionados e com proveniência;
- verificação independente ou ferramenta determinística para saídas que afetam avaliação, oportunidade ou compromisso;
- memória explícita por pessoa, com escopo, fonte, data, confiança e consentimento;
- feedback/telemetria para melhorar prompts, regras e avaliadores após aprovação.

**Não presumir que modelos de IA evoluem ou treinam seus pesos automaticamente porque conversaram entre si.** A melhoria do Yaad1 deve acontecer por um ciclo explícito: observar erro/feedback → registrar caso → avaliar → propor atualização → aprovar → versionar instrução, conteúdo, política ou código → medir regressões. O aprendizado da pessoa e a melhoria do produto são dois ciclos distintos.

Não chamar todos os modelos para toda tarefa. Um agente faz orquestração e solicita uma segunda avaliação apenas onde o risco/benefício justifica. Isso controla custo, latência e desacordo entre modelos.

---

## 8. O que preservar, reconstruir, adiar e remover

| Decisão | Elementos |
|---|---|
| Preservar | Tese Yaad1, ROTA, Faixa Agora/Sonho, Frentes, passo de hoje, Minha vida mudou, Forja, revisão espaçada, assistente C, identidade escura/laranja, metas conectadas, timeline com zoom, oportunidades verificáveis, backup e dados por usuário. |
| Reconstruir | Home, navegação, sala de aula, modelo de atividade/evidência, experiência de estudo, sync/persistência, APIs de IA, pipeline de conteúdo, mapa de competências, oportunidades no site, segurança e observabilidade. |
| Corrigir imediatamente | Perfil pessoal hardcoded, falha de IA pontuada como nota neutra, erros de banco silenciosos, status de estudo ambíguo, busca server-side placeholder, testes exclusivamente mockados apresentados como cobertura integral. |
| Adiar | rede social, rankings públicos, multiplayer sofisticado, 3D obrigatório, marketplace de cursos, aplicação automática, agentes autônomos com ampla permissão, certificação própria, blockchain, token/recompensas financeiras. |
| Remover da experiência principal | painel com muitos números, texto longo no primeiro nível, funções concorrentes, pop-ups sem contexto, badges decorativos, pontuação sem evidência. |

---

## 9. Três abordagens de construção consideradas

### A. Reescrita integral imediata

Prós: arquitetura limpa desde o início.  
Contras: alto risco de perda de regras, dados, edge cases e funcionalidades; grande custo antes de validar valor.

### B. Continuar no HTML e remendar

Prós: menor mudança inicial; mantém a experiência atual.  
Contras: reforça o acoplamento e o limite de escala; continua dependente de runtime e estado difícil de testar.

### C. Migração progressiva por fatia vertical — recomendada

Prós: reduz risco, mantém o que já funciona, permite comparar experiência antiga e nova, preserva dados e entrega valor a cada etapa.  
Contras: exige adapter temporário e um período com coexistência de modelos/rotas.

**Escolha recomendada:** C. O HTML atual será tratado como `legacy/reference`; novas funcionalidades nascerão na arquitetura modular. Migrar fluxo por fluxo, com testes de paridade e migração de dados reversível.

---

## 10. Resultado que a primeira versão precisa demonstrar

Antes de construir todos os módulos, entregar um percurso vertical real:

**Hoje → iniciar atividade de estudo → informar matéria/conteúdo ou anexar material → receber uma aula estruturada e visual → usar o quadro/material/recursos → praticar → explicar com palavras próprias → avaliação válida → Forja se houver lacuna → revisão FSRS → atualizar competência/meta → finalizar o dia → revisão de recuperação no dia seguinte.**

Esse percurso deve sobreviver a:
- fechar o aplicativo no meio da aula;
- perder conexão e voltar;
- falha do modelo de IA;
- upload de imagem/documento inválido;
- resposta incompleta/ambígua;
- conflito de sincronização;
- mudança de agenda;
- sessão retomada em outro dispositivo.

Se esse percurso for funcional, persistente, compreensível e útil no telefone, o Yaad1 terá uma fundação real para expandir para oportunidades, candidaturas, jogos mais avançados e outros perfis.

---

## 11. Nota de honestidade sobre a auditoria

O PDF descreve Vercel, Supabase, Auth/MFA, APIs e integrações, mas também lista limitações: chave Anthropic paga para IA no site, conectores específicos por conta, vagas/mapas ainda incompletos no site, ausência de notificações push reais, lacuna de cobertura de oportunidades e validação limitada a uma pessoa. O HTML enviado usa uma interface de capacidades `window.claude.use(...)`; na cópia isolada, a disponibilidade de IA depende desse runtime ou de um shim equivalente.

Não foram acessados nesta análise: repositório Git completo, configurações Vercel, Supabase real, variáveis de ambiente, dados de produção, logs, pagamentos, contratos de APIs ou contas dos conectores. Claude Code deve verificar cada ponto antes de assumir que a arquitetura descrita está implantada e saudável.
