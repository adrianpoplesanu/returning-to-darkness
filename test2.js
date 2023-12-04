var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var height = canvas.height;
var width = canvas.width;

var framesPerSecond = 30;
var lumination = 0;
var luminationStep = 0.00;
var moveFactor = 2;
var maxState = 16;
var tileSize = 16;

var board;
var luminationBoard;
var luminationInProgress = false;
var triggedLumination = false;
var maxLuminationStep = 32;
var luminationSwitchThreshold = 8;
var luminationX;
var luminationY;
var boardWidth = 30;
var boardHeight = 30;

var upArrow = 38;
var downArrow = 40;
var leftArrow = 37;
var rightArrow = 39;
var spaceKey = 32;
var escapeKey = 27;
var controlKey = 17;
var movementKey;

var myOrientation = 0; // 0 - up, 1 - left, 2 - down, 3 - right

var keystate = {};

var playerX, playerY, opponentX, opponentY;

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if (e.keyCode == escapeKey) {
        e.preventDefault();
        window.location.reload();
    }
    if([spaceKey, leftArrow, upArrow, rightArrow, downArrow, controlKey].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        keystate[event.keyCode] = true;
    } else {
        console.log(event.keyCode);
    }
}, false);

document.addEventListener("keydown", function (event) {
    keystate[event.keyCode] = true;
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode === movementKey) {
        movementKey = false;
    }
    delete keystate[event.keyCode];
});

function handleInput() {
    if (keystate[downArrow]) {
        moveDown();
    }
    if (keystate[upArrow]) {
        moveUp();
    }
    if (keystate[leftArrow]) {
        moveLeft();
    }
    if (keystate[rightArrow]) {
        moveRight();
    }
    if (keystate[spaceKey]) {
        triggerLumination();
    }
    if (keystate[controlKey]) {
        triggerShoot();
    }
}

function canMove(deltaX, deltaY) {
    if (player.state > 0) return false;
    if (board[player.x + deltaX][player.y + deltaY].type == 0) return true;
    return false;
}

function moveDown() {
    if (canMove(0, 1)) {
        player.deltaY = 1;
        myOrientation = 2;
        player.state = maxState / moveFactor;
    }
}

function moveUp() {
    if (canMove(0, -1)) {
        player.deltaY = -1;
        myOrientation = 0;
        player.state = maxState / moveFactor;
    }
}

function moveLeft() {
    if (canMove(-1, 0)) {
        player.deltaX = -1;
        myOrientation = 1;
        player.state = maxState / moveFactor;
    }
}

function moveRight() {
    if (canMove(1, 0)) {
        player.deltaX = 1;
        myOrientation = 3;
        player.state = maxState / moveFactor;
    }
}

function clearScreen() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
}

function testImageRendering(x, y, alpha) {
    const img = document.getElementById("tile1");
    context.globalAlpha = alpha;
    context.drawImage(img, x, y, tileSize, tileSize);
    context.globalAlpha = 1;
}

function renderMargin(x, y, tileSize) {
    const img = document.getElementById("margin-tile");
    context.globalAlpha = 0.12;
    context.drawImage(img, x * tileSize, y * tileSize, 16, 16);
    context.globalAlpha = 1;
}

function renderTile(x, y, tileSize) {
    //const img = document.getElementById("small-tile1");
    const img = document.getElementById("tile2");
    //for (var i = 0; i < 4; i++) {
    //    for (var j = 0; j < 4; j++) {
    //        var alpha = 0.2;
            context.globalAlpha = 0.2 + 0.8 * (luminationBoard[x][y] / maxLuminationStep);

            /*if (luminationBoard[x][y] != 0) {
                var distance = Math.floor(Math.sqrt(Math.abs(luminationX - x) ^ 2 + Math.abs(luminationY - y) ^ 2));
                //console.log(distance);
                context.globalAlpha = 0.2 + 0.8 * (luminationBoard[x][y] / maxLuminationStep) - distance / 10;
            } else {
                context.globalAlpha = 0;
            }*/
            if (context.globalAlpha < 0) {
                context.globalAlpha = 0;
            }
            context.globalAlpha /= 2.4;
            if (context.globalAlpha > 1) {
                console.log("err");
            }
            //context.drawImage(img, x * tileSize + i * 4, y * tileSize + j * 4, 4, 4);
            context.drawImage(img, x * tileSize, y * tileSize, 16, 16);
            context.globalAlpha = 1;
    //    }
    //}
}

function generateTile(x, y) {
    if (x == 0 || y == 0 || y == boardWidth - 1 || x == boardHeight - 1) {
        return 27;
    }
    return 0;
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

function generateLuminationBoard(boardWidth, boardHeight) {
    luminationBoard = new Array(boardHeight);
    for (var i = 0; i < boardHeight; i++) {
        luminationBoard[i] = new Array(boardWidth);
        for (var j = 0; j < boardWidth; j++) {
            luminationBoard[i][j] = 0;
        }
    }
}

function clearScreen() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
}

function drawSquare(element) {
    //...
    var red = 255;
    var green = 140;
    var blue = 0;
    var lumination = element.alpha;
    if (element.type == 27) {
        /*red = 77;
        green = 77;
        blue = 77;*/
        /*red = 50;
        green = 5;
        blue = 5;

        context.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + lumination + ")";
        context.fillRect(element.x * tileSize, element.y * tileSize, tileSize, tileSize);*/
        renderMargin(element.x, element.y, tileSize);
    }
    /*if (element.type == 0) {
        red = 0;
        green = 0;
        blue = 0;

        context.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + lumination + ")";
        context.fillRect(element.x * tileSize, element.y * tileSize, tileSize, tileSize);
    }*/
    if (element.type == 0) {
        renderTile(element.x, element.y, tileSize);
    }
}

function drawBoard() {
    for (var i = 0; i < boardHeight; i++) {
        for (var j = 0; j < boardWidth; j++) {
            drawSquare(board[i][j]);
        }
    }
}

function movePlayer() {
    if (luminationInProgress) {
        return;
    }
    if (player.state > 0) {
        player.state--;
    }
    if (player.state == 0) {
        player.x += player.deltaX;
        player.y += player.deltaY;
        player.deltaX = 0;
        player.deltaY = 0;
        if (triggedLumination) {
            startLumination();
        }
    }
}

function drawPlayer() {
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.fillRect(
        player.x * tileSize + (maxState / moveFactor - player.state) * player.deltaX * moveFactor,
        player.y * tileSize + (maxState / moveFactor - player.state) * player.deltaY * moveFactor,
        tileSize,
        tileSize
    );
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fillRect(
        player.x * tileSize + (maxState / moveFactor - player.state) * player.deltaX * moveFactor + 2,
        player.y * tileSize + (maxState / moveFactor - player.state) * player.deltaY * moveFactor + 2,
        tileSize - 4,
        tileSize - 4
    );
    if (myOrientation == 0) {
        var oldStrokeStyle = context.strokeStyle;
        context.strokeStyle = "rgba(255, 140, 0, 1)";
        var oldWidth = context.lineWidth;
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(
            player.x * tileSize + (maxState / moveFactor - player.state) * player.deltaX * moveFactor + 8,
            player.y * tileSize + (maxState / moveFactor - player.state) * player.deltaY * moveFactor + 8
        );
        context.lineTo(
            player.x * tileSize + (maxState / moveFactor - player.state) * player.deltaX * moveFactor + 8,
            player.y * tileSize + (maxState / moveFactor - player.state) * player.deltaY * moveFactor + 0
        );
        context.stroke();
        context.strokeStyle = oldStrokeStyle;
        context.lineWidth = oldWidth;
    }
}

function canLuminate(i, j) {
    //return true;
    return luminationX - 8 < i &&
            i < luminationX + 8 &&
            luminationY - 8 < j &&
            j < luminationY + 8;
}

function updateLumination() {
    var i, j, all_dark = true;
    for (i = 0; i < boardHeight; i++) {
        for (j = 0; j < boardWidth; j++) {
            if (luminationBoard[i][j] > 0) {
                all_dark = false;
                if (luminationBoard[i][j] > maxLuminationStep) {
                    luminationBoard[i][j] = 0;
                } else {
                    luminationBoard[i][j]++;
                    if (luminationBoard[i][j] == luminationSwitchThreshold) {
                        if ((i - 1 >= 0) && (luminationBoard[i - 1][j] == 0) && canLuminate(i, j)) {
                            luminationBoard[i - 1][j] = 1;
                        }
                        if ((i + 1 < boardHeight) &&(luminationBoard[i + 1][j] == 0) && canLuminate(i, j)) {
                            luminationBoard[i + 1][j] = 1;
                        }
                        if ((j - 1 >= 0) && (luminationBoard[i][j - 1] == 0) && canLuminate(i, j)) {
                            luminationBoard[i][j - 1] = 1;
                        }
                        if ((j + 1 < boardWidth) && (luminationBoard[i][j + 1] == 0) && canLuminate(i, j)) {
                            luminationBoard[i][j + 1] = 1;
                        }
                    }
                }
            }
        }
    }
    if (all_dark) {
        luminationInProgress = false;
    }
}

function triggerLumination() {
    if (!triggedLumination && !luminationInProgress) {
        triggedLumination = true;
    }
    //console.log("lumination");
}

function triggerShoot() {
    console.log("shoot");
}

function startLumination() {
    if (!luminationInProgress) {
        luminationInProgress = true;
        triggedLumination = false;
        luminationBoard[player.x][player.y] = 1;
        //luminationBoard[player.x][player.y] = Math.floor(Math.random() * 10);
        luminationX = player.x;
        luminationY = player.y;
        player.deltaX = 0;
        player.deltaY = 0;
        player.state = 1;
    }
}

function Player() {
    this.state = 0;
    this.x = 1;
    this.y = 1;
    this.deltaX = 0;
    this.deltaY = 0;
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
    playerX = 1;
    playerY = 1;
    for (gameObject in game.gameObjects) {
        gameObject.start();
    }
    generateBoard(boardWidth, boardHeight);
    generateLuminationBoard(boardWidth, boardHeight);
    game.update();
}

Game.prototype.update = function () {
    game.gameLoop.update();
    for (gameObject in game.gameObjects) {
        gameObject.update();
    }

    handleInput();
    drawBoard();
    movePlayer();
    drawPlayer();
    updateLumination();
    window.requestAnimationFrame(game.update);
}

var game = new Game();
var player = new Player();
game.start();
