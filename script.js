const home = document.getElementById("home");
const lab = document.getElementById("lab");
const trendLab = document.getElementById("trendLab");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const nextLessonBtn =
    document.getElementById("nextLessonBtn");

const previousLessonBtn =
    document.getElementById("previousLessonBtn");

const trendBackBtn =
    document.getElementById("trendBackBtn");

const candleScene =
    document.getElementById("candleScene");

const trendChart =
    document.getElementById("trendChart");


// =====================================================
// HOME → LESSON 01
// =====================================================

if (startBtn) {

    startBtn.addEventListener("click", () => {

        home.style.display = "none";

        lab.classList.add("active");

    });

}


// =====================================================
// LESSON 01 → HOME
// =====================================================

if (backBtn) {

    backBtn.addEventListener("click", () => {

        lab.classList.remove("active");

        home.style.display = "block";

    });

}


// =====================================================
// LESSON 01 → LESSON 02
// =====================================================

if (nextLessonBtn) {

    nextLessonBtn.addEventListener("click", () => {

        lab.classList.remove("active");

        trendLab.classList.add("active");

        window.scrollTo(0, 0);

    });

}


// =====================================================
// LESSON 02 → LESSON 01
// =====================================================

if (previousLessonBtn) {

    previousLessonBtn.addEventListener("click", () => {

        trendLab.classList.remove("active");

        lab.classList.add("active");

        window.scrollTo(0, 0);

    });

}


// =====================================================
// LESSON 02 → HOME
// =====================================================

if (trendBackBtn) {

    trendBackBtn.addEventListener("click", () => {

        trendLab.classList.remove("active");

        home.style.display = "block";

        window.scrollTo(0, 0);

    });

}


// =====================================================
// 3D CANDLE — LESSON 01
// =====================================================

if (candleScene) {

    let rotateX = 0;
    let rotateY = 0;

    let zoom = 1;

    let dragging = false;

    let lastX = 0;
    let lastY = 0;

    let velocityX = 0;
    let velocityY = 0;


    function updateCandle() {

        candleScene.style.transform =
            `translate(-50%, -50%)
             scale(${zoom})
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;

    }


    candleScene.addEventListener(
        "pointerdown",
        (e) => {

            dragging = true;

            lastX = e.clientX;
            lastY = e.clientY;

            velocityX = 0;
            velocityY = 0;

            candleScene.style.cursor =
                "grabbing";

            candleScene.setPointerCapture(
                e.pointerId
            );

        }
    );


    candleScene.addEventListener(
        "pointermove",
        (e) => {

            if (!dragging) return;

            const dx =
                e.clientX - lastX;

            const dy =
                e.clientY - lastY;

            rotateY += dx * 1.8;
            rotateX -= dy * 1.8;

            rotateX = Math.max(
                -70,
                Math.min(70, rotateX)
            );

            velocityY = dx * 1.8;
            velocityX = -dy * 1.8;

            lastX = e.clientX;
            lastY = e.clientY;

            updateCandle();

        }
    );


    function stopCandleDrag(e) {

        dragging = false;

        candleScene.style.cursor =
            "grab";

        try {

            candleScene.releasePointerCapture(
                e.pointerId
            );

        } catch (error) {}

    }


    candleScene.addEventListener(
        "pointerup",
        stopCandleDrag
    );

    candleScene.addEventListener(
        "pointercancel",
        stopCandleDrag
    );


    candleScene.addEventListener(
        "wheel",
        (e) => {

            e.preventDefault();

            if (e.deltaY < 0) {
                zoom += 0.10;
            } else {
                zoom -= 0.10;
            }

            zoom = Math.max(
                0.55,
                Math.min(1.8, zoom)
            );

            updateCandle();

        },
        { passive: false }
    );


    function animateCandle() {

        if (!dragging) {

            rotateY += 0.20;

            rotateY +=
                velocityY * 0.04;

            rotateX +=
                velocityX * 0.04;

            rotateX = Math.max(
                -70,
                Math.min(70, rotateX)
            );

            velocityX *= 0.92;
            velocityY *= 0.92;

            updateCandle();

        }

        requestAnimationFrame(
            animateCandle
        );

    }


    animateCandle();

}


// =====================================================
// LESSON 01 NOTES
// =====================================================

const lessonNotes =
    document.getElementById("lessonNotes");

if (lessonNotes) {

    const saved =
        localStorage.getItem(
            "tradeverse-candle-notes"
        );

    if (saved !== null) {
        lessonNotes.value = saved;
    }

    lessonNotes.addEventListener(
        "input",
        () => {

            localStorage.setItem(
                "tradeverse-candle-notes",
                lessonNotes.value
            );

        }
    );

}


// =====================================================
// 3D TREND CHART — LESSON 02
// =====================================================

if (trendChart) {

    let rotateX = 0;
    let rotateY = 0;

    let zoom = 1;

    let dragging = false;

    let lastX = 0;
    let lastY = 0;

    let velocityX = 0;
    let velocityY = 0;


    function updateTrend() {

        trendChart.style.transform =
            `translate(-50%, -50%)
             scale(${zoom})
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;

    }


    trendChart.addEventListener(
        "pointerdown",
        (e) => {

            dragging = true;

            lastX = e.clientX;
            lastY = e.clientY;

            velocityX = 0;
            velocityY = 0;

            trendChart.style.cursor =
                "grabbing";

            trendChart.setPointerCapture(
                e.pointerId
            );

        }
    );


    trendChart.addEventListener(
        "pointermove",
        (e) => {

            if (!dragging) return;

            const dx =
                e.clientX - lastX;

            const dy =
                e.clientY - lastY;

            rotateY += dx * 1.6;
            rotateX -= dy * 1.6;

            rotateX = Math.max(
                -60,
                Math.min(60, rotateX)
            );

            velocityY = dx * 1.6;
            velocityX = -dy * 1.6;

            lastX = e.clientX;
            lastY = e.clientY;

            updateTrend();

        }
    );


    function stopTrendDrag(e) {

        dragging = false;

        trendChart.style.cursor =
            "grab";

        try {

            trendChart.releasePointerCapture(
                e.pointerId
            );

        } catch (error) {}

    }


    trendChart.addEventListener(
        "pointerup",
        stopTrendDrag
    );

    trendChart.addEventListener(
        "pointercancel",
        stopTrendDrag
    );


    trendChart.addEventListener(
        "wheel",
        (e) => {

            e.preventDefault();

            if (e.deltaY < 0) {
                zoom += 0.10;
            } else {
                zoom -= 0.10;
            }

            zoom = Math.max(
                0.55,
                Math.min(1.7, zoom)
            );

            updateTrend();

        },
        { passive: false }
    );


    function animateTrend() {

        if (!dragging) {

            rotateY += 0.12;

            rotateY +=
                velocityY * 0.035;

            rotateX +=
                velocityX * 0.035;

            rotateX = Math.max(
                -60,
                Math.min(60, rotateX)
            );

            velocityX *= 0.92;
            velocityY *= 0.92;

            updateTrend();

        }

        requestAnimationFrame(
            animateTrend
        );

    }


    animateTrend();

}


// =====================================================
// LESSON 02 NOTES
// =====================================================

const trendNotes =
    document.getElementById("trendNotes");

if (trendNotes) {

    const saved =
        localStorage.getItem(
            "tradeverse-trend-notes"
        );

    if (saved !== null) {
        trendNotes.value = saved;
    }

    trendNotes.addEventListener(
        "input",
        () => {

            localStorage.setItem(
                "tradeverse-trend-notes",
                trendNotes.value
            );

        }
    );

        }
