import Cell from './cell.js';
import Export from './export.js';
import Sort from './sort.js';
class MessageBus {
    constructor(app) {
        this._app = app;
    }
    init() {
        window.addEventListener('message', this.messageHandler.bind(this));
        return this;
    }
    destroy() {
        window.removeEventListener('message', this.messageHandler);
    }
    messageHandler(event) {
        if ('object' != typeof event || !event.data.hasOwnProperty('type') || 'messageBus' != event.data.type)
            return;
        switch (event.data.comp) {
            case 'toolsbar':
                this.toolsbarHandler(event.data);
                break;
            case 'column':
                this.columnHandler(event.data);
                break;
            case 'cell':
                this.cellHandler(event.data);
                break;
            case 'data':
                this.dataHandler(event.data);
                break;
        }
    }
    toolsbarHandler(data) {
        switch (data.cmd) {
            case 'save':
                new Export(this._app.data).csv();
                break;
            case 'bold':
                if (this._app.cell)
                    this._app.cell.blod();
                break;
            case 'italic':
                if (this._app.cell)
                    this._app.cell.italic();
                break;
            case 'alignLeft':
                if (this._app.cell)
                    this._app.cell.align('left');
                break;
            case 'alignCenter':
                if (this._app.cell)
                    this._app.cell.align('center');
                break;
            case 'alignRight':
                if (this._app.cell)
                    this._app.cell.align('right');
                break;
            case 'columnAsc':
                var sort = new Sort(this._app.data);
                this._app.data = sort.column(this._app.column, sort.ASC);
                break;
            case 'columnDesc':
                var sort = new Sort(this._app.data);
                this._app.data = sort.column(this._app.column, sort.DESC);
                break;
        }
    }
    cellHandler(data) {
        if (this._app.cell && this._app.cell.id != data.id) {
            this._app.cell.blur();
            this._app.cell = null;
        }
        let cell = this._app.cell;
        if (!cell) {
            cell = this._app.cell = new Cell(data.id);
        }
        switch (data.cmd) {
            case 'compute':
                cell.compute();
                break;
            case 'edit':
                cell.edit();
                break;
            case 'select':
                cell.focus();
                this._app.layout.footerbar.cellName = data.id;
                break;
        }
    }
    columnHandler(data) {
        switch (data.cmd) {
            case 'select':
                this._app.column = data.id;
                this._app.layout.footerbar.columnName = data.id;
                break;
        }
    }
    dataHandler(data) {
        switch (data.cmd) {
            case 'update':
                let { id, row, col, value } = data;
                this._app.setCell(id, row, col, value);
                break;
        }
    }
}
function emit(component, data) {
    window.postMessage(Object.assign(data, { type: 'messageBus', comp: component }), '*');
}
export default MessageBus;
export { MessageBus, emit };
