export const handler = async (event) => {
  try {
    const slug = event.queryStringParameters?.slug;
    if (!slug) return { statusCode: 400, body: "Missing slug" };

    const SUPABASE_URL = "https://xjzkernuaqyfsfeowrsl.supabase.co";
    const SUPABASE_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqemtlcm51YXF5ZnNmZW93cnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjE5OTIsImV4cCI6MjA3NzQzNzk5Mn0.MSgTsMXHQ847X0NKl8Ly05kFczqwn9XC01dzsZ_cY-8";

    // Tabla de promos (slug → destino HTML)
    const redirects = {
      "ESTANCO-10": "/estanco-el20.html",
      "LACURVA-15": "/lacurva.html",
    };
    const target = redirects[slug];
    if (!target) return { statusCode: 404, body: "Promo not found" };

    // Registrar escaneo en Supabase
    const ua = event.headers["user-agent"] || "";
    const ip = (event.headers["x-forwarded-for"] || "").split(",")[0]?.trim() || "";
    const ip_hash = Buffer.from(ip).toString("base64");

    await fetch(`${SUPABASE_URL}/rest/v1/scans`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ promo_slug: slug, ua, ip_hash }),
    });

    // Redirigir al HTML real
    return {
      statusCode: 302,
      headers: { Location: target },
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
