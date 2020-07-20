import DragSelection from './DragSelection';
import { convertToAspectRatio, incrementBorderWidth } from './utils';
import Shape from './Shape';

export default class Selection {
    selectionList: any;

    canvas: any;

    properties: any;

    mode: string;

    selectedPoint: any;

    selectorSquares: any;
    selectorBoxHover: any;

    editPointHover: any;
    editPointDragging: boolean;

    _resize: boolean;
    _dragging: boolean;

    draggingCoords: any;
    resizeDimensions: any;

    selectionCallback: any;
    deselectionCallback: any;

    dragSelection: any;

    constructor(canvas: any, selectionCallback: any, deselectionCallback: any, dragSelectionCallback: any) {
        this.selectionList = [];

        this.canvas = canvas;

        this.properties = {
            x: null,
            y: null,
            width: null,
            height: null,
            fillHex: null,
            fillRGB: null,
            borderHex: null,
            borderRGB: null,
            borderWidth: null
        }

        this.mode = "normal";

        this.selectedPoint = false;

        this.selectorSquares = {
            squareWidth: 6,
            squareHeight: 6,
            topLeft: null,
            top: null,
            topRight: null,
            right: null,
            bottomRight: null,
            bottom: null,
            bottomLeft: null,
            left: null,
        }

        this.selectorBoxHover = null;
        this.editPointHover = null;
        this.editPointDragging = false;

        this._resize = false;
        this._dragging = false;

        this.draggingCoords = {
            originalX: null,
            originalY: null,
            mdx: null,
            mdy: null
        }

        this.resizeDimensions = {
            originalX: null,
            originalY: null,
            originalWidth: null,
            originalHeight: null,
            selector: null
        }

        this.selectionCallback = selectionCallback;
        this.deselectionCallback = deselectionCallback;

        this.dragSelection = new DragSelection(this.canvas, dragSelectionCallback);
        
    }

    inspectItems() { // Loops over selected items and sets Selection properties based on the selected items collectively.
        const sel = this.selectionList;
        const numItems = sel.length;
        let item;

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

        let fillHex;
        let fillRGB;
        let borderHex;
        let borderRGB;
        let borderWidth;

        for (let i = 0; i < numItems; i++) {
            item = sel[i];

            prevX = totalX;
            prevY = totalY;
            prevWidth = totalWidth;
            prevHeight = totalHeight;

            itemX = item.x;
            itemY = item.y;
            itemWidth = item.width;
            itemHeight = item.height;

            if (i === 0) {
                totalX = itemX;
                totalY = itemY;
                totalWidth = itemWidth;
                totalHeight = itemHeight;

                fillHex = item.fillHex;
                fillRGB = item.fillRGB;
                borderHex = item.borderHex;
                borderRGB = item.borderRGB;
                borderWidth = item.borderWidth;

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

                if (item.fillHex !== fillHex) {
                    fillHex = null;
                }
                if (item.fillRGB !== fillRGB) {
                    fillHex = null;
                }
                if (item.borderHex !== borderHex) {
                    borderHex = null;
                }
                if (item.borderRGB !== borderRGB) {
                    borderRGB = null;
                }
                if (item.borderWidth !== borderWidth) {
                    borderWidth = null;
                }

            }
        }

        this.properties.x = totalX;
        this.properties.y = totalY;
        this.properties.height = totalHeight;
        this.properties.width = totalWidth;
        
        this.properties.fillHex = fillHex;
        this.properties.fillRGB = fillRGB;
        this.properties.borderHex = borderHex;
        this.properties.borderRGB = borderRGB;
        this.properties.borderWidth = borderWidth;

        this.setSelectorSquaresXY();
    }

    getCommonProperties() {  // Inspects all selected items and returns an object listing common properties among all selected items.
        let commonProperties: any = {};
        commonProperties.x = this.properties.x;
        commonProperties.y = this.properties.y;
        commonProperties.width = this.properties.width;
        commonProperties.height = this.properties.height;
        
        const numItems = this.selectionList.length;
        for (let i = 0; i < numItems; i++) {
            const shape = this.selectionList[i];   
            if (i === 0) {
                commonProperties.fillHex = shape.fillHex;
                commonProperties.fillRGB = shape.fillRGB;
                commonProperties.borderHex = shape.borderHex;
                commonProperties.borderRGB = shape.borderRGB;
                commonProperties.borderWidth = shape.borderWidth;
            } else {
                if (shape.fillHex !== commonProperties.fillHex) {
                    commonProperties.fillHex = null;
                }
                if (shape.fillRGB !== commonProperties.fillRGB) {
                    commonProperties.fillRGB = null;
                }
                if (shape.borderHex !== commonProperties.borderHex) {
                    commonProperties.borderHex = null;
                }
                if (shape.borderRGB !== commonProperties.borderRGB) {
                    commonProperties.borderRGB = null;
                }
                if (shape.borderWidth !== commonProperties.borderWidth) {
                    commonProperties.borderWidth = null;
                }
            }
        }
        return commonProperties;
    }

    setSelectorSquaresXY() { // Determines and stores the coordinates for selector squares around the selected items. Used to determine whethere a user is hovering over a selector square.
        const properties = this.properties;
        
        this.selectorSquares.topLeft = {x: properties.x - 3, y: properties.y - 3};
        this.selectorSquares.bottomLeft = {x: properties.x - 3, y: properties.y + properties.height - 3};
        this.selectorSquares.topRight = {x: properties.x + properties.width - 3, y: properties.y - 3};
        this.selectorSquares.bottomRight = {x: properties.x + properties.width - 3, y: properties.y + properties.height - 3};

        if (properties.width > 18) {
            this.selectorSquares.top = {x: properties.x + (properties.width / 2) - 3, y: properties.y - 3};
            this.selectorSquares.bottom = {x: properties.x + (properties.width / 2) - 3, y: properties.y + properties.height - 3};
        } else {
            this.selectorSquares.top = {x: null, y: null, width: null, height: null};
            this.selectorSquares.bottom = {x: null, y: null, width: null, height: null};
        }

        if (properties.height > 18) {
            this.selectorSquares.left = {x: properties.x - 3, y: properties.y + (properties.height / 2) - 3};
            this.selectorSquares.right = {x: properties.x + properties.width - 3, y: properties.y + (properties.height / 2) - 3};
        } else {
            this.selectorSquares.left = {x: null, y: null, width: null, height: null};
            this.selectorSquares.right = {x: null, y: null, width: null, height: null};
        }
    }

    setSelectorBoxHover(mx: number, my: number) { // Uses selector squares XY to determine whether a user is hovering over a selector square and stores which square if any.
        const shapeWidth = this.properties.width;
        const shapeHeight = this.properties.height;

        const canvas = this.canvas;

        const { topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left, squareWidth, squareHeight } = this.selectorSquares;

        if (mx > topLeft.x && mx < topLeft.x + squareWidth && my > topLeft.y && my < topLeft.y + squareHeight) {
            canvas.style.cursor = "nwse-resize";
            this.selectorBoxHover = "top-left";
        } else if (mx > bottomLeft.x && mx < bottomLeft.x + squareWidth && my > bottomLeft.y && my < bottomLeft.y + squareHeight) {
            canvas.style.cursor = "nesw-resize";
            this.selectorBoxHover = "bottom-left";
        } else if (mx > topRight.x && mx < topRight.x + squareWidth && my > topRight.y && my < topRight.y + squareHeight) {
            canvas.style.cursor = "nesw-resize";
            this.selectorBoxHover = "top-right";
        } else if (mx > bottomRight.x && mx < bottomRight.x + squareWidth && my > bottomRight.y && my < bottomRight.y + squareHeight) {
            canvas.style.cursor = "nwse-resize";
            this.selectorBoxHover = "bottom-right";
        } else {
            canvas.style.cursor = "default";
            this.selectorBoxHover = false;
        }

        if (shapeWidth > 18) { // Only check for top and bottom hover if the width is greater than 18px
            if (mx > top.x && mx < top.x + squareWidth && my > top.y && my < top.y + squareHeight) {
                this.canvas.style.cursor = "ns-resize";
                this.selectorBoxHover = "top";
            } else if (mx > bottom.x && mx < bottom.x + squareWidth && my > bottom.y && my < bottom.y + squareHeight) {
                this.canvas.style.cursor = "ns-resize";
                this.selectorBoxHover = "bottom";
            }
        }

        if (shapeHeight > 18) { // Only check for left and right hover if the height is greater than 18px
            if (mx > left.x && mx < left.x + squareWidth && my > left.y && my < left.y + squareHeight) {
                this.canvas.style.cursor = "ew-resize";
                this.selectorBoxHover = "left";
            } else if (mx > right.x && mx < right.x + squareWidth && my > right.y && my < right.y + squareHeight) {
                this.canvas.style.cursor = "ew-resize";
                this.selectorBoxHover = "right";
            }
        }
    }

    setEditPointHover(mx: number, my: number) {
        const editPointHover = this.isOnEditPoint(Math.floor(mx), Math.floor(my));
        if (editPointHover !== null) {
            this.editPointHover = editPointHover;
        } else {
            this.editPointHover = null;
        }
        
    }

    setEditPointCoords(x: number, y: number) {
        const shape = this.selectionList[0];
        const selectedPoint = shape.points[this.selectedPoint];
        let controlPtsXYSnapshot = [];
        const xDif = x - selectedPoint.x;
        const yDif = y - selectedPoint.y;

        const segment1 = this.selectedPoint === 0 && shape.type === 'shape' ? shape.segments[shape.segments.length - 1] : shape.type === 'line' ? false : shape.segments[this.selectedPoint - 1];
        const segment2 = this.selectedPoint === shape.points.length - 1 && shape.type === 'shape' ? shape.segments[this.selectedPoint] : shape.type === 'line' ? false : shape.segments[this.selectedPoint];
        
        let segment1Index = shape.segments.indexOf(segment1);
        let segment2Index = shape.segments.indexOf(segment2);

        const segments = shape.segments;
        const numSegments = segments.length;
        let segment;
        let segmentControlPtAXY;
        let segmentControlPtBXY;

        for (let i = 0; i < numSegments; i++) {
            segment = segments[i];
            segmentControlPtAXY = segment.controlPtA.active ? {x: shape.x + (shape.width * segment.controlPtA.percentWidth), y: shape.y + (shape.height * segment.controlPtA.percentHeight)} : false;
            segmentControlPtBXY = segment.controlPtB.active ? {x: shape.x + (shape.width * segment.controlPtB.percentWidth), y: shape.y + (shape.height * segment.controlPtB.percentHeight)} : false;
            controlPtsXYSnapshot.push([segmentControlPtAXY, segmentControlPtBXY]);
        }

        shape.points[this.selectedPoint].setXY(x, y);
        
        if (segment1 !== false) {
            segment1.controlPtB.setPercentWidthByX(shape.x, segment1.controlPtB.x + xDif, shape.width);
            segment1.controlPtB.setPercentHeightByY(shape.y, segment1.controlPtB.y + yDif, shape.height);
        }

        if (segment2 !== false) {
            segment2.controlPtA.setPercentWidthByX(shape.x, segment2.controlPtA.x + xDif, shape.width);
            segment2.controlPtA.setPercentHeightByY(shape.y, segment2.controlPtA.y + yDif, shape.height);
        }

        shape.inspectSelf();
        
        let controlPts: any;

        for (let i = 0; i < controlPtsXYSnapshot.length; i++) {
            segment = shape.segments[i];
            controlPts = controlPtsXYSnapshot[i];
            if (i !== segment2Index && controlPts[0] !== false) {
                shape.segments[i].controlPtA.setPercentWidthByX(shape.x, controlPts[0].x!, shape.width);
                shape.segments[i].controlPtA.setPercentHeightByY(shape.y, controlPts[0].y!, shape.height);
            }
            if (i !== segment1Index && controlPts[1] !== false) {
                shape.segments[i].controlPtB.setPercentWidthByX(shape.x, controlPts[1].x, shape.width);
                shape.segments[i].controlPtB.setPercentHeightByY(shape.y, controlPts[1].y, shape.height);
            }
        }
    }

    isOnEditPoint(x: number, y: number) {
        const points = this.selectionList[0].points;
        const numPoints = points.length;
        const width = 6;
        const height = 6;
        let refX;
        let refY;
        let point;
        let editPointHover = null;

        for (let i = 0; i < numPoints; i++) {
            point = points[i];
            refX = point.x - 3;
            refY = point.y - 3;
            if (x >= refX && x <= refX + width && y >= refY && y <= refY + height) {
                editPointHover = i;
                break;
            }
        }
        return editPointHover;
    }

    setSelectedPoint(newPoint: number) {
        this.selectedPoint = newPoint;
    }

    deleteSelectedPoint() {
        if (this.mode === 'point-edit' && this.selectedPoint !== false) {
            this.selectionList[0].deletePoint(this.selectedPoint);
            this.selectedPoint = false;
            this.inspectItems();
        }
    }

    drawSelection() { // Inspects items, draws an outline around the selection, and draws the selector squares.
        this.inspectItems();
        if (this.mode === "normal") {
            this.drawSelectorOutlines();
            this.drawSelectorSquares();
        } else if (this.mode === "point-edit") {
            this.drawPoints();
        }
    }

    drawOutline() {
        const ctx = this.canvas.getContext('2d');
        ctx.save();
        ctx.translate(0.5, 0.5);
        ctx.strokeStyle = "#C2C2C2";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.properties.x, this.properties.y, this.properties.width, this.properties.height);
        ctx.restore();
    }

    drawSelectorOutlines() { // Draws outline around selected items.
        const ctx = this.canvas.getContext('2d');
        ctx.save(); // Save the original (blank) context.
        ctx.translate(0.5, 0.5);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#E0E0E0";
        if (this.selectionList.length > 1) {
            const numItems = this.selectionList.length;
            let item;
            for (let i = 0; i < numItems; i++ ) {
                item = this.selectionList[i];
                ctx.strokeRect(item.x - 1, item.y - 1, item.width + 2, item.height + 2);
            }
        }

        ctx.restore(); // Restore to the original (blank) context when we're done drawing.
    }

    drawSelectorSquares() { // Draws selector squares around the selected items.
        const ctx = this.canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = "white";
        ctx.shadowColor = "rgb(0, 0, 0, 0.7)";
        ctx.shadowBlur = 0.6;

        ctx.fillRect(this.properties.x - 3, this.properties.y - 3, 6, 6); // Top Left
        ctx.fillRect(this.properties.x + this.properties.width - 3, this.properties.y - 3, 6, 6); // Top Right
        ctx.fillRect(this.properties.x + this.properties.width - 3, this.properties.y + this.properties.height - 3, 6, 6); // Bottom Right
        ctx.fillRect(this.properties.x - 3, this.properties.y + this.properties.height - 3, 6, 6); // Bottom Left

        if (this.properties.width >= 18) {
            ctx.fillRect((this.properties.x + (this.properties.width / 2)) - 3, this.properties.y - 3, 6, 6); // Top
            ctx.fillRect((this.properties.x + (this.properties.width / 2)) - 3, (this.properties.y + this.properties.height) - 3, 6, 6); // Bottom
        }

        if (this.properties.height >= 18) {
            ctx.fillRect(this.properties.x - 3, (this.properties.y + (this.properties.height / 2)) - 3, 6, 6); // Left
            ctx.fillRect((this.properties.x + this.properties.width) - 3, (this.properties.y + (this.properties.height / 2)) - 3, 6, 6); // Right
        }

        ctx.restore();
    }

    drawPoints() {
        const ctx = this.canvas.getContext('2d');
        ctx.save();
        const points = this.selectionList[0].points;
        const numPoints = points.length;
        let point;
        let x;
        let y;

        const selectedShape = this.selectionList[0]

        for (let i = 0; i < numPoints; i++) {
            point = points[i];
            x = point.x;
            y = point.y;

            if (this.selectedPoint === i) {
                const prevSegment = i === 0 && selectedShape.type === 'shape' ? selectedShape.segments[selectedShape.segments.length - 1] : selectedShape.type === 'line' && i === 0 ? false : selectedShape.segments[i - 1];
                const nextSegment = i === numPoints - 1 && selectedShape.type === 'line' ? false : selectedShape.segments[i];

                let controlPt1;
                let controlPt2;

                if (prevSegment && prevSegment.controlPtB.active) {
                    controlPt1 = prevSegment.controlPtB;

                    ctx.save();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#9E9E9E';
                    ctx.beginPath();
                    ctx.moveTo(controlPt1.x, controlPt1.y);
                    ctx.lineTo(point.x, point.y);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.fillStyle = '#FFFFFF';
                    ctx.strokeStyle = "#212121";
                    ctx.fillRect(controlPt1.x - 3, controlPt1.y - 3, 6, 6);
                    ctx.strokeRect(controlPt1.x - 3, controlPt1.y - 3, 6, 6);
                    ctx.restore();
                }

                if (nextSegment && nextSegment.controlPtA.active) {
                    controlPt2 = nextSegment.controlPtA;

                    ctx.save();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#9E9E9E';
                    ctx.beginPath();
                    ctx.moveTo(controlPt2.x, controlPt2.y);
                    ctx.lineTo(point.x, point.y);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.fillStyle = '#FFFFFF';
                    ctx.strokeStyle = "#212121";
                    ctx.fillRect(controlPt2.x - 3, controlPt2.y - 3, 6, 6);
                    ctx.strokeRect(controlPt2.x - 3, controlPt2.y - 3, 6, 6);
                    ctx.restore();
                }
            }

            ctx.beginPath();
            ctx.fillStyle = "white";

            if (this.selectedPoint === i) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#424242";
            } else {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#757575";
            }

            ctx.arc(x, y, 4, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
            
        }
        ctx.restore();
    }

    clearProperties() {
        this.properties.x = null;
        this.properties.y = null;
        this.properties.width = null;
        this.properties.height = null;
        this.properties.fillHex = null;
        this.properties.fillRGB = null;
        this.properties.borderHex = null;
        this.properties.borderRGB = null;
        this.properties.borderWidth = null;
    }

    enablePointEditMode() {
        if (this.mode !== "point-edit") {
            this.mode = "point-edit";
            this.selectedPoint = 0;
        }
    }

    enableNormalMode() {
        if (this.mode !== "normal") {
            this.mode = "normal";
            this.selectedPoint = false;
        }
    }

    getMode() {
        return this.mode;
    }

    selectSingleItem(item: any) { // Clears any previous slected items and only selects the passed in item.
        this.selectionList = [item];
        this.inspectItems();
        this.selectionCallback(this.getCommonProperties());
    }

    addItemToSelection(item: any, itemList: any) { // Adds the selected item to the pre-existing list of selected items.
        this.selectionList.push(item);
        this.selectionList = this.selectionList.sort((a: any, b: any) => {
            return itemList.indexOf(a) - itemList.indexOf(b);
        });
        this.inspectItems();
        this.selectionCallback(this.getCommonProperties());
    }

    setSelection(selection: any) { // Sets the selection list to the passed in array of items.
        this.selectionList = selection;
        this.inspectItems();
        this.selectionCallback(this.getCommonProperties());
    }

    deselectItem(itemToDeselect: any) { // Finds and removes the passed in item from the list of selected items.
        let newSelectionList = this.selectionList.filter((item: any) => {
            return item !== itemToDeselect;
        })
        this.selectionList = newSelectionList;
        this.deselectionCallback();
    }

    deselectAll() { // Clears the list of selected items.
        this.selectionList = [];
        this.clearProperties();
        this.deselectionCallback();
    }

    dragTo(x: number, y: number) { // Uses the dragging coordinates to calculate the xDif and yDif and adds the difs to each selected items' x and y.
        const xDif = x - this.draggingCoords.mdx;
        const yDif = y - this.draggingCoords.mdy;
        const sel = this.selectionList;
        const numItems = sel.length;

        for (let i = 0; i < numItems; i++) {
            sel[i].setX(this.draggingCoords.originalCoords[i].x + xDif);
            sel[i].setY(this.draggingCoords.originalCoords[i].y + yDif);
        }
        this.inspectItems();
        this.selectionCallback(this.getCommonProperties());
    }

    moveTo(x: number, y: number) { // Calculates the xDif and yDif based on current x and y (not the dragging coords) and adds the difs to each selected items' x and y.
        const xDif = x - this.properties.x;
        const yDif = y - this.properties.y;
        const sel = this.selectionList;
        const numItems = sel.length;

        let item;

        for (let i = 0; i < numItems; i++) {
            item = sel[i];

            sel[i].setX(item.x + xDif);
            sel[i].setY(item.y + yDif);
        }
        this.inspectItems();
    }

    setDimensions(width: number, height: number) { // Calculates the percent difference between new and current width and height and calls methods to resize.
        const widthPercentDif = width / this.properties.width;
        const heightPercentDif = height / this.properties.height;
        this.resizeSelectionListXAndWidth(this.properties.x, widthPercentDif);
        this.resizeSelectionListYAndHeight(this.properties.y, heightPercentDif);
        this.selectionCallback(this.getCommonProperties());
    }

    setWidth(width: number) { // Sets new width of selection without changing item xPos values. Uses widthPercentDif and resizeDimensions.xDistance to keep selected items proportional.
        const widthPercentDif = width / this.properties.width;
        const sel = this.selectionList;
        const numItems = sel.length;
        let item;

        for (let i = 0; i < numItems; i++) {
            item = sel[i];
            item.setResizeDimensions(this.properties.x, this.properties.y);
            item.setX(this.properties.x + (item.resizeDimensions.xDistance * widthPercentDif));
            item.resizeWidth(item.width * widthPercentDif);
        }
    }

    setHeight(height: number) { // Sets new height of selection without changing item yPos values. Uses heightPercentDif and resizeDimensions.yDistance to keep selected items proportional.
        const heightPercentDif = height / this.properties.height;
        const sel = this.selectionList;
        const numItems = sel.length;
        let item;

        for (let i = 0; i < numItems; i++) {
            item = sel[i];
            item.setResizeDimensions(this.properties.x, this.properties.y);
            item.setY(this.properties.y + (item.resizeDimensions.yDistance * heightPercentDif));
            item.resizeHeight(item.height * heightPercentDif);
        }
    }

    setFill(fill: string) { // Sets same fill to all selected items
        const sel = this.selectionList;
        const numItems = sel.length;
        let item;

        for (let i = 0; i < numItems; i++) {
            item = sel[i];
            item.fillHex = fill;
        }
        this.selectionCallback(this.getCommonProperties());
    }

    setBorderHex(hex: string) { // Sets same border hex to all selected items
        const sel = this.selectionList;
        const numItems = sel.length;
        let item;

        for (let i = 0; i < numItems; i ++) {
            item = sel[i];
            item.borderHex = hex;
        }
        this.selectionCallback(this.getCommonProperties());
    }

    setBorderWidth(width: number) { // Sets same border width to all selected items
        const sel = this.selectionList;
        const numItems = sel.length;
        let item;

        for (let i = 0; i < numItems; i++) {
            item = sel[i];
            item.borderWidth = width;
        }
        this.selectionCallback(this.getCommonProperties());
    }

    setResize() { // Called by Canvas when a selector box is clicked.
        this._resize = true;
        this.setResizeDimensions();
    }

    setResizeDimensions() { // Records the selection dimensions as a whole, as well as each selected item individually's dimensions before resizing begins. Referenced in the resizing process.
        this.resizeDimensions = {
            originalX: this.properties.x,
            originalY: this.properties.y,
            originalWidth: this.properties.width,
            originalHeight: this.properties.height,
            selector: this.selectorBoxHover
        }

        const numItems = this.selectionList.length;
        for (let i = 0; i < numItems; i++) {
            this.selectionList[i].setResizeDimensions(this.properties.x, this.properties.y); // Each selected item has its own resize dimensions.
        }
    }

    resize(mx: number, my: number, restricted: boolean) { // Handles the resizing of selected items based on the originally logged resize dimensions, the selector box being dragged, and the current mouse XY coordinates.
        const { originalX, originalY, originalWidth, originalHeight, selector } = this.resizeDimensions;

        let aspectRatio = {
            width: originalWidth / originalHeight,
            height: (originalHeight / originalWidth) * (originalWidth / originalHeight)
        }

        let refX: any;
        let refY: any;
        
        let xDif: any;
        let yDif: any;

        let newX: any;
        let newY: any;
        let newWidth: any;
        let newHeight: any;

        let widthPercentDif: any;
        let heightPercentDif: any;

        const originalXLessThanMx = originalX < mx;
        const originalYLessThanMy = originalY < my;
        const originalXGreaterThanMx = originalX > mx;
        const originalYGreaterThanMy = originalY > my;

        if (selector === 'top-left' || selector === 'bottom-left' || selector === 'left') {
            if (originalXLessThanMx) {
                xDif = mx - originalX;
            } else {
                xDif = originalX - mx;
            }

            if (originalXLessThanMx) {
                if (originalWidth - xDif > 0) {
                    newWidth = Math.floor(originalWidth - xDif);
                } else {
                    newWidth = Math.floor(mx - originalWidth - originalX);
                }
            } else if (originalXGreaterThanMx) {
                newWidth = Math.floor(originalWidth + xDif);
            } else {
                newWidth = Math.floor(originalWidth);
            }

        } else if (selector === 'top-right' || selector === 'bottom-right' || selector === 'right') {
            refX = originalX + originalWidth;

            if (refX < mx) {
                xDif = mx - refX;
            } else {
                xDif = refX - mx;
            }


            if (refX < mx) {
                newWidth = Math.floor(originalWidth + xDif);
            } else if (refX > mx) { 
                if (originalWidth - xDif > 0) {
                    newWidth = Math.floor(originalWidth - xDif);
                } else {
                    newWidth = Math.floor(originalX - mx);
                }
            } else {
                newWidth = Math.floor(originalWidth);
            }
        }

        if (selector === 'top-right' || selector === 'top-left' || selector === 'top') {
            if (originalYLessThanMy) {
                yDif = my - originalY;
            } else {
                yDif = originalY - my;
            }

            if (originalYLessThanMy) {
                if (originalHeight - yDif > 0) {
                    newHeight = Math.floor(originalHeight - yDif);
                } else {
                    newHeight = Math.floor(my - originalHeight - originalY);
                }
            } else if (originalYGreaterThanMy) {
                newHeight = Math.floor(originalHeight + yDif);
            } else {
                newHeight = Math.floor(originalHeight);
            }

        } else if (selector === 'bottom-right' || selector === 'bottom-left' || selector === 'bottom') {
            refY = originalY + originalHeight;

            if (refY < my) {
                yDif = my - refY;
            } else {
                yDif = refY - my;
            }

            if (refY < my) {
                newHeight = Math.floor(originalHeight + yDif);
            } else if (refY > my) {
                if (originalHeight - yDif > 0) {
                    newHeight = Math.floor(originalHeight - yDif);
                } else {
                    newHeight = Math.floor(originalY - my);
                }
            } else {
                newHeight = Math.floor(originalHeight);
            }
        }

        if (selector === 'top-left' || selector === 'top-right' || selector === 'bottom-right' || selector === 'bottom-left') {
            if (restricted) {
                const ratioConversion = convertToAspectRatio(aspectRatio.width, aspectRatio.height, newWidth, newHeight);
                newWidth = ratioConversion.a;
                newHeight = ratioConversion.b;
            }

            widthPercentDif = newWidth / originalWidth;
            heightPercentDif = newHeight / originalHeight;
        } else if (selector === 'top' || selector === 'bottom') {
            if (restricted) {
                newWidth = (aspectRatio.width * newHeight) / aspectRatio.height;
                widthPercentDif = newWidth / originalWidth;
            }
            heightPercentDif = newHeight / originalHeight;
        } else if (selector === 'left' || selector === 'right') {
            if (restricted) {
                newHeight = (aspectRatio.height * newWidth) / aspectRatio.width;
                heightPercentDif = newHeight / originalHeight;
            }
            widthPercentDif = newWidth / originalWidth;
        }

        if (selector === 'top-left' || selector === 'bottom-left' || selector === 'left') {
            if (originalXLessThanMx) {
                if (originalWidth - xDif > 0) {
                    if (restricted) {
                        newX = Math.floor(originalX + originalWidth - newWidth);
                        if (selector === 'left') {
                            newY = Math.floor(originalY + (Math.abs(originalHeight - newHeight) / 2));
                        }
                    } else {
                        newX = Math.floor(mx);
                    }
                } else {
                    if (restricted && selector === 'left') {
                        if (newWidth < originalWidth) {
                            newY = Math.floor(originalY + (Math.abs(originalHeight - newHeight) / 2));
                        } else if (newHeight > originalHeight) {
                            newY = Math.floor(originalY - (Math.abs(originalHeight - newHeight) / 2));
                        }
                    }
                    newX = Math.floor(originalX + originalWidth);
                }
            } else if (originalXGreaterThanMx) {
                if (restricted) {
                    if (selector === 'left') {
                        if (newWidth < originalWidth) {
                            newY = Math.floor(originalY + (Math.abs(originalHeight - newHeight) / 2));
                        } else if (newWidth > originalWidth) {
                            newY = Math.floor(originalY - (Math.abs(originalHeight - newHeight) / 2));
                        }
                    }
                    newX = Math.floor(originalX + originalWidth - newWidth);
                } else {
                    newX = Math.floor(mx);
                }
            } else {
                newX = Math.floor(originalX);
                if (selector === 'left' && restricted) {
                    newY = Math.floor(originalY);
                }
            }
        } else if (selector === 'top-right' || selector === 'bottom-right' || selector === 'right') {
            if (refX < mx) {
                if (selector === 'right' && restricted) {
                    if (newWidth < originalWidth) {
                        newY = Math.floor(originalY + (Math.abs(originalHeight - newHeight) / 2));
                    } else if (newWidth > originalWidth) {
                        newY = Math.floor(originalY - (Math.abs(originalHeight - newHeight) / 2));
                    }
                }
                newX = Math.floor(originalX);
            } else if (refX > mx) {
                if (originalWidth - xDif > 0) {
                    if (selector === 'right' && restricted) {
                        newY = Math.floor(originalY + (Math.abs(originalHeight - newHeight) / 2));
                    }
                    newX = Math.floor(originalX);
                } else {
                    if (restricted) {
                        if (selector === 'right') {
                            if (newWidth < originalWidth) {
                                newY = Math.floor(originalY + (Math.abs(originalHeight - newHeight) / 2));
                            } else if (newHeight > originalHeight) {
                                newY = Math.floor(originalY - (Math.abs(originalHeight - newHeight) / 2));
                            }
                            newX = Math.floor(mx);
                        }
                        newX = Math.floor(originalX - newWidth);
                    } else {
                        newX = Math.floor(mx);
                    }
                }
            } else {
                newX = Math.floor(originalX);
                if (selector === 'right' && restricted) {
                    newY = Math.floor(originalY);
                }
            }
        }

        if (selector === 'top-right' || selector === 'top-left' || selector === 'top') {
            if (originalYLessThanMy) {
                if (originalHeight - yDif > 0) {
                    if (restricted) {
                        if (selector === 'top') {
                            newX = Math.floor(originalX + (Math.abs(originalWidth - newWidth) / 2));
                        }
                        newY = Math.floor(originalHeight + originalY - newHeight);
                    } else {
                        newY = Math.floor(my);
                    }
                } else {
                    if (selector === 'top' && restricted) {
                        if (newHeight < originalHeight) {
                            newX = Math.floor(originalX + (Math.abs(originalWidth - newWidth) / 2));
                        } else if (newHeight > originalHeight) {
                            newX = Math.floor(originalX - (Math.abs(originalWidth - newWidth) / 2));
                        }
                    }
                    newY = Math.floor(originalY + originalHeight);
                }
            } else if (originalYGreaterThanMy) {
                if (restricted) {
                    if (selector === 'top') {
                        newX = Math.floor(originalX - (Math.abs(originalWidth - newWidth) / 2));
                    }
                    newY = Math.floor(originalHeight + originalY - newHeight);
                } else {
                    newY = Math.floor(my);
                }
            } else {
                newY = Math.floor(originalY);
                if (selector === 'top' && restricted) {
                    newX = Math.floor(originalX);
                }
            }

        } else if (selector === 'bottom-right' || selector === 'bottom-left' || selector === 'bottom') {
            if (refY < my) {
                if (selector === 'bottom' && restricted) {
                    newX = Math.floor(originalX - (Math.abs(originalWidth - newWidth) / 2));
                    newY = Math.floor(originalY);
                }
                newY = Math.floor(originalY);
            } else if (refY > my) {
                if (originalHeight - yDif > 0) {
                    if (selector === 'bottom' && restricted) {
                        newX = Math.floor(originalX + (Math.abs(originalWidth - newWidth) / 2));
                    }
                    newY = Math.floor(originalY);
                } else {
                    if (restricted) {
                        if (selector === 'bottom') {
                            if (newHeight < originalHeight) {
                                newX = Math.floor(originalX + (Math.abs(originalWidth - newWidth) / 2));
                            } else if (newHeight > originalHeight) {
                                newX = Math.floor(originalX - (Math.abs(originalWidth - newWidth) / 2));
                            }
                        }
                        newY = Math.floor(originalY - newHeight);

                    } else {
                        newY = Math.floor(my);
                    }
                }
            } else {
                newY = Math.floor(originalY);
                if (selector === 'bottom' && restricted) {
                    newX = Math.floor(originalX);
                }
            }
        }

        if (selector === 'top-left' || selector === 'top-right' || selector === 'bottom-right' || selector === 'bottom-left') {
            this.resizeSelectionListXAndWidth(newX, widthPercentDif);
            this.resizeSelectionListYAndHeight(newY, heightPercentDif);
        } else if (selector === 'top' || selector === 'bottom') {
            if (restricted) {
                this.resizeSelectionListXAndWidth(newX, widthPercentDif);
            }
            this.resizeSelectionListYAndHeight(newY, heightPercentDif);
        } else if (selector === 'left' || selector === 'right') {
            if (restricted) {
                this.resizeSelectionListYAndHeight(newY, heightPercentDif);
            }
            this.resizeSelectionListXAndWidth(newX, widthPercentDif);
        }

        this.selectionCallback(this.getCommonProperties());
    }

    resizeSelectionListXAndWidth(newSelectionX: number, widthPercentDif: number) { // Sets the x coordinate of each selected item by combining the new X of the selection with the distance from x of the item, multiplied by the widthPercentDif. Sets the new width by multiplying the items original width by the widthPercentDif.
        const numItems = this.selectionList.length;
        let newWidth;
        let newXDistance;
        let newX;
        for (let i = 0; i < numItems; i++) {
            newXDistance = this.selectionList[i].resizeDimensions.xDistance * widthPercentDif;
            newX = Math.floor(newSelectionX + newXDistance);
            newWidth = Math.floor(this.selectionList[i].resizeDimensions.originalWidth * widthPercentDif);
            this.selectionList[i].setXAndWidth(newX, newWidth);
        }
    }

    resizeSelectionListYAndHeight(newSelectionY: number, heightPercentDif: number) { // Sets the y coordinate of each selected item by combining the new Y of the selection with the distance from y of the item, multiplied by the heightPercentDif. Sets the new width by multiplying the items original width by the heightPercentDif.
        const numItems = this.selectionList.length;
        let newHeight;
        let newYDistance;
        let newY;
        for (let i = 0; i < numItems; i++) {
            newYDistance = this.selectionList[i].resizeDimensions.yDistance * heightPercentDif;
            newY = Math.floor(newSelectionY + newYDistance);
            newHeight = Math.floor(this.selectionList[i].resizeDimensions.originalHeight * heightPercentDif);
            this.selectionList[i].setYAndHeight(newY, newHeight);
        }
    }

    setDraggingCoords(mdx: number, mdy: number) { // Sets the dragging coordinates of each selected item. Used when dragging the selection.
        let originalCoordsArr = [];
        for (let i = 0; i < this.selectionList.length; i++) {
            originalCoordsArr.push({
                x: this.selectionList[i].x,
                y: this.selectionList[i].y
            })
        }

        this.draggingCoords.originalCoords = originalCoordsArr;
        this.draggingCoords.mdx = mdx;
        this.draggingCoords.mdy = mdy;
    }

    clearDraggingCoords() { // Resets the dragging coordinates object to all null values.
        this.draggingCoords = {
            originalX: null,
            originalY: null,
            mdx: null,
            mdy: null
        }
    }

    moveUpZ(itemList: any) {
        let newItemList = itemList;
        const sel = this.selectionList;
        const numItems = sel.length;
        let item;

        for (let i = numItems - 1; i >= 0; i--) {
            item = sel[i];
            const index = itemList.indexOf(item);
            if (index < itemList.length - 1 && sel.indexOf(itemList[index + 1]) === -1) {
                const partA = newItemList.slice(0, index);
                const partB = newItemList.slice(index + 2, itemList.length);
                newItemList = [...partA, newItemList[index + 1], newItemList[index], ...partB];
            }
        }
        return newItemList;
    }

    moveDownZ(itemList: any) {
        let newItemList = itemList;
        const sel = this.selectionList;
        const numItems = sel.length;
        let item;

        for (let i = numItems - 1; i >= 0; i--) {
            item = sel[i];
            const index = itemList.indexOf(item);
            if (index > 0  && sel.indexOf(itemList[index - 1]) === -1) {
                const partA = newItemList.slice(0, index - 1);
                const partB = newItemList.slice(index + 1, itemList.length);
                newItemList = [...partA, newItemList[index], newItemList[index - 1], ...partB];
            }
        }
        return newItemList;
    }

    hasItems() { // Returns true or false based on the selectionList.length
        return this.selectionList.length > 0;
    }

    includes(item: any) { // Inspects the selectionList array for the passed in item. Returns true or false.
        const index = this.selectionList.indexOf(item);
        if (index >= 0) {
            return true;
        }
        return false;
    }
}