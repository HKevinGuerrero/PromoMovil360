// netlify/functions/stats.js
// Devuelve: last7d, last30d, total y series diarias (7 y 30 días) para dibujar sparklines.

export const handler = async (event) => {
  try {
    const slug = event.queryStringParameters?.slug;
    if (!slug) return { statusCode: 400, body: "Missing slug" };

    const url = "https://xjzkernuaqyfsfeowrsl.supabase.co";
    const key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqemtlcm51YXF5ZnNmZW93cnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjE5OTIsImV4cCI6MjA3NzQzNzk5Mn0.MSgTsMXHQ847X0NKl8Ly05kFczqwn9XC01dzsZ_cY-8";

    const today = new Date();
    const d7  = new Date(today);  d7.setDate(today.getDate() - 6);   // 7 días (incluye hoy)
    const d30 = new Date(today); d30.setDate(today.getDate() - 29);  // 30 días (incluye hoy)
    const iso = d => d.toISOString();

    // Total global
    const rAll = await fetch(
      `${url}/rest/v1/scans?promo_slug=eq.${encodeURIComponent(slug)}&select=ts`,
      { headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" } }
    );
    const crAll = rAll.headers.get("content-range");
    const total = crAll ? parseInt(crAll.split("/")[1], 10) : 0;

    // Conteo simple desde una fecha
    async function countSince(from) {
      const q = `${url}/rest/v1/scans?promo_slug=eq.${encodeURIComponent(slug)}&ts=gte.${iso(from)}&select=ts`;
      const r = await fetch(q, { headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" } });
      const cr = r.headers.get("content-range");
      return cr ? parseInt(cr.split("/")[1], 10) : 0;
    }

    // Serie por días (labels ISO yyyy-mm-dd y valores por día)
    async function daySeries(fromDate, days) {
      const labels = [], data = [];
      const cursor = new Date(fromDate);
      for (let i = 0; i < days; i++) {
        const start = new Date(cursor); start.setHours(0, 0, 0, 0);
        const end   = new Date(start);  end.setDate(end.getDate() + 1);

        const q = `${url}/rest/v1/scans?promo_slug=eq.${encodeURIComponent(slug)}&ts=gte.${iso(start)}&ts=lt.${iso(end)}&select=ts`;
        const r = await fetch(q, { headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" } });
        const cr = r.headers.get("content-range");
        const c  = cr ? parseInt(cr.split("/")[1], 10) : 0;

        labels.push(start.toISOString().slice(0, 10));
        data.push(c);
        cursor.setDate(cursor.getDate() + 1);
      }
      return { labels, data };
    }

    const last7d  = await countSince(d7);
    const last30d = await countSince(d30);
    const series7  = await daySeries(d7, 7);
    const series30 = await daySeries(d30, 30);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ slug, last7d, last30d, total, series7, series30 })
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
