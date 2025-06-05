const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 6;

// Ball settings
const BALL_SIZE = 15;
const BALL_SPEED = 6;

// Score
let playerScore = 0;
let computerScore = 0;

// Paddle objects
const player = {
  x: 10,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dy: 0
};

const computer = {
  x: WIDTH - PADDLE_WIDTH - 10,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dy: 0
};

// Ball object
const ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  size: BALL_SIZE,
  dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  dy: BALL_SPEED * (Math.random() * 2 - 1)
};

// Draw functions
function drawRect(x, y, w, h, color = '#fff') {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = '#fff') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  for (let i = 0; i < HEIGHT; i += 30) {
    drawRect(WIDTH / 2 - 1, i, 2, 20, '#aaa');
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawNet();
  drawRect(player.x, player.y, player.width, player.height);
  drawRect(computer.x, computer.y, computer.width, computer.height);
  drawCircle(ball.x, ball.y, ball.size / 2);
}

// Update game objects
function update() {
  // Move player
  player.y += player.dy;
  // Clamp player paddle
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > HEIGHT) player.y = HEIGHT - player.height;

  // Move computer paddle (simple AI)
  if (ball.y < computer.y + computer.height / 2) {
    computer.dy = -PADDLE_SPEED * 0.7;
  } else if (ball.y > computer.y + computer.height / 2) {
    computer.dy = PADDLE_SPEED * 0.7;
  } else {
    computer.dy = 0;
  }
  computer.y += computer.dy;
  // Clamp computer paddle
  if (computer.y < 0) computer.y = 0;
  if (computer.y + computer.height > HEIGHT) computer.y = HEIGHT - computer.height;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Collision with top/bottom
  if (ball.y < ball.size / 2 || ball.y > HEIGHT - ball.size / 2) {
    ball.dy = -ball.dy;
    ball.y = ball.y < ball.size / 2 ? ball.size / 2 : HEIGHT - ball.size / 2;
  }

  // Collision with paddles
  // Player paddle
  if (
    ball.x - ball.size / 2 < player.x + player.width &&
    ball.x - ball.size / 2 > player.x &&
    ball.y > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.dx = Math.abs(ball.dx);
    // Add some "spin" depending on where the ball hits the paddle
    const relativeIntersectY = (player.y + player.height / 2) - ball.y;
    ball.dy = -relativeIntersectY * 0.2;
  }

  // Computer paddle
  if (
    ball.x + ball.size / 2 > computer.x &&
    ball.x + ball.size / 2 < computer.x + computer.width &&
    ball.y > computer.y &&
    ball.y < computer.y + computer.height
  ) {
    ball.dx = -Math.abs(ball.dx);
    // Add some "spin"
    const relativeIntersectY = (computer.y + computer.height / 2) - ball.y;
    ball.dy = -relativeIntersectY * 0.2;
  }

  // Score
  if (ball.x < 0) {
    computerScore++;
    updateScore();
    resetBall(-1);
  } else if (ball.x > WIDTH) {
    playerScore++;
    updateScore();
    resetBall(1);
  }
}

function resetBall(direction) {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.dx = direction * BALL_SPEED;
  ball.dy = BALL_SPEED * (Math.random() * 2 - 1);
}

function updateScore() {
  document.getElementById('player-score').textContent = playerScore;
  document.getElementById('computer-score').textContent = computerScore;
}

// Animation loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  player.y = mouseY - player.height / 2;
  // Clamp
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > HEIGHT) player.y = HEIGHT - player.height;
});

// Arrow key movement for player paddle
window.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowUp') {
    player.dy = -PADDLE_SPEED;
  } else if (e.key === 'ArrowDown') {
    player.dy = PADDLE_SPEED;
  }
});
window.addEventListener('keyup', function (e) {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    player.dy = 0;
  }
});

// Start the game
loop();