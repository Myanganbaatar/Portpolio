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

  const restartMatch = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setWinner(null);
    setTurn('X');
  }
  
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
      <div className="game-controls">
        {gameOver && <button className="reset-btn" onClick={restartMatch}>🔄 Rejouer</button>}
        <button className="reset-btn" onClick={resetGame}>Menu Principal</button>
      </div>
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
  
  const restartMatch = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setGameOver(false);
    setTurn('X');
    if (vsRobot) {
        setMessage('À vous de jouer (🔴)');
    } else {
        setMessage(`Au tour de ${p1Name} (🔴)`);
    }
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
      <div className="game-controls">
        {gameOver && <button className="reset-btn" onClick={restartMatch}>🔄 Rejouer</button>}
        {gameOver && <button className="reset-btn" onClick={resetGame}>Menu Principal</button>}
      </div>
    </div>
  );
}

// =====================
// ALLUMETTES (Nim Game)
// =====================
// Rule of the Python version: players take 1, 2 or 3 matches, whoever takes the last one wins.
function Allumettes() {
  const [matches, setMatches] = useState(21);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [vsRobot, setVsRobot] = useState(true);
  const [p1Name, setP1Name] = useState('Joueur 1');
  const [p2Name, setP2Name] = useState('Joueur 2');
  const [turn, setTurn] = useState(0); // 0 = player 1, 1 = player 2
  const [message, setMessage] = useState('');

  const names = [p1Name, p2Name];

  const startGame = (robot) => {
    setVsRobot(robot);
    if (robot) {
      setP1Name('Vous');
      setP2Name('Robot');
    }
    setMatches(21);
    setGameOver(false);
    setTurn(0);
    setMessage(robot ? 'À votre tour ! Prenez 1, 2 ou 3 allumettes' : `À ${robot ? 'vous' : p1Name} de jouer : prenez 1, 2 ou 3 allumettes`);
    setGameStarted(true);
  };

  const take = (count) => {
    if (gameOver || count > matches) return;
    let remaining = matches - count;
    setMatches(remaining);

    if (remaining === 0) {
      setGameOver(true);
      setMessage(vsRobot ? '🎉 Vous avez pris la dernière allumette - Vous avez gagné !' : `🏆 ${names[turn]} a pris la dernière allumette et gagne !`);
      return;
    }

    if (!vsRobot) {
      const next = 1 - turn;
      setTurn(next);
      setMessage(`${names[turn]} a pris ${count} allumette(s). À ${names[next]} de jouer !`);
      return;
    }

    // The robot plays optimally: it leaves a multiple of 4.
    let aiTakes = remaining % 4;
    if (aiTakes === 0) aiTakes = 1;
    remaining -= aiTakes;
    setMatches(remaining);

    if (remaining === 0) {
      setGameOver(true);
      setMessage(`🤖 Le Robot a pris ${aiTakes} allumette(s) - Le Robot a gagné !`);
      return;
    }
    setMessage(`Le Robot a pris ${aiTakes} allumette(s). À votre tour !`);
  };

  const restartMatch = () => startGame(vsRobot);
  const resetGame = () => {
    setGameStarted(false);
    setP1Name('Joueur 1');
    setP2Name('Joueur 2');
  };

  if (!gameStarted) {
    return (
      <div className="game-menu">
        <h4>🔥 Allumettes - Configurer la partie</h4>
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
      <h3>🔥 Allumettes (Jeu de Nim) {vsRobot ? '· contre le Robot' : '· 2 joueurs'}</h3>
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
          <button onClick={() => take(1)} disabled={matches < 1}>Prendre 1</button>
          <button onClick={() => take(2)} disabled={matches < 2}>Prendre 2</button>
          <button onClick={() => take(3)} disabled={matches < 3}>Prendre 3</button>
        </div>
      )}
      <div className="game-controls">
        {gameOver && <button className="reset-btn" onClick={restartMatch}>🔄 Rejouer</button>}
        <button className="reset-btn" onClick={resetGame}>Menu Principal</button>
      </div>
    </div>
  );
}

// =====================
// DEVINETTE (Number Guessing)
// =====================
// Against the robot: you think of a number and the robot finds it (binary search).
// Two players: player 1 hides a number, player 2 guesses it.
function Devinette() {
  const [mode, setMode] = useState(null); // null = menu, 'robot', 'pvp'
  const [minNum, setMinNum] = useState('');
  const [maxNum, setMaxNum] = useState('');
  const [p1Name, setP1Name] = useState('Joueur 1');
  const [p2Name, setP2Name] = useState('Joueur 2');
  const [secret, setSecret] = useState('');
  const [hidden, setHidden] = useState(false); // pvp: number chosen and hidden
  const [guessInput, setGuessInput] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(null);
  const [bounds, setBounds] = useState(null); // robot's search interval
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const range = () => {
    const min = parseInt(minNum, 10);
    const max = parseInt(maxNum, 10);
    if (isNaN(min) || isNaN(max) || min >= max) {
      setMessage('⚠️ Entrez un min et max valides (min < max)');
      return null;
    }
    return [min, max];
  };

  // ----- against the robot -----
  const startRobot = () => {
    const r = range();
    if (!r) return;
    const guess = Math.floor((r[0] + r[1]) / 2);
    setBounds(r);
    setGuesses([]);
    setCurrentGuess(guess);
    setMessage(`Je pense que c'est ${guess}. Est-ce correct ?`);
    setGameOver(false);
    setMode('robot');
  };

  const respond = (response) => {
    const newGuesses = [...guesses, currentGuess];
    if (response === 'correct') {
      setGuesses(newGuesses);
      setGameOver(true);
      setMessage(`🎉 J'ai deviné en ${newGuesses.length} tentative(s) !`);
      return;
    }
    const [lo, hi] = response === 'higher' ? [currentGuess + 1, bounds[1]] : [bounds[0], currentGuess - 1];
    if (lo > hi) {
      setMessage('🤔 Impossible ! Vérifiez vos réponses.');
      return;
    }
    const next = Math.floor((lo + hi) / 2);
    setBounds([lo, hi]);
    setGuesses(newGuesses);
    setCurrentGuess(next);
    setMessage(`Je pense que c'est ${next}. Correct ?`);
  };

  // ----- two players -----
  const hideNumber = () => {
    const r = range();
    if (!r) return;
    const n = parseInt(secret, 10);
    if (isNaN(n) || n < r[0] || n > r[1]) {
      setMessage(`⚠️ ${p1Name}, choisissez un nombre entre ${r[0]} et ${r[1]}`);
      return;
    }
    setHidden(true);
    setGuesses([]);
    setGameOver(false);
    setMessage(`${p2Name}, devinez le nombre de ${p1Name} (entre ${r[0]} et ${r[1]}) !`);
  };

  const guessPvp = (e) => {
    e.preventDefault();
    const g = parseInt(guessInput, 10);
    if (isNaN(g)) return;
    const n = parseInt(secret, 10);
    const newGuesses = [...guesses, g];
    setGuesses(newGuesses);
    setGuessInput('');
    if (g === n) {
      setGameOver(true);
      setMessage(`🏆 ${p2Name} a trouvé ${n} en ${newGuesses.length} tentative(s) !`);
    } else {
      setMessage(g < n ? `⬆️ Plus grand que ${g}` : `⬇️ Plus petit que ${g}`);
    }
  };

  const resetGame = () => {
    setMode(null);
    setSecret('');
    setHidden(false);
    setGuessInput('');
    setGuesses([]);
    setCurrentGuess(null);
    setBounds(null);
    setMessage('');
    setGameOver(false);
  };

  const rangeInputs = (
    <>
      <input type="number" placeholder="Nombre minimum" value={minNum} onChange={(e) => setMinNum(e.target.value)} />
      <input type="number" placeholder="Nombre maximum" value={maxNum} onChange={(e) => setMaxNum(e.target.value)} />
    </>
  );

  if (mode === null) {
    return (
      <div className="game-menu">
        <h4>🎯 Devinette - Configurer la partie</h4>
        {message && <div className="game-status">{message}</div>}
        <div className="menu-options" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto' }}>
          <div className="devinette-setup">{rangeInputs}</div>
          <button className="reset-btn" onClick={startRobot}>🤖 Contre le Robot (il devine votre nombre)</button>
          <div className="pvp-setup" style={{ borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            <p>Joueur vs Joueur:</p>
            <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '5px' }} type="text" value={p1Name} onChange={(e) => setP1Name(e.target.value)} placeholder="Joueur qui cache le nombre" />
            <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '5px' }} type="text" value={p2Name} onChange={(e) => setP2Name(e.target.value)} placeholder="Joueur qui devine" />
            <button
              className="reset-btn"
              onClick={() => {
                if (!range()) return;
                setMessage(`${p1Name}, choisissez un nombre secret (${p2Name} ne regarde pas !)`);
                setMode('pvp');
              }}
            >
              Commencer (2 Joueurs)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h3>🎯 Devinette {mode === 'robot' ? '· le Robot devine' : '· 2 joueurs'}</h3>
      <div className="game-status">{message}</div>

      {mode === 'robot' && !gameOver && (
        <div className="devinette-buttons">
          <button onClick={() => respond('correct')} className="guess-btn correct">✅ Correct!</button>
          <button onClick={() => respond('higher')} className="guess-btn higher">⬆️ Plus haut</button>
          <button onClick={() => respond('lower')} className="guess-btn lower">⬇️ Plus bas</button>
        </div>
      )}

      {mode === 'pvp' && !hidden && (
        <div className="devinette-setup">
          <input type="password" inputMode="numeric" placeholder={`Nombre secret de ${p1Name}`} value={secret} onChange={(e) => setSecret(e.target.value)} />
          <button onClick={hideNumber} className="start-btn">Cacher le nombre</button>
        </div>
      )}

      {mode === 'pvp' && hidden && !gameOver && (
        <form className="devinette-setup" onSubmit={guessPvp}>
          <input type="number" placeholder={`Proposition de ${p2Name}`} value={guessInput} onChange={(e) => setGuessInput(e.target.value)} autoFocus />
          <button type="submit" className="start-btn">Proposer</button>
        </form>
      )}

      {guesses.length > 0 && <p className="games-intro">Tentatives : {guesses.join(', ')}</p>}

      <div className="game-controls">
        {gameOver && mode === 'robot' && <button className="reset-btn" onClick={startRobot}>🔄 Rejouer (Même intervalle)</button>}
        {gameOver && mode === 'pvp' && (
          <button
            className="reset-btn"
            onClick={() => {
              // swap roles: the guesser now hides a number
              setP1Name(p2Name);
              setP2Name(p1Name);
              setSecret('');
              setHidden(false);
              setGuesses([]);
              setGameOver(false);
              setMessage(`${p2Name}, choisissez un nombre secret (${p1Name} ne regarde pas !)`);
            }}
          >
            🔄 Rejouer (rôles inversés)
          </button>
        )}
        <button className="reset-btn" onClick={resetGame}>Menu Principal</button>
      </div>
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
