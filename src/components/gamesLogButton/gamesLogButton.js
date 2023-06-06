import Modal from '../Modal/Modal.js';
import { capitalize, parseSeconds, parseDate } from '../../utils/utils.js';

function gamesLogButton() {
  const header = document.querySelector('.header');
  const button = document.createElement('button');
  button.textContent = 'Games Log';
  button.classList.add('btn', 'btn_games-log');
  header.append(button);

  button.addEventListener('click', () => {
    button.blur();
    const modal = new Modal(() => {
      const gamesLog = JSON.parse(window.localStorage.getItem('results'));

      if (!gamesLog) {
        const message = document.createElement('p');
        message.textContent = 'There is no played games yet!';
        return message;
      }

      const keys = Object.keys(gamesLog[0]);
      const table = document.createElement('table');
      table.classList.add('table');

      const headingsRow = document.createElement('tr');
      headingsRow.classList.add('table__row');
      keys.forEach((key) => {
        const element = document.createElement('th');
        element.classList.add('table__cell');
        element.textContent = key === 'type' ? 'Result' : capitalize(key);
        headingsRow.append(element);
      });
      table.append(headingsRow);

      gamesLog.forEach((item) => {
        const row = document.createElement('tr');
        row.classList.add('table__row');
        keys.forEach((key) => {
          const cell = document.createElement('td');
          cell.classList.add('table__cell');
          if (key === 'date') {
            cell.textContent = parseDate(item[key]);
          } else if (key === 'time') {
            cell.textContent = parseSeconds(item[key]);
          } else {
            cell.textContent = item[key];
          }

          if (key === 'type') {
            const cls = item[key] === 'win' ? 'table__cell_win' : 'table__cell_lose';
            cell.classList.add(cls);
          }

          row.append(cell);
        });
        table.append(row);
      });

      return table;
    });

    modal.init();
  });
}

export default gamesLogButton;
