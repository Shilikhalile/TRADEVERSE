const button = document.getElementById("startBtn");

button.addEventListener("click", function () {

    document.body.innerHTML = `
        <div style="
            width:100vw;
            height:100vh;
            background:#03050a;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:column;
            font-family:Arial, sans-serif;
            text-align:center;
        ">

            <div style="
                font-size:10px;
                letter-spacing:5px;
                opacity:0.4;
                margin-bottom:20px;
            ">
                MARKET LAB / 01
            </div>

            <h1 style="
                font-size:55px;
                letter-spacing:-4px;
                font-weight:500;
            ">
                CANDLESTICKS
            </h1>

            <p style="
                margin-top:20px;
                opacity:0.5;
                font-size:12px;
                letter-spacing:2px;
            ">
                ANATOMY OF A CANDLE
            </p>

            <button onclick="location.reload()" style="
                margin-top:40px;
                padding:12px 20px;
                background:white;
                color:#03050a;
                border:none;
                cursor:pointer;
                letter-spacing:2px;
            ">
                ← BACK
            </button>

        </div>
    `;

});
