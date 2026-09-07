const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const home = document.getElementById("home");
const lab = document.getElementById("lab");
const canvas = document.getElementById("space");

let scene;
let camera;
let renderer;
let candle;

let mouseDown = false;
let lastX = 0;
let lastY = 0;

let rotationX = 0;
let rotationY = 0;

let zoom = 7;


/* =========================
   START
========================= */

startBtn.addEventListener("click", function () {

    home.style.display = "none";
    lab.style.display = "block";

    if (!renderer) {
        init();
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
   INIT
========================= */

function init() {

    if (typeof THREE === "undefined") {

        console.error("THREE.JS NOT LOADED");

        return;
    }


    /* SCENE */

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x02040a);


    /* CAMERA */

    camera =
        new THREE.PerspectiveCamera(
            45,
            window.innerWidth /
            window.innerHeight,
            0.1,
            100
        );

    camera.position.z = zoom;


    /* RENDERER */

    renderer =
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


    /* LIGHT */

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            2
        );

    scene.add(ambient);


    const light =
        new THREE.PointLight(
            0x20ff88,
            20,
            20
        );

    light.position.set(
        3,
        4,
        5
    );

    scene.add(light);


    /* CANDLE */

    createCandle();


    /* STARS */

    createStars();


    /* EVENTS */

    canvas.addEventListener(
        "pointerdown",
        startDrag
    );

    canvas.addEventListener(
        "pointermove",
        drag
    );

    canvas.addEventListener(
        "pointerup",
        endDrag
    );

    canvas.addEventListener(
        "pointercancel",
        endDrag
    );

    canvas.addEventListener(
        "wheel",
        zoomCamera,
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

    candle =
        new THREE.Group();


    /* BODY */

    const bodyGeometry =
        new THREE.BoxGeometry(
            1.5,
            3,
            1.5
        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x16d878,

            roughness: 0.25,

            metalness: 0.15,

            emissive: 0x063d24,

            emissiveIntensity: 0.5
        });


    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );


    candle.add(body);


    /* TOP */

    const topGeometry =
        new THREE.CylinderGeometry(
            0.76,
            0.76,
            0.08,
            64
        );


    const topMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x38ff98,

            roughness: 0.2,

            metalness: 0.1
        });


    const top =
        new THREE.Mesh(
            topGeometry,
            topMaterial
        );


    top.position.y = 1.54;

    candle.add(top);


    /* WICK */

    const wickGeometry =
        new THREE.CylinderGeometry(
            0.055,
            0.055,
            0.65,
            20
        );


    const wickMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xdde8e2
        });


    const wick =
        new THREE.Mesh(
            wickGeometry,
            wickMaterial
        );


    wick.position.y = 1.9;

    candle.add(wick);


    /* GLOW */

    const glowGeometry =
        new THREE.SphereGeometry(
            0.2,
            32,
            32
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x32ff91,

            transparent: true,

            opacity: 0.75
        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    glow.position.y = 2.3;

    candle.add(glow);


    /* POSITION */

    candle.position.set(
        0,
        0,
        0
    );


    scene.add(candle);
}


/* =========================
   STARS
========================= */

function createStars() {

    const geometry =
        new THREE.BufferGeometry();

    const positions = [];


    for (let i = 0; i < 1800; i++) {

        positions.push(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 35
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

            color: 0xaec5dd,

            size: 0.04
        });


    const points =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(points);
}


/* =========================
   DRAG START
========================= */

function startDrag(event) {

    mouseDown = true;

    lastX = event.clientX;
    lastY = event.clientY;

    canvas.setPointerCapture(
        event.pointerId
    );
}


/* =========================
   DRAG
========================= */

function drag(event) {

    if (!mouseDown || !candle) {
        return;
    }


    const dx =
        event.clientX - lastX;

    const dy =
        event.clientY - lastY;


    rotationY +=
        dx * 0.01;

    rotationX +=
        dy * 0.01;


    rotationX =
        Math.max(
            -1.2,
            Math.min(
                1.2,
                rotationX
            )
        );


    lastX =
        event.clientX;

    lastY =
        event.clientY;
}


/* =========================
   DRAG END
========================= */

function endDrag() {

    mouseDown = false;
}


/* =========================
   ZOOM
========================= */

function zoomCamera(event) {

    event.preventDefault();

    zoom +=
        event.deltaY * 0.005;


    zoom =
        Math.max(
            4,
            Math.min(
                11,
                zoom
            )
        );
}


/* =========================
   ANIMATION
========================= */

function animate(time) {

    requestAnimationFrame(
        animate
    );


    if (!renderer) {
        return;
    }


    if (candle) {

        if (!mouseDown) {

            rotationY += 0.003;
        }


        candle.rotation.x +=
            (
                rotationX -
                candle.rotation.x
            ) * 0.08;


        candle.rotation.y +=
            (
                rotationY -
                candle.rotation.y
            ) * 0.08;


        candle.position.y =
            Math.sin(
                time * 0.0015
            ) * 0.12;
    }


    camera.position.z +=
        (
            zoom -
            camera.position.z
        ) * 0.08;


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
