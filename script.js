import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";


/* =====================================================
   ELEMENTS
===================================================== */

const canvas = document.getElementById("scene");
const homeUI = document.getElementById("homeUI");
const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");

const candleLab = document.getElementById("candleLab");
const candle3D = document.getElementById("candle3D");
const backBtn = document.getElementById("backBtn");


/* =====================================================
   HOME 3D SPACE
===================================================== */

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
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


/* =====================================================
   HOME LIGHT
===================================================== */

const ambient = new THREE.AmbientLight(
    0xffffff,
    0.4
);

scene.add(ambient);


const light = new THREE.PointLight(
    0xffffff,
    30,
    40
);

light.position.set(0, 5, 5);

scene.add(light);


/* =====================================================
   FLOOR
===================================================== */

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({
        color: 0x050811,
        metalness: 0.8,
        roughness: 0.55
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;

scene.add(floor);


/* =====================================================
   GRID
===================================================== */

const grid = new THREE.GridHelper(
    40,
    40,
    0x263044,
    0x101624
);

grid.position.y = -1.98;

scene.add(grid);


/* =====================================================
   PARTICLES
===================================================== */

const particleCount = 900;

const particlePositions =
    new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {

    particlePositions[i * 3] =
        (Math.random() - 0.5) * 30;

    particlePositions[i * 3 + 1] =
        Math.random() * 15 - 4;

    particlePositions[i * 3 + 2] =
        (Math.random() - 0.5) * 25;
}


const particleGeometry =
    new THREE.BufferGeometry();

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        particlePositions,
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


/* =====================================================
   RINGS
===================================================== */

const rings = [];

for (let i = 0; i < 5; i++) {

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
            1.5 + i * 0.5,
            0.008,
            12,
            100
        ),
        new THREE.MeshBasicMaterial({
            color: 0x50688f,
            transparent: true,
            opacity: 0.18
        })
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


/* =====================================================
   HOME MOUSE
===================================================== */

let mouseX = 0;
let mouseY = 0;

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


/* =====================================================
   CANDLE VARIABLES
===================================================== */

let candleScene = null;
let candleCamera = null;
let candleRenderer = null;
let candleGroup = null;

let candleRotation = 0;

let dragging = false;
let lastX = 0;


/* =====================================================
   CREATE CANDLE
===================================================== */

function createCandle() {

    if (!candle3D) {
        console.error("candle3D not found");
        return;
    }


    /* Remove old canvas */

    candle3D.innerHTML = "";


    /* -------------------------------------------------
       SCENE
    ------------------------------------------------- */

    candleScene = new THREE.Scene();

    candleScene.background =
        new THREE.Color(0x03050a);


    /* -------------------------------------------------
       CAMERA
    ------------------------------------------------- */

    const width =
        candle3D.clientWidth || 600;

    const height =
        candle3D.clientHeight || 500;


    candleCamera =
        new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            100
        );


    candleCamera.position.set(
        4,
        2.8,
        7
    );


    candleCamera.lookAt(
        0,
        0,
        0
    );


    /* -------------------------------------------------
       RENDERER
    ------------------------------------------------- */

    candleRenderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });


    candleRenderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    candleRenderer.setSize(
        width,
        height
    );


    candle3D.appendChild(
        candleRenderer.domElement
    );


    /* -------------------------------------------------
       LIGHTS
    ------------------------------------------------- */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            0.7
        );

    candleScene.add(
        ambientLight
    );


    const mainLight =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    mainLight.position.set(
        4,
        6,
        6
    );

    candleScene.add(
        mainLight
    );


    const greenLight =
        new THREE.PointLight(
            0x4cffb0,
            12,
            15
        );

    greenLight.position.set(
        -4,
        2,
        -4
    );

    candleScene.add(
        greenLight
    );


    /* -------------------------------------------------
       CANDLE GROUP
    ------------------------------------------------- */

    candleGroup =
        new THREE.Group();

    candleScene.add(
        candleGroup
    );


    /* =================================================
       CANDLE BODY
    ================================================= */

    const bodyGeometry =
        new THREE.BoxGeometry(
            1.5,
            2.6,
            1.5
        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x35ff9f,
            metalness: 0.15,
            roughness: 0.3,
            emissive: 0x073d26,
            emissiveIntensity: 0.5
        });


    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );


    candleGroup.add(
        body
    );


    /* =================================================
       TOP WICK
    ================================================= */

    const wickGeometry =
        new THREE.CylinderGeometry(
            0.055,
            0.055,
            1.8,
            16
        );


    const wickMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xe0e7ee,
            roughness: 0.5
        });


    const topWick =
        new THREE.Mesh(
            wickGeometry,
            wickMaterial
        );


    topWick.position.y =
        2.2;


    candleGroup.add(
        topWick
    );


    /* =================================================
       BOTTOM WICK
    ================================================= */

    const bottomWick =
        new THREE.Mesh(
            wickGeometry,
            wickMaterial
        );


    bottomWick.position.y =
        -2.2;


    candleGroup.add(
        bottomWick
    );


    /* =================================================
       OPEN LINE
    ================================================= */

    const markerGeometry =
        new THREE.BoxGeometry(
            0.7,
            0.035,
            0.035
        );


    const markerMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });


    const openMarker =
        new THREE.Mesh(
            markerGeometry,
            markerMaterial
        );


    openMarker.position.set(
        1.05,
        -1.3,
        0
    );


    candleGroup.add(
        openMarker
    );


    /* =================================================
       CLOSE LINE
    ================================================= */

    const closeMarker =
        new THREE.Mesh(
            markerGeometry,
            markerMaterial
        );


    closeMarker.position.set(
        1.05,
        1.3,
        0
    );


    candleGroup.add(
        closeMarker
    );


    /* =================================================
       GROUND
    ================================================= */

    const ground =
        new THREE.Mesh(
            new THREE.CircleGeometry(
                3.5,
                64
            ),
            new THREE.MeshBasicMaterial({
                color: 0x0b121d,
                transparent: true,
                opacity: 0.5
            })
        );


    ground.rotation.x =
        -Math.PI / 2;


    ground.position.y =
        -3;


    candleScene.add(
        ground
    );


    /* =================================================
       GRID
    ================================================= */

    const candleGrid =
        new THREE.GridHelper(
            8,
            16,
            0x263044,
            0x101624
        );


    candleGrid.position.y =
        -2.98;


    candleScene.add(
        candleGrid
    );


    /* =================================================
       DRAG
    ================================================= */

    candle3D.onmousedown =
        (event) => {

            dragging = true;

            lastX =
                event.clientX;

        };


    window.onmouseup =
        () => {

            dragging = false;

        };


    window.onmousemove =
        (event) => {

            if (!dragging)
                return;


            const dx =
                event.clientX - lastX;


            candleRotation +=
                dx * 0.01;


            lastX =
                event.clientX;

        };


    /* =================================================
       TOUCH
    ================================================= */

    candle3D.ontouchstart =
        (event) => {

            dragging = true;

            lastX =
                event.touches[0].clientX;

        };


    candle3D.ontouchend =
        () => {

            dragging = false;

        };


    candle3D.ontouchmove =
        (event) => {

            if (!dragging)
                return;


            const x =
                event.touches[0].clientX;


            const dx =
                x - lastX;


            candleRotation +=
                dx * 0.01;


            lastX =
                x;

        };


    /* =================================================
       ZOOM
    ================================================= */

    candle3D.onwheel =
        (event) => {

            event.preventDefault();


            candleCamera.position.z +=
                event.deltaY * 0.005;


            candleCamera.position.z =
                THREE.MathUtils.clamp(
                    candleCamera.position.z,
                    4.5,
                    12
                );

        };


    console.log(
        "3D CANDLE CREATED"
    );
}


/* =====================================================
   CANDLE ANIMATION
===================================================== */

function animateCandle() {

    requestAnimationFrame(
        animateCandle
    );


    if (
        !candleRenderer ||
        !candleScene ||
        !candleCamera ||
        !candleGroup
    ) {
        return;
    }


    const time =
        performance.now() * 0.001;


    /* FLOAT */

    candleGroup.position.y =
        Math.sin(time * 1.5) * 0.08;


    /* ROTATE */

    candleGroup.rotation.y =
        candleRotation;


    candleGroup.rotation.x =
        Math.sin(time * 0.5) * 0.03;


    candleRenderer.render(
        candleScene,
        candleCamera
    );

}


/* =====================================================
   START
===================================================== */

startBtn.addEventListener(
    "click",
    () => {

        intro.style.display =
            "flex";

        intro.style.opacity =
            "1";


        setTimeout(
            () => {

                intro.style.opacity =
                    "0";


                setTimeout(
                    () => {

                        intro.style.display =
                            "none";


                        /* HOME OFF */

                        homeUI.style.display =
                            "none";

                        canvas.style.display =
                            "none";


                        /* LAB ON */

                        candleLab.style.display =
                            "flex";

                        candleLab.style.visibility =
                            "visible";

                        candleLab.style.opacity =
                            "1";

                        candleLab.style.pointerEvents =
                            "auto";


                        /* CREATE CANDLE */

                        createCandle();


                        /* START CANDLE LOOP */

                        animateCandle();

                    },
                    600
                );

            },
            1200
        );

    }
);


/* =====================================================
   BACK
===================================================== */

backBtn.addEventListener(
    "click",
    () => {

        candleLab.style.display =
            "none";

        candleLab.style.visibility =
            "hidden";

        candleLab.style.opacity =
            "0";

        candleLab.style.pointerEvents =
            "none";


        canvas.style.display =
            "block";


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


/* =====================================================
   HOME ANIMATION
===================================================== */

const clock =
    new THREE.Clock();


function animateHome() {

    requestAnimationFrame(
        animateHome
    );


    const time =
        clock.getElapsedTime();


    camera.position.x +=
        (
            mouseX * 0.8 -
            camera.position.x
        ) * 0.02;


    camera.position.y +=
        (
            1.5 -
            mouseY * 0.45 -
            camera.position.y
        ) * 0.02;


    camera.lookAt(
        0,
        0,
        -1
    );


    particles.rotation.y =
        time * 0.015;


    particles.rotation.x =
        Math.sin(
            time * 0.08
        ) * 0.03;


    rings.forEach(
        (ring, index) => {

            ring.rotation.z =
                time *
                (
                    0.08 +
                    index * 0.015
                );


            ring.position.y =
                -0.2 +
                index * 0.15 +
                Math.sin(
                    time * 0.6 +
                    index
                ) * 0.05;

        }
    );


    renderer.render(
        scene,
        camera
    );

}


animateHome();


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {

        /* HOME */

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        /* CANDLE */

        if (
            candleRenderer &&
            candleCamera &&
            candle3D
        ) {

            const width =
                candle3D.clientWidth;

            const height =
                candle3D.clientHeight;


            candleCamera.aspect =
                width / height;


            candleCamera.updateProjectionMatrix();


            candleRenderer.setSize(
                width,
                height
            );

        }

    }
);


/* =====================================================
   LOADING
===================================================== */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                const loading =
                    document.getElementById(
                        "loading"
                    );


                if (loading) {

                    loading.style.opacity =
                        "0";


                    setTimeout(
                        () => {

                            loading.style.display =
                                "none";

                        },
                        800
                    );

                }

            },
            900
        );

    }
);
