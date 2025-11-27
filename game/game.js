const container = document.getElementById('relative');
container.style.height = `${window.innerHeight - 64}px`;

let position = 0;
const step = 20;
let score = 0;

const box = document.createElement('img');
box.src = '/game/box.png';
box.classList.add('absolute');
box.style.width = '150px';
box.style.height = '150px';
box.style.bottom = '0px';
box.style.left = '0px';
container.appendChild(box);

document.addEventListener('keydown', (e) => {
  if (['a','A','ф','Ф','ArrowLeft'].includes(e.key)) {
    position = Math.max(0, position - step);
  } else if (['d','D','в','В','ArrowRight'].includes(e.key)) {
    const containerWidth = container.offsetWidth;
    const boxWidth = box.offsetWidth;
    position = Math.min(containerWidth - boxWidth, position + step);
  }
  box.style.left = position + 'px';
});

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
  fruit.src = '/game/apple.png';
  fruit.classList.add('absolute');
  fruit.style.width = '100px';
  fruit.style.height = '100px';
  fruit.style.top = '0px';
  fruit.style.left = Math.random() * (container.offsetWidth - 64) + 'px';
  container.appendChild(fruit);

  let fruitY = 0;
  const speed = 2;

  function fall() {
    fruitY += speed;
    fruit.style.top = fruitY + 'px';

    if (fruitY > container.offsetHeight - fruit.offsetHeight) {
      fruit.remove();
    } else if (isCollision(box, fruit)) {
      fruit.remove();
      score++;
      document.getElementById('score').textContent = `Record: ${score}`;
    } else {
      requestAnimationFrame(fall);
    }
  }

  fall();
}

setInterval(createFruit, 3000);
