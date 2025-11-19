import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.goober = this.add.image(1550, 750, 'goober_new').setDepth(100);
        this.add.image(961, 540, 'bgmenu');
        this.add.image(961, 540, 'stars');
        this.add.image(611, 150, 'title');
        this.add.image(958, 585, 'circle').setScale(1.8);
         this.add.text(958, 585, 'Rules', {
            fontFamily: 'Arial Black', fontSize: 69, color: '#66ff6bff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        this.add.image(950, 575, 'wheel').setScale(0.55).setDepth(10);
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Game'); 
    }
}
