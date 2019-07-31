class Footerbar {
    constructor(app, config = null) {
        this.app = app;
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
    render() {
        this.content.innerHTML = `
            <span>排序列: <strong>${this._columnName}</strong></span>
            <span>已选单元格: <strong>${this._cellName || '未选择'}</strong></span>
        `;
    }
    set cellName(cellName) {
        this._cellName = cellName;
        this.render();
    }
    set columnName(columnName) {
        this._columnName = columnName;
        this.render();
    }
}
export default Footerbar;
