/**
 * Module Export
 * @author  Alex
 * @version 20190725
 */
class Export {
    private _data:Array<Array<any>>;

    constructor(data:Array<Array<any>>) {
        this._data = data;
    }

    csv(fileName:string = '') {
        if(this._data instanceof Array == false) {
            throw '数据格式不正确，无法进行导出！';
        }
        let tmp = [];
        for(let row of this._data) {
            for(let cell of row) {
                // 转义处理
                // TODO
                tmp.push(`${ cell || '' },`);
            }
            tmp.push('\n');
        }
        let uri       = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(tmp.join(''));
        let link      = document.createElement('a');
        link.href     = uri;
        link.download = `${ fileName || new Date().getTime() }.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export default Export;