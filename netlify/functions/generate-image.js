// netlify/functions/generate-image.js
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OPENAI_API_KEY no está configurada" }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const prompt = body.prompt;

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

    const data = await response.json();

    if (!response.ok) {
      console.error("Error OpenAI:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    const imageUrl = data?.data?.[0]?.url;
    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrl }),
    };
  } catch (err) {
    console.error("Error interno:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
