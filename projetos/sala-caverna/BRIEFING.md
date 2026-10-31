# Caverna: app de estudos do Projeto Caverna

- **Tema:** próprio (base escura profunda, vidro, um gradiente por área), derivado de `aurora` e `brasa` e das [referências pétreas](../../design-lab/referencias-petreas.md). O app é um arquivo único e autocontido, porque roda como Artifact.
- **O que é:** a sala de estudos digital e agenda inteligente dos 100 dias (16/10/2026 a 23/01/2027). É o app principal do celular: ensina, organiza, comprova e mede.
- **Para quem:** Edna. Matemática EAD, Ciências Econômicas, dados (SQL, Python, Power BI), ANBIMA CPA e ministério.
- **Tarefa principal na tela:** saber o que fazer agora e fazer, com prova de que aprendeu.
- **Meta central:** Estágio 2027 Serasa Experian Analytics. Reservas: PagBank, Mercantil, Sicoob e Agibank. Horizonte: mestrado no ITA.

## Por que a versão anterior falhou (e o que mudou)

| Antes (Sala/Agenda Caverna) | Agora (Caverna) |
|---|---|
| Agenda como parede de texto | "Agora" gigante com uma única ação; agenda curta (pausas escondidas) |
| Só registrava o estudo | **Ensina**: cada bloco gera uma aula (ideia central, analogia, passos, exemplo resolvido, armadilhas, treino graduado, buscas no YouTube, material oficial) |
| Confirmação burocrática | Fluxo em passos (referência 4): plano → aula → foco → conta → prova → resultado |
| Sem memória de longo prazo | Revisão espaçada automática (1, 3, 7, 14 e 30 dias) e caderno de erros alimentado pelas provas |
| Visual de 2017 | Referências pétreas: vidro, tipografia gigante, cartas, bento, orbe do assistente |

## Funções

- **Hoje:** data gigante, dia X de 100, fase, semana, cartão "Agora" (com tempo restante e próximo bloco), alerta de bloco sem registro, bento (prazo Serasa, revisões, constância, ANBIMA, média nas provas), frase do dia (frases da própria Edna) e Finalizar o dia.
- **Bloco de estudo:** matéria, assunto, fonte, link e foto do material. O Claude gera a aula (lendo a foto) e há modo foco com cronômetro. Depois a pessoa explica com as próprias palavras (mínimo de 80 caracteres) e faz a prova: 4 de múltipla escolha + 1 aberta corrigida pelo Claude. O bloco só confirma com 60% ou mais; abaixo disso, faz nova prova ou registra como parcial. Os erros vão para o caderno, e o assunto entra na revisão espaçada.
- **Bíblia:** livro e capítulo, o que aprendeu e 2 perguntas.
- **Blocos simples** (oração, academia, culto): só "OK, feito". **Não fiz:** escolher um motivo é obrigatório.
- **Finalizar o dia** (6 passos): pendências com motivo, recordação com uma pergunta por assunto, resumo com as próprias palavras, nota de 0 a 10 e 3 frases, síntese técnica do Claude com "ouvir em voz alta", e gratidão a Deus antes de registrar.
- **Estudar:** aula livre sobre qualquer assunto, cartas das 9 matérias com trilha de 5 níveis (do laudo), revisões do dia e caderno de erros.
- **Evolução:** Panorama (100 dias em heatmap, horas por área, leitura do tutor), Metas e vagas (linha do tempo Serasa e portas com status), Árvore (ramos que acendem com evidência) e ANBIMA (simulados de 10 questões e média).
- **Diário:** calendário dos 100 dias (meses gigantes, referência 3), detalhe do dia com tudo o que foi feito e "Fazer uma atividade sobre este dia".
- **C laranja:** chat com o Claude, que sabe a agenda, as revisões e os erros de hoje, aceita foto e ensina com pistas antes da resposta.
- **Perfil:** foto, nome, nível e XP, e backup em JSON.

## Tecnologia (capacidades do Artifact)

| Capacidade | Uso |
|---|---|
| `sample` (com imagens) | Aulas, provas, correção, recordação, síntese, panorama, simulados e chat |
| `db` + `user` | Registros privados em `data/users/<id>/` (`main` e `d_<data>`), sincronizados entre aparelhos |
| `assets` | Foto de perfil |
| `downloads` | Backup dos registros |

Fora do Artifact (abrindo o arquivo direto), o app funciona sem IA e salva no navegador.

## Limitações conhecidas

- **Voz para falar com o app:** o microfone não está disponível para páginas Artifact. A leitura em voz alta (aula e síntese) funciona.
- **Lembrete diário no celular:** o app não envia notificações sozinho. A solução é uma tarefa agendada do Claude que manda um aviso todo dia (a combinar).
- **Vídeos:** o app sugere buscas no YouTube e links oficiais; não incorpora vídeos (bloqueado em Artifacts).

## Decisões

- Pausas e deslocamentos não pedem confirmação e não entram na porcentagem do dia.
- ANBIMA só às terças, quintas e sextas, das 14h às 16h, como no plano. A prova fica para depois de 23/01, decidida pela média dos simulados (meta: 70%).
- Fases: as 3 do resumo mais recente (16/10–19/11, 20/11–24/12, 25/12–23/01).
