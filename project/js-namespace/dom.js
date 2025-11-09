// DOM 요소 참조 바인딩 / 구멍 생성

(() => {
    window.MG = window.MG || {};
    const { CONFIG } = MG;

    const refs = {
        gameField: null, scoreDisplay: null, timeDisplay: null,
        statusDisplay: null, startBtn: null, resetBtn: null,
    };

    function bind() {
        refs.gameField = document.getElementById("gameField");
        refs.scoreDisplay = document.getElementById("scoreDisplay");
        refs.timeDisplay = document.getElementById("timeDisplay");
        refs.statusDisplay = document.getElementById("statusDisplay");
        refs.startBtn = document.getElementById("startBtn");
        refs.resetBtn = document.getElementById("resetBtn");
        return refs;
    }

    function createHoles(onHoleClick) {
        const { gameField } = refs;
        gameField.innerHTML = "";
        MG.State.state.holes = [];

        for (let i = 0; i < CONFIG.HOLE_COUNT; i++) {
            const holeEl = document.createElement("div");
            holeEl.classList.add("mole-hole");
            holeEl.dataset.index = i;

            const moleDiv = document.createElement("div");
            moleDiv.classList.add("mole");

            const img = document.createElement("img");
            img.src = CONFIG.MOLE_IMG_SRC;
            img.style.width = CONFIG.MOLE_IMG_STYLE.width;
            img.style.height = CONFIG.MOLE_IMG_STYLE.height;

            moleDiv.appendChild(img);
            holeEl.appendChild(moleDiv);
            holeEl.addEventListener("click", onHoleClick);

            gameField.appendChild(holeEl);
            MG.State.state.holes.push(holeEl);
        }
    }

    MG.DOM = { refs, bind, createHoles };
})();
