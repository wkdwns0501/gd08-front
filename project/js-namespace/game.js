// 규칙·흐름·타이머 주도. state를 변경하고, UI는 호출만

(() => {
    window.MG = window.MG || {};
    const { CONFIG } = MG;
    const { state, reset, clearTimers } = MG.State;

    function pickRandomHole() {
        let idx;
        do { idx = Math.floor(Math.random() * CONFIG.HOLE_COUNT); }
        while (idx === state.lastHoleIndex);
        state.lastHoleIndex = idx;
        return state.holes[idx];
    }

    function hit() {
        state.score += 3;
        MG.UI.renderScore();
        MG.UI.setStatus("Hit! (+3점)", "blue");
    }
    function miss() {
        if (state.score > 0) state.score -= 1;
        MG.UI.renderScore();
        MG.UI.setStatus("Miss... (-1점)", "red");
    }

    function onHoleClick(e) {
        if (!state.isGameActive) return;
        const hole = e.currentTarget;
        if (!hole.classList.contains("mole-up")) { miss(); return; }
        if (e.target && e.target.tagName === "IMG") { hit(); MG.UI.hide(hole); }
        else { miss(); }
    }

    function startTimer() {
        state.remainTime = CONFIG.GAME_TIME;
        MG.UI.renderTime();
        state.gameTimerId = setInterval(() => {
            state.remainTime -= 1;
            MG.UI.renderTime();
            if (state.remainTime <= 0) end();
        }, 1000);
    }

    function popMoleCycle() {
        if (!state.isGameActive) return;
        if (document.querySelector(".mole-up")) return;
        const hole = pickRandomHole();
        MG.UI.show(hole);
        MG.UI.setStatus("두더지 등장!", "orange");

        state.moleTimeoutId = setTimeout(() => {
            MG.UI.hide(hole);
            state.moleTimeoutId = null;
        }, CONFIG.MOLE_HIDE);
    }

    function start() {
        if (state.isGameActive) return;
        clearTimers();
        state.isGameActive = true;
        state.score = 0;
        MG.UI.renderScore();

        MG.DOM.refs.startBtn.textContent = "진행중...";
        MG.DOM.refs.startBtn.disabled = true;
        MG.DOM.refs.resetBtn.disabled = false;
        MG.UI.setStatus(`${CONFIG.GAME_TIME}초 동안 두더지를 잡으세요!`, "green");

        startTimer();
        state.moleIntervalId = setInterval(popMoleCycle, CONFIG.MOLE_CYCLE);
    }

    function end() {
        if (!state.isGameActive) return;
        state.isGameActive = false;
        clearTimers();
        state.holes.forEach(MG.UI.hide);
        MG.DOM.refs.startBtn.textContent = "다시시작";
        MG.DOM.refs.startBtn.disabled = false;
        MG.UI.setStatus(`게임 종료!  최종 점수 : ${state.score} 점`, "red");
    }

    function resetGame() {
        clearTimers();
        state.holes.forEach(MG.UI.hide);
        reset();
        MG.DOM.createHoles(MG.Game.onHoleClick);
        MG.UI.renderScore();
        MG.UI.renderTime();
        MG.DOM.refs.startBtn.textContent = "게임시작";
        MG.DOM.refs.startBtn.disabled = false;
        MG.DOM.refs.resetBtn.disabled = false;
        MG.UI.setStatus("게임시작 버튼을 눌러 시작하세요!", "black");
    }

    MG.Game = { start, end, reset: resetGame, onHoleClick, miss };
})();
