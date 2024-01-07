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

var enemyX = 10;
var enemyY = 10;
var enemyOrientation = 0;
var enemyDeltaX = 0;
var enemyDeltaY = 0;
var enemyState = 0;

var enemyTargetX;
var enemyTargetY;
var lerpFactor;

var myOrientation = 0; // 0 - up, 1 - left, 2 - down, 3 - right

var keystate = {};

var playerX, playerY, opponentX, opponentY, isShooting = false;
var running = false;

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
        //triggerLumination();
        triggerShoot();
    }
    /*if (keystate[controlKey]) {
        triggerShoot();
    }*/
}

function canMove(deltaX, deltaY) {
    if (player.state > 0) return false;
    if (board[player.x + deltaX][player.y + deltaY].type == 0) return true;
    return false;
}

function sendMove() {
    sendPlayerPosition(socket, roomCode, {
        name: myId,
        x: player.x,
        y: player.y,
        deltaX: player.deltaX,
        deltaY: player.deltaY,
        orientation: myOrientation,
        lumination: false,
        shoot: false
    });
}

function moveDown() {
    if (canMove(0, 1)) {
        player.deltaY = 1;
        myOrientation = 2;
        player.state = maxState / moveFactor;
        sendMove();
    }
}

function moveUp() {
    if (canMove(0, -1)) {
        player.deltaY = -1;
        myOrientation = 0;
        player.state = maxState / moveFactor;
        sendMove();
    }
}

function moveLeft() {
    if (canMove(-1, 0)) {
        player.deltaX = -1;
        myOrientation = 1;
        player.state = maxState / moveFactor;
        sendMove();
    }
}

function moveRight() {
    if (canMove(1, 0)) {
        player.deltaX = 1;
        myOrientation = 3;
        player.state = maxState / moveFactor;
        sendMove();
    }
}

function clearScreen() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
}

function initializeEnemy() {
    enemy.state = 0;
    enemy.x = 10;
    enemy.y = 10;
    enemy.deltaX = 0;
    enemy.deltaY = 0;
}

function testImageRendering(x, y, alpha) {
    const img = document.getElementById("tile1");
    context.globalAlpha = alpha;
    context.drawImage(img, x, y, tileSize, tileSize);
    context.globalAlpha = 1;
}

function renderMargin(x, y, tileSize) {
    const img = document.getElementById("margin-tile");
    context.globalAlpha = 0.62;
    context.drawImage(img, x * tileSize, y * tileSize, 16, 16);
    context.globalAlpha = 1;
}

function renderTile(x, y, tileSize) {
    const img = document.getElementById("tile2");
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
        renderMargin(element.x, element.y, tileSize);
    }
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

function moveEnemy() {
    if (enemy.state > 0) {
        enemy.state--;
    }
    if (enemy.state == 0) {
        enemy.x += enemy.deltaX;
        enemy.y += enemy.deltaY;
        enemy.deltaX = 0;
        enemy.deltaY = 0;
    }
}

function moveMyBullet() {
    if (!myBullet.active) return;
    if (myBullet.state > 0) {
        myBullet.state--;
    }
    if (myBullet.state == 0) {
        myBullet.x += myBullet.deltaX;
        myBullet.y += myBullet.deltaY;
        if (myBullet.x + myBullet.deltaX > 0 &&
            myBullet.x + myBullet.deltaX < boardWidth - 1 &&
            myBullet.y + myBullet.deltaY > 0 &&
            myBullet.y + myBullet.deltaY < boardHeight - 1) {
            myBullet.state = 4;
        } else {
            myBullet.active = false;
            isShooting = false;
        }
    }
}

function moveEnemyBullet() {
    if (!enemyBullet.active) return;
    if (enemyBullet.state > 0) {
        enemyBullet.state--;
    }
    if (enemyBullet.state == 0) {
        enemyBullet.x += enemyBullet.deltaX;
        enemyBullet.y += enemyBullet.deltaY;
        if (enemyBullet.x + enemyBullet.deltaX > 0 &&
            enemyBullet.x + enemyBullet.deltaX < boardWidth - 1 &&
            enemyBullet.y + enemyBullet.deltaY > 0 &&
            enemyBullet.y + enemyBullet.deltaY < boardHeight - 1) {
            enemyBullet.state = 4;
        } else {
            enemyBullet.active = false;
            //isShooting = false;
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
        drawPlayerGun(player, 8, 0, "rgba(255, 140, 0, 1)");
    }
    if (myOrientation == 1) {
        drawPlayerGun(player, 0, 8, "rgba(255, 140, 0, 1)");
    }
    if (myOrientation == 2) {
        drawPlayerGun(player, 8, 16, "rgba(255, 140, 0, 1)");
    }
    if (myOrientation == 3) {
        drawPlayerGun(player, 16, 8, "rgba(255, 140, 0, 1)");
    }
}

function drawPlayerGun(player, offsetX, offsetY, color) {
    var oldStrokeStyle = context.strokeStyle;
    context.strokeStyle = color;
    var oldWidth = context.lineWidth;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(
        player.x * tileSize + (maxState / moveFactor - player.state) * player.deltaX * moveFactor + 8,
        player.y * tileSize + (maxState / moveFactor - player.state) * player.deltaY * moveFactor + 8
    );
    context.lineTo(
        player.x * tileSize + (maxState / moveFactor - player.state) * player.deltaX * moveFactor + offsetX,
        player.y * tileSize + (maxState / moveFactor - player.state) * player.deltaY * moveFactor + offsetY
    );
    context.stroke();
    context.strokeStyle = oldStrokeStyle;
    context.lineWidth = oldWidth;
}

function drawEnemy() {
    context.fillStyle = "rgba(255, 140, 0, 1)";
    context.fillRect(
        enemy.x * tileSize + (maxState / moveFactor - enemy.state) * enemy.deltaX * moveFactor,
        enemy.y * tileSize + (maxState / moveFactor - enemy.state) * enemy.deltaY * moveFactor,
        tileSize,
        tileSize
    );
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fillRect(
        enemy.x * tileSize + (maxState / moveFactor - enemy.state) * enemy.deltaX * moveFactor + 2,
        enemy.y * tileSize + (maxState / moveFactor - enemy.state) * enemy.deltaY * moveFactor + 2,
        tileSize - 4,
        tileSize - 4
    );
    if (enemy.orientation == 0) {
        drawPlayerGun(enemy, 8, 0, "rgba(255, 255, 255, 1)");
    }
    if (enemy.orientation == 1) {
        drawPlayerGun(enemy, 0, 8, "rgba(255, 255, 255, 1)");
    }
    if (enemy.orientation == 2) {
        drawPlayerGun(enemy, 8, 16, "rgba(255, 255, 255, 1)");
    }
    if (enemy.orientation == 3) {
        drawPlayerGun(enemy, 16, 8, "rgba(255, 255, 255, 1)");
    }
}

function drawMyBullet() {
    if (!myBullet.active) return;
    if(myBullet.orientation == 0) {
        drawBullet(myBullet, 8, 0, 8, 16, "rgba(255, 140, 0, 1)");
    }
    if(myBullet.orientation == 1) {
        drawBullet(myBullet, 0, 8, 16, 8, "rgba(255, 140, 0, 1)");
    }
    if(myBullet.orientation == 2) {
        drawBullet(myBullet, 8, 0, 8, 16, "rgba(255, 140, 0, 1)");
    }
    if(myBullet.orientation == 3) {
        drawBullet(myBullet, 0, 8, 16, 8, "rgba(255, 140, 0, 1)");
    }
}

function drawEnemyBullet() {
    if (!enemyBullet.active) return;
    if(enemyBullet.orientation == 0) {
        drawBullet(enemyBullet, 8, 0, 8, 16, "rgba(255, 255, 255, 1)");
    }
    if(enemyBullet.orientation == 1) {
        drawBullet(enemyBullet, 0, 8, 16, 8, "rgba(255, 255, 255, 1)");
    }
    if(enemyBullet.orientation == 2) {
        drawBullet(enemyBullet, 8, 0, 8, 16, "rgba(255, 255, 255, 1)");
    }
    if(enemyBullet.orientation == 3) {
        drawBullet(enemyBullet, 0, 8, 16, 8, "rgba(255, 255, 255, 1)");
    }
}

function drawBullet(bullet, startX, startY, offsetX, offsetY, color) {
    var oldStrokeStyle = context.strokeStyle;
    context.strokeStyle = color;
    var oldWidth = context.lineWidth;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(
        bullet.x * tileSize + (4 - bullet.state) * bullet.deltaX * 4 + startX, // TODO: fix this
        bullet.y * tileSize + (4 - bullet.state) * bullet.deltaY * 4 + startY // TODO: fix this
    );
    context.lineTo(
        bullet.x * tileSize + (4 - bullet.state) * bullet.deltaX * 4 + offsetX, // TODO: fix this
        bullet.y * tileSize + (4 - bullet.state) * bullet.deltaY * 4 + offsetY // TODO: fix this
    );
    context.stroke();
    context.strokeStyle = oldStrokeStyle;
    context.lineWidth = oldWidth;
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

function canShoot() {
    return !isShooting;
}

function lerpEnemy() {
    // TODO: implement thiis
    var diffX = enemyTargetX - enemyX;
    var diffY = enemyTargetY - enemyY;
    if (diffX > 1) {
        enemyX += diffX / 8;
    } else {
        enemyX = enemyTargetX;
    }

    if (diffY > 1) {
        enemyY = diffY / 8;
    } else {
        enemyY = enemyTargetY;
    }
}

function triggerShoot() {
    if (canShoot()) {
        console.log("shooting");
        myBullet.x = player.x;
        myBullet.y = player.y;
        myBullet.orientation = myOrientation;
        isShooting = true;
        if (myOrientation == 0) {
            myBullet.active = true;
            myBullet.deltaX = 0;
            myBullet.deltaY = -1;
            myBullet.state = 4; // TODO: fix this
        }
        if (myOrientation == 1) {
            myBullet.active = true;
            myBullet.deltaX = -1;
            myBullet.deltaY = 0;
            myBullet.state = 4; // TODO: fix this
        }
        if (myOrientation == 2) {
            myBullet.active = true;
            myBullet.deltaX = 0;
            myBullet.deltaY = 1;
            myBullet.state = 4; // TODO: fix this
        }
        if (myOrientation == 3) {
            myBullet.active = true;
            myBullet.deltaX = 1;
            myBullet.deltaY = 0;
            myBullet.state = 4; // TODO: fix this
        }
        sendPlayerShoot(socket, roomCode, {
            name: myId,
            x: myBullet.x,
            y: myBullet.y,
            deltaX: myBullet.deltaX,
            deltaY: myBullet.deltaY,
            orientation: myBullet.orientation
        });
    }
}

function checkDead() {
    if (enemyBullet.active && player.x == enemyBullet.x && player.y == enemyBullet.y) {
        console.log("i'm dead!!!");
        myBullet.active = false;
        enemyBullet.active = false;
        isShooting = false;
        sendPlayerDead(socket, roomCode, {
            name: myId
        });
    }
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

function sendTriggerShoot() {
    sendPlayerShoot(socket, roomCode, {
        name: myId,
        x: player.x,
        y: player.y,
        orientation: orientation
    });
}

function Player() {
    this.state = 0;
    this.x = 1;
    this.y = 1;
    this.deltaX = 0;
    this.deltaY = 0;
}

function Bullet() {
    this.active = false;
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
    initializeEnemy();
    game.update();
}

Game.prototype.update = function () {
    game.gameLoop.update();
    for (gameObject in game.gameObjects) {
        gameObject.update();
    }

    if (running) {
        handleInput();
        drawBoard();
        movePlayer();
        moveEnemy();
        moveMyBullet();
        moveEnemyBullet();
        drawPlayer();
        drawEnemy();
        drawMyBullet();
        drawEnemyBullet();
        checkDead();
        updateLumination();
    }
    window.requestAnimationFrame(game.update);
}

var game = new Game();
var player = new Player
var enemy = new Player();
var myBullet = new Bullet();
var enemyBullet = new Bullet();
game.start();

/*
ce mai am de facut:
spawn points - server side
bullet movement & draw & physics - client side & server side

deploy amazon
deploy adrianus.ro
incorporate in index.html + flow de dinainte de game
*/
