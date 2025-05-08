import React from "react";
import { useGame } from "../context/GameContext";

/**

* Komponen untuk menampilkan informasi game dengan tema PacMan
 */
function GameInfo() {
  const { gameState, playerId, ghostCount, restartGame, exitGame } = useGame();
  
  if (!gameState || !playerId) return null;
  
  const player = gameState.players[playerId];
  if (!player) return null;
  
  return (
    <div 
      className="game-info"
      style={{ 
        padding: "15px",
        marginBottom: "15px",
        backgroundColor: "#000000", 
        border: "4px solid #2121DE",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap"
      }}
    >
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginRight: "20px",
        marginBottom: "10px"
      }}>
        <div style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#FFCC00",
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%)',
          marginRight: "10px"
        }}></div>
        <div>
          <div style={{ color: "#FFCC00" }}>{player.name}</div>
          <div style={{ fontSize: "0.8rem" }}>
            SCORE: <span style={{ color: "#FFCC00" }}>{player.score}</span>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: "flex", 
        gap: "15px",
        marginBottom: "10px"
      }}>
        <div>
          <div style={{ fontSize: "0.7rem" }}>LIVES</div>
          <div style={{ color: "#FFCC00" }}>
            {"♥".repeat(player.lives)}
          </div>
        </div>
        
        <div>
          <div style={{ fontSize: "0.7rem" }}>GHOSTS</div>
          <div style={{ color: "#FF0000" }}>
            {ghostCount}
          </div>
        </div>
        
        <div>
          <div style={{ fontSize: "0.7rem" }}>DOTS</div>
          <div style={{ color: "#FFCC00" }}>
            {gameState.points.length}
          </div>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
        <button
          onClick={restartGame}
          className="pacman-button"
          style={{ fontSize: "0.6rem", padding: "5px 10px" }}
        >
          RESTART
        </button>
        <button
          onClick={exitGame}
          className="pacman-button"
          style={{ 
            fontSize: "0.6rem", 
            padding: "5px 10px",
            backgroundColor: "#FF0000",
            borderColor: "#FF0000"
          }}
        >
          EXIT
        </button>
      </div>
    </div>
  );
}

export default GameInfo;