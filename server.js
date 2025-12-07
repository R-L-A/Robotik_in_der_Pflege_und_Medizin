import express from "express";
import { OpenAI } from "openai";

const app = express();
app.use(express.json());

// CORS manuell freigeben – wichtig für GitHub Pages
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://r-l-a.github.io"); // deine GitHub Pages Domain
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Hugging Face Router über OpenAI-Client
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN, // Hugging Face Token als Env-Variable setzen!
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3.2:novita", // Modellname im Router-Format
      messages: [
        {
          role: "system",
          content: "Du bist eine hilfreiche KI, spezialisiert auf Robotik in der Pflege und Medizin. Antworte ausschließlich zu diesem Thema und weiche nicht davon ab."
        },
        { role: "user", content: userMessage }
      ],
    });

    const reply = chatCompletion.choices?.[0]?.message?.content || "Keine Antwort erhalten.";
    res.json({ reply });
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ reply: "Serverfehler: " + err.message });
  }
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));
