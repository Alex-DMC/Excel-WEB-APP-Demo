const button = [
    {
        cmd: 'open',
        text: '打开',
        disabled: true,
    }, {
        cmd: 'save',
        text: '保存',
    },
    '|',
    {
        cmd: 'bold',
        text: '加粗',
    }, {
        cmd: 'italic',
        text: '倾斜',
    },
    '|',
    {
        cmd: 'alignLeft',
        text: '左对齐',
    }, {
        cmd: 'alignCenter',
        text: '居中',
    }, {
        cmd: 'alignRight',
        text: '右对齐',
    },
    '|',
    {
        cmd: 'columnAsc',
        text: '正序',
    }, {
        cmd: 'columnDesc',
        text: '倒序',
    },
];
const grid = {
    row: 200,
    column: 26,
};
const column = {
    select: 'A',
};
export default button;
export { button, grid, column };
