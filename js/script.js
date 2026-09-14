const IMAGES = Array.from({ length: 16 }, (_, i) => `images/top${i + 1}.webp`);
const imageLoads = new Map();
const imageVersions = new WeakMap();
let currentIndex = 0;
let displayedIndex = 0;
let requestVersion = 0;
let fadeMs = 350;
let sliderImg, modal, modalImg, btnPrev, btnNext;

function loadImage(src) {
  if (imageLoads.has(src)) return imageLoads.get(src);
  const pending = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        if (typeof img.decode === "function") await img.decode();
        resolve(src);
      } catch (error) { reject(error); }
    };
    img.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    img.src = src;
  }).catch((error) => {
    imageLoads.delete(src);
    throw error;
  });
  imageLoads.set(src, pending);
  return pending;
}

function clampIndex(index) {
  return (index % IMAGES.length + IMAGES.length) % IMAGES.length;
}

function isModalOpen() {
  return modal.open;
}

function invalidateImage(element) {
  const version = (imageVersions.get(element) || 0) + 1;
  imageVersions.set(element, version);
  return version;
}

async function fadeSwap(element, src, isCurrent) {
  const version = invalidateImage(element);
  element.style.opacity = "0";
  await new Promise((resolve) => setTimeout(resolve, fadeMs));
  if (imageVersions.get(element) !== version) return;
  if (isCurrent()) element.src = src;
  // A superseded request must still restore the current image's visibility.
  element.style.opacity = "1";
}

async function showAt(index) {
  const version = ++requestVersion;
  const targetIndex = clampIndex(index);
  currentIndex = targetIndex;
  const src = IMAGES[targetIndex];
  try {
    // Keep the current image visible until the replacement is ready.
    await loadImage(src);
  } catch (error) {
    if (version === requestVersion) currentIndex = displayedIndex;
    console.warn(error.message);
    return;
  }
  if (version !== requestVersion) return;
  const isCurrent = () => version === requestVersion;
  const swaps = [fadeSwap(sliderImg, src, isCurrent).then(() => {
    if (isCurrent()) displayedIndex = targetIndex;
  })];
  if (isModalOpen()) swaps.push(fadeSwap(modalImg, src, isCurrent));
  await Promise.all(swaps);
}

function nextImage() { void showAt(currentIndex + 1); }
function prevImage() { void showAt(currentIndex - 1); }

function openModal() {
  if (isModalOpen()) return;
  invalidateImage(modalImg);
  modalImg.src = sliderImg.src;
  modalImg.style.opacity = "1";
  modal.classList.add("visible");
  modal.showModal();
  document.getElementById("modal-close").focus();
  // Also synchronize if the modal opens during an existing transition.
  if (currentIndex !== displayedIndex) void showAt(currentIndex);
}

function closeModal() {
  // Closing the overlay must not cancel the main image's transition.
  invalidateImage(modalImg);
  modalImg.style.opacity = "0";
  modal.classList.remove("visible");
  modal.close();
}

const arrowTimers = new WeakMap();
function flashArrow(element) {
  clearTimeout(arrowTimers.get(element));
  element.classList.add("active");
  arrowTimers.set(element, setTimeout(() => element.classList.remove("active"), 150));
}

function addSwipe(element) {
  let start = null;
  element.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) { start = null; return; }
    const touch = event.touches[0];
    start = { id: touch.identifier, x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  element.addEventListener("touchcancel", () => { start = null; }, { passive: true });
  element.addEventListener("touchend", (event) => {
    if (!start) return;
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === start.id);
    if (!touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) nextImage();
      else prevImage();
    }
  }, { passive: true });
}

function init() {
  sliderImg = document.getElementById("slider-img");
  modal = document.getElementById("modal");
  modalImg = document.getElementById("modal-img");
  btnPrev = document.querySelector(".arrow.left");
  btnNext = document.querySelector(".arrow.right");
  if (!sliderImg || !modal || !modalImg || !btnPrev || !btnNext) return;

  // CSS is the single source of truth for the transition duration (milliseconds).
  const configuredFade = Number.parseFloat(getComputedStyle(sliderImg).getPropertyValue("--image-fade-ms"));
  if (Number.isFinite(configuredFade) && configuredFade >= 0) fadeMs = configuredFade;
  IMAGES.forEach((src) => { void loadImage(src).catch(() => {}); });
  btnNext.addEventListener("click", () => { flashArrow(btnNext); nextImage(); });
  btnPrev.addEventListener("click", () => { flashArrow(btnPrev); prevImage(); });
  sliderImg.addEventListener("click", openModal);
  document.getElementById("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal();
  });
  modalImg.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") { flashArrow(btnNext); nextImage(); }
    if (event.key === "ArrowLeft") { flashArrow(btnPrev); prevImage(); }
    if (event.key === "Escape" && isModalOpen()) closeModal();
  });
  addSwipe(sliderImg);
  addSwipe(modalImg);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();