# YAAD1 — Auditoria pontual do HTML e consistência temporal

**Arquivo inspecionado:** `Yaad1.html` (883.804 bytes, 3.865 linhas).  
**Escopo:** leitura estática do arquivo anexado; não é execução em navegador nem auditoria do site implantado.

## 1. Estrutura e arquitetura observadas

- CSS/tokens e layout iniciam nas linhas 8–72; o tema escuro, superfícies translúcidas, laranja `--c`, verde de sucesso e cores por área estão definidos no root.
- Navegação e views aparecem como funções `vHoje`, `vPainel`, `vEstudar`, `vEvolucao`, `vDiario` e outras, distribuídas em uma única unidade de código.
- Persistência/boot começa aproximadamente na linha 720: `dbPut`, `saveMain`, `day`, `saveDay`, `boot`.
- Integração com Claude Artifact é obtida em `boot()` por `claude.use("user")`, `claude.use("db")`, `claude.use("sample")`, `claude.use("mcp")`, assets, downloads, dictation e TTS.
- `aiOn()` é derivado de `!!SAMPLE` (aprox. linha 768), então a disponibilidade de AI está ligada à capacidade do runtime, não a uma API independente no HTML.
- `openStudy()` inicia o fluxo de estudo (aprox. linha 1248).
- `genLesson()` prepara uma aula estruturada a partir de matéria, assunto, fonte, link e fotos (aprox. linha 1465).
- `genQuiz()` cria avaliação com múltipla escolha e pergunta aberta (aprox. linha 1480).
- `gradeQuiz()` pontua as respostas e usa avaliação de IA para descrição/pergunta aberta (aprox. linha 1513).
- `gerarSala()` transforma a aula em cenas com professor e participantes (aprox. linha 1405).
- `openProva()` é uma prova genérica condicionada a `aiOn()` (aprox. linha 1852).
- `radarMapaHTML()` desenha mapa simplificado de oportunidades a partir de dados geográficos presentes (aprox. linha 3148).

## 2. Defeitos que devem virar testes antes de reescrita

### A. Gravação remota sem confirmação visível

`dbPut()` agenda gravação remota com debounce e seu `.catch(()=>{})` suprime erro. O app precisa expor estado de sincronização, retry e conflitos; o teste deve simular rede desconectada e verificar que a UI não informa “salvo” enquanto o servidor não confirmou.

### B. Nota neutra quando avaliador falha

No `gradeQuiz()`, o `catch` da avaliação aberta define `nota:0.5` e `descricao:0.5`; o resultado continua fazendo média com a quantidade de alternativas. Isso permite que uma falha do avaliador contribua com pontos. Comportamento novo exigido: resposta guardada, avaliação pendente e nenhuma aprovação automática por falha do modelo.

### C. Dependência do runtime

`boot()` retorna cedo quando `window.claude.use` não existe e a flag `aiOn()` depende de `SAMPLE`. `openProva()` recusa iniciar prova quando a IA não está ligada. O site precisa usar API server-side e o PWA deve ter uma camada de serviço própria, sem depender do host Claude Artifact.

### D. Conteúdo gerado sem registry/proveniência evidente

`genLesson()` pede uma aula em JSON incluindo analogia, passos, exemplo, quadro, armadilhas, treino e buscas. Isso é uma estrutura útil, mas a geração precisa estar conectada a fontes aprovadas/versionadas, licenças, referências e validators. O output não pode tornar-se automaticamente “conteúdo oficial” só por ser plausível.

### E. Sala Viva não é ainda uma execução multimodal completa

`gerarSala()` gera cenas textuais com falas e pausas. É um bom formato narrativo, mas não substitui a aula visual/interativa. A nova arquitetura deve renderizar cenas por componentes — quadro, fórmula, gráfico, diagrama, tabela, simulação, áudio e texto — em vez de apresentar tudo como parágrafo falado.

### F. Caminho de busca no site

Na `ferramentasBusca()`, o modo `YAAD_SITE` cria ferramentas cujas implementações retornam string vazia. O PDF também reconhece que mapas e Gupy ainda precisam ser levados ao site. Criar um contrato de integração server-side e testar de verdade; esconder a lacuna sob um card de vaga não é aceitável.

### G. Perfil pessoal embutido

`perfilBase()` contém texto fixo do projeto Caverna e detalhes do perfil, metas e rotina. Mover para dados de perfil editáveis e protegidos por autenticação; o bundle público não deve revelar essa informação.

## 3. Data drift no material Caverna

O briefing informal contém snapshots que eram verdadeiros em outubro de 2026, por exemplo “hoje, 30/10, dia 15” e prazos de inscrição 31/10 e 04/11. A apresentação PDF foi gerada em 27/11/2026. Considerando o plano de 16/10/2026 como dia 1, 27/11/2026 é o dia 43. Assim:

- “dia 15” não pode continuar hardcoded como hoje;
- prazo 04/11/2026 já está no passado em 27/11/2026 e não deve ser mostrado como pendente/futuro;
- estado da candidatura Serasa, vagas, salários, inscrições e provas deve ser revalidado em fonte atual antes de gerar ação;
- as datas originais devem ser preservadas no histórico, mas o estado atual de cada marco precisa mudar para concluído, expirado, cancelado, em andamento ou não verificado.

Não alterar retrospectivamente o histórico. Criar atualização/estado atual com fonte e timestamp.

## 4. Referências visuais

A imagem composta mostra várias áreas do produto em formato mobile. Ela é um catálogo de intenção, não prova de que cada tela está funcional. Preservar identidade e reorganizar a hierarquia: hoje/ação principal primeiro; detalhe e módulos em camadas secundárias; experiência de aprendizagem mais visual e participativa.

## 5. Testes de regressão sugeridos diretamente a partir do arquivo

1. `dbPut` falha — status de sync não pode ficar verde.
2. avaliação de resposta aberta falha — atividade deve permanecer `evaluation_pending`.
3. `window.claude` ausente — aula e atividade não podem desaparecer sem alternativa de API/fallback.
4. duas abas enviam a mesma evidência — uma evidência persistida, não duas conclusões.
5. usuário altera perfil Caverna — próxima chamada de IA recebe perfil novo, sem default fixo.
6. busca server-side indisponível — Radar informa indisponibilidade e não inventa resultados.
7. sessão é retomada — tópico, foto (ou referência privada), notas, respostas e cena atual são preservados.
8. atividade simples — permite confirmação sem prova, mas não cria evidência acadêmica.
9. revisão matinal — usa somente conteúdos de sessões efetivas do dia anterior.
10. mudança de vida — exibe proposta de agenda e não aplica sem aceite.
