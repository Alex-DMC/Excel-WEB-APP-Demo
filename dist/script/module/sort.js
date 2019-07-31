class Sort {
    constructor(data) {
        this.ASC = 1;
        this.DESC = 0;
        this._data = data;
    }
    column(columnName, asc = 1, passTitle = true) {
        let col = this.convIndexByColumn(columnName);
        let tas;
        const ascend = (col) => {
            return (a, b) => {
                if (isNaN(a[col]) && isNaN(b[col]))
                    return a[col] > b[col] ? 1 : -1;
                return a[col] - b[col];
            };
        };
        const descend = (col) => {
            return (a, b) => {
                if (isNaN(a[col]) && isNaN(b[col]))
                    return b[col] > a[col] ? 1 : -1;
                return b[col] - a[col];
            };
        };
        if (passTitle)
            tas = this._data.splice(0, 1);
        if (asc) {
            this._data.sort(ascend(col));
        }
        else {
            this._data.sort(descend(col));
        }
        if (passTitle && tas)
            this._data.unshift(...tas);
        return this._data;
    }
    convIndexByColumn(columnName) {
        return columnName.charCodeAt(0) - 65;
    }
}
export default Sort;
