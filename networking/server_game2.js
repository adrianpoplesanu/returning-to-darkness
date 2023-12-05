function Game() {
    this.player1 = new Player();
    this.player2 = new Player();
}

function Player(x, y) {
    this.x = x;
    this.y = y;
    this.deltaX = 0;
    this.deltaY = 0;
}
