# Design Lab

A caixa de ferramentas de design do Meusdados. Junta quatro coisas:

| Peça | Onde | Para quê |
|---|---|---|
| **Temas** (tokens) | `tokens/temas.css` | 9 identidades visuais prontas, extraídas das suas referências. Troque o visual inteiro mudando `data-tema`. |
| **Catálogo** | `catalogo.md` | O que cada referência ensina: cores e fontes medidas, padrões de tela, qual tema usar em cada tipo de projeto. |
| **Vitrine** | `index.html` | O mesmo app desenhado em todos os temas, para comparar e escolher. |
| **Componentes** | `componentes/` | Botões, campos, menus, cartões, elevação: classes `.c-*` que funcionam em todos os temas (inspiradas no DesignCode UI). |

E as automações em `.claude/` e `ferramentas/`:

- **Skill `meusdados-design`**: o método. Briefing → escolha do tema → regras do ui-ux-pro-max → construção → portões de qualidade → verificação → entrega.
- **Skill `extrair-referencia`**: transforma qualquer `.fig`, `.sketch` ou imagem nova em entrada do catálogo ou em tema novo.
- **Skill `/novo-projeto <nome> <tema>`**: cria `projetos/<nome>/` já no padrão.
- **Subagente `revisor-ui`**: revisão independente antes de cada entrega.
- **Hook de contraste**: ao editar `temas.css`, roda `ferramentas/contraste.py` sozinho.
- **`ui-ux-pro-max`** (e skills irmãs): base de 79 estilos, 119 regras de UX e boas práticas por tecnologia.

## Como pedir um projeto

Basta descrever, por exemplo:

> "Quero um app para acompanhar meus estudos da ANBIMA, com horas por semana e simulados."

O Claude segue o método, sugere o tema (nesse caso, `sol-grafite` ou `aurora`) e entrega a página publicada com link.

## Os 9 temas

`neon-noir` · `sol-grafite` · `ardosia-coral` · `salvia-vidro` · `brasa` · `aurora` · `oceano` · `lavanda` · `cinema`

## Arquivos originais

Os `.fig`, `.sketch`, `.eps` e as imagens de inspiração ficam **fora do Git**, porque o repositório é público e as licenças não permitem redistribuir. Se quiser guardá-los junto, coloque-os em `design-lab/fontes-privadas/` (ignorado pelo Git) ou torne o repositório privado.
