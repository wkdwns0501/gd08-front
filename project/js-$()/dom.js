// DOM 참조/구멍 생성 전담

export function bindRefs() {
    return {
        gameField: document.querySelector('#gameField'),
        scoreDisplay: document.querySelector('#scoreDisplay'),
        timeDisplay: document.querySelector('#timeDisplay'),
        statusDisplay: document.querySelector('#statusDisplay'),
        startBtn: document.querySelector('#startBtn'),
        resetBtn: document.querySelector('#resetBtn'),
    };
}

