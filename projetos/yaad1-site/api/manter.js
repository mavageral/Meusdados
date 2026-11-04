// Yaad1 (site): chamada diária da Vercel (cron) para o banco Supabase não ser pausado por falta de uso.
const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== "Bearer " + process.env.CRON_SECRET) return res.status(401).json({ ok: false });
  try {
    const r = await fetch(SUPA_URL + "/rest/v1/app_owner?select=user_id&limit=1", { headers: { apikey: SUPA_KEY } });
    return res.status(200).json({ ok: r.ok, status: r.status, em: new Date().toISOString() });
  } catch (e) {
    return res.status(200).json({ ok: false });
  }
}
