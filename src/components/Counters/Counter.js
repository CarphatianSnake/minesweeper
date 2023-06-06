class Counter {
  constructor(value) {
    this.container = document.createElement('h3');
    this.counter = document.createElement('span');
    this.value = value;
    this.name = null;
  }

  init = () => {
    this.container.classList.add('counter');
    this.container.textContent = `${this.name}: `;
    this.counter.classList.add('counter__count');
    this.container.append(this.counter);

    this.update();

    const gameInfo = document.querySelector('.game-info');
    gameInfo.append(this.container);
  };

  update = () => {
    this.counter.textContent = this.value;
  };

  inc = () => {
    this.value += 1;
    this.update();
  };

  remove = () => {
    const element = this.container;
    element.remove();
  };
}

export default Counter;
