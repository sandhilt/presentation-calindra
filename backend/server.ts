// Express API for Tic Tac Toe with LLM (Qwen2.5-Coder via Ollama)
// @ts-ignore
import express from "express";
// @ts-ignore
import cors from "cors";
import { URL } from "node:url";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
let ollamaModel =
  process.env.OLLAMA_MODEL || "qwen2.5-coder:7b-instruct-q4_K_M";

function logWithTimestamp(...message: unknown[]) {
  const now = new Date().toISOString();
  console.log(`[${now}]`, ...message);
}

function errorWIthTimestamp(...message: unknown[]) {
  const now = new Date().toISOString();
  console.error(`[${now}]`, ...message);
}

// PUT /api/changeModel: Changes the model used by the LLM
// app.put("/api/changeModel", (req, res) => {
//   const { model } = req.body;
//   if (!model) {
//     return res.status(400).json({ error: "Model name is required" });
//   }
//   ollamaModel = model;
//   logWithTimestamp(`Model changed to: ${ollamaModel}`);
//   res.json({ message: `Model changed to ${ollamaModel}` });
// });

// POST /api/move: Receives board state, returns AI move
app.post("/api/move", async (req, res) => {
  const board = req.body.board;
  logWithTimestamp("Received board:", board);

  // Prepare prompt for Ollama
  const prompt = `You are playing Tic Tac Toe. The board is represented as a 3x3 array. Respond with your move as 'row,col'. Board: ${JSON.stringify(
    board
  )}`;

  try {
    // Call Ollama LLM API (local)
    const url = new URL("/api/generate", ollamaHost);
    const ollamaRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        prompt,
        stream: false,
      }),
    });

    const ollamaData = await ollamaRes.json();

    logWithTimestamp("Ollama response:", ollamaData.response);

    // Extract move from LLM response
    const move = ollamaData.response.match(/\d,\d/);
    res.json({ move: move ? move[0] : null });
  } catch (error) {
    errorWIthTimestamp("Ollama error:", error.message);
    res.status(500).json({ error: "LLM error" });
  }
});

app.listen(PORT, () => {
  logWithTimestamp(
    `Tic Tac Toe API running on http://localhost:${PORT}/api/move`
  );
});
