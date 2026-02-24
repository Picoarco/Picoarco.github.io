const images = Array.from({ length: 16 }, (_, i) => `images/top${i + 1}.webp`);

let index = 0;
let isAnimating = false;
const FADE_TIME = 350;

const imgElement = document.getElementById("slider-img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

const preloadImages = () => {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};
preloadImages();

if (imgElement && modal && modalImg) {
    imgElement.classList.add("fade");

    window.addEventListener("load", () => {
        imgElement.classList.add("show-slider");
    });

    modal.addEventListener("click", closeModal);

    let startX = 0;
    let endX = 0;

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


function showImage() {

    if (!imgElement || !modalImg) return;

    imgElement.classList.remove("show-slider");
    modalImg.classList.remove("show-modal");

    setTimeout(() => {
        imgElement.src = images[index];
        modalImg.src = images[index];

        imgElement.classList.add("show-slider");
        modalImg.classList.add("show-modal");

        setTimeout(() => {
            isAnimating = false;
        }, FADE_TIME);
    }, FADE_TIME);
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

function handleSwipe(diff) {
    if (Math.abs(diff) > 50) {
        if (diff < 0) {
            nextImage();
        } else {
            prevImage();
        }
    }
}

function flashArrow(arrowElement) {
    if (!arrowElement) return;
    arrowElement.classList.add("active");
    setTimeout(() => {
        arrowElement.classList.remove("active");
    }, 150);
}