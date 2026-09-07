const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const home = document.getElementById("home");
const lab = document.getElementById("lab");

const candleStage = document.getElementById("candleStage");
const candle = document.querySelector(".candle");

const cards = document.querySelectorAll(".info-card");

let dragging = false;

let lastX = 0;
let lastY = 0;

let rotateX = -8;
let rotateY = -25;

let zoom = 1;


/* =========================
   START
========================= */

startBtn.onclick = function () {

    home.style.display = "none";
    lab.style.display = "block";

};


/* =========================
   BACK
========================= */

backBtn.onclick = function () {

    lab.style.display = "none";
    home.style.display = "flex";

};


/* =========================
   CANDLE MOVEMENT
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
   DRAG
========================= */

candleStage.addEventListener(
    "pointerdown",
    function (e) {

        dragging = true;

        lastX = e.clientX;
        lastY = e.clientY;

        candleStage.setPointerCapture(
            e.pointerId
        );

    }
);


candleStage.addEventListener(
    "pointermove",
    function (e) {

        if (!dragging) return;


        let dx =
            e.clientX - lastX;

        let dy =
            e.clientY - lastY;


        rotateY += dx * 0.8;

        rotateX -= dy * 0.6;


        rotateX =
            Math.max(
                -70,
                Math.min(
                    70,
                    rotateX
                )
            );


        lastX = e.clientX;
        lastY = e.clientY;


        updateCandle();

    }
);


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


/* =========================
   AUTO ROTATION
========================= */

function autoRotate() {

    if (!dragging) {

        rotateY += 0.35;

        updateCandle();

    }


    requestAnimationFrame(
        autoRotate
    );

}

autoRotate();


/* =========================
   FLOATING
========================= */

let floatTime = 0;

function floating() {

    floatTime += 0.03;

    const y =
        Math.sin(floatTime) * 10;


    candle.style.marginTop =
        y + "px";


    requestAnimationFrame(
        floating
    );

}

floating();
