const home = document.getElementById("home");
const lab = document.getElementById("lab");
const trendLab = document.getElementById("trendLab");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const nextLessonBtn = document.getElementById("nextLessonBtn");
const previousLessonBtn = document.getElementById("previousLessonBtn");
const trendBackBtn = document.getElementById("trendBackBtn");

const candleScene = document.getElementById("candleScene");
const trendChart = document.getElementById("trendChart");


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

        if (trendLab) {
            trendLab.classList.add("active");
        }

        window.scrollTo(0, 0);
    });
}


// =====================================================
// LESSON 02 → LESSON 01
// =====================================================

if (previousLessonBtn) {
    previousLessonBtn.addEventListener("click", () => {

        if (trendLab) {
            trendLab.classList.remove("active");
        }

        lab.classList.add("active");

        window.scrollTo(0, 0);
    });
}


// =====================================================
// LESSON 02 → HOME
// =====================================================

if (trendBackBtn) {
    trendBackBtn.addEventListener("click", () => {

        if (trendLab) {
            trendLab.classList.remove("active");
        }

        home.style.display = "block";

        window.scrollTo(0, 0);
    });
}


// =====================================================
// LESSON 01 — 3D CANDLE MOVEMENT
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


    candleScene.addEventListener("pointerdown", (e) => {

        dragging = true;

        lastX = e.clientX;
        lastY = e.clientY;

        velocityX = 0;
        velocityY = 0;

        candleScene.style.cursor = "grabbing";

        candleScene.setPointerCapture(e.pointerId);
    });


    candleScene.addEventListener("pointermove", (e) => {

        if (!dragging) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

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
    });


    function stopCandleDrag(e) {

        dragging = false;

        candleScene.style.cursor = "grab";

        try {

            if (e.pointerId !== undefined) {
                candleScene.releasePointerCapture(
                    e.pointerId
                );
            }

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

            rotateY += velocityY * 0.04;

            rotateX += velocityX * 0.04;

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
// LESSON 01 — NOTES AUTO SAVE
// =====================================================

const lessonNotes =
    document.getElementById("lessonNotes");

if (lessonNotes) {

    const savedNotes =
        localStorage.getItem(
            "tradeverse-candle-notes"
        );

    if (savedNotes !== null) {
        lessonNotes.value = savedNotes;
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
// LESSON 02 — 3D TREND CHART MOVEMENT
// =====================================================

if (trendChart) {

    let trendRotateX = 0;
    let trendRotateY = 0;

    let trendZoom = 1;

    let trendDragging = false;

    let trendLastX = 0;
    let trendLastY = 0;

    let trendVelocityX = 0;
    let trendVelocityY = 0;


    function updateTrendChart() {

        trendChart.style.transform =
            `translate(-50%, -50%)
             scale(${trendZoom})
             rotateX(${trendRotateX}deg)
             rotateY(${trendRotateY}deg)`;
    }


    trendChart.addEventListener(
        "pointerdown",
        (e) => {

            trendDragging = true;

            trendLastX = e.clientX;
            trendLastY = e.clientY;

            trendVelocityX = 0;
            trendVelocityY = 0;

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

            if (!trendDragging) return;

            const dx =
                e.clientX - trendLastX;

            const dy =
                e.clientY - trendLastY;


            trendRotateY += dx * 1.5;
            trendRotateX -= dy * 1.5;


            trendRotateX = Math.max(
                -60,
                Math.min(60, trendRotateX)
            );


            trendVelocityY = dx * 1.5;
            trendVelocityX = -dy * 1.5;


            trendLastX = e.clientX;
            trendLastY = e.clientY;


            updateTrendChart();
        }
    );


    function stopTrendDrag(e) {

        trendDragging = false;

        trendChart.style.cursor =
            "grab";

        try {

            if (
                e.pointerId !== undefined
            ) {

                trendChart.releasePointerCapture(
                    e.pointerId
                );
            }

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
                trendZoom += 0.10;
            } else {
                trendZoom -= 0.10;
            }


            trendZoom = Math.max(
                0.55,
                Math.min(1.7, trendZoom)
            );


            updateTrendChart();

        },
        { passive: false }
    );


    function animateTrend() {

        if (!trendDragging) {

            trendRotateY += 0.12;

            trendRotateY +=
                trendVelocityY * 0.035;

            trendRotateX +=
                trendVelocityX * 0.035;


            trendRotateX = Math.max(
                -60,
                Math.min(60, trendRotateX)
            );


            trendVelocityX *= 0.92;
            trendVelocityY *= 0.92;


            updateTrendChart();
        }

        requestAnimationFrame(
            animateTrend
        );
    }


    animateTrend();
}


// =====================================================
// LESSON 02 — NOTES AUTO SAVE
// =====================================================

const trendNotes =
    document.getElementById("trendNotes");

if (trendNotes) {

    const savedTrendNotes =
        localStorage.getItem(
            "tradeverse-trend-notes"
        );


    if (savedTrendNotes !== null) {
        trendNotes.value =
            savedTrendNotes;
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
