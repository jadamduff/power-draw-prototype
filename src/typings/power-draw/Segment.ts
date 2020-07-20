import Point from "./Point";
import ShapeItem from './ShapeItem';
import { calcDistance, distToSegment, getBezierXY } from "./utils";
import ControlPoint from "./ControlPoint";

export default class Segment {
    pointA: Point;
    pointB: Point;

    controlPtA: ControlPoint;
    controlPtB: ControlPoint;

    addPointHover: boolean;
    addPointXY: any;

    constructor(pointA: Point, pointB: Point, controlPtA: ControlPoint, controlPtB: ControlPoint) {
        this.pointA = pointA;
        this.pointB = pointB;

        this.controlPtA = controlPtA;
        this.controlPtB = controlPtB;

        this.addPointHover = false;
        this.addPointXY = false
    }

    isOnSegment(cx: number, cy: number) {
        const totalDist = calcDistance(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y);
        const distAToC = calcDistance(this.pointA.x, this.pointA.y, cx, cy);
        const distCToB = calcDistance(cx, cy, this.pointB.x, this.pointB.y);

        return distAToC + distCToB === totalDist;
    }

    handleAddPointHover(cx: number, cy: number, shape: ShapeItem, callback: any) {
        let hovering = this.isHovering(cx, cy, shape);

        if (hovering) {
            this.addPointHover = true;
            this.addPointXY = { x: hovering.x, y: hovering.y };
            callback();
        } else if (this.addPointHover !== false) {
            this.addPointHover = false;
            this.addPointXY = false;
            callback();
        }
    }

    isHovering(cx: number, cy: number, shape: ShapeItem) {
        const padding = 8;
        const distToStraightSegment: any = distToSegment(cx, cy, this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y);

        if (distToStraightSegment === false) {
            return false;
        }

        if (this.controlPtA.active === false && this.controlPtB.active === false) {
            if (distToStraightSegment[0] <= padding) {
                return { x: distToStraightSegment[1].x, y: distToStraightSegment[1].y };
            } else {
                return false;
            }
        } else {
            const percentOfSegment = ((cx - this.pointA.x / this.pointB.x - this.pointB.x) + (cy - this.pointA.y / this.pointB.y - this.pointB.y)) / 2;
            let controlPtA;
            let controlPtB;
            if (this.controlPtA.active) {
                controlPtA = { x: shape.x + (shape.width * this.controlPtA.percentWidth!), y: shape.y + (shape.height * this.controlPtA.percentHeight!) };
            } else {
                controlPtA = { x: this.pointA.x, y: this.pointA.y };
            }

            if (this.controlPtB.active) {
                controlPtB = { x: shape.x + (shape.width * this.controlPtB.percentWidth!), y: shape.y + (shape.height * this.controlPtB.percentHeight!) };
            } else {
                controlPtB = { x: this.pointB.x, y: this.pointB.y };
            }

            let closestSubSegment: any;
            let shortestDistToSubSegment: any;
            let percentInterval = 0.0;
            let bezXY;
            let bezXYDist;

            let x: number | boolean = false;
            let y: number | boolean  = false;

            for (let i = 0; i < 20; i++) {
                bezXY = getBezierXY(percentInterval, this.pointA.x, this.pointA.y, controlPtA.x, controlPtA.y, controlPtB.x, controlPtB.y, this.pointB.x, this.pointB.y);
                bezXYDist = calcDistance(cx, cy, bezXY.x, bezXY.y)
                if (bezXYDist < shortestDistToSubSegment || i === 0) {
                    shortestDistToSubSegment = bezXYDist;
                    closestSubSegment = percentInterval;
                }
                percentInterval += 0.05;
            }

            const subSegmentCurvePoints = Math.max(Math.abs(this.pointB.x - this.pointA.x), Math.abs(this.pointB.y - this.pointA.y)) / 20;
            const intervalMultiplier = 0.10 / subSegmentCurvePoints;
            for (let i = 0; closestSubSegment === 0 || closestSubSegment === 0.95 ? i < subSegmentCurvePoints / 2 : i < subSegmentCurvePoints; i++) {
                bezXY = getBezierXY(closestSubSegment !== 0 ? (closestSubSegment - 0.05) + (i * intervalMultiplier) : closestSubSegment + (i * intervalMultiplier), this.pointA.x, this.pointA.y, controlPtA.x, controlPtA.y, controlPtB.x, controlPtB.y, this.pointB.x, this.pointB.y);
                bezXYDist = calcDistance(cx, cy, bezXY.x, bezXY.y)
                if (bezXYDist < shortestDistToSubSegment || i === 0) {
                    shortestDistToSubSegment = bezXYDist;
                    if (bezXYDist <= padding) {
                        x = bezXY.x;
                        y = bezXY.y;
                    }
                }
            }

            if (x !== false && y !== false) {
                return { x, y }
            } else {
                return false;
            }
        }

    }

    clearAddPointHover(callback: any) {
        this.addPointHover = false;
        this.addPointXY = false;
        callback();
    }
}