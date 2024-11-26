const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  width: 10,
  height: 10,
  x: canvas.width / 2 - 15,
  y: canvas.height / 2 - 15,
  speed: 5,
  dx: 0,
  dy: 0,
};

const arrows = [];
const arrowImage = new Image();
arrowImage.src = "arrow.png";

let startTime;
let elapsedTime = 0;

function drawPlayer() {
  ctx.fillStyle = "black";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawArrow(arrow) {
  ctx.save();
  ctx.translate(arrow.x + arrow.width / 2, arrow.y + arrow.height / 2);

  switch (arrow.direction) {
    case "down":
      ctx.rotate(Math.PI);
      break;
    case "up":
      ctx.rotate(0);
      break;
    case "left":
      ctx.rotate(-Math.PI / 2);
      break;
    case "right":
      ctx.rotate(Math.PI / 2);
      break;
    case "down-right":
      ctx.rotate((3 * Math.PI) / 4);
      break;
    case "down-left":
      ctx.rotate(-(3 * Math.PI) / 4);
      break;
    case "up-right":
      ctx.rotate(Math.PI / 4);
      break;
    case "up-left":
      ctx.rotate(-Math.PI / 4);
      break;
  }

  ctx.drawImage(
    arrowImage,
    -arrow.width / 2,
    -arrow.height / 2,
    arrow.width,
    arrow.height
  );
  ctx.restore();
}

function drawTime() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Time: ${elapsedTime.toFixed(1)}s`, 10, 30);
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
  player.x += player.dx;
  player.y += player.dy;

  // Detect walls
  if (player.x < 0) {
    player.x = 0;
  }

  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  if (player.y < 0) {
    player.y = 0;
  }

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
  }
}

function moveArrows() {
  arrows.forEach((arrow, index) => {
    switch (arrow.direction) {
      case "down":
        arrow.y += arrow.speed;
        if (arrow.y > canvas.height) {
          arrows.splice(index, 1);
        }
        break;
      case "up":
        arrow.y -= arrow.speed;
        if (arrow.y < -arrow.height) {
          arrows.splice(index, 1);
        }
        break;
      case "left":
        arrow.x -= arrow.speed;
        if (arrow.x < -arrow.width) {
          arrows.splice(index, 1);
        }
        break;
      case "right":
        arrow.x += arrow.speed;
        if (arrow.x > canvas.width) {
          arrows.splice(index, 1);
        }
        break;
    }
  });
}

function spawnArrows() {
  const directions = ["down", "up", "left", "right"];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const arrowCount = 20; // 한 번에 생성할 화살의 개수
  const spacing = 30; // 화살 간격

  for (let i = 0; i < arrowCount; i++) {
    let arrow = {
      width: 10,
      height: 15,
      x: 0,
      y: 0,
      speed: 3,
      direction: direction,
    };

    switch (direction) {
      case "down":
        arrow.x =
          Math.random() *
          (canvas.width - arrow.width - (arrowCount - 1) * spacing);
        arrow.y = -arrow.height;
        arrow.x += i * spacing;
        break;
      case "up":
        arrow.x =
          Math.random() *
          (canvas.width - arrow.width - (arrowCount - 1) * spacing);
        arrow.y = canvas.height;
        arrow.x += i * spacing;
        break;
      case "left":
        arrow.x = canvas.width;
        arrow.y =
          Math.random() *
          (canvas.height - arrow.height - (arrowCount - 1) * spacing);
        arrow.y += i * spacing;
        break;
      case "right":
        arrow.x = -arrow.width;
        arrow.y =
          Math.random() *
          (canvas.height - arrow.height - (arrowCount - 1) * spacing);
        arrow.y += i * spacing;
        break;
    }

    arrows.push(arrow);
  }
}

//////////대각선 화살//////////
function spawnDiagonalArrows() {
  const directions = ["down-right", "down-left", "up-right", "up-left"];
  const arrowCount = 25; // 한 번에 생성할 화살의 개수
  const spacing = 20; // 화살 간격

  for (let i = 0; i < arrowCount; i++) {
    let arrow = {
      width: 10,
      height: 15,
      x: 0,
      y: 0,
      speed: 3,
      direction: "",
    };

    const startCorner =
      directions[Math.floor(Math.random() * directions.length)];

    switch (startCorner) {
      case "down-right":
        arrow.x = 0; // 왼쪽 벽에서 시작
        arrow.y = canvas.height - arrow.height - i * spacing;
        arrow.direction = "down-right";
        break;
      case "down-left":
        arrow.x = canvas.width - arrow.width; // 오른쪽 벽에서 시작
        arrow.y = canvas.height - arrow.height - i * spacing;
        arrow.direction = "down-left";
        break;
      case "up-right":
        arrow.x = 0; // 왼쪽 벽에서 시작
        arrow.y = arrow.height + i * spacing;
        arrow.direction = "up-right";
        break;
      case "up-left":
        arrow.x = canvas.width - arrow.width; // 오른쪽 벽에서 시작
        arrow.y = arrow.height + i * spacing;
        arrow.direction = "up-left";
        break;
    }
    arrows.push(arrow);
  }
}

function moveDiagonalArrows() {
  arrows.forEach((arrow, index) => {
    switch (arrow.direction) {
      case "down-right":
        arrow.x += arrow.speed;
        arrow.y += arrow.speed;
        if (arrow.y > canvas.height || arrow.x > canvas.width) {
          arrows.splice(index, 1);
        }
        break;
      case "down-left":
        arrow.x -= arrow.speed;
        arrow.y += arrow.speed;
        if (arrow.y > canvas.height || arrow.x < -arrow.width) {
          arrows.splice(index, 1);
        }
        break;
      case "up-right":
        arrow.x += arrow.speed;
        arrow.y -= arrow.speed;
        if (arrow.y < -arrow.height || arrow.x > canvas.width) {
          arrows.splice(index, 1);
        }
        break;
      case "up-left":
        arrow.x -= arrow.speed;
        arrow.y -= arrow.speed;
        if (arrow.y < -arrow.height || arrow.x < -arrow.width) {
          arrows.splice(index, 1);
        }
        break;
    }
  });
}
////////////////////////////////

///////////무작위 화살//////////
function spawnRandomArrow() {
  const directions = ["down-right", "down-left", "up-right", "up-left"];
  let arrow = {
    width: 10,
    height: 15,
    x: 0,
    y: 0,
    speed: 2,
    direction: directions[Math.floor(Math.random() * directions.length)], // 무작위 방향 설정
  };

  switch (arrow.direction) {
    case "down-right":
      arrow.x = 0; // 왼쪽 벽에서 시작
      arrow.y = Math.random() * (canvas.height - arrow.height);
      break;
    case "down-left":
      arrow.x = canvas.width - arrow.width; // 오른쪽 벽에서 시작
      arrow.y = Math.random() * (canvas.height - arrow.height);
      break;
    case "up-right":
      arrow.x = 0; // 왼쪽 벽에서 시작
      arrow.y = Math.random() * (canvas.height - arrow.height);
      break;
    case "up-left":
      arrow.x = canvas.width - arrow.width; // 오른쪽 벽에서 시작
      arrow.y = Math.random() * (canvas.height - arrow.height);
      break;
  }

  arrows.push(arrow);
}
//////////////////

function detectCollision() {
  const collisionThreshold = 5; // 충돌 감지 범위 조정

  arrows.forEach((arrow) => {
    if (
      player.x < arrow.x + arrow.width - collisionThreshold &&
      player.x + player.width > arrow.x + collisionThreshold &&
      player.y < arrow.y + arrow.height - collisionThreshold &&
      player.y + player.height > arrow.y + collisionThreshold
    ) {
      resetGame();
    }
  });
}

function resetGame() {
  if (confirm("Game Over! 다시 시작하시겠습니까?")) {
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height / 2 - player.height / 2;
    player.dx = 0;
    player.dy = 0;
    arrows.length = 0;
    startTime = Date.now();
  } else {
    running = false;
  }
}

function update() {
  clear();
  drawPlayer();
  arrows.forEach(drawArrow);
  newPos();
  moveArrows();
  moveDiagonalArrows(); // 대각선 화살 이동 추가
  detectCollision();

  elapsedTime = (Date.now() - startTime) / 1000;
  drawTime();

  if (running) {
    requestAnimationFrame(update);
  }
}

function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    player.dx = player.speed;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    player.dx = -player.speed;
  } else if (e.key === "ArrowUp" || e.key === "Up") {
    player.dy = -player.speed;
  } else if (e.key === "ArrowDown" || e.key === "Down") {
    player.dy = player.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "ArrowRight" ||
    e.key === "Right" ||
    e.key === "ArrowLeft" ||
    e.key === "Left"
  ) {
    player.dx = 0;
  }
  if (
    e.key === "ArrowUp" ||
    e.key === "Up" ||
    e.key === "ArrowDown" ||
    e.key === "Down"
  ) {
    player.dy = 0;
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

let running = true;
startTime = Date.now();
setInterval(spawnArrows, 3000); // 5초마다 동서남북 화살 생성
setInterval(spawnDiagonalArrows, 5000); // 5초마다 대각선 화살 생성
setInterval(spawnRandomArrow, 200);
update();
