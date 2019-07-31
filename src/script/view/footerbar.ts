import { emit } from '../module/message.js';

/**
 * Component Footerbar
 * @author  Alex
 * @version 20190725
 */
class Footerbar {
    private _cellName  :string;
    private _columnName:string;

    app    :any;
    content:any;

    constructor(app:any, config:any = null) {
		this.app     = app;
		this.content = app.querySelector('.excel-footbar');
        this._columnName = config.column.select || 'A';
    }

    init() {
        this.render();
        return this;
    }

    destroy() {
    	this.content = null;
    }

    private render() {
        this.content.innerHTML = `
            <span>排序列: <strong>${ this._columnName }</strong></span>
            <span>已选单元格: <strong>${ this._cellName || '未选择' }</strong></span>
        `;
    }

    public set cellName(cellName:string) {
        this._cellName = cellName;
        this.render();
    }
    public set columnName(columnName:string) {
        this._columnName = columnName;
        this.render();
    }
}

export default Footerbar;