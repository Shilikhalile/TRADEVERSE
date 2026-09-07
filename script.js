const button = document.getElementById("startBtn");

let canvas;
let ctx;

function createSpace() {

    canvas = document.createElement("canvas");

    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";

    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");

    resize();

    window.addEventListener("resize", resize);

    animate();
}


function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


const stars = [];

for (let i = 0; i < 500; i++) {

    stars.push({

        x: Math.random(),
        y: Math.random(),

        size:
            Math.random() * 2 + 0.3,

        speed:
            Math.random() * 0.0005 + 0.0002
    });
}


function animate() {

    requestAnimationFrame(animate);

    ctx.fillStyle = "#03050a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (const star of stars) {

        star.y += star.speed;

        if (star.y > 1) {
            star.y = 0;
        }

        const x =
            star.x * canvas.width;

        const y =
            star.y * canvas.height;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(150,180,220,0.7)";

        ctx.fill();
    }
}


createSpace();


/* =========================
   START LEARNING
========================= */

button.addEventListener(
    "click",
    function () {

        alert(
            "3D SPACE READY"
        );

    }
);
