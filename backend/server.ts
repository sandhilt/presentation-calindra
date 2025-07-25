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

// Call Ollama LLM API (local)
async function callLLM(prompt: string) {
  const url = new URL("/api/generate", ollamaHost);
  const ollamaRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ollamaModel,
      prompt,
      stream: false,
      format: {
        type: "object",
        properties: {
          row: {
            type: "integer",
          },
          column: {
            type: "integer",
          },
        },
        required: ["row", "column"],
      },
    }),
  });

  if (!ollamaRes.ok) {
    const errorText = await ollamaRes.text();
    throw new Error(
      `Ollama API error: ${ollamaRes.status} ${ollamaRes.statusText} - ${errorText}`
    );
  }

  return ollamaRes.json();
}

function checkResponse(move: string | null, board: (string | null)[][]) {
  if (!move) return false;
  const [row, col] = move.split(",").map(Number);
  if (isNaN(row) || isNaN(col)) return false;
  if (row < 0 || row > 2 || col < 0 || col > 2) return false;
  if (board[row][col]) return false; // Cell already occupied
  return true;
}

// POST /api/move: Receives board state, returns AI move
app.post("/api/move", async (req, res) => {
  const board = req.body.board;
  logWithTimestamp("Received board:", board);

  // Prepare prompt for Ollama
  const prompt = `You are playing Tic Tac Toe. The board is represented as a 3x3 array. Respond with your move as 'row,col'. Board: ${JSON.stringify(
    board
  )}`;

  let isValid = false;
  let retries = 18;

  while (retries > 0 && !isValid) {
    retries--;
    logWithTimestamp(`Attempting to call LLM, retries left: ${retries}`);
    try {
      const ollamaData = await callLLM(prompt);
      logWithTimestamp("Ollama response:", ollamaData.response);

      // Extract move from LLM response
      const tuple = JSON.parse(ollamaData.response)
      const move = `${tuple?.row},${tuple?.column}`;
      logWithTimestamp("Parsed move from LLM:", move);
      // const tuple = ollamaData.response.match(/\d,\d/);
      // const move = tuple ? tuple[0] : null;

      isValid = checkResponse(move, board);
      if (isValid) {
        res.json({ move });
        break; // Exit loop on valid move
      } else {
        logWithTimestamp("Invalid move received from LLM, retrying...");
        if (retries === 0) {
          throw new Error("LLM provided an invalid move after retries");
        }
      }
    } catch (error) {
      errorWIthTimestamp("Ollama error:", error.message);
      if (retries === 0) {
        res.status(500).json({ error: "LLM error" });
      }
    }
  }
});

app.listen(PORT, () => {
  logWithTimestamp(
    `Tic Tac Toe API running on http://localhost:${PORT}/api/move`
  );
});
