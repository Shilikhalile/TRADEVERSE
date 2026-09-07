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


/* =========================
   START LAB
========================= */

startBtn.addEventListener("click", function () {

    home.style.display = "none";

    lab.style.display = "block";

});


/* =========================
   BACK
========================= */

backBtn.addEventListener("click", function () {

    lab.style.display = "none";

    home.style.display = "flex";

});


/* =========================
   DRAG START
========================= */

candleStage.addEventListener(
    "pointerdown",
    function (event) {

        dragging = true;

        lastX = event.clientX;
        lastY = event.clientY;

        candleStage.setPointerCapture(
            event.pointerId
        );

    }
);


/* =========================
   DRAG MOVE
========================= */

candleStage.addEventListener(
    "pointermove",
    function (event) {

        if (!dragging) {
            return;
        }


        const dx =
            event.clientX - lastX;

        const dy =
            event.clientY - lastY;


        rotateY += dx * 0.7;

        rotateX -= dy * 0.5;


        rotateX =
            Math.max(
                -70,
                Math.min(
                    70,
                    rotateX
                )
            );


        lastX = event.clientX;
        lastY = event.clientY;


        updateCandle();

    }
);


/* =========================
   DRAG END
========================= */

candleStage.addEventListener(
    "pointerup",
    function () {

        dragging = false;

    }
);

candleStage.addEventListener(
    "pointercancel",
    function () {

        dragging = false;

    }
);


/* =========================
   ZOOM
========================= */

candleStage.addEventListener(
    "wheel",
    function (event) {

        event.preventDefault();


        zoom -=
            event.deltaY * 0.001;


        zoom =
            Math.max(
                0.65,
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


/* =========================
   UPDATE CANDLE
========================= */

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
   AUTO ROTATION
========================= */

function animate() {

    if (!dragging) {

        rotateY += 0.15;

        updateCandle();

    }

    requestAnimationFrame(
        animate
    );

}


animate();
