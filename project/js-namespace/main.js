// 초기화/이벤트 바인딩

(() => {
    function init() {
        const refs = MG.DOM.bind();
        MG.DOM.createHoles(MG.Game.onHoleClick);

        // 바닥 클릭 Miss
        refs.gameField.addEventListener("click", (e) => {
            if (e.target && e.target.id === "gameField" && MG.State.state.isGameActive) {
                MG.Game.miss();
            }
        });

        refs.startBtn.addEventListener("click", MG.Game.start);
        refs.resetBtn.addEventListener("click", MG.Game.reset);

        window.addEventListener("beforeunload", MG.Game.end);
    }
    document.addEventListener("DOMContentLoaded", init);
})();
