import Counter from './Counter.js';

class ClickCounter extends Counter {
  constructor(props) {
    super(props);
    this.name = 'Clicks';
  }
}

export default ClickCounter;
