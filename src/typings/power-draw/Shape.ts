import Item from './Item';
import ShapeItem from './ShapeItem';
import { makeId, incrementBorderWidth, getBezierMinMax } from './utils';
import Point from './Point';
import ControlPoint from './ControlPoint';
import Segment from './Segment';
import { setFlagsFromString } from 'v8';

export default class Shape implements Item, ShapeItem {

    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    points: Point[];
    segments: Segment[];
    isLine: boolean;
    canvas: any;
    fillHex: any;
    fillRGB: any;
    borderHex: any;
    borderRGB: any;
    borderWidth: number;
    selectorSquares: any;
    resizeDimensions: any;

    constructor(template: string, x: number, y: number, width: number, height: number, fillHex: any, fillRGB: any, borderHex: any, borderRGB: any, borderWidth: number, canvas: any) {
        this.id = makeId();
        this.type = 'none';
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.points = [];
        this.segments = [];
        this.isLine = false;
        this.canvas = canvas;
        this.fillHex = fillHex;
        this.fillRGB = fillRGB;
        this.borderHex = borderHex;
        this.borderRGB = borderRGB;
        this.borderWidth = borderWidth;
        this.selectorSquares = {};
        this.resizeDimensions = {};

        this.setTemplate(template, x, y);
    }

    setTemplate(template: string, x: number, y: number) {
        switch(template) {
            case 'none':
                this.points = [];
                this.segments = [];
                this.type = 'none';
                break;
            case 'rectangle':
                this.points = [new Point(x, y, 0.0, 0.0), new Point(x, y, 1.0, 0.0), new Point(x, y, 1.0, 1.0), new Point(x, y, 0.0, 1.0)];
                this.segments = [new Segment(this.points[0], this.points[1], new ControlPoint(false), new ControlPoint(false)), new Segment(this.points[1], this.points[2], new ControlPoint(false), new ControlPoint(false)), new Segment(this.points[2], this.points[3], new ControlPoint(false), new ControlPoint(false)), new Segment(this.points[3], this.points[0], new ControlPoint(false), new ControlPoint(false))];
                this.type = 'shape';
                break;
            case 'oval':
                this.points = [new Point(x, y, 0.5, 0.0), new Point(x, y, 1.0, 0.5), new Point(x, y, 0.5, 1.0), new Point(x, y, 0.0, 0.5)];
                
                let newSegmentsList = [];

                let controlPtAPercentWidth = 0.7761423749153967;
                let controlPtAPercentHeight = 0.0;
                let controlPtA = new ControlPoint (true, this.x + this.width * controlPtAPercentWidth, this.y + this.height * controlPtAPercentHeight, controlPtAPercentWidth, controlPtAPercentHeight);
                
                let controlPtBPercentWidth = 1.0;
                let controlPtBPercentHeight = 0.2238576250846033;
                let controlPtB = new ControlPoint (true, this.x + this.width * controlPtBPercentWidth, this.y + this.height * controlPtBPercentHeight, controlPtBPercentWidth, controlPtBPercentHeight);
                newSegmentsList.push(new Segment(this.points[0], this.points[1], controlPtA, controlPtB));

                controlPtAPercentWidth = 1.0;
                controlPtAPercentHeight = 0.7761423749153967;
                controlPtA = new ControlPoint (true, this.x + this.width * controlPtAPercentWidth, this.y + this.height * controlPtAPercentHeight, controlPtAPercentWidth, controlPtAPercentHeight);
                
                controlPtBPercentWidth = 0.7761423749153967;
                controlPtBPercentHeight = 1.0;
                controlPtB = new ControlPoint (true, this.x + this.width * controlPtBPercentWidth, this.y + this.height * controlPtBPercentHeight, controlPtBPercentWidth, controlPtBPercentHeight);
                newSegmentsList.push(new Segment(this.points[1], this.points[2], controlPtA, controlPtB));


                controlPtAPercentWidth = 0.2238576250846033;
                controlPtAPercentHeight = 1.0;
                controlPtA = new ControlPoint (true, this.x + this.width * controlPtAPercentWidth, this.y + this.height * controlPtAPercentHeight, controlPtAPercentWidth, controlPtAPercentHeight);
                
                controlPtBPercentWidth = 0.0;
                controlPtBPercentHeight = 0.7761423749153967;
                controlPtB = new ControlPoint (true, this.x + this.width * controlPtBPercentWidth, this.y + this.height * controlPtBPercentHeight, controlPtBPercentWidth, controlPtBPercentHeight);
                newSegmentsList.push(new Segment(this.points[2], this.points[3], controlPtA, controlPtB));


                controlPtAPercentWidth = 0.0;
                controlPtAPercentHeight = 0.2238576250846033;
                controlPtA = new ControlPoint (true, this.x + this.width * controlPtAPercentWidth, this.y + this.height * controlPtAPercentHeight, controlPtAPercentWidth, controlPtAPercentHeight);
                
                controlPtBPercentWidth = 0.2238576250846033;
                controlPtBPercentHeight = 0.0;
                controlPtB = new ControlPoint (true, this.x + this.width * controlPtBPercentWidth, this.y + this.height * controlPtBPercentHeight, controlPtBPercentWidth, controlPtBPercentHeight);
                newSegmentsList.push(new Segment(this.points[3], this.points[0], controlPtA, controlPtB));

                this.segments = newSegmentsList;
                this.type = 'shape';

                break;

            case 'triangle':
                this.points = [new Point(x, y, 0.5, 0.0), new Point(x, y, 1.0, 1.0), new Point(x, y, 0.0, 1.0)];
                this.segments = [new Segment(this.points[0], this.points[1], new ControlPoint(false), new ControlPoint(false)), new Segment(this.points[1], this.points[2], new ControlPoint(false), new ControlPoint(false)), new Segment(this.points[2], this.points[0], new ControlPoint(false), new ControlPoint(false))];
                this.type = 'shape';
                break;

            case 'polygon':
                this.points = [new Point(x, y, 0.5, 0.0), new Point(x, y, 1.0, 0.3628), new Point(x, y, 0.81, 1.0), new Point (x, y, 0.19, 1.0), new Point(x, y, 0.0, 0.3628)];
                this.segments = [new Segment(this.points[0], this.points[1], new ControlPoint(false), new ControlPoint(false)), new Segment(this.points[1], this.points[2], new ControlPoint(false), new ControlPoint(false)), new Segment(this.points[2], this.points[3], new ControlPoint(false), new ControlPoint(false)), new Segment(this.points[3], this.points[4], new ControlPoint(false), new ControlPoint(false)), new Segment(this.points[4], this.points[0], new ControlPoint(false), new ControlPoint(false))];
                this.type = 'shape';
                break;

            case 'line': {
                this.points = [new Point(x, y, 0.0, 0.0,), new Point(x, y, 1.0, 0.0)];
                this.segments = [new Segment(this.points[0], this.points[1], new ControlPoint(false), new ControlPoint(false))];
                this.type = 'line';
                break;
            }

            default:
                this.points = [];
                this.segments = [];
                this.type = 'none';
        }
    }

    create(mousedownX: number, mousedownY: number, mx: number, my: number) {
        if (mousedownX < mx) {
            this.resizeWidth(mx - mousedownX);
            if (this.type === 'line') {
                this.points[0].setX(mousedownX, 0.0);
                this.points[1].setX(mx, 1.0);
                this.inspectSelf();
            }
        } else if (mousedownX > mx) {
            this.setXAndWidth(mx, mousedownX - mx);
            if (this.type === 'line') {
                this.points[0].setX(mousedownX, 1.0);
                this.points[1].setX(mx, 0.0);
                this.inspectSelf();
            }
        } else {
            if (this.type === 'line') {
                this.points[0].setX(mousedownX, 0.0);
                this.points[1].setX(mx, 1.0);
                this.inspectSelf();
            }
        }

        if (mousedownY < my) {
            this.resizeHeight(my - mousedownY);
            if (this.type === 'line') {
                this.points[0].setY(mousedownY, 0.0);
                this.points[1].setY(my, 1.0);
                this.inspectSelf();
            }
        } else if (mousedownY > my) {
            this.setYAndHeight(my, mousedownY - my);
            if (this.type === 'line') {
                this.points[0].setY(mousedownY, 1.0);
                this.points[1].setY(my, 0.0);
                this.inspectSelf();
            }
        } else {
            if (this.type === 'line') {
                this.points[0].setY(mousedownY, 0.0);
                this.points[1].setY(mousedownY, 0.0);
                this.inspectSelf();
            }
        }

        let segment;
        for (let i = 0; i < this.segments.length ; i++) {
            segment = this.segments[i];
            if (segment.controlPtA.active) {
                segment.controlPtA.setXByWidth(mousedownX, Math.abs(mx - mousedownX));
                segment.controlPtB.setYByHeight(mousedownY, Math.abs(my - mousedownY));
            }

            if (segment.controlPtB.active) {
                segment.controlPtA.setXByWidth(mousedownX, Math.abs(mx - mousedownX));
                segment.controlPtB.setYByHeight(mousedownY, Math.abs(my - mousedownY));
            }
        }
    }

    draw() {
        const ctx = this.canvas.getContext('2d');
        let addPointSegment: any = false;

        ctx.save();
        ctx.translate(0.5, 0.5);
        ctx.miterLimit = 40.0;
        if (this.fillHex !== 'none') { ctx.fillStyle = this.fillHex };
        ctx.lineWidth = this.borderWidth === 0 || this.type === 'line' ? this.borderWidth : incrementBorderWidth(this.borderWidth);
        if (this.borderWidth !== 0) { ctx.strokeStyle = this.borderHex };
        ctx.beginPath();
        const segments = this.segments;
        ctx.moveTo(segments[0].pointA.x, segments[0].pointA.y);
        const numSegments = segments.length;
        let segment;
        for (let i = 0; i < numSegments; i++) { 
            segment = segments[i];
            if (segment.controlPtA.active && segment.controlPtB.active) {
                ctx.bezierCurveTo(this.x + (this.width * segment.controlPtA.percentWidth!), this.y + (this.height * segment.controlPtA.percentHeight!), this.x + (this.width * segment.controlPtB.percentWidth!), this.y + (this.height * segment.controlPtB.percentHeight!), segment.pointB.x, segment.pointB.y);
            } else if (segment.controlPtA.active) {
                ctx.bezierCurveTo(this.x + (this.width * segment.controlPtA.percentWidth!), this.y + (this.height * segment.controlPtA.percentHeight!), segment.pointB.x, segment.pointB.y, segment.pointB.x, segment.pointB.y)
            } else if (segment.controlPtB.active) {
                ctx.bezierCurveTo(segment.pointA.x, segment.pointA.y, this.x + (this.width * segment.controlPtB.percentWidth!), this.y + (this.height * segment.controlPtB.percentHeight!), segment.pointB.x, segment.pointB.y);
            } else {
                ctx.lineTo(segment.pointB.x, segment.pointB.y);
            }
            if (segment.addPointHover) {
                addPointSegment = segment;
            }
        }
        
        this.type === 'shape' && ctx.closePath();
        this.borderWidth > 0 && ctx.stroke();
        this.type === 'shape' && ctx.fill();
        this.type === 'line' && ctx.closePath();

        if (addPointSegment) {
            const x = addPointSegment.addPointXY.x;
            const y = addPointSegment.addPointXY.y;

            ctx.lineWidth = 3;
            ctx.strokeStyle = "#1565C0";
            ctx.beginPath();
            ctx.moveTo(addPointSegment.pointA.x, addPointSegment.pointA.y);
            if (addPointSegment.controlPtA.active && addPointSegment.controlPtB.active) {
                ctx.bezierCurveTo(this.x + (this.width * addPointSegment.controlPtA.percentWidth!), this.y + (this.height * addPointSegment.controlPtA.percentHeight!), this.x + (this.width * addPointSegment.controlPtB.percentWidth!), this.y + (this.height * addPointSegment.controlPtB.percentHeight!), addPointSegment.pointB.x, addPointSegment.pointB.y);
            } else if (addPointSegment.controlPtA.active) {
                ctx.bezierCurveTo(this.x + (this.width * addPointSegment.controlPtA.percentWidth!), this.y + (this.height * addPointSegment.controlPtA.percentHeight!), addPointSegment.pointB.x, addPointSegment.pointB.y, addPointSegment.pointB.x, addPointSegment.pointB.y)
            } else if (addPointSegment.controlPtB.active) {
                ctx.bezierCurveTo(addPointSegment.pointA.x, addPointSegment.pointA.y, this.x + (this.width * addPointSegment.controlPtB.percentWidth!), this.y + (this.height * addPointSegment.controlPtB.percentHeight!), addPointSegment.pointB.x, addPointSegment.pointB.y);
            } else {
                ctx.lineTo(addPointSegment.pointB.x, addPointSegment.pointB.y);
            }
            ctx.stroke();
            ctx.closePath();

            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#1565C0";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        ctx.restore();
    }

    inspectSelf() {
        const points = this.points;
        const numPoints = this.points.length;
        let point;

        const segments = this.segments;
        const numSegments = segments.length;
        let segment;
        let segmentMinMax;
        let controlPtAXY;
        let controlPtBXY;

        let top: any;
        let right: any;
        let bottom: any;
        let left: any;

        let newX;
        let newY;
        let newWidth;
        let newHeight;

        for (let i = 0; i < numPoints; i++) {
            point = points[i];
            if (i === 0) {
                top = point.y;
                right = point.x;
                bottom = point.y;
                left = point.x;
            } else {
                if (point.y < top) {
                    top = point.y;
                }
                if (point.x > right) {
                    right = point.x;
                }
                if (point.y > bottom) {
                    bottom = point.y;
                }
                if (point.x < left) {
                    left = point.x;
                }
            }
        }

        for (let i = 0; i < numSegments; i++) {
            segment = segments[i];
            if (segment.controlPtA.active || segment.controlPtB.active) {
                controlPtAXY = segment.controlPtA.active ? {x: segment.controlPtA.x!, y: segment.controlPtA.y!} : {x: segment.pointA.x, y: segment.pointA.y};
                controlPtBXY = segment.controlPtB.active ? {x: segment.controlPtB.x!, y: segment.controlPtB.y!} : {x: segment.pointB.x, y: segment.pointB.y};
                segmentMinMax = getBezierMinMax(segment.pointA.x, segment.pointA.y, controlPtAXY.x, controlPtAXY.y, controlPtBXY.x, controlPtBXY.y, segment.pointB.x, segment.pointB.y);
            
                if (segmentMinMax.min.y < top) {
                    top = segmentMinMax.min.y;
                }
                if (segmentMinMax.min.x < left) {
                    left = segmentMinMax.min.x;
                }
                if (segmentMinMax.max.y > bottom) {
                    bottom = segmentMinMax.max.y;
                }
                if (segmentMinMax.max.x > right) {
                    right = segmentMinMax.max.x;
                }
            }
        }

        newX = left;
        newY = top;
        newWidth = right - left;
        newHeight = bottom - top;

        let xDistance;
        let yDistance;

        for (let i = 0; i < numPoints; i++) {
            point = points[i];
            xDistance = point.x - newX;
            yDistance = point.y - newY;
            point.percentWidth = xDistance / newWidth;
            point.percentHeight = yDistance / newHeight;
        }

        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        this.height = newHeight;
    }

    handleAddPointHover(x: number, y: number, callback: any) {
        const segments = this.segments;
        const numSegments = segments.length;
        let segment;

        for (let i = 0; i < numSegments; i++) {
            segment = segments[i];
            segment.handleAddPointHover(x, y, this, callback);
        }
    }

    clearAddPointHover(callback: any) {
        const segments = this.segments;
        const numSegments = segments.length;
        let segment;

        for (let i = 0; i < numSegments; i++) {
            segment = segments[i];
            segment.clearAddPointHover(callback);
        }
    }

    addPoint(callback: any) {
        const segments = this.segments;
        const numSegments = segments.length;
        let segment;

        for (let i = 0; i < numSegments; i++) {
            segment = segments[i];
            if (segment.addPointHover) {
                const newPointXY = segment.addPointXY;
                const newPoint = new Point(newPointXY.x, newPointXY.y, (newPointXY.x - this.x) / this.width, (newPointXY.y - this.y) / this.height);
                const newSegmentA = new Segment(this.points[i], newPoint, new ControlPoint(false), new ControlPoint(false));
                const newSegmentB = new Segment(newPoint, i === numSegments - 1 && numSegments !== 1 ? this.points[0] : this.points[i + 1], new ControlPoint(false), new ControlPoint(false));
                const newPointsList = this.points;
                newPointsList.splice(i + 1, 0, newPoint);
                const newSegmentsList = segments;
                newSegmentsList.splice(i, 1, newSegmentA, newSegmentB);
                this.points = newPointsList;
                this.segments = newSegmentsList;
                callback();
            }
        }
    }

    deletePoint(pointIndex: number) {
        let newPointsList = this.points;
        let newSegmentsList = this.segments;

        if (pointIndex === 0) {
            newSegmentsList[this.segments.length - 1].pointB = newSegmentsList[pointIndex].pointB;
        } else {
            newSegmentsList[pointIndex - 1].pointB = newSegmentsList[pointIndex].pointB;
        }

        newPointsList.splice(pointIndex, 1);
        newSegmentsList.splice(pointIndex, 1);

        if (newSegmentsList.length === 2) {
            newSegmentsList = [newSegmentsList[0]];
        }
        
        if (newSegmentsList.length === 1) {
            this.isLine = true;
        }

        this.points = newPointsList;
        this.segments = newSegmentsList;

        this.inspectSelf();
    }

    setResizeDimensions(selectionX: number, selectionY: number) {
        this.resizeDimensions = {
            originalX: this.x,
            originalY: this.y,
            originalWidth: this.width,
            originalHeight: this.height,
            xDistance: this.x - selectionX,
            yDistance: this.y - selectionY
        }
    }

    setPoints(points: Point[]) {
        this.points = points;
    }

    setSegments(segments: Segment[]) {
        this.segments = segments;
    }

    setX(newX: number) {
        const xDif = newX - this.x;
        const numPoints = this.points.length;
        let point;
        
        const numSegments = this.segments.length;
        let segment;

        for (let i = 0; i < numPoints; i++) {
            point = this.points[i];
            point.x = point.x + xDif;
        }

        for (let i = 0; i < numSegments; i++) {
            segment = this.segments[i];
            if (segment.controlPtA.active) {
                segment.controlPtA.setXByWidth(newX, this.width);
            }
            if (segment.controlPtB.active) {
                segment.controlPtB.setXByWidth(newX, this.width);
            }
        }

        this.x = newX;
    }

    setY(newY: number) {
        const yDif = newY - this.y;
        const numPoints = this.points.length;
        let point;

        const numSegments = this.segments.length;
        let segment;

        for (let i = 0; i < numPoints; i++) {
            point = this.points[i];
            point.y = point.y + yDif;
        }

        for (let i = 0; i < numSegments; i++) {
            segment = this.segments[i];
            if (segment.controlPtA.active) {
                segment.controlPtA.setYByHeight(newY, this.width);
            }
            if (segment.controlPtB.active) {
                segment.controlPtB.setYByHeight(newY, this.width);
            }
        }

        this.y = newY;
    }

    resizeWidth(newWidth: number) {
        const numPoints = this.points.length;
        let point;

        const numSegments = this.segments.length;
        let segment;

        for (let i = 0; i < numPoints; i++) {
            point = this.points[i];
            point.x = this.x + (newWidth * point.percentWidth);
        }

        for (let i = 0; i < numSegments; i++) {
            segment = this.segments[i];
            if (segment.controlPtA.active) {
                segment.controlPtA.setXByWidth(this.x, newWidth);
            }
            if (segment.controlPtB.active) {
                segment.controlPtB.setXByWidth(this.x, newWidth);
            }
        }

        this.width = newWidth;
    }

    resizeHeight(newHeight: number) {
        const numPoints = this.points.length;
        let point;

        const numSegments = this.segments.length;
        let segment;

        for (let i = 0; i < numPoints; i++) {
            point = this.points[i];
            point.y = this.y + (newHeight * point.percentHeight);
        }

        for (let i = 0; i < numSegments; i++) {
            segment = this.segments[i];
            if (segment.controlPtA.active) {
                segment.controlPtA.setYByHeight(this.y, newHeight);
            }
            if (segment.controlPtB.active) {
                segment.controlPtB.setYByHeight(this.y, newHeight);
            }
        }
        
        this.height = newHeight;
    }

    setXAndWidth(newX: number, newWidth: number) {
        this.setX(newX);
        this.resizeWidth(newWidth);
    }

    setYAndHeight(newY: number, newHeight: number) {
        this.setY(newY);
        this.resizeHeight(newHeight);
    }
}