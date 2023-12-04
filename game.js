var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var height = canvas.height;
var width = canvas.width;

var framesPerSecond = 30;
var lumination = 0;
var luminationStep = 0.00;

var board;
var boardWidth = 30;
var boardHeight = 30;

var upArrow = 38;
var downArrow = 40;
var leftArrow = 37;
var rightArrow = 39;
var spaceKey = 32;
var escapeKey = 27;
var movementKey;

var keystate = {};

var playerX, playerY, opponentX, opponentY;

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if (e.keyCode == escapeKey) {
        e.preventDefault();
        window.location.reload();
    }
    if([spaceKey, leftArrow, upArrow, rightArrow, downArrow].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

document.addEventListener("keydown", function (event) {
    keystate[event.keyCode] = true;
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode === movementKey) {
        //console.log(movementKey);
        movementKey = false;
    }
    delete keystate[event.keyCode];
});

function generateRandomTile() {
    return Math.floor(Math.random() * 3);
}

function generateTile(x, y) {
    if (x == 0 || y == 0 || y == boardWidth - 1 || x == boardHeight - 1) {
        return 27;
    }
    return 0;
}

function generateRandomAlpha() {
    return Math.random();
}

function drawSquare(element) {
    //...
    var red = 255;
    var green = 140;
    var blue = 0;
    var lumination = element.alpha;
    if (element.type == 27) {
        red = 77;
        green = 77;
        blue = 77;
    }
    if (element.type == 0) {
        red = 0;
        green = 0;
        blue = 0;
    }
    context.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + lumination + ")";
    context.fillRect(element.x * 10, element.y * 10, 10, 10);
}

function generateRandomBoard(boardWidth, boardHeight) {
    board = new Array(boardHeight);
    for (var i = 0; i < boardHeight; i++) {
        board[i] = new Array(boardWidth);
        for (var j = 0; j < boardWidth; j++) {
            board[i][j] = {
                type: generateRandomTile(),
                alpha: generateRandomAlpha(),
                y: i,
                x: j
            }
        }
    }
    return board;
}

function generateBoard(boardWidth, boardHeight) {
    board = new Array(boardHeight);
    for (var i = 0; i < boardHeight; i++) {
        board[i] = new Array(boardWidth);
        for (var j = 0; j < boardWidth; j++) {
            board[i][j] = {
                type: generateTile(i, j),
                alpha: 1,
                y: i,
                x: j
            }
        }
    }
    return board;
}

function drawBoard() {
    for (var i = 0; i < boardHeight; i++) {
        for (var j = 0; j < boardWidth; j++) {
            drawSquare(board[i][j]);
        }
    }
}

function clearScreen() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
}

function GameLoop() {

}

GameLoop.prototype.clear = function () {
    clearScreen();
}

GameLoop.prototype.update = function () {
    this.clear();
}

function Game() {
    this.gameObjects = [];
    this.gameLoop = new GameLoop();
}

Game.prototype.start = function () {
    console.log("starting game...");
    for (gameObject in game.gameObjects) {
        gameObject.start();
    }
    //generateRandomBoard(boardWidth, boardHeight);
    generateBoard(boardWidth, boardHeight);
    setInterval(game.update, 1000/framesPerSecond);
}

Game.prototype.update = function () {
    game.gameLoop.update();
    for (gameObject in game.gameObjects) {
        gameObject.update();
    }

    /*context.fillStyle = 'orange';
    lumination += luminationStep;
    if (lumination > 0.99) luminationStep = -0.01;
    if (lumination < 0.01) luminationStep = 0.01;

    context.fillStyle = "rgba(255, 140, 0, " + lumination + ")";
    context.fillRect(10, 10, 20, 20);*/
    drawBoard();
}

var game = new Game();
game.start();
