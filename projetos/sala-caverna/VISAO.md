# Yaad1: visão central do app

**Nome:** Yaad1, de *ya'ad*, que em hebraico significa alvo, destino. Um app de direção para acertar o alvo.

## Um app de direção

> Registrado em 31/10/2026, nas palavras da Edna (resumidas). **Este é o propósito central do aplicativo.** Toda decisão de produto e de design deve servir a ele.

## O propósito

**Direcionar, organizar, maximizar resultados e acertar alvos.**

Na internet existe conhecimento suficiente para formar qualquer pessoa: passar em concurso, entrar na faculdade, fazer um curso, conseguir emprego. Falta organizar e direcionar. O app é como um **curso preparatório com inteligência artificial que se molda à realidade de cada pessoa**. É um app **vivo**, com empatia e vontade de ajudar, que:

1. **entende** a pessoa (rotina, interesses, idade, momento de vida, o que ela já estuda);
2. **explica para ela mesma** onde ela se encaixa melhor, quando ela ainda não sabe;
3. **mostra as oportunidades** (empregos, concursos, vestibulares, cursos, certificações);
4. **ajuda a escolher uma meta** de médio ou longo prazo;
5. **cria o projeto e a rotina** até essa meta, com prazo realista ("em tantos dias você pode chegar lá");
6. **ensina, cobra prova, revisa e mostra a evolução** até o objetivo (tudo o que o Projeto Caverna já faz).

O Projeto Caverna da Edna é o **primeiro projeto** e o modelo de tudo. Outras pessoas têm outras realidades e terão os seus próprios projetos.

## Para quem

Qualquer realidade:
- quem faz faculdade (como a Edna) e quem não faz;
- quem está no ensino médio e quer o ENEM ou um vestibular específico (ITA, por exemplo): banca, provas passadas, simulados;
- quem se formou, está desempregado e quer **concurso**: rotina focada, simulados, gabaritos, erros e evolução;
- quem não quer estudar muito, mas quer **emprego**: onde há mais vagas, que cursos precisa, como se destacar;
- quem **não sabe o que quer**: autodescoberta;
- projetos de outra natureza, inclusive religiosos.

## Como a pessoa entra: Perfil e projeto

Pelo menu de três pontinhos, em **Perfil e projeto** (nome provisório):

1. **Dados:** nome completo, foto (galeria), e-mail e telefone.
2. **Quiz de autoconhecimento**, intuitivo, nunca cansativo, uma pergunta por tela (referência 4):
   - Rotina: que horas acorda, se trabalha, se estuda, horários livres, prioridades inegociáveis (fé, família, saúde).
   - Momento: idade, escolaridade, o que já cursa.
   - Desejo: concurso, mercado de trabalho, faculdade, curso, ENEM e vestibular, ou "não sei".
   - Afinidades: exatas, humanas, biológicas, tecnologia, negócios… Se a pessoa não souber, o app faz perguntas criativas até entender o que mais a interessa.
   - A pessoa também pode **escrever livremente**; o app salva e se adapta.
3. **Direção:** o Claude explica onde a pessoa se encaixa, mostra caminhos e oportunidades e ajuda a escolher **uma meta**.
4. **Projeto:** a pessoa dá nome ao projeto (como "Projeto Caverna") e vê a proposta: meta, prazo, fases, matérias, provas e rotina.
5. **"Salvar perfil e criar a rotina do projeto"** inicia o projeto. Daí em diante, o app entrega tudo o que entrega hoje para a Edna.

## A tela inicial: a carteira

No lugar do "Bom dia + fotinho", uma **carteira** (cartão de identidade do projeto):
- foto, nome, nome do projeto e lema;
- meta central, dia X de N e quanto falta;
- uma mensagem palpável do **quão perto** a pessoa está do objetivo;
- botão de três pontinhos (⋯).

### Menu ⋯ (proposta)
1. **Perfil e projeto:** dados, quiz, meta, nome do projeto, rotina. Refazer quando os planos ou as rotas mudarem.
2. **Minha evolução:** relatório completo, até onde chegou e o que melhorar.
3. **Documentos:** ementas, certificados, diplomas e prints de matérias, que alimentam a sala de aula.
4. **Assinatura e plano:** futuro, se houver pagamento.
5. **Compartilhar o app:** convidar outra pessoa.

## Login e compartilhamento

Publicado no claude.ai, o app já tem **login**: cada pessoa entra com a própria conta Claude, e os registros de cada uma ficam **privados** (`data/users/<id>`). Para outra pessoa usar:
- a dona do app compartilha o link pelo menu Compartilhar do claude.ai;
- cada pessoa usa o próprio Claude para as aulas, provas e conversas (o uso sai da conta dela).

Um app próprio, com cadastro por e-mail e telefone fora do claude.ai, é outro passo: hospedagem (Vercel), banco de dados (Supabase ou Neon), autenticação e uma chave de API da IA com custo. Fica para quando o produto estiver validado.

## Limites honestos

- **Vagas "em tempo real":** dentro do app, o Claude não navega na internet. O app pode montar buscas prontas (LinkedIn, Gupy, Vagas.com, portais de concursos) e o Claude orienta com o que sabe. Dados realmente ao vivo exigem uma fonte externa (API ou integração), a decidir.
- **Prazos de concursos e vestibulares** mudam: o app sempre manda confirmar no site oficial.

## Ordem de construção sugerida

1. **Carteira + menu ⋯ + Perfil e projeto** (dados, foto, e-mail, telefone). O Projeto Caverna vira o projeto da Edna, editável.
2. **Quiz de direção** com o Claude: autoconhecimento → caminhos → meta → nome → proposta de rotina e projeto.
3. **Gerador de projeto:** a agenda, as matérias, as metas e as provas deixam de ser fixas no código e passam a vir do projeto de cada pessoa (com modelos: faculdade, concurso, ENEM e vestibular, emprego, autodescoberta).
4. **Oportunidades:** buscas prontas de vagas e concursos ligadas à meta.
5. **Compartilhar:** testar com 1 ou 2 pessoas de realidades diferentes.
