import { useRef, useState, useEffect } from 'react';
import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App() {
    const phaserRef = useRef();

    const [playerName, setPlayerName] = useState("");
    const [isMainMenu, setIsMainMenu] = useState(true); 
    const [isGameOver, setIsGameOver] = useState(false);

    // NEW: React states for score, health, and timer
    const [score, setScore] = useState(0);
    const [health, setHealth] = useState(3);
    const [prevHealth, setPrevHealth] = useState(3);
    const [damageFade, setDamageFade] = useState(false);
    const [timer, setTimer] = useState(0);
    const [maxTimer, setMaxTimer] = useState(10); // store max duration in seconds

    // Poll Phaser scene for score/health/timer values
    useEffect(() => {
        const interval = setInterval(() => {
            const scene = phaserRef.current?.scene;
            if (scene && scene.score !== undefined && scene.playerHealth !== undefined) {
                setScore(scene.score);
                setHealth(scene.playerHealth);

                // Timer polling
                if (scene.timedEvent) {
                    const remainingSeconds = Math.floor(scene.timedEvent.getRemaining() / 1000);
                    setTimer(remainingSeconds);

                    // capture max duration once (in seconds)
                    if (scene.currentTimerDuration) {
                        setMaxTimer(Math.floor(scene.currentTimerDuration / 1000));
                    }
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);
    
    //Health Fade Effect
    useEffect(() => {
        if (health < prevHealth) {
            setDamageFade(true);
            setTimeout(() => setDamageFade(false), 300);
            setPrevHealth(health);
        } else if (health > prevHealth) {
            setPrevHealth(health);
        }
    }, [health]);

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

    // Calculate bar width percentage
    const timerPercent = maxTimer > 0 ? (timer / maxTimer) * 100 : 0;

    return (
        <div id="app">
            {/* Inline font definition so no external CSS needed */}
            <style>
                {`

                }
                `}
            </style>

            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />

            {/* Score & Health UI (only visible during gameplay) */}
            {!isMainMenu && !isGameOver && (
                <>
                    {/* Player Name (top-left corner) */}
                    <div className="player-name-box">
                        <div>{playerName}</div>
                    </div>

                    {/* Score & Health (top-right corner) */}
                    <div className="score-health-box">
                        <div>Score: {score}</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {Array.from({ length: health }).map((_, i) => (
                                <span
                                    key={i}
                                    className={damageFade ? "heart-fade" : ""}
                                    style={{ fontSize: '28px' }}
                                >
                                    {health === 3 ? '💚' : health === 2 ? '💙' : '❤️'}
                                </span>
                            ))}
                        </div>
                        </div>
            

                    {/* Timer Bar (bottom-center) */}
                        <div className="timer-bar-container">
                        <div style={{
                            width: `${timerPercent}%`,
                            height: '100%',
                            backgroundColor: timer <= 5 ? 'red' : 'dodgerblue',
                            transition: 'width 0.5s linear'
                        }} />
                    </div>
                </>
            )}

            {isMainMenu && (
                <div id="mainmenu">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        maxLength="6"
                    />
                    <button className="button" onClick={changeScene}>
                        START
                    </button>
                </div>
            )}

            {isGameOver && (
                <div id="gameover">
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