import Item from './Item';
import { makeId } from './utils';

export default class Group implements Item {
    itemList: any;

    id: string;
    x: any;
    y: any;
    width: any;
    height: any;

    resizeDimensions: any;

    constructor(itemList: any) {
        this.itemList = itemList;

        this.id = makeId();

        this.resizeDimensions = {};

        this.inspectItems();
    }

    inspectItems() { // Loops over selected items and sets Selection properties based on the selected items collectively.
        const sel = this.itemList;
        const numItems = sel.length;

        let totalX;
        let totalY;
        let totalWidth;
        let totalHeight;

        let itemX;
        let itemY;
        let itemWidth;
        let itemHeight;

        let prevX;
        let prevY;
        let prevWidth;
        let prevHeight;

        for (let i = 0; i < numItems; i++) {
            prevX = totalX;
            prevY = totalY;
            prevWidth = totalWidth;
            prevHeight = totalHeight;

            itemX = sel[i].x;
            itemY = sel[i].y;
            itemWidth = sel[i].width;
            itemHeight = sel[i].height;

            if (i === 0) {
                totalX = itemX;
                totalY = itemY;
                totalWidth = itemWidth;
                totalHeight = itemHeight;

            } else {

                if (itemX < prevX && itemX + itemWidth > prevX + prevWidth) {
                    totalX = itemX;
                    totalWidth = itemWidth;
                } else if (itemX < prevX) {
                    totalX = itemX;
                    totalWidth = prevX + prevWidth - itemX;
                } else if (itemX + itemWidth > prevX + prevWidth) {
                    totalWidth = itemX + itemWidth - prevX;
                }

                if (itemY < prevY && itemY + itemHeight > prevY + prevHeight) {
                    totalY = itemY;
                    totalHeight = itemHeight;
                } else if (itemY < prevY) {
                    totalY = itemY;
                    totalHeight = prevY + prevHeight - itemY;
                } else if (itemY + itemHeight > prevY + prevHeight) {
                    totalHeight = itemY + itemHeight - prevY;
                }

            }
        }

        this.x = totalX;
        this.y = totalY;
        this.height = totalHeight;
        this.width = totalWidth;
    }

    setX(newX: number) {
        const xDif = newX - this.x;
        const list = this.itemList;
        const numItems = this.itemList.length;
        let item;

        let newXDistance;
        
        for (let i = 0; i < numItems; i++) {

            item = list[i];
            item.setX(item.x + xDif);
        }
        this.inspectItems();
    }

    setY(newY: number) {
        const yDif = newY - this.y;
        const list = this.itemList;
        const numItems = this.itemList.length;
        let item;
        
        for (let i = 0; i < numItems; i++) {
            item = list[i];
            item.setY(item.y + yDif);
        }
        this.inspectItems();
    }

    setXAndWidth(newX: number, newWidth: number) {
        const originalWidth = this.resizeDimensions.originalWidth;
        let widthPercentDif = newWidth / originalWidth;
        let newItemWidth;
        let newXDistance;
        let newItemX;
        const itemList = this.itemList;
        const numItems = itemList.length;
        let item;

        for (let i = 0; i < numItems; i++) {
            item = itemList[i];
            newItemWidth = item.resizeDimensions.originalWidth * widthPercentDif;
            newXDistance = item.resizeDimensions.xDistance * widthPercentDif;
            newItemX = newXDistance + newX;

            item.setXAndWidth(newItemX, newItemWidth);
        }
        this.inspectItems();
    }

    resizeWidth(newWidth: number) {
        const originalWidth = this.resizeDimensions.originalWidth;
        let widthPercentDif = newWidth / originalWidth;
        let newItemWidth;
        const itemList = this.itemList;
        const numItems = itemList.length;
        let item;

        for (let i = 0; i < numItems; i++) {
            item = itemList[i];
            newItemWidth = item.resizeDimensions.originalWidth * widthPercentDif;
            item.resizeWidth(newItemWidth);
        }
        this.inspectItems();
    }

    setYAndHeight(newY: number, newHeight: number) {
        let originalHeight = this.resizeDimensions.originalHeight;
        let heightPercentDif = newHeight / originalHeight;
        let newItemHeight;
        let newYDistance;
        let newItemY;
        const itemList = this.itemList;
        const numItems = itemList.length;
        let item;

        for (let i = 0; i < numItems; i++) {
            item = itemList[i];
            newItemHeight = item.resizeDimensions.originalHeight * heightPercentDif;
            newYDistance = item.resizeDimensions.yDistance * heightPercentDif;
            newItemY = newYDistance + newY;

            item.setYAndHeight(newItemY, newItemHeight);
        }
        this.inspectItems();
    }

    resizeHeight(newHeight: number) {
        let originalHeight = this.resizeDimensions.originalHeight;
        let heightPercentDif = newHeight / originalHeight;
        let newItemHeight;
        const itemList = this.itemList;
        const numItems = itemList.length;
        let item;
        let xDif;

        for (let i = 0; i < numItems; i++) {
            item = itemList[i];
            newItemHeight = item.resizeDimensions.originalHeight * heightPercentDif;
            item.resizeHeight(newItemHeight);
        }
        this.inspectItems();
    }

    setResizeDimensions(x: number, y: number) {
        this.resizeDimensions = {
            originalX: this.x,
            originalY: this.y,
            originalWidth: this.width,
            originalHeight: this.height,
            xDistance: this.x - x,
            yDistance: this.y - y
        }
        const items = this.itemList;
        const numItems = items.length;

        for (let i = 0; i < numItems; i++) {
            items[i].setResizeDimensions(this.x, this.y);
        }
    }

    draw() {
        const list = this.itemList;
        const numItems = list.length;
        let item;

        for(let i = 0; i < numItems; i++) {
            item = list[i];
            item.draw();
        }
    }
}