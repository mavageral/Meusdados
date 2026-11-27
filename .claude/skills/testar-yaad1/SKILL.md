---
name: testar-yaad1
description: Roda a verificação de sintaxe e a bateria de testes do app Yaad1 (projetos/sala-caverna/index.html) com IA, conectores, ditado e voz simulados, em 375 e 390 px. Use SEMPRE depois de mudar o app e antes de publicar; acrescente um cenário novo a cada funcionalidade nova.
---

# Testar o Yaad1

1. Sintaxe: `python3 -I ferramentas/checar-sintaxe.py`. Se falhar, corrija antes de qualquer outra coisa (erro de sintaxe deixa o app em branco).
2. Bateria: `node ferramentas/testes/yaad1.test.js`. Sai com código 1 se algo falhar e mostra cada verificação que falhou.
3. Funcionalidade nova = cenário novo em `ferramentas/testes/yaad1.test.js` (objeto `CENARIOS`), usando as simulações de `MOCKS` (Claude, Gupy, TomTom, Parallel Search). Cada cenário roda em 375 e 390 px e já confere erros de JavaScript e rolagem lateral.
4. Nunca use dados pessoais reais nos testes: só dados fictícios.
5. Informe o resultado com os números ("76/76 verificações ok"), nunca "deve funcionar".
