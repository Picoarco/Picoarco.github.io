const images = Array.from({ length: 16 }, (_, i) => `images/top${i + 1}.webp`);

let index = 0;

const imgElement = document.getElementById("slider-img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

// Preload
const preloadImages = () => {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};
preloadImages();

// 初期フェード設定
imgElement.classList.add("fade");

window.addEventListener("load", () => {
    imgElement.classList.add("show-slider");
});

const FADE_TIME = 300;

// 画像切り替え
function showImage() {
    imgElement.classList.remove("show-slider");
    modalImg.classList.remove("show-modal");

    setTimeout(() => {
        imgElement.src = images[index];
        modalImg.src = images[index];

        imgElement.classList.add("show-slider");
        modalImg.classList.add("show-modal");
    }, FADE_TIME);
}

function nextImage() {
    index = (index + 1) % images.length;
    showImage();
}

function prevImage() {
    index = (index - 1 + images.length) % images.length;
    showImage();
}

// モーダルを開く
function openModal() {
    modal.classList.add("visible");
    modalImg.src = images[index];

    modalImg.classList.remove("show-modal");
    setTimeout(() => {
        modalImg.classList.add("show-modal");
    }, 10);
}

// モーダルを閉じる
function closeModal() {
    modalImg.classList.remove("show-modal");

    setTimeout(() => {
        modal.classList.remove("visible");
        imgElement.classList.add("show-slider"); // スライダーを正常状態に復元
    }, FADE_TIME);
}

modal.addEventListener("click", closeModal);

// キーボード操作
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

function flashArrow(arrowElement) {
    arrowElement.classList.add("active");
    setTimeout(() => {
        arrowElement.classList.remove("active");
    }, 150);
}

document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
        flashArrow(rightArrow);
        nextImage();
    } else if (e.key === "ArrowLeft") {
        flashArrow(leftArrow);
        prevImage();
    }
});

// スワイプ
let startX = 0;
let endX = 0;

function handleSwipe(diff) {
    if (Math.abs(diff) > 50) {
        if (diff < 0) {
            nextImage();
        } else {
            prevImage();
        }
    }
}

imgElement.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});
imgElement.addEventListener("touchend", e => {
    endX = e.changedTouches[0].clientX;
    handleSwipe(endX - startX);
});

modalImg.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});
modalImg.addEventListener("touchend", e => {
    endX = e.changedTouches[0].clientX;
    handleSwipe(endX - startX);
});
