const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const inputElement = document.getElementById("inputWord");

let trex = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  dy: 0,
  gravity: 0.6,
  jumpPower: -10,
  grounded: false,
};

let obstacles = [];
let frame = 0;
let score = 0;
let currentWord = "";
let words = [];
let gameOver = false;

// 파일에서 단어를 읽어오는 함수
function loadWords() {
  fetch("english.txt")
    .then((response) => response.text())
    .then((text) => {
      words = text
        .split("\n")
        .map((word) => word.trim())
        .filter((word) => word.length > 0);
      console.log("Words loaded:", words);
      currentWord = getRandomWord(); // 첫 단어 설정
    })
    .catch((error) => console.error("Error loading words:", error));
}

function getRandomWord() {
  let filteredWords;
  if (score < 10) {
    filteredWords = words.filter((word) => word.length < 6);
  } else {
    filteredWords = words;
  }
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

function resetGame() {
  trex = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    dy: 0,
    gravity: 0.6,
    jumpPower: -10,
    grounded: false,
  };
  obstacles = [];
  frame = 0;
  score = 0;
  currentWord = getRandomWord();
  gameOver = false;
  inputElement.value = "";
}

let obstacleSpeed = 5 + Math.floor(score / 10); // 점수에 따라 초기 속도 설정

function update() {
  if (gameOver) return;

  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // T-Rex
  trex.dy += trex.gravity;
  trex.y += trex.dy;
  if (trex.y + trex.height > canvas.height) {
    trex.y = canvas.height - trex.height;
    trex.dy = 0;
    trex.grounded = true;
  } else {
    trex.grounded = false;
  }
  ctx.fillRect(trex.x, trex.y, trex.width, trex.height);

  // Obstacles
  if (frame % 100 === 0) {
    const isLowObstacle = Math.random() < 0.7; // 70% 확률로 낮은 장애물 생성
    const isGreenObstacle = Math.random() < 0.2; // 20% 확률로 초록색 장애물 생성
    obstacles.push({
      x: canvas.width,
      y: isLowObstacle ? canvas.height - 20 : canvas.height - 60, // 낮은 장애물 또는 높은 장애물
      width: 20,
      height: 20,
      color: isGreenObstacle ? "green" : "red", // 초록색 또는 빨간색 장애물
    });
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.x -= obstacleSpeed;
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
      score++;
      if (obstacle.color !== "green") {
        obstacleSpeed = 5 + Math.floor(score / 10); // 점수에 따라 속도 증가
      }
    }
    if (
      trex.x < obstacle.x + obstacle.width &&
      trex.x + trex.width > obstacle.x &&
      trex.y < obstacle.y + obstacle.height &&
      trex.y + trex.height > obstacle.y
    ) {
      if (obstacle.color === "green") {
        obstacleSpeed = Math.max(2, obstacleSpeed - 3); // 속도 감소, 최소 속도 2
      } else {
        gameOver = true;
        if (
          confirm("Game Over! Score: " + score + "\nDo you want to restart?")
        ) {
          resetGame();
        }
      }
    }
  });

  // Score and Speed Display
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Speed: " + obstacleSpeed, 10, 50); // 속도 표시

  // Display current word
  if (currentWord) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(
      currentWord,
      canvas.width / 2 - ctx.measureText(currentWord).width / 2,
      canvas.height / 2
    );
  }

  requestAnimationFrame(update);
}

inputElement.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    if (inputElement.value === currentWord) {
      trex.dy = trex.jumpPower;
      currentWord = getRandomWord(); // 새로운 단어 설정
      inputElement.value = "";
    }
  }
});

window.onload = () => {
  inputElement.focus(); // 페이지 로드 시 입력창에 포커스 설정
};

console.log("Game started");
loadWords();
update();
