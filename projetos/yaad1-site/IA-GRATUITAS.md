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
