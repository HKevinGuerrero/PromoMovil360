// netlify/functions/generate-image.js
// Versión CommonJS (la que Netlify soporta sin líos)

exports.handler = async (event, context) => {
  console.log("generate-image llamado. Método:", event.httpMethod);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;

    if (!prompt) {
      console.log("Falta prompt");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Falta el prompt" }),
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY no está definida");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OPENAI_API_KEY no está configurada en Netlify" }),
      };
    }

    console.log("Llamando a OpenAI /v1/images/generations");

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1792",
        quality: "hd",
        style: "vivid",
      }),
    });

    const text = await response.text();
    console.log("Respuesta OpenAI status:", response.status);

    if (!response.ok) {
      console.error("Error de OpenAI:", text);
      return {
        statusCode: response.status,
        body: text, // lo reenvío tal cual para verlo desde el front
      };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("No se pudo parsear JSON de OpenAI:", e, text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Respuesta inválida de OpenAI" }),
      };
    }

    const imageUrl = data?.data?.[0]?.url;
    if (!imageUrl) {
      console.error("OpenAI no devolvió imageUrl. Data:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI no devolvió una imagen" }),
      };
    }

    console.log("Imagen generada OK");
    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrl }),
    };

  } catch (err) {
    console.error("Error interno en generate-image:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
