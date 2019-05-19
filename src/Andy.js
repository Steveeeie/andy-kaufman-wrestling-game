import Actor from './Actor';

class Andy extends Actor {
  constructor({ taunts, ...rest }) {
    super({ ...rest });
    this.taunts = taunts;
    this.tauntIndex = 0;
  }

  taunt() {
    if (this.tauntIndex + 1 <= this.taunts.length && !jerry.offeringHeadlock) {
      this.speak(this.taunts[this.tauntIndex]);
      this.tauntIndex++;
    }
  }
}

export default Andy;
