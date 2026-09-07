const home = document.getElementById("home");
const lab = document.getElementById("lab");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const candleScene = document.getElementById("candleScene");


// ================================
// OPEN MARKET LAB
// ================================

startBtn.addEventListener("click", () => {
    home.style.display = "none";
    lab.classList.add("active");
});


// ================================
// BACK TO HOME
// ================================

backBtn.addEventListener("click", () => {
    lab.classList.remove("active");
    home.style.display = "block";
});


// ================================
// CANDLE 3D MOVEMENT
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
// UPDATE CANDLE
// ================================

function updateCandle() {

    candleScene.style.transform =
        `translate(-50%, -50%)
         scale(${zoom})
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;
}


// ================================
// START DRAG
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
// DRAG CANDLE
// ================================

candleScene.addEventListener("pointermove", (e) => {

    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    rotateY += dx * 0.9;
    rotateX -= dy * 0.9;

    // Prevent extreme vertical rotation
    rotateX = Math.max(-70, Math.min(70, rotateX));

    velocityY = dx * 0.9;
    velocityX = -dy * 0.9;

    lastX = e.clientX;
    lastY = e.clientY;

    updateCandle();
});


// ================================
// END DRAG
// ================================

candleScene.addEventListener("pointerup", (e) => {

    dragging = false;

    candleScene.style.cursor = "grab";

    try {
        candleScene.releasePointerCapture(e.pointerId);
    } catch (error) {
        // Nothing
    }
});


candleScene.addEventListener("pointercancel", () => {

    dragging = false;

    candleScene.style.cursor = "grab";
});


// ================================
// ZOOM
// ================================

candleScene.addEventListener(
    "wheel",
    (e) => {

        e.preventDefault();

        if (e.deltaY < 0) {
            zoom += 0.08;
        } else {
            zoom -= 0.08;
        }

        zoom = Math.max(0.55, Math.min(1.8, zoom));

        updateCandle();
    },
    { passive: false }
);


// ================================
// AUTO ROTATION + MOMENTUM
// ================================

function animate() {

    if (!dragging) {

        // Slow automatic rotation
        rotateY += 0.12;

        // Continue movement after releasing
        rotateY += velocityY * 0.03;
        rotateX += velocityX * 0.03;

        rotateX = Math.max(-70, Math.min(70, rotateX));

        // Slowly stop momentum
        velocityX *= 0.94;
        velocityY *= 0.94;

        updateCandle();
    }

    requestAnimationFrame(animate);
}


// Start animation
animate();
