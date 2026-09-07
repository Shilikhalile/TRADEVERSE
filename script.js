const startBtn =
    document.getElementById("startBtn");

const backBtn =
    document.getElementById("backBtn");

const home =
    document.getElementById("home");

const lab =
    document.getElementById("lab");

const candleStage =
    document.getElementById("candleStage");

const candleScene =
    document.getElementById("candleScene");


/* =====================================================
   VARIABLES
===================================================== */

let dragging = false;

let lastX = 0;
let lastY = 0;

let rotateX = -8;
let rotateY = -25;

let zoom = 1;

let velocity = 0;


/* =====================================================
   START LAB
===================================================== */

startBtn.addEventListener(
    "click",
    function () {

        home.style.display = "none";

        lab.style.display = "block";

    }
);


/* =====================================================
   BACK
===================================================== */

backBtn.addEventListener(
    "click",
    function () {

        lab.style.display = "none";

        home.style.display = "flex";

    }
);


/* =====================================================
   UPDATE SCENE
===================================================== */

function updateScene() {

    candleScene.style.transform = `

        translate(-50%, -50%)

        scale(${zoom})

        rotateX(${rotateX}deg)

        rotateY(${rotateY}deg)

    `;

}


/* =====================================================
   DRAG START
===================================================== */

candleStage.addEventListener(
    "pointerdown",
    function (event) {

        dragging = true;

        lastX =
            event.clientX;

        lastY =
            event.clientY;

        velocity = 0;

        candleStage.setPointerCapture(
            event.pointerId
        );

    }
);


/* =====================================================
   DRAG MOVE
===================================================== */

candleStage.addEventListener(
    "pointermove",
    function (event) {

        if (!dragging) {
            return;
        }


        const dx =
            event.clientX -
            lastX;


        const dy =
            event.clientY -
            lastY;


        /* HORIZONTAL ROTATION */

        rotateY +=
            dx * 1.8;


        /* VERTICAL ROTATION */

        rotateX -=
            dy * 1.2;


        /* LIMIT */

        rotateX =
            Math.max(
                -70,
                Math.min(
                    70,
                    rotateX
                )
            );


        /* MOMENTUM */

        velocity =
            dx * 0.5;


        lastX =
            event.clientX;

        lastY =
            event.clientY;


        updateScene();

    }
);


/* =====================================================
   DRAG END
===================================================== */

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


/* =====================================================
   ZOOM
===================================================== */

candleStage.addEventListener(
    "wheel",
    function (event) {

        event.preventDefault();


        zoom -=
            event.deltaY * 0.001;


        zoom =
            Math.max(
                0.6,
                Math.min(
                    1.5,
                    zoom
                )
            );


        updateScene();

    },
    {
        passive: false
    }
);


/* =====================================================
   AUTO ROTATION
===================================================== */

function animate() {

    if (!dragging) {

        /* MOMENTUM */

        rotateY += velocity;

        velocity *= 0.94;


        /* AUTO ROTATION */

        if (
            Math.abs(velocity) < 0.03
        ) {

            rotateY += 0.25;

        }


        updateScene();

    }


    requestAnimationFrame(
        animate
    );

}


/* =====================================================
   START
===================================================== */

updateScene();

animate();
