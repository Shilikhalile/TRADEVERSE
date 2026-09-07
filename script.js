const home = document.getElementById("home");
const lab = document.getElementById("lab");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const candleScene = document.getElementById("candleScene");


// ================================
// OPEN LAB
// ================================

startBtn.addEventListener("click", () => {
    home.style.display = "none";
    lab.classList.add("active");
});


// ================================
// BACK
// ================================

backBtn.addEventListener("click", () => {
    lab.classList.remove("active");
    home.style.display = "block";
});


// ================================
// CANDLE MOVEMENT
// ================================

let rotateX = 0;
let rotateY = 0;

let zoom = 1;

let dragging = false;

let lastX = 0;
let lastY = 0;

let velocityX = 0;
let velocityY = 0;


// ================================
// UPDATE
// ================================

function updateCandle() {
    candleScene.style.transform =
        `translate(-50%, -50%)
         scale(${zoom})
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;
}


// ================================
// TOUCH / MOUSE DOWN
// ================================

candleScene.addEventListener("pointerdown", (e) => {

    dragging = true;

    lastX = e.clientX;
    lastY = e.clientY;

    velocityX = 0;
    velocityY = 0;

    candleScene.style.cursor = "grabbing";

    candleScene.setPointerCapture(e.pointerId);
});


// ================================
// MOVE
// ================================

candleScene.addEventListener("pointermove", (e) => {

    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    // أسرع
    rotateY += dx * 1.5;
    rotateX -= dy * 1.5;

    rotateX = Math.max(-70, Math.min(70, rotateX));

    velocityY = dx * 1.5;
    velocityX = -dy * 1.5;

    lastX = e.clientX;
    lastY = e.clientY;

    updateCandle();
});


// ================================
// RELEASE
// ================================

candleScene.addEventListener("pointerup", (e) => {

    dragging = false;

    candleScene.style.cursor = "grab";

    try {
        candleScene.releasePointerCapture(e.pointerId);
    } catch (error) {}
});


candleScene.addEventListener("pointercancel", () => {

    dragging = false;

    candleScene.style.cursor = "grab";
});


// ================================
// ZOOM
// ================================

candleScene.addEventListener("wheel", (e) => {

    e.preventDefault();

    if (e.deltaY < 0) {
        zoom += 0.10;
    } else {
        zoom -= 0.10;
    }

    zoom = Math.max(0.55, Math.min(1.8, zoom));

    updateCandle();

}, { passive: false });


// ================================
// AUTO ROTATION
// ================================

function animate() {

    if (!dragging) {

        // دوران أسرع شوية
        rotateY += 0.20;

        // Momentum
        rotateY += velocityY * 0.04;
        rotateX += velocityX * 0.04;

        rotateX = Math.max(-70, Math.min(70, rotateX));

        velocityX *= 0.92;
        velocityY *= 0.92;

        updateCandle();
    }

    requestAnimationFrame(animate);
}

animate();
