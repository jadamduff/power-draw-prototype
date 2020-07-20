import { getMouseXY } from './utils';

export default class RightClick {
    canvasParent: any;
    callback: any;

    constructor(canvasParent: any, callback: any) {
        this.canvasParent = canvasParent;
        this.callback = callback;

        this.setEventListener();
    }

    setEventListener() {
        this.canvasParent.canvas.addEventListener('contextmenu', this.handleRightClick.bind(this));
    }

    handleRightClick(e: any) {
        e.preventDefault();
        const { x, y } = getMouseXY(e, this.canvasParent.boundings);
        const numItems = this.canvasParent.itemList.length;
        const parent = this.canvasParent;
        let item;
        let selectionClicked = false;
        for (let i = numItems - 1; i >= 0; i--) { // Loop over canvas items and determine if mouse coordinates are inside any item coordinates.
            item = parent.itemList[i];
            if (x > item.x && y > item.y && x < item.x + item.width && y < item.y + item.height) {
                selectionClicked = true;
                if (!parent.selection.includes(item)) {
                    parent.selection.selectSingleItem(item);
                    parent.redrawShapes();
                }
                break;
            }
        }

        if (!selectionClicked) {
            parent.selection.deselectAll();
        }

        this.callback({
            selectionClicked,
            x: e.clientX,
            y: e.clientY
        })

    }
}