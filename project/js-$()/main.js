// 초기화/이벤트 바인딩

import { bindRefs } from "./dom.js";
import { setRefs, createHoles, startGame, resetGame, endGame, miss } from "./game.js";
import { state } from "./state.js";

function init() {
    // 1) 생 DOM 바인딩 + REFS 주입
    const refs = bindRefs();
    setRefs(refs);

    // 2) 보드 생성 (onHoleClick은 createHoles 내부에서 각 hole에 바인딩됨)
    createHoles();

    // 3) 바닥 클릭 Miss (표준 이벤트 API 사용)
    refs.gameField.addEventListener("click", (e) => {
        if (e.target && e.target.id === "gameField" && state.isGameActive) {
            miss();
        }
    });

    // 4) 버튼 이벤트 (표준 이벤트 API)
    refs.startBtn.addEventListener("click", startGame);
    refs.resetBtn.addEventListener("click", resetGame);

    // 5) 종료 처리
    window.addEventListener("beforeunload", endGame);
}

document.addEventListener("DOMContentLoaded", init);
