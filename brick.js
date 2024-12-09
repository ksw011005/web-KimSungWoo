window.onload = function () {
  // 볼륨 설정
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

  // 캔버스와 컨텍스트 설정
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // 공과 패들, 벽돌의 초기 설정
  const ballRadius = 5;
  let paddleX, rightPressed, leftPressed, score;
  const paddleHeight = 10;
  const paddleWidth = 150;
  const brickRowCount = 20; // 블록 행 수
  const brickColumnCount = 11; // 블록 열 수
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;
  let bricks = [];

  // 아이템 변수
  let items = [];
  const itemRadius = 10;
  const itemDropRate = 0.3; // 아이템이 나올 확률 (30%)

  // 공 변수
  let balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: 3, dy: -3 }];

  //강철 블록
  let specialBricks = [];
  const specialBrickCount = 30; // 강철 블록의 개수를 20개로 증가
  const specialBricksBelowCount = 8; // 아래쪽에 위치할 특별한 블록 개수

  // 게임 초기화 함수
  function init() {
    balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2 }];
    paddleX = (canvas.width - paddleWidth) / 2;
    rightPressed = false;
    leftPressed = false;
    score = 0;
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    items = [];
    initSpecialBricks(); // 특별한 블록 초기화
  }

  // 키보드 이벤트 리스너 추가
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  // 키가 눌렸을 때 호출되는 함수
  function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
    }
  }

  // 키가 떼어졌을 때 호출되는 함수
  function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
  }

  // 공과 벽돌의 충돌 감지 함수
  function collisionDetection() {
    let remainingBricks = 0; // 남은 블록 수를 세기 위한 변수

    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status == 1) {
          remainingBricks++; // 남은 블록 수 증가
          for (let i = 0; i < balls.length; i++) {
            let ball = balls[i];
            if (
              ball.x > b.x &&
              ball.x < b.x + brickWidth &&
              ball.y > b.y &&
              ball.y < b.y + brickHeight
            ) {
              ball.dy = -ball.dy;
              b.status = 0;
              score++;
              createItem(b.x + brickWidth / 2, b.y + brickHeight / 2); // 아이템 생성
            }
          }
        }
      }
    }

    // 남은 블록이 강철 블록만 남아있는지 확인
    if (remainingBricks === specialBrickCount) {
      alert("YOU WIN, CONGRATULATIONS!");
      init();
    }
  }

  //강철 블록 관련 함수/////////////////////////////////////////////

  //강철 블록 초기화 함수
  // 강철 블록 초기화 함수
  function initSpecialBricks() {
    specialBricks = [];
    const brickBottomY =
      brickOffsetTop +
      (brickRowCount - 1) * (brickHeight + brickPadding) +
      brickHeight;

    for (let i = 0; i < specialBricksBelowCount; i++) {
      let x, y;
      let overlap;
      do {
        overlap = false;
        x = Math.random() * (canvas.width - brickWidth);
        y = brickBottomY + brickHeight + brickPadding; // y값을 한 칸 아래로 고정

        // 겹치는지 확인
        for (let j = 0; j < specialBricks.length; j++) {
          if (
            x < specialBricks[j].x + brickWidth &&
            x + brickWidth > specialBricks[j].x &&
            y < specialBricks[j].y + brickHeight &&
            y + brickHeight > specialBricks[j].y
          ) {
            overlap = true;
            break;
          }
        }
      } while (overlap);

      specialBricks.push({ x: x, y: y, status: 1 });
    }
    // 나머지 특별한 블록 생성
    for (let i = specialBricksBelowCount; i < specialBrickCount; i++) {
      let x, y;
      let overlap;
      do {
        overlap = false;
        x = Math.random() * (canvas.width - brickWidth);
        y = Math.random() * (brickBottomY - brickHeight);

        // 겹치는지 확인
        for (let j = 0; j < specialBricks.length; j++) {
          if (
            x < specialBricks[j].x + brickWidth &&
            x + brickWidth > specialBricks[j].x &&
            y < specialBricks[j].y + brickHeight &&
            y + brickHeight > specialBricks[j].y
          ) {
            overlap = true;
            break;
          }
        }
      } while (overlap);

      specialBricks.push({ x: x, y: y, status: 1 });
    }
  }

  //강철 블록 그리기
  function drawSpecialBricks() {
    for (let i = 0; i < specialBricks.length; i++) {
      if (specialBricks[i].status == 1) {
        ctx.beginPath();
        ctx.rect(
          specialBricks[i].x,
          specialBricks[i].y,
          brickWidth,
          brickHeight
        );
        ctx.fillStyle = "#A9A9A9"; // 특별한 블록의 색상
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  // 강철 블록과 충돌 감지 함수
  function specialBrickCollisionDetection() {
    for (let i = 0; i < specialBricks.length; i++) {
      if (specialBricks[i].status == 1) {
        for (let j = 0; j < balls.length; j++) {
          let ball = balls[j];
          if (
            ball.x + ballRadius > specialBricks[i].x &&
            ball.x - ballRadius < specialBricks[i].x + brickWidth &&
            ball.y + ballRadius > specialBricks[i].y &&
            ball.y - ballRadius < specialBricks[i].y + brickHeight
          ) {
            // 공과 블록의 충돌 면을 검사합니다
            let collideLeft = ball.x - ballRadius < specialBricks[i].x;
            let collideRight =
              ball.x + ballRadius > specialBricks[i].x + brickWidth;
            let collideTop = ball.y - ballRadius < specialBricks[i].y;
            let collideBottom =
              ball.y + ballRadius > specialBricks[i].y + brickHeight;

            if (collideLeft || collideRight) {
              ball.dx = -ball.dx; // 좌우 충돌 시 x 방향 반전
              // 공이 블록 내부로 들어가지 않도록 위치 조정
              if (collideLeft) ball.x = specialBricks[i].x - ballRadius;
              if (collideRight)
                ball.x = specialBricks[i].x + brickWidth + ballRadius;
            } else if (collideTop || collideBottom) {
              ball.dy = -ball.dy; // 상하 충돌 시 y 방향 반전
              // 공이 블록 내부로 들어가지 않도록 위치 조정
              if (collideTop) ball.y = specialBricks[i].y - ballRadius;
              if (collideBottom)
                ball.y = specialBricks[i].y + brickHeight + ballRadius;
            }
          }
        }
      }
    }
  }

  //////////////////////////////////////////////////////////

  //아이템 관련 함수///////////////////////////////////////////

  //아이템과 패들의 충돌 감지 함수
  function itemCollisionDetection() {
    const paddleCollisionWidth = paddleWidth / 2; // 패드의 중앙 부분만 충돌 감지
    const paddleCollisionX = paddleX + paddleWidth / 4; // 중앙 부분의 시작 위치

    for (let i = 0; i < items.length; i++) {
      if (items[i].status == 1) {
        if (
          items[i].y + itemRadius > canvas.height - paddleHeight &&
          items[i].x > paddleCollisionX &&
          items[i].x < paddleCollisionX + paddleCollisionWidth
        ) {
          items[i].status = 0;
          if (items[i].type === "speed") {
            for (let j = 0; j < balls.length; j++) {
              balls[j].dx *= 2;
              balls[j].dy *= 2;
            }
          } else if (items[i].type === "duplicate") {
            let newBalls = [];
            for (let j = 0; j < balls.length; j++) {
              newBalls.push({
                x: balls[j].x,
                y: balls[j].y,
                dx: balls[j].dx,
                dy: balls[j].dy,
              });
              newBalls.push({
                x: balls[j].x,
                y: balls[j].y,
                dx: -balls[j].dx,
                dy: balls[j].dy,
              });
            }
            balls = newBalls;
          }
        } else if (items[i].y + itemRadius > canvas.height) {
          items[i].status = 0;
        }
      }
    }
  }

  // 아이템 생성 함수
  function createItem(x, y) {
    if (Math.random() < itemDropRate) {
      items.push({
        x: x,
        y: y,
        status: 1,
        type: Math.random() < 0.5 ? "speed" : "duplicate",
      });
    }
  }

  //아이템 그리기 함수
  function drawItems() {
    for (let i = 0; i < items.length; i++) {
      if (items[i].status == 1) {
        ctx.beginPath();
        ctx.arc(items[i].x, items[i].y, itemRadius, 0, Math.PI * 2);
        ctx.fillStyle = items[i].type === "speed" ? "#FF0000" : "#00FF00"; // 아이템 타입에 따라 색상 변경
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  //블록 충돌 시 아이템 생성 호출
  function collisionDetection() {
    let remainingBricks = 0; // 남은 블록 수를 세기 위한 변수

    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status == 1) {
          remainingBricks++; // 남은 블록 수 증가
          for (let i = 0; i < balls.length; i++) {
            let ball = balls[i];
            if (
              ball.x > b.x &&
              ball.x < b.x + brickWidth &&
              ball.y > b.y &&
              ball.y < b.y + brickHeight
            ) {
              ball.dy = -ball.dy;
              b.status = 0;
              score++;
              createItem(b.x + brickWidth / 2, b.y + brickHeight / 2); // 아이템 생성
            }
          }
        }
      }
    }

    // 남은 블록이 강철 블록만 남아있는지 확인
    if (remainingBricks === specialBrickCount) {
      alert("YOU WIN, CONGRATULATIONS!");
      init(); // 게임 초기화
    }
  }

  //아이템의 위치 업데이트
  function updateItems() {
    for (let i = 0; i < items.length; i++) {
      if (items[i].status == 1) {
        items[i].y += 5; // 아이템이 떨어지는 속도
      }
    }
  }

  ////////////////////////////////////////////////////////////////////

  // 공 그리기 함수
  function drawBalls() {
    for (let i = 0; i < balls.length; i++) {
      ctx.beginPath();
      ctx.arc(balls[i].x, balls[i].y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.closePath();
    }
  }

  //공 업데이트 함수
  function updateBalls() {
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i];
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (
        ball.x + ball.dx > canvas.width - ballRadius ||
        ball.x + ball.dx < ballRadius
      ) {
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.dy < ballRadius) {
        ball.dy = -ball.dy;
      } else if (ball.y + ball.dy > canvas.height - ballRadius) {
        if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
          ball.dy = -ball.dy;
        } else {
          balls.splice(i, 1);
          i--;
        }
      }
    }

    if (balls.length === 0) {
      if (
        confirm("Game Over! Score: " + score + "\nDo you want to restart?") ===
        true
      ) {
        init();
      } else {
        ball.dx = 0;
        ball.dy = 0;
        return;
      }
    }
  }

  // 패들 그리기 함수
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  // 벽돌 그리기 함수
  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#8B2D2B";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  // 점수 표시 함수
  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
  }

  // 게임 루프 함수
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawSpecialBricks(); // 특별한 블록 그리기
    drawBalls(); // 모든 공 그리기
    drawPaddle();
    drawScore();
    drawItems(); // 아이템 그리기
    collisionDetection();
    specialBrickCollisionDetection(); // 특별한 블록과의 충돌 감지
    itemCollisionDetection(); // 아이템과 패들의 충돌 감지
    updateItems(); // 아이템 위치 업데이트
    updateBalls(); // 모든 공 위치 업데이트

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    requestAnimationFrame(draw);
  }

  init();
  draw();
};
