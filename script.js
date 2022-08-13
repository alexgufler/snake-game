// canvas setup
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// variables
let rows = 20;
let cols = 20;
let cellWidth = canvas.width / cols;
let cellHeight = canvas.height / rows;

let snakePos = [];
let direction = "";
let foodPos;
let foodCollected = false;

let score = 0;  



// draw gameLoop onto the canvas
function draw() {
    // playing field
    ctx.fillStyle = "#001B33"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // snake
    ctx.fillStyle = "white"; 
    snakePos.forEach(elem => add(elem.x, elem.y));

    // food
    ctx.fillStyle = "green"; 
    add(foodPos.x, foodPos.y);

    requestAnimationFrame(draw); // repeat the function call
}

// draw the individual rectangles that are put onto the canvas
function add(x, y) {
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
}



// main game loop
function gameLoop() {
    // grow snake when collecting food by duplicating its head
    if (foodCollected === true) {
        snakePos = [{
            x: snakePos[0].x,
            y: snakePos[0].y
        }, ...snakePos];

        score++;

        foodCollected = false;
    }

    moveSnakeParts();

    // move snake head based on direction variable
    if (direction === "LEFT") {
        snakePos[0].x--;
    } else if (direction === "UP") {
        snakePos[0].y--;
    } else if (direction === "RIGHT") {
        snakePos[0].x++;
    } else if (direction === "DOWN") {
        snakePos[0].y++;
    }

    goThroughWall();

    // handle food collision
    if (snakePos[0].x === foodPos.x &&
        snakePos[0].y === foodPos.y
    ) {
        foodCollected = true;
        placeFood();
    }

    testGameOver();
}

// control the movement of all the parts of the snake except for the head
function moveSnakeParts() {
    // set the position of each part equal to the position of the part before it
    for (let i = snakePos.length - 1; i > 0; i--) {
        snakePos[i].x = snakePos[i - 1].x;
        snakePos[i].y = snakePos[i - 1].y;
    }
}

// handle wall collision (in this you can go through the wall and come out on the other side)
function goThroughWall() {
    if (snakePos[0].x < 0) {
        snakePos[0].x = cols - 1;
    } else if (snakePos[0].x > cols - 1) {
        snakePos[0].x = 0;
    } else if (snakePos[0].y < 0) {
        snakePos[0].y = rows - 1;
    } else if (snakePos[0].y > rows - 1) {
        snakePos[0].y = 0;
    }
}

// handle game over state
function testGameOver() {
    // check if snake ate itself
    let firstPart = snakePos[0];
    let otherParts = snakePos.slice(1);
    let SnakeAteItself = otherParts.find(part => part.x === firstPart.x && part.y === firstPart.y); //checks if any part is equal to the head

    // display score and reset the game if game over state was met
    if (SnakeAteItself) {
        placeSnake();
        placeFood();
        direction = "";
        alert(`Game Over!\nScore: ${score}`);
    }
}

// change direction by pressing the arrow keys
function keyDown(e) {
    switch(e.keyCode) {
        case 37:
            direction = "LEFT";
            break;
        case 38:
            direction = "UP";
            break;
        case 39:
            direction = "RIGHT";
            break;
        case 40:
            direction = "DOWN";
            break;
        default:
            alert("Only arrow keys allowed!");
    }
}
document.addEventListener("keydown", keyDown); 

// reset snake and spawn the snake head at a random location within the playing field
function placeSnake() {
    let randomX = Math.floor(Math.random() * cols);
    let randomY = Math.floor(Math.random() * rows);

    snakePos = [{
        x: randomX,
        y: randomY
    }];
}

// spawn food at a random location within the playing field
function placeFood() {
    let randomX = Math.floor(Math.random() * cols);
    let randomY = Math.floor(Math.random() * rows);

    foodPos = {
        x: randomX,
        y: randomY
    };

    // prevent food from spawning inside snake
    for (let i = 0; i < snakePos.length; i++) {
        if (foodPos.x === snakePos[i].x &&
            foodPos.y === snakePos[i].y
        ) {
            placeFood();
        }
    }
}



// function calls
placeSnake();
placeFood();
setInterval(gameLoop, 130); //refresh the game loop every 130ms
draw();