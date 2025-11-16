import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        //jerwin change

        this.min = 1;
        this.max = 4;
        this.arrayLength = 3; // starting array length

        this.cardMap = {
        1: 'Fire',
        2: 'Earth',
        3: 'Water',
        4: 'Wind'
        };

        this.beats = {
        'Water': 'Fire',
        'Fire': 'Wind',
        'Wind': 'Earth',
        'Earth': 'Water'
        }

        this.keyToCard = {
        'A': 'Fire',
        'S': 'Earth',
        'D': 'Water',
        'F': 'Wind'
        };

        this.playerHealth = 3;
        
        //jerwin change
    }
    
    handlePlayerChoice(playerCard) {
    if (this.enemyCards.length === 0) {
        console.log("No enemy cards left!");
        return;
    }

    const enemyCardObj = this.enemyCards[this.enemyCards.length - 1];
    const enemyCard = enemyCardObj.name;

    console.log(`Player chose: ${playerCard}`);
    console.log(`Enemy chose: ${enemyCard}`);

    if (this.beats[playerCard] === enemyCard) {
    console.log('Player wins!');
    enemyCardObj.sprite.destroy();
    this.enemyCards.pop();

    if (this.enemyCards.length === 0) {
        console.log("Round Complete! Loading next array...");
        this.loadNextEnemyArray();
    }

} else {
    // Wrong OR tie → lose HP
    console.log("Mistake! Losing 1 HP.");

    this.updateHealth(-1);

    if (this.playerHealth > 0) {
        console.log("Resetting same cards...");
        this.resetEnemyCards();
    }
}
}

    resetEnemyCards() {
    // Remove current sprites
    this.enemyCards.forEach(obj => obj.sprite.destroy());
    this.enemyCards = [];

    // Redraw from savedEnemyCards
    this.savedEnemyCards.forEach((card, index) => {
        const x = 150 + index * 150;
        const y = 400;
        const sprite = this.add.image(x, y, card);

        this.enemyCards.push({ name: card, sprite });
    });
    }

    loadNextEnemyArray() {
    // Generate next array (your function already increases length)
    const randomNumbers = this.generateRandomIntArray();
    const cardArray = randomNumbers.map(num => this.cardMap[num]);

    console.log('Next Level Cards:', cardArray);

    // save for future resets
    this.savedEnemyCards = cardArray.slice();

    // Remove previous sprites
    this.enemyCards.forEach(obj => obj.sprite.destroy());
    this.enemyCards = [];

    // Draw new array
    cardArray.forEach((card, index) => {
        const x = 150 + index * 150;
        const y = 400;
        const sprite = this.add.image(x, y, card);
        this.enemyCards.push({ name: card, sprite });
    });
    }

    updateHealth(amount) {
    this.playerHealth += amount;
    this.healthText.setText("Health: " + this.playerHealth);

    if (this.playerHealth <= 0) {
        console.log("GAME OVER!");
        this.scene.start("GameOver");  // Or restart the level
    }
}

    create ()
    {   
        this.playerHealth = 3;
        this.arrayLength = 3;
        this.enemyCards = [];
        this.savedEnemyCards = [];

        this.healthText = this.add.text(20, 20, "Health: 3", {
        fontSize: "32px",
        color: "#ffffff"
        }); //display health
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
        
        this.Fire.setInteractive().on('pointerdown', () => this.handlePlayerChoice('Fire'));
        this.Earth.setInteractive().on('pointerdown', () => this.handlePlayerChoice('Earth'));
        this.Water.setInteractive().on('pointerdown', () => this.handlePlayerChoice('Water'));
        this.Wind.setInteractive().on('pointerdown', () => this.handlePlayerChoice('Wind'));

        //Changes card image position based on keyboard input
        this.input.keyboard.on('keydown-A', event =>
        {
            this.Fire.setY(220);
        });
         this.input.keyboard.on('keyup-A', event =>
        {
            this.Fire.setY(320);
        });

        this.input.keyboard.on('keyup-S', event =>
        {
            this.Earth.setY(300);
        });
        this.input.keyboard.on('keydown-S', event =>
        {
            this.Earth.setY(200);
        });

        this.input.keyboard.on('keyup-D', event =>
        {
            this.Water.setY(300);
        });
        this.input.keyboard.on('keydown-D', event =>
        {
            this.Water.setY(200);
        });

        this.input.keyboard.on('keyup-F', event =>
        {
            this.Wind.setY(300);
        });
        this.input.keyboard.on('keydown-F', event =>
        {
            this.Wind.setY(200);
        });
        
        //jerwin change
        this.enemyCards = [];
        
        EventBus.emit('current-scene-ready', this);

        // 1. Generate a random number array
        const randomNumbers = this.generateRandomIntArray();

        // 2. Map numbers to card names
        const cardArray = randomNumbers.map(num => this.cardMap[num]);

        console.log('Random numbers:', randomNumbers);
        console.log('Mapped cards:', cardArray);

        cardArray.forEach((card, index) => {
        const x = 150 + index * 150;
        const y = 400;
        const sprite = this.add.image(x, y, card);

        this.enemyCards.push({ name: card, sprite });
        });
        this.savedEnemyCards = cardArray.slice(); // store a copy
        this.input.keyboard.on('keydown', (event) => {
        const playerCard = this.keyToCard[event.key.toUpperCase()];
        if (playerCard) {
            this.handlePlayerChoice(playerCard);
            }
        });
        //jerwin change
    }

    //jerwin changes start
    generateRandomIntArray() {
        const result = Array.from({ length: this.arrayLength }, () =>
        Math.floor(Math.random() * (this.max - this.min + 1)) + this.min
        );

        // Increase array length for next call
        this.arrayLength++;

        return result;
    }
    
    //jerwin changes end
    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
