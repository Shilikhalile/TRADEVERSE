const button = document.getElementById("startBtn");
const home = document.getElementById("home");
const lab = document.getElementById("lab");
const backBtn = document.getElementById("backBtn");
const canvas = document.getElementById("space");

let ctx;
let stars = [];
let animation;


/* =========================
   3D SPACE
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
   ANIMATION
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
}


/* =========================
   START LEARNING
========================= */

button.addEventListener(
    "click",
    function () {

        home.style.display = "none";

        lab.style.display = "block";

        startSpace();

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
   START
========================= */

startSpace();
