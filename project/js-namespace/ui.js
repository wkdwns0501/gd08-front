// 화면 갱신만(문구/색/점수/시간/보이기/숨기기). 상태는 읽기만

(() => {
    window.MG = window.MG || {};

    function setStatus(text, color = "black") {
        MG.DOM.refs.statusDisplay.textContent = text;
        MG.DOM.refs.statusDisplay.style.color = color;
    }
    function renderScore() {
        MG.DOM.refs.scoreDisplay.textContent = String(MG.State.state.score);
    }
    function renderTime() {
        MG.DOM.refs.timeDisplay.textContent = String(MG.State.state.remainTime);
    }
    const show = (hole) => hole.classList.add("mole-up");
    const hide = (hole) => hole.classList.remove("mole-up");

    MG.UI = { setStatus, renderScore, renderTime, show, hide };
})();
