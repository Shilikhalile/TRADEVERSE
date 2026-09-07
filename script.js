import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";


/* =====================================================
   HOME 3D SPACE
===================================================== */

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


/* =====================================================
   LIGHT
===================================================== */

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


/* =====================================================
   FLOOR
===================================================== */

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


/* =====================================================
   GRID
===================================================== */

const grid =
    new THREE.GridHelper(
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


/* =====================================================
   FLOATING RINGS
===================================================== */

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


/* =====================================================
   HOME MOUSE
===================================================== */

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


/* =====================================================
   HTML
===================================================== */

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

const candleContainer =
    document.getElementById(
        "candle3D"
    );


/* =====================================================
   CANDLESTICK 3D
===================================================== */

let candleScene;
let candleCamera;
let candleRenderer;

let candleGroup;

let candleDragging = false;

let previousMouseX = 0;

let candleRotation = 0;


/* =====================================================
   CREATE 3D CANDLE
===================================================== */

function createCandle3D() {

    if (!candleContainer) return;


    /* SCENE */

    candleScene =
        new THREE.Scene();

    candleScene.background =
        new THREE.Color(
            0x03050a
        );


    /* CAMERA */

    candleCamera =
        new THREE.PerspectiveCamera(
            45,
            candleContainer.clientWidth /
            candleContainer.clientHeight,
            0.1,
            100
        );

    candleCamera.position.set(
        4,
        3,
        7
    );


    candleCamera.lookAt(
        0,
        0,
        0
    );


    /* RENDERER */

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
        candleContainer.clientWidth,
        candleContainer.clientHeight
    );


    candleContainer.appendChild(
        candleRenderer.domElement
    );


    /* =================================================
       LIGHTS
    ================================================= */

    const candleAmbient =
        new THREE.AmbientLight(
            0xffffff,
            0.5
        );

    candleScene.add(
        candleAmbient
    );


    const candleLight =
        new THREE.PointLight(
            0xffffff,
            25,
            30
        );

    candleLight.position.set(
        4,
        5,
        6
    );

    candleScene.add(
        candleLight
    );


    const rimLight =
        new THREE.PointLight(
            0x4cffb0,
            12,
            20
        );

    rimLight.position.set(
        -4,
        2,
        -3
    );

    candleScene.add(
        rimLight
    );


    /* =================================================
       CANDLE GROUP
    ================================================= */

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
            2.7,
            1.5
        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x22ff9a,

            metalness: 0.15,

            roughness: 0.28,

            emissive: 0x073d26,

            emissiveIntensity: 0.35

        });


    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );


    body.position.y = 0;

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
            1.6,
            16
        );


    const wickMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xdce5ed,

            metalness: 0.2,

            roughness: 0.45
        });


    const topWick =
        new THREE.Mesh(
            wickGeometry,
            wickMaterial
        );


    topWick.position.y =
        2.15;


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
        -2.15;


    candleGroup.add(
        bottomWick
    );


    /* =================================================
       OPEN MARKER
    ================================================= */

    const openGeometry =
        new THREE.BoxGeometry(
            0.35,
            0.04,
            0.04
        );


    const markerMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });


    const openMarker =
        new THREE.Mesh(
            openGeometry,
            markerMaterial
        );


    openMarker.position.set(
        0.9,
        -1.35,
        0
    );


    candleGroup.add(
        openMarker
    );


    /* =================================================
       CLOSE MARKER
    ================================================= */

    const closeMarker =
        new THREE.Mesh(
            openGeometry,
            markerMaterial
        );


    closeMarker.position.set(
        0.9,
        1.35,
        0
    );


    candleGroup.add(
        closeMarker
    );


    /* =================================================
       FLOOR
    ================================================= */

    const floorGeometry =
        new THREE.CircleGeometry(
            3.5,
            64
        );


    const floorMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x0b121d,

            transparent: true,

            opacity: 0.5
        });


    const candleFloor =
        new THREE.Mesh(
            floorGeometry,
            floorMaterial
        );


    candleFloor.rotation.x =
        -Math.PI / 2;


    candleFloor.position.y =
        -3;


    candleScene.add(
        candleFloor
    );


    /* =================================================
       GRID FLOOR
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
       MOUSE DRAG
    ================================================= */

    candleContainer.addEventListener(
        "mousedown",
        (event) => {

            candleDragging = true;

            previousMouseX =
                event.clientX;

        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            candleDragging = false;

        }
    );


    window.addEventListener(
        "mousemove",
        (event) => {

            if (!candleDragging)
                return;


            const difference =
                event.clientX -
                previousMouseX;


            candleRotation +=
                difference * 0.01;


            previousMouseX =
                event.clientX;

        }
    );


    /* =================================================
       TOUCH SUPPORT
    ================================================= */

    candleContainer.addEventListener(
        "touchstart",
        (event) => {

            if (
                event.touches.length === 1
            ) {

                candleDragging = true;

                previousMouseX =
                    event.touches[0].clientX;

            }

        },
        { passive: true }
    );


    candleContainer.addEventListener(
        "touchend",
        () => {

            candleDragging = false;

        }
    );


    candleContainer.addEventListener(
        "touchmove",
        (event) => {

            if (!candleDragging)
                return;


            const currentX =
                event.touches[0].clientX;


            const difference =
                currentX -
                previousMouseX;


            candleRotation +=
                difference * 0.01;


            previousMouseX =
                currentX;

        },
        { passive: true }
    );


    /* =================================================
       ZOOM
    ================================================= */

    candleContainer.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();

            candleCamera.position.z +=
                event.deltaY * 0.005;


            candleCamera.position.z =
                THREE.MathUtils.clamp(
                    candleCamera.position.z,
                    4,
                    12
                );

        },
        { passive: false }
    );


    /* =================================================
       RENDER
    ================================================= */

    animateCandle();

}


/* =====================================================
   CANDLE ANIMATION
===================================================== */

const candleClock =
    new THREE.Clock();


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
        candleClock.getElapsedTime();


    /* FLOATING */

    candleGroup.position.y =
        Math.sin(
            time * 1.5
        ) * 0.08;


    /* ROTATION */

    candleGroup.rotation.y =
        candleRotation;


    candleGroup.rotation.x =
        Math.sin(
            time * 0.5
        ) * 0.04;


    candleRenderer.render(
        candleScene,
        candleCamera
    );

}


/* =====================================================
   START LEARNING
===================================================== */

startButton.addEventListener(
    "click",
    () => {

        intro.style.display =
            "flex";


        requestAnimationFrame(
            () => {

                intro.style.opacity =
                    "1";

            }
        );


        setTimeout(
            () => {

                intro.style.opacity =
                    "0";


                setTimeout(
                    () => {

                        intro.style.display =
                            "none";


                        /* CANDLE MODE */

                        document.body.classList.add(
                            "candle-mode"
                        );


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


                        /* CREATE 3D CANDLE */

                        if (!candleRenderer) {

                            createCandle3D();

                        }

                    },
                    500
                );

            },
            1800
        );

    }
);


/* =====================================================
   BACK
===================================================== */

backButton.addEventListener(
    "click",
    () => {

        document.body.classList.remove(
            "candle-mode"
        );


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


        canvas.style.visibility =
            "visible";


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

const homeClock =
    new THREE.Clock();


function animateHome() {

    requestAnimationFrame(
        animateHome
    );


    const elapsed =
        homeClock.getElapsedTime();


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
            candleContainer
        ) {

            candleCamera.aspect =
                candleContainer.clientWidth /
                candleContainer.clientHeight;


            candleCamera.updateProjectionMatrix();


            candleRenderer.setSize(
                candleContainer.clientWidth,
                candleContainer.clientHeight
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
