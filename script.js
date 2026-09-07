const button = document.getElementById("startBtn");
const home = document.getElementById("home");
const lab = document.getElementById("lab");
const backBtn = document.getElementById("backBtn");
const canvas = document.getElementById("space");

let scene;
let camera;
let renderer;
let candleGroup;

let isDragging = false;
let previousX = 0;
let previousY = 0;

let targetRotX = 0.15;
let targetRotY = 0.35;

let zoom = 7;


/* =========================
   OPEN LAB
========================= */

button.addEventListener("click", function () {

    home.style.display = "none";
    lab.style.display = "block";

    if (!scene) {
        create3D();
    }
});


/* =========================
   BACK
========================= */

backBtn.addEventListener("click", function () {

    lab.style.display = "none";
    home.style.display = "flex";
});


/* =========================
   CREATE 3D
========================= */

function create3D() {

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x02040a);


    /* CAMERA */

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(
        0,
        0,
        zoom
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


    /* LIGHT */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.4
        );

    scene.add(ambientLight);


    const greenLight =
        new THREE.PointLight(
            0x20ff88,
            12,
            15
        );

    greenLight.position.set(
        2,
        3,
        4
    );

    scene.add(greenLight);


    const whiteLight =
        new THREE.PointLight(
            0xffffff,
            8,
            12
        );

    whiteLight.position.set(
        -3,
        2,
        4
    );

    scene.add(whiteLight);


    /* CANDLE */

    createCandle();


    /* STARS */

    createStars();


    /* EVENTS */

    canvas.addEventListener(
        "pointerdown",
        pointerDown
    );

    canvas.addEventListener(
        "pointermove",
        pointerMove
    );

    canvas.addEventListener(
        "pointerup",
        pointerUp
    );

    canvas.addEventListener(
        "pointercancel",
        pointerUp
    );

    canvas.addEventListener(
        "wheel",
        wheel,
        {
            passive: false
        }
    );


    window.addEventListener(
        "resize",
        resize
    );


    animate();
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
            1.45,
            2.8,
            1.45
        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x16d978,

            roughness: 0.28,

            metalness: 0.25,

            emissive: 0x06351f,

            emissiveIntensity: 0.5

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
            0.73,
            0.73,
            0.06,
            64
        );


    const topMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x31ff91,

            roughness: 0.2,

            metalness: 0.2,

            emissive: 0x0b542f,

            emissiveIntensity: 0.5

        });


    const top =
        new THREE.Mesh(
            topGeometry,
            topMaterial
        );


    top.position.y = 1.43;

    candleGroup.add(top);


    /* WICK */

    const wickGeometry =
        new THREE.CylinderGeometry(
            0.07,
            0.07,
            0.65,
            20
        );


    const wickMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xd8e8df,
            roughness: 0.8
        });


    const wick =
        new THREE.Mesh(
            wickGeometry,
            wickMaterial
        );


    wick.position.y = 1.78;

    candleGroup.add(wick);


    /* SMALL GLOW */

    const glowGeometry =
        new THREE.SphereGeometry(
            0.16,
            32,
            32
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x55ffaa,

            transparent: true,

            opacity: 0.7

        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    glow.position.y = 2.1;

    candleGroup.add(glow);


    candleGroup.position.y = 0;

    scene.add(candleGroup);
}


/* =========================
   STARS
========================= */

function createStars() {

    const geometry =
        new THREE.BufferGeometry();

    const positions = [];

    for (let i = 0; i < 1600; i++) {

        positions.push(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 30
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

            color: 0x9db9d6,

            size: 0.035,

            transparent: true,

            opacity: 0.75

        });


    const stars =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(stars);
}


/* =========================
   DRAG
========================= */

function pointerDown(event) {

    isDragging = true;

    previousX = event.clientX;
    previousY = event.clientY;

    canvas.setPointerCapture(
        event.pointerId
    );
}


function pointerMove(event) {

    if (!isDragging || !candleGroup) {
        return;
    }


    const movementX =
        event.clientX - previousX;

    const movementY =
        event.clientY - previousY;


    targetRotY +=
        movementX * 0.012;

    targetRotX +=
        movementY * 0.008;


    targetRotX =
        Math.max(
            -1.2,
            Math.min(1.2, targetRotX)
        );


    previousX = event.clientX;
    previousY = event.clientY;
}


function pointerUp() {

    isDragging = false;
}


/* =========================
   ZOOM
========================= */

function wheel(event) {

    event.preventDefault();

    zoom += event.deltaY * 0.004;

    zoom =
        Math.max(
            4.5,
            Math.min(10, zoom)
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


    /* CANDLE ROTATION */

    if (candleGroup) {

        if (!isDragging) {

            targetRotY += 0.0025;
        }


        candleGroup.rotation.x +=
            (targetRotX -
            candleGroup.rotation.x) *
            0.08;


        candleGroup.rotation.y +=
            (targetRotY -
            candleGroup.rotation.y) *
            0.08;


        /* FLOATING */

        candleGroup.position.y =
            Math.sin(
                time * 0.0015
            ) * 0.12;
    }


    /* CAMERA ZOOM */

    camera.position.z +=
        (zoom -
        camera.position.z) *
        0.08;


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
