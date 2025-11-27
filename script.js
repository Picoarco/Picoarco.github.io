(function () {
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isiOS) {
        const oldIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (oldIcon) oldIcon.remove();

        const link = document.createElement("link");
        link.rel = "apple-touch-icon";
        link.href = "apple-touch-icon-white.png";
        link.sizes = "180x180";
        document.head.appendChild(link);
    }
})();

const images = Array.from({ length: 16 }, (_, i) => `images/top${i + 1}.webp`);

let index = 0;

const imgElement = document.getElementById("slider-img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

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
    modalImg.classList.remove("show");

    setTimeout(() => {
        imgElement.src = images[index];
        modalImg.src = images[index];

        imgElement.classList.add("show");
        modalImg.classList.add("show");
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

imgElement.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});
imgElement.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe(endX - startX);
});

modalImg.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});
modalImg.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe(endX - startX);
});

const titleLink = document.querySelector(".title-link");

if (titleLink) {
    titleLink.addEventListener("touchstart", () => {
        titleLink.classList.add("active");
    });

    titleLink.addEventListener("touchend", () => {
        setTimeout(() => {
            titleLink.classList.remove("active");
        }, 150);
    });
}
