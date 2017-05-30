'use strict';

// Predefine the variables we will be using within the global scope.
var gridWidth = 101,
    gridHeight = 83,
    score = {},
    highScore = {},
    gameOver;

// set the default value of highscore to zero.
highScore.value = 0;

/* This the render function for the highscore. It draws the highscore on the
 * top right hand corner of the canvas.
 */

highScore.render = function() {
    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.fillRect(205, 0, 300, 50);
    ctx.fillStyle = "black";
    ctx.font = '28px Arial';
    ctx.fillText("High Score: " + highScore.value, 505, 40);
    ctx.restore();
};

/* This the render function for the score. It draws the score on the
 * top left hand corner of the canvas.
 */

score.render = function() {
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 200, 50);
    ctx.fillStyle = "black";
    ctx.font = '28px Arial';
    ctx.fillText("Score: " + score.value, 10, 40);
};


/* This function returns a random integer between min (inclusive) and max (inclusive).
 * It is used within game to generate randomness to speed and position of objects.
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Enemies our player must avoid
var Enemy = function(yLoc, speed) {

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = yLoc;
    this.speed = speed;
};

// Updates the enemy's position

Enemy.prototype.update = function(dt) {
    /* The speed property is multiplied by the dt parameter
     * which will ensure the game runs at the same speed for
     * all computers.
     */
    this.x += this.speed * dt;

    /* This checks if the enemy has move out of the bounds of the canvas
     * and resets it. Also the speed property is randomly generated and set
     * to introduce unpredictabiity and make the game more thrilling.
     */
    if (this.x > 505) {
        this.x = 0;
        this.speed = 50 * getRandomInt(1, 4);
    }
};

// Draws the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Enemy checkCollisons method, checks if the player has collided with the enemy.
 * If true then it updates the highscore if the current score is highscore
 * is greater the highscore previously set. It also sets the gameover variable to true
 * to display the gameover screen.
 */
Enemy.prototype.checkCollision = function() {
    if (player.x < this.x + 50 && player.x + gridWidth > this.x + 30 &&
        player.y < this.y + gridHeight && gridHeight + player.y > this.y + gridHeight) {

        if (score.value > highScore.value)
            highScore.value = score.value;

        gameOver = true;

    }
};

// Create instances of the enemy object to use in the game.
var enemy1 = new Enemy(75, 50 * getRandomInt(1, 4));
var enemy2 = new Enemy(150, 50 * getRandomInt(1, 4));
var enemy3 = new Enemy(225, 50 * getRandomInt(1, 4));


// Places all enemy objects in the allEnemies array
var allEnemies = [];

allEnemies.push(enemy1, enemy2, enemy3);

// The player class, predefines the properties of the player
var Player = function() {

    this.sprite = "images/char-boy.png";
    this.x = gridWidth * 2;
    this.y = gridHeight * 5;

};

/* Updates the player position based on user inputs.
 * Also performs checks to prevent the player from going outside the bounds of the canvas.
 */
Player.prototype.update = function(direction) {

    switch (direction) {
        case 'up':
            if (player.y >= gridHeight)
                this.y -= gridHeight;
            break;
        case 'left':
            if (player.x >= gridWidth)
                this.x -= gridWidth;
            break;
        case 'down':
            if (player.y < gridHeight * 5)
                this.y += gridHeight;
            break;
        case 'right':
            if (player.x < gridWidth * 4)
                this.x += gridWidth;
            break;
    }

};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handles the player updates based on the user inputs
Player.prototype.handleInput = function(key) {

    // prevents updates to player if the ganeover variable is set to true
    if (!gameOver)
        player.update(key);
};

// Places the player object in a variable called player to be used globally
var player = new Player();


// Collectables super class, Predefines the common properties of a collectable
var Collectable = function(xLoc, yLoc) {
    this.x = gridWidth * xLoc;
    this.y = gridHeight * yLoc;
};

// Renders the collectable on the screen
Collectable.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Collect method of a collectable.
 * Algorithm checks if the player has landed on a collectable. If true then it
 * increments the score and repositions the collectable randomly.
 */

Collectable.prototype.collect = function() {
    if (player.x < this.x + gridWidth && player.x + gridWidth > this.x &&
        player.y < this.y + gridHeight && gridHeight + player.y > this.y) {

        score.value += this.points;
        this.x = gridWidth * getRandomInt(1, 4);
        this.y = gridHeight * getRandomInt(1, 4);

    }
};

// Collectable sub class, Predefines the properties of a star collectable
var Star = function(xLoc, yLoc) {
    this.sprite = "images/star.png";
    this.points = 5;
    Collectable.call(this, xLoc, yLoc);
};

/* link the prototype of the star object to the prototype of the collectable
 * so that the properties of the collectable can be used for the star object by delegation.
 */

Star.prototype = Object.create(Collectable.prototype);

/* Reassign the constructor property of star.prototype since we replaced
 * the object with a new one in the previous line
 */

Star.prototype.constructor = Collectable;



// Collectable sub class, Predefines the properties of a key collectable.

var Key = function(xLoc, yLoc) {
    this.sprite = "images/key.png";
    this.points = 2;
    Collectable.call(this, xLoc, yLoc);
};


/* Linkx the prototype of the key object to the prototype of the collectable
 * so that the properties of the collectable can be used for the key object by delegation.
 */

Key.prototype = Object.create(Collectable.prototype);


/* Reassign the constructor property of key.prototype since we replaced
 * the object with a new one in the previous line
 */

Key.prototype.constructor = Collectable;


// Create instances of the collectables object to use in the game.
var collectable1 = new Star(getRandomInt(1, 4), getRandomInt(1, 4));
var collectable2 = new Key(getRandomInt(1, 4), getRandomInt(1, 4));

// Place all the collectables in the allCollectables array.
var allCollectables = [];

allCollectables.push(collectable1, collectable2);

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});