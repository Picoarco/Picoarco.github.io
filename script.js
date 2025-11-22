const images = [
    "images/top1.gif",
    "images/top2.jpg",
    "images/top3.gif",
    "images/top4.gif",
    "images/top5.gif",
    "images/top6.gif",
    "images/top7.jpg",
    "images/top8.gif",
    "images/top9.gif",
    "images/top10.gif",
    "images/top11.gif",
    "images/top12.gif",
    "images/top13.png",
    "images/top14.gif",
];

let index = 0;

const imgElement = document.getElementById("slider-img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

// 画像プリロード
const preloadImages = () => {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};
preloadImages();

// フェード初期設定
imgElement.classList.add("fade");

window.addEventListener("load", () => {
    imgElement.classList.add("show");
});

const FADE_TIME = 300;

// スライド表示
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

// モーダル開く
function openModal() {
    modal.style.display = "flex";
    modalImg.src = images[index];

    modalImg.classList.remove("show");
    setTimeout(() => {
        modalImg.classList.add("show");
    }, 10);
}

// モーダル閉じる
function closeModal() {
    modalImg.classList.remove("show");

    setTimeout(() => {
        modal.style.display = "none";
    }, FADE_TIME);
}
