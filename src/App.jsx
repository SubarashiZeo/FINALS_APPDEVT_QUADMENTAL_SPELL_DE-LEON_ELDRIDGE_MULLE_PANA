import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App() {
    const phaserRef = useRef();

    const [playerName, setPlayerName] = useState("");
    const [isMainMenu, setIsMainMenu] = useState(true); 
    const [isGameOver, setIsGameOver] = useState(false);

const changeScene = () => {
    if (!playerName.trim()) {
        alert("Please enter your name!");
        return;
    }
    const scene = phaserRef.current.scene;
    
    if (scene) {
        if (scene.setPlayerName) {
            scene.setPlayerName(playerName);
        }

        scene.changeScene();
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

            {isMainMenu && (<div style={{ marginTop: "20px" }}>
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

            {isGameOver && (<div style={{ marginTop: "20px" }}>
                    <button className="button" onClick={replayGame}>
                        REPLAY
                    </button>

                    <button className="button" onClick={returnToMainMenu} style={{ marginLeft: "10px" }}>
                        MAIN MENU
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
