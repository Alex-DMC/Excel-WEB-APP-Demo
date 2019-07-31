import { button as configButton, grid as configGrid, column as configColumn } from './config/layout.js';
import ViewLayout from './view/layout.js';
import MessageBus from './module/message.js';
class Excel {
    constructor(id = 'app', data = []) {
        this.config = {
            grid: configGrid,
            buttons: configButton,
            column: configColumn,
        };
        this.id = id;
        this.view = document.getElementById(id) || null;
        this._column = this.config.column.select || 'A';
        this._data = data;
        if (!this.view) {
            console.error(`The element with ID ${id} did not find the view that could not be initialized.`);
            throw '初始化失败！';
        }
        setTimeout(() => {
            this.init();
        }, 1000);
    }
    init() {
        const layout = this._layout = new ViewLayout(this.view, this.config);
        layout.init().load(this._data);
        const msgbus = new MessageBus(this);
        msgbus.init();
    }
    destroy() {
        this._layout.destroy();
    }
    setCell(id, row, col, value) {
        console.log(`${id} new value "${value}" saved.`);
        if (!this._data[row]) {
            this._data[row] = [];
        }
        this._data[row][col] = value;
    }
    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
        if (this._layout) {
            this._layout.load(this._data);
            this._cell = null;
        }
    }
    get cell() {
        return this._cell;
    }
    set cell(cell) {
        this._cell = cell;
    }
    get column() {
        return this._column;
    }
    set column(column) {
        this._column = column;
    }
    get layout() {
        return this._layout;
    }
}
export default Excel;
