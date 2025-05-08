import React, { useState, useEffect, useCallback } from "react";
import { useGame } from "../context/GameContext";
import { getMotivationalMessage } from "../services/geminiService";


function MotivationalBanner() {
  const { gameState, playerId, ghostCount } = useGame();
  const [message, setMessage] = useState("READY TO CHOMP! EAT THOSE DOTS!");
  const [isLoading, setIsLoading] = useState(false);
  
  const REFRESH_INTERVAL = 45000;

  const updateMessage = useCallback(async () => {
    if (!gameState || !playerId || !gameState.players[playerId]) return;
    
    const player = gameState.players[playerId];
    

    if (!player.alive) return;
    
    setIsLoading(true);
    

    const gameContext = {
      score: player.score,
      ghostCount,
      dotsRemaining: gameState.points.length,
      lives: player.lives
    };
    
    try {
      const newMessage = await getMotivationalMessage(gameContext);
      setMessage(newMessage);
    } catch (error) {
      console.error("Failed to update motivational message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, playerId, ghostCount]);


  useEffect(() => {
    updateMessage();
  }, [playerId, ghostCount]);
  

  useEffect(() => {
    const intervalId = setInterval(updateMessage, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [updateMessage]);


  const handleRefreshClick = () => {
    if (!isLoading) {
      updateMessage();
    }
  };

  return (
    <div 
      className="motivational-banner"
      style={{
        backgroundColor: "#000000",
        border: "3px solid #FFCC00",
        padding: "12px",
        textAlign: "center",
        marginBottom: "15px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading && (
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "3px",
            backgroundColor: "#FFCC00",
            animation: "loading-bar 1.5s infinite linear",
            width: "30%"
          }}
        />
      )}
      
      <div style={{ 
        fontSize: "0.9rem", 
        color: "#FFCC00",
        fontFamily: "'Press Start 2P', cursive",
        textShadow: "0 0 5px rgba(255, 204, 0, 0.7)",
        flex: 1,
        padding: "0 10px"
      }}>
        {message}
      </div>
      
      <button
        onClick={handleRefreshClick}
        disabled={isLoading}
        style={{
          backgroundColor: "transparent",
          border: "2px solid #FFCC00",
          color: "#FFCC00",
          width: "30px",
          height: "30px",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          fontSize: "16px",
          opacity: isLoading ? 0.5 : 1,
          fontFamily: "'Press Start 2P', cursive",
          transition: "transform 0.2s, background-color 0.2s"
        }}
        title="Get new message"
      >

        <span style={{ 
          transform: isLoading ? "rotate(180deg)" : "rotate(0deg)",
          display: "inline-block",
          transition: "transform 0.5s"
        }}>
          ↻
        </span>
      </button>
      
      <style jsx="true">{`
        @keyframes loading-bar {
          0% { width: 0; left: 0; }
          50% { width: 60%; left: 20%; }
          100% { width: 0; left: 100%; }
        }
      `}</style>
    </div>
  );
}

export default MotivationalBanner;