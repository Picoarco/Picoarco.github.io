const trackArtElement = document.querySelector(".track-art");
const trackNameElement = document.querySelector(".track-name");
const playPauseButton = document.querySelector(".playpause-track");
const seekSliderElement = document.querySelector(".seek_slider");
const volumeSliderElement = document.querySelector(".volume_slider");
const currentTimeElement = document.querySelector(".current-time");
const totalDurationElement = document.querySelector(".total-duration");

let currentTrackIndex = 0;
let isTrackPlaying = false;
let seekUpdateTimer = null;

const currentTrackAudio = document.createElement("audio");

const trackList = [
  {
    name: "spica's house",
    image: "./music/artworks/spicas_house.webp",
    path: "./music/mp3/spicas_house.mp3"
  },
  {
    name: "Night whispers",
    image: "./music/artworks/night-whispers.webp",
    path: "./music/mp3/night-whispers.mp3"
  },
  {
    name: "Reverse",
    image: "./music/artworks/reverse.webp",
    path: "./music/mp3/reverse.mp3"
  }
];

function setPlayPauseButtonIcon(isPlayingNow) {
  const iconClass = isPlayingNow ? "fa-pause-circle fa-4x" : "fa-play-circle fa-4x";

  playPauseButton.innerHTML = `
    <span class="control-icon normal" aria-hidden="true">
      <i class="fa ${iconClass}"></i>
    </span>
    <span class="control-icon hover" aria-hidden="true">
      <i class="fa ${iconClass}"></i>
    </span>
  `;
}

function loadTrack(trackIndex) {
  clearInterval(seekUpdateTimer);
  resetValues();

  currentTrackAudio.pause();
  currentTrackAudio.currentTime = 0;
  currentTrackAudio.removeEventListener("ended", nextTrack);
  currentTrackAudio.src = trackList[trackIndex].path;
  currentTrackAudio.load();

  trackArtElement.style.backgroundImage = `url("${trackList[trackIndex].image}")`;
  trackNameElement.textContent = trackList[trackIndex].name;

  seekUpdateTimer = setInterval(seekUpdate, 1000);
  currentTrackAudio.addEventListener("ended", nextTrack);

  isTrackPlaying = false;
  setPlayPauseButtonIcon(false);
}

function resetValues() {
  currentTimeElement.textContent = "00:00";
  totalDurationElement.textContent = "00:00";
  seekSliderElement.value = 0;
}

function playpauseTrack() {
  if (isTrackPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function playTrack() {
  currentTrackAudio.play();
  isTrackPlaying = true;
  setPlayPauseButtonIcon(true);
}

function pauseTrack() {
  currentTrackAudio.pause();
  isTrackPlaying = false;
  setPlayPauseButtonIcon(false);
}

function nextTrack() {
  if (currentTrackIndex < trackList.length - 1) {
    currentTrackIndex += 1;
  } else {
    currentTrackIndex = 0;
  }

  loadTrack(currentTrackIndex);
  playTrack();
}

function prevTrack() {
  if (currentTrackIndex > 0) {
    currentTrackIndex -= 1;
  } else {
    currentTrackIndex = trackList.length - 1;
  }

  loadTrack(currentTrackIndex);
  playTrack();
}

function seekTo() {
  if (!isNaN(currentTrackAudio.duration)) {
    const seekPositionSeconds =
      currentTrackAudio.duration * (seekSliderElement.value / 100);
    currentTrackAudio.currentTime = seekPositionSeconds;
  }
}

function setVolume() {
  currentTrackAudio.volume = volumeSliderElement.value / 100;
}

function seekUpdate() {
  if (!isNaN(currentTrackAudio.duration)) {
    const seekPosition =
      currentTrackAudio.currentTime * (100 / currentTrackAudio.duration);
    seekSliderElement.value = seekPosition;

    let currentMinutes = Math.floor(currentTrackAudio.currentTime / 60);
    let currentSeconds = Math.floor(
      currentTrackAudio.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(currentTrackAudio.duration / 60);
    let durationSeconds = Math.floor(
      currentTrackAudio.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    if (currentMinutes < 10) currentMinutes = `0${currentMinutes}`;
    if (durationMinutes < 10) durationMinutes = `0${durationMinutes}`;

    currentTimeElement.textContent = `${currentMinutes}:${currentSeconds}`;
    totalDurationElement.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}

loadTrack(currentTrackIndex);
setVolume();