const home = document.getElementById("home");
const lab = document.getElementById("lab");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const candleScene = document.getElementById("candleScene");


/* =========================================
   OPEN LAB
   ========================================= */

startBtn.addEventListener("click", () => {
    home.style.display = "none";
    lab.classList.add("active");
});


/* =========================================
   BACK
   ========================================= */

backBtn.addEventListener("click", () => {
    lab.classList.remove("active");
    home.style.display = "block";
});


/* =========================================
   CANDLE MOVEMENT
   ========================================= */

let rotateX = 0;
let rotateY = 0;

let zoom = 1;

let dragging = false;

let lastX = 0;
let lastY = 0;

let velocityX = 0;
let velocityY = 0;


/* =========================================
   UPDATE CANDLE
   ========================================= */

function updateCandle() {

    candleScene.style.transform =
        `translate(-50%, -50%)
         scale(${zoom})
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;
}


/* =========================================
   POINTER DOWN
   ========================================= */

candleScene.addEventListener("pointerdown", (e) => {

    dragging = true;

    lastX = e.clientX;
    lastY = e.clientY;

    velocityX = 0;
    velocityY = 0;

    candleScene.setPointerCapture(e.pointerId);
});


/* =========================================
   POINTER MOVE
   ========================================= */

candleScene.addEventListener("pointermove", (e) => {

    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    rotateY += dx * 0.8;
    rotateX -= dy * 0.8;

    velocityY = dx * 0.8;
    velocityX = -dy * 0.8;

    lastX = e.clientX;
    lastY = e.clientY;

    updateCandle();
});


/* =========================================
   POINTER UP
   ========================================= */

candleScene.addEventListener("pointerup", (e) => {

    dragging = false;

    candleScene.releasePointerCapture(e.pointerId);
});


candleScene.addEventListener("pointercancel", () => {

    dragging = false;
});


/* =========================================
   ZOOM
   ========================================= */

candleScene.addEventListener(
    "wheel",
    (e) => {

        e.preventDefault();

        if (e.deltaY < 0) {
            zoom += 0.08;
        } else {
            zoom -= 0.08;
        }

        zoom = Math.max(.55, Math.min(1.8, zoom));

        updateCandle();
    },
    { passive: false }
);


/* =========================================
   AUTO ROTATION + MOMENTUM
   ========================================= */

function animate() {

    if (!dragging) {

        rotateY += 0.12;

        rotateY += velocityY * 0.03;
        rotateX += velocityX * 0.03;

        velocityX *= 0.94;
        velocityY *= 0.94;

        updateCandle();
    }

    requestAnimationFrame(animate);
}


animate();
