# Ferramentas e tecnologias para o Yaad1 (pesquisa de 27/11/2026)

> Cada item foi conferido na fonte oficial em 27/11/2026. O filtro é o da mesa: só entra o que resolve uma necessidade real, aproxima a pessoa de uma oportunidade ou torna a evolução visível.
>
> **Limites do ambiente:**
> - O app no claude.ai só carrega scripts de CDNs liberados e não acessa outros sites direto do navegador. O acesso a sites passa pelo Claude, por conectores ou pelo servidor do site.
> - O site na Vercel não tem esses limites, mas a IA dele precisa de uma chave paga.

## A. Dá para usar já, de graça

| Tecnologia | O que resolve no Yaad1 | Como entra | Fonte |
|---|---|---|---|
| **FSRS** (algoritmo de repetição espaçada; biblioteca `ts-fsrs`, licença MIT) | As revisões hoje usam intervalos fixos (1, 3, 7, 14, 30 dias). O FSRS calcula, para cada assunto, o dia em que a pessoa está prestes a esquecer. No maior teste público, mesmo com os parâmetros padrão, errou cerca de metade do que erra o SM-2. Também permite **marcar a data da prova**, para nada ficar para depois dela | Script UMD pelo jsDelivr (CDN liberado), aplicado às revisões e às questões da preparação | github.com/open-spaced-repetition/ts-fsrs · azri.app/fsrs-vs-sm2 |
| **Fórmulas bonitas no quadro** (KaTeX no modo MathML, ou MathML nativo do navegador) | Matemática da prova (frações, porcentagem, potências) aparece como fórmula de verdade, e não como texto em fonte mono | KaTeX com `output: "mathml"` dispensa CSS e fontes externas, que o app não pode carregar | katex.org |
| **Mapas e rotas pelos seus conectores** (TomTom, Mapbox) | O Radar passa a dizer "Caracaraí fica a 1h40 de carro", em vez de "pode ser longe". Distância real, não chute | Capacidade `mcp` com os conectores já ligados na conta da dona | conectores ativos nesta conta |
| **Lembrete na agenda do celular** (arquivo `.ics`) | O passo do dia e as datas da frente (inscrição, taxa, prova) vão para a agenda do celular, com alarme. Funciona em Android e iPhone, sem conta e sem custo | Capacidade `downloads` (o app já tem) gera o arquivo | padrão iCalendar |
| **Ditado e voz do Claude** | Já em uso (assistente que age, Sala viva com vozes) | Feito em 27/11 | — |

## B. Precisa do site (servidor), quase sem custo

| Tecnologia | O que resolve | Observação | Fonte |
|---|---|---|---|
| **Querido Diário (API pública)** | O Radar encontra **seletivos e concursos de prefeituras** publicados nos diários oficiais municipais, justamente o que ninguém divulga em cidade pequena | Grátis, sem chave, referência de 60 pedidos/minuto. O endereço novo é `api.queridodiario.org.br`. A cobertura ainda **não inclui muitas cidades pequenas**, então é preciso conferir Roraima. Há um servidor MCP comunitário (`querido-diario-mcp-server`) | docs.queridodiario.ok.org.br · pypi.org/project/querido-diario-mcp-server |
| **API ENEM (enem.dev)** | **Questões reais** do ENEM de 2009 a 2023 (mais de 2.700), com gabarito, para quem mira o ENEM. Treino com prova de verdade, não só questão criada pela IA | Comunitária e gratuita; código com licença GPL-2.0. O INEP publica as provas e os gabaritos de todos os anos, inclusive 2026 (divulgados em 18/11) | enem.dev · gov.br/inep |
| **Notificações no celular (Web Push)** | "Faltam 3 dias para a inscrição", "seu passo de hoje": o app chama a pessoa de volta | Funciona no Android. No iPhone, só se a pessoa adicionar o site à tela de início (iOS 16.4+). Precisa do site como PWA | developer.apple.com · firt.dev/notes/pwa-ios |
| **PostHog** (análise de uso, plano grátis de 1 milhão de eventos por mês) | Medir a métrica da mesa (quantas pessoas voltam depois de uma pausa, quantas concluem a próxima ação) com dados, não com impressão | Plano grátis permanente, sem cartão | posthog.com/pricing |
| **Mapa de verdade** (Leaflet + OpenStreetMap) | O "Radar da vida real" com alfinetes no mapa da região, como na imagem de referência | No site, sim. No app do claude.ai, as imagens do mapa são bloqueadas. Exige crédito ao OpenStreetMap | leafletjs.com |
| **Google Play com o mesmo código** (Capacitor ou TWA) | Levar o Yaad1 para a loja, com notificações nativas | Depende do site como PWA. Taxa única da Play Store | capacitorjs.com |

## C. Custa dinheiro: avaliar quando houver receita

| Tecnologia | O que resolve | Custo verificado |
|---|---|---|
| **WhatsApp (API oficial da Meta)** | Lembretes onde o brasileiro realmente está | R$ 0,035 por mensagem de utilidade (tabela de 01/10/2026). Exemplo: 30 lembretes por mês custam cerca de **R$ 1,05 por pessoa**. Exige conta empresarial verificada |
| **Bancos de questões de concursos** (Quest API, APIdasQuestões) | Questões reais de bancas (Cesgranrio, FGV, Cebraspe) por cargo e órgão | Planos pagos, cobrados por crédito |
| **Chave de IA do site** (Claude pela API, ou Gemini no plano grátis só para testes) | Radar automático semanal, assistente no site para outras pessoas | Ver `projetos/yaad1-site/IA-GRATUITAS.md` |

## Recomendação (ordem de impacto ÷ esforço)

1. **FSRS:** o app passa a saber quando cada pessoa vai esquecer cada assunto. É ciência de memória de verdade, de graça.
2. **Distância real no Radar (TomTom):** resolve o "pode dificultar" com dados.
3. **Lembretes na agenda (.ics):** o app entra no dia a dia sem custo.
4. **Fórmulas no quadro (MathML):** questões de matemática legíveis.
5. Quando o site tiver servidor:
   - Querido Diário: seletivos de prefeituras.
   - API ENEM: questões reais.
   - Web Push: notificações no celular.
   - PostHog: medir as métricas da mesa.

## D. MCPs, repositórios, skills e plugins (pesquisa de 27/11/2026)

### Para o app usar (dar dados reais ao Yaad1)

| Item | O que traz | Como entra | Fonte |
|---|---|---|---|
| **MCP oficial da Gupy para candidatos** | Busca de **vagas reais** da Gupy (um dos maiores portais do Brasil), grátis. A Gupy também oferece skills de análise de currículo e de radar de vagas | A dona adiciona o conector personalizado `https://candidates.mcp.api.gupy.io/mcp` no claude.ai. Depois, o Radar do app passa a chamá-lo pela capacidade `mcp`. É preciso conferir as ferramentas e a autenticação depois de conectado | candidatos.gupy.io/ia-para-pessoas-candidatas |
| **mcp-brasil** (MIT) | Um servidor MCP com 70 fontes públicas brasileiras e 533 ferramentas: IBGE, Banco Central, Portal da Transparência, Câmara, Senado e outras | Precisa de servidor próprio (Python). Serve ao site, ou a mim durante o desenvolvimento | github.com/Mcp-Brasil/mcp-brasil |
| **querido-diario-mcp-server** (comunitário) | Diários oficiais municipais, incluindo os seletivos de prefeituras | Roda localmente (Python), ou a API direto no site | pypi.org/project/querido-diario-mcp-server |
| **Google Agenda** (conector do diretório do claude.ai, ainda não instalado) | O assistente que age poderia **criar os eventos direto na agenda**, sem baixar arquivo | A dona conecta no claude.ai; o app declara o conector | diretório de conectores do claude.ai |
| **TomTom Maps** (já conectado) | Distância e tempo de viagem reais no Radar | Capacidade `mcp` | — |

### Repositórios para estudar e reaproveitar ideias

| Repositório | Por que importa |
|---|---|
| `Mateus-Nogueira-GT/ai-job-search-brasil` (MIT) | Busca de vagas na Gupy e no VAGAS.com.br, calculadora CLT × PJ, currículo e candidaturas no padrão brasileiro, feito para o Claude Code. É uma base para o **Currículo Vivo** e para "preparar candidatura" |
| `leonardobora/gupy-candidate-mcp` (MIT) | MCP que cruza o perfil da pessoa com os requisitos da vaga (pontuação de aderência) e monitora prazos. É a ideia do "por que apareceu para você" |
| `gustavobraga-byte/Skill-IBGE` (MIT) | Skill com todas as APIs públicas do IBGE |
| `zijinz456/OpenTutor` (MIT) | Tutor adaptativo com FSRS, grafo de conhecimento e detecção de fadiga. Referência para a próxima onda |
| `open-spaced-repetition/ts-fsrs` (MIT) | A referência do FSRS que implementamos |
| `yunger7/enem-api` (GPL-2.0) | API de questões reais do ENEM (usar pela API pública, sem copiar o código) |

### Plugins do catálogo do claude.ai (para eu construir melhor)

| Plugin | Para quê |
|---|---|
| **Claude Education Skills Library** (165 skills pedagógicas) | Inclui geradores de prática de recuperação, escada de pistas, intenção de implementação (o plano se-então), diagnóstico de erro e agendador de prática espaçada. São métodos com evidência para a Sala de aula, a Sala viva e o Assistente |
| **Pwa2play** | Empacotar o site como app assinado para a **Play Store**, evitando os erros que fazem a loja recusar |
| **Ágora Learning** | Plano de 12 semanas, tutor socrático, FSRS e modo para TDAH. Boas ideias para comparar |
