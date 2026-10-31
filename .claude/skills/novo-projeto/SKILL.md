---
name: novo-projeto
description: Cria a pasta de um projeto novo em projetos/<nome>/ já com o tema do Design Lab, fontes, esqueleto responsivo e BRIEFING.md. Uso - /novo-projeto <nome> <tema> ["Título"]
disable-model-invocation: true
argument-hint: <nome-do-projeto> <tema> ["Título visível"]
---

# Novo projeto

Argumentos recebidos: `$ARGUMENTS`

1. Se faltar o nome ou o tema, pergunte só o que falta. Para sugerir o tema, use o "Mapa rápido" de `design-lab/catalogo.md`.
   Temas: `neon-noir`, `sol-grafite`, `ardosia-coral`, `salvia-vidro`, `brasa`, `aurora`, `oceano`, `lavanda`, `cinema`.
2. Rode: `python3 -I ferramentas/novo-projeto.py <nome> <tema> "<Título>"`
3. Preencha `projetos/<nome>/BRIEFING.md` com o que a usuária já contou. Pergunte, uma de cada vez, apenas o essencial que faltar.
4. Siga a skill **meusdados-design** a partir do passo 3 (consultar o ui-ux-pro-max) para construir a página.
5. Responda em português com o caminho criado e o próximo passo.
