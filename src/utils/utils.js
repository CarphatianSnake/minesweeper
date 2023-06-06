export const addZero = (value) => (value < 10 ? `0${value}` : `${value}`);

export const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

export const calculateCellSize = (size) => {
  const wrapper = document.querySelector('.wrapper');
  const header = document.querySelector('.header');
  const gameInfo = document.querySelector('.game-info');
  const rem = 16;
  const heightMargins = 2 * rem + rem + rem;
  const widthMargins = rem + rem;
  const width = wrapper.clientWidth - widthMargins;
  const height = wrapper.clientHeight - header.clientHeight - gameInfo.clientHeight - heightMargins;
  const value = width >= height ? height : width;
  const cellSize = Math.floor(value / size);
  if (cellSize < 18) return 18;
  if (cellSize > 40) return 40;
  return cellSize;
};

export const parseSeconds = (sec) => {
  const seconds = addZero(sec % 60);
  const minutes = addZero(Math.floor(sec / 60));
  return `${minutes}:${seconds}`;
};

export const parseDate = (dateString) => {
  const date = new Date(Date.parse(dateString));
  const day = addZero(date.getDate());
  const month = addZero(date.getMonth() + 1);
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  return `${day}.${month} ${hours}:${minutes}`;
};

export function drawIcon(icon, x, y) {
  const draw = () => {
    const { cellSize } = this;
    const w = cellSize * 0.75;
    const h = cellSize * 0.75;
    const posX = x * cellSize + cellSize * 0.125;
    const posY = y * cellSize + cellSize * 0.125;
    this.ctx.drawImage(icon, posX, posY, w, h);
  };

  const onLoad = () => {
    draw();
    icon.removeEventListener('load', onLoad);
  };

  if (icon.complete) {
    draw();
  } else {
    icon.addEventListener('load', onLoad);
  }
}

export const themeColors = {
  light: {
    stroke: '#fff',
    closed: '#c0c0c0',
    revealed: '#e1e1e1',
    mined: '#ff6767',
  },
  dark: {
    stroke: '#272727',
    closed: '#828181',
    revealed: '#c7c7c7',
    mined: '#ff6767',
  },
};
