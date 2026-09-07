const home = document.getElementById("home");
const lab = document.getElementById("lab");
const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const canvas = document.getElementById("space");


let scene;
let camera;
let renderer;

let candleGroup;
let stars;

let initialized = false;

let isDragging = false;

let previousX = 0;
let previousY = 0;

let targetRotationX = 0.12;
let targetRotationY = 0.35;

let targetZoom = 7;
let currentZoom = 7;


/* =========================
   START LAB
========================= */

startBtn.addEventListener("click", function () {

    home.style.display = "none";
    lab.style.display = "block";

    if (!initialized) {
        createLab();
        initialized = true;
    }

});


/* =========================
   BACK HOME
========================= */

backBtn.addEventListener("click", function () {

    lab.style.display = "none";
    home.style.display = "flex";

});


/* =========================
   CREATE LAB
========================= */

function createLab() {

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x02040a);


    /* CAMERA */

    camera = new THREE.PerspectiveCamera(
        42,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(
        0,
        0,
        currentZoom
    );


    /* RENDERER */

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    /* LIGHTS */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.8
        );

    scene.add(ambientLight);


    const greenLight =
        new THREE.PointLight(
            0x20ff88,
            18,
            18
        );

    greenLight.position.set(
        3,
        4,
        4
    );

    scene.add(greenLight);


    const whiteLight =
        new THREE.PointLight(
            0xffffff,
            10,
            16
        );

    whiteLight.position.set(
        -4,
        3,
        5
    );

    scene.add(whiteLight);


    const backLight =
        new THREE.PointLight(
            0x0aff85,
            8,
            14
        );

    backLight.position.set(
        0,
        1,
        -4
    );

    scene.add(backLight);


    createStars();

    createCandle();

    createFloor();

    setupControls();

    window.addEventListener(
        "resize",
        resize
    );

    animate(0);
}


/* =========================
   STARS
========================= */

function createStars() {

    const geometry =
        new THREE.BufferGeometry();

    const positions = [];

    for (let i = 0; i < 2200; i++) {

        positions.push(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 32,
            (Math.random() - 0.5) * 45
        );
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: 0xb6cbe5,

            size: 0.035,

            transparent: true,

            opacity: 0.8
        });


    stars =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(stars);
}


/* =========================
   CANDLE
========================= */

function createCandle() {

    candleGroup =
        new THREE.Group();


    /* BODY */

    const bodyGeometry =
        new THREE.BoxGeometry(
            1.55,
            3.2,
            1.55
        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x12d875,

            roughness: 0.25,

            metalness: 0.2,

            emissive: 0x06351f,

            emissiveIntensity: 0.65
        });


    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    candleGroup.add(body);


    /* TOP */

    const topGeometry =
        new THREE.CylinderGeometry(
            0.775,
            0.775,
            0.08,
            64
        );


    const topMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x38ff98,

            roughness: 0.18,

            metalness: 0.15,

            emissive: 0x0b542f,

            emissiveIntensity: 0.6
        });


    const top =
        new THREE.Mesh(
            topGeometry,
            topMaterial
        );

    top.position.y = 1.64;

    candleGroup.add(top);


    /* WICK */

    const wickGeometry =
        new THREE.CylinderGeometry(
            0.065,
            0.065,
            0.65,
            20
        );


    const wickMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xd8e4de,

            roughness: 0.8
        });


    const wick =
        new THREE.Mesh(
            wickGeometry,
            wickMaterial
        );

    wick.position.y = 2.0;

    candleGroup.add(wick);


    /* FLAME GLOW */

    const glowGeometry =
        new THREE.SphereGeometry(
            0.18,
            32,
            32
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x39ff91,

            transparent: true,

            opacity: 0.7
        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    glow.position.y = 2.38;

    candleGroup.add(glow);


    /* GLOW LIGHT */

    const candleLight =
        new THREE.PointLight(
            0x32ff91,
            3,
            5
        );

    candleLight.position.y = 2.35;

    candleGroup.add(candleLight);


    /* FLOOR SHADOW */

    const shadowGeometry =
        new THREE.CircleGeometry(
            1.6,
            64
        );


    const shadowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x000000,

            transparent: true,

            opacity: 0.35,

            depthWrite: false
        });


    const shadow =
        new THREE.Mesh(
            shadowGeometry,
            shadowMaterial
        );

    shadow.rotation.x =
        -Math.PI / 2;

    shadow.position.y =
        -1.65;

    candleGroup.add(shadow);


    candleGroup.position.set(
        0,
        0,
        0
    );


    scene.add(candleGroup);
}


/* =========================
   FLOOR
========================= */

function createFloor() {

    const floorGeometry =
        new THREE.PlaneGeometry(
            30,
            30
        );


    const floorMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x02050a,

            roughness: 0.7,

            metalness: 0.1
        });


    const floor =
        new THREE.Mesh(
            floorGeometry,
            floorMaterial
        );


    floor.rotation.x =
        -Math.PI / 2;

    floor.position.y =
        -1.7;

    scene.add(floor);


    /* GRID */

    const grid =
        new THREE.GridHelper(
            30,
            30,
            0x12352a,
            0x08140f
        );

    grid.position.y =
        -1.69;

    grid.material.transparent = true;

    grid.material.opacity = 0.18;

    scene.add(grid);
}


/* =========================
   CONTROLS
========================= */

function setupControls() {

    canvas.addEventListener(
        "pointerdown",
        onPointerDown
    );

    canvas.addEventListener(
        "pointermove",
        onPointerMove
    );

    canvas.addEventListener(
        "pointerup",
        onPointerUp
    );

    canvas.addEventListener(
        "pointercancel",
        onPointerUp
    );

    canvas.addEventListener(
        "wheel",
        onWheel,
        {
            passive: false
        }
    );
}


/* =========================
   DRAG START
========================= */

function onPointerDown(event) {

    isDragging = true;

    previousX = event.clientX;
    previousY = event.clientY;

    canvas.classList.add("dragging");

    canvas.setPointerCapture(
        event.pointerId
    );
}


/* =========================
   DRAG MOVE
========================= */

function onPointerMove(event) {

    if (!isDragging) {
        return;
    }

    const movementX =
        event.clientX - previousX;

    const movementY =
        event.clientY - previousY;


    targetRotationY +=
        movementX * 0.012;

    targetRotationX +=
        movementY * 0.008;


    targetRotationX =
        Math.max(
            -1.1,
            Math.min(
                1.1,
                targetRotationX
            )
        );


    previousX =
        event.clientX;

    previousY =
        event.clientY;
}


/* =========================
   DRAG END
========================= */

function onPointerUp(event) {

    isDragging = false;

    canvas.classList.remove("dragging");

    try {
        canvas.releasePointerCapture(
            event.pointerId
        );
    } catch (error) {
        /* Nothing */
    }
}


/* =========================
   ZOOM
========================= */

function onWheel(event) {

    event.preventDefault();

    targetZoom +=
        event.deltaY * 0.006;


    targetZoom =
        Math.max(
            4.2,
            Math.min(
                10,
                targetZoom
            )
        );
}


/* =========================
   ANIMATION
========================= */

function animate(time) {

    requestAnimationFrame(animate);


    if (!renderer) {
        return;
    }


    /* CANDLE */

    if (candleGroup) {

        if (!isDragging) {

            targetRotationY +=
                0.0018;
        }


        candleGroup.rotation.x +=
            (
                targetRotationX -
                candleGroup.rotation.x
            ) * 0.08;


        candleGroup.rotation.y +=
            (
                targetRotationY -
                candleGroup.rotation.y
            ) * 0.08;


        candleGroup.position.y =
            Math.sin(
                time * 0.0015
            ) * 0.12;
    }


    /* ZOOM */

    currentZoom +=
        (
            targetZoom -
            currentZoom
        ) * 0.08;


    camera.position.z =
        currentZoom;


    /* STARS */

    if (stars) {

        stars.rotation.y +=
            0.00015;

        stars.rotation.x +=
            0.00003;
    }


    renderer.render(
        scene,
        camera
    );
}


/* =========================
   RESIZE
========================= */

function resize() {

    if (!camera || !renderer) {
        return;
    }


    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}
