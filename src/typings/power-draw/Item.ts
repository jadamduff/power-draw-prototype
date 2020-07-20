export default interface Item {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    
    resizeDimensions: any;

    draw(): void;
    setResizeDimensions(x: number, y: number): void;
    setX(newX: number): void;
    setY(newY: number): void;
    resizeWidth(newWidtyh: number): void;
    resizeHeight(newHeight: number): void;
    setXAndWidth(newX: number, newWidth: number): void;
    setYAndHeight(newY: number, newHeight: number): void;
}