import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { getLeaderboard, saveScore } from '../scenes/leaderboard';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create(data) {
        this.cameras.main.setBackgroundColor(0xff0000);
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.image(961, 540, 'bgmenu');

        const score = data.finalScore ?? 0;
        const playerName = data.playerName ?? "Anonymous";

        // Save the score to leaderboard
        saveScore(playerName, score);

        // --- Game Over Text ---
        const gameOverText = this.add.text(centerX, centerY - 200, 'GAME OVER', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 120, `Your Score: ${score}`, {
            fontFamily: 'Arial',
            fontSize: 48,
            color: '#ffffff'
        }).setOrigin(0.5);

        // --- Leaderboard ---
        const leaderboard = getLeaderboard();
        this.add.text(centerX, centerY - 20, 'Leaderboard', {
            fontFamily: 'Arial Black',
            fontSize: 40,
            color: '#ffff00'
        }).setOrigin(0.5);

        leaderboard.forEach((entry, index) => {
            this.add.text(centerX, centerY + 40 + index * 40, `${index + 1}. ${entry.name} - ${entry.score}`, {
                fontFamily: 'Arial',
                fontSize: 32,
                color: '#ffffff'
            }).setOrigin(0.5);
        });

        EventBus.emit('current-scene-ready', this);
    }
}
