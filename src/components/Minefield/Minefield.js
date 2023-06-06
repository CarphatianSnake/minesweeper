import Cell from '../Cell/Cell.js';

class Minefield {
  constructor(data, size, mineCount) {
    this.size = size;
    this.mineCount = mineCount;
    this.data = data;
  }

  init = () => {
    if (!this.data) {
      this.data = [];
      for (let y = 0; y < this.size; y += 1) {
        this.data[y] = [];
        for (let x = 0; x < this.size; x += 1) {
          const cell = new Cell(x, y);
          this.data[y][x] = cell;
        }
      }
    }
  };

  placeMines = (clickX, clickY) => {
    let minesLeft = this.mineCount;

    while (minesLeft > 0) {
      const getRandomPosition = () => Math.floor(Math.random() * this.size);
      const x = getRandomPosition();
      const y = getRandomPosition();

      const { isMine } = this.data[y][x];

      const isClickPosition = x === clickX && y === clickY;

      if (!isMine && !isClickPosition) {
        this.data[y][x].isMine = true;
        minesLeft -= 1;
      }
    }

    this.countAdjacentMines();
  };

  countAdjacentMines = () => {
    this.data.forEach((row) => {
      row.forEach((cell) => {
        for (let y = cell.y - 1; y <= cell.y + 1; y += 1) {
          if (this.data[y]) {
            for (let x = cell.x - 1; x <= cell.x + 1; x += 1) {
              if (this.data[y][x]) {
                if (this.data[y][x].isMine) {
                  this.data[cell.y][cell.x].adjacentMineCount += 1;
                }
              }
            }
          }
        }
      });
    });
  };
}

export default Minefield;
