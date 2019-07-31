import Toolsbar from './toolsbar.js';
import Footerbar from './footerbar.js';
import { emit } from '../module/message.js';
class Layout {
    constructor(view, config) {
        this.view = view;
        this.config = config;
        this.row = config.grid.row || 200;
        this.col = config.grid.column || 26;
        this.app = document.createElement('div');
        this.app.id = 'app-excel';
        this.app.className = 'excel';
        this.app.innerHTML = template;
        this.content = this.app.querySelector('.excel-content');
    }
    init() {
        this.view.innerHTML = '';
        this.view.appendChild(this.app);
        const labelCol = this.app.querySelector('.excel-label--column');
        let labels = [];
        for (let i = 0; i < this.col; i++) {
            labels.push(`<span class="label">${String.fromCharCode(65 + i)}</span>`);
        }
        labelCol.innerHTML = labels.join('');
        const labelRow = this.app.querySelector('.excel-label--row');
        labels = [];
        for (let i = 0; i < this.row; i++) {
            labels.push(`<span class="label">${i + 1}</span>`);
        }
        labelRow.innerHTML = labels.join('');
        const toolsbar = this._toolsbar = new Toolsbar(this.app, this.config);
        toolsbar.init().bindEvent();
        const footerbar = this._footerbar = new Footerbar(this.app, this.config);
        footerbar.init();
        this.app.addEventListener('click', event.click, true);
        this.app.addEventListener('dblclick', event.dblclick, true);
        this.app.addEventListener('keyup', event.keyup, true);
        return this;
    }
    destroy() {
        this.app.removeEventListener('click', event.click, true);
        this.app.removeEventListener('dblclick', event.dblclick, true);
        this.app.removeEventListener('keyup', event.keyup, true);
    }
    load(data = []) {
        const tables = [];
        for (let r = 0; r < this.row; r++) {
            tables.push('<tr>');
            for (let c = 0; c < this.col; c++) {
                tables.push(`<td data-id="${String.fromCharCode(65 + c) + (r + 1)}">${data[r] && data[r][c] ? data[r][c] : ''}</td>`);
            }
            tables.push('</tr>');
        }
        this.content.innerHTML = tables.join('');
        return this;
    }
    get toolsbar() {
        return this._toolsbar;
    }
    get footerbar() {
        return this._footerbar;
    }
}
;
const template = `
    <div class="excel-toolbar"></div>
    <div class="excel-window">
        <div class="excel-label--column"></div>
        <div class="excel-panel">
            <div class="excel-label--row"></div>
            <table class="excel-content"></table>
        </div>
    </div>
    <div class="excel-footbar"></div>
`;
const event = {
    click(event) {
        switch (event.target.nodeName) {
            case 'TD':
                emit('cell', { cmd: 'select', id: event.target.dataset.id });
                break;
            case 'SPAN':
                let name = event.target.innerText;
                if (/^[A-Z]{1}$/.test(name)) {
                    emit('column', { cmd: 'select', id: name });
                }
                break;
        }
    },
    dblclick(event) {
        switch (event.target.nodeName) {
            case 'TD':
                emit('cell', { cmd: 'edit', id: event.target.dataset.id });
                break;
        }
    },
    keyup(event) {
        switch (event.target.nodeName) {
            case 'TD':
                if ('Enter' == event.key) {
                    emit('cell', { cmd: 'compute', id: event.target.dataset.id });
                }
                break;
        }
    },
};
export default Layout;
