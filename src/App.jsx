import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveWinner(gameBoard, gameTurns, players) {
  let winner;

  for (const turn of gameTurns) {
    const { cell, player } = turn;
    const { row, col } = cell;
    gameBoard[row][col] = player;
  }

  for (const combination of WINNING_COMBINATIONS) {
    const firstCell = gameBoard[combination[0].row][combination[0].column];
    const secondCell = gameBoard[combination[1].row][combination[1].column];
    const thirdCell = gameBoard[combination[2].row][combination[2].column];

    if (
      firstCell &&
      secondCell &&
      thirdCell &&
      firstCell === secondCell &&
      firstCell === thirdCell
    ) {
      winner = players[firstCell];
    }
  }

  return winner;
}

function deriveActivePlayer(gameTurns) {
  return gameTurns.length && gameTurns[0]["player"] === "X" ? "O" : "X";
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = [...INITIAL_GAME_BOARD.map((innerArr) => [...innerArr])];
  const winner = deriveWinner(gameBoard, gameTurns, players);
  const isDraw = !winner && gameTurns.length == 9;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      return [
        {
          cell: { row: rowIndex, col: colIndex },
          player: currentPlayer,
        },
        ...prevTurns,
      ];
    });
  }

  function onRematch() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(newName, playerSymbol) {
    setPlayers((prePlayers) => {
      return {
        ...prePlayers,
        [playerSymbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={players.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onPlayerNameChange={handlePlayerNameChange}
          />
          <Player
            initialName={players.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onPlayerNameChange={handlePlayerNameChange}
          />
        </ol>
        {(winner || isDraw) && (
          <GameOver onRematch={onRematch} winner={winner} />
        )}
        <GameBoard board={gameBoard} onSelectSquare={handleSelectSquare} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
