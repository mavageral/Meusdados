// Yaad1 (site): chama o Claude pela API da Anthropic em nome da pessoa logada.
// Variáveis no Vercel: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY e, opcional, LIMITE_DIARIO.
import Anthropic from "@anthropic-ai/sdk";

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const LIMITE = Math.max(1, Number(process.env.LIMITE_DIARIO) || 60);
const MAX_CHARS = 60000, MAX_MSGS = 40;
const MODELO = "claude-opus-5-5";
const ESFORCO = { quick: "low", default: "medium", complex: "high" };
const client = new Anthropic();

const SISTEMA = "Você é o Claude dentro do Yaad1, um app de direção (um alvo, um caminho) para estudantes e profissionais no Brasil. Responda sempre em português do Brasil, de forma simples e direta.";
const SISTEMA_BUSCA = " Você pode pesquisar na internet: as ferramentas web_search e web_fetch são as mesmas que o pedido chama de buscar_na_internet e ler_pagina. Use só links que vieram das buscas e prefira fontes oficiais.";

async function supa(path, token, body) {
  const r = await fetch(SUPA_URL + path, {
    method: body ? "POST" : "GET",
    headers: { apikey: SUPA_KEY, Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return r.ok ? r.json() : null;
}

function urlsDe(content) {
  const urls = new Set();
  const visita = (x) => {
    if (!x || typeof x !== "object") return;
    if (typeof x.url === "string" && /^https?:\/\//.test(x.url)) urls.add(x.url);
    for (const v of Object.values(x)) if (typeof v === "object") visita(v);
  };
  for (const b of content || []) if (b.type === "web_search_tool_result" || b.type === "web_fetch_tool_result") visita(b.content);
  return [...urls].slice(0, 60);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ code: "method_not_allowed" });
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token || !SUPA_URL || !SUPA_KEY) return res.status(401).json({ code: "not_granted" });
  const quem = await supa("/auth/v1/user", token);
  if (!quem || !quem.id) return res.status(401).json({ code: "not_granted" });
  const { input, tier, web, images } = req.body || {};
  const base = Array.isArray(input) ? input.slice(-MAX_MSGS).filter((m) => m && (m.role === "user" || m.role === "assistant")).map((m) => ({ role: m.role, content: String(m.content || "") }))
    : [{ role: "user", content: String(input || "") }];
  const tamanho = base.reduce((t, m) => t + m.content.length, 0);
  if (!base.length || base[base.length - 1].role !== "user" || tamanho === 0) return res.status(400).json({ code: "invalid_request" });
  if (tamanho > MAX_CHARS) return res.status(413).json({ code: "invalid_request", message: "Pedido grande demais. Encurte o texto e tente de novo." });
  const imgs = (Array.isArray(images) ? images : []).slice(0, 3).filter((s) => typeof s === "string" && s.length < 6_000_000);

  const permitido = await supa("/rest/v1/rpc/registrar_uso", token, { limite: LIMITE });
  if (permitido !== true) return res.status(429).json({ code: "rate_limited", message: "Limite diário de uso da IA atingido. Volte amanhã." });

  if (imgs.length) {
    const ultimo = base[base.length - 1];
    ultimo.content = imgs.map((data) => ({ type: "image", source: { type: "base64", media_type: "image/jpeg", data } })).concat([{ type: "text", text: ultimo.content }]);
  }
  const tools = web ? [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }, { type: "web_fetch_20260209", name: "web_fetch", max_uses: 3 }] : undefined;

  res.writeHead(200, { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" });
  const linha = (o) => res.write(JSON.stringify(o) + "\n");
  let messages = base, texto = "", urls = [], final = null, atual = null, fechado = false;
  req.on("close", () => { fechado = true; if (atual) atual.abort(); });
  try {
    for (let volta = 0; volta < 4; volta++) {
      if (fechado) break;
      const stream = atual = client.beta.messages.stream({
        model: MODELO,
        max_tokens: 16000,
        system: SISTEMA + (web ? SISTEMA_BUSCA : ""),
        output_config: { effort: ESFORCO[tier] || "medium" },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        messages,
        ...(tools ? { tools } : {}),
      });
      stream.on("text", (delta) => { texto += delta; linha({ t: delta }); });
      final = await stream.finalMessage();
      urls = urls.concat(urlsDe(final.content));
      if (final.stop_reason !== "pause_turn") break;
      messages = [...base, { role: "assistant", content: final.content }];
    }
    if (final && final.stop_reason === "refusal") return res.end(JSON.stringify({ erro: "refusal", message: "O Claude não pôde responder a este pedido." }) + "\n");
    linha({ fim: true, texto, urls: [...new Set(urls)], truncado: final ? final.stop_reason === "max_tokens" : false });
  } catch (error) {
    let code = "upstream_error";
    if (error instanceof Anthropic.RateLimitError) code = "rate_limited";
    else if (error instanceof Anthropic.AuthenticationError) code = "not_granted";
    else if (error instanceof Anthropic.BadRequestError) code = "invalid_request";
    if (!fechado) linha({ erro: code, message: "O Claude não respondeu agora. Tente de novo em instantes." });
  }
  res.end();
}
