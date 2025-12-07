import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch("https://api-inference.huggingface.co/models/openai/gpt-oss-120b", {
    method: "POST",
    headers: {
      "Authorization": "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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: userMessage })
  });

  const data = await response.json();
  res.json({ reply: data[0]?.generated_text });
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));
