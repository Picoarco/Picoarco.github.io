// iOS 用アイコン切り替え処理
(function () {
    var isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isiOS) {
        var oldIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (oldIcon) oldIcon.remove();

        var link = document.createElement("link");
        link.rel = "apple-touch-icon";
        link.href = "apple-touch-icon-white.png"; // 白背景版
        link.sizes = "180x180";
        document.head.appendChild(link);
    }
})();

// --- 以下、元のスライダー機能 ---
const images = [
    "images/top1.jpg",
    "images/top2.gif",
    "images/top3.gif",
    "images/top4.jpg",
    "images/top5.gif",
    "images/top6.gif",
    "images/top7.gif",
    "images/top8.gif",
    "images/top9.gif",
    "images/top10.gif",
    "images/top11.gif",
    "images/top12.png",
    "images/top13.gif",
    "images/top14.gif",
    "images/top15.gif",
];

let index = 0;

const imgElement = document.getElementById("slider-img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

// プリロード
const preloadImages = () => {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};
preloadImages();

imgElement.classList.add("fade");

window.addEventListener("load", () => {
    imgElement.classList.add("show");
});

const FADE_TIME = 300;

function showImage() {
    imgElement.classList.remove("show");

    setTimeout(() => {
        imgElement.src = images[index];

        if (modal.style.display === "flex") {
            modalImg.src = images[index];
        }

        imgElement.classList.add("show");
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

function openModal() {
    modal.style.display = "flex";
    modalImg.src = images[index];

    modalImg.classList.remove("show");
    setTimeout(() => {
        modalImg.classList.add("show");
    }, 10);
}

function closeModal() {
    modalImg.classList.remove("show");

    setTimeout(() => {
        modal.style.display = "none";
    }, FADE_TIME);
}