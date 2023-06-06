import Counter from './Counter.js';

class FlagsCounter extends Counter {
  constructor(props) {
    super(props);
    this.name = 'Flags';
  }

  dec = () => {
    this.value -= 1;
    this.update();
  };
}

export default FlagsCounter;
