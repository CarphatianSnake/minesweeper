import Timer from '../Counters/Timer.js';
import ClickCounter from '../Counters/ClickCounter.js';
import FlagsCounter from '../Counters/FlagsCounter.js';
import Minefield from '../Minefield/Minefield.js';
import Modal from '../Modal/Modal.js';
import {
  capitalize, calculateCellSize, drawIcon, themeColors,
} from '../../utils/utils.js';

class GameBoard {
  constructor() {
    this.size = 10;
    this.mineCount = 10;
    this.isLose = false;
    this.isGameEnd = false;
    this.flag = document.querySelector('.flag');
    this.mine = document.querySelector('.mine');
    this.drawIcon = drawIcon.bind(this);

    // this.theme = null;
    // this.cellSize = null;
    // this.width = null;
    // this.height = null;
    // this.mineField = null;
    // this.canvas = null;
    // this.ctx = null;
    // this.timer = null;
    // this.clickCounter = null;
    // this.flagsCounter = null;
  }

  getTheme = () => {
    const theme = window.localStorage.getItem('theme');
    if (!theme) {
      this.theme = 'light';
      window.localStorage.setItem('theme', 'light');
    } else {
      this.theme = theme;
    }
  };

  init = () => {
    this.getTheme();

    const main = document.querySelector('.main');

    const gameInfo = document.createElement('section');
    gameInfo.classList.add('game-info');
    main.append(gameInfo);

    const gameSection = document.createElement('section');
    gameSection.classList.add('game');
    main.append(gameSection);

    const savedGame = JSON.parse(window.localStorage.getItem('savedGame'));

    if (savedGame) {
      const {
        mineField, time, clicks, size, mineCount, flags,
      } = savedGame;
      this.size = size;
      this.mineCount = mineCount;
      this.mineField = new Minefield(mineField, size, mineCount);
      this.timer = new Timer(time);
      this.clickCounter = new ClickCounter(clicks);
      this.flagsCounter = new FlagsCounter(flags);
    } else {
      this.mineField = new Minefield(null, this.size, this.mineCount);
      this.timer = new Timer(0);
      this.clickCounter = new ClickCounter(0);
      this.flagsCounter = new FlagsCounter(this.mineCount);
    }

    this.clickCounter.init();
    this.flagsCounter.init();
    this.timer.init();
    this.mineField.init();

    this.cellSize = calculateCellSize(this.size);
    this.generateGameBoard();

    gameSection.append(this.canvas);

    this.newGameButton();
    this.themeSwitcher();
    this.draw();

    window.addEventListener('resize', this.onResize);

    window.addEventListener('beforeunload', () => {
      const currentGame = {
        mineField: this.mineField.data,
        clicks: this.clickCounter.value,
        time: this.timer.value,
        size: this.size,
        mineCount: this.mineCount,
        flags: this.flagsCounter.value,
      };
      if (!this.isGameEnd && this.clickCounter.value > 0) {
        window.localStorage.setItem('savedGame', JSON.stringify(currentGame));
      }
    });
  };

  onResize = () => {
    const cellSize = calculateCellSize(this.size);
    if (cellSize !== this.cellSize) {
      this.canvas.removeEventListener('click', this.onClick);
      this.canvas.removeEventListener('contextmenu', this.onContextMenu);

      const board = this.canvas;
      board.remove();

      this.cellSize = cellSize;
      this.generateGameBoard();

      this.draw();
    }
  };

  generateGameBoard = () => {
    const gameSection = document.querySelector('.game');
    this.width = this.size * this.cellSize;
    this.height = this.size * this.cellSize;

    const header = document.querySelector('.header');
    header.style.width = `${this.width}px`;

    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('game-board');
    this.canvas.height = this.height;
    this.canvas.width = this.width;

    this.ctx = this.canvas.getContext('2d');

    this.ctx.font = `${this.cellSize / 2}px monospace`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    gameSection.append(this.canvas);

    if (!this.isGameEnd) {
      this.canvas.addEventListener('click', this.onClick);
      this.canvas.addEventListener('contextmenu', this.onContextMenu);
    }
  };

  draw = () => {
    const colors = themeColors[this.theme];
    this.mineField.data.forEach((row, y) => {
      row.forEach((cell, x) => {
        const { cellSize } = this;
        this.ctx.fillStyle = colors.closed;
        this.ctx.strokeStyle = colors.stroke;
        this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        this.ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

        if (cell.isRevealed) {
          this.ctx.fillStyle = colors.revealed;
          this.fillCell(cell.x, cell.y);
          this.drawNumberOfAdjacentMines(cell);
        }

        if (cell.isMarked) {
          this.drawIcon(this.flag, x, y);
        }

        if (cell.isMine && this.isLose) {
          if (cell.isRevealed) {
            this.ctx.fillStyle = colors.mined;
            this.fillCell(cell.x, cell.y);
          }
          if (cell.isMarked) {
            this.ctx.fillStyle = themeColors[this.theme].cell;
            this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
          }
          this.drawIcon(this.mine, x, y);
        }
      });
    });
  };

  onClick = (e) => {
    // Get clicked cell and it calculated position
    const { cell, posX, posY } = this.getCellByXY(e.offsetX, e.offsetY);

    // On first click generate mines and start timer
    if (this.clickCounter.value === 0) {
      const startSound = document.getElementById('startSound');
      startSound.currentTime = 0;
      startSound.play();
      this.mineField.placeMines(posX, posY);
      this.timer.start();
    }

    if (!cell.isRevealed && !cell.isMarked) {
      if (cell.isMine) {
        this.ctx.fillStyle = themeColors[this.theme].mined;
        this.fillCell(posX, posY);
        this.ctx.stroke();
        this.drawIcon(this.mine, posX, posY);
        cell.isRevealed = true;
        this.onLose();
      } else {
        const savedGame = JSON.parse(window.localStorage.getItem('savedGame'));
        if (savedGame && this.clickCounter.value === savedGame.clicks && !this.timer.id) {
          this.timer.start();
        }
        this.openCell(cell);
        cell.isRevealed = true;
        this.checkIsWin();
        this.clickCounter.inc();
      }
    }
  };

  onContextMenu = (e) => {
    e.preventDefault();
    const { cell, posX, posY } = this.getCellByXY(e.offsetX, e.offsetY);
    const colors = themeColors[this.theme];

    if (!cell.isRevealed) {
      if (cell.isMarked) {
        cell.isMarked = false;
        this.flagsCounter.inc();
        this.ctx.fillStyle = colors.closed;
        this.fillCell(posX, posY);
      } else if (this.flagsCounter.value > 0) {
        cell.isMarked = true;
        this.flagsCounter.dec();
        this.drawIcon(this.flag, posX, posY);
      }
    }
  };

  getCellByXY = (clickX, clickY) => {
    const posX = clickX < 0 ? 0 : Math.floor(clickX / this.cellSize);
    const posY = clickY < 0 ? 0 : Math.floor(clickY / this.cellSize);
    const cell = this.mineField.data[posY][posX];
    return { cell, posX, posY };
  };

  fillCell = (posX, posY) => {
    const x = posX * this.cellSize;
    const y = posY * this.cellSize;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
  };

  drawNumberOfAdjacentMines = (cell) => {
    const colors = {
      1: '#0098ff',
      2: '#4aac4a',
      3: '#f1c232',
      4: '#a40ea4',
      5: '#f52626',
      6: '#382183',
      7: '#b41362',
      8: '#a5662a',
    };

    if (cell.adjacentMineCount) {
      const { x, y, adjacentMineCount } = cell;
      const posX = x * this.cellSize + this.cellSize / 2;
      const posY = y * this.cellSize + this.cellSize / 2;
      this.ctx.fillStyle = colors[adjacentMineCount];
      this.ctx.fillText(adjacentMineCount, posX, posY);
    }
  };

  openCell = (cell) => {
    const cellColor = themeColors[this.theme].revealed;
    this.ctx.fillStyle = cellColor;
    this.fillCell(cell.x, cell.y);
    this.drawNumberOfAdjacentMines(cell);

    if (!cell.adjacentMineCount) {
      const minesData = this.mineField.data;
      for (let y = cell.y - 1; y <= cell.y + 1; y += 1) {
        if (minesData[y]) {
          for (let x = cell.x - 1; x <= cell.x + 1; x += 1) {
            if (minesData[y][x]) {
              const { isRevealed, isMarked } = minesData[y][x];
              if (!isRevealed && !isMarked) {
                minesData[y][x].isRevealed = true;
                this.ctx.fillStyle = cellColor;
                this.fillCell(x, y);
                this.openCell(minesData[y][x]);
              }
            }
          }
        }
      }
    }
  };

  checkIsWin = () => {
    const flatMineField = this.mineField.data.flat();
    const isWin = flatMineField.every((cell) => cell.isRevealed || cell.isMine);

    if (isWin) {
      const winSound = document.getElementById('winSound');
      winSound.currentTime = 0;
      winSound.play();
      this.timer.stop();
      this.resetGameStatus();
      this.modal('win');
      this.saveResults('win');
      this.isGameEnd = true;
    } else if (this.clickCounter.value !== 0) {
      const startSound = document.getElementById('startSound');
      const clickSound = document.getElementById('clickSound');
      startSound.pause();
      clickSound.currentTime = 0;
      clickSound.play();
    }
  };

  onLose = () => {
    const loseSound = document.getElementById('loseSound');
    loseSound.currentTime = 0;
    loseSound.play();
    this.timer.stop();
    this.resetGameStatus();
    this.modal('lose');
    this.saveResults('lose');
    this.isLose = true;
    this.isGameEnd = true;
    this.mineField.data.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.isMine) {
          if (cell.isMarked) {
            this.ctx.fillStyle = themeColors[this.theme].closed;
            this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
          }
          this.drawIcon(this.mine, x, y);
        }
      });
    });
  };

  resetGameStatus = () => {
    this.canvas.removeEventListener('click', this.onClick);
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
    window.localStorage.removeItem('savedGame');
  };

  modal = (type) => {
    const modal = new Modal(() => {
      const fragment = document.createDocumentFragment();

      const messageHeading = document.createElement('h2');
      messageHeading.classList.add('modal__heading');
      messageHeading.textContent = `You ${capitalize(type)}`;

      const messageText = document.createElement('p');
      messageText.classList.add('modal__text');
      if (type === 'win') {
        messageText.textContent = `Hooray! You found all mines in ${this.timer.value} seconds and ${this.clickCounter.value + 1} moves!`;
      } else {
        messageText.textContent = 'Game over. Try again!';
      }

      fragment.append(messageHeading);
      fragment.append(messageText);

      return fragment;
    });

    modal.init();
  };

  remove = () => {
    const gameBoard = this.canvas;
    gameBoard.remove();

    this.timer.stop();
    this.timer.remove();
    this.flagsCounter.remove();
    this.clickCounter.remove();
  };

  newGameButton = () => {
    const button = document.querySelector('.btn_new-game');
    if (!button) {
      const header = document.querySelector('.header');
      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn_new-game');
      btn.textContent = 'New Game';
      header.prepend(btn);

      btn.addEventListener('click', () => {
        btn.blur();
        const modal = new Modal(() => {
          const form = document.createElement('form');

          const sizeInputWrapper = document.createElement('div');
          sizeInputWrapper.classList.add('input-wrapper');

          const sizeLabel = document.createElement('label');
          sizeLabel.setAttribute('for', 'size');
          sizeLabel.textContent = 'Choose game board size:';

          const sizeInput = document.createElement('select');
          sizeInput.setAttribute('name', 'size');
          sizeInput.id = 'size';
          sizeInput.classList.add('size');
          const sizes = [10, 15, 25];
          sizes.forEach((size) => {
            const sizeOption = document.createElement('option');
            sizeOption.textContent = `${size}x${size}`;
            sizeOption.value = size;
            if (size === 10) {
              sizeOption.setAttribute('selected', '');
            }
            sizeInput.append(sizeOption);
          });

          sizeInputWrapper.append(sizeLabel);
          sizeInputWrapper.append(sizeInput);

          const minesInputWrapper = document.createElement('div');
          minesInputWrapper.classList.add('input-wrapper');

          const minesLabel = document.createElement('label');
          minesLabel.setAttribute('for', 'mines');
          minesLabel.textContent = 'Choose number of mines (10–99):';

          const minesInput = document.createElement('input');
          minesInput.id = 'mines';
          minesInput.classList.add('mines');
          minesInput.setAttribute('type', 'number');
          minesInput.setAttribute('value', '10');

          const startButton = document.createElement('button');
          startButton.classList.add('btn', 'btn_start');
          startButton.textContent = 'Start';
          minesInputWrapper.append(minesLabel);
          minesInputWrapper.append(minesInput);

          form.append(sizeInputWrapper);
          form.append(minesInputWrapper);
          form.append(startButton);

          const onStart = (e) => {
            e.preventDefault();

            this.size = +sizeInput.value;
            this.mineCount = +minesInput.value;

            modal.close();

            window.localStorage.removeItem('savedGame');
            this.timer.stop();
            this.isLose = false;
            this.isGameEnd = false;

            const game = document.querySelector('.game');
            game.remove();
            const gameInfo = document.querySelector('.game-info');
            gameInfo.remove();
            const themeSwitcher = document.querySelector('.theme-switcher');
            themeSwitcher.remove();

            window.removeEventListener('resize', this.onResize);
            this.init();
          };

          const validateMinesInput = () => {
            if (minesInput.value < 10 || minesInput.value > 99) {
              startButton.setAttribute('disabled', '');
              minesInput.classList.add('mines_error');
            } else {
              startButton.removeAttribute('disabled');
              minesInput.classList.remove('mines_error');
            }
          };

          minesInput.addEventListener('change', validateMinesInput);

          startButton.addEventListener('click', (e) => {
            onStart(e);
            startButton.removeEventListener('click', onStart);
            minesInput.removeEventListener('change', validateMinesInput);
          });

          return form;
        });

        modal.init();
      });
    }
  };

  saveResults = (type) => {
    let results = JSON.parse(window.localStorage.getItem('results'));
    const gameResults = {
      size: `${this.size}x${this.size}`,
      mines: this.mineField.mineCount,
      clicks: this.clickCounter.value + 1,
      time: this.timer.value,
      type,
      date: new Date(),
    };

    if (results) {
      if (results.length === 10) {
        results.splice(0, 1);
      }
    } else {
      results = [];
    }
    results.push(gameResults);

    window.localStorage.setItem('results', JSON.stringify(results));
  };

  themeSwitcher = () => {
    const header = document.querySelector('.header');

    document.body.dataset.theme = this.theme;
    let isChecked = this.theme !== 'light';

    const switcher = document.createElement('button');
    switcher.classList.add('btn', 'theme-switcher');
    if (this.theme === 'dark') {
      switcher.classList.add('theme-switcher_dark');
    }

    header.append(switcher);

    switcher.addEventListener('click', () => {
      isChecked = !isChecked;
      this.theme = isChecked ? 'dark' : 'light';

      if (this.theme === 'dark') {
        switcher.classList.add('theme-switcher_dark');
      } else {
        switcher.classList.remove('theme-switcher_dark');
      }

      window.localStorage.setItem('theme', this.theme);
      document.body.dataset.theme = this.theme;
      this.draw();
    });
  };
}

export default GameBoard;
