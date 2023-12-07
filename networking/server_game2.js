function Game() {
    console.log("initializing a game");
    this.player1 = new Player();
    this.player2 = new Player();
    this.alwaysVisiblePlayers = true;
    this.board = generateBoard();
}

function Player(x, y) {
    this.name = ""; // player1 or player2
    this.x = x;
    this.y = y;
    this.state = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.lumination = false;
    this.shoot = false;
}

function Bullet() {
    this.name = ""; // player1 or player2
    this.x = 0;
    this.y = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.state = 0;
}

function generateBoard() {
    //...
}

function handleUpdatePlayerState(game, data) {
    //...
    //console.log(data.code);

}

function test() {
    console.log('server_game2.test()');
}

module.exports = { Game, Player, generateBoard, handleUpdatePlayerState };
