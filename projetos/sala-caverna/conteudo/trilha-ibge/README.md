# Curso da prova: Recenseador IBGE 2027

São 36 aulas escritas para o Yaad1, com 360 questões comentadas. Cada aula tem 10 questões: as 5 da aula e mais 5 de `tecnicos-extra.json`, `matematica-extra.json` ou `portugues-extra.json`. O app mostra o curso em "Curso da prova", na aba Sala viva, e também o abre pelos blocos do IBGE na agenda.

## Fontes

| Matéria | Base | Aulas |
|---|---|---|
| Conhecimentos Técnicos (30 questões na prova) | Apostila oficial "Conhecimentos básicos para o 12º Censo Agropecuário, Florestal e Aquícola" (IBGE, ENCE, CTA), lida inteira, inclusive as tabelas em imagem. Cada regra traz a página. | 14 (`tecnicos-1.json`, `tecnicos-2.json`) |
| Matemática (15) | Anexo III do edital nº 03/2026 | 11 (`matematica.json`) |
| Língua Portuguesa (15) | Anexo III do edital nº 03/2026 | 11 (`portugues.json`) |

Para calibrar o estilo da banca, foram usadas:

- a prova de Recenseador de 2010 da Cesgranrio (prova branca), com o gabarito oficial conferido;
- os assuntos das provas do IBFC de 27/09/2026, que usaram a mesma apostila.

Nenhuma questão é cópia de prova. Todas foram escritas para o curso, e nenhuma é atribuída à Cesgranrio.

## Ordem

A ordem vai do mais difícil para o mais fácil, como no quadro de estudo da dona:

- **Técnicos:** estabelecimento, sede e áreas, situações especiais, produtor sem área, povos e comunidades tradicionais, setores, mapa, descritivo, coordenadas, endereço, instrumentos, estrutura, divisão do país, IBGE e Censo.
- **Matemática:** frações e decimais, inteiros, MMC e MDC, razão e proporção, regra de três, porcentagem, equações, medidas, áreas e volumes, gráficos, mapas e escalas.
- **Português:** regência e crase, concordância, pronomes, classes de palavras, verbos e vozes, pontuação, sequência lógica, ortografia, acentuação, significação das palavras e compreensão de texto (com prática diária).

## Formato de cada aula

| Campo | O que é |
|---|---|
| `porque` | Por que o assunto cai na prova |
| `blocos` | A explicação, do zero, em partes |
| `exemplos` | Exemplos com resolução, que fica escondida até a pessoa tentar |
| `pegadinhas` | Armadilhas comuns da banca |
| `resumo` | Pontos para copiar no caderno |
| `qs` | 5 questões: 5 alternativas, gabarito `c` (0 a 4), comentário `e` e nível `nv` (1 a 3) |

## Regras do app

As regras são fixas e não dependem da IA:

- O teste tem 5 questões. As letras são embaralhadas a cada tentativa.
- Com 4 acertos ou mais (80%), a aula fica "em revisão" e volta em 1, 3, 7, 15 e 30 dias.
- Depois de passar nas revisões de 1, 3 e 7 dias, a aula fica "dominada".
- Com menos de 80%, a aula fica em "reforço" e os erros vão para a Forja.
- As respostas também entram nas barras de "Sua preparação".

## Como editar

1. Altere o JSON.
2. Rode `python3 -I ferramentas/embutir-trilha.py`. Ele valida o conteúdo (5 questões por aula, 5 alternativas diferentes, gabarito válido, comentário em toda questão e página em toda aula técnica) e embute o curso no `index.html`.
3. Rode a bateria: `node ferramentas/testes/yaad1.test.js`.

## Apostila oficial no app

- `../apostila-ibge/apostila.json` traz o texto oficial da apostila, página por página, com a fonte citada.
- O arquivo é gerado por `ferramentas/extrair-apostila.py` a partir do `pdftotext` do PDF oficial. O PDF não entra no repositório.
- As figuras que não têm texto foram transcritas e aparecem marcadas como "[Conteúdo da figura]".
- O `embutir-trilha.py` embute a apostila junto com o curso.

## Banco de questões

- **Todas as matérias:** 10 questões por aula. O 1º teste usa as 5 primeiras, o 2º usa as 5 novas, e as tentativas seguintes continuam alternando.
- **Revisões:** sorteiam 3 questões entre todas as da aula.
- **Simulado completo:** usa as 360 questões do curso e as 24 do guia, 384 no total.
