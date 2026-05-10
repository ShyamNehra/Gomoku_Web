import React, { useState, useEffect, useCallback } from "react";
import { playSound } from "./audio";

const THEME = {
  bg: "#0d0f14",
  gridLine: "rgba(255,255,255,0.07)",
  accent: "#e8b84b",
  pieceX: "#b8c8f0",
  pieceO: "#e8b84b",
  pieceXGlow: "rgba(140,170,255,0.15)",
  pieceOGlow: "rgba(232,184,75,0.15)",
};

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function TicTacToe({ volume, onBack }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState(null); // 'pvp' or 'ai'
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const vol = volume / 100;

  const checkWinner = (squares) => {
    for (let combo of WIN_COMBOS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo };
      }
    }
    if (squares.every(s => s !== null)) return { winner: "Draw", line: null };
    return null;
  };

  const minimax = (squares, depth, isMaximizing) => {
    const res = checkWinner(squares);
    if (res?.winner === "O") return 10 - depth;
    if (res?.winner === "X") return depth - 10;
    if (res?.winner === "Draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = "O";
          bestScore = Math.max(bestScore, minimax(squares, depth + 1, false));
          squares[i] = null;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = "X";
          bestScore = Math.min(bestScore, minimax(squares, depth + 1, true));
          squares[i] = null;
        }
      }
      return bestScore;
    }
  };

  const aiMove = useCallback((currentBoard) => {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        currentBoard[i] = "O";
        let score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }, []);

  const handleClick = (i) => {
    if (winner || board[i]) return;
    if (gameMode === "ai" && !isXNext) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? "X" : "O";
    processMove(newBoard);
  };

  const processMove = (newBoard) => {
    setBoard(newBoard);
    playSound("place", vol);
    
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      if (result.winner === "X") {
        setScores(s => ({ ...s, X: s.X + 1 }));
        playSound("win", vol);
      } else if (result.winner === "O") {
        setScores(s => ({ ...s, O: s.O + 1 }));
        if (gameMode === "ai") playSound("lose", vol);
        else playSound("win", vol);
      }
    } else {
      setIsXNext(!isXNext);
    }
  };

  useEffect(() => {
    if (gameMode === "ai" && !isXNext && !winner) {
      const timer = setTimeout(() => {
        const move = aiMove([...board]);
        if (move !== -1) {
          const newBoard = [...board];
          newBoard[move] = "O";
          processMove(newBoard);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, gameMode, board, aiMove]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    playSound("click", vol);
  };


  if (!gameMode) {
    return (
      <div className="game-overlay">
        <style>{`
          .game-overlay { position: fixed; inset: 0; background: ${THEME.bg}; display: flex; align-items: center; justify-content: center; z-index: 100; font-family: 'DM Mono', monospace; }
          .selection-box { display: flex; flex-direction: column; gap: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 12px; text-align: center; }
          .selection-title { color: ${THEME.accent}; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; font-size: 14px; }
          .selection-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px 24px; cursor: pointer; font-family: inherit; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.2s; border-radius: 6px; }
          .selection-btn:hover { background: ${THEME.accent}; color: #0d0f14; border-color: ${THEME.accent}; }
        `}</style>
        <div className="selection-box">
          <div className="selection-title">3x3 Classic</div>
          <button className="selection-btn" onClick={() => { playSound("click", vol); setGameMode("ai"); }}>Vs AI</button>
          <button className="selection-btn" onClick={() => { playSound("click", vol); setGameMode("pvp"); }}>Local PvP</button>
          <button className="selection-btn" style={{marginTop: '10px', opacity: 0.5}} onClick={onBack}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ttt-container">
      <style>{`
        .ttt-container { position: fixed; inset: 0; background: ${THEME.bg}; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; color: #fff; }
        .ttt-header { position: absolute; top: 40px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .ttt-label { font-size: 10px; color: ${THEME.accent}; opacity: 0.6; letter-spacing: 0.3em; text-transform: uppercase; }
        .ttt-scoreboard { display: flex; align-items: center; gap: 30px; background: rgba(255,255,255,0.03); padding: 10px 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .ttt-score-val { font-size: 20px; font-weight: bold; }
        .ttt-score-box { display: flex; flex-direction: column; align-items: center; }
        .ttt-score-label { font-size: 8px; opacity: 0.4; margin-bottom: 4px; letter-spacing: 0.1em; }
        
        .ttt-grid { display: grid; grid-template-columns: repeat(3, 100px); grid-template-rows: repeat(3, 100px); gap: 10px; background: ${THEME.gridLine}; padding: 10px; border-radius: 8px; position: relative; }
        .ttt-cell { width: 100px; height: 100px; background: ${THEME.bg}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; position: relative; overflow: hidden; }
        .ttt-cell:hover { background: rgba(255,255,255,0.02); }
        
        .ttt-piece { font-size: 32px; font-weight: bold; position: relative; z-index: 2; }
        .ttt-piece.x { color: ${THEME.pieceX}; }
        .ttt-piece.o { color: ${THEME.pieceO}; }
        .ttt-glow { position: absolute; inset: 0; filter: blur(20px); opacity: 0.4; z-index: 1; }
        .ttt-glow.x { background: ${THEME.pieceXGlow}; }
        .ttt-glow.o { background: ${THEME.pieceOGlow}; }

        .ttt-win-line { position: absolute; background: ${THEME.accent}; z-index: 10; border-radius: 4px; box-shadow: 0 0 15px ${THEME.accent}; transition: all 0.5s; }

        .ttt-footer { position: absolute; bottom: 60px; display: flex; gap: 16px; }
        .ttt-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 20px; cursor: pointer; font-family: inherit; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 6px; }
        .ttt-btn:hover { background: rgba(255,255,255,0.1); }
        .ttt-btn.accent { background: ${THEME.accent}; color: #0d0f14; border-color: ${THEME.accent}; }

        .ttt-status { margin-top: 20px; font-size: 12px; letter-spacing: 0.1em; color: ${THEME.accent}; }
      `}</style>

      <div className="ttt-header">
        <div className="ttt-label">Kyro · Classic 3x3</div>
        <div className="ttt-scoreboard">
          <div className="ttt-score-box">
            <span className="ttt-score-label">PLAYER X</span>
            <span className="ttt-score-val" style={{color: THEME.pieceX}}>{scores.X}</span>
          </div>
          <div className="ttt-score-box">
            <span className="ttt-score-label">{gameMode === 'ai' ? 'AI' : 'PLAYER O'}</span>
            <span className="ttt-score-val" style={{color: THEME.pieceO}}>{scores.O}</span>
          </div>
        </div>
        <div className="ttt-status">
          {winner ? (winner === "Draw" ? "Game Draw" : `${winner} Wins!`) : `${isXNext ? "X" : "O"}'s Turn`}
        </div>
      </div>

      <div className="ttt-grid">
        {board.map((cell, i) => (
          <div key={i} className="ttt-cell" onClick={() => handleClick(i)}>
            {cell && (
              <>
                <div className={`ttt-glow ${cell.toLowerCase()}`} />
                <div className={`ttt-piece ${cell.toLowerCase()}`}>{cell}</div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="ttt-footer">
        <button className="ttt-btn" onClick={onBack}>Menu</button>
        <button className="ttt-btn accent" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
