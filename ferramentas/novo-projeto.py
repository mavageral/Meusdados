#!/usr/bin/env python3
"""Cria projetos/<nome>/ a partir do modelo, já com o tema e as fontes certas.

Uso: python3 -I ferramentas/novo-projeto.py <nome-do-projeto> <tema> ["Título visível"]
Temas: neon-noir, sol-grafite, ardosia-coral, salvia-vidro, brasa, aurora, oceano, lavanda, cinema
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELO = os.path.join(ROOT, 'ferramentas', 'modelo-projeto', 'index.html')

FONTES = {
    'neon-noir': 'family=Poppins:wght@400;500;600;700',
    'sol-grafite': 'family=Inter:wght@400;500;600;700',
    'ardosia-coral': 'family=Inter:wght@400;500;600;700',
    'salvia-vidro': 'family=Plus+Jakarta+Sans:wght@400;500;600;700',
    'brasa': 'family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600',
    'aurora': 'family=Manrope:wght@400;600;700&family=DotGothic16',
    'oceano': 'family=Montserrat:wght@400;500;600;700',
    'lavanda': 'family=Plus+Jakarta+Sans:wght@400;500;600;700',
    'cinema': 'family=Manrope:wght@400;500;600;700;800',
}


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    nome, tema = sys.argv[1], sys.argv[2]
    titulo = sys.argv[3] if len(sys.argv) > 3 else nome.replace('-', ' ').title()
    if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', nome):
        sys.exit('Nome inválido: use minúsculas, números e hífens (ex.: controle-de-gastos).')
    if tema not in FONTES:
        sys.exit(f'Tema desconhecido: {tema}. Opções: {", ".join(FONTES)}')

    destino = os.path.join(ROOT, 'projetos', nome)
    if os.path.exists(destino):
        sys.exit(f'Já existe: projetos/{nome}/. Escolha outro nome.')
    os.makedirs(destino)

    html = open(MODELO, encoding='utf-8').read()
    for chave, valor in {'{{TITULO}}': titulo, '{{TEMA}}': tema, '{{FONTES}}': FONTES[tema]}.items():
        html = html.replace(chave, valor)
    with open(os.path.join(destino, 'index.html'), 'w', encoding='utf-8') as fh:
        fh.write(html)
    with open(os.path.join(destino, 'BRIEFING.md'), 'w', encoding='utf-8') as fh:
        fh.write(
            f'# {titulo}\n\n'
            f'- **Tema:** `{tema}`\n'
            '- **O que é:** \n'
            '- **Para quem:** \n'
            '- **Tarefa principal da pessoa na tela:** \n'
            '- **Dados reais:** \n'
            '- **Plataforma:** site responsivo / app (protótipo web) / dashboard\n\n'
            '## Decisões\n\n'
        )
    print(f'Criado projetos/{nome}/ (index.html + BRIEFING.md) com o tema {tema}.')


if __name__ == '__main__':
    main()
