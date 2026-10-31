# Catálogo de referências

Análise de cada referência enviada. As cores e fontes dos arquivos `.fig` e `.sketch` foram **medidas** (decodificando os arquivos e contando o uso de cada cor ou fonte). As das imagens foram **observadas**.

> Os arquivos originais (`.fig`, `.sketch`, `.ai`, `.eps`) e as imagens de inspiração **não estão no repositório**. Ele é público, e as licenças (Symu, Freepik, Dribbble/Pinterest) proíbem redistribuir. Guarde-os em `design-lab/fontes-privadas/`, que o Git ignora.

## Mapa rápido: projeto → tema

| Se o projeto é… | Tema | Estilo no ui-ux-pro-max |
|---|---|---|
| Painel de carro, IoT, jogo, quiz | `neon-noir` | Dark Mode (OLED), Gamification |
| Hábitos, metas, produtividade | `sol-grafite` | Dark Mode, Data-Dense Dashboard |
| Finanças pessoais, assinaturas | `ardosia-coral` | Dark Mode, Fintech |
| Saúde, bem-estar, fitness, clínica | `salvia-vidro` | Glassmorphism, Soft UI |
| IA, chat, onboarding, social | `brasa` | Aurora UI, Dark Mode, Vibrant |
| Métricas de saúde, mídia, painel pessoal | `aurora` | Aurora UI, Bento Grid |
| Reservas, viagens, serviços, utilitários | `oceano` | Flat Design, Minimalism |
| Painel de estudos, agenda, escola | `oceano` (layout do Student Activities) ou `sol-grafite` | Data-Dense Dashboard |
| Mensagens, comunidade, perfis | `lavanda` | Flat Design, Soft UI |

## Arquivos de design (medidos)

### Car Assistant Dashboard UI Design (`.fig`): base do **neon-noir**
- Tela única 1440×1024, painel de carro em grade de cartões.
- Cores: `#1E1E1E` (fundo e cartões), **`#CFF80B`** (verde-limão, único destaque), `#87888C` (texto secundário), `#FF2257` (alerta).
- Fonte: **Poppins** (Medium predominante), tamanhos 10–16 e números grandes de 30+.
- Padrões: velocímetro em arco, mapa com rota em gradiente, controles de clima com slider, player de música, ícones redondos na barra inferior.

### Bolt Runner Fitness (`.fig`)
- 55 imagens, telas `01_splash`, `02_login`, `03_home`, `04 ecommerce`, `05 details`, `06 categories`, `07 listing`.
- Cores: `#180F20` (roxo quase preto), **`#68B7C1`** (turquesa, primária), **`#F8B800`** (amarelo, secundária), `#774C9E`.
- Fontes: **Circular Std** (substituto livre: DM Sans), Poppins, Bebas Neue em títulos.
- Tem um guia de estilo próprio: H1 30, H2 24, H3 20, H4 18, Title 16, Body 14, Label 13, Caption 12. **Essa escala inspirou a nossa.**

### Trackizer (`.fig`, Symu): base do **ardosia-coral**
- 40+ telas completas: login, cadastro, home de assinaturas, calendário, cartões, orçamentos por categoria, configurações e segurança.
- Cores: `#1C1C23` (superfície), `#353542` (borda), `#A2A2B5` e `#83839C` (cinzas azulados), **`#FF7966`** (coral), `#1ED760` (verde Spotify).
- Fonte: **Inter** (Semi Bold dominante), tamanhos 12/14/16/20/24/40/56/72.
- Padrões: arco de orçamento no topo, lista de assinaturas com logo, abas "assinaturas / próximas contas", badges de dias.
- Licença: uso comercial permitido. Pode ser convertido em HTML/CSS e publicado. **Não pode ser redistribuído.**

### Messenger App Screen (`.fig`, community): base do **lavanda**
- Telas: Chats, Chat (conversa), Chat info, tab bar, barra de texto.
- Cores: `#200E32` (texto, roxo profundo), **`#8667F2`** (lavanda, primária), `#8C8098` (texto secundário), `#FA6969` (badge), `#F4F0FA` (fundo).
- Fonte: **General Sans** (substituto no Google Fonts: Plus Jakarta Sans), SF Pro nos elementos do iOS.

### Tesla Model 3 GUI (`.sketch`, Tom John)
- 4 páginas de painel 16:9 de carro: mapa, controles, mídia, configurações.
- Cores: `#0E0E0E` e `#000000` (modo escuro), `#F0F0F0` e `#FAFAFA` (modo claro), **`#007BE4`** (azul de ação), `#E82127` (vermelho Tesla).
- Fonte: **Montserrat** (Medium 20 dominante), números grandes até 110.
- Lição: o mesmo layout em modo claro **e** escuro. Inspirou o azul do tema `oceano`.

### Travel Booking App Concept (`.ai`/`.eps`, Freepik)
- 3 telas: home com categorias (voo, hotel, trem), bilhete com trajeto pontilhado, seleção de assento.
- Cores: ciano `#18B4E8` → azul `#0773C0`, amarelo `#FFD23F` no CTA. Fontes: **Oswald + Raleway**.
- Padrões: ticket com picote, mapa de assentos, chips de status.

### COVID-19 Tracking App (`.eps`, Freepik)
- 8 telas: contadores grandes, mapa de calor, check-in, questionário de sintomas, resultado com ilustração.
- Azul claro e gradientes suaves, números grandes como herói da tela. Bom modelo para **painéis de dados públicos**.

## Kits do Figma (lidos pelo conector)

### DesignCode UI (Meng To): base da **biblioteca de componentes**
- Arquivo: cópia da Comunidade nos rascunhos da Edna (`figma.com/design/vpdXnMoxH75nSCMBLLEGiQ`). Lido em 31/10/2026 com cerca de 6 leituras do conector.
- Páginas: Colors, Spacing, Shadows and Blur, Typography & Content, Buttons, Menus, Cards, Icons, Wireframes, Backgrounds, Patterns + templates e seções bloqueados (versão paga).
- **Cores em duas camadas**: primitivas (12 matizes, cada uma de 50 a 900, mais Neutral) e semânticas: *Foreground Primary/Secondary/Tertiary*, *Container Background/Border/Divider/Inner*, *Button / Button Hover / Button Selected / Button Inactive / Button Foreground*, *Text Gradient*. É a mesma ideia dos nossos tokens (`--text`, `--text-muted`, `--surface`, `--line`, `--accent`…).
- **Elevação em 3 níveis**: 1 = conteúdo e botões, 2 = cartões flutuantes e menus, 3 = notificações e modais. Cada nível tem as forças *subtle / regular / strong*.
- **Brilho interno no escuro**: a sombra some no fundo escuro, então a profundidade vem de um *inner glow* de 1px no topo. Adotado como `--glow-inner`.
- **Botões**: estilos Primary, Secondary, Ghost, *Glow* (borda em gradiente brilhante) e *Shiny*, em 4 tamanhos, com ícone, sempre em pílula.
- **Menus e campos**: barra de navegação em pílula (marca · links · Entrar · Criar conta), controle segmentado Mensal/Anual, abas (CSS/React/Tailwind), busca, e-mail com ícone, campo de inscrição com botão embutido, menu lateral de conta, calendário.
- **Cartões**: preço com checklist, confirmação, cartão de crédito, notificações, anéis de progresso, gráficos de barras e clima.
- Implementado em `design-lab/componentes/` (CSS com prefixo `.c-` + vitrine com seletor de tema).

### Dashboard Student Activities (community): **painel de estudos**, aproxima-se do tema `oceano`
- Arquivo: `figma.com/design/8TkilVdtDw1DEIOX37Cn4n`. Uma tela desktop de 1430×880, lida com 2 leituras do conector.
- **Layout de 3 colunas**, o padrão clássico de painel: trilho de ícones à esquerda (98px, com avatar e nome no topo) → área central (título "Timeline", navegação de data `‹ Nov 02 ›`, filtros "Sort by / Week View", busca, sino) → painel lateral direito de 340px ("Events", abas Activities/Remainders, "Next Day", "See all").
- **Cores medidas no print**: azul `#0997D9` (primária), salmão `#F99393` (secundária), fundos `#FFFFFF` e `#F8F9FA`, gradientes nos cartões de evento (verde, lilás, laranja-amarelo).
- **Tipografia**: Poppins (títulos 32–36 semibold, cartões 16–18).
- **Padrões que valem a pena**:
  - cartões de matéria com uma "gota" de gradiente no canto e ícone da disciplina;
  - calendário mensal com dias de evento marcados por círculos (cheio = evento, contorno = semana anterior);
  - bloco "dia em destaque" (número enorme `02` + mês) ao lado de to-do e agenda por horário;
  - cartões de evento com faixa de cor por categoria + horário, local e responsável com ícone.
- **Cuidados (não copiar)**: texto branco sobre salmão `#F99393` tem contraste ~2,2:1 e texto branco pequeno sobre o azul fica em ~3,4:1, os dois abaixo do AA. Placeholders muito claros. Ao implementar, usar as cores do tema `oceano` (azul `#0773C0`, que passa AA) e reservar o salmão para fundos de destaque com texto escuro.
- **Uso sugerido**: base de layout para o **painel de estudos ANBIMA** (matérias, simulados, agenda, revisões).

## Imagens de inspiração (observadas)

| Referência | O que levar |
|---|---|
| Quiz **BrainBucks** (preto + verde-limão) | Gamificação: streak semanal com check, moedas e XP no topo, cartões de modo de jogo, barra de progresso de tarefa. Encaixa no `neon-noir`. |
| App de saúde **glassmorphism sálvia** | Cartões de vidro sobre fundo esverdeado, tab bar flutuante em pílula, botão escuro sobre fundo claro. Virou o `salvia-vidro`. |
| **Habit tracker** amarelo | Heatmap de dias, ações "Done / Add note" lado a lado, três números-resumo por hábito. Virou o `sol-grafite`. |
| **Assistente de IA laranja** | Fundo com brilho radial, orbe animado ao ouvir, cartões de sugestão, campo de pergunta fixo embaixo. Virou o `brasa`. |
| **Chat laranja** "Let's Stay Connected" | Cabeçalho em gradiente com stories, lista escura embaixo, balões de mensagem translúcidos. |
| **Observatory** | Grade bento de cartões com gradientes diferentes, números em matriz de pontos, fundo com grade de pontos. Base do `aurora`. |
| **Glicose** | Cartões coloridos com indicadores em régua ou triângulo, valor grande e unidade pequena. |
| **Quiz comportamental** (laranja/azul) | Tipografia gigante como herói, uma pergunta por tela, rodapé preto com progresso e "Next". |
| **Ascendant** (astrologia/cripto) | Gradientes iridescentes, linhas finas, títulos grandes e leves, gráfico de linha minimalista. |
| **Audio Sphere** (podcast) | Leque de capas coloridas, botão circular de rolagem, controles grandes de player. |

## Padrões que se repetem em quase todas as referências

1. **Número grande + unidade pequena** como herói do cartão (`412 km`, `84 mg/dL`, `5.400 passos`).
2. **Tab bar flutuante em pílula** com o item ativo preenchido pela cor de destaque.
3. **Uma única cor de destaque** forte sobre neutros. Nunca duas competindo.
4. **Cartões com raio grande** (16–32px) e bordas de 1px quase invisíveis.
5. **Semana em 7 colunas** (S T Q Q S S D) para hábitos e progresso.
6. **Gradiente radial no topo** para dar profundidade sem poluir.
