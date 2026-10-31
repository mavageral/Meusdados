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

## Um alvo, um caminho (31/10/2026)

**Yaad1 = um alvo, um caminho.** O app não entrega um cardápio de caminhos: ele interpreta a pessoa e traça **uma rota única**, explicada a fundo, na qual ela pode confiar todos os dias. A pessoa continua no controle (pode ajustar ou pedir outra rota), mas o app sempre recomenda **um** caminho.

Por quê: esta geração quer resultado imediato, e o resultado real (o salário de 16 mil, o emprego, a aprovação) vem de uma rotina diária de horas de estudo que, no dia a dia, nem sempre parece ligada ao alvo. Por isso o app precisa **destrinchar** o caminho e mostrar, em cada bloco da rotina, **por que ele leva ao alvo**. A confiança na rotina é parte do produto.

**Duas formas de entrar:** responder ao quiz, ou **descrever com as próprias palavras** o que quer, onde quer chegar e do que gosta. Nesse caso o Claude lê, faz perguntas até o alvo ficar claro e segue para a rotina.

**Oportunidades ao vivo:** nem todo mundo chega direcionado, então o app precisa **mostrar oportunidades reais** (editais, vagas, cursos, preços). Isso usa os conectores do claude.ai que a página pode chamar (capacidade `mcp`), como o **Parallel Search** (busca na internet, gratuito e sem conta). Sem o conector, o app volta às buscas prontas e aos links oficiais.

## O projeto da Edna e as pessoas novas (31/10/2026)

- **O Projeto Caverna da Edna está consolidado** e não muda com o que é construído para novos usuários. A dona do app abre sempre no Caverna, como antes.
- **Pessoas novas** (qualquer conta que não seja a dona) entram por uma **apresentação deslizante** do app e caem numa tela inicial vazia que diz: **comece pelo perfil e projeto, responda o quiz**. Não veem nada do Caverna.
- Cada pessoa tem os próprios dados, privados na conta dela (`data/users/<id>`). Não há conflito com os dados da Edna.

## Nada fica engessado: remodelar projeto

Depois de cada resultado (o plano do quiz, o diagnóstico), a pessoa diz **o que achou**. Se não concordar, ela escreve o que não concordou ou o que o app precisa entender, e toca em **Remodelar projeto**. O Claude refaz rotina, matérias, fases e metas, mostra a proposta e só aplica com o OK dela. As observações se acumulam e ajudam nas próximas vezes. O que já passou fica registrado como era.

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

## Caminho de lançamento (31/10/2026)

O foco é virar um **aplicativo lançado na Play Store e na App Store**. Até lá:

| Fase | Onde roda | Quem usa | O que muda |
|---|---|---|---|
| **1. Agora** | Artifact no claude.ai | A Edna, no dia a dia | Validar o método no Projeto Caverna. IA e busca vêm da conta Claude e dos conectores dela. |
| **2. Site** | URL própria (Vercel) | Primeiras pessoas de fora | Cadastro com e-mail e telefone, banco de dados (Supabase ou Neon), IA e **busca na internet pelo servidor**, para todos, sem a pessoa ligar conectores. |
| **3. Lojas** | Play Store e App Store | Público | O mesmo app empacotado (PWA + Capacitor), com notificações reais (lembretes da rotina) e assinatura. |

**Andamento (31/10/2026):** a fase 2 começou. O site está no ar em https://yaad1-mavageralcorp-6011s-projects.vercel.app, com login próprio (e-mail e senha, 2 etapas, criar conta, esqueci a senha, sair), banco Supabase `yaad1` em São Paulo e a IA pela API da Anthropic (falta a chave da dona). Detalhes em `projetos/yaad1-site/README.md`.

**Regras para não travar a passagem:** a lógica do método (quiz, plano, metas, medidor) fica separada da tela e do armazenamento; tudo que hoje depende do claude.ai (IA, banco, busca) passa por funções pequenas que poderão ser trocadas por um servidor próprio.

## Login e compartilhamento

Publicado no claude.ai, o app já tem **login**: cada pessoa entra com a própria conta Claude, e os registros de cada uma ficam **privados** (`data/users/<id>`). Para outra pessoa usar:
- a dona do app compartilha o link pelo menu Compartilhar do claude.ai;
- cada pessoa usa o próprio Claude para as aulas, provas e conversas (o uso sai da conta dela).

Um app próprio, com cadastro por e-mail e telefone fora do claude.ai, é outro passo: hospedagem (Vercel), banco de dados (Supabase ou Neon), autenticação e uma chave de API da IA com custo. Fica para quando o produto estiver validado.

## Limites honestos

- **Busca ao vivo:** o Claude do app só pesquisa na internet quando a pessoa tem um conector de busca ligado no claude.ai (ex.: Parallel Search). Sem ele, o app usa buscas prontas e links oficiais. No app próprio (Vercel), a busca passa a ser do servidor, para todos.
- **Prazos de concursos e vestibulares** mudam: o app sempre manda confirmar no site oficial.

## A jornada

O que o app entrega, alvo por alvo, e o que o quiz precisa perguntar para isso: [JORNADA.md](JORNADA.md). A ordem de construção atualizada também está lá (fases A a E).

## Ordem de construção sugerida

1. **Carteira + menu ⋯ + Perfil e projeto** (dados, foto, e-mail, telefone). O Projeto Caverna vira o projeto da Edna, editável.
2. **Quiz de direção** com o Claude: autoconhecimento → caminhos → meta → nome → proposta de rotina e projeto. Método detalhado (a **Bússola**) em [QUIZ-DIRECAO.md](QUIZ-DIRECAO.md).
3. **Gerador de projeto:** a agenda, as matérias, as metas e as provas deixam de ser fixas no código e passam a vir do projeto de cada pessoa (com modelos: faculdade, concurso, ENEM e vestibular, emprego, autodescoberta).
4. **Oportunidades:** buscas prontas de vagas e concursos ligadas à meta.
5. **Compartilhar:** testar com 1 ou 2 pessoas de realidades diferentes.
