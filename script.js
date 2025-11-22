// 画像リスト
const images = [
    "images/top1.gif",
    "images/top2.gif"
];

let index = 0;

const imgElement = document.getElementById("slider-img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

// 初期フェード設定
imgElement.classList.add("fade");

// ページ読み込み後に初回の画像を表示
window.addEventListener("load", () => {
    imgElement.classList.add("show");
});

// スライド切り替え
function showImage() {
    imgElement.classList.remove("show");

    setTimeout(() => {
        imgElement.src = images[index];

        if (modal.style.display === "flex") {
            modalImg.src = images[index];
        }

        imgElement.classList.add("show");
    }, 400);
}

function nextImage() {
    index = (index + 1) % images.length;
    showImage();
}

function prevImage() {
    index = (index - 1 + images.length) % images.length;
    showImage();
}

// モーダル開閉（アニメーション追加）
function openModal() {
    modal.style.display = "flex";

    // 初期は透明
    modalImg.classList.remove("show");
    modalImg.classList.add("fade");

    // 画像セット
    modalImg.src = images[index];

    // フェードイン
    setTimeout(() => {
        modalImg.classList.add("show");
    }, 10);
}

function closeModal() {
    // フェードアウト
    modalImg.classList.remove("show");

    // アニメーション終了後に非表示
    setTimeout(() => {
        modal.style.display = "none";
    }, 200);
}
