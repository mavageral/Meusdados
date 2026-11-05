# APIs de IA gratuitas (referência para o Yaad1)

> Versão nossa da antiga lista `free-llm-api-resources` do GitHub, que saiu do ar (o repositório original de `cheahjs` não existe mais; restaram só cópias pequenas de autores desconhecidos). Tudo abaixo foi conferido nas páginas oficiais em **05/11/2026**. Limites mudam: confira o link antes de usar.

## A pergunta que importa para o Yaad1

O Yaad1 manda ao modelo dados pessoais (rotina, momento de vida, descobertas, perfil). Por isso, para cada opção, a coluna **"Usa os dados?"** vale tanto quanto o limite.

| Serviço | O que é grátis | Cartão? | Usa os dados? | Fonte oficial |
|---|---|---|---|---|
| **Google Gemini** | Modelos Flash e Flash-Lite grátis, com limite diário (aparece no AI Studio, por projeto, e zera à meia-noite do Pacífico). Busca no Google: cota gratuita pequena, que varia por modelo. | Não | **Sim, no plano grátis:** o Google pode usar o conteúdo para melhorar produtos e pessoas podem revisar. No pago, não. | [Preços](https://ai.google.dev/gemini-api/docs/pricing) |
| **Groq** | Plano Free com limites publicados por modelo. Ex.: `openai/gpt-oss-120b` com 30 pedidos por minuto e 1.000 por dia. | Não | Ver os termos da Groq antes de usar com dados pessoais. | [Limites](https://console.groq.com/docs/rate-limits) |
| **OpenRouter** | Modelos com final `:free`: 20 pedidos por minuto e 50 por dia, ou 1.000 por dia depois de comprar US$ 10 em créditos. O roteador `openrouter/free` escolhe um modelo grátis. | Não | Depende do provedor de cada modelo. A OpenRouter marca cada um como ZDR (nada guardado), Safety Retention (guarda só contra abuso) ou **Retention and Training** (pode treinar). | [FAQ](https://openrouter.ai/docs/faq) · [Limites](https://openrouter.ai/docs/api/reference/limits) |
| **Mistral** | Modo Free para testes. Os limites aparecem só no painel. | Não informado | Não foi possível confirmar na documentação. | [Ajuda: limites](https://help.mistral.ai/en/articles/698531-why-am-i-hitting-api-rate-limits-and-how-do-i-increase-them) |
| **Cloudflare Workers AI** | Uma cota diária gratuita de "Neurons". | Não | Ver os termos da Cloudflare. | [Preços](https://developers.cloudflare.com/workers-ai/platform/pricing/) |
| **Cerebras** | **Não é gratuito de verdade:** US$ 5 de crédito que vencem em 30 dias. | Sim | — | [Limites e FAQ](https://inference-docs.cerebras.ai/support/rate-limits) |

**Saiu do ar:** o GitHub Models foi encerrado em 30/07/2026. Muitas listas antigas ainda o citam.

## Como isso entra no Yaad1

- **Hoje:** o site usa o Claude (`api/claude.js`) e precisa da chave paga da Anthropic.
- **Opção gratuita para testes:** Gemini Flash no plano grátis, só enquanto o site é usado pela dona. Exige aviso claro na tela de criar conta por causa do uso dos dados.
- **Para abrir a outras pessoas:** um plano pago que não usa os dados (Claude, ou Gemini pago).

## Diretório complementar: nejib1/Free-LLM

[github.com/nejib1/Free-LLM](https://github.com/nejib1/Free-LLM) ([free-llm.com](https://free-llm.com)) lista mais de 34 serviços e é atualizado todo dia. Lido em 05/11/2026: é só texto (sem programas para instalar) e não tem nada suspeito. Vale como mapa, com dois cuidados:

- **Grandes empresas** (Google, Groq, Mistral, Cohere, NVIDIA, Cloudflare, Z.AI): termos públicos, dá para confiar e conferir. Detalhes da lista: a Mistral pede verificação por telefone e permite 1 pedido por segundo; a chave de teste da Cohere vale 1.000 chamadas por mês e **só para uso não comercial**; o NVIDIA NIM pede telefone e permite cerca de 40 pedidos por minuto.
- **Revendedores e intermediários pequenos** (por exemplo Api.Airforce, LLM7.io, FreeInference, LLM.kiwi, Routeway, AI Horde): pouca transparência sobre quem recebe e guarda os textos. **Não usar com dados de pessoas do Yaad1.**
- **Rodar no próprio computador** (Ollama, LM Studio, llama.cpp): o mais privado e sem limite, mas precisa de máquina própria e não serve para o site na Vercel.
