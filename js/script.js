const images = Array.from({ length: 16 }, (_, i) => `images/top${i + 1}.webp`);

let index = 0;
let isAnimating = false;
const FADE_TIME = 350;

const imgElement = document.getElementById("slider-img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

// 画像プリロード（そのままでもOKですが、decodeが使える環境では体感改善します）
preloadImages(images);

if (imgElement && modal && modalImg) {
  imgElement.classList.add("fade");

  window.addEventListener("load", () => {
    imgElement.classList.add("show-slider");
  });

  modal.addEventListener("click", closeModal);

  addSwipeListener(imgElement);
  addSwipeListener(modalImg);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      if (rightArrow) flashArrow(rightArrow);
      nextImage();
    } else if (e.key === "ArrowLeft") {
      if (leftArrow) flashArrow(leftArrow);
      prevImage();
    }
  });
}

// --------------------
// ここから下：関数群
// --------------------

function preloadImages(list) {
  list.forEach((src) => {
    const img = new Image();
    img.src = src;
    // decodeは対応ブラウザのみ。失敗しても問題ないので握りつぶします。
    if (img.decode) img.decode().catch(() => {});
  });
}

// 次の画像が「使える状態」になったらresolve（onload / decode など）
function loadOne(src) {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };

    img.onload = finish;
    img.onerror = finish;
    img.src = src;

    if (img.decode) {
      img.decode().then(finish).catch(() => {});
    }
  });
}

// 連打で白く見える問題の対策：
// 「消して待つ」ではなく「薄くして、次が読めたら差し替える」
async function showImage() {
  if (!imgElement) {
    isAnimating = false;
    return;
  }

  const nextSrc = images[index];

  // 真っ白になりにくいように、完全に消さずに薄くする
  imgElement.style.opacity = "0.25";
  if (modal && modal.classList.contains("visible") && modalImg) {
    modalImg.style.opacity = "0.25";
  }

  try {
    await loadOne(nextSrc);

    // 読めた段階で差し替え
    imgElement.src = nextSrc;

    if (modal && modal.classList.contains("visible") && modalImg) {
      modalImg.src = nextSrc;
    }
  } finally {
    // 次のフレームで元に戻す（CSS transitionがあれば自然に戻ります）
    requestAnimationFrame(() => {
      imgElement.style.opacity = "";
      if (modal && modal.classList.contains("visible") && modalImg) {
        modalImg.style.opacity = "";
      }
      isAnimating = false;
    });
  }
}

function nextImage() {
  if (isAnimating) return;
  isAnimating = true;

  index = (index + 1) % images.length;
  showImage();
}

function prevImage() {
  if (isAnimating) return;
  isAnimating = true;

  index = (index - 1 + images.length) % images.length;
  showImage();
}

function openModal() {
  if (!modal || !modalImg) return;

  modal.classList.add("visible");
  modalImg.src = images[index];

  modalImg.classList.remove("show-modal");
  setTimeout(() => {
    modalImg.classList.add("show-modal");
  }, 10);
}

function closeModal() {
  if (!modal || !modalImg || !imgElement) return;

  modalImg.classList.remove("show-modal");

  setTimeout(() => {
    modal.classList.remove("visible");
    imgElement.classList.add("show-slider");
  }, FADE_TIME);
}

function addSwipeListener(el) {
  let startX = 0;

  el.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  el.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    handleSwipe(endX - startX);
  });
}

function handleSwipe(diff) {
  if (Math.abs(diff) <= 50) return;

  if (diff < 0) {
    nextImage();
  } else {
    prevImage();
  }
}

function flashArrow(arrowElement) {
  if (!arrowElement) return;

  arrowElement.classList.add("active");
  setTimeout(() => {
    arrowElement.classList.remove("active");
  }, 150);
}