import GameBoard from './GameBoard/GameBoard.js';
import addSounds from './addSounds/addSounds.js';
import gamesLogButton from './gamesLogButton/gamesLogButton.js';

import flag from '../assets/img/flag.svg';
import mine from '../assets/img/mine.svg';

function app() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');

  const header = document.createElement('header');
  header.classList.add('header');
  wrapper.append(header);

  const main = document.createElement('main');
  main.classList.add('main');
  wrapper.append(main);

  document.body.append(wrapper);

  gamesLogButton();
  addSounds();

  const flagImg = document.createElement('img');
  flagImg.src = flag;
  flagImg.classList.add('flag');
  document.body.append(flagImg);

  const mineImg = document.createElement('img');
  mineImg.src = mine;
  mineImg.classList.add('mine');
  document.body.append(mineImg);

  const board = new GameBoard();
  board.init();
}

export default app;
