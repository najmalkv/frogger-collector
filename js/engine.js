/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefines the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }


    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /*This function is called by update to check if our player has collided
     * with the enemies or other objects.
     */

    function checkCollisions() {

        /* This loops through the allEnemies array and checks if the player has collided
         * with the enemy.
         */

        allEnemies.forEach(function(enemy) {

            enemy.checkCollision(enemy);

        });

        /* This loops through all the allCollectables array and checks if the player has collided
         * with a collectable.
         */

        allCollectables.forEach(function(collectable) {

            collectable.collect();

        });
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/grass-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * gridWidth, row * gridHeight);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        /* Loop through all of the objects within the allCollectables aray and call
         * the render function.
         */
        allCollectables.forEach(function(collectable) {
            collectable.render();
        });

        player.render();
        score.render();
        highScore.render();

        /* This checks if the gameover variable is set to true
         * and displays the gameover screen when true.
         */

        if(gameOver)
         renderGameOverScreen();
    }

    /* This function is called by the render function when the game over state is set to true.
     * It renders a pop up on the game screen to show the user that the game is over along with the score.
     * A play again button is also provided to allow the user restart the game easily.
     */

    function renderGameOverScreen(){
        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillRect(101, 175, 300, 250);

        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width/2, 210);

        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Oops! You touched the bug." , canvas.width/2, 260);

        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Your score is " + score.value, canvas.width/2, 320);

        ctx.fillStyle = "green";
        ctx.fillRect(160, 360, 180, 40);
        ctx.font = "18px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Play Again", canvas.width/2, 385);
        ctx.restore();
    }

    /* This function handles game reset states.
     */
    function reset() {

         player.x = gridWidth*2;
         player.y = gridHeight *5;
         score.value = 0;
         gameOver = false;
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Star.png',
        'images/Key.png'
    ]);
    Resources.onReady(init);

    /* This listens to click events from the canvas element. All reactions to clicks on an element
     *  within the canvas is handled within this handler.
     */

    canvas.addEventListener('click', function(event) {

    /* Get the canvas relative of a click, subtracting the offset from screen since
    *  the pageX and PageY of the click event object returns the x and y values
    *  with respect to the viewport */

    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

        /* Checks if the click is within the bounds of the "play again" button and calls
         * the reset function to reset the game
         */
        if (y > 360 && y < 360 + 40 && x > 160 && x < 160 + 180) {
            reset();
        }

    }, false);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */

    global.ctx = ctx;


})(this);
