import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(961, 540, 'bgmenu');
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(952, 584, 498, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(952-245, 584, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (490 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        //Images
        this.load.image('bgmenu', 'bgmenu.png');
        this.load.image('gameBG', 'gameBG.png');
        this.load.image('title', 'title.png');
        this.load.image('stars', 'stars.png');
        this.load.image('goober', 'goober.png');
        this.load.image('goober_alt', 'goober_alt.png');
        this.load.image('goober_new', 'goober_new.png');
        this.load.image('circle','circle.png');
        this.load.image('wheel','wheel.png');
        this.load.image('Fire','Fire.png');
        this.load.image('Earth','Earth.png');
        this.load.image('Water','Water.png');
        this.load.image('Fauna','Fauna.png');
        this.load.image('Poof','Poof.png');
        this.load.image('StarParticle','StarParticle.png');
        this.load.image('a_key', 'a_key.png');
        this.load.image('s_key', 's_key.png');
        this.load.image('d_key', 'd_key.png');
        this.load.image('f_key', 'f_key.png');
        this.load.image('mouse', 'mouse.png');

        //Audio
        this.load.audio('squeak','squeak.mp3');
        this.load.audio('Correct','Correct.wav')
        this.load.audio('Wrong','Wrong.wav')
        this.load.audio('BGM','BGM.wav')
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        const BGM = this.sound.add('BGM', { loop: true, volume: 0.1 });
        BGM.play();
        this.scene.start('MainMenu');
    }
}
