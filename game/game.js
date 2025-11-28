const container = document.getElementById('relative');
container.style.height = `${window.innerHeight - 64}px`;

let position = 0;
let baseStep = 10;
let currentStep = 10;
let score = 0;
let lives = 3;
let isPaused = false;
let currentLanguage = localStorage.getItem('gameLanguage') || 'uk';
let gameStartTime = null;
let baseSpeed = 2;

const gameTranslations = {
  uk: {
    scoreLabel: 'Рахунок:',
    pauseBtn: 'Пауза',
    exitBtn: 'Вийти',
    pauseTitle: 'ПАУЗА',
    resumeBtn: 'Продовжити',
    homeBtn: 'На головну',
    gameOver: 'Гра закінчена! Ваш рахунок:'
  },
  en: {
    scoreLabel: 'Score:',
    pauseBtn: 'Pause',
    exitBtn: 'Exit',
    pauseTitle: 'PAUSE',
    resumeBtn: 'Resume',
    homeBtn: 'Home',
    gameOver: 'Game Over! Your Score:'
  },
  de: {
    scoreLabel: 'Punktzahl:',
    pauseBtn: 'Pause',
    exitBtn: 'Beenden',
    pauseTitle: 'PAUSE',
    resumeBtn: 'Fortsetzen',
    homeBtn: 'Startseite',
    gameOver: 'Spielende! Ihre Punktzahl:'
  },
  es: {
    scoreLabel: 'Puntuación:',
    pauseBtn: 'Pausa',
    exitBtn: 'Salir',
    pauseTitle: 'PAUSA',
    resumeBtn: 'Reanudar',
    homeBtn: 'Inicio',
    gameOver: '¡Fin del Juego! Tu Puntuación:'
  },
  pl: {
    scoreLabel: 'Wynik:',
    pauseBtn: 'Pauza',
    exitBtn: 'Wyjście',
    pauseTitle: 'PAUZA',
    resumeBtn: 'Wznów',
    homeBtn: 'Strona główna',
    gameOver: 'Koniec Gry! Twój Wynik:'
  }
};

function setGameLanguage(lang) {
  currentLanguage = lang;
  const t = gameTranslations[lang];
  document.getElementById('score').textContent = `${t.scoreLabel} ${score}`;
  document.getElementById('pauseBtn').textContent = t.pauseBtn;
  document.getElementById('exitBtn').textContent = t.exitBtn;
  document.getElementById('pauseTitle').textContent = t.pauseTitle;
  document.getElementById('resumeBtn').textContent = t.resumeBtn;
  document.getElementById('homeLink').textContent = t.homeBtn;
}

function updateHearts() {
  const hearts = document.querySelectorAll('.heart');
  hearts.forEach((heart, index) => {
    heart.style.opacity = index < lives ? '1' : '0.3';
  });
}

const box = document.createElement('img');
box.src = 'box.png';
box.classList.add('absolute');
box.style.width = '150px';
box.style.height = '150px';
box.style.bottom = '0px';
box.style.left = '0px';
container.appendChild(box);

const MOVEMENT_KEYS = ['a','A','ф','Ф','ArrowLeft','d','D','в','В','ArrowRight'];
const LEFT_KEYS = ['a','A','ф','Ф','ArrowLeft'];
const RIGHT_KEYS = ['d','D','в','В','ArrowRight'];
const keys = {};

document.addEventListener('keydown', (e) => {
  if (MOVEMENT_KEYS.includes(e.key)) keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  if (MOVEMENT_KEYS.includes(e.key)) keys[e.key] = false;
});

function updateBoxPosition() {
  currentStep = getBoxSpeed();
  const containerWidth = container.offsetWidth;
  const boxWidth = box.offsetWidth;
  
  if (LEFT_KEYS.some(key => keys[key])) position = Math.max(0, position - currentStep);
  if (RIGHT_KEYS.some(key => keys[key])) position = Math.min(containerWidth - boxWidth, position + currentStep);
  
  box.style.left = position + 'px';
}

function getBoxSpeed() {
  const elapsedTime = (Date.now() - gameStartTime) / 1000;
  return baseStep + Math.floor(elapsedTime / 10) * 5;
}

function isCollision(box, fruit) {
  const boxRect = box.getBoundingClientRect();
  const fruitRect = fruit.getBoundingClientRect();
  return !(
    boxRect.top > fruitRect.bottom ||
    boxRect.bottom < fruitRect.top ||
    boxRect.left > fruitRect.right ||
    boxRect.right < fruitRect.left
  );
}

function createFruit() {
  const fruit = document.createElement('img');
  fruit.src = 'apple.png';
  fruit.classList.add('absolute');
  fruit.style.width = '100px';
  fruit.style.height = '100px';
  fruit.style.top = '0px';
  fruit.style.left = Math.random() * (container.offsetWidth - 100) + 'px';
  container.appendChild(fruit);

  let fruitY = 0;

  function getSpeed() {
    const elapsedTime = (Date.now() - gameStartTime) / 1000;
    return baseSpeed + Math.floor(elapsedTime / 5) * 0.5;
  }

  function fall() {
    if (isPaused) return requestAnimationFrame(fall);
    
    fruitY += getSpeed();
    fruit.style.top = fruitY + 'px';

    if (fruitY > container.offsetHeight - fruit.offsetHeight) {
      fruit.remove();
      lives--;
      updateHearts();
      if (lives <= 0) {
        alert(`${gameTranslations[currentLanguage].gameOver} ${score}`);
        location.reload();
      }
    } else if (isCollision(box, fruit)) {
      fruit.remove();
      score++;
      document.getElementById('score').textContent = `${gameTranslations[currentLanguage].scoreLabel} ${score}`;
    } else {
      requestAnimationFrame(fall);
    }
  }

  fall();
}

let lastFruitTime = 0;
let fruitCreationInterval = 3000;

function updateFruitCreationRate() {
  const secondsElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
  fruitCreationInterval = Math.max(500, 3000 - Math.floor(secondsElapsed / 5) * 100);
}

function gameLoop() {
  updateBoxPosition();
  const currentTime = Date.now();
  if (!isPaused && currentTime - lastFruitTime >= fruitCreationInterval) {
    updateFruitCreationRate();
    createFruit();
    lastFruitTime = currentTime;
  }
  requestAnimationFrame(gameLoop);
}

// Initialize game
gameStartTime = Date.now();
lastFruitTime = Date.now();
gameLoop();

document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = true;
  document.getElementById('pauseMenu').showModal();
});

document.getElementById('resumeBtn').addEventListener('click', () => {
  isPaused = false;
  document.getElementById('pauseMenu').close();
});

setGameLanguage(currentLanguage);
