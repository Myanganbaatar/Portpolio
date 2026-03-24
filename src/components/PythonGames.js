import React, { useState, useEffect } from 'react';
import './PythonGames.css';

// =====================
// MORPION (Tic Tac Toe)
// =====================
function Morpion() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [turn, setTurn] = useState('X'); 
  const [gameStarted, setGameStarted] = useState(false);
  const [vsRobot, setVsRobot] = useState(true);
  const [p1Name, setP1Name] = useState('Joueur 1');
  const [p2Name, setP2Name] = useState('Joueur 2');

  const calculateWinner = React.useCallback((squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }, []);

  const makeAIMove = React.useCallback((newBoard) => {
    const empty = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (empty.length === 0) return null;
    
    // Win logic
    for (let i of empty) {
      const test = [...newBoard];
      test[i] = 'O';
      if (calculateWinner(test) === 'O') return i;
    }
    
    // Block logic
    for (let i of empty) {
      const test = [...newBoard];
      test[i] = 'X';
      if (calculateWinner(test) === 'X') return i;
    }
    
    if (empty.includes(4)) return 4;
    const corners = [0, 2, 6, 8].filter(i => empty.includes(i));
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    return empty[Math.floor(Math.random() * empty.length)];
  }, [calculateWinner]);

  useEffect(() => {
    if (gameStarted && !gameOver && vsRobot && turn === 'O') {
      const timeOut = setTimeout(() => {
        const aiMove = makeAIMove(board);
        if (aiMove !== null) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          const win = calculateWinner(newBoard);
          if (win) {
            setWinner(win);
            setGameOver(true);
          } else if (!newBoard.includes(null)) {
            setGameOver(true);
          } else {
            setTurn('X');
          }
          setBoard(newBoard);
        }
      }, 500);
      return () => clearTimeout(timeOut);
    }
  }, [turn, vsRobot, gameOver, gameStarted, board, makeAIMove, calculateWinner]);

  const handleClick = (index) => {
    if (board[index] || gameOver || (vsRobot && turn === 'O')) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    
    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      setGameOver(true);
    } else if (!newBoard.includes(null)) {
      setGameOver(true);
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setWinner(null);
    setTurn('X');
    setGameStarted(false);
  };
  
  const startGame = (robot) => {
    setVsRobot(robot);
    setGameStarted(true);
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setWinner(null);
    setTurn('X');
    if (robot) {
        setP1Name('Vous');
        setP2Name('Robot');
    }
  };

  if (!gameStarted) {
     return (
        <div className="game-menu">
            <h4>Configurer la partie</h4>
            <div className="menu-options" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
                <button className="reset-btn" onClick={() => startGame(true)}>🤖 Contre le Robot</button>
                <div className="pvp-setup" style={{ borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                    <p>Joueur vs Joueur:</p>
                    <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '5px' }} type="text" value={p1Name} onChange={(e) => setP1Name(e.target.value)} placeholder="Nom Joueur 1" />
                    <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '5px' }} type="text" value={p2Name} onChange={(e) => setP2Name(e.target.value)} placeholder="Nom Joueur 2" />
                    <button className="reset-btn" onClick={() => startGame(false)}>Commencer (2 Joueurs)</button>
                </div>
            </div>
        </div>
     );
  }

  return (
    <div className="game-container">
      <h3>🎯 Morpion (Tic Tac Toe)</h3>
      <div className="game-status">
        {gameOver ? (
          winner ? (
            <p>🏆 {winner === 'X' ? p1Name : p2Name} a gagné!</p>
          ) : (
            <p>🤝 Égalité!</p>
          )
        ) : (
          <p>Au tour de: {turn === 'X' ? p1Name : p2Name} ({turn === 'X' ? '❌' : '⭕'})</p>
        )}
      </div>
      <div className="morpion-board">
        {board.map((val, idx) => (
          <button
            key={idx}
            className={`morpion-cell ${val}`}
            onClick={() => handleClick(idx)}
            disabled={gameOver || val !== null}
          >
            {val === 'X' ? '❌' : val === 'O' ? '⭕' : ''}
          </button>
        ))}
      </div>
      <button className="reset-btn" onClick={resetGame}>Menu Principal</button>
    </div>
  );
}

// =====================
// PUISSANCE 4
// =====================
function Puissance4() {
  const ROWS = 6;
  const COLS = 7;
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('À vous de jouer');
  
  const [turn, setTurn] = useState('X'); 
  const [gameStarted, setGameStarted] = useState(false);
  const [vsRobot, setVsRobot] = useState(true);
  const [p1Name, setP1Name] = useState('Joueur 1');
  const [p2Name, setP2Name] = useState('Joueur 2');

  const checkWinner = React.useCallback((b, row, col, player) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (let [dr, dc] of directions) {
      let count = 1;
      for (let i = 1; i < 4; i++) {
        const nr = row + dr * i;
        const nc = col + dc * i;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc] === player) {
          count++;
        } else break;
      }
      for (let i = 1; i < 4; i++) {
        const nr = row - dr * i;
        const nc = col - dc * i;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc] === player) {
          count++;
        } else break;
      }
      if (count >= 4) return true;
    }
    return false;
  }, [ROWS, COLS]);

  const makeAIMove = React.useCallback((b) => {
    // Try to win
    for (let col = 0; col < COLS; col++) {
      for (let row = ROWS - 1; row >= 0; row--) {
        if (b[row][col] === null) {
          const test = b.map(r => [...r]);
          test[row][col] = 'O';
          if (checkWinner(test, row, col, 'O')) return col;
          break;
        }
      }
    }

    // Block opponent
    for (let col = 0; col < COLS; col++) {
      for (let row = ROWS - 1; row >= 0; row--) {
        if (b[row][col] === null) {
          const test = b.map(r => [...r]);
          test[row][col] = 'X';
          if (checkWinner(test, row, col, 'X')) return col;
          break;
        }
      }
    }

    // Play center or random
    const validCols = [];
    for(let c=0; c<COLS; c++) {
        if(b[0][c] === null) validCols.push(c);
    }
    if (validCols.includes(3)) return 3;
    return validCols[Math.floor(Math.random() * validCols.length)];
  }, [COLS, ROWS, checkWinner]);

  useEffect(() => {
    if (gameStarted && !gameOver && vsRobot && turn === 'O') {
        const timeOut = setTimeout(() => {
            const aiCol = makeAIMove(board);
            if (aiCol !== undefined && aiCol !== null) {
                let newBoard = board.map(r => [...r]);
                for (let aiRow = ROWS - 1; aiRow >= 0; aiRow--) {
                    if (newBoard[aiRow][aiCol] === null) {
                        newBoard[aiRow][aiCol] = 'O';
                        if (checkWinner(newBoard, aiRow, aiCol, 'O')) {
                            setGameOver(true);
                            setMessage(`🏆 ${p2Name} a gagné!`);
                        } else {
                            setTurn('X');
                            setMessage(`Au tour de ${p1Name} (🔴)`);
                        }
                        setBoard(newBoard);
                        break;
                    }
                }
            }
        }, 500);
        return () => clearTimeout(timeOut);
    }
  }, [turn, vsRobot, gameOver, gameStarted, board, makeAIMove, checkWinner, p1Name, p2Name, ROWS]);

  const dropPiece = (col) => {
    if (gameOver || (vsRobot && turn === 'O')) return;
    if (board[0][col] !== null) return;

    let newBoard = board.map(r => [...r]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = turn;

        if (checkWinner(newBoard, row, col, turn)) {
          setGameOver(true);
          setMessage(`🎉 ${turn === 'X' ? p1Name : p2Name} a gagné!`);
        } else {
           setTurn(turn === 'X' ? 'O' : 'X');
           setMessage(`Au tour de ${turn === 'X' ? p2Name : p1Name} (${turn === 'X' ? '🟡' : '🔴'})`);
        }
        setBoard(newBoard);
        break;
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setGameOver(false);
    setMessage('');
    setGameStarted(false);
    setTurn('X');
  };
  
  const startGame = (robot) => {
      setVsRobot(robot);
      setGameStarted(true);
      setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
      setGameOver(false);
      setTurn('X');
      if (robot) {
          setP1Name('Vous');
          setP2Name('Robot');
          setMessage('À vous de jouer (🔴)');
      } else {
          setMessage(`Au tour de ${p1Name} (🔴)`);
      }
  };

  if (!gameStarted) {
      return (
         <div className="game-menu">
             <h4>Configurer la partie</h4>
             <div className="menu-options" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
                 <button className="reset-btn" onClick={() => startGame(true)}>🤖 Contre le Robot</button>
                 <div className="pvp-setup" style={{ borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                     <p>Joueur vs Joueur:</p>
                     <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '5px' }} type="text" value={p1Name} onChange={(e) => setP1Name(e.target.value)} placeholder="Nom Joueur 1" />
                     <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '5px' }} type="text" value={p2Name} onChange={(e) => setP2Name(e.target.value)} placeholder="Nom Joueur 2" />
                     <button className="reset-btn" onClick={() => startGame(false)}>Commencer (2 Joueurs)</button>
                 </div>
             </div>
         </div>
      );
   }

  return (
    <div className="game-container">
      <h3>🔴 Puissance 4</h3>
      <div className="game-status">{message}</div>
      <div className="puissance4-board">
        {board.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`p4-cell ${cell ? cell : ''}`}
              onClick={() => !gameOver && dropPiece(colIdx)}
            >
              {cell === 'X' ? '🔴' : cell === 'O' ? '🟡' : '⚪'}
            </div>
          ))
        )}
      </div>
      <div className="p4-buttons">
        {Array(COLS).fill(0).map((_, col) => (
          <button
            key={col}
            className="drop-btn"
            onClick={() => dropPiece(col)}
            disabled={gameOver}
          >
            ⬇️ {col + 1}
          </button>
        ))}
      </div>
      {gameOver && <button className="reset-btn" onClick={resetGame}>Menu Principal</button>}
    </div>
  );
}

// =====================
// ALLUMETTES (Nim Game)
// =====================
function Allumettes() {
  const [matches, setMatches] = useState(21);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('À votre tour! Prenez 1, 2 ou 3 allumettes');

  const playerTakes = (count) => {
    if (gameOver || count > matches) return;

    let remaining = matches - count;
    setMatches(remaining);

    if (remaining === 0) {
      setGameOver(true);
      setMessage('🎉 Le Robot a dû prendre la dernière allumette - Vous avez gagné!');
      return;
    }

    // AI plays optimally
    let aiTakes = remaining % 4;
    if (aiTakes === 0) aiTakes = 1;

    remaining -= aiTakes;
    setMatches(remaining);

    if (remaining === 0) {
      setGameOver(true);
      setMessage(`🤖 Le Robot a pris ${aiTakes} allumette(s) - Le Robot a gagné!`);
      return;
    }

    setMessage(`Le Robot a pris ${aiTakes} allumette(s). À votre tour!`);
  };

  const resetGame = () => {
    setMatches(21);
    setGameOver(false);
    setMessage('À votre tour! Prenez 1, 2 ou 3 allumettes');
  };

  return (
    <div className="game-container">
      <h3>🔥 Allumettes (Jeu de Nim)</h3>
      <div className="game-status">{message}</div>
      <div className="matches-display">
        <div className="matches-count">{matches} allumettes restantes</div>
        <div className="matches-visual">
          {Array(matches).fill(0).map((_, i) => (
            <div key={i} className="match">🔥</div>
          ))}
        </div>
      </div>
      {!gameOver && (
        <div className="matches-buttons">
          <button onClick={() => playerTakes(1)} disabled={matches < 1}>Prendre 1</button>
          <button onClick={() => playerTakes(2)} disabled={matches < 2}>Prendre 2</button>
          <button onClick={() => playerTakes(3)} disabled={matches < 3}>Prendre 3</button>
        </div>
      )}
      {gameOver && <button className="reset-btn" onClick={resetGame}>Rejouer</button>}
    </div>
  );
}

// =====================
// DEVINETTE (Number Guessing)
// =====================
function Devinette() {
  const [gameStarted, setGameStarted] = useState(false);
  const [minNum, setMinNum] = useState('');
  const [maxNum, setMaxNum] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(null);
  const [message, setMessage] = useState('Pensez à un nombre et laissez le Robot le deviner!');
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    const min = parseInt(minNum);
    const max = parseInt(maxNum);

    if (isNaN(min) || isNaN(max) || min >= max) {
      setMessage('⚠️ Entrez un min et max valides (min < max)');
      return;
    }

    setGuesses([]);
    setCurrentGuess(Math.floor((min + max) / 2));
    setMessage(`Je pense que c'est ${Math.floor((min + max) / 2)}. Est-ce correct?`);
    setGameStarted(true);
    setGameOver(false);
  };

  const respond = (response) => {
    let newMin = minNum;
    let newMax = maxNum;
    const newGuesses = [...guesses, currentGuess];

    if (response === 'correct') {
      setGameOver(true);
      setMessage(`🎉 J'ai deviné en ${newGuesses.length} tentative(s)!`);
      return;
    }

    if (response === 'higher') {
      newMin = currentGuess + 1;
    } else {
      newMax = currentGuess - 1;
    }

    const nextGuess = Math.floor((parseInt(newMin) + parseInt(newMax)) / 2);
    setMinNum(newMin);
    setMaxNum(newMax);
    setGuesses(newGuesses);
    setCurrentGuess(nextGuess);
    setMessage(`Je pense que c'est ${nextGuess}. Correct?`);
  };

  const resetGame = () => {
    setGameStarted(false);
    setMinNum('');
    setMaxNum('');
    setGuesses([]);
    setCurrentGuess(null);
    setMessage('Pensez à un nombre et laissez le Robot le deviner!');
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h3>🎯 Devinette (Le robot devine)</h3>
      <div className="game-status">{message}</div>

      {!gameStarted ? (
        <div className="devinette-setup">
          <input
            type="number"
            placeholder="Nombre minimum"
            value={minNum}
            onChange={(e) => setMinNum(e.target.value)}
          />
          <input
            type="number"
            placeholder="Nombre maximum"
            value={maxNum}
            onChange={(e) => setMaxNum(e.target.value)}
          />
          <button onClick={startGame} className="start-btn">Commencer</button>
        </div>
      ) : (
        <div className="devinette-buttons">
          <button onClick={() => respond('correct')} className="guess-btn correct">
            ✅ Correct!
          </button>
          <button onClick={() => respond('higher')} className="guess-btn higher">
            ⬆️ Plus haut
          </button>
          <button onClick={() => respond('lower')} className="guess-btn lower">
            ⬇️ Plus bas
          </button>
        </div>
      )}

      {gameOver && (
        <button className="reset-btn" onClick={resetGame}>Nouvelle partie</button>
      )}
    </div>
  );
}

// =====================
// MAIN COMPONENT
// =====================
export default function PythonGames() {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'morpion', name: '🎯 Morpion', component: <Morpion /> },
    { id: 'puissance4', name: '🔴 Puissance 4', component: <Puissance4 /> },
    { id: 'allumettes', name: '🔥 Allumettes', component: <Allumettes /> },
    { id: 'devinette', name: '🎪 Devinette', component: <Devinette /> },
  ];

  return (
    <div className="python-games-container">
      {!activeGame ? (
        <div>
          <h3>🎮 Jeux Python - Jouables!</h3>
          <p className="games-intro">4 jeux développés en Python, maintenant jouables en ligne!</p>
          <div className="games-grid">
            {games.map((game) => (
              <button
                key={game.id}
                className="game-card-btn"
                onClick={() => setActiveGame(game.id)}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button className="back-btn" onClick={() => setActiveGame(null)}>
            ← Retour aux jeux
          </button>
          <div className="game-player">
            {games.find((g) => g.id === activeGame)?.component}
          </div>
        </div>
      )}
    </div>
  );
}
