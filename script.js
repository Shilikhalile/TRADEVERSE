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
    0.5
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
   HOME FLOOR
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
   HOME GRID
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
   HOME PARTICLES
===================================================== */

const particleCount = 1000;

const particlePositions =
    new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {

    particlePositions[i * 3] =
        (Math.random() - 0.5) * 35;

    particlePositions[i * 3 + 1] =
        Math.random() * 18 - 5;

    particlePositions[i * 3 + 2] =
        (Math.random() - 0.5) * 30;
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
        opacity: 0.75
    });

const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(particles);


/* =====================================================
   HOME RINGS
===================================================== */

const rings = [];

for (let i = 0; i < 6; i++) {

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
            1.5 + i * 0.55,
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

    ring.rotation.x = Math.PI / 2;

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
   CREATE BIG CANDLE
===================================================== */

function createCandle() {

    console.log("CREATING BIG CANDLE...");

    if (!candle3D) {

        console.error(
            "ERROR: candle3D NOT FOUND"
        );

        return;
    }


    /* CLEAR OLD */

    candle3D.innerHTML = "";


    /* =================================================
       CANDLE SCENE
    ================================================= */

    candleScene =
        new THREE.Scene();

    candleScene.background =
        new THREE.Color(0x03050a);


    /* =================================================
       CAMERA
    ================================================= */

    const width =
        candle3D.clientWidth ||
        window.innerWidth;

    const height =
        candle3D.clientHeight ||
        window.innerHeight;

    candleCamera =
        new THREE.PerspectiveCamera(
            38,
            width / height,
            0.1,
            100
        );


    /*
       CAMERA CLOSE
       → makes candle BIG
    */

    candleCamera.position.set(
        4,
        2.5,
        6
    );

    candleCamera.lookAt(
        0,
        -0.3,
        0
    );


    /* =================================================
       RENDERER
    ================================================= */

    candleRenderer =
        new THREE.WebGLRenderer({
            antialias: true
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


    /* =================================================
       LIGHTING
    ================================================= */

    const candleAmbient =
        new THREE.AmbientLight(
            0xffffff,
            1.2
        );

    candleScene.add(
        candleAmbient
    );


    const candleMainLight =
        new THREE.DirectionalLight(
            0xffffff,
            5
        );

    candleMainLight.position.set(
        5,
        8,
        8
    );

    candleScene.add(
        candleMainLight
    );


    const candleGreenLight =
        new THREE.PointLight(
            0x4cffb0,
            25,
            20
        );

    candleGreenLight.position.set(
        -4,
        2,
        4
    );

    candleScene.add(
        candleGreenLight
    );


    /* =================================================
       BIG CANDLE GROUP
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
            2.2,
            4.0,
            2.2
        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x28ff91,

            metalness: 0.1,

            roughness: 0.25,

            emissive: 0x064d2b,

            emissiveIntensity: 0.7
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
            0.075,
            0.075,
            2.6,
            20
        );


    const wickMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xdde5ed,

            roughness: 0.5
        });


    const topWick =
        new THREE.Mesh(
            wickGeometry,
            wickMaterial
        );


    topWick.position.y =
        3.3;


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
        -3.3;


    candleGroup.add(
        bottomWick
    );


    /* =================================================
       OPEN MARKER
    ================================================= */

    const markerGeometry =
        new THREE.BoxGeometry(
            1.0,
            0.045,
            0.045
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
        1.5,
        -2.0,
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
            markerGeometry,
            markerMaterial
        );


    closeMarker.position.set(
        1.5,
        2.0,
        0
    );


    candleGroup.add(
        closeMarker
    );


    /* =================================================
       GLOW
    ================================================= */

    const glow =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                2.8,
                0.018,
                16,
                100
            ),
            new THREE.MeshBasicMaterial({
                color: 0x4cffb0,
                transparent: true,
                opacity: 0.25
            })
        );


    glow.rotation.x =
        Math.PI / 2;

    glow.position.y =
        -3.8;

    candleScene.add(
        glow
    );


    /* =================================================
       FLOOR
    ================================================= */

    const candleFloor =
        new THREE.Mesh(
            new THREE.CircleGeometry(
                5,
                64
            ),
            new THREE.MeshBasicMaterial({
                color: 0x08111d,
                transparent: true,
                opacity: 0.6
            })
        );


    candleFloor.rotation.x =
        -Math.PI / 2;

    candleFloor.position.y =
        -4.6;

    candleScene.add(
        candleFloor
    );


    /* =================================================
       GRID
    ================================================= */

    const candleGrid =
        new THREE.GridHelper(
            12,
            24,
            0x263044,
            0x101624
        );


    candleGrid.position.y =
        -4.58;

    candleScene.add(
        candleGrid
    );


    /* =================================================
       MOUSE DRAG
    ================================================= */

    candle3D.onmousedown =
        function(event) {

            dragging = true;

            lastX =
                event.clientX;
        };


    window.addEventListener(
        "mouseup",
        function() {

            dragging = false;

        }
    );


    window.addEventListener(
        "mousemove",
        function(event) {

            if (!dragging)
                return;

            const dx =
                event.clientX - lastX;

            candleRotation +=
                dx * 0.012;

            lastX =
                event.clientX;
        }
    );


    /* =================================================
       TOUCH
    ================================================= */

    candle3D.addEventListener(
        "touchstart",
        function(event) {

            dragging = true;

            lastX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    candle3D.addEventListener(
        "touchmove",
        function(event) {

            if (!dragging)
                return;

            const x =
                event.touches[0].clientX;

            const dx =
                x - lastX;

            candleRotation +=
                dx * 0.012;

            lastX = x;

        },
        {
            passive: true
        }
    );


    candle3D.addEventListener(
        "touchend",
        function() {

            dragging = false;

        }
    );


    /* =================================================
       ZOOM
    ================================================= */

    candle3D.addEventListener(
        "wheel",
        function(event) {

            event.preventDefault();

            candleCamera.position.z +=
                event.deltaY * 0.005;

            candleCamera.position.z =
                THREE.MathUtils.clamp(
                    candleCamera.position.z,
                    4.5,
                    10
                );

        },
        {
            passive: false
        }
    );


    console.log(
        "BIG 3D CANDLE CREATED SUCCESSFULLY"
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
        Math.sin(
            time * 1.3
        ) * 0.12;


    /* ROTATE */

    candleGroup.rotation.y =
        candleRotation;


    candleGroup.rotation.x =
        Math.sin(
            time * 0.5
        ) * 0.035;


    candleRenderer.render(
        candleScene,
        candleCamera
    );
}


/* =====================================================
   START LEARNING
===================================================== */

startBtn.addEventListener(
    "click",
    function() {

        console.log(
            "START LEARNING CLICKED"
        );


        /* INTRO */

        intro.style.display =
            "flex";

        intro.style.opacity =
            "1";


        setTimeout(
            function() {

                intro.style.opacity =
                    "0";


                setTimeout(
                    function() {

                        intro.style.display =
                            "none";


                        /* HIDE HOME */

                        homeUI.style.display =
                            "none";

                        canvas.style.display =
                            "none";


                        /* SHOW CANDLE LAB */

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


                        /* START ANIMATION */

                        animateCandle();

                    },
                    700
                );

            },
            900
        );

    }
);


/* =====================================================
   BACK
===================================================== */

backBtn.addEventListener(
    "click",
    function() {

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
        function(ring, index) {

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
    function() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        if (
            candleRenderer &&
            candleCamera &&
            candle3D
        ) {

            const width =
                candle3D.clientWidth ||
                window.innerWidth;

            const height =
                candle3D.clientHeight ||
                window.innerHeight;


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
    function() {

        setTimeout(
            function() {

                const loading =
                    document.getElementById(
                        "loading"
                    );


                if (loading) {

                    loading.style.opacity =
                        "0";


                    setTimeout(
                        function() {

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
