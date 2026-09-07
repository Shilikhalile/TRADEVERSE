import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";


/* =========================================
   ELEMENTS
========================================= */

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


/* =========================================
   HOME 3D SPACE
========================================= */

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


/* =========================================
   HOME LIGHT
========================================= */

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


/* =========================================
   FLOOR
========================================= */

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


grid.position.y =
    -1.98;

scene.add(grid);


/* =========================================
   PARTICLES
========================================= */

const particleCount = 1000;


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
        (Math.random() - 0.5) * 35;

    positions[i * 3 + 1] =
        Math.random() * 18 - 5;

    positions[i * 3 + 2] =
        (Math.random() - 0.5) * 30;

}


const particleGeometry =
    new THREE.BufferGeometry();


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

        opacity: 0.75

    });


const particles =
    new THREE.Points(

        particleGeometry,

        particleMaterial

    );


scene.add(particles);


/* =========================================
   RINGS
========================================= */

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


/* =========================================
   HOME MOUSE
========================================= */

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


/* =========================================
   CANDLE VARIABLES
========================================= */

let candleScene = null;

let candleCamera = null;

let candleRenderer = null;

let candleGroup = null;

let candleRotation = 0;

let dragging = false;

let lastX = 0;

let candleStarted = false;


/* =========================================
   CREATE CANDLE
========================================= */

function createCandle() {

    candle3D.innerHTML = "";


    /* -------------------------------------
       SCENE
    ------------------------------------- */

    candleScene =
        new THREE.Scene();


    candleScene.background =
        new THREE.Color(
            0x03050a
        );


    /* -------------------------------------
       CAMERA
    ------------------------------------- */

    const width =
        candle3D.clientWidth ||
        window.innerWidth;


    const height =
        candle3D.clientHeight ||
        window.innerHeight;


    candleCamera =
        new THREE.PerspectiveCamera(

            42,

            width / height,

            0.1,

            100

        );


    /* CAMERA CLOSE TO CANDLE */

    candleCamera.position.set(
        4,
        2.5,
        6
    );


    candleCamera.lookAt(
        0,
        0,
        0
    );


    /* -------------------------------------
       RENDERER
    ------------------------------------- */

    candleRenderer =
        new THREE.WebGLRenderer({

            antialias: true,

            alpha: false

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


    /* =====================================
       LIGHTS
    ===================================== */

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            1
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
        7
    );


    candleScene.add(
        mainLight
    );


    const greenLight =
        new THREE.PointLight(
            0x4cffb0,
            20,
            20
        );


    greenLight.position.set(
        -4,
        3,
        3
    );


    candleScene.add(
        greenLight
    );


    /* =====================================
       CANDLE GROUP
    ===================================== */

    candleGroup =
        new THREE.Group();


    candleScene.add(
        candleGroup
    );


    /* =====================================
       BODY
    ===================================== */

    const bodyGeometry =
        new THREE.BoxGeometry(

            2.2,

            3.8,

            2.2

        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x35ff9f,

            metalness: 0.15,

            roughness: 0.25,

            emissive: 0x073d26,

            emissiveIntensity: 0.55

        });


    const body =
        new THREE.Mesh(

            bodyGeometry,

            bodyMaterial

        );


    candleGroup.add(
        body
    );


    /* =====================================
       TOP WICK
    ===================================== */

    const wickGeometry =
        new THREE.CylinderGeometry(

            0.07,

            0.07,

            2.5,

            16

        );


    const wickMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xdce4ec,

            roughness: 0.5

        });


    const topWick =
        new THREE.Mesh(

            wickGeometry,

            wickMaterial

        );


    topWick.position.y =
        3.1;


    candleGroup.add(
        topWick
    );


    /* =====================================
       BOTTOM WICK
    ===================================== */

    const bottomWick =
        new THREE.Mesh(

            wickGeometry,

            wickMaterial

        );


    bottomWick.position.y =
        -3.1;


    candleGroup.add(
        bottomWick
    );


    /* =====================================
       OPEN MARKER
    ===================================== */

    const markerGeometry =
        new THREE.BoxGeometry(

            0.9,

            0.04,

            0.04

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

        1.45,

        -1.9,

        0

    );


    candleGroup.add(
        openMarker
    );


    /* =====================================
       CLOSE MARKER
    ===================================== */

    const closeMarker =
        new THREE.Mesh(

            markerGeometry,

            markerMaterial

        );


    closeMarker.position.set(

        1.45,

        1.9,

        0

    );


    candleGroup.add(
        closeMarker
    );


    /* =====================================
       GLOW RING
    ===================================== */

    const glow =
        new THREE.Mesh(

            new THREE.TorusGeometry(

                2.7,

                0.015,

                12,

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
        -3.05;


    candleScene.add(
        glow
    );


    /* =====================================
       FLOOR
    ===================================== */

    const ground =
        new THREE.Mesh(

            new THREE.CircleGeometry(
                5,
                64
            ),

            new THREE.MeshBasicMaterial({

                color: 0x08111d,

                transparent: true,

                opacity: 0.55

            })

        );


    ground.rotation.x =
        -Math.PI / 2;


    ground.position.y =
        -4.5;


    candleScene.add(
        ground
    );


    /* =====================================
       GRID
    ===================================== */

    const candleGrid =
        new THREE.GridHelper(

            12,

            24,

            0x263044,

            0x101624

        );


    candleGrid.position.y =
        -4.48;


    candleScene.add(
        candleGrid
    );


    /* =====================================
       MOUSE ROTATION
    ===================================== */

    candle3D.onmousedown =
        (event) => {

            dragging = true;

            lastX =
                event.clientX;

        };


    window.addEventListener(
        "mouseup",
        () => {

            dragging = false;

        }
    );


    window.addEventListener(
        "mousemove",
        (event) => {

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


    /* =====================================
       TOUCH
    ===================================== */

    candle3D.addEventListener(
        "touchstart",
        (event) => {

            dragging = true;

            lastX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    candle3D.addEventListener(
        "touchend",
        () => {

            dragging = false;

        }
    );


    candle3D.addEventListener(
        "touchmove",
        (event) => {

            if (!dragging)
                return;


            const x =
                event.touches[0].clientX;


            const dx =
                x - lastX;


            candleRotation +=
                dx * 0.012;


            lastX =
                x;

        },
        {
            passive: true
        }
    );


    /* =====================================
       ZOOM
    ===================================== */

    candle3D.addEventListener(
        "wheel",
        (event) => {

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
        "TRADEVERSE CANDLE READY"
    );
}


/* =========================================
   CANDLE ANIMATION
========================================= */

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


    /* FLOATING */

    candleGroup.position.y =
        Math.sin(
            time * 1.4
        ) * 0.12;


    /* ROTATION */

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


/* =========================================
   START BUTTON
========================================= */

startBtn.addEventListener(
    "click",
    () => {

        if (candleStarted)
            return;


        candleStarted = true;


        intro.style.display =
            "flex";


        setTimeout(
            () => {

                intro.style.opacity =
                    "1";

            },
            20
        );


        setTimeout(
            () => {

                intro.style.opacity =
                    "0";


                setTimeout(
                    () => {

                        intro.style.display =
                            "none";


                        homeUI.style.display =
                            "none";


                        canvas.style.display =
                            "none";


                        candleLab.style.display =
                            "flex";


                        createCandle();


                        animateCandle();

                    },
                    700
                );

            },
            1000
        );

    }
);


/* =========================================
   BACK
========================================= */

backBtn.addEventListener(
    "click",
    () => {

        candleLab.style.display =
            "none";


        canvas.style.display =
            "block";


        homeUI.style.display =
            "flex";


        candleStarted = false;

    }
);


/* =========================================
   HOME ANIMATION
========================================= */

const clock =
    new THREE.Clock();


function animateHome() {

    requestAnimationFrame(
        animateHome
    );


    const time =
        clock.getElapsedTime();


    camera.position.x += (

        mouseX * 0.8 -

        camera.position.x

    ) * 0.02;


    camera.position.y += (

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


        if (

            candleRenderer &&

            candleCamera

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


/* =========================================
   LOADING
========================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                const loading =
                    document.getElementById(
                        "loading"
                    );


                loading.style.opacity =
                    "0";


                setTimeout(
                    () => {

                        loading.style.display =
                            "none";

                    },
                    800
                );

            },
            900
        );

    }
);
