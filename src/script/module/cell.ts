import { emit } from '../module/message';

/**
 * Module Cell
 * @author  Alex
 * @version 20190725
 */
class Cell {
    private _id   :string;
    private _row  :number;
    private _col  :number;
    private _cell :any;
    private _edit :boolean = false;
    private _value:string;

    constructor(id:string) {
    	console.log(`Select cell: ${ id }.`);
        this._id   = id;
        this._row  = parseInt(id.substr(1)) - 1;
        this._col  = id.charCodeAt(0) - 65;
        this._cell = document.querySelector(`.excel-content td[data-id=${ id }]`);
        this._value= this._cell.innerText;
    }

    public get id() {
        return this._id;
    }

    private addClass(className:string) {
    	if(-1 == this._cell.className.indexOf(className)) {
    		this._cell.className = this._cell.className ? this._cell.className +` ${ className }` : className;
    	}
    }

    private removeClass(className:string) {
    	let clss = this._cell.className.split(' ');
    	let ix   = clss.indexOf(className);
    	if(-1 < ix) {
    		clss.splice(ix, 1);
    		this._cell.className = clss.join(' ');
    	}
    }

    private triggerClass(className:string) {
    	let clss = this._cell.className.split(' ');
    	let ix   = clss.indexOf(className);
    	if(-1 < ix) {
    		clss.splice(ix, 1);
    		this._cell.className = clss.join(' ');
    	}else {
    		this._cell.className = this._cell.className ? this._cell.className +` ${ className }` : className;
    	}
    }

    compute() {
    	if(this._value != this._cell.innerText) {
    		this._value = this._cell.innerText = eval(this._cell.innerText);
    		const range = window.getSelection();
        	range.selectAllChildren(this._cell);
        	range.collapseToEnd();
    	}
    	return this;
    }

    edit() {
    	this._edit = true;
    	this._cell.setAttribute('contenteditable', 'true');
    	return this;
    }

    focus() {
    	this.addClass('on');
    	return this;
    }

    blur() {
    	if(this._edit) {
    		this._edit = false;
    		this._cell.setAttribute('contenteditable', 'false');
    	}
    	// 数据保存
    	if(this._value != this._cell.innerText) {
    		this._value = this._cell.innerText;
    		emit('data', { cmd: 'update', id: this._id, row: this._row, col: this._col, value: this._value });
    	}
    	this.removeClass('on');
    	return this;
    }

    blod() {
    	this.triggerClass('strong');
    	return this;
    }

    italic() {
    	this.triggerClass('italic');
    	return this;
    }

    align(align:string) {
    	this.removeClass('left');
    	this.removeClass('center');
    	this.removeClass('right');
    	this.triggerClass(align);
    	return this;
    }
}

export default Cell;