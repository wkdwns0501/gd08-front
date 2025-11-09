// 게임 로직(단일 파일)

(() => {
    // ===== 설정 =====
    const GAME_TIME = 30; // 초
    const HOLE_COUNT = 9; // 3x3
    const MOLE_CYCLE = 1100; // ms - 출현 주기
    const MOLE_HIDE = 800; // ms - 숨는 시간
    const MOLE_IMG = 'img/mole.png';
    const MOLE_SIZE = { w: 85, h: 100 };

    // ===== 상태 =====
    let isActive = false;
    let score = 0;
    let remainTime = GAME_TIME;
    let holes = [];
    let lastIdx = -1;
    let gameTimerId = null;
    let moleIntervalId = null;
    let moleTimeoutId = null;

    // ===== UI 유틸 =====
    const setStatus = (txt, color = 'black') => { $('#statusDisplay').text(txt).css('color', color); };
    const renderScore = () => { $('#scoreDisplay').text(String(score)); };
    const renderTime = () => { $('#timeDisplay').text(String(remainTime)); };

    const hideMole = (hole) => hole.classList.remove('mole-up');
    const showMole = (hole) => hole.classList.add('mole-up');

    // ===== 보드 생성 =====
    function createHoles() {
        $('#gameField').html('');
        holes = [];
        for (let i = 0; i < HOLE_COUNT; i++) {
            const hole = document.createElement('div');
            hole.classList.add('mole-hole');
            hole.dataset.index = i;

            const moleWrap = document.createElement('div');
            moleWrap.classList.add('mole');

            const img = document.createElement('img');
            img.src = MOLE_IMG;
            img.style.width = MOLE_SIZE.w + 'px';
            img.style.height = MOLE_SIZE.h + 'px';

            moleWrap.appendChild(img);
            hole.appendChild(moleWrap);

            // 클릭 핸들러
            hole.addEventListener('click', onHoleClick);

            $('#gameField').first().appendChild(hole);
            holes.push(hole);
        }
    }

    // ===== 랜덤 구멍(이전과 중복 방지) =====
    function pickRandomHole() {
        if (!holes.length) return null;
        let idx;
        do { idx = Math.floor(Math.random() * holes.length); } while (idx === lastIdx && holes.length > 1);
        lastIdx = idx;
        return holes[idx];
    }

    // ===== 점수 처리 =====
    function hit() {
        score += 3;
        renderScore();
        setStatus('Hit! (+3점)', 'blue');
    }
    function miss() {
        if (score > 0) score -= 1;
        renderScore();
        setStatus('Miss... (-1점)', 'red');
    }

    // ===== 클릭 처리 =====
    function onHoleClick(e) {
        if (!isActive) return;
        const hole = e.currentTarget;
        if (!hole.classList.contains('mole-up')) { miss(); return; }


        if (e.target && e.target.tagName === 'IMG') { // 이미지 클릭만 인정
            hit();
            hideMole(hole);
        } else {
            miss();
        }
    }

    // ===== 타이머 =====
    function startTimer() {
        remainTime = GAME_TIME;
        renderTime();
        gameTimerId = setInterval(() => {
            remainTime -= 1;
            renderTime();
            if (remainTime <= 0) end();
        }, 1000);
    }

    // ===== 두더지 출현 주기 =====
    function popMoleCycle() {
        if (!isActive) return;
        if (document.querySelector('.mole-up')) return; // 이미 하나 올라와 있으면 스킵
        const hole = pickRandomHole();
        if (!hole) return;
        showMole(hole);
        setStatus('두더지 등장!', 'orange');
        moleTimeoutId = setTimeout(() => { hideMole(hole); moleTimeoutId = null; }, MOLE_HIDE);
    }

    // ===== 게임 제어 =====
    function start() {
        if (isActive) return;
        clearAllTimers();

        isActive = true;
        score = 0;
        renderScore();

        $('#startBtn').text('진행중...').prop('disabled', true);
        $('#resetBtn').prop('disabled', false);
        setStatus(`${GAME_TIME}초 동안 두더지를 잡으세요!`, 'green');

        startTimer();
        moleIntervalId = setInterval(popMoleCycle, MOLE_CYCLE);
    }

    function end() {
        if (!isActive) return;
        isActive = false;
        clearAllTimers();
        holes.forEach(hideMole);
        $('#startBtn').text('다시시작').prop('disabled', false);
        setStatus(`게임 종료! 최종 점수 : ${score} 점`, 'red');
    }

    function reset() {
        clearAllTimers();
        isActive = false;
        score = 0;
        remainTime = GAME_TIME;
        lastIdx = -1;

        holes.forEach(hideMole);
        renderScore();
        renderTime();

        $('#startBtn').text('게임시작').prop('disabled', false);
        $('#resetBtn').prop('disabled', false);
        setStatus('게임시작 버튼을 눌러 시작하세요!', 'black');

        createHoles();
    }

    function clearAllTimers() {
        if (gameTimerId) { clearInterval(gameTimerId); gameTimerId = null; }
        if (moleIntervalId) { clearInterval(moleIntervalId); moleIntervalId = null; }
        if (moleTimeoutId) { clearTimeout(moleTimeoutId); moleTimeoutId = null; }
    }

    // ===== 초기화 =====
    function boot() {
        createHoles();

        // 바닥 클릭 Miss
        $('#gameField').on('click', (e) => {
            if (e.target && e.target.id === 'gameField' && isActive) miss();
        });

        $('#startBtn').on('click', start);
        $('#resetBtn').on('click', reset);

        window.addEventListener('beforeunload', end);
    }

    document.addEventListener('DOMContentLoaded', boot);
})();