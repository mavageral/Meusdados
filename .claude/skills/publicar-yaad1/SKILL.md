---
name: publicar-yaad1
description: Ritual completo de entrega do app Yaad1 - testar, revisar a interface, publicar o Artifact, gerar o site, commit, PR, juntar e conferir a Vercel. Use quando uma mudança no app estiver pronta para ir ao ar.
disable-model-invocation: true
---

# Publicar o Yaad1

1. Rode a skill `testar-yaad1` (sintaxe + bateria). Só siga com tudo verde.
2. Mudança de interface: rode o subagente `revisor-ui` e corrija o que for grave. Mudança que toca IA, conectores, login ou dados: rode o subagente `revisor-seguranca`.
3. Publique o Artifact com o mesmo arquivo (`projetos/sala-caverna/index.html`) e o mesmo link (https://claude.ai/artifact/5HB7Qx6NTyuqaV4qxNxhgS). Só passe `capabilities` quando mudarem, e então declare o conjunto COMPLETO (mcp Parallel Search, TomTom Maps, Gupy; sample com imagens; assets; db; downloads; user; dictation; tts).
4. Gere o site: `python3 -I ferramentas/build-site.py`.
5. Registre a mudança em `projetos/sala-caverna/ROTA.md` (o que, por quê, como foi testado).
6. Commit na branch de trabalho, push, PR e merge na `main`; confira na Vercel que o deploy de produção ficou READY.
7. Responda à dona em português simples: o que mudou, como usar, o que foi testado e o que ficou para depois.
