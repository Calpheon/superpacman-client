import React from "react";
import { useGame } from "../context/GameContext";
import { useKeyboard } from "../hooks/useKeyboard";
import MotivationalBanner from "./MotivationalBanner";


const BOARD_SIZE = 20;
const CELL_SIZE = 25;


function GameBoard() {
  const { gameState, playerId } = useGame();


  useKeyboard();

  if (!gameState) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div
          className="loading-text"
          style={{
            color: "#FFCC00",
            fontSize: "20px",
            animation: "blink 1s infinite",
          }}
        >
          LOADING MAZE...
        </div>
      </div>
    );
  }


  const renderCells = () => {
    const cells = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const cellKey = `cell-${x}-${y}`;
        const isPoint = gameState.points.some(
          (point) => point.x === x && point.y === y
        );

        cells.push(
          <div
            key={cellKey}
            className="game-cell"
            style={{
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
              position: "relative",
            }}
          >
            {isPoint && (
              <div
                className="dot"
                style={{
                  position: "absolute",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#FFCC00", // PacMan yellow
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>
        );
      }
    }
    return cells;
  };


  const renderPlayers = () => {
    return Object.entries(gameState.players).map(([id, player]) => {
      if (!player.alive) return null;

      const isCurrentPlayer = id === playerId;
      let rotation = 0;
      if (player.previousPosition && player.position) {
        if (player.position.x > player.previousPosition.x) rotation = 0;
        else if (player.position.x < player.previousPosition.x) rotation = 180;
        else if (player.position.y > player.previousPosition.y) rotation = 90;
        else if (player.position.y < player.previousPosition.y) rotation = 270;
      }

      return (
        <div
          key={`player-${id}`}
          className={`player ${isCurrentPlayer ? "current-player" : ""}`}
          style={{
            width: `${CELL_SIZE - 6}px`,
            height: `${CELL_SIZE - 6}px`,
            position: "absolute",
            left: `${player.position.x * CELL_SIZE + 3}px`,
            top: `${player.position.y * CELL_SIZE + 3}px`,
            zIndex: 10,
            opacity: player.invulnerable ? 0.7 : 1,
            transition: "left 0.1s, top 0.1s",
            borderRadius: "50%",
            backgroundColor: isCurrentPlayer ? "#FFCC00" : "#00FFFF", 
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%)",
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {player.lives > 0 && (
            <div
              style={{
                position: "absolute",
                top: "-18px",
                width: "100%",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {"❤️".repeat(player.lives)}
            </div>
          )}
        </div>
      );
    });
  };

  
  const renderGhosts = () => {
    const ghostColors = {
      chaser: "#FF0000", 
      ambusher: "#FFB8FF", 
      patroller: "#00FFFF", 
    };

    return gameState.ghosts.map((ghost) => (
      <div
        key={`ghost-${ghost.id}`}
        className="ghost"
        style={{
          width: `${CELL_SIZE - 6}px`,
          height: `${CELL_SIZE - 6}px`,
          position: "absolute",
          left: `${ghost.position.x * CELL_SIZE + 3}px`,
          top: `${ghost.position.y * CELL_SIZE + 3}px`,
          zIndex: 5,
          transition: "left 0.2s, top 0.2s",
          backgroundColor: ghostColors[ghost.personality] || "#FF0000",
          borderRadius: "50% 50% 0 0",

          boxShadow: `
            0px ${CELL_SIZE / 2 - 3}px 0 -10px ${
            ghostColors[ghost.personality] || "#FF0000"
          },
            -5px ${CELL_SIZE / 2 - 3}px 0 -10px ${
            ghostColors[ghost.personality] || "#FF0000"
          },
            5px ${CELL_SIZE / 2 - 3}px 0 -10px ${
            ghostColors[ghost.personality] || "#FF0000"
          }
          `,
        }}
      >
        {/* Ghost eyes */}
        <div
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            backgroundColor: "white",
            borderRadius: "50%",
            top: "8px",
            left: "5px",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              backgroundColor: "#000",
              borderRadius: "50%",
              top: "2px",
              left: "2px",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            backgroundColor: "white",
            borderRadius: "50%",
            top: "8px",
            right: "5px",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              backgroundColor: "#000",
              borderRadius: "50%",
              top: "2px",
              right: "2px",
            }}
          />
        </div>
      </div>
    ));
  };

  return (
    <div className="game-container">
      <div
        className="game-board"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
          width: `${BOARD_SIZE * CELL_SIZE}px`,
          position: "relative",
          margin: "0 auto",
        }}
      >
        {renderCells()}
        {renderPlayers()}
        {renderGhosts()}
      </div>
      
      {/* Pindahkan banner ke bawah game board */}
      <MotivationalBanner />
      
      <div
        className="game-stats"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "rgba(33, 33, 222, 0.3)",
          border: "3px solid #2121DE",
        }}
      >
        <div>
          GHOSTS:{" "}
          <span style={{ color: "#FFCC00" }}>{gameState.ghosts.length}</span>
        </div>
        <div>
          POINTS:{" "}
          <span style={{ color: "#FFCC00" }}>{gameState.points.length}</span>
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
