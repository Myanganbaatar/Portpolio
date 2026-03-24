import React, { useState, useEffect } from 'react';
import './LaticeGame.css';

// Game constants
const SHAPES = ['🐬', '🌸', '🦅', '🪶', '🦎', '🐢'];
// New distinct colors: Red, Green, Blue, Yellow, Purple, Orange
const COLORS = ['#E74C3C', '#2ECC71', '#3498DB', '#F1C40F', '#9B59B6', '#E67E22'];
const SHAPE_NAMES = ['DAUPHIN', 'FLEUR', 'OISEAU', 'PLUME', 'LEZARD', 'TORTUE'];
const COLOR_NAMES = ['ROUGE', 'VERT', 'BLEU', 'JAUNE', 'VIOLET', 'ORANGE'];

class Tile {
  constructor(shapeIndex, colorIndex) {
    this.shapeIndex = shapeIndex;
    this.colorIndex = colorIndex;
  }

  matches(otherTile) {
    return this.shapeIndex === otherTile.shapeIndex || 
           this.colorIndex === otherTile.colorIndex;
  }
}

class LaticeGameEngine {
  constructor() {
    this.board = Array(9).fill(null).map(() => Array(9).fill(null));
    this.players = [
      { name: 'Joueur 1', rack: [], score: 0, tilesPlaced: 0 },
      { name: 'Joueur 2', rack: [], score: 0, tilesPlaced: 0 }
    ];
    this.currentPlayerIndex = 0;
    this.deck = [];
    this.gameOver = false;
    this.isFirstMove = true;
    this.moves = [];
    
    this.initializeDeck();
    this.distributeTiles();
  }

  initializeDeck() {
    this.deck = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        this.deck.push(new Tile(i, j));
      }
    }
    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  distributeTiles() {
    for (let player of this.players) {
      player.rack = [];
      for (let i = 0; i < 5; i++) {
        if (this.deck.length > 0) {
          player.rack.push(this.deck.pop());
        }
      }
    }
  }

  isPlacementValid(row, col, tile) {
    // Out of bounds
    if (row < 0 || row >= 9 || col < 0 || col >= 9) return false;

    // Occupied
    if (this.board[row][col] !== null) return false;

    // First move must be center
    if (this.isFirstMove) {
      return row === 4 && col === 4;
    }

    // Must have adjacent tile
    let hasAdjacent = false;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9 && this.board[nr][nc]) {
        hasAdjacent = true;
        break;
      }
    }

    if (!hasAdjacent) return false;

    // Check compatibility with adjacent tiles
    for (let [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9 && this.board[nr][nc]) {
        if (!tile.matches(this.board[nr][nc])) {
          return false;
        }
      }
    }

    return true;
  }

  calculateScore(row, col, tile) {
    let score = 0;
    let matchingSides = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9 && this.board[nr][nc]) {
        if (tile.matches(this.board[nr][nc])) {
          matchingSides++;
        }
      }
    }

    if (matchingSides === 2) score = 1;
    else if (matchingSides === 3) score = 2;
    else if (matchingSides === 4) score = 4;

    // Sun bonus (checkered pattern for fun)
    if ((row + col) % 2 === 0 && row !== 4 && col !== 4) {
      score += 2;
    }

    return score;
  }

  placeTile(row, col, tileIndex, playerIndex) {
    const player = this.players[playerIndex];
    const tile = player.rack[tileIndex];

    if (!this.isPlacementValid(row, col, tile)) {
      return { success: false, message: 'Placement invalide!' };
    }

    this.board[row][col] = tile;
    player.rack.splice(tileIndex, 1);
    player.tilesPlaced++;

    const score = this.calculateScore(row, col, tile);
    player.score += score;

    // Draw new tile
    if (this.deck.length > 0) {
      player.rack.push(this.deck.pop());
    }

    this.isFirstMove = false;
    this.moves.push({ row, col, playerIndex, score });

    // Check if game over
    if (this.players.every(p => p.rack.length === 0)) {
      this.gameOver = true;
    }

    return { success: true, score };
  }

  getAIMove() {
    const player = this.players[1];
    
    // Try to find a valid placement
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        for (let tileIdx = 0; tileIdx < player.rack.length; tileIdx++) {
          const tile = player.rack[tileIdx];
          if (this.isPlacementValid(row, col, tile)) {
            return { row, col, tileIdx };
          }
        }
      }
    }

    return null;
  }

  switchPlayer() {
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }
}

// React Component
export default function LaticeGame() {
  const [game, setGame] = useState(new LaticeGameEngine());
  const [selectedTile, setSelectedTile] = useState(null);
  const [message, setMessage] = useState('Jeu Latice - Cliquez sur Démarrer!');
  const [gameStarted, setGameStarted] = useState(false);
  const [isRobotMode, setIsRobotMode] = useState(true);
  const [showNameInput, setShowNameInput] = useState(false);
  const [p1Name, setP1Name] = useState('Joueur 1');
  const [p2Name, setP2Name] = useState('Joueur 2');

  useEffect(() => {
    if (gameStarted && game.gameOver) {
      const winner = game.players[0].tilesPlaced > game.players[1].tilesPlaced 
        ? game.players[0] 
        : game.players[0].tilesPlaced === game.players[1].tilesPlaced 
        ? null 
        : game.players[1];
      
      setMessage(winner 
        ? `🏆 ${winner.name} gagne avec ${winner.tilesPlaced} tuiles!` 
        : '🤝 Égalité!');
    }
  }, [game.gameOver, game.players, gameStarted]);

  const handleTileClick = (tileIndex) => {
    if (game.gameOver) return;
    
    // Only allow current player to select their tiles
    // In React state, we are always seeing the 'current' game state
    // But for UI, we might want to restrict clicks if it's not 'your' turn in a networked game
    // However for hotseat/local, we just check whose turn it is
    
    // In robot mode, block clicks if it's robot's turn
    if (isRobotMode && game.currentPlayerIndex === 1) return;

    setSelectedTile(selectedTile === tileIndex ? null : tileIndex);
  };

  const handleBoardCellClick = (row, col) => {
    if (game.gameOver) return;

    // Check if tile selected
    if (selectedTile === null) return;
    
    // In robot mode, prevent human from playing during robot turn
    if (isRobotMode && game.currentPlayerIndex === 1) return;

    const newGame = Object.assign(Object.create(Object.getPrototypeOf(game)), game);

    // Human player move
    const result = newGame.placeTile(row, col, selectedTile, newGame.currentPlayerIndex);

    if (result.success) {
      setMessage(`✅ ${newGame.players[newGame.currentPlayerIndex].name} a joué!`);
      setSelectedTile(null);
      
      // Update state for human move
      setGame(Object.assign(Object.create(Object.getPrototypeOf(newGame)), newGame));

      if (newGame.gameOver) return;

      // Switch turn
      newGame.switchPlayer();
      setGame(Object.assign(Object.create(Object.getPrototypeOf(newGame)), newGame));
      
      // If next player is Robot, trigger AI logic
      if (isRobotMode && newGame.currentPlayerIndex === 1) {
        setMessage('🤖 Le Robot réfléchit...');
        
        setTimeout(() => {
          const aiMove = newGame.getAIMove();
          
          if (aiMove) {
             const aiResult = newGame.placeTile(aiMove.row, aiMove.col, aiMove.tileIdx, 1);
             setMessage(`🤖 Le Robot a joué! (+${aiResult.score} pts)`);
          } else {
             setMessage('🤖 Le Robot passe son tour');
          }

          if (!newGame.gameOver) {
             newGame.switchPlayer();
             setGame(Object.assign(Object.create(Object.getPrototypeOf(newGame)), newGame)); // Force update for next turn
          } else {
             setGame(Object.assign(Object.create(Object.getPrototypeOf(newGame)), newGame)); // Update for game over
          }
        }, 1000);
      } else {
        // Human vs Human message update
        setMessage(`Au tour de ${newGame.players[newGame.currentPlayerIndex].name}`);
      }

    } else {
      setMessage('❌ Placement invalide!');
    }
  };

  const startGame = (vsRobot, name1 = "Joueur 1", name2 = "Joueur 2") => {
    const newGame = new LaticeGameEngine();
    setIsRobotMode(vsRobot);
    setShowNameInput(false);
    
    // Rename players based on mode
    if (vsRobot) {
        newGame.players[0].name = "Vous";
        newGame.players[1].name = "Robot";
    } else {
        newGame.players[0].name = name1;
        newGame.players[1].name = name2;
    }
    
    setGame(newGame);
    setGameStarted(true);
    setSelectedTile(null);
    setMessage(`C'est parti! ${newGame.players[0].name} commence au centre (5,5)`);
  };

  const resetGame = () => {
    setGame(new LaticeGameEngine());
    setGameStarted(false);
    setSelectedTile(null);
    setShowNameInput(false);
    setMessage('Jeu Latice - Cliquez sur Démarrer!');
  };

  const handleTwoPlayerSetup = () => {
    setShowNameInput(true);
  };

  const currentPlayer = game.getCurrentPlayer();

  if (!gameStarted) {
    if (showNameInput) {
      return (
        <div className="latice-container">
          <div className="latice-header">
            <h2>👥 Configuration 2 Joueurs</h2>
            <p>Entrez les noms des joueurs (optionnel)</p>
          </div>
          <div className="latice-setup" style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
             <div className="input-group">
                <label style={{ display: 'block', marginBottom: '5px' }}>Nom Joueur 1:</label>
                <input 
                  type="text" 
                  value={p1Name} 
                  onChange={e => setP1Name(e.target.value)} 
                  style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                />
             </div>
             <div className="input-group">
                <label style={{ display: 'block', marginBottom: '5px' }}>Nom Joueur 2:</label>
                <input 
                  type="text" 
                  value={p2Name} 
                  onChange={e => setP2Name(e.target.value)} 
                  style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                />
             </div>
             <button className="latice-btn-mode" onClick={() => startGame(false, p1Name, p2Name)}>Commencer la partie</button>
             <button className="game-back-btn" onClick={() => setShowNameInput(false)} style={{ marginTop: '10px' }}>Annuler</button>
          </div>
        </div>
      );
    }

    return (
      <div className="latice-container">
        <div className="latice-header">
          <h2>🎮 Jeu Latice - Démonstration</h2>
          <p>Placez vos tuiles en trouvant des correspondances de couleur ou de forme.</p>
        </div>
        <div className="latice-modes">
            <button className="latice-btn-mode" onClick={() => startGame(true)}>
                🤖 Jouer contre le Robot
            </button>
            <button className="latice-btn-mode" onClick={handleTwoPlayerSetup}>
                👥 2 Joueurs (Local)
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="latice-container">
      <div className="latice-header">
        <h2>🎮 Jeu Latice ({isRobotMode ? 'Solo' : '2 Joueurs'})</h2>
        <div className="latice-scores">
          <div className={`latice-score ${game.currentPlayerIndex === 0 ? 'active' : ''}`}>
            <span>👤 {game.players[0].name}</span>
            <span>{game.players[0].score}pts | {game.players[0].tilesPlaced} tuiles</span>
          </div>
          <div className={`latice-score ${game.currentPlayerIndex === 1 ? 'active' : ''}`}>
            <span>{isRobotMode ? '🤖' : '👤'} {game.players[1].name}</span>
            <span>{game.players[1].score}pts | {game.players[1].tilesPlaced} tuiles</span>
          </div>
        </div>
      </div>

      <div className="latice-message">{message}</div>

      {/* Game Board */}
      <div className="latice-board">
        {game.board.map((row, rowIdx) =>
          row.map((tile, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`latice-cell ${tile ? 'occupied' : ''} ${
                game.isFirstMove && rowIdx === 4 && colIdx === 4 ? 'first-move' : ''
              }`}
              onClick={() => handleBoardCellClick(rowIdx, colIdx)}
            >
              {tile && (
                <div
                  className="latice-tile"
                  style={{ backgroundColor: COLORS[tile.colorIndex] }}
                >
                  <span>{SHAPES[tile.shapeIndex]}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Player Rack */}
      {gameStarted && !game.gameOver && (
        <div className="latice-rack">
          <h3>Main de {currentPlayer.name}:</h3>
          <div className="latice-rack-tiles">
            {currentPlayer.rack.map((tile, idx) => (
              <button
                key={idx}
                className={`latice-rack-tile ${selectedTile === idx ? 'selected' : ''}`}
                onClick={() => handleTileClick(idx)}
                style={{ backgroundColor: COLORS[tile.colorIndex] }}
                title={`${SHAPE_NAMES[tile.shapeIndex]} ${COLOR_NAMES[tile.colorIndex]}`}
              >
                <span>{SHAPES[tile.shapeIndex]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="latice-controls">
        {game.gameOver && (
          <button className="latice-btn-reset" onClick={resetGame}>Nouvelle partie</button>
        )}
      </div>

      <div className="latice-instructions">
        <p><strong>Comment jouer:</strong></p>
        <ul>
          <li>✅ Cliquez sur une tuile dans votre main</li>
          <li>✅ Cliquez sur une case du plateau</li>
          <li>✅ La tuile doit correspondre en couleur OU en forme avec ses voisines</li>
          <li>✅ Premier placement obligatoire au centre (🌙 case lune)</li>
          <li>✅ Plus de matches adjacentes = plus de points!</li>
        </ul>
      </div>
    </div>
  );
}
