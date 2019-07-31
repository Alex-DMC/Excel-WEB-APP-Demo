import { button as configButton, grid as configGrid, column as configColumn } from './config/layout.js';
import ViewLayout from './view/layout.js';
import MessageBus from './module/message.js';
import Cell from './module/cell.js';

/**
 * Excel demo web app code
 * @author  Alex
 * @version 20190725
 */
class Excel {
    id    :string;
    view  :any;
    config:any = {
        grid   : configGrid,
        buttons: configButton,
        column : configColumn,
    };

    private _column:string; // 当前所选列名称(排序用)
    private _cell  :Cell;   // 当前选定单元格
    private _data  :Array<Array<any>>; // 数据
    private _layout:any;    // 布局对象
    private _range :[string, string]; // 暂未使用

    constructor(id:string = 'app', data:any = []) {
        this.id      = id;
        this.view    = document.getElementById(id) || null;
        this._column = this.config.column.select || 'A';
        this._data   = data;

        if(!this.view) {
            console.error(`The element with ID ${ id } did not find the view that could not be initialized.`);
            throw '初始化失败！';
        }

        // 发布版本放开
        // this.init();

        // Demo版本放开 展示Loading效果 延迟1秒初始化
        setTimeout(() => {
             this.init();
        }, 1000);
    }

    /* Methods */
    init() {
        // 初始化布局
        const layout = this._layout = new ViewLayout(this.view, this.config);
        layout.init().load(this._data);

        // 初始化消息总线
        const msgbus = new MessageBus(this);
        msgbus.init();
    }

    destroy() {
        this._layout.destroy();
    }

    setCell(id:string, row:number, col:number, value:string) {
        console.log(`${ id } new value "${ value }" saved.`);
        if(!this._data[row]) {
            this._data[row] = [];
        }
        this._data[row][col] = value;
    }

    /* Getter & Setter */
    public get data():Array<Array<any>> {
        return this._data;
    }
    public set data(data:Array<Array<any>>) {
        this._data = data;
        if(this._layout) {
            this._layout.load(this._data);
            this._cell = null;
        }
    }
    public get cell():Cell {
        return this._cell;
    }
    public set cell(cell:Cell) {
        this._cell = cell;
    }
    public get column():string {
        return this._column;
    }
    public set column(column:string) {
        this._column = column;
    }
    public get layout():Cell {
        return this._layout;
    }
}

export default Excel;