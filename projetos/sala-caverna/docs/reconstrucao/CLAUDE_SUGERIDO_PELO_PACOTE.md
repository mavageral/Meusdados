# YAAD1 — instruções permanentes para Claude Code

## Missão
Yaad1 é uma plataforma de direção, aprendizagem e conquista no mundo real. Não é agenda, banco de vagas ou chatbot. O ciclo central é ROTA: Realidade → Oportunidades → Trajetórias → Ação. O app deve ensinar, comprovar aprendizagem, preservar evidência e recalcular quando a vida muda.

## Leia antes de qualquer trabalho
- `docs/01_DIAGNOSTICO_E_VISAO_MESTRA.md`
- `docs/02_ARQUITETURA_E_ESPECIFICACAO_TECNICA.md`
- `docs/03_PLANO_DE_EXECUCAO_CLAUDE_CODE.md`

## Regras de trabalho
1. Audite antes de editar; nunca presuma stack, deployment, chave, conector ou tabela.
2. Preserve o HTML legado e faça backup/migração reversível.
3. Não espalhe dados pessoais do perfil Caverna em código público.
4. Uma ação principal por tela; evitar dashboard/texto excessivo.
5. Estudo precisa de conteúdo, prática, explicação e evidência. Tarefa simples pode ser apenas confirmada.
6. Falha de IA não pode gerar nota nem aprovação. Erro de persistência não pode ser silencioso.
7. Toda oportunidade deve ser rastreável e atualizada.
8. API é caminho de execução; MCP só expõe ferramentas específicas a agentes autorizados.
9. Regras determinísticas para agenda, status, permissões e cálculos verificáveis.
10. Ações sensíveis exigem aprovação explícita.
11. TDD para novas funcionalidades; revisar e rodar testes reais antes de alegar conclusão.
12. Não fazer deploy ou migração destrutiva sem autorização.

## Tecnologia
Preserve o framework e os serviços existentes se forem adequados. TypeScript, React/PWA, PostgreSQL/Supabase, IndexedDB, APIs server-side e Capacitor são opções condicionais. Não instalar bibliotecas redundantes nem microsserviços por moda.

## Design
Identidade escura premium; laranja no C/ação principal; verde para êxito; vidro e glow com contenção; cards com imagens e visualizações quando ajudam. O foco é a próxima ação. Respeitar acessibilidade, redução de movimento, teclado e telas pequenas.

## IA
Contexto mínimo, output estruturado, validação de schemas, proveniência, versionamento de prompts, rastreio de custo, rate limit, fallback explícito e verificação independente de conteúdo que afeta avaliação ou oportunidade. Modelos não se treinam automaticamente por conversar.

## Relatórios
Descrever o que foi lido, alterado, testado, aprovado, bloqueado e não verificado. Distinguir mock de integração real. Nunca anunciar resultado não observado.
