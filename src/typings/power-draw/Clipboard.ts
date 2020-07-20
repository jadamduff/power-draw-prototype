import Group from './Group';
import Shape from './Shape';
import Point from './Point';
import Segment from './Segment';
import ControlPoint from './ControlPoint';

export default class Clipboard {
    itemList: any;
    selection: any;

    constructor() {
        this.itemList = [];
        this.selection = {x: null, y: null};
    }

    copy(items: any, selX: number, selY: number) {
        this.selection.x = selX;
        this.selection.y = selY;

        this.itemList = this.clone(items);
    }

    clone(items: any) {
        let clonedItems = [];
        let numItems = items.length;
        let item;

        for (let i = 0; i < numItems; i++) {
            item = items[i];
            if (item instanceof Group) {
                clonedItems.push(this.cloneGroup(item));
            } else {
                const points = item.points;
                const numPoints = points.length;
                let clonedPoints = [];
                let point;

                for (let i = 0; i < numPoints; i++) {
                    point = points[i];
                    clonedPoints.push(new Point(point. x, point.y, point.percentWidth, point.percentHeight));
                }

                const segments = item.segments;
                const numSegments = segments.length;
                let clonedSegments = [];
                let segment;

                for (let i = 0; i < numSegments; i++) {
                    segment = segments[i];
                    clonedSegments.push(new Segment(clonedPoints[i], i === numSegments - 1 ? clonedPoints[0] : clonedPoints[i + 1], new ControlPoint(segment.controlPtA.active, segment.controlPtA.percentWidth, segment.controlPtA.percentHeight), new ControlPoint(segment.controlPointB.active, segment.controlPtB.percentWidht, segment.controlPtB.percentHeight)));
                }

                const clonedShape = new Shape('none', item.x, item.y, item.width, item.height, item.fillHex, item.fillRGB, item.borderHex, item.borderRGB, item.borderWidth, item.canvas);
                clonedShape.setPoints(clonedPoints);
                clonedShape.setSegments(clonedSegments);

                clonedItems.push(clonedShape);

            } 
        }
        return clonedItems;
    }

    cloneGroup(group: any): any {
        let clonedItemList: any = [];
        let numItems = group.itemList.length;
        let item;

        for (let i = 0; i < numItems; i++) {
            item = group.itemList[i];
            if (item instanceof Group) {
                clonedItemList.push(this.cloneGroup(item));
            } else {
                clonedItemList = [...clonedItemList, this.clone([item])[0]]
            }
        }

        return new Group(clonedItemList);
    }

    cut(items: any, selX: number, selY: number) {
        this.selection.x = selX;
        this.selection.y = selY;

        this.itemList = this.clone(items);
    }

    getPastedItems(newX: number, newY: number) {
        const xDif = newX - this.selection.x;
        const yDif = newY - this.selection.y;

        const clonedItemList = this.clone(this.itemList);
        const numItems = clonedItemList.length;

        let item;

        for (let i = 0; i < numItems; i++) {
            item = clonedItemList[i];

            clonedItemList[i].setX(item.x + xDif);
            clonedItemList[i].setY(item.y + yDif);
        }

        return clonedItemList;
    }

}