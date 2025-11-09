// $() 경량 체이닝 헬퍼

(() => {
    function $(selector, root = document) {
        const els = root.querySelectorAll(selector);
        return {
            els,
            on(evt, handler) { els.forEach(el => el.addEventListener(evt, handler)); return this; },
            off(evt, handler) { els.forEach(el => el.removeEventListener(evt, handler)); return this; },
            css(prop, val) { els.forEach(el => el.style[prop] = val); return this; },
            text(val) {
                if (val === undefined) return els[0]?.textContent;
                els.forEach(el => el.textContent = val);
                return this;
            },
            html(val) {
                if (val === undefined) return els[0]?.innerHTML;
                els.forEach(el => el.innerHTML = val);
                return this;
            },
            addClass(cls) { els.forEach(el => el.classList.add(cls)); return this; },
            removeClass(cls) { els.forEach(el => el.classList.remove(cls)); return this; },
            toggleClass(cls, force) { els.forEach(el => el.classList.toggle(cls, force)); return this; },
            prop(name, value) { els.forEach(el => (el[name] = value)); return this; },
            attr(name, value) { els.forEach(el => el.setAttribute(name, value)); return this; },
            first() { return els[0] || null; },
        };
    }
    window.$ = $; // 전역 노출(필요하면 window.$$로 이름 바꿔도 됩니다)
})();