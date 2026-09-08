/* =========================================================
   PAGE NAVIGATION
========================================================= */

const home = document.getElementById("home");
const lab = document.getElementById("lab");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const candleScene = document.getElementById("candleScene");


/* START */

startBtn.addEventListener("click", () => {

    home.style.display = "none";

    lab.classList.add("active");

});


/* BACK */

backBtn.addEventListener("click", () => {

    lab.classList.remove("active");

    home.style.display = "block";

});


/* =========================================================
   3D CANDLE CONTROL
========================================================= */

let rotateX = 0;
let rotateY = 0;

let zoom = 1;

let dragging = false;

let lastX = 0;
let lastY = 0;

let velocityX = 0;
let velocityY = 0;


/* =========================================================
   UPDATE CANDLE
========================================================= */

function updateCandle() {

    candleScene.style.transform =
        `translate(-50%, -50%)
         scale(${zoom})
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;

}


/* =========================================================
   DRAG START
========================================================= */

candleScene.addEventListener("pointerdown", (e) => {

    dragging = true;

    lastX = e.clientX;
    lastY = e.clientY;

    velocityX = 0;
    velocityY = 0;

    candleScene.style.cursor = "grabbing";

    candleScene.setPointerCapture(e.pointerId);

});


/* =========================================================
   DRAG MOVE
========================================================= */

candleScene.addEventListener("pointermove", (e) => {

    if (!dragging) return;


    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;


    /* fast movement */

    rotateY += dx * 1.8;

    rotateX -= dy * 1.8;


    /* prevent extreme rotation */

    rotateX = Math.max(
        -70,
        Math.min(70, rotateX)
    );


    /* momentum */

    velocityY = dx * 1.8;

    velocityX = -dy * 1.8;


    lastX = e.clientX;
    lastY = e.clientY;


    updateCandle();

});


/* =========================================================
   DRAG END
========================================================= */

function stopDragging(e) {

    dragging = false;

    candleScene.style.cursor = "grab";

    try {

        if (e.pointerId !== undefined) {
            candleScene.releasePointerCapture(e.pointerId);
        }

    } catch (error) {}

}


candleScene.addEventListener(
    "pointerup",
    stopDragging
);

candleScene.addEventListener(
    "pointercancel",
    stopDragging
);


/* =========================================================
   ZOOM
========================================================= */

candleScene.addEventListener(
    "wheel",
    (e) => {

        e.preventDefault();


        if (e.deltaY < 0) {

            zoom += 0.10;

        } else {

            zoom -= 0.10;

        }


        zoom = Math.max(
            0.55,
            Math.min(1.8, zoom)
        );


        updateCandle();

    },
    {
        passive: false
    }
);


/* =========================================================
   AUTO ROTATION
========================================================= */

function animate() {

    if (!dragging) {

        /* normal automatic rotation */

        rotateY += 0.20;


        /* momentum after dragging */

        rotateY += velocityY * 0.04;

        rotateX += velocityX * 0.04;


        rotateX = Math.max(
            -70,
            Math.min(70, rotateX)
        );


        /* friction */

        velocityX *= 0.92;

        velocityY *= 0.92;


        updateCandle();

    }


    requestAnimationFrame(animate);

}


animate();


/* =========================================================
   NOTES — AUTO SAVE
========================================================= */

const lessonNotes =
    document.getElementById("lessonNotes");


if (lessonNotes) {

    const savedNotes =
        localStorage.getItem(
            "tradeverse-candle-notes"
        );


    /* restore notes */

    if (savedNotes !== null) {

        lessonNotes.value = savedNotes;

    }


    /* save while typing */

    lessonNotes.addEventListener(
        "input",
        () => {

            localStorage.setItem(
                "tradeverse-candle-notes",
                lessonNotes.value
            );

        }
    );

    }
