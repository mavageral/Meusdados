/* Yaad1 (site): login e ponte entre o app e o Supabase + a função /api/claude.
   Carregado no <head>, antes do app. Oferece window.claude.use(nome) com as mesmas
   funções que o claude.ai oferece ao app: user, db, sample, assets e downloads. */
(function () {
  "use strict";
  const SUPA_URL = "https://yjladiqrabbzulpzteqy.supabase.co";
  const SUPA_KEY = "sb_publishable_0f7-1I2ak8vqvqhqzIfCzA_kN15Bcff"; /* chave pública por natureza */
  const CHAVE_SESSAO = "sb-yjladiqrabbzulpzteqy-auth-token";

  const CHAVE_DONO_CACHE = "yaad:uid"; /* de quem é o cache local do app (cav:*) */

  /* Aparelho compartilhado: o cache local do app só vale para a pessoa da sessão salva e ainda válida. */
  const limparCache = () => { try { Object.keys(localStorage).filter((k) => k.startsWith("cav:") || k === CHAVE_DONO_CACHE).forEach((k) => localStorage.removeItem(k)); } catch (e) {} };
  try {
    const salva = JSON.parse(localStorage.getItem(CHAVE_SESSAO) || "null"), id = salva && salva.user && salva.user.id;
    const valida = salva && (!salva.expires_at || salva.expires_at * 1000 > Date.now() - 7 * 864e5);
    if (!id || !valida || localStorage.getItem(CHAVE_DONO_CACHE) !== id) limparCache();
  } catch (e) { limparCache(); }
  let cacheInicial = false; try { cacheInicial = !!localStorage.getItem("cav:main"); } catch (e) {}

  window.YAAD_SITE = true;
  let sb = null, sessao = null, liberar;
  const pronto = new Promise((r) => (liberar = r));

  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MSG = {
    "Invalid login credentials": "E-mail ou senha incorretos.",
    "Email not confirmed": "Confirme o seu e-mail pelo link que enviamos antes de entrar.",
    "User already registered": "Já existe uma conta com este e-mail. Use Entrar.",
  };
  const POR_CODIGO = {
    invalid_credentials: "E-mail ou senha incorretos.", email_not_confirmed: "Confirme o seu e-mail pelo link que enviamos antes de entrar.",
    user_already_exists: "Já existe uma conta com este e-mail. Use Entrar.", weak_password: "Senha fraca: use pelo menos 8 caracteres, com letras e números.",
    same_password: "A senha nova precisa ser diferente da atual.", insufficient_aal: "Confirme primeiro o código das 2 etapas.",
    over_email_send_rate_limit: "Muitos e-mails em pouco tempo. Espere alguns minutos e tente de novo.", email_address_invalid: "Este e-mail não é válido.",
    over_request_rate_limit: "Muitas tentativas. Espere um pouco e tente de novo.",
  };
  const traduz = (e) => (e && POR_CODIGO[e.code]) || MSG[e && e.message] || "Não deu certo agora. Tente de novo.";
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  /* ---------- tela de login ---------- */
  let caixa = null;
  function abrirCaixa() {
    if (caixa) return caixa;
    caixa = el(`<div id="yaad-auth" role="dialog" aria-modal="true" aria-labelledby="ya-t" style="position:fixed;inset:0;z-index:9999;overflow:auto;background:radial-gradient(120% 70% at 50% 0%,rgb(255 106 26 / .30),transparent 60%),var(--bg,#05060A);color:var(--text,#fff);font-family:inherit">
      <div style="max-width:420px;margin:0 auto;padding:48px 16px 32px;display:grid;gap:16px" id="ya-in"></div></div>`);
    focoAntes = document.activeElement;
    [...document.body.children].forEach((x) => { if (x !== caixa) x.inert = true; });
    document.body.append(caixa);
    caixa.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && caixa && caixa.dataset.fechavel) fecharCaixa(); });
    return caixa;
  }
  let focoAntes = null;
  function fecharCaixa() { if (caixa) { caixa.remove(); caixa = null; [...document.body.children].forEach((x) => { x.inert = false; }); if (focoAntes && focoAntes.isConnected) focoAntes.focus(); } }
  function tela(titulo, sub, corpo, aoMontar) {
    abrirCaixa();
    const box = caixa.querySelector("#ya-in");
    box.innerHTML = `<div class="lema" style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;opacity:.8">Yaad1 · um alvo, um caminho</div>
      <h1 id="ya-t" tabindex="-1" style="outline:none;font-weight:300;font-size:clamp(34px,9vw,48px);line-height:1.05;margin:0">${titulo}</h1>
      ${sub ? `<p class="muted" style="margin:0">${sub}</p>` : ""}
      <div role="alert" id="ya-erro" hidden style="border:1px solid var(--bad,#ff6b6b);color:var(--bad,#ff6b6b);border-radius:14px;padding:10px 14px"></div>${corpo}`;
    box.querySelector("#ya-t").focus();
    if (aoMontar) aoMontar(box);
  }
  const erro = (t) => { const e = document.getElementById("ya-erro"); if (e) { e.textContent = t; e.hidden = !t; } };
  const ocupado = (btn, on, txt) => { if (!btn) return; btn.disabled = on; if (txt) btn.textContent = txt; };
  const campo = (id, rotulo, tipo, auto, extra) => `<label class="field"><span>${rotulo}</span><input class="inp" id="${id}" type="${tipo}" autocomplete="${auto}" ${extra || ""}></label>`;

  function telaEntrar() {
    tela("Entrar", "Use o e-mail e a senha da sua conta.", `
      <form id="ya-f" style="display:grid;gap:12px" novalidate>${campo("ya-e", "E-mail", "email", "email", "required")}${campo("ya-s", "Senha", "password", "current-password", "required")}
      <button class="btn primary" style="min-height:48px" id="ya-ok">Entrar</button></form>
      <div class="row wrap" style="gap:8px;justify-content:space-between"><button class="btn ghost" style="min-height:44px" id="ya-criar">Criar conta</button><button class="btn ghost" style="min-height:44px" id="ya-esq">Esqueci a senha</button></div>`, (b) => {
      b.querySelector("#ya-criar").onclick = telaCriar; b.querySelector("#ya-esq").onclick = telaEsqueci;
      b.querySelector("#ya-f").onsubmit = async (ev) => { ev.preventDefault(); erro(""); const btn = b.querySelector("#ya-ok"); ocupado(btn, true, "Entrando…");
        if (!emailOk(b.querySelector("#ya-e").value.trim())) { ocupado(btn, false, "Entrar"); return erro("Digite um e-mail válido."); }
        const { error } = await sb.auth.signInWithPassword({ email: b.querySelector("#ya-e").value.trim(), password: b.querySelector("#ya-s").value });
        ocupado(btn, false, "Entrar"); if (error) return erro(traduz(error)); await depoisDeEntrar(); };
    });
  }
  function telaCriar() {
    tela("Criar conta", "Grátis. Os seus dados ficam só na sua conta.", `
      <form id="ya-f" style="display:grid;gap:12px" novalidate>${campo("ya-n", "Como você quer ser chamado(a)", "text", "nickname")}${campo("ya-e", "E-mail", "email", "email", "required")}
      ${campo("ya-s", "Senha (mínimo 8 caracteres)", "password", "new-password", 'minlength="8" required')}${campo("ya-s2", "Repita a senha", "password", "new-password", "required")}
      <button class="btn primary" style="min-height:48px" id="ya-ok">Criar conta</button></form>
      <button class="btn ghost" style="min-height:44px;justify-self:start" id="ya-volta">Já tenho conta</button>`, (b) => {
      b.querySelector("#ya-volta").onclick = telaEntrar;
      b.querySelector("#ya-f").onsubmit = async (ev) => { ev.preventDefault(); erro("");
        if (!emailOk(b.querySelector("#ya-e").value.trim())) return erro("Digite um e-mail válido.");
        const s = b.querySelector("#ya-s").value; if (s.length < 8) return erro("A senha precisa ter pelo menos 8 caracteres."); if (s !== b.querySelector("#ya-s2").value) return erro("As duas senhas não são iguais.");
        const btn = b.querySelector("#ya-ok"); ocupado(btn, true, "Criando…");
        const { data, error } = await sb.auth.signUp({ email: b.querySelector("#ya-e").value.trim(), password: s, options: { data: { nome: b.querySelector("#ya-n").value.trim() }, emailRedirectTo: location.origin + location.pathname } });
        ocupado(btn, false, "Criar conta"); if (error) return erro(traduz(error));
        if (data.session) return depoisDeEntrar();
        tela("Confirme o seu e-mail", "Enviamos um link para o seu e-mail. Abra o link para ativar a conta e depois entre aqui.", `<button class="btn primary" style="min-height:48px" id="ya-ent">Ir para Entrar</button>`, (b2) => { b2.querySelector("#ya-ent").onclick = telaEntrar; });
      };
    });
  }
  function telaEsqueci() {
    tela("Esqueci a senha", "Enviamos um link para você criar uma senha nova.", `
      <form id="ya-f" style="display:grid;gap:12px" novalidate>${campo("ya-e", "E-mail", "email", "email", "required")}<button class="btn primary" style="min-height:48px" id="ya-ok">Enviar link</button></form>
      <button class="btn ghost" style="min-height:44px;justify-self:start" id="ya-volta">Voltar</button>`, (b) => {
      b.querySelector("#ya-volta").onclick = telaEntrar;
      b.querySelector("#ya-f").onsubmit = async (ev) => { ev.preventDefault(); erro(""); const btn = b.querySelector("#ya-ok"); ocupado(btn, true, "Enviando…");
        const { error } = await sb.auth.resetPasswordForEmail(b.querySelector("#ya-e").value.trim(), { redirectTo: location.origin + location.pathname });
        ocupado(btn, false, "Enviar link"); if (error) return erro(traduz(error));
        tela("Veja o seu e-mail", "Se o e-mail tiver conta, o link para criar uma senha nova chega em instantes.", `<button class="btn primary" style="min-height:48px" id="ya-ent">Voltar para Entrar</button>`, (b2) => { b2.querySelector("#ya-ent").onclick = telaEntrar; });
      };
    });
  }
  function telaNovaSenha(daConta) {
    tela("Senha nova", "Crie a sua senha nova.", `
      <form id="ya-f" style="display:grid;gap:12px" novalidate>${campo("ya-s", "Senha nova (mínimo 8 caracteres)", "password", "new-password", 'minlength="8" required')}${campo("ya-s2", "Repita a senha nova", "password", "new-password", "required")}<button class="btn primary" style="min-height:48px" id="ya-ok">Salvar senha</button></form>
      ${daConta ? `<button class="btn ghost" style="min-height:44px;justify-self:start" id="ya-cancel">Cancelar</button>` : ""}`, (b) => {
      b.querySelector("#ya-cancel")?.addEventListener("click", minhaConta);
      b.querySelector("#ya-f").onsubmit = async (ev) => { ev.preventDefault(); erro(""); const s = b.querySelector("#ya-s").value; if (s.length < 8) return erro("A senha precisa ter pelo menos 8 caracteres."); if (s !== b.querySelector("#ya-s2").value) return erro("As duas senhas não são iguais.");
        const btn = b.querySelector("#ya-ok"); ocupado(btn, true, "Salvando…"); const { error } = await sb.auth.updateUser({ password: s }); ocupado(btn, false, "Salvar senha"); if (error) return erro(traduz(error));
        if (daConta) { await minhaConta(); return erro(""); } await depoisDeEntrar(); };
    });
  }
  async function aoRecuperar() { clearTimeout(esperaRecuperacao);
    const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") { const { data: f } = await sb.auth.mfa.listFactors(); const totp = (f && f.totp || []).find((x) => x.status === "verified"); if (totp) return telaCodigo(totp.id, () => telaNovaSenha()); }
    telaNovaSenha(); }
  let esperaRecuperacao = null;
  function telaCodigo(fatorId, depois) {
    tela("Verificação em 2 etapas", "Digite o código de 6 números do seu aplicativo autenticador.", `
      <form id="ya-f" style="display:grid;gap:12px" novalidate>${campo("ya-c", "Código", "text", "one-time-code", 'inputmode="numeric" maxlength="6" pattern="[0-9]*"')}<button class="btn primary" style="min-height:48px" id="ya-ok">Confirmar</button></form>
      <button class="btn ghost" style="min-height:44px;justify-self:start" id="ya-sair">Sair</button>`, (b) => {
      b.querySelector("#ya-sair").onclick = sair;
      b.querySelector("#ya-f").onsubmit = async (ev) => { ev.preventDefault(); erro("");
        const { error } = await sb.auth.mfa.challengeAndVerify({ factorId: fatorId, code: b.querySelector("#ya-c").value.trim() });
        if (error) return erro("Código incorreto ou vencido. Tente o próximo."); if (depois) return depois(); await depoisDeEntrar(); };
    });
  }

  async function depoisDeEntrar() {
    const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
      const { data: f } = await sb.auth.mfa.listFactors(); const totp = (f && f.totp || []).find((x) => x.status === "verified");
      if (totp) return telaCodigo(totp.id);
    }
    const { data } = await sb.auth.getSession(); sessao = data.session;
    if (!sessao) return telaEntrar();
    let dono = null; try { dono = localStorage.getItem(CHAVE_DONO_CACHE); } catch (e) {}
    if (dono !== sessao.user.id) { limparCache(); try { localStorage.setItem(CHAVE_DONO_CACHE, sessao.user.id); } catch (e) {} if (cacheInicial) { location.reload(); return; } }
    fecharCaixa(); liberar();
  }
  async function sair() { limparCache(); try { await sb.auth.signOut(); } catch (e) {} location.reload(); }

  /* ---------- Minha conta (chamado pelo menu do app) ---------- */
  async function minhaConta() {
    const { data: u } = await sb.auth.getUser(); const { data: f } = await sb.auth.mfa.listFactors();
    const totp = (f && f.totp || []).find((x) => x.status === "verified");
    tela("Minha conta", esc(u && u.user ? u.user.email : ""), `
      <div class="glass pad" style="display:grid;gap:10px"><b style="font-weight:500">Verificação em 2 etapas</b>
        <p class="muted" style="margin:0">${totp ? "Ativada. Ao entrar, o app pede o código do seu autenticador." : "Desativada. Ative para pedir um código do celular (Google Authenticator, Microsoft Authenticator, Authy) além da senha."}</p>
        <button class="btn ${totp ? "ghost" : "primary"}" style="min-height:44px;justify-self:start" id="ya-mfa">${totp ? "Desativar" : "Ativar"}</button></div>
      <div class="glass pad" style="display:grid;gap:10px"><b style="font-weight:500">Senha</b><button class="btn ghost" style="min-height:44px;justify-self:start" id="ya-senha">Trocar a senha</button></div>
      <div class="glass pad" style="display:grid;gap:10px"><b style="font-weight:500">Trazer dados do claude.ai</b>
        <p class="muted" style="margin:0">No Yaad1 do claude.ai, abra Perfil e projeto e toque em "Baixar backup dos registros". Depois escolha o arquivo aqui.</p>
        <button class="btn ghost" style="min-height:44px;justify-self:start" id="ya-imp">Importar backup</button><input type="file" id="ya-arq" accept="application/json,.json" hidden></div>
      <div class="row wrap" style="gap:8px"><button class="btn" style="min-height:48px" id="ya-sair">Sair da conta</button><button class="btn ghost" style="min-height:48px" id="ya-fechar">Voltar ao app</button></div>`, (b) => {
      caixa.dataset.fechavel = "1";
      b.querySelector("#ya-fechar").onclick = fecharCaixa; b.querySelector("#ya-sair").onclick = sair;
      b.querySelector("#ya-senha").onclick = () => telaNovaSenha(true);
      b.querySelector("#ya-mfa").onclick = async () => { if (totp) { const { error } = await sb.auth.mfa.unenroll({ factorId: totp.id }); if (error) return erro("Para desativar, entre de novo com o código e tente outra vez."); return minhaConta(); } ativarMfa(); };
      b.querySelector("#ya-imp").onclick = () => b.querySelector("#ya-arq").click();
      b.querySelector("#ya-arq").onchange = (ev) => importar(ev.target.files && ev.target.files[0]);
    });
  }
  async function ativarMfa() {
    try { const { data: fs } = await sb.auth.mfa.listFactors(); for (const f of (fs && fs.all) || []) if (f.factor_type === "totp" && f.status !== "verified") await sb.auth.mfa.unenroll({ factorId: f.id }); } catch (e) {}
    const { data, error } = await sb.auth.mfa.enroll({ factorType: "totp", friendlyName: "Yaad1 " + new Date().toISOString().slice(0, 16).replace("T", " ") });
    if (error) return erro("Não foi possível ativar agora.");
    tela("Ativar 2 etapas", "1. Abra o seu aplicativo autenticador e leia o código abaixo. 2. Digite o número de 6 dígitos que ele mostrar.", `
      <img alt="Código QR para o aplicativo autenticador" src="${esc(data.totp.qr_code)}" style="width:220px;height:220px;background:#fff;border-radius:16px;padding:8px;justify-self:center">
      <p class="faint" style="font-size:13px;overflow-wrap:anywhere;margin:0">Ou digite a chave: <span class="mono">${esc(data.totp.secret)}</span></p>
      <form id="ya-f" style="display:grid;gap:12px" novalidate>${campo("ya-c", "Código de 6 números", "text", "one-time-code", 'inputmode="numeric" maxlength="6"')}<button class="btn primary" style="min-height:48px" id="ya-ok">Ativar</button></form>
      <button class="btn ghost" style="min-height:44px;justify-self:start" id="ya-cancel">Cancelar</button>`, (b) => {
      b.querySelector("#ya-cancel").onclick = async () => { try { await sb.auth.mfa.unenroll({ factorId: data.id }); } catch (e) {} minhaConta(); };
      b.querySelector("#ya-f").onsubmit = async (ev) => { ev.preventDefault(); erro("");
        const { error: e2 } = await sb.auth.mfa.challengeAndVerify({ factorId: data.id, code: b.querySelector("#ya-c").value.trim() });
        if (e2) return erro("Código incorreto. Confira o horário do celular e tente o próximo código."); minhaConta(); };
    });
  }
  async function importar(arq) {
    if (!arq) return; erro("");
    if (arq.size > 5 * 1024 * 1024) return erro("Arquivo grande demais para um backup do Yaad1.");
    let j; try { j = JSON.parse(await arq.text()); } catch (e) { return erro("Este arquivo não é um backup do Yaad1."); }
    const obj = (x) => x && typeof x === "object" && !Array.isArray(x);
    if (!obj(j) || !obj(j.M) || (j.DAYS != null && !obj(j.DAYS))) return erro("Este arquivo não é um backup do Yaad1.");
    const dias = Object.entries(j.DAYS || {}).filter(([k, v]) => /^\d{4}-\d{2}-\d{2}$/.test(k) && obj(v));
    if (!confirm(`Importar o backup? Ele substitui os dados atuais desta conta (${dias.length} dia(s) de registros).`)) return;
    const btn = document.getElementById("ya-imp"); ocupado(btn, true, "Importando…");
    const linhas = [{ id: "main", data: j.M }].concat(dias.map(([k, v]) => ({ id: "d_" + k, data: { ...v, date: k } })));
    for (let i = 0; i < linhas.length; i += 200) { const { error } = await sb.from("user_docs").upsert(linhas.slice(i, i + 200)); if (error) { ocupado(btn, false, "Importar backup"); return erro("A importação parou no meio. Tente de novo."); } }
    limparCache(); location.reload();
  }
  window.YAAD_CONTA = { abrir: () => minhaConta(), sair };

  /* ---------- ponte: as capacidades que o app pede ---------- */
  const uid = () => sessao && sessao.user && sessao.user.id;
  const token = async () => { const { data } = await sb.auth.getSession(); sessao = data.session || sessao; return sessao && sessao.access_token; };
  const docRef = (key) => ({
    get: async () => { const { data, error } = await sb.from("user_docs").select("data").eq("id", key).maybeSingle(); if (error) throw error; return { exists: !!data, data: () => (data ? data.data : undefined) }; },
    set: async (v) => { const { error } = await sb.from("user_docs").upsert({ id: key, data: v }); if (error) throw error; },
  });
  const db = {
    collection: () => ({
      doc: docRef,
      get: async () => { const out = []; for (let de = 0; ; de += 1000) { const { data, error } = await sb.from("user_docs").select("id,data").range(de, de + 999); if (error) throw error; out.push(...data); if (data.length < 1000) break; } return { docs: out.map((r) => ({ id: r.id, data: () => r.data })) }; },
    }),
  };
  const user = {
    id: async () => uid(),
    isOwner: async () => { const { data } = await sb.from("app_owner").select("user_id").eq("user_id", uid()).maybeSingle(); return !!data; },
    me: async () => ({ id: uid(), name: (sessao.user.user_metadata || {}).nome || "" }),
    canEdit: () => true,
  };
  const paraBase64 = (b) => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(",")[1] || ""); r.onerror = no; r.readAsDataURL(b); });
  async function chamar(input, opts) {
    opts = opts || {};
    const web = (opts.tools || []).some((t) => t && t.name === "buscar_na_internet");
    const images = opts.images && opts.images.length ? await Promise.all([].concat(opts.images).slice(0, 3).map(paraBase64)) : undefined;
    let r;
    try { r = await fetch("/api/claude", { method: "POST", signal: opts.signal, headers: { "Content-Type": "application/json", Authorization: "Bearer " + (await token()) }, body: JSON.stringify({ input, tier: opts.modelTier || "default", web, images }) }); }
    catch (e) { throw { code: e && e.name === "AbortError" ? "aborted" : "network", message: "Sem conexão com o servidor." }; }
    if (!r.ok) { let j = {}; try { j = await r.json(); } catch (e) {} throw { code: j.code || (r.status === 429 ? "rate_limited" : r.status === 401 ? "not_granted" : "upstream_error"), message: j.message || "" }; }
    const leitor = r.body.getReader(), dec = new TextDecoder(); let buf = "", texto = "", fim = null;
    for (;;) { const { value, done } = await leitor.read(); if (done) break; buf += dec.decode(value, { stream: true }); let i;
      while ((i = buf.indexOf("\n")) >= 0) { const l = buf.slice(0, i); buf = buf.slice(i + 1); if (!l.trim()) continue; const o = JSON.parse(l);
        if (o.t) { texto += o.t; if (opts.onText) opts.onText({ text: texto, delta: o.t }); }
        else if (o.erro) throw { code: o.erro, message: o.message || "", text: texto };
        else if (o.fim) fim = o; } }
    if (fim && Array.isArray(fim.urls) && typeof URLS_VISTAS !== "undefined") fim.urls.forEach((u) => URLS_VISTAS.add(u));
    return { text: fim ? fim.texto : texto, truncated: !!(fim && fim.truncado) };
  }
  const sample = (input, opts) => chamar(input, opts);
  sample.json = async (input, opts) => { const { text } = await chamar(input, opts); const t = String(text || "").replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    const a = t.indexOf("{"), b = t.lastIndexOf("}"); try { return JSON.parse(a >= 0 && b > a ? t.slice(a, b + 1) : t); } catch (e) { throw { code: "invalid_json", text }; } };
  sample.limits = async () => ({ images: { maxCount: 3 }, tools: {} });
  const assets = {
    upload: async (blob) => { const path = uid() + "/" + Date.now() + ".jpg"; const { error } = await sb.storage.from("fotos").upload(path, blob, { contentType: blob.type || "image/jpeg" }); if (error) throw error;
      const { data } = await sb.storage.from("fotos").createSignedUrl(path, 60 * 60 * 24 * 365); return { id: path, url: data.signedUrl, sizeBytes: blob.size, contentType: blob.type }; },
  };
  const downloads = { save: async ({ filename, data }) => { const u = URL.createObjectURL(data instanceof Blob ? data : new Blob([data])); const a = document.createElement("a"); a.href = u; a.download = filename; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); } };

  window.claude = {
    use: async (nome) => { await pronto; return { user, db, sample, assets, downloads }[nome] || null; },
  };

  /* ---------- início ---------- */
  async function iniciar() {
    if (!window.supabase || !window.supabase.createClient) { tela("Sem conexão", "Não foi possível carregar o Yaad1. Confira a internet e recarregue a página.", ""); return; }
    sb = window.supabase.createClient(SUPA_URL, SUPA_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    sb.auth.onAuthStateChange((ev) => { if (ev === "PASSWORD_RECOVERY") aoRecuperar(); if (ev === "SIGNED_OUT" && sessao) { limparCache(); location.reload(); } });
    const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
    if (hash.get("error_code") || hash.get("error")) { history.replaceState(null, "", location.pathname); telaEntrar(); return erro(hash.get("error_code") === "otp_expired" ? "Este link venceu. Peça outro em Esqueci a senha." : "Este link não é mais válido. Peça outro em Esqueci a senha."); }
    if (hash.get("type") === "recovery") { esperaRecuperacao = setTimeout(() => { telaEntrar(); erro("Não consegui abrir o link. Peça outro em Esqueci a senha."); }, 6000); return; }
    const { data } = await sb.auth.getSession();
    if (data.session) { sessao = data.session; return depoisDeEntrar(); }
    telaEntrar();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
