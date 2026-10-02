const IMAGES = Array.from({ length: 16 }, (_, i) => `images/top${i + 1}.webp`);

const FADE_MS = 350;
let currentIndex = 0;

let modalIndex = 0;
const transitionTokens = new WeakMap();

let sliderImg, modal, modalImg, btnPrev, btnNext;

function preloadImages(list) {
  list.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function forceFadeStyle(imgEl) {
  imgEl.style.transition = `opacity ${FADE_MS}ms ease-in-out`;
  imgEl.style.opacity = "1";
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clampIndex(i) {
  const n = IMAGES.length;
  return (i % n + n) % n;
}

function isModalOpen() {
  return modal && modal.classList.contains("visible");
}

function setModalOpen(open) {
  if (!modal) return;

  if (open) {
    modal.classList.add("visible");
    modal.setAttribute("aria-hidden", "false");
  } else {
    modal.classList.remove("visible");
    modal.setAttribute("aria-hidden", "true");
  }
}

async function fadeSwap(imgEl, newSrc, token) {
  if (!imgEl) return;

  imgEl.style.opacity = "0";
  await wait(FADE_MS);

  if (token !== transitionTokens.get(imgEl)) return;

  imgEl.src = newSrc;

  if (typeof imgEl.decode === "function") {
    try {
      await imgEl.decode();
    } catch (_) {}
  }

  if (token !== transitionTokens.get(imgEl)) return;

  requestAnimationFrame(() => {
    if (token !== transitionTokens.get(imgEl)) return;
    imgEl.style.opacity = "1";
  });
}

function showAt(index) {
  currentIndex = clampIndex(index);
  const token = (transitionTokens.get(sliderImg) || 0) + 1;
  transitionTokens.set(sliderImg, token);
  return fadeSwap(sliderImg, IMAGES[currentIndex], token);
}

function showModalAt(index) {
  modalIndex = clampIndex(index);
  const token = (transitionTokens.get(modalImg) || 0) + 1;
  transitionTokens.set(modalImg, token);
  return fadeSwap(modalImg, IMAGES[modalIndex], token);
}

function nextImage() {
  if (isModalOpen()) return showModalAt(modalIndex + 1);
  return showAt(currentIndex + 1);
}

function prevImage() {
  if (isModalOpen()) return showModalAt(modalIndex - 1);
  return showAt(currentIndex - 1);
}

async function openModal() {
  if (!modalImg) return;

  const src =
    (sliderImg && sliderImg.getAttribute("src")) || IMAGES[currentIndex];

  const displayedIndex = IMAGES.indexOf(src);
  modalIndex = displayedIndex >= 0 ? displayedIndex : currentIndex;

  const token = (transitionTokens.get(modalImg) || 0) + 1;
  transitionTokens.set(modalImg, token);

  setModalOpen(true);
  modalImg.style.opacity = "0";
  modalImg.src = src;

  if (typeof modalImg.decode === "function") {
    try {
      await modalImg.decode();
    } catch (_) {}
  }

  requestAnimationFrame(() => {
    if (token === transitionTokens.get(modalImg) && isModalOpen()) {
      modalImg.style.opacity = "1";
    }
  });
}

function closeModal() {
  if (modalImg) {
    transitionTokens.set(
      modalImg,
      (transitionTokens.get(modalImg) || 0) + 1
    );
    modalImg.style.opacity = "0";
  }

  setModalOpen(false);
}

function flashArrow(el) {
  if (!el) return;

  el.classList.add("active");
  setTimeout(() => el.classList.remove("active"), 150);
}

function addSwipe(el) {
  let startX = 0;

  el.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );

  el.addEventListener(
    "touchend",
    (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      if (Math.abs(diff) > 50) {
        if (diff < 0) nextImage();
        else prevImage();
      }
    },
    { passive: true }
  );
}

function init() {
  sliderImg = document.getElementById("slider-img");
  modal = document.getElementById("modal");
  modalImg = document.getElementById("modal-img");

  btnPrev = document.querySelector(".arrow.left");
  btnNext = document.querySelector(".arrow.right");

  if (!sliderImg || !modal || !modalImg || !btnPrev || !btnNext) return;

  preloadImages(IMAGES);

  forceFadeStyle(sliderImg);
  forceFadeStyle(modalImg);

  sliderImg.style.opacity = "0";
  requestAnimationFrame(() => (sliderImg.style.opacity = "1"));

  btnNext.addEventListener("click", () => {
    flashArrow(btnNext);
    nextImage();
  });

  btnPrev.addEventListener("click", () => {
    flashArrow(btnPrev);
    prevImage();
  });

  sliderImg.addEventListener("click", openModal);

  modal.addEventListener("click", closeModal);
  modalImg.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      if (!isModalOpen()) flashArrow(btnNext);
      nextImage();
    }

    if (e.key === "ArrowLeft") {
      if (!isModalOpen()) flashArrow(btnPrev);
      prevImage();
    }

    if (e.key === "Escape" && isModalOpen()) {
      closeModal();
    }
  });

  addSwipe(sliderImg);
  addSwipe(modalImg);

  showAt(0);
  setModalOpen(false);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}