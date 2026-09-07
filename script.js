const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const home = document.getElementById("home");
const lab = document.getElementById("lab");

const candleStage = document.getElementById("candleStage");
const candle = document.querySelector(".candle");

let dragging = false;

let lastX = 0;
let lastY = 0;

let rotateX = -8;
let rotateY = -25;

let zoom = 1;

let velocityX = 0;
let velocityY = 0;


/* START */

startBtn.onclick = function () {

    home.style.display = "none";
    lab.style.display = "block";

};


/* BACK */

backBtn.onclick = function () {

    lab.style.display = "none";
    home.style.display = "flex";

};


/* UPDATE */

function updateCandle() {

    candle.style.transform =
        `
        translate(-50%, -50%)
        scale(${zoom})
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        `;

}


/* =========================
   TOUCH / DRAG START
========================= */

candleStage.addEventListener(
    "pointerdown",
    function (e) {

        dragging = true;

        lastX = e.clientX;
        lastY = e.clientY;

        velocityX = 0;
        velocityY = 0;

        candleStage.setPointerCapture(
            e.pointerId
        );

    }
);


/* =========================
   TOUCH / DRAG MOVE
========================= */

candleStage.addEventListener(
    "pointermove",
    function (e) {

        if (!dragging) return;


        const dx =
            e.clientX - lastX;

        const dy =
            e.clientY - lastY;


        /* MUCH MORE SENSITIVE */

        rotateY += dx * 1.8;

        rotateX -= dy * 1.2;


        /* LIMIT X */

        rotateX =
            Math.max(
                -75,
                Math.min(
                    75,
                    rotateX
                )
            );


        /* MOMENTUM */

        velocityX = dx * 0.8;
        velocityY = dy * 0.5;


        lastX = e.clientX;
        lastY = e.clientY;


        updateCandle();

    }
);


/* =========================
   RELEASE
========================= */

function stopDrag() {

    dragging = false;

}


candleStage.addEventListener(
    "pointerup",
    stopDrag
);

candleStage.addEventListener(
    "pointercancel",
    stopDrag
);


/* =========================
   AUTO ROTATION + MOMENTUM
========================= */

function animate() {

    if (!dragging) {

        /* MOMENTUM */

        rotateY += velocityX;

        rotateX -= velocityY;


        /* FRICTION */

        velocityX *= 0.92;
        velocityY *= 0.92;


        /* AUTO ROTATION */

        if (
            Math.abs(velocityX) < 0.05 &&
            Math.abs(velocityY) < 0.05
        ) {

            rotateY += 0.25;

        }


        updateCandle();

    }


    requestAnimationFrame(
        animate
    );

}

animate();


/* =========================
   ZOOM
========================= */

candleStage.addEventListener(
    "wheel",
    function (e) {

        e.preventDefault();


        zoom -=
            e.deltaY * 0.001;


        zoom =
            Math.max(
                0.6,
                Math.min(
                    1.5,
                    zoom
                )
            );


        updateCandle();

    },
    {
        passive: false
    }
);
