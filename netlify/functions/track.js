// netlify/functions/track.js
export const handler = async (event) => {
  try {
    // 1) Validar slug recibido desde el redirect
    const slug = event.queryStringParameters?.slug;
    if (!slug) return { statusCode: 400, body: "Missing slug" };

    // 2) Mapear slug -> HTML real
    const redirects = {
      "ESTANCO-10": "/estanco-el20.html",
      "LACURVA-15": "/lacurva.html",
    };
    const target = redirects[slug];
    if (!target) return { statusCode: 404, body: "Promo not found" };

    // 3) Capturar UA e IP (hash base64 para no guardar IP en claro)
    const ua = event.headers["user-agent"] || "";
    const ipHeader =
      event.headers["x-forwarded-for"] ||
      event.headers["client-ip"] ||
      event.headers["x-real-ip"] ||
      "";
    const ip = ipHeader.split(",")[0].trim();
    const ip_hash = Buffer.from(ip).toString("base64");

    // 4) Insertar en Supabase (tabla public.scans con columnas: promo_slug, ua, ip_hash, ts default now())
    const SUPABASE_URL = "https://xjzkernuaqyfsfeowrsl.supabase.co";
    const SUPABASE_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqemtlcm51YXF5ZnNmZW93cnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjE5OTIsImV4cCI6MjA3NzQzNzk5Mn0.MSgTsMXHQ847X0NKl8Ly05kFczqwn9XC01dzsZ_cY-8";

    const resp = await fetch(`${SUPABASE_URL}/rest/v1/scans`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ promo_slug: slug, ua, ip_hash }),
    });

    // Si falla, verás el detalle en los logs de Netlify
    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 500, body: `Insert failed: ${resp.status} ${text}` };
    }

    // 5) Redirigir al HTML real (esto es lo que le faltaba a tu snippet)
    return {
      statusCode: 302,
      headers: {
        Location: target,
        "Cache-Control": "no-store",
      },
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};

