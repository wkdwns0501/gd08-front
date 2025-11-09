// 변하는 값/타이머 관리

import { GAME_TIME } from "./config.js";

export const state = {
    isGameActive: false,
    score: 0,
    remainTime: GAME_TIME,
    lastHoleIndex: -1,
    holes: [],
    gameTimerId: null,
    moleIntervalId: null,
    moleTimeoutId: null,
};

export function resetState() {
    state.isGameActive = false;
    state.score = 0;
    state.remainTime = GAME_TIME;
    state.lastHoleIndex = -1;
    state.holes = [];
}

export function clearTimers() {
    if (state.gameTimerId) { clearInterval(state.gameTimerId); state.gameTimerId = null; }
    if (state.moleIntervalId) { clearInterval(state.moleIntervalId); state.moleIntervalId = null; }
    if (state.moleTimeoutId) { clearTimeout(state.moleTimeoutId); state.moleTimeoutId = null; }
}