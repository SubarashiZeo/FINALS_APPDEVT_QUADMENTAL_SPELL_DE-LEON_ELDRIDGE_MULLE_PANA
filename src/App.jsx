import { useRef, useState, useEffect } from 'react';
import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App() {
    const phaserRef = useRef();

    const [playerName, setPlayerName] = useState("");
    const [isMainMenu, setIsMainMenu] = useState(true); 
    const [isGameOver, setIsGameOver] = useState(false);

    // NEW: React states for score and health
    const [score, setScore] = useState(0);
    const [health, setHealth] = useState(3);

    // Poll Phaser scene for score/health values
    useEffect(() => {
        const interval = setInterval(() => {
            const scene = phaserRef.current?.scene;
            if (scene && scene.score !== undefined && scene.playerHealth !== undefined) {
                setScore(scene.score);
                setHealth(scene.playerHealth);
            }
        }, 500); // check every half second

        return () => clearInterval(interval);
    }, []);

    const changeScene = () => {
        if (!playerName.trim()) {
            alert("Please enter your name!");
            return;
        }
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.scene.start("Game", { playerName });
        }
    };

    const currentScene = (scene) => {
        const key = scene.scene.key;
        setIsMainMenu(key === "MainMenu");
        setIsGameOver(key === "GameOver");
    };

    const replayGame = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.scene.start("Game");
        }
    };

    const returnToMainMenu = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.scene.start("MainMenu");
        }
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />

            {/* Score & Health UI (only visible during gameplay) */}
        {!isMainMenu && !isGameOver && (
    <>
        {/* Player Name (top-left corner) */}
        <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '10px 20px',
            borderRadius: '10px',
            color: 'white',
            fontSize: '20px',
            zIndex: 1000
        }}>
            <div>{playerName}</div>
        </div>

        {/* Score & Health (top-right corner) */}
        <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '10px 20px',
            borderRadius: '10px',
            color: 'white',
            fontSize: '20px',
            zIndex: 1000
        }}>
            <div>Score: {score}</div>
            <div style={{ display: 'flex', gap: '5px' }}>
                {(() => {
                    let heart = '❤️';
                    if (health === 3) heart = '💚';
                    else if (health === 2) heart = '💙';
                    else if (health === 1) heart = '❤️';

                    return Array.from({ length: health }).map((_, i) => (
                        <span key={i} style={{ fontSize: '24px' }}>{heart}</span>
                    ));
                })()}
            </div>
        </div>
    </>
)}


            {isMainMenu && (
                <div style={{ marginTop: "20px" }}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    <button className="button" onClick={changeScene}>
                        START
                    </button>
                </div>
            )}

            {isGameOver && (
                <div style={{
                    marginTop: "20px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px"
                }}>
                    <button className="button" onClick={replayGame}>
                        REPLAY
                    </button>
                    <button className="button" onClick={returnToMainMenu}>
                        MAIN MENU
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
