# 🤖 Tic Tac Toe com LLM Local (Qwen2.5-Coder via Ollama)

Este projeto cria um jogo da velha (tic tac toe) acessível via navegador, onde qualquer pessoa pode jogar contra uma LLM local rodando via [Ollama](https://ollama.com/). A API é feita em **Node.js com Express**, e o frontend é baseado no tutorial oficial do React. Pode usar vite com typescript.

---

## 📦 Pré-requisitos

- Node.js >= 22
- Yarn ou npm
- Ollama instalado ([https://ollama.com](https://ollama.com))
- Ngrok instalado (`npm install -g ngrok`)

---

## 🧱 Estrutura do projeto
llm-tictactoe/
├── backend/
│ └── server.js # API Express conectada à Ollama
├── frontend/
│ └── (React App) # UI baseada no tutorial oficial
└── README.md


---

## 🔁 Passo a passo de instalação

### 1. Baixe o modelo LLM
Abra um terminal e rode:

```bash
ollama pull qwen2.5:coder
ollama run qwen2.5:coder
```

Deixe esse processo rodando.

### 2. Rode o backend Express

```bash
cd backend
npm install
node server.js
```

A API estará em http://localhost:3000/api/move

### 3. Instale e rode o frontend React

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Exporte o frontend com ngrok

Em outro terminal:

```bash
ngrok http 5173
```

Copie o link HTTPS gerado, por exemplo: https://abcdef1234.ngrok.io

### 5. Gere o QR Code (opcional)
Instale e use:

```bash
npm install qrcode-terminal
npx qrcode-terminal https://abcdef1234.ngrok.io
```

Mostre esse QR Code na sua apresentação para que qualquer pessoa com um celular acesse e jogue.

🧠 Como a IA joga?
A cada jogada humana:
- O React envia o estado do tabuleiro para http://localhost:3000/api/move
- O Express chama o modelo LLM local via Ollama
- A LLM responde com uma posição "linha,coluna" (ex: "1,2")
- O React atualiza o tabuleiro

🧪 Teste local
1. Abra o jogo no navegador via localhost ou link do ngrok
2. Faça uma jogada
3. Observe o terminal da API recebendo o tabuleiro
4. Veja a IA respondendo e jogando de volta

✨ Objetivo
Essa demo mostra como:
- Usar uma LLM local como agente de decisão
- Conectar frontend, backend e inferência
- Compartilhar experiências com o público sem login ou credenciais

🧰 Extras
- Para logs, ative console.log(board) no server.js
- Para cache, você pode usar Redis ou salvar as partidas localmente
- Para multiplayer vs IA, é possível estender o backend para usar socket.io

🧼 Para reiniciar
```bash
killall node  # (ou use Ctrl+C nos terminais)
```

Feito com ☕, código e bilhões de parâmetros.