// 변하는 값 / 타이머

(() => {
    window.MG = window.MG || {};
    const { CONFIG } = MG;

    const state = {
        isGameActive: false,
        score: 0,
        remainTime: CONFIG.GAME_TIME,
        lastHoleIndex: -1,
        holes: [],
        gameTimerId: null,
        moleIntervalId: null,
        moleTimeoutId: null,
    };

    function reset() {
        state.isGameActive = false;
        state.score = 0;
        state.remainTime = CONFIG.GAME_TIME;
        state.lastHoleIndex = -1;
        // state.holes = [];
    }

    function clearTimers() {
        if (state.gameTimerId) { clearInterval(state.gameTimerId); state.gameTimerId = null; }
        if (state.moleIntervalId) { clearInterval(state.moleIntervalId); state.moleIntervalId = null; }
        if (state.moleTimeoutId) { clearTimeout(state.moleTimeoutId); state.moleTimeoutId = null; }
    }

    MG.State = { state, reset, clearTimers };
})();
