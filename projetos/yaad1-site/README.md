# Yaad1: site com login

O site é o mesmo app do claude.ai (`projetos/sala-caverna/index.html`), com login próprio e a IA pela API da Anthropic.

| Peça | Onde | O que faz |
|---|---|---|
| `index.html` | gerado por `python3 -I ferramentas/build-site.py` | O app + Supabase + a ponte. **Não edite à mão:** edite o app e gere de novo. |
| `yaad1-shim.js` | aqui | Tela de login (entrar, criar conta, esqueci a senha, 2 etapas, sair, importar backup) e a ponte `window.claude.use` (user, db, sample, assets, downloads) para o Supabase e para `/api/claude`. |
| `api/claude.js` | função da Vercel | Confere quem está logado, conta o uso diário (limite) e chama o Claude (Opus 5.5) com busca na internet quando o app pede. |
| Supabase `yaad1` (sa-east-1) | banco | `user_docs` (dados de cada pessoa, com RLS), `app_owner` (marca a dona sem expor e-mail no código), `ai_usage` + `registrar_uso()` (limite diário), bucket privado `fotos`. |

## Variáveis no projeto da Vercel
- `ANTHROPIC_API_KEY`: chave da API da Anthropic (custo por uso). **Só a dona coloca, no painel da Vercel.**
- `SUPABASE_URL` = `https://yjladiqrabbzulpzteqy.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY` = a chave pública do Supabase (a mesma do `yaad1-shim.js`)
- `LIMITE_DIARIO` (opcional): chamadas de IA por pessoa por dia (padrão 60; o banco limita a 200 por pessoa e 1.500 no total por dia).

## A conta da dona
1. A Edna cria a conta no site com o e-mail dela e a senha que ela escolher.
2. Marca-se a conta como dona: `insert into public.app_owner (user_id) select id from auth.users where email = '<e-mail>';`
3. Em Minha conta → Importar backup, ela traz o Projeto Caverna (o backup sai do Yaad1 do claude.ai, em Perfil e projeto).
