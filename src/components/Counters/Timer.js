import Counter from './Counter.js';
import { parseSeconds } from '../../utils/utils.js';

class Timer extends Counter {
  constructor(props) {
    super(props);
    this.name = 'Time';
  }

  start = () => {
    this.id = setInterval(() => {
      this.inc();
    }, 1000);
  };

  stop = () => {
    clearInterval(this.id);
  };

  update = () => {
    this.counter.textContent = parseSeconds(this.value);
  };
}

export default Timer;
