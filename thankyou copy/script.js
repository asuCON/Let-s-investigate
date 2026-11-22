// ============ Screen elements ============
const screenHome = document.getElementById("screen-home");
const screenLetter = document.getElementById("screen-letter");
const screenGarden = document.getElementById("screen-garden");

const envelope = document.getElementById("envelope-container");
const letterWindow = document.querySelector(".letter-window");
const openGardenBtn = document.getElementById("open-garden-btn");

// ============ Image reveal modal ============
const imageModal = document.getElementById("image-modal");
const imageModalImg = document.getElementById("image-modal-img");
const imageModalCaption = document.getElementById("image-modal-caption");
const imageModalClose = document.getElementById("image-modal-close");

// Captions shown under each revealed photo — edit these freely
const captions = {
  "1stimg.png": "DENJI HERE< Pretty voice u got there😏.",
  "2ndimg.png": "POCHITA HERE< Don't shy away now.😂.",
  "3rdimg.png": "REZE HERE< Why are u dat pretty tho?😜.",
};

function showScreen(el) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  el.classList.add("active");
}

// ---- Screen 1 -> Screen 2 ----
envelope.addEventListener("click", () => {
  showScreen(screenLetter);
  // small delay so the CSS transition (scale/opacity) is visible
  setTimeout(() => {
    letterWindow.classList.add("open");
  }, 50);
});

// ---- Screen 2 -> Screen 3 (flower garden) ----
openGardenBtn.addEventListener("click", () => {
  showScreen(screenGarden);

  // Restart the flower-growing animations from the beginning every time
  // this screen is entered (they are paused while .not-loaded is present)
  screenGarden.classList.add("not-loaded");

  // Force a reflow so the browser registers the paused state before we
  // remove it — otherwise the animations may not restart cleanly.
  void screenGarden.offsetWidth;

  setTimeout(() => {
    screenGarden.classList.remove("not-loaded");
  }, 300);
});

// ---- Flower click -> image reveal ----
const clickableFlowers = document.querySelectorAll(".flower-clickable");

clickableFlowers.forEach((flower) => {
  flower.addEventListener("click", (e) => {
    e.stopPropagation();
    const imgName = flower.dataset.img;
    openImageModal(imgName);
  });
});

function openImageModal(imgName) {
  imageModalImg.src = `assets/${imgName}`;
  imageModalImg.alt = imgName;
  imageModalCaption.textContent = captions[imgName] || "";
  imageModal.classList.add("open");
}

function closeImageModal() {
  imageModal.classList.remove("open");
}

imageModalClose.addEventListener("click", closeImageModal);
imageModal.querySelector(".image-modal__backdrop").addEventListener("click", closeImageModal);

// ---- Start on the home screen ----
showScreen(screenHome);