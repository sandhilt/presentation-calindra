# 🤖 Tic Tac Toe with Local LLM (Qwen2.5-Coder via Ollama)

This project is a browser-based Tic Tac Toe game where you play against a local LLM running via [Ollama](https://ollama.com/). The API is built with **Node.js and Express**, and the frontend uses React (Vite + TypeScript).

## 📦 Prerequisites
- Node.js >= 22
- Yarn or npm
- Ollama installed ([https://ollama.com](https://ollama.com))
- Ngrok installed (`npm install -g ngrok`)

## 🧱 Project Structure
```
llm-tictactoe/
├── backend/
│   └── server.js        # Express API connected to Ollama
├── frontend/
│   └── (React App)      # UI based on the official tutorial
└── README.md
```

## 🔁 Setup Steps

### 1. Download the LLM Model
```bash
ollama pull qwen2.5:coder
ollama run qwen2.5:coder
```
Leave this process running.

### 2. Start the Express Backend
```bash
cd backend
npm install
node server.js
```
API will be available at http://localhost:3000/api/move

### 3. Install and Run the React Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Expose the Frontend with ngrok
In another terminal:
```bash
ngrok http 5173
```
Copy the generated HTTPS link, e.g.: https://abcdef1234.ngrok.io

### 5. Generate a QR Code (optional)
Install and use:
```bash
npm install qrcode-terminal
npx qrcode-terminal https://abcdef1234.ngrok.io
```
Show this QR code for easy mobile access.

## 🧠 How does the AI play?
- After each human move, React sends the board state to http://localhost:3000/api/move
- Express calls the local LLM model via Ollama
- The LLM responds with a position "row,col" (e.g., "1,2")
- React updates the board

## 🧪 Local Testing
1. Open the game in your browser via localhost or ngrok link
2. Make a move
3. Watch the API terminal receive the board
4. See the AI respond and play back

## ✨ Purpose
This demo shows how to:
- Use a local LLM as a decision agent
- Connect frontend, backend, and inference
- Share experiences with the public without login or credentials

## 🧰 Extras
- For logs, enable console.log(board) in server.js
- For caching, use Redis or save games locally
- For multiplayer vs AI, extend the backend with socket.io

## 🧼 To restart
```bash
killall node  # (or use Ctrl+C in terminals)
```

Made with ☕, code, and billions of parameters.
