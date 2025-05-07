import React from "react";
import { GameProvider, useGame } from "./context/GameContext";
import HomeScreen from "./components/HomeScreen";
import GameBoard from "./components/GameBoard";
import GameInfo from "./components/GameInfo";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

// Game layout utama
function GameLayout() {
  const { playerId, isReady, setPlayerReady } = useGame();

  // Jika belum ada ID player, tampilkan home screen
  if (!playerId) {
    return <HomeScreen />;
  }

  // Jika belum ready, tampilkan ready screen dengan gaya PacMan
  if (!isReady) {
    return (
      <div
        className="ready-screen"
        style={{
          padding: "40px",
          textAlign: "center",
          backgroundColor: "rgba(0,0,0,0.8)",
          border: "8px solid #2121DE",
          boxShadow: "0 0 20px rgba(33, 33, 222, 0.8)",
          maxWidth: "600px",
          margin: "40px auto",
        }}
      >
        <h2 style={{ color: "#FFCC00", textShadow: "3px 3px 0 #2121DE" }}>
          READY!
        </h2>

        {/* Ghost animations for decoration */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "30px 0",
          }}
        >
          {["#FF0000", "#FFB8FF", "#00FFFF", "#FFB852"].map((color, i) => (
            <div
              key={i}
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: color,
                borderRadius: "50% 50% 0 0",
                margin: "0 15px",
                position: "relative",
                animation: `ghost-float 1.${i}s infinite`,
              }}
            >
              {/* Ghost eyes */}
              <div
                style={{
                  position: "absolute",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  top: "8px",
                  left: "7px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#000",
                    borderRadius: "50%",
                    top: "3px",
                    left: "3px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  top: "8px",
                  right: "7px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#000",
                    borderRadius: "50%",
                    top: "3px",
                    right: "3px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            color: "#FFFFFF",
            fontSize: "0.9rem",
            marginBottom: "30px",
          }}
        >
          PRESS THE BUTTON TO START THE GAME
        </p>

        <button
          onClick={setPlayerReady}
          className="pacman-button"
          style={{ fontSize: "1rem", padding: "15px 30px" }}
        >
          START GAME
        </button>
      </div>
    );
  }

  // Tampilkan game board, info, dan leaderboard
  return (
    <div className="game-layout">
      <div className="game-header">
        <h1>Super Pacman</h1>
        <GameInfo />
      </div>

      <div className="game-content" style={{ display: "flex", gap: "20px" }}>
        <div className="game-main">
          <GameBoard />
        </div>
        <div className="sidebar">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

// App component utama
function App() {
  return (
    <GameProvider>
      <div className="App">
        <GameLayout />
      </div>
    </GameProvider>
  );
}

export default App;
