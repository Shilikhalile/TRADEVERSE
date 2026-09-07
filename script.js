const button = document.getElementById("startBtn");
const home = document.getElementById("home");
const lab = document.getElementById("lab");
const backBtn = document.getElementById("backBtn");
const canvas = document.getElementById("space");

let ctx;
let stars = [];
let animation;

let candle = {
    x: 0,
    y: 0,
    rotation: 0,
    targetRotation: 0
};


/* =========================
   SPACE
========================= */

function startSpace() {

    ctx = canvas.getContext("2d");

    resize();

    stars = [];

    for (let i = 0; i < 700; i++) {

        stars.push({
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
            size: Math.random() * 2 + 0.2,
            speed: Math.random() * 0.004 + 0.001
        });
    }

    animate();
}


function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


window.addEventListener("resize", resize);


/* =========================
   SPACE ANIMATION
========================= */

function animate() {

    animation = requestAnimationFrame(animate);

    ctx.fillStyle = "#02040a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (const star of stars) {

        star.z -= star.speed;

        if (star.z <= 0) {

            star.x = Math.random();
            star.y = Math.random();
            star.z = 1;
        }


        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;


        const x =
            centerX +
            (star.x - 0.5) *
            canvas.width /
            star.z;


        const y =
            centerY +
            (star.y - 0.5) *
            canvas.height /
            star.z;


        const size =
            star.size /
            star.z;


        if (
            x < 0 ||
            x > canvas.width ||
            y < 0 ||
            y > canvas.height
        ) {
            continue;
        }


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            Math.min(size, 4),
            0,
            Math.PI * 2
        );


        const alpha =
            Math.min(
                1,
                (1 - star.z) * 1.5
            );


        ctx.fillStyle =
            `rgba(180,210,255,${alpha})`;

        ctx.fill();
    }


    /* Candle */

    if (lab.style.display === "block") {

        drawCandle();
    }
}


/* =========================
   3D CANDLE
========================= */

function drawCandle() {

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;


    candle.rotation +=
        (candle.targetRotation -
        candle.rotation) * 0.08;


    const rot =
        Math.sin(candle.rotation) * 25;


    /* Glow */

    const glow =
        ctx.createRadialGradient(
            cx,
            cy,
            10,
            cx,
            cy,
            180
        );

    glow.addColorStop(
        0,
        "rgba(30,255,140,0.16)"
    );

    glow.addColorStop(
        1,
        "rgba(30,255,140,0)"
    );

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        180,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Shadow */

    ctx.fillStyle =
        "rgba(0,0,0,0.5)";

    ctx.beginPath();

    ctx.ellipse(
        cx,
        cy + 100,
        100,
        25,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Wick */

    ctx.strokeStyle =
        "#d9fff0";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        cx + rot * 0.25,
        cy - 135
    );

    ctx.lineTo(
        cx + rot * 0.25,
        cy - 75
    );

    ctx.stroke();


    /* Candle body */

    const width = 100;
    const height = 150;

    const left =
        cx - width / 2 + rot;

    const top =
        cy - height / 2;


    /* Front */

    const gradient =
        ctx.createLinearGradient(
            left,
            top,
            left + width,
            top
        );

    gradient.addColorStop(
        0,
        "#0b8f52"
    );

    gradient.addColorStop(
        0.5,
        "#20e982"
    );

    gradient.addColorStop(
        1,
        "#075a37"
    );


    ctx.fillStyle = gradient;

    ctx.fillRect(
        left,
        top,
        width,
        height
    );


    /* Right side */

    ctx.fillStyle =
        "#06452b";

    ctx.beginPath();

    ctx.moveTo(
        left + width,
        top
    );

    ctx.lineTo(
        left + width + 28,
        top - 15
    );

    ctx.lineTo(
        left + width + 28,
        top + height - 15
    );

    ctx.lineTo(
        left + width,
        top + height
    );

    ctx.closePath();

    ctx.fill();


    /* Top */

    ctx.fillStyle =
        "#31ff91";

    ctx.beginPath();

    ctx.ellipse(
        left + width / 2,
        top,
        width / 2,
        15,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Bottom shadow */

    ctx.fillStyle =
        "#04351f";

    ctx.fillRect(
        left,
        top + height - 12,
        width,
        12
    );
}


/* =========================
   MOUSE ROTATION
========================= */

document.addEventListener(
    "mousemove",
    function (event) {

        if (lab.style.display !== "block") {
            return;
        }

        const mouse =
            (event.clientX /
            window.innerWidth) - 0.5;

        candle.targetRotation =
            mouse * 2;
    }
);


/* =========================
   START
========================= */

button.addEventListener(
    "click",
    function () {

        home.style.display = "none";

        lab.style.display = "block";

    }
);


/* =========================
   BACK
========================= */

backBtn.addEventListener(
    "click",
    function () {

        lab.style.display = "none";

        home.style.display = "flex";

    }
);


/* =========================
   INIT
========================= */

startSpace();
