import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// CORS manuell freigeben – wichtig für GitHub Pages
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://r-l-a.github.io"); // deine Domain
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch("https://router.huggingface.co/models/deepseek-ai/DeepSeek-V3.2", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: userMessage })
  });

  const data = await response.json();
  console.log("HF Response:", data);

  let reply = "Keine Antwort erhalten.";
  if (Array.isArray(data) && data[0]?.generated_text) {
    reply = data[0].generated_text;
  } else if (data.generated_text) {
    reply = data.generated_text;
  } else if (data.error) {
    reply = "Fehler: " + data.error;
  }

  res.json({ reply });
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));
