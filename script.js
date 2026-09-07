import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";


/* =====================================================
   ELEMENTS
===================================================== */

const canvas =
    document.getElementById("scene");

const homeUI =
    document.getElementById("homeUI");

const startBtn =
    document.getElementById("startBtn");

const intro =
    document.getElementById("intro");

const candleLab =
    document.getElementById("candleLab");

const candle3D =
    document.getElementById("candle3D");

const backBtn =
    document.getElementById("backBtn");

const nextLesson =
    document.getElementById("nextLesson");


/* =====================================================
   HOME SCENE
===================================================== */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(0x03050a);


const camera =
    new THREE.PerspectiveCamera(
        55,
        window.innerWidth /
        window.innerHeight,
        0.1,
        1000
    );


camera.position.set(
    0,
    1.5,
    9
);


const renderer =
    new THREE.WebGLRenderer({

        canvas: canvas,

        antialias: true
    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


/* =====================================================
   HOME LIGHT
===================================================== */

const ambient =
    new THREE.AmbientLight(
        0xffffff,
        0.5
    );

scene.add(ambient);


const light =
    new THREE.PointLight(
        0xffffff,
        30,
        40
    );

light.position.set(
    0,
    5,
    5
);

scene.add(light);


/* =====================================================
   HOME FLOOR
===================================================== */

const floor =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            40,
            40
        ),

        new THREE.MeshStandardMaterial({

            color: 0x050811,

            metalness: 0.8,

            roughness: 0.55
        })
    );


floor.rotation.x =
    -Math.PI / 2;

floor.position.y =
    -2;

scene.add(floor);


/* =====================================================
   HOME GRID
===================================================== */

const grid =
    new THREE.GridHelper(
        40,
        40,
        0x263044,
        0x101624
    );


grid.position.y =
    -1.98;

scene.add(grid);


/* =====================================================
   HOME PARTICLES
===================================================== */

const particleCount =
    1200;


const particlePositions =
    new Float32Array(
        particleCount * 3
    );


for (
    let i = 0;
    i < particleCount;
    i++
) {

    particlePositions[
        i * 3
    ] =
        (Math.random() - 0.5)
        * 40;


    particlePositions[
        i * 3 + 1
    ] =
        Math.random() * 22 - 6;


    particlePositions[
        i * 3 + 2
    ] =
        (Math.random() - 0.5)
        * 35;
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


for (
    let i = 0;
    i < 6;
    i++
) {

    const ring =
        new THREE.Mesh(

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


    ring.rotation.x =
        Math.PI / 2;


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
    function(event) {

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

let candleParticles = null;

let candleRings = [];

let candleRotation = 0;

let dragging = false;

let lastX = 0;

let candleStarted = false;


/* =====================================================
   CREATE CANDLE LAB
===================================================== */

function createCandle() {

    if (!candle3D) {

        console.error(
            "candle3D NOT FOUND"
        );

        return;
    }


    candle3D.innerHTML = "";


    /* ================================================
       SCENE
    ================================================ */

    candleScene =
        new THREE.Scene();

    candleScene.background =
        new THREE.Color(
            0x03050a
        );


    /* ================================================
       SIZE
    ================================================ */

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    /* ================================================
       CAMERA
    ================================================ */

    candleCamera =
        new THREE.PerspectiveCamera(

            42,

            width / height,

            0.1,

            100
        );


    candleCamera.position.set(

        4.5,

        2.8,

        9
    );


    candleCamera.lookAt(
        0,
        0,
        0
    );


    /* ================================================
       RENDERER
    ================================================ */

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


    /* ================================================
       LIGHT
    ================================================ */

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            1.1
        );


    candleScene.add(
        ambient
    );


    const mainLight =
        new THREE.DirectionalLight(
            0xffffff,
            4
        );


    mainLight.position.set(
        5,
        8,
        8
    );


    candleScene.add(
        mainLight
    );


    const greenLight =
        new THREE.PointLight(
            0x4cffb0,
            18,
            25
        );


    greenLight.position.set(
        -4,
        2,
        5
    );


    candleScene.add(
        greenLight
    );


    /* ================================================
       SPACE PARTICLES
    ================================================ */

    const count =
        1600;


    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        positions[
            i * 3
        ] =
            (Math.random() - 0.5)
            * 45;


        positions[
            i * 3 + 1
        ] =
            (Math.random() - 0.5)
            * 25;


        positions[
            i * 3 + 2
        ] =
            (Math.random() - 0.5)
            * 45;
    }


    const starGeometry =
        new THREE.BufferGeometry();


    starGeometry.setAttribute(

        "position",

        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const starMaterial =
        new THREE.PointsMaterial({

            color: 0x8fa4c7,

            size: 0.028,

            transparent: true,

            opacity: 0.7
        });


    candleParticles =
        new THREE.Points(
            starGeometry,
            starMaterial
        );


    candleScene.add(
        candleParticles
    );


    /* ================================================
       SPACE RINGS
    ================================================ */

    candleRings = [];


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(

                    4 + i * 1.5,

                    0.008,

                    12,

                    100
                ),

                new THREE.MeshBasicMaterial({

                    color: 0x50688f,

                    transparent: true,

                    opacity: 0.12
                })
            );


        ring.position.set(

            0,

            -2 + i * 0.3,

            -5 - i * 1.5
        );


        ring.rotation.x =
            Math.PI / 2;


        candleScene.add(
            ring
        );


        candleRings.push(
            ring
        );
    }


    /* ================================================
       CANDLE GROUP
    ================================================ */

    candleGroup =
        new THREE.Group();


    candleScene.add(
        candleGroup
    );


    /* ================================================
       SMALL / MEDIUM BODY
    ================================================ */

    const bodyGeometry =
        new THREE.BoxGeometry(

            1.25,

            2.6,

            1.25
        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x28ff91,

            metalness: 0.1,

            roughness: 0.28,

            emissive: 0x064d2b,

            emissiveIntensity: 0.55
        });


    const body =
        new THREE.Mesh(

            bodyGeometry,

            bodyMaterial
        );


    body.position.y =
        0;


    candleGroup.add(
        body
    );


    /* ================================================
       TOP WICK
    ================================================ */

    const wickGeometry =
        new THREE.CylinderGeometry(

            0.045,

            0.045,

            1.7,

            16
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
        2.15;


    candleGroup.add(
        topWick
    );


    /* ================================================
       BOTTOM WICK
    ================================================ */

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


    /* ================================================
       OPEN MARKER
    ================================================ */

    const markerGeometry =
        new THREE.BoxGeometry(

            0.65,

            0.025,

            0.025
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

        0.95,

        -1.3,

        0
    );


    candleGroup.add(
        openMarker
    );


    /* ================================================
       CLOSE MARKER
    ================================================ */

    const closeMarker =
        new THREE.Mesh(

            markerGeometry,

            markerMaterial
        );


    closeMarker.position.set(

        0.95,

        1.3,

        0
    );


    candleGroup.add(
        closeMarker
    );


    /* ================================================
       GLOW
    ================================================ */

    const glow =
        new THREE.Mesh(

            new THREE.TorusGeometry(

                2.1,

                0.012,

                16,

                100
            ),

            new THREE.MeshBasicMaterial({

                color: 0x4cffb0,

                transparent: true,

                opacity: 0.22
            })
        );


    glow.rotation.x =
        Math.PI / 2;


    glow.position.y =
        -2.5;


    candleScene.add(
        glow
    );


    /* ================================================
       FLOOR
    ================================================ */

    const floor =
        new THREE.Mesh(

            new THREE.CircleGeometry(
                12,
                64
            ),

            new THREE.MeshBasicMaterial({

                color: 0x08111d,

                transparent: true,

                opacity: 0.35
            })
        );


    floor.rotation.x =
        -Math.PI / 2;


    floor.position.y =
        -2.9;


    candleScene.add(
        floor
    );


    /* ================================================
       GRID
    ================================================ */

    const grid =
        new THREE.GridHelper(

            35,

            35,

            0x263044,

            0x101624
        );


    grid.position.y =
        -2.88;


    candleScene.add(
        grid
    );


    /* ================================================
       MOUSE DRAG
    ================================================ */

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
                event.clientX -
                lastX;


            candleRotation +=
                dx * 0.012;


            lastX =
                event.clientX;
        }
    );


    /* ================================================
       TOUCH
    ================================================ */

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


    /* ================================================
       ZOOM
    ================================================ */

    candle3D.addEventListener(
        "wheel",
        function(event) {

            event.preventDefault();


            candleCamera.position.z +=
                event.deltaY * 0.005;


            candleCamera.position.z =
                THREE.MathUtils.clamp(

                    candleCamera.position.z,

                    6,

                    13
                );

        },
        {
            passive: false
        }
    );


    candleStarted = true;
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


    /* Candle floating */

    candleGroup.position.y =
        Math.sin(
            time * 1.2
        ) * 0.08;


    /* Candle rotation */

    candleGroup.rotation.y =
        candleRotation;


    candleGroup.rotation.x =
        Math.sin(
            time * 0.5
        ) * 0.025;


    /* Space movement */

    if (candleParticles) {

        candleParticles.rotation.y =
            time * 0.012;

        candleParticles.rotation.x =
            Math.sin(
                time * 0.08
            ) * 0.025;
    }


    /* Rings movement */

    candleRings.forEach(
        function(ring, index) {

            ring.rotation.z =
                time *
                (
                    0.025 +
                    index * 0.006
                );


            ring.position.y =
                -2 +
                index * 0.3 +
                Math.sin(
                    time * 0.4 +
                    index
                ) * 0.08;
        }
    );


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
            "START LEARNING"
        );


        startBtn.disabled =
            true;


        intro.style.display =
            "flex";


        requestAnimationFrame(
            function() {

                intro.style.opacity =
                    "1";
            }
        );


        setTimeout(
            function() {

                intro.style.opacity =
                    "0";


                setTimeout(
                    function() {

                        intro.style.display =
                            "none";


                        homeUI.style.display =
                            "none";


                        canvas.style.display =
                            "none";


                        candleLab.style.display =
                            "block";


                        candleLab.style.visibility =
                            "visible";


                        candleLab.style.opacity =
                            "1";


                        candleLab.style.pointerEvents =
                            "auto";


                        if (!candleStarted) {

                            createCandle();

                            animateCandle();

                        }


                        startBtn.disabled =
                            false;

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


        homeU
               
