import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create (data)
    {
        this.cameras.main.setBackgroundColor(0xff0000);
        this.add.image(512, 384, 'background').setAlpha(0.5);

        // Game Over Text
        this.add.text(512, 300, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // ⭐ Final Score ⭐
        const score = data.finalScore ?? 0;

        this.add.text(512, 420, `Final Score: ${score}`, {
            fontFamily: 'Arial',
            fontSize: 48,
            color: '#ffffff'
        }).setOrigin(0.5);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
