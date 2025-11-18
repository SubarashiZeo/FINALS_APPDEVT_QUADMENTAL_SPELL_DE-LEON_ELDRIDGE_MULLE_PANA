import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{   
    timedEvent;
    text;
    timertext;     
    constructor ()
    {
        super('Game');
        //jerwin change

        this.score = 0;

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
        this.roundsCompleted = 0; // new
        this.baseTimerDuration = 10000; // 10 seconds in ms
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
    this.Correct.play();
    
    if (this.enemyCards.length === 0) {
        console.log("Round Complete! Loading next array...");

        this.score += 1000;
        this.scoreText.setText("Score: " + this.score);

        this.loadNextEnemyArray();
    }

} else {
    // Wrong OR tie → lose HP
    console.log("Mistake! Losing 1 HP.");

    this.updateHealth(-1);
    this.Wrong.play();

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

    const GAP = 150;
    const cardCount = this.savedEnemyCards.length;
    const totalWidth = (cardCount - 1) * GAP;
    const startX = this.scale.width / 2 - totalWidth / 2;
    const y = 400;

    this.savedEnemyCards.forEach((card, index) => {
        const x = startX + index * GAP;
        const sprite = this.add.image(x, y, card);
        this.enemyCards.push({ name: card, sprite });
    });
    }

    loadNextEnemyArray() {
    // Generate next array (your function already increases length)
    const randomNumbers = this.generateRandomIntArray();
    const cardCount = cardArray.length;
    const totalWidth = (cardCount - 1) * GAP;
    
    const y = 400; //here
    const cardArray = randomNumbers.map(num => this.cardMap[num]);

    console.log('Next Level Cards:', cardArray);

    // save for future resets
    this.savedEnemyCards = cardArray.slice();

    // Remove previous sprites
    this.enemyCards.forEach(obj => obj.sprite.destroy());
    this.enemyCards = [];

    this.generateAndDisplayEnemyCards();
    this.resetTimer();

    // Draw new array
    cardArray.forEach((card, index) => {
        const x = startX + index * gap;  // <-- use gap here
        const sprite = this.add.image(x, y, card);
        this.enemyCards.push({ name: card, sprite });
    });
    }

    updateHealth(amount) {
    this.playerHealth += amount;
    this.healthText.setText("Health: " + this.playerHealth);

    if (this.playerHealth <= 0) {
        console.log("GAME OVER!");
        this.scene.start("GameOver", { 
        finalScore: this.score, 
        playerName: this.playerName});
    }
}

    create (data)
    {   
        this.playerName = data.playerName ?? "Anonymous";
        this.ENEMY_Y = 310;           // top row Y
        this.ENEMY_CARD_SIZE = 300;   // enemy card size
        this.ENEMY_ROW_GAP = 50;     // vertical gap between rows
        this.ENEMY_GAP = 75;         // horizontal gap
        this.ENEMY_CARDS_PER_ROW = 9; // max card here

        this.score = 0;
        this.playerHealth = 3;
        this.arrayLength = 3; //array lenght here
        this.enemyCards = [];
        this.savedEnemyCards = [];
        this.timedEvent = this.time.delayedCall(10000, this.onTimerFinish, [], this); //timer function
        this.text = this.add.text(582, 32);
        //SFX 
        this.Correct = this.sound.add("Correct");
        this.Wrong = this.sound.add("Wrong");

        this.healthText = this.add.text(20, 20, "Health: 3", {
            fontSize: "32px",
            color: "#ffffff"
        });

        this.scoreText = this.add.text(this.scale.width - 20, 20, "Score: 0", {
        fontSize: "32px",
        color: "#ffffff"
        })
        .setOrigin(1, 0);

        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background').setAlpha(0.5);

        // --- Goober at top-middle ---
        const gooberX = this.scale.width / 2;
        const gooberY = this.scale.height / 6;
        const gooberImage = this.add.image(gooberX, gooberY, 'goober').setInteractive();
        const squeak = this.sound.add("squeak");

        gooberImage.on('pointerdown', () => { gooberImage.setTexture('goober_alt'); squeak.play(); });
        gooberImage.on('pointerup', () => { gooberImage.setTexture('goober'); });
        gooberImage.on('pointerout', () => { gooberImage.setTexture('goober'); });

        // --- Player Cards ---
        const PLAYER_CARD_SIZE = 180;
        const PLAYER_GAP = 220;
        const PLAYER_Y = 620;
        const playerButtons = ['Fire', 'Earth', 'Water', 'Wind'];

        // Calculate centered startX
        const playerTotalWidth = (playerButtons.length - 1) * PLAYER_GAP;
        const playerStartX = this.scale.width / 2 - playerTotalWidth / 2;

        this.cards = {};
        playerButtons.forEach((cardName, index) => {
            const x = playerStartX + index * PLAYER_GAP;
            const sprite = this.add.image(x, PLAYER_Y, cardName)
                .setDepth(100)
                .setDisplaySize(PLAYER_CARD_SIZE, PLAYER_CARD_SIZE);
            this.cards[cardName] = sprite;
        });

        // Keyboard animation
        this.input.keyboard.on('keydown-A', () => this.cards['Fire'].setY(PLAYER_Y - 50));
        this.input.keyboard.on('keyup-A', () => this.cards['Fire'].setY(PLAYER_Y));
        this.input.keyboard.on('keydown-S', () => this.cards['Earth'].setY(PLAYER_Y - 50));
        this.input.keyboard.on('keyup-S', () => this.cards['Earth'].setY(PLAYER_Y));
        this.input.keyboard.on('keydown-D', () => this.cards['Water'].setY(PLAYER_Y - 50));
        this.input.keyboard.on('keyup-D', () => this.cards['Water'].setY(PLAYER_Y));
        this.input.keyboard.on('keydown-F', () => this.cards['Wind'].setY(PLAYER_Y - 50));
        this.input.keyboard.on('keyup-F', () => this.cards['Wind'].setY(PLAYER_Y));

        // --- Enemy Cards ---
        this.generateAndDisplayEnemyCards();

        // Handle keyboard card choice
        this.input.keyboard.on('keydown', (event) => {
            const playerCard = this.keyToCard[event.key.toUpperCase()];
            if (playerCard) this.handlePlayerChoice(playerCard);
        });
        EventBus.emit('current-scene-ready', this);
    }

    // --- Helper to generate and display enemy cards centered ---
    generateAndDisplayEnemyCards() {
    const randomNumbers = this.generateRandomIntArray();
    const cardArray = randomNumbers.map(num => this.cardMap[num]);

    this.savedEnemyCards = cardArray.slice();

    // Destroy previous sprites
    this.enemyCards.forEach(obj => obj.sprite.destroy());
    this.enemyCards = [];

    const canvasWidth = this.cameras.main.width;

    cardArray.forEach((card, index) => {
        const row = Math.floor(index / this.ENEMY_CARDS_PER_ROW);
        const col = index % this.ENEMY_CARDS_PER_ROW;

        // center the row
        const cardsInThisRow = Math.min(this.ENEMY_CARDS_PER_ROW, cardArray.length - row * this.ENEMY_CARDS_PER_ROW);
        const rowWidth = (cardsInThisRow - 1) * this.ENEMY_GAP;
        const startX = canvasWidth / 2 - rowWidth / 2;

        const x = startX + col * this.ENEMY_GAP;
        const y = this.ENEMY_Y + row * this.ENEMY_ROW_GAP;

        const sprite = this.add.image(x, y, card);
        sprite.setDisplaySize(this.ENEMY_CARD_SIZE, this.ENEMY_CARD_SIZE);

        this.enemyCards.push({ name: card, sprite });
    });
}

// --- Reset enemy cards ---
        resetEnemyCards() {
    // Destroy previous sprites
    this.enemyCards.forEach(obj => obj.sprite.destroy());
    this.enemyCards = [];

    const canvasWidth = this.cameras.main.width;

    this.savedEnemyCards.forEach((card, index) => {
        const row = Math.floor(index / this.ENEMY_CARDS_PER_ROW);
        const col = index % this.ENEMY_CARDS_PER_ROW;

        const cardsInThisRow = Math.min(this.ENEMY_CARDS_PER_ROW, this.savedEnemyCards.length - row * this.ENEMY_CARDS_PER_ROW);
        const rowWidth = (cardsInThisRow - 1) * this.ENEMY_GAP;
        const startX = canvasWidth / 2 - rowWidth / 2;

        const x = startX + col * this.ENEMY_GAP;
        const y = this.ENEMY_Y + row * this.ENEMY_ROW_GAP;

        const sprite = this.add.image(x, y, card);
        sprite.setDisplaySize(this.ENEMY_CARD_SIZE, this.ENEMY_CARD_SIZE);

        this.enemyCards.push({ name: card, sprite });
    });
}

// --- Load next enemy array ---
loadNextEnemyArray() {
    this.roundsCompleted++;

    // Every 4 rounds, increase timer by 2 second, adjust 4 to increase counter
    const extraSeconds = Math.floor(this.roundsCompleted / 4);
    this.currentTimerDuration = this.baseTimerDuration + extraSeconds * 2000;
    this.generateAndDisplayEnemyCards();

    this.resetTimer();
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

    onTimerFinish() {
    this.scene.start("GameOver", { 
        finalScore: this.score, 
        playerName: this.playerName
    });
}

    resetTimer() {
    // stop old timer if present
    if (this.timedEvent) {
        this.timedEvent.remove(false);
    }

    this.timedEvent = this.time.delayedCall(this.currentTimerDuration, this.onTimerFinish, [], this);
    }

    //Timer update
    update ()
    {
        const remainingSecond = Math.floor(this.timedEvent.getRemaining() / 1000);
        this.text.setText(`Timer: ${remainingSecond.toString().substr(0, 4)}`);
    }
}
