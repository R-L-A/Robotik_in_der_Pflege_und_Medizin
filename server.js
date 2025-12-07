import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// CORS freigeben
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch("https://api-inference.huggingface.co/models/openai/gpt-oss-120b", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: userMessage })
  });

  const data = await response.json();
  console.log(data); // wichtig zum Debuggen
  res.json({ reply: data[0]?.generated_text || "Keine Antwort erhalten." });
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));
