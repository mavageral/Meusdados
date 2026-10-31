# Bússola: o quiz de direção do Yaad1

> Método desenhado em 31/10/2026 a partir do pedido da Edna e da análise de 3 testes vocacionais do mercado (Educa Mais Brasil, Quero Bolsa e Feevale). Ela fez esses testes e mandou os prints (366 no total). Este documento detalha a etapa 2 da [VISAO.md](VISAO.md): **como o app direciona alguém que chega sem saber o que quer**.

## O que o quiz precisa entregar

Qualquer pessoa sai do quiz com:
1. **um retrato de si mesma** que ela reconhece ("isso sou eu");
2. **as opções reais** que combinam com ela (emprego, estudo, concurso, curso), cada uma com requisitos, prazo e custo;
3. **um alvo escolhido por ela**;
4. **o projeto montado** (rotina, matérias, metas, provas) para chegar ao alvo.

Quem decide é sempre a pessoa. O app mostra, explica e organiza.

## O que os testes do mercado fazem mal (e a regra que corrige)

| Falha observada | Exemplo real | Regra da Bússola |
|---|---|---|
| **Funil precoce:** o algoritmo afunila nas primeiras respostas e descarta o que ainda nem apareceu | Um teste começou com perguntas de arte; a Edna disse que gosta de música e passou a receber só música | **Amplitude antes de profundidade.** A 1ª rodada é fixa e equilibrada: todas as áreas recebem o mesmo número de perguntas, intercaladas. Só depois o app aprofunda. |
| **Gostar ≠ querer viver disso** | Ela gosta de cantar, mas não é a prioridade dela | Pergunta explícita **"hobby ou caminho?"** para cada área forte. Hobby não vira meta. |
| **"Não" e "nunca vi" contam igual** | Áreas nunca experimentadas caíam para o fim | Opção **"Nunca experimentei"**: não pontua contra, e a área fica marcada como *a explorar*. |
| **Resultado sem conferência** | O teste afirma um perfil e encerra | Tela **Espelho**: "Isso parece você?" A pessoa ajusta antes de seguir. |
| **Uma lente só** (habilidades) | Os 3 testes medem só gostos ou só "inteligências" | **Quatro lentes:** interesses, talentos, valores e realidade (tempo, dinheiro, escolaridade, lugar). |
| **Resultado sem caminho** | Lista de cursos, sem dizer como chegar | Cada opção vem com **escada**: o primeiro degrau agora, os seguintes e o prazo realista. |
| **Viés comercial** | Todos terminam vendendo bolsa de estudo | Sem venda. As opções gratuitas aparecem primeiro quando o dinheiro é curto. |
| **Áreas desequilibradas** | Naturalista e música com mais perguntas em um teste, menos em outro | Pontuação **normalizada por área** e mapa completo sempre visível, inclusive o que ficou baixo. |

Nota honesta: as **Inteligências Múltiplas (Gardner)** são populares, mas têm pouca base científica como teste. O modelo de interesses mais validado é o **RIASEC (Holland)**, usado pelo governo dos EUA no O\*NET. A Bússola usa o RIASEC como base e o Gardner como lente de **talentos**, porque as pessoas se reconhecem nele.

## O alvo é o centro

Duas formas de entrar: as portas abaixo, ou **"Prefiro escrever"**: a pessoa descreve o que quer, onde quer chegar e do que gosta, e o Claude faz perguntas, uma por tela, até o alvo ficar claro.

Tudo no quiz serve para uma coisa: **traçar o alvo da pessoa** (o *ya'ad*). O alvo é a meta concreta que vira o projeto. A descoberta, as perguntas e os caminhos existem para chegar a ele.

## As portas de entrada

Primeira pergunta, uma tela: **"Qual é o seu alvo?"** Logo em seguida, **"Qual?"**: o app já pergunta o alvo específico e, a partir dele, mostra tudo (requisitos, prova, matérias, prazo, oportunidades).

| Porta | "Qual?" (exemplos em botões + campo livre) | O que o app já mostra |
|---|---|---|
| **Passar em um concurso** | Banco do Brasil, Caixa, INSS, polícias, tribunais, Receita, prefeitura… ou a área (bancário, policial, tribunais, fiscal, saúde, educação) e o nível (médio ou superior) | Banca, edital, matérias, formato da prova, prazo realista |
| **Estudar para o ENEM** | O curso e a faculdade que quer, e a nota que precisa | Áreas da prova, redação, nota de corte, ano da prova |
| **Passar num vestibular** | ITA, Fuvest, Unicamp, UERJ, outro… e o curso | Matérias e estilo da prova, provas passadas |
| **Entrar ou crescer na faculdade** | O curso (presencial ou EAD), ou o curso que já faz e o período | Grade, disciplinas do semestre, estágio |
| **Conseguir um emprego** | O cargo ou a área (dados, administrativo, vendas, saúde…) | Requisitos, se exige faculdade (e qual), emprego de entrada |
| **Fazer um curso ou certificação** | ANBIMA, idiomas, TI, técnico… | Conteúdo, prova, custo, onde fazer |
| **Mudar de carreira ou crescer onde estou** | Para onde quer ir | Ponte entre o que já sabe e o novo alvo |
| **Ainda não sei** | — | Percurso completo de descoberta |

Em todas as portas existe o botão **"Ainda não sei qual"**: ele abre a descoberta (interesses, talentos, valores) para escolher o alvo dentro daquela porta, por exemplo qual concurso combina com a pessoa. Quem já sabe o alvo faz um caminho curto (cerca de 10 telas) e pode abrir a descoberta com um toque ("quero me conhecer melhor antes").

## O percurso completo

Uma pergunta (ou um grupo pequeno) por tela, no padrão da referência 4. Progresso salvo: a pessoa pode parar e voltar. Duração: 8 a 10 minutos.

### 1. Sua realidade (4 telas)
- **Momento e escolaridade:** ensino médio (cursando ou completo), cursinho, superior cursando (qual curso e período), superior completo (qual), pós.
- **Rotina:** acordo e durmo, trabalho (não, meio período, integral), horas por dia, dias por semana.
- **Inegociáveis:** fé, família, saúde, trabalho, ministério, descanso.
- **Recursos e lugar:** quanto pode investir (só gratuito, até R$ 100, até R$ 500, mais por mês), cidade e estado, aceita remoto ou se mudar.

### 2. Interesses (6 telas, 3 cartões por tela)
Escala de cada cartão: **Não é pra mim · Talvez · Gosto · Amo · Nunca experimentei**.
As áreas são intercaladas (nunca duas da mesma área seguidas) e a ordem muda entre pessoas.

| Área (RIASEC) | "Eu gostaria de…" |
|---|---|
| **Fazer** (prático) | montar ou consertar aparelhos e máquinas · trabalhar ao ar livre, com plantas, animais ou obras · usar ferramentas e o corpo para produzir algo concreto |
| **Investigar** | descobrir por que as coisas acontecem · resolver problemas difíceis com números e lógica · pesquisar e testar ideias (ciência, dados, saúde) |
| **Criar** | criar imagens, vídeos, músicas ou textos · desenhar ambientes, produtos ou telas de apps · inventar jeitos novos de fazer algo |
| **Cuidar e ensinar** | ensinar ou explicar algo a alguém · cuidar da saúde e do bem-estar das pessoas · ouvir pessoas e ajudar a resolver problemas |
| **Liderar e vender** | convencer e negociar · liderar uma equipe ou um projeto · abrir e fazer crescer um negócio |
| **Organizar e analisar** | organizar planilhas, documentos e processos · controlar dinheiro, contas e números · garantir que regras e normas sejam cumpridas |

### 3. Talentos (2 telas, 4 frases por tela)
Escala: **Não sou eu · Um pouco · Sou eu · Muito eu**.

| Talento (Gardner) | Frase |
|---|---|
| Linguística | Eu me expresso bem falando ou escrevendo. |
| Lógico-matemática | Eu raciocino rápido com números e lógica. |
| Espacial | Eu visualizo as coisas antes de fazer: formas, mapas, layouts. |
| Corporal | Eu aprendo melhor fazendo, com as mãos ou o corpo. |
| Musical | Eu percebo ritmo, tom e som com facilidade. |
| Interpessoal | Eu entendo o que as pessoas sentem e me dou bem em grupo. |
| Intrapessoal | Eu me conheço bem e sei o que me motiva. |
| Naturalista | Eu reparo na natureza e gosto de observar e classificar coisas. |

### 4. Hobby ou caminho? (1 tela)
Para as 3 áreas e os 2 talentos mais fortes: **"Isso para você é… hobby · quero estudar · quero trabalhar com isso"**. O que for hobby continua no retrato, mas não vira alvo.

### 5. O que importa para você (1 tela)
Escolha até 3: estabilidade e segurança · ganhar bem · ajudar pessoas, propósito · liberdade de horário ou trabalho remoto · criar e inovar · crescer e ser reconhecido(a) · aprender sempre · tempo para família e fé.

### 6. Aprofundar (com o Claude, 3 a 5 perguntas)
Só **depois** da rodada ampla. O Claude faz perguntas de situação para **desempatar** as áreas fortes (ex.: "Investigar com dados ou investigar com pessoas?") e uma pergunta de **contrapeso** sobre uma área marcada como *a explorar*, para não fechar a bolha. Sem o Claude, esta etapa é pulada.

### 7. Espelho (1 tela)
- Mapa das 6 áreas e dos 8 talentos, em barras, com as notas de 0 a 100.
- Um parágrafo: "Você é alguém que…", ligado às respostas.
- Selos: **hobby**, **a explorar**.
- **"Isso parece você?"** Sim · Mais ou menos (a pessoa toca nas barras para subir ou descer) · Não (refaz a parte que não bateu).

### 8. Horizonte (1 tela)
- Em quanto tempo precisa de resultado: até 3 meses · 6 meses · 1 ano · 2 anos ou mais.
- O que pesa mais agora: renda logo · formação sólida · as duas coisas em paralelo.

### 9. O seu caminho
**Um alvo, um caminho:** o app recomenda **uma** rota (não um cardápio). Se a pessoa não concordar, ela pede um ajuste ou outra rota, explicando o motivo. A rota tem:
- **O que é** e **por que combina com você**, citando as respostas;
- **Requisitos:** exige faculdade? Qual? Certificação? Idade? Se o emprego exige faculdade, o cartão já indica a faculdade e um **emprego de entrada** que não exige, para fazer enquanto estuda;
- **Escada:** o degrau de agora, os próximos e o prazo realista com o tempo que a pessoa tem;
- **Custo** (começando pelo gratuito quando o dinheiro é curto) e **mercado** (onde há mais vagas);
- **Oportunidades:** buscas prontas (vagas, editais, vestibulares), que ligam com a etapa 4.

A rota pode **combinar** degraus (ex.: emprego de entrada + faculdade EAD), mas continua sendo um único caminho.

Exemplo de escada (o caso da Edna):
> **Analista de dados júnior.** Agora: SQL e Power BI gratuitos + portfólio com 3 projetos. Em 3 meses: ANBIMA CPA. Em 6 meses: estágio em dados (Serasa, PagBank, Sicoob). Em paralelo: a faculdade de Matemática que já cursa.

### 10. Alvo e projeto
- Escolher **um alvo** e até 3 **reservas** (como Serasa + PagBank, Mercantil…).
- Transformar em meta concreta: o quê, até quando, como medir.
- Nome do projeto, lema e prazo → o plano (rotina, matérias, metas, provas), que já existe hoje.

## Como pontua

- Cada cartão vale de 0 a 3 para a sua área. "Nunca experimentei" não entra na conta e marca a área como *a explorar*.
- Nota da área = soma ÷ máximo possível **das perguntas respondidas** × 100. Todas as áreas têm o mesmo número de cartões, então nenhuma ganha por ter mais perguntas.
- Código do perfil: as 3 áreas mais altas (ex.: *Investigar · Organizar · Criar*). É o código que o catálogo de carreiras usa.
- Os talentos e os valores **ordenam** as opções dentro do código. A realidade e o horizonte **filtram**: tira o que não cabe no prazo ou no bolso, ou mostra o degrau que cabe.

## Com e sem o Claude

| Parte | Sem o Claude (offline) | Com o Claude |
|---|---|---|
| Realidade, interesses, talentos, hobby, valores | Banco fixo de perguntas, pontuação no próprio app | Igual (o banco fixo garante a amplitude) |
| Aprofundar | Pulado | 3 a 5 perguntas de desempate + 1 de contrapeso |
| Espelho | Texto montado com as notas | Leitura personalizada |
| Caminhos | Catálogo local de cerca de 40 carreiras com código RIASEC, requisitos, degrau de entrada e prazo típico | Caminhos sob medida, com escada e oportunidades no Brasil |
| Plano | Modelos (concurso, ENEM, emprego, faculdade) | Plano completo sob medida |

## Onde o resultado fica

- No **perfil**: o retrato (notas, código, valores, hobbies) fica salvo e pode ser refeito em **Perfil e projeto**, quando os planos mudarem.
- No **projeto**: o alvo, as reservas e a escada viram metas e fases.
- No **chat do C laranja**: o Claude conhece o retrato e usa nas conversas.

## Ordem de construção

1. Portas de entrada, realidade, banco de interesses e talentos, pontuação local e Espelho (funciona sem IA).
2. Hobby ou caminho, valores, aprofundar com contrapeso.
3. Caminhos com requisitos e escada, catálogo local de carreiras, comparar e combinar.
4. Ligar às **Oportunidades** (etapa 4 da visão): buscas prontas de vagas, editais e vestibulares.
