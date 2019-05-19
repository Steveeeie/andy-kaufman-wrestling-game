class Actor {
  constructor({ name, direction, position }) {
    this.name = name;
    this.element = document.getElementById(name);
    this.elementspeech = document.getElementById(`${name}-speech`);
    this.direction = direction;
    this.position = position;
    this.speed = 0;
    this.speechTimeout = null;
    this.target = null;
    this.targetTimeout = null;
    this.walking = false;
  }

  setTarget({ position, range, onAcquired, onTimeout, timeout }) {
    this.target = {
      position,
      range: range || 0,
      onAcquired
    };

    if (timeout) {
      this.targetTimeout = setTimeout(() => {
        onTimeout();
      }, timeout);
    }
  }

  seekTarget() {
    const differenceX = Math.abs(this.position.x - this.target.position.x);
    const differenceY = Math.abs(this.position.y - this.target.position.y);

    if (differenceX > this.target.range || differenceY > this.target.range) {
      this.speed = 20;

      this.direction =
        90 +
        (Math.atan2(
          this.target.position.y - this.position.y,
          this.target.position.x - this.position.x
        ) *
          180) /
          Math.PI;

      this.position.x += (this.speed * Math.sin((this.direction * Math.PI) / 180)) / 10;
      this.position.y -= (this.speed * Math.cos((this.direction * Math.PI) / 180)) / 10;

      if (!this.walking) this.setWalking(true);
    } else {
      this.setWalking(false);
      if (this.targetTimeout) {
        clearTimeout(this.targetTimeout);
        this.targetTimeout = null;
      }
      if (this.target.onAcquired) this.target.onAcquired();
    }
  }

  setWalking(walking) {
    if (walking) {
      this.walking = true;
      this.element.classList.add(`${this.name}--walking`);
    } else {
      this.walking = false;
      this.element.classList.remove(`${this.name}--walking`);
    }
  }

  speak(phrase, callback) {
    this.elementspeech.innerHTML = phrase;

    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }

    this.speechTimeout = setTimeout(() => {
      this.elementspeech.innerHTML = '';
      if (callback) callback();
    }, 2500);
  }

  updatePosition(position) {
    if (position.x > 0) {
      this.position.x = position.x < 260 ? position.x : 260;
    } else {
      this.position.x = position.x > -260 ? position.x : -260;
    }
    if (position.y > 0) {
      this.position.y = position.y < 260 ? position.y : 260;
    } else {
      this.position.y = position.y > -260 ? position.y : -260;
    }
  }

  updateElementStyles() {
    this.element.style.transform = `
        translate3d(${this.position.x}px, ${this.position.y}px, 64px)
        rotate(${this.direction}deg)
      `;

    this.elementspeech.style.transform = `
        scaleZ(1.5)
        translate3d(-50%, -50%, 150px)
        rotateZ(${0 - (this.direction - 45)}deg)
        rotateX(-90deg)
        rotateY(-90deg)
      `;
  }

  update() {
    if (this.target) {
      this.seekTarget();
    }

    this.updateElementStyles();
  }
}

export default Actor;
