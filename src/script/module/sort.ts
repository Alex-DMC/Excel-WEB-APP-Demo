class Sort {
	readonly ASC  = 1;
	readonly DESC = 0;

	private _data:any;

    constructor(data:any) {
        this._data = data;
    }

    column(columnName:string, asc:number = 1, passTitle:boolean = true):any {
    	let col = this.convIndexByColumn(columnName);
        let tas:any;

    	const ascend = (col:number) => {
            return (a:any, b:any) => {
                if(isNaN(a[col]) && isNaN(b[col])) return a[col] > b[col] ? 1 : -1;
    		    return a[col] - b[col];
            }
		}
		const descend = (col:number) => {
            return (a:any, b:any) => {
                if(isNaN(a[col]) && isNaN(b[col])) return b[col] > a[col] ? 1 : -1;
    		    return b[col] - a[col];
            }
		}

        if(passTitle) tas = this._data.splice(0, 1);
		if(asc) {
			this._data.sort(ascend(col));
		}else {
			this._data.sort(descend(col));
		}
        if(passTitle && tas) this._data.unshift(...tas);

    	return this._data;
    }

    private convIndexByColumn(columnName:string):number {
    	return columnName.charCodeAt(0) - 65;
    }
}

export default Sort;