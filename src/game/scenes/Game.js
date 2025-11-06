import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);
        //Creates Goober Sprite
        const gooberImage = this.add.image(200, 600, 'goober').setInteractive();
        //Creates Goober Sound
        const squeak = this.sound.add("squeak");

        //This group of Code changes Goober's sprite depending on if I click em or not
        gooberImage.on('pointerdown',function(pointer)
        {
            gooberImage.setTexture('goober_alt');
            squeak.play();
        }
        );

        gooberImage.on('pointerout',function(pointer)
        {
            gooberImage.setTexture('goober');
        }
        );

         gooberImage.on('pointerup',function(pointer)
        {
            gooberImage.setTexture('goober');
        }
        );
        
        //Creates card images
        this.Fire = this.add.image(220, 300, 'Fire').setDepth(100);
        this.Fire.setDisplaySize(200,200);
        this.Earth = this.add.image(350, 300, 'Earth').setDepth(100);
        this.Earth.setDisplaySize(250,250);
        this.Water = this.add.image(510, 300, 'Water').setDepth(100);
        this.Water.setDisplaySize(300,300);
        this.Wind = this.add.image(730, 300, 'Wind').setDepth(100);
        this.Wind.setDisplaySize(350,350);

        //Changes card image position based on keyboard input
        this.input.keyboard.on('keydown-A', event =>
        {
            this.Fire.setY(220);
        });
         this.input.keyboard.on('keyup-A', event =>
        {
            this.Fire.setY(320);
        });

        this.input.keyboard.on('keyup-W', event =>
        {
            this.Earth.setY(300);
        });
        this.input.keyboard.on('keydown-W', event =>
        {
            this.Earth.setY(200);
        });

        this.input.keyboard.on('keyup-S', event =>
        {
            this.Water.setY(300);
        });
        this.input.keyboard.on('keydown-S', event =>
        {
            this.Water.setY(200);
        });

        this.input.keyboard.on('keyup-D', event =>
        {
            this.Wind.setY(300);
        });
        this.input.keyboard.on('keydown-D', event =>
        {
            this.Wind.setY(200);
        });
        

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
