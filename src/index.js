import Actor from './Actor';
import Andy from './Andy';
import wait from './wait';
import './scss/main.scss';

const button = document.getElementById('button');
const scene = document.getElementById('scene');
const backgroundOverlay = document.getElementById('background-overlay');
const backgroundOverlayCircle = document.getElementById('background-circle-overlay');
const textOverlay = document.getElementById('text-overlay');
const guest = document.getElementById('guest');

const WELCOME = 'WELCOME';
const INTRO = 'INTRO';
const WRESTLE_READY = 'WRESTLE_READY';
const WRESTLING = 'WRESTLING';
const HEADLOCK_READY = 'HEADLOCK_READY';
const HEADLOCKING = 'HEADLOCKING';

let gameStatus = WELCOME;
let forwardKeyPressed = false;
let leftKeyPressed = false;
let rightKeyPressed = false;

const andy = new Andy({
  name: 'andy',
  direction: 135,
  position: {
    x: -140,
    y: -140
  },
  taunts: [
    'I have the brains!',
    "I'm from Hollywood!",
    'I demand respect when I come here!',
    "I've wrestled women bigger than you Lawler...",
    '...and I mopped the floor with them!',
    "You can't touch me baby!",
    "I'll get Hollywood against you baby!"
  ]
});

const jerry = new Actor({
  name: 'jerry',
  enemy: andy,
  direction: -45,
  position: {
    x: 140,
    y: 140
  }
});

function handleKeydown(event) {
  const key = event.key.toLowerCase();
  if (key === 'w' && gameStatus === WRESTLING) forwardKeyPressed = true;
  if (key === 'a' && gameStatus === WRESTLING) leftKeyPressed = true;
  if (key === 'd' && gameStatus === WRESTLING) rightKeyPressed = true;
  if (key === ' ' && gameStatus === WRESTLE_READY) handleWrestling();
  if (key === 'e' && gameStatus === HEADLOCK_READY) handleHeadlock();
}

function handleKeyup(event) {
  const key = event.key.toLowerCase();
  if (key === 'w') forwardKeyPressed = false;
  if (key === 'a') leftKeyPressed = false;
  if (key === 'd') rightKeyPressed = false;
}

function handleButtonClick() {
  if (gameStatus === WELCOME) {
    handleIntro();
  }
}

function bindEvents() {
  button.addEventListener('click', handleButtonClick, true);
  document.addEventListener('keydown', handleKeydown, true);
  document.addEventListener('keyup', handleKeyup, true);
}

async function handleIntro() {
  gameStatus = INTRO;

  // Hide the start button and fade to black
  button.classList.add('button--hide');
  backgroundOverlay.classList.remove('background-overlay--clear');

  // Reset scene and actors ready for the intro to play
  await wait(300);
  backgroundOverlayCircle.classList.remove('background-circle-overlay--hide');
  scene.classList.remove('scene--start');
  scene.classList.add('scene--focus-andy');
  andy.direction = -45;

  // Display memorial message
  await wait(1000);
  textOverlay.innerHTML = 'In Memory Of Andy Kaufman';
  textOverlay.classList.remove('text-overlay--hide');

  // Hide memorial message
  await wait(2000);
  textOverlay.classList.add('text-overlay--hide');

  // Display date message
  await wait(1000);
  textOverlay.innerHTML = 'April 5th, 1982 - Memphis, Tennessee';
  textOverlay.classList.remove('text-overlay--hide');

  // Hide date message
  await wait(3000);
  textOverlay.classList.add('text-overlay--hide');

  // Hide overlay revealing Andy in a circle
  await wait(1000);
  backgroundOverlay.classList.add('background-overlay--hide');

  // Display Andy introduction
  await wait(800);
  textOverlay.innerHTML = '[Announcer] "From Hollywood, California... Andy Kaufman!"';
  textOverlay.classList.add('text-overlay--bottom');
  textOverlay.classList.remove('text-overlay--hide');

  // Hide Andy Introduction
  await wait(3000);
  textOverlay.classList.add('text-overlay--hide');

  // Display crowd reaction to Andy
  await wait(1000);
  textOverlay.innerHTML = '[Crowd] "Booo!"';
  textOverlay.classList.remove('text-overlay--hide');

  // Hide Andy and the crowds reaction to Andy
  await wait(2000);
  textOverlay.classList.add('text-overlay--hide');
  backgroundOverlay.classList.remove('background-overlay--hide');

  // Shift focus to Jerry and reveal Jerry in a circle
  await wait(3000);
  scene.classList.remove('scene--focus-andy');
  scene.classList.add('scene--focus-jerry');
  backgroundOverlay.classList.add('background-overlay--hide');

  // Display Jerry's Introduction
  await wait(1000);
  textOverlay.innerHTML = '[Announcer] "From Memphis, Tennessee... Jerry "The King" Lawler!"';
  textOverlay.classList.add('text-overlay--bottom');
  textOverlay.classList.remove('text-overlay--hide');

  // Hide Jerry's Introduction
  await wait(3000);
  textOverlay.classList.add('text-overlay--hide');

  // Display crowd reaction to Jerry
  await wait(1000);
  textOverlay.innerHTML = '[Crowd] "Cheer!"';
  textOverlay.classList.remove('text-overlay--hide');

  // Hide Jerry and the crowds reaction to Jerry
  await wait(2000);
  textOverlay.classList.add('text-overlay--hide');
  backgroundOverlay.classList.remove('background-overlay--hide');

  // Shift focus back to Andy and reveal Andy in a circle
  await wait(3000);
  scene.classList.remove('scene--focus-jerry');
  scene.classList.add('scene--focus-andy');
  backgroundOverlay.classList.add('background-overlay--hide');

  // Display gameplay instructions and update game status
  await wait(1000);
  textOverlay.innerHTML =
    'Lawler is twice your weight (and better looking), Use <span class="blink">[w][a][s][d]</span> to run away! <br /><br /><span class="blink">Press [space] to begin.</span>';
  textOverlay.classList.remove('text-overlay--hide');
  gameStatus = WRESTLE_READY;
}

async function handleWrestling() {
  gameStatus = WRESTLING;
  textOverlay.classList.add('text-overlay--hide');
  backgroundOverlayCircle.classList.add('background-circle-overlay--hide');
  scene.classList.remove('scene--focus-andy');

  setInterval(() => {
    andy.taunt();
  }, 2000);

  await wait(2000);

  jerry.setTarget({
    position: andy.position,
    range: 50,
    timeout: 20000,
    onTimeout: () => handleHeadlockReady(),
    onAcquired: () => handleHeadlockReady()
  });
}

async function handleHeadlockReady() {
  jerry.setTarget({
    position: { x: 0, y: 0 },
    range: 2,
    onAcquired: () => {
      andy.speak('');
      jerry.target = null;
      jerry.direction = 0;
      jerry.speak('Are you here to wrestle or act like an ass?', () => {
        jerry.element.classList.add(`jerry--headlock`, 'use-transition');
        textOverlay.innerHTML = 'Lawler is offering a free headlock, Press [e] to accept';
        textOverlay.classList.remove('text-overlay--hide');
        gameStatus = HEADLOCK_READY;
      });
    }
  });
}

async function handleHeadlock() {
  gameStatus = HEADLOCKING;

  andy.setTarget({
    position: {
      x: 0,
      y: 0
    },
    range: 2,
    onAcquired: async () => {
      // Get Andy into position and remove headlock instructions
      andy.target = null;
      andy.direction = 0;
      andy.element.classList.add(`andy--headlock`, 'use-transition');
      textOverlay.classList.add('text-overlay--hide');

      // Jerry give Andy a Suplex
      await wait(2000);
      andy.element.classList.remove('andy--headlock', 'use-transition');
      jerry.element.classList.remove('jerry--headlock', 'use-transition');
      scene.classList.add('scene--suplex');
      andy.element.classList.add('andy--suplex');
      jerry.element.classList.add('jerry--suplex');

      // Fades to black
      await wait(3000);
      backgroundOverlay.classList.remove('background-overlay--hide');

      // Clean up Suplex classes ready for the first Pile Driver
      await wait(1000);
      scene.classList.remove('scene--suplex');
      andy.element.classList.remove('andy--suplex');
      jerry.element.classList.remove('jerry--suplex');

      // Jerry gives Andy the first Pile Driver
      await wait(1000);
      scene.classList.add('scene--pile');
      andy.element.classList.add('andy--pile');
      jerry.element.classList.add('jerry--pile');
      backgroundOverlay.classList.add('background-overlay--hide');
      textOverlay.innerHTML =
        '[Commentary] "Only the second move by Lawler, and BANG goes Kaufman!"';
      textOverlay.classList.remove('text-overlay--hide');

      // Fades to black
      await wait(3500);
      backgroundOverlay.classList.remove('background-overlay--hide');
      textOverlay.classList.add('text-overlay--hide');

      // Clean up Pile Driver classes ready for second Pile Driver
      await wait(1000);
      scene.classList.remove('scene--pile');
      andy.element.classList.remove('andy--pile');
      jerry.element.classList.remove('jerry--pile');

      // Jerry gives Andy the second Pile Driver
      await wait(1000);
      scene.classList.add('scene--pile');
      andy.element.classList.add('andy--pile');
      jerry.element.classList.add('jerry--pile');
      backgroundOverlay.classList.add('background-overlay--hide');
      textOverlay.innerHTML =
        '[Commentary] "Lawler rolling Kaufman. He\'s gonna give it to him again. He figures he\'s already lost it...."';
      textOverlay.classList.remove('text-overlay--hide');

      // Fades to black
      await wait(3500);
      backgroundOverlay.classList.remove('background-overlay--hide');
      textOverlay.classList.add('text-overlay--hide');

      // Displays disqualification message
      await wait(2000);
      textOverlay.innerHTML =
        '[Announcer] "Jerry Lawler - 6 minutes and 50 seconds, with a pile driver, has been disqualified."';
      textOverlay.classList.remove('text-overlay--hide');

      // Fades to black
      await wait(3000);
      textOverlay.classList.add('text-overlay--hide');

      // Displays winner message
      await wait(1000);
      textOverlay.innerHTML = '[Announcer] "The winner, by disqualification - Andy Kaufman"';
      textOverlay.classList.remove('text-overlay--hide');

      // An unsolicited guest appears
      await wait(3000);
      guest.classList.add('guest--shown');
    }
  });
}

function animate() {
  if (gameStatus === WRESTLING) {
    if (rightKeyPressed) andy.direction += 2;

    if (leftKeyPressed) andy.direction -= 2;

    if (forwardKeyPressed && andy.speed < 60) {
      andy.setWalking(true);
      andy.speed += 2;
    }

    if (!forwardKeyPressed && andy.speed > 0) {
      andy.speed -= 2;
    }

    if (!forwardKeyPressed && andy.speed === 0) {
      andy.setWalking(false);
    }

    andy.updatePosition({
      x: andy.position.x + (andy.speed * Math.sin((andy.direction * Math.PI) / 180)) / 10,
      y: andy.position.y - (andy.speed * Math.cos((andy.direction * Math.PI) / 180)) / 10
    });
  }

  andy.update();

  jerry.update();

  window.requestAnimationFrame(animate);
}

animate();

bindEvents();
