---
name: meusdados-design
description: Método de design do repositório Meusdados. Use SEMPRE que for criar, redesenhar ou revisar um site, app, landing page, dashboard ou tela neste repositório. Combina os 8 temas próprios (design-lab/tokens/temas.css, extraídos das referências da usuária) com as regras de UX/acessibilidade do ui-ux-pro-max, e termina com verificação visual por screenshot.
---

# Método Meusdados de design

A usuária reuniu referências (Figma, Sketch, mockups) e quer resultados de nível profissional. Este é o processo obrigatório. A conversa com ela é em **português do Brasil**.

## 1. Briefing (no máximo 1 pergunta por vez, só o que faltar)
Antes de desenhar, tenha clareza sobre:
- **O que é** e **para quem** (o público e o que a pessoa precisa conseguir fazer).
- **Plataforma**: site responsivo, app mobile (protótipo web) ou dashboard.
- **Dados reais** que existem (planilha, números, textos). Nunca use lorem ipsum.
Se der para inferir, não pergunte. Decida e diga o que decidiu.

## 2. Escolher a direção visual
Leia `design-lab/catalogo.md` (seção "Mapa rápido") e escolha **um** dos temas:
`neon-noir`, `sol-grafite`, `ardosia-coral`, `salvia-vidro`, `brasa`, `aurora`, `oceano`, `lavanda`, `cinema`.
- Se a usuária mandar uma referência nova, compare com o catálogo e diga qual tema está mais perto. Se nenhum servir, crie um tema novo no mesmo formato em `temas.css` e registre a origem no catálogo.
- A vitrine `design-lab/index.html` mostra todos os temas lado a lado.

## 3. Consultar o ui-ux-pro-max para as regras (não para a paleta)
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<tipo de produto> <setor> <palavras-chave>" --design-system -p "<Nome>"
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<assunto>" --domain ux
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<assunto>" --stack html-tailwind   # ou react, nextjs, flutter…
```
Use dele: **padrão de página** (ordem das seções, CTA), **regras de UX**, **anti-padrões** e boas práticas da stack.
As **cores e fontes vêm do tema escolhido**, não da sugestão genérica dele. As referências da usuária têm prioridade.

## 4. Construir
- Importe `design-lab/tokens/temas.css`, depois `design-lab/componentes/componentes.css`, e aplique `data-tema="<tema>"` no elemento raiz.
- **Reaproveite os componentes `.c-*`** (botões, campos, menus, cartões, elevação 1/2/3) antes de criar estilos novos. Veja `design-lab/componentes/index.html`. Se criar um componente reutilizável novo, adicione-o lá.
- Componentes usam **só tokens**: `--bg --surface --surface-2 --line --text --text-muted --accent --on-accent --accent-soft --accent-2 --success --warning --danger --hero --g1..--g4 --font-display --font-body --font-num`, espaçamento `--s-*`, raios `--r-*`, tipografia `--t-*`, movimento `--d-*`. Nada de hex solto no componente.
- Carregue as fontes do tema pelo Google Fonts (lista no topo de `temas.css`).
- Reaproveite os padrões do catálogo: número grande + unidade pequena, tab bar em pílula, semana em 7 colunas, um só destaque.
- Mobile-first: comece pelos 375px e depois expanda.
- Projetos novos ficam em `projetos/<nome-do-projeto>/`. Crie com `python3 -I ferramentas/novo-projeto.py <nome> <tema> "<Título>"` (ou `/novo-projeto`).

## 5. Portões de qualidade (antes de entregar)
- [ ] Contraste AA: texto ≥ 4,5:1 e elementos grandes ou ícones ≥ 3:1 (os tokens já passam; confira combinações novas).
- [ ] Alvos de toque ≥ 44px, foco visível no teclado, `prefers-reduced-motion` respeitado (já está no `temas.css`).
- [ ] Sem rolagem horizontal em 375px. Layout confortável em 1280px.
- [ ] Ícones em SVG (nunca emoji como ícone). Imagens com `alt`.
- [ ] Textos em português, diretos, com dados reais ou exemplos marcados como exemplo.

## 6. Verificar
1. `node ferramentas/verificar-pagina.js projetos/<nome>/index.html <pasta-no-scratchpad>`: screenshots em 390 e 1280, rolagem lateral, erros de JS, alvos de toque, alt, textos miúdos. Olhe as duas screenshots.
2. Rode o subagente **revisor-ui** com o caminho da página. Corrija o que vier como grave ou médio **uma vez** e entregue.

## 7. Entregar
- Commit no repositório com mensagem clara.
- Para a usuária ver no celular: publique a página como Artifact, com os arquivos de apoio em `files`.
- Termine com: o que foi feito, o link, e 1 ou 2 próximos passos possíveis.
