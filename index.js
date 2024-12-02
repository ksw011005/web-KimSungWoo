const overlay = document.getElementById("overlay");
const Button = document.getElementById("button");
const audio = document.getElementById("audio");
const muteButton = document.getElementById("mute");
const volumeControl = document.getElementById("volume");
muteButton.style.backgroundImage = "url('yes_sound.jpg')";

const videos = document.querySelectorAll("Video");
let mute;

videos.forEach((video) => {
  video.addEventListener("mouseover", () => {
    const playPromise = video.play();
    mute = audio.muted;
    muteButton.style.backgroundImage = "url('no_sound.jpg')";
    audio.muted = true;

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // 비디오 재생이 시작됨
        })
        .catch((error) => {
          console.error("비디오 재생 실패:", error);
        });
    }
  });

  video.addEventListener("mouseout", () => {
    video.pause();
    video.currentTime = 0;
    audio.muted = mute;
    muteButton.style.backgroundImage = mute
      ? "url('no_sound.jpg')"
      : "url('yes_sound.jpg')";
  });
});

// 로컬 스토리지에서 음소거 상태를 가져오기
const isMuted = localStorage.getItem("isMuted") === "true";
audio.muted = isMuted;
muteButton.style.backgroundImage = isMuted
  ? "url('no_sound.jpg')"
  : "url('yes_sound.jpg')";

Button.addEventListener("click", () => {
  overlay.style.display = "none";
  audio.play();
});

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

// 초기 볼륨 설정
audio.volume = volumeControl.value;

const brickControl = document.getElementById("brick-control");
const jumpControl = document.getElementById("jump-control");
const avoidControl = document.getElementById("avoid-control");
const brickvideo = document.getElementById("brick_Video");
const jumpvideo = document.getElementById("jump_Video");
const avoidvideo = document.getElementById("avoid_Video");

jumpControl.addEventListener("input", (e) => {
  jumpvideo.volume = e.target.value;
});
jumpvideo.volume = jumpControl.value;

avoidControl.addEventListener("input", (e) => {
  avoidvideo.volume = e.target.value;
});
avoidvideo.volume = avoidControl.value;

brickControl.addEventListener("input", (e) => {
  brickvideo.volume = e.target.value;
});
brickvideo.volume = brickControl.value;
