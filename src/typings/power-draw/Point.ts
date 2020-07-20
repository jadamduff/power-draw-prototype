export default class Point {
    x: number;
    y: number;
    percentWidth: number;
    percentHeight: number;

    constructor(x: number, y: number, percentWidth: number, percentHeight: number) {
        this.x = x;
        this.y = y;
        this.percentWidth = percentWidth;
        this.percentHeight = percentHeight;
    }

    setPoint(x: number, y: number, percentWidth: number, percentHeight: number) {
        this.setX(x, percentWidth);
        this.setY(y, percentHeight);

    }

    setXY(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    setX(newX: number, percentWidth: number) {
        this.x = newX;
        this.percentWidth = percentWidth;
    }

    setY(newY: number, percentHeight: number) {
        this.y = newY;
        this.percentHeight = percentHeight;
    }
}