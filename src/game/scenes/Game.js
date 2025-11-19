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

        this.score = 0;

        this.min = 1;
        this.max = 4;
        this.arrayLength = 3; // starting array length

        this.cardMap = {
        1: 'Fire',
        2: 'Earth',
        3: 'Water',
        4: 'Fauna'
        };

        this.beats = {
        'Water': 'Fire',
        'Fire': 'Fauna',
        'Fauna': 'Earth',
        'Earth': 'Water'
        }

        this.keyToCard = {
        'A': 'Fire',
        'S': 'Earth',
        'D': 'Water',
        'F': 'Fauna'
        };

        this.playerHealth = 5;
        this.roundsCompleted = 0; // new
        this.baseTimerDuration = 10000; // 10 seconds in ms
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
    this.Poof.emitParticleAt(enemyCardObj.sprite.x, enemyCardObj.sprite.y);
    this.StarParticle.explode(30, enemyCardObj.sprite.x, enemyCardObj.sprite.y);
    enemyCardObj.sprite.destroy();
    this.enemyCards.pop();
    this.highlightNextEnemyCard();
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
    // Destroy previous sprites
    this.enemyCards.forEach(obj => obj.sprite.destroy());
    this.enemyCards = [];

    const canvasWidth = this.cameras.main.width;

    this.savedEnemyCards.forEach((card, index) => {
        const row = Math.floor(index / this.ENEMY_CARDS_PER_ROW);
        const col = index % this.ENEMY_CARDS_PER_ROW;

        const cardsInThisRow = Math.min(
            this.ENEMY_CARDS_PER_ROW,
            this.savedEnemyCards.length - row * this.ENEMY_CARDS_PER_ROW
        );
        const rowWidth = (cardsInThisRow - 1) * this.ENEMY_GAP;
        const startX = canvasWidth / 2 - rowWidth / 2;

        const x = startX + col * this.ENEMY_GAP;
        const y = this.ENEMY_Y + row * this.ENEMY_ROW_GAP;

        const sprite = this.add.image(x, y, card);
        sprite.setScale(this.ENEMY_CARD_SCALE);

        // Add sprite to enemyCards array
        this.enemyCards.push({ name: card, sprite });
    });

    // Highlight last card
    this.highlightNextEnemyCard();
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

    highlightNextEnemyCard() {
    if (!this.enemyCards || this.enemyCards.length === 0) return;

    const normalScale = this.ENEMY_CARD_SCALE;
    const highlightScale = normalScale * 1.1; // 10% bigger
    const dimTint = 0xAAAAAA; // grayish tint for non-highlighted cards
    const normalTint = 0xffffff; // full color for highlighted card

    // Reset all cards to normal scale
    this.enemyCards.forEach((obj, index) => {
        if (index === this.enemyCards.length - 1) {
            // Last card -> highlight
            obj.sprite.setScale(highlightScale);
            obj.sprite.setTint(normalTint);
        } else {
            // Other cards -> slightly darker
            obj.sprite.setScale(normalScale);
            obj.sprite.setTint(dimTint);
        }
    });

    // Make the last card bigger
    const lastCardObj = this.enemyCards[this.enemyCards.length - 1];
    lastCardObj.sprite.setScale(highlightScale);
}

    create (data)
    {   
        this.playerName = data.playerName ?? "Anonymous";
        this.ENEMY_Y = 425;           // top row Y
        this.ENEMY_ROW_GAP = 50;     // vertical gap between rows
        this.ENEMY_GAP = 75;         // horizontal gap
        this.ENEMY_CARDS_PER_ROW = 9; // max card here

        this.score = 0;
        this.playerHealth = 5;
        this.arrayLength = 3; //array lenght here
        this.enemyCards = [];
        this.savedEnemyCards = [];
        this.timedEvent = this.time.delayedCall(10000, this.onTimerFinish, [], this); //timer function
        this.text = this.add.text(582, 32);
        //SFX 
        this.Correct = this.sound.add("Correct");
        this.Wrong = this.sound.add("Wrong");

        this.ENEMY_CARD_SCALE = 0.34;

        this.healthText = this.add.text(20, 20, "Health: 3", {
            fontSize: "32px",
            color: "#ffffff"
        });

        this.scoreText = this.add.text(this.scale.width - 20, 20, "Score: 0", {
        fontSize: "32px",
        color: "#ffffff"
        })
        .setOrigin(1, 0);

        this.add.image(961, 540, 'gameBG').setScale(0.559);

        //particles
        this.Poof = this.add.particles(0, 0, 'Poof', {
            speed: 100,
            lifespan: 500,
            quantity: 5,
            frequency: -1, 
            scale: { start: 0.15, end: 0 }
        });
        this.Poof.setDepth(20);

        this.StarParticle = this.add.particles(0, 0, 'StarParticle', {
            speed: 1000,
            lifespan: 500,
            quantity: 50,
            frequency: -1, 
            scale: { start: 0.6, end: 0 }
        });                
        this.StarParticle.setDepth(10);

        // --- Goober at top-middle ---
        const gooberX = this.scale.width / 2;
        const gooberY = this.scale.height / 6;
        const gooberImage = this.add.image(gooberX, gooberY, 'goober').setInteractive();
        const squeak = this.sound.add("squeak");

        gooberImage.on('pointerdown', () => { gooberImage.setTexture('goober_alt'); squeak.play(); });
        gooberImage.on('pointerup', () => { gooberImage.setTexture('goober'); });
        gooberImage.on('pointerout', () => { gooberImage.setTexture('goober'); });

        // --- Player Cards ---
        const PLAYER_CARD_SCALE = 0.30;
        const PLAYER_GAP = 220;
        const PLAYER_Y = 800;
        const playerButtons = ['Fire', 'Earth', 'Water', 'Fauna'];

        // Calculate centered startX
        const playerTotalWidth = (playerButtons.length - 1) * PLAYER_GAP;
        const playerStartX = this.scale.width / 2 - playerTotalWidth / 2;

        this.cards = {};
        playerButtons.forEach((cardName, index) => {
            const x = playerStartX + index * PLAYER_GAP;
            const sprite = this.add.image(x, PLAYER_Y, cardName)
                .setDepth(100)
                .setScale(PLAYER_CARD_SCALE)
                .setInteractive();     // <-- enables clicking
            this.cards[cardName] = sprite;

        const mouseIcon = this.add.image(
        x - sprite.displayWidth / 2 + 10, // offset a little right from left edge
        PLAYER_Y - sprite.displayHeight / 2 + 10, // offset a little down from top edge
        'mouse')
        .setScale(0.13) // scale down to fit nicely
        .setDepth(120); // above the card

        sprite.on("pointerdown", () => {
        sprite.setY(PLAYER_Y - 50);   // raise card like keyboard
        this.handlePlayerChoice(cardName);
        });

        sprite.on("pointerup", () => {
            sprite.setY(PLAYER_Y);        // put card back down
        });

        sprite.on("pointerout", () => {
            sprite.setY(PLAYER_Y);        // ensure card returns if pointer leaves
        });
        
    });

        const KEY_Y_OFFSET = 130; // distance below player cards
        const keyImages = ['a_key', 's_key', 'd_key', 'f_key'];
        keyImages.forEach((keyImg, index) => {
            const x = playerStartX + index * PLAYER_GAP;
            const y = PLAYER_Y + KEY_Y_OFFSET;
            this.add.image(x, y, keyImg).setScale(0.4).setDepth(110); // depth below cards
        });

        // Keyboard animation
        this.input.keyboard.on('keydown-A', () => this.cards['Fire'].setY(PLAYER_Y - 50));
        this.input.keyboard.on('keyup-A', () => this.cards['Fire'].setY(PLAYER_Y));
        this.input.keyboard.on('keydown-S', () => this.cards['Earth'].setY(PLAYER_Y - 50));
        this.input.keyboard.on('keyup-S', () => this.cards['Earth'].setY(PLAYER_Y));
        this.input.keyboard.on('keydown-D', () => this.cards['Water'].setY(PLAYER_Y - 50));
        this.input.keyboard.on('keyup-D', () => this.cards['Water'].setY(PLAYER_Y));
        this.input.keyboard.on('keydown-F', () => this.cards['Fauna'].setY(PLAYER_Y - 50));
        this.input.keyboard.on('keyup-F', () => this.cards['Fauna'].setY(PLAYER_Y));

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
        sprite.setScale(this.ENEMY_CARD_SCALE);

        if (index === this.savedEnemyCards.length - 1) {
        sprite.setScale(this.ENEMY_CARD_SCALE * 1.1); // 20% bigger
        } 
        else {
            sprite.setScale(this.ENEMY_CARD_SCALE);
        }

        this.enemyCards.push({ name: card, sprite });
    });
    this.highlightNextEnemyCard();
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

        const cardsInThisRow = Math.min(
            this.ENEMY_CARDS_PER_ROW,
            this.savedEnemyCards.length - row * this.ENEMY_CARDS_PER_ROW
        );
        const rowWidth = (cardsInThisRow - 1) * this.ENEMY_GAP;
        const startX = canvasWidth / 2 - rowWidth / 2;

        const x = startX + col * this.ENEMY_GAP;
        const y = this.ENEMY_Y + row * this.ENEMY_ROW_GAP;

        const sprite = this.add.image(x, y, card);
        sprite.setScale(this.ENEMY_CARD_SCALE);

        // Add sprite to enemyCards array
        this.enemyCards.push({ name: card, sprite });
    });

    // Correctly highlight the last card
    this.highlightNextEnemyCard();
}

// --- Load next enemy array ---
loadNextEnemyArray() {
    this.roundsCompleted++;

    // Every 3 rounds, increase timer by 3 seconds, adjust 3 to increase counter
    const extraSeconds = Math.floor(this.roundsCompleted / 3);
    this.currentTimerDuration = this.baseTimerDuration + extraSeconds * 3000;
    this.generateAndDisplayEnemyCards();

    this.resetTimer();  
    }

    generateRandomIntArray() {
        const result = Array.from({ length: this.arrayLength }, () =>
        Math.floor(Math.random() * (this.max - this.min + 1)) + this.min
        );

        // Increase array length for next call
        this.arrayLength++;

        return result;
    }
    
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
