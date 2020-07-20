import Point from './Point';
import Segment from './Segment';

export default interface ShapeItem {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    points: Point[];
    segments: Segment[];
    fillHex?: any;
    fillRGB?: any;
    borderHex?: any;
    borderRGB?: any;
    borderWidth: number;
    selectorSquares: any;
    resizeDimensions: any;

    draw(): void;
    create(mousedownX: number, mousedownY: number, mx: number, my: number, tool?: string): void;
    inspectSelf(): void;
    handleAddPointHover(x: number, y: number, callback: any): void;
    clearAddPointHover(callback: any): void;
    addPoint(callback: any): void;
    deletePoint(pointIndex: any): void;
    setPoints(points: Point[]): void;
    setSegments(segments: Segment[]): void;
    setResizeDimensions(x: number, y: number): void;
    setX(newX: number): void;
    setY(newY: number): void;
    resizeWidth(newWidtyh: number): void;
    resizeHeight(newHeight: number): void;
    setXAndWidth(newX: number, newWidth: number): void;
    setYAndHeight(newY: number, newHeight: number): void;
}