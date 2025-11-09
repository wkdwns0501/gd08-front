// $() 헬퍼(경량 체이닝) - 현재 사용X
// 지금 상태로는 게임로직 에 사용하면 REFS랑 겹쳐서 헷갈린다
// 보통 실무에서는 콘솔/테스트에 유용하게 쓰인다

export function $(selector) {
    const elements = document.querySelectorAll(selector);
    return {
        elements,
        on(event, handler) {
            elements.forEach(el => el.addEventListener(event, handler));
            return this;
        },
        css(prop, value) {
            elements.forEach(el => { el.style[prop] = value; });
            return this;
        },
        text(value) {
            if (value === undefined) return elements[0]?.textContent;
            elements.forEach(el => { el.textContent = value; });
            return this;
        },
        html(value) {
            if (value === undefined) return elements[0]?.innerHTML;
            elements.forEach(el => { el.innerHTML = value; });
            return this;
        },
        addClass(className) {
            elements.forEach(el => el.classList.add(className));
            return this;
        },
        removeClass(className) {
            elements.forEach(el => el.classList.remove(className));
            return this;
        },
        first() { return elements[0] ?? null; },
    };
}

window.$ = $;

// 예) $('#statusDisplay').text('디버그 모드 ON').css('color', 'orange');

// 브라우저 콘솔에서 잘 쓰는 조합
// $('.mole-hole').forEach(h => h.click()); // (단, NodeList엔 forEach 직접 안 됨 → .elements 사용)
// $('.mole-hole').elements.forEach(el => el.style.opacity = '0.5');
// $('#startBtn').elements[0].click();