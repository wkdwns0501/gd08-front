// 규칙/흐름/타이머/점수

import { GAME_TIME, HOLE_COUNT, MOLE_CYCLE, MOLE_HIDE, MOLE_IMG_SRC, MOLE_IMG_STYLE } from "./config.js";
import { state, resetState, clearTimers } from "./state.js";

// 전역 REFS (생 DOM 엘리먼트)
let REFS = null;
export function setRefs(r) { REFS = r; }

// ---- HUD 업데이트 ----
function setStatus(text, color = 'black') {
    REFS.statusDisplay.textContent = text;
    REFS.statusDisplay.style.color = color;
}
function updateScore() { REFS.scoreDisplay.textContent = String(state.score); }
function updateTime() { REFS.timeDisplay.textContent = String(state.remainTime); }

// ---- 두더지 표시 ----
const showMole = (holeEl) => holeEl.classList.add("mole-up");
const hideMole = (holeEl) => holeEl.classList.remove("mole-up");

// ---- 보드(구멍) 생성 ----
export function createHoles() {
    const gameField = REFS.gameField;           // 생 DOM
    gameField.innerHTML = "";
    state.holes = [];

    for (let i = 0; i < HOLE_COUNT; i++) {
        const holeEl = document.createElement("div");
        holeEl.classList.add("mole-hole");
        holeEl.dataset.index = i;

        const moleDivEl = document.createElement("div");
        moleDivEl.classList.add("mole");

        const moleImgEl = document.createElement("img");
        moleImgEl.src = MOLE_IMG_SRC;
        moleImgEl.style.width = MOLE_IMG_STYLE.width;
        moleImgEl.style.height = MOLE_IMG_STYLE.height;

        moleDivEl.appendChild(moleImgEl);
        holeEl.appendChild(moleDivEl);

        holeEl.addEventListener("click", onHoleClick);

        gameField.appendChild(holeEl);
        state.holes.push(holeEl);
    }
}

// ---- 랜덤 구멍 선택 ----
function pickRandomHole() {
    const n = state.holes?.length ?? 0;
    if (n === 0) return null;
    let idx;
    do { idx = Math.floor(Math.random() * n); }
    while (n > 1 && idx === state.lastHoleIndex);
    state.lastHoleIndex = idx;
    return state.holes[idx];
}

// ---- 점수 처리 ----
export function hit() {
    state.score += 3;
    updateScore();
    setStatus("Hit! (+3점)", "blue");
}

export function miss() {
    if (state.score > 0) state.score -= 1;
    updateScore();
    setStatus("Miss... (-1점)", "red");
}

// ---- 클릭 처리 ----
export function onHoleClick(event) {
    if (!state.isGameActive) return;
    const hole = event.currentTarget;

    if (!hole.classList.contains("mole-up")) {
        miss();
        return;
    }
    if (event.target && event.target.tagName === "IMG") {
        hit();
        hideMole(hole);
    } else {
        miss();
    }
}

// ---- 타이머 ----
function startTimer() {
    state.remainTime = GAME_TIME;
    updateTime();

    state.gameTimerId = setInterval(() => {
        state.remainTime -= 1;
        updateTime();
        if (state.remainTime <= 0) {
            endGame();
        }
    }, 1000);
}

// ---- 출현 사이클 ----
function popMoleCycle() {
    if (!state.isGameActive) return;

    // 잔여 두더지가 보이는 동안은 스킵
    if (document.querySelector(".mole-up")) return;

    // 보드가 비어 있으면 복구
    if (!state.holes || state.holes.length === 0) {
        createHoles();
    }

    const nextHole = pickRandomHole();
    if (!nextHole) return;

    showMole(nextHole);
    setStatus("두더지 등장!", "orange");

    state.moleTimeoutId = setTimeout(() => {
        hideMole(nextHole);
        state.moleTimeoutId = null;
    }, MOLE_HIDE);
}

// ---- 제어 ----
export function startGame() {
    if (state.isGameActive) return;
    clearTimers();

    // 안전 가드
    if (!state.holes || state.holes.length === 0) {
        createHoles();
    }
    state.lastHoleIndex = -1;

    state.isGameActive = true;
    state.score = 0;
    updateScore();

    // 버튼/상태
    REFS.startBtn.disabled = true;
    REFS.startBtn.textContent = "진행중...";
    REFS.resetBtn.disabled = false;

    setStatus(`${GAME_TIME}초 동안 두더지를 잡으세요!`, "green");

    startTimer();
    state.moleIntervalId = setInterval(popMoleCycle, MOLE_CYCLE);
}

export function endGame() {
    if (!state.isGameActive) return;
    state.isGameActive = false;
    clearTimers();

    state.holes.forEach(h => h && h.classList.remove("mole-up"));

    REFS.startBtn.disabled = false;
    REFS.startBtn.textContent = "다시시작";

    setStatus(`게임 종료! 최종 점수 : ${state.score} 점`, "red");
}

export function resetGame() {
    clearTimers();
    state.holes.forEach(h => h && h.classList.remove("mole-up"));

    resetState();     // score=0, remain=GAME_TIME, lastHoleIndex=-1, holes=[]
    updateScore();
    updateTime();

    createHoles();    // 다음 라운드를 위해 항상 재생성

    REFS.startBtn.disabled = false;
    REFS.startBtn.textContent = "게임시작";
    REFS.resetBtn.disabled = false;

    setStatus("게임시작 버튼을 눌러 시작하세요!", "black");
}
