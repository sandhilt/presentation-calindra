import React, { useState } from "react";

type Cell = "X" | "O" | null;

// Helper to create empty board
const emptyBoard = () =>
  Array<Cell>(3)
    .fill(null)
    .map(() => Array<Cell>(3).fill(null));

function App() {
  const [board, setBoard] = useState(emptyBoard());
  const [isX, setIsX] = useState(true);
  const [status, setStatus] = useState("Your turn");

  // Check for winner
  const checkWinner = (b: (string | null)[][]) => {
    const lines = [
      // Rows
      ...b,
      // Columns
      ...[0, 1, 2].map((i) => b.map((row) => row[i])),
      // Diagonals
      [b[0][0], b[1][1], b[2][2]],
      [b[0][2], b[1][1], b[2][0]],
    ];
    for (const line of lines) {
      if (line.every((cell) => cell === "X")) return "X";
      if (line.every((cell) => cell === "O")) return "O";
    }
    return null;
  };

  // Handle human move
  const handleClick = (row: number, col: number) => {
    if (board[row][col] || checkWinner(board)) return;
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = "X";
    setBoard(newBoard);
    setIsX(false);
    setStatus("AI thinking...");
    // Send to backend
    fetch("http://localhost:3000/api/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board: newBoard }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(new Date().toISOString(), "AI move:", data);
        if (data.move) {
          const [aiRow, aiCol] = data.move.split(",").map(Number);
          if (!newBoard[aiRow][aiCol]) {
            newBoard[aiRow][aiCol] = "O";
            setBoard(newBoard);
            setIsX(true);
            setStatus("Your turn");
          }
        } else {
          setStatus("AI error");
        }
      })
      .catch(() => setStatus("AI error"));
  };

  // Render board
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>Tic Tac Toe vs LLM</h1>
      <div style={{ display: "inline-block" }}>
        {board.map((row, i) => (
          <div key={i} style={{ display: "flex" }}>
            {row.map((cell, j) => (
              <button
                key={j}
                style={{ width: 60, height: 60, fontSize: 24, margin: 2 }}
                onClick={() => handleClick(i, j)}
                disabled={!!cell || !isX || !!checkWinner(board)}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <strong>{status}</strong>
      </div>
      {checkWinner(board) && (
        <div style={{ marginTop: 20 }}>
          <h2>{checkWinner(board)} wins!</h2>
          <button
            onClick={() => {
              setBoard(emptyBoard());
              setIsX(true);
              setStatus("Your turn");
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
