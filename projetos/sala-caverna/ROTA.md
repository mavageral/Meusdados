# Motor ROTA: primeira jornada integrada (27/11/2026)

> Execução do "Conselho de inovação" (documento externo trazido pela Edna, com debate **simulado** e um prompt mestre para o Claude Code). Este arquivo registra a auditoria, o que foi construído, as decisões técnicas e o que ficou para depois. Antecedentes: [MESA-PALPAVEL.md](MESA-PALPAVEL.md), [DIRECIONAMENTO.md](DIRECIONAMENTO.md) e [MESA-BUSSOLA.md](MESA-BUSSOLA.md).

**ROTA = Realidade · Oportunidades · Trajetórias · Ação.** O ciclo é: compreender → descobrir → comparar → agir → recalcular, sempre com a aprovação da pessoa.

## 1. Auditoria: o que já existia (e foi reaproveitado)

| Peça | Onde | Uso no ROTA |
|---|---|---|
| App de arquivo único | `projetos/sala-caverna/index.html` (Artifact) | Base de tudo |
| Site | `projetos/yaad1-site/`, gerado por `ferramentas/build-site.py`; Vercel, Supabase com RLS e 2FA, `api/claude.js` com busca e leitura web no servidor | Mesma tela, IA e busca pelo servidor |
| Busca ao vivo | conector Parallel Search (app) ou servidor (site): `ferramentasBusca()` | **R**adar e leitura de edital |
| Oportunidades, frentes e destino | 26/11 | **O** e **A**: virou a jornada |
| Quiz de direção (Bússola) e Mapa do alvo | 31/10 | Para quem precisa descobrir |
| Remodelar projeto | menu ⋯ | Ligado ao "Minha vida mudou" em projetos próprios |
| Sala de aula, Sala viva, revisões, Forja e simulados | Estudar | Cada passo de frente abre a sala de aula normal |

**Não existe** `package.json`, framework nem testes automatizados no app: ele é um HTML único. Os testes são feitos com Playwright e dados simulados (ver item 5).

## 2. O que foi construído

### Ponto de Partida (menu ⋯, tela de boas-vindas e jornada)

Cinco perguntas, uma por tela, todas possíveis de pular:
1. Situação de vida.
2. O que é mais urgente agora.
3. O sonho, em uma frase.
4. Tempo por dia.
5. Cidade.

O resultado é o **mapa inicial**: Faixa Agora, Faixa Sonho, Ponte e próxima ação. Ao salvar, o app abre a lente certa do Radar ou, se a pessoa ainda não sabe o sonho, o Quiz de direção.

### Jornada na tela inicial (acima da agenda, que continua igual)

- O destino: a frente ativa, ou o sonho, ou "Qual é o próximo passo da sua vida?".
- A estrada **Descobrir → Preparar → Conquistar → Evoluir**.
- A contagem até o próximo marco e a trilha com datas.
- **Hoje: N min ·** o passo, em um único botão. A frente vem primeiro; depois, o próximo bloco de estudo da agenda; depois, o Ponto de Partida ou o Radar.
- Abaixo: **Duas Faixas**, **Radar da vida real** (até 2 oportunidades com "Fonte oficial", prazo e data em que foram conferidas) e **Assistente de rota**.

### Minha vida mudou (Recalculadora de Rota)

São sete situações: trabalho novo, perdi o trabalho, semana pesada, família ou saúde, mudei de cidade, perdi a vontade e outra coisa. Em todas:
- O app mostra **antes → depois** (ritmo, tempo e dias de cada frente, situação, prioridade, cidade) e "o que não muda".
- A pessoa escolhe **Aplicar**, **Ajustar** ou **Agora não**.
- Cada decisão fica em `M.rota.planos`, inclusive as recusadas.

Os **ritmos** (Modo Vida Real) são quatro:

| Ritmo | O que significa |
|---|---|
| Avançar | rotina completa |
| Manter | 20 min por dia |
| Proteger | 5 min por dia |
| Pausa combinada | nada fica atrasado até a data de volta |

Os ritmos com data de volta retornam sozinhos ao anterior. Os passos do dia respeitam o ritmo.

"Perdi a vontade" oferece três saídas: uma semana leve, um recomeço na segunda-feira (efeito recomeço) ou conversar com o Claude.

Nos projetos próprios, a Recalculadora oferece seguir para o **Remodelar projeto** com o texto já preenchido. Nada foi duplicado.

### Radar com ficha confiável

Cada oportunidade agora traz:
- por que apareceu;
- **o que pode dificultar** (distância, custo, horário, internet, documentos);
- as competências que desenvolve;
- a ponte para o sonho.

A busca considera a viabilidade para a realidade da pessoa. A **Ponte** e as competências passam para a frente criada.

### Edital: critério oficial de eliminação

O app lê o critério oficial de eliminação do edital (por exemplo, "18 de 60 pontos e pelo menos 1 em cada matéria") e o mostra **sem prometer aprovação**: "o app mede o seu treino em relação a ele, mas só a prova decide".

### O progresso nunca é apagado

A rota muda o ritmo e as prioridades, nunca os registros de estudo, revisões ou pontos.

## 3. Modelo de dados (no documento `main` de cada pessoa, já isolado por usuário)

```
M.rota = {
  ctx:     {situacao, prioridade, sonho, min, data},   // memória de situação (corrigível no Ponto de Partida)
  marcha:  "avancar" | "manter" | "proteger" | "pausa",
  ate, volta,                                          // ritmo temporário e para onde volta
  eventos: [{d, tipo: "partida" | "vida" | "volta", ...}],
  planos:  [{d, tipo, status: "aplicado" | "recusado", antes, depois}]   // versões do plano
}
M.profile.local = {cidade, uf}
M.frentes[] += {ponte, competencias, corte}
M.oport[lente] = {itens: [... barreiras, competencias ...], data}
```

No site, `M` é gravado no Supabase pelo shim, com RLS e 2FA já em vigor. **Não foi preciso criar tabela nem migração.**

## 4. Decisões técnicas e correções ao documento do conselho

1. **Sem novas dependências.** O app não tem build. Vercel AI SDK, filas, Docling, Promptfoo e outros orquestradores **não** foram instalados, porque nada no fluxo atual precisa deles. Entram quando houver uma necessidade demonstrada.
2. **Regras determinísticas no aparelho; IA só onde precisa de fonte.** A IA entra no Radar e na leitura do edital. A Recalculadora não usa IA: é previsível, funciona sem internet e não envia dados pessoais.
3. **Radar compartilhado por região, não um agente por pessoa.** Isso fica para o site (Fase 2): busca por município e fonte, cache e depois personalização. No app, cada busca usa o conector da própria pessoa.
4. **API de localidades do IBGE não calcula deslocamento.** Ela só padroniza os municípios. A distância entra como "pode dificultar", em texto, até haver um serviço de rotas.
5. **Emprega Brasil e Sine:** não há API pública de vagas documentada; a integração não é presumida.
6. **Sem promessa de aprovação.** A Régua mostra o critério do edital; a estimativa por treino fica para quando houver base de questões suficiente.
7. **Datas e versões citadas no documento externo** (por exemplo, a versão do AI SDK e a data de documentação das filas do Supabase) não foram verificadas aqui e não orientaram decisões.

## 5. Testes executados (Playwright, dados simulados, 375 e 390 px)

- Jornada aparece para o projeto da dona sem alterar a agenda.
- Ponto de Partida completo, depois o mapa, depois o Radar aberto na lente "Renda agora".
- "Quero essa", depois a frente, depois a jornada com o destino, a estrada, a contagem, a trilha e o passo.
- Trabalho novo com 20 min: a proposta mostra antes → depois, ao aplicar o ritmo fica "Manter" e o passo cai para 20 min.
- Família ou saúde com pausa de 7 dias: o passo mostra "Pausa combinada até 4/12. Nada fica atrasado."
- Semana pesada, depois "Agora não": fica registrada como recusada e nada muda.
- Nenhum erro de JavaScript e nenhuma rolagem lateral.

## 6. Fica para as próximas ondas

| Onda | O quê |
|---|---|
| 2 · Mundo | Radar semanal no servidor por município (Querido Diário e busca, com cache e deduplicação); avisos no celular |
| 3 · Desenvolvimento | Diagnóstico ligado à frente; Régua com estimativa; Corrida da Prova; Caça ao Erro na Forja; Currículo Vivo e mapa de competências; simulador de cenários |
| 4 · Ecossistema | Turma de 5, Pontos de Apoio, perfil comprovável opcional, modo de baixa conexão completo |

**Consolidações pendentes:** unir a missão do dia ao passo de hoje, e as frentes a "Meus projetos" (como projetos paralelos).

**Métrica principal:** a pessoa conclui uma próxima ação em até 14 dias depois de começar ou retomar uma trajetória.

## 7. Início (27/11/2026, depois da crítica da dona: "parece que não mudou nada")

O erro foi acrescentar a jornada **em cima** do painel antigo: a tela ficou mais longa e continuou com cara de aplicativo de banco. A tela inicial agora é outra:

- **Imagem real do destino** em tela cheia. São 5 cenas geradas para o Yaad1 no Figma: campo/recenseador em Roraima, estudo à noite, profissional de dados, família e biblioteca. O app escolhe a cena pelo momento (frente, sonho, ritmo, hora do dia); a foto da própria pessoa tem prioridade.
- **Um passo**: o número grande de minutos e "Começar agora".
- **Seu caminho até lá**: a trilha de marcos com datas.
- **Para você agora**: cartões com foto que deslizam (Radar, sonho, semana com 7 bolinhas, "Sua rotina mudou?").
- **Ainda hoje**: só os 3 próximos blocos da agenda.
- **"Ver o dia completo e o painel"** abre a tela antiga inteira, sem perder nada. Tocar em "Hoje" volta ao Início.

## 8. Sua preparação (27/11/2026): o app passa a saber o quanto a pessoa sabe

- **Questão na tela inicial**, uma por vez, no estilo da banca do alvo. A banca vem do edital (a frente guarda `banca`); sem frente, o app usa as matérias do projeto. A resposta e a explicação aparecem ali mesmo.
- **Gabarito conferido:** cada lote de 6 questões é resolvido uma segunda vez pelo Claude, sem ver o gabarito. Só ficam as que batem; as outras são descartadas. Se a conferência falhar, a questão aparece marcada como "gabarito não conferido".
- **Domínio por matéria do edital** calculado só das últimas 20 respostas reais de cada matéria. Matéria sem treino aparece como "sem treino ainda", nunca com porcentagem inventada.
- **Estimativa de pontos** (domínio × número de questões de cada matéria) só aparece com 5 ou mais respostas em cada matéria, com o critério do edital ao lado e o aviso de que é uma estimativa do treino, não uma garantia.
- **O passo de hoje vai para a matéria mais fraca**, a partir de 10 respostas; o passo diz "onde você mais erra no treino".
- **Os erros vão para a Forja** (`logErro`), o que alimenta a Caça ao Erro no futuro.
- **Conquistas por fatos reais** (10): ponto de partida, primeira questão, 10 e 50 questões, 5 seguidas, inscrição feita, taxa paga, semana de 5 dias, retomada depois de pausa e 70% numa matéria.
- Testado (Playwright, 375 e 390): lote com uma questão de gabarito divergente ficou com 5 das 6; erro registrado na Forja; estimativa só depois de 5 respostas por matéria; passo redirecionado; sem erros e sem rolagem lateral.

**Próximo:** Currículo Vivo (competências das frentes e das conquistas), Corrida da Prova e mapa no Radar.

## 9. Assistente que age, com voz (27/11/2026)

O botão **C** deixou de ser um chat e virou o **Assistente Yaad1**, um agente:

- **Ouve:** o ditado do claude.ai (capacidade `dictation`). Você fala, toca de novo e a mensagem é enviada.
- **Age no app** com ferramentas (tool use do `sample`), em três níveis de autonomia:
  - observar: `ver_minha_situacao`, e a busca e leitura na internet;
  - preparar: `propor_ritmo`, `propor_tempo_da_frente`, `marcar_marco`, `atualizar_momento`, `abrir_tela`;
  - executar: só com o toque da pessoa em **Aplicar**. "Agora não" fica registrado e nada muda.
- **Fala:** a voz do Claude (capacidade `tts`), que se liga no alto-falante do topo. A preferência fica no aparelho.
- **Sala viva com vozes:** cada personagem tem a sua voz do Claude. Professor: buttery. Lia: airy. Davi: glassy. Ana: rounded. Téo: glassy, mais lento. Beto: airy, mais rápido.
- **Sem voz do Claude** (no Safari e nos apps de celular, a plataforma não oferece), o app volta à voz do navegador. **Sem ditado**, o microfone some e a pessoa escreve.
- Capacidades declaradas: `mcp` (Parallel Search), `sample` (com imagens), `assets`, `db`, `downloads`, `user`, `dictation` e `tts`.
- Testado (Playwright, 375 e 390, com ditado e voz simulados): fala, depois 3 propostas, aplicar uma, recusar outra, resposta falada; sem erros.

**Fica para depois:**
- Radar com distância real: conector TomTom (rotas) ou Mapbox.
- Passo do dia no Google Agenda: via Zapier.
- Turma ao vivo: capacidade `room`.

## 10. FSRS e agenda do celular (27/11/2026)

- **Revisões pelo FSRS-4.5** (algoritmo aberto da comunidade open-spaced-repetition, MIT), implementado no próprio app com os parâmetros padrão, sem dependência externa. Cada assunto guarda a estabilidade S e a dificuldade D. A próxima revisão cai no dia em que a chance de lembrar chega a 90%, **sem passar da data da prova** da frente ativa. A nota da revisão vira o grau do FSRS: abaixo de 50% é "esqueceu"; abaixo de 75%, "difícil"; abaixo de 100%, "bom"; 100% é "fácil". As revisões antigas migram usando o intervalo que já tinham como estabilidade inicial.
- Exemplo testado: bom → 4 dias, bom → 15, bom → 50, esqueceu → 6, bom → 17, fácil → 99. Com a prova em 13 dias, o intervalo foi limitado a 12.
- **"Pôr na minha agenda"** na tela da frente gera um arquivo `.ics` (padrão iCalendar), entregue pela capacidade `downloads`. O arquivo traz:
  - cada marco futuro como evento do dia, com alarme às 9h da véspera;
  - o estudo semanal nos dias e no período escolhidos, até a prova, com alarme 10 minutos antes.

## 11. Distância real no Radar (27/11/2026)

- Conector **TomTom Maps** da própria pessoa (capacidade `mcp`, ferramentas `tomtom-geocode` e `tomtom-routing`). O app localiza a cidade de casa e a da oportunidade e calcula a rota de carro.
- O cartão mostra, por exemplo, "30 min de carro · 43 km" (Iracema → Caracaraí, medido de verdade em 27/11 pela BR-174) ou "Na sua cidade". Oportunidades remotas não recebem distância.
- Coordenadas e rotas ficam guardadas (`M.geo`, `M.dist`) e não se repetem chamadas. Sem o conector (ou no site), o cartão simplesmente não mostra distância.
- Testado (Playwright, 375 e 390): 4 oportunidades, 5 chamadas na primeira abertura e 0 ao reabrir; sem erros.
