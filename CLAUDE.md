# Meusdados

Repositório de projetos de design e dados da Edna (sites, apps, dashboards, portfólio de dados: SQL, Python, Power BI).

## Regras da casa
- **Converse em português do Brasil**, de forma simples e direta. A usuária costuma usar o celular.
- **Todo trabalho de interface segue a skill `meusdados-design`** (briefing → tema → regras do ui-ux-pro-max → construir → portões de qualidade → verificar → entregar).
- **Referência nova de design** (arquivo ou imagem) → skill `extrair-referencia`.
- **Antes de entregar uma página**, rode o subagente `revisor-ui` e corrija o que ele marcar como grave.
- Entregue com link: publique a página como Artifact. Quando o projeto estiver maduro, ofereça publicar na Vercel.

## Estrutura
- `design-lab/`: temas (`tokens/temas.css`), catálogo de referências, vitrine (`index.html`).
- `projetos/<nome>/`: um projeto por pasta, criado com `/novo-projeto` (ou `python3 -I ferramentas/novo-projeto.py`).
- `ferramentas/`: scripts do laboratório:
  - `contraste.py`: WCAG dos temas (o hook roda sozinho ao editar `temas.css`)
  - `verificar-pagina.js`: screenshots em 390 e 1280 e checagens de responsividade e acessibilidade
  - `figma/figdump.js`, `sketchdump.py`: extraem cores, fontes e telas de `.fig` e `.sketch`
  - `novo-projeto.py` + `modelo-projeto/`: esqueleto de projeto
- `.claude/skills/`: `meusdados-design`, `extrair-referencia`, `novo-projeto`, `ui-ux-pro-max` (e irmãs), `claude-automation-recommender`.
- `.claude/agents/revisor-ui.md`: revisor de UI que só lê.

## Convenções
- Componentes usam só tokens do tema (`--bg`, `--surface`, `--text`, `--accent`…). Nada de hex solto.
- Mobile-first, sem rolagem lateral em 375–390px, alvos de toque ≥ 44px, `prefers-reduced-motion` respeitado.
- Dados reais ou exemplos claramente marcados. Nunca lorem ipsum.
- **Repositório público:** arquivos de design licenciados (`.fig`, `.sketch`, `.eps`, `.ai`, imagens do Dribbble/Pinterest) **não entram no Git**. Ficam em `design-lab/fontes-privadas/` (ignorado). Só as análises e os temas derivados são versionados.
- Primeira vez numa sessão que for ler `.fig`: `npm install --prefix ferramentas/figma --no-audit --no-fund`.
