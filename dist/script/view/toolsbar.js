import { emit } from '../module/message.js';
class Toolsbar {
    constructor(app, config) {
        this.app = app;
        this.config = config;
        this.buttons = config.buttons || {};
        this.content = app.querySelector('.excel-toolbar');
    }
    init() {
        const btns = [];
        for (let btn of this.buttons) {
            if ('|' === btn) {
                btns.push('<hr class="sp" />');
            }
            else {
                btns.push(`<button type="button" data-cmd="${btn.cmd}" ${btn.disabled ? 'disabled' : ''} class="excel-toolbar--btn">${btn.text}</button>`);
            }
        }
        this.content.innerHTML = btns.join('');
        return this;
    }
    bindEvent() {
        this.content.addEventListener('click', event.click, true);
        return this;
    }
    destroy() {
        this.content.removeEventListener('click', event.click, true);
        this.content = null;
    }
}
const event = {
    click(event) {
        if ('BUTTON' != event.target.nodeName)
            return;
        const cmd = event.target.dataset.cmd;
        switch (cmd) {
            default:
                emit('toolsbar', { cmd });
        }
    },
};
export default Toolsbar;
