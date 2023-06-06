class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isRevealed = false;
    this.isMine = false;
    this.isMarked = false;
    this.adjacentMineCount = 0;
  }
}

export default Cell;
