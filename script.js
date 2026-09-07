import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";


/* =========================================
   BASIC SETUP
========================================= */

const canvas = document.getElementById("scene");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x03050a);


const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 1.5, 9);


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


/* =========================================
   LIGHT
========================================= */

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.35
    );

scene.add(ambientLight);


const mainLight =
    new THREE.PointLight(
        0xffffff,
        35,
        30
    );

mainLight.position.set(
    0,
    4,
    3
);

scene.add(mainLight);


/* =========================================
   FLOOR
========================================= */

const floorGeometry =
    new THREE.PlaneGeometry(
        40,
        40
    );

const floorMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x050811,
        metalness: 0.8,
        roughness: 0.55
    });

const floor =
    new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );

floor.rotation.x =
    -Math.PI / 2;

floor.position.y = -2;

scene.add(floor);


/* =========================================
   GRID
========================================= */

const grid =
    new THREE.GridHelper(
        40,
        40,
        0x263044,
        0x101624
    );

grid.position.y = -1.98;

scene.add(grid);


/* =========================================
   PARTICLES
========================================= */

const particleCount = 900;

const particleGeometry =
    new THREE.BufferGeometry();

const positions =
    new Float32Array(
        particleCount * 3
    );


for (
    let i = 0;
    i < particleCount;
    i++
) {

    positions[i * 3] =
        (Math.random() - 0.5) * 30;

    positions[i * 3 + 1] =
        Math.random() * 15 - 4;

    positions[i * 3 + 2] =
        (Math.random() - 0.5) * 25;
}


particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({
        color: 0x8fa4c7,
        size: 0.025,
        transparent: true,
        opacity: 0.7
    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(particles);


/* =========================================
   FLOATING RINGS
========================================= */

const rings = [];


for (let i = 0; i < 5; i++) {

    const geometry =
        new THREE.TorusGeometry(
            1.5 + i * 0.5,
            0.008,
            12,
            100
        );


    const material =
        new THREE.MeshBasicMaterial({
            color: 0x50688f,
            transparent: true,
            opacity: 0.18
        });


    const ring =
        new THREE.Mesh(
            geometry,
            material
        );


    ring.position.set(
        2,
        -0.2 + i * 0.15,
        -2 - i * 0.4
    );


    ring.rotation.x =
        Math.PI / 2 + i * 0.1;


    scene.add(ring);

    rings.push(ring);
}


/* =========================================
   MOUSE
========================================= */

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;


window.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            event.clientX /
            window.innerWidth -
            0.5;

        mouseY =
            event.clientY /
            window.innerHeight -
            0.5;

    }
);


/* =========================================
   HTML ELEMENTS
========================================= */

const startButton =
    document.getElementById(
        "startBtn"
    );

const intro =
    document.getElementById(
        "intro"
    );

const homeUI =
    document.getElementById(
        "homeUI"
    );

const candleLab =
    document.getElementById(
        "candleLab"
    );

const backButton =
    document.getElementById(
        "backBtn"
    );


/* =========================================
   START LEARNING
========================================= */

startButton.addEventListener(
    "click",
    () => {

        /* INTRO */

        intro.style.display = "flex";

        requestAnimationFrame(() => {

            intro.style.opacity = "1";

        });


        /* TRANSITION */

        setTimeout(() => {

            intro.style.opacity = "0";


            setTimeout(() => {

                intro.style.display =
                    "none";


                /* ACTIVATE CANDLE MODE */

                document.body.classList.add(
                    "candle-mode"
                );


                /* HIDE HOME */

                homeUI.style.display =
                    "none";

                homeUI.style.visibility =
                    "hidden";

                homeUI.style.opacity =
                    "0";


                /* HIDE 3D */

                canvas.style.display =
                    "none";

                canvas.style.visibility =
                    "hidden";


                /* SHOW LAB */

                candleLab.style.display =
                    "flex";

                candleLab.style.visibility =
                    "visible";

                candleLab.style.opacity =
                    "1";

                candleLab.style.pointerEvents =
                    "auto";


            }, 500);

        }, 1800);

    }
);


/* =========================================
   BACK TO HOME
========================================= */

backButton.addEventListener(
    "click",
    () => {

        /* REMOVE CANDLE MODE */

        document.body.classList.remove(
            "candle-mode"
        );


        /* HIDE LAB */

        candleLab.style.display =
            "none";

        candleLab.style.visibility =
            "hidden";

        candleLab.style.opacity =
            "0";

        candleLab.style.pointerEvents =
            "none";


        /* SHOW 3D */

        canvas.style.display =
            "block";

        canvas.style.visibility =
            "visible";


        /* SHOW HOME */

        homeUI.style.display =
            "flex";

        homeUI.style.visibility =
            "visible";

        homeUI.style.opacity =
            "1";

        homeUI.style.pointerEvents =
            "auto";

    }
);


/* =========================================
   3D ANIMATION
========================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const elapsed =
        clock.getElapsedTime();


    targetX +=
        (
            mouseX * 0.8 -
            targetX
        ) * 0.035;


    targetY +=
        (
            mouseY * 0.45 -
            targetY
        ) * 0.035;


    camera.position.x =
        targetX;


    camera.position.y =
        1.5 - targetY;


    camera.lookAt(
        targetX * 0.3,
        0,
        -1
    );


    particles.rotation.y =
        elapsed * 0.015;


    particles.rotation.x =
        Math.sin(
            elapsed * 0.08
        ) * 0.03;


    rings.forEach(
        (ring, index) => {

            ring.rotation.z =
                elapsed *
                (
                    0.08 +
                    index * 0.015
                );


            ring.position.y =
                -0.2 +
                index * 0.15 +
                Math.sin(
                    elapsed * 0.6 +
                    index
                ) * 0.05;

        }
    );


    renderer.render(
        scene,
        camera
    );
}


animate();


/* =========================================
   RESIZE
========================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* =========================================
   LOADING
========================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            const loading =
                document.getElementById(
                    "loading"
                );


            if (loading) {

                loading.style.opacity =
                    "0";


                setTimeout(() => {

                    loading.style.display =
                        "none";

                }, 800);

            }

        }, 900);

    }
);
