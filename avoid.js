const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("audio");
const muteButton = document.getElementById("mute");
const volumeControl = document.getElementById("volume");
muteButton.style.backgroundImage = "url('yes_sound.jpg')";

// 로컬 스토리지에서 음소거 상태를 가져오기
const isMuted = localStorage.getItem("isMuted") === "true";
audio.muted = isMuted;
muteButton.style.backgroundImage = isMuted
  ? "url('no_sound.jpg')"
  : "url('yes_sound.jpg')";

muteButton.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteButton.style.backgroundImage = audio.muted
    ? "url('no_sound.jpg')"
    : "url('yes_sound.jpg')";
  // 음소거 상태를 로컬 스토리지에 저장
  localStorage.setItem("isMuted", audio.muted);
});

volumeControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

audio.volume = volumeControl.value;

document.addEventListener("keydown", (event) => {
  if (
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  ) {
    if (audio.paused) {
      audio.play();
    }
  }
});

const player = {
  width: 7,
  height: 7,
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
      speed: 2,
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
      speed: 2,
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
    speed: 1,
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
//////////////////////////////////////////

///////////////순위/////////////////////////
// 로컬 스토리지에서 기존 기록 불러오기
function getLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  return leaderboard;
}
function getAllRecords() {
  return JSON.parse(localStorage.getItem("allRecords")) || [];
}

// 새로운 기록을 leaderboard에 추가하고 로컬 스토리지에 저장
function updateLeaderboard(time) {
  const leaderboard = getLeaderboard();

  // 새 기록 추가
  leaderboard.push(time);

  // 시간을 기준으로 내림차순 정렬
  leaderboard.sort((a, b) => b - a);

  // 최고 10개의 기록만 저장
  if (leaderboard.length > 10) {
    leaderboard.pop();
  }

  // 로컬 스토리지에 저장
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// 순위 화면을 표시
function displayLeaderboard() {
  const leaderboard = getLeaderboard();
  const rankDiv = document.getElementById("rank");
  rankDiv.innerHTML = "<h3>Leaderboard</h3>"; // 순위 제목 추가

  leaderboard.forEach((time, index) => {
    const rankItem = document.createElement("div");
    rankItem.textContent = `#${index + 1}: ${time.toFixed(1)}s`;
    rankDiv.appendChild(rankItem);
  });

  // Create the graph
  drawGraph(getAllRecords());
}

window.onload = function () {
  displayLeaderboard();
  drawGraph(getAllRecords()); // 페이지 로드 시 그래프를 그리도록 추가
};

window.onbeforeunload = function () {
  // 게임이 끝난 후 시간이 있을 경우 기록을 저장
  if (elapsedTime > 0) {
    updateLeaderboard(elapsedTime);
    updateAllRecords(elapsedTime);
  }
};

function updateAllRecords(time) {
  const allRecords = getAllRecords();
  allRecords.push(time);
  localStorage.setItem("allRecords", JSON.stringify(allRecords));
}

function drawGraph(data) {
  const canvas = document.getElementById("leaderboardChart");
  const ctx = canvas.getContext("2d");

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set graph properties
  const padding = 40;
  const graphWidth = canvas.width - padding * 2;
  const graphHeight = canvas.height - padding * 2;
  const maxTime = 60; // 60초까지
  const stepSize = 5; // 5초 단위로 나누기

  // Increase canvas height to avoid overlapping y-axis labels
  canvas.height = 400; // 높이를 줄여서 막대 그래프 칸 사이를 좁힘

  // Draw axes
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  // Draw y-axis labels and grid lines
  for (let i = 0; i <= 20; i++) {
    const y = canvas.height - padding - (i / 20) * graphHeight;
    ctx.fillText(i, padding - 30, y + 5);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.strokeStyle = "#e0e0e0";
    ctx.stroke();
  }

  // Draw x-axis labels
  for (let i = 0; i <= maxTime; i += stepSize) {
    const x = padding + (i / maxTime) * graphWidth;
    ctx.fillText(i, x - 10, canvas.height - padding + 20);
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, canvas.height - padding);
    ctx.strokeStyle = "#e0e0e0";
    ctx.stroke();
  }

  // Draw the bar graph
  const counts = new Array(maxTime / stepSize).fill(0);
  data.forEach((time) => {
    if (time >= 1 && time <= 60) {
      counts[Math.floor((time - 1) / stepSize)]++;
    }
  });

  counts.forEach((count, index) => {
    const x =
      padding + ((index * stepSize + stepSize / 2) / maxTime) * graphWidth;
    const y =
      canvas.height - padding - (Math.min(count, 20) / 20) * graphHeight;
    const barHeight = canvas.height - padding - y;
    ctx.fillStyle = "rgba(75, 192, 192, 1)";
    ctx.fillRect(x - 10, y, 20, barHeight);
  });
}

///////////////////////////////////////////

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
  // 시간을 기록하고 순위를 업데이트
  updateLeaderboard(elapsedTime);
  updateAllRecords(elapsedTime);

  // 순위 화면 표시 및 그래프 갱신
  displayLeaderboard();

  if (confirm("Game Over! 다시 시작하시겠습니까?")) {
    // 게임 초기화
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

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      event.preventDefault();
      moveCharacter(event.key); // Call your game movement function
      break;
  }
});

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

let running = true;
startTime = Date.now();
setInterval(spawnArrows, 3000); // 5초마다 동서남북 화살 생성
setInterval(spawnDiagonalArrows, 5000); // 5초마다 대각선 화살 생성
setInterval(spawnRandomArrow, 100);
update();
