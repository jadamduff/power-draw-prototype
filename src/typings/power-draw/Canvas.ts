import GlobalSetup from './GlobalSetup';
import Selection from './Selection';
import Clipboard from './Clipboard';
import Group from './Group';
import RightClick from './RightClick';
import Keypress from './Keypress';
import Shortcuts from './Shortcuts';
import Shape from './Shape';
import { fixDpi, sanitizeHex, isAllNums, getMouseXY, noSpecialOrSpaces } from './utils';

export default class Canvas {

    // Canvas properties
    targetId: string;
    canvasId: string;
    canvas: any;
    width: number;
    height: number;
    element: any;
    context: any;
    boundings: any;

    // Global state
    valid: boolean;
    currentTool: string;
    itemList: any;
    draggingOffset: any;
    creating: boolean;
    mousedownXY: any;
    cursor: any;

    selection: any;
    dragSelectionCallback: any;

    globalSetup: any;

    keypress: any;
    shortcuts: any;
    clipboard: any;

    rightClick: any;

    // Event handler stores
    shapeSelectedMoveEventListener: any;

    // Callbacks
    deselectCallback: any;

    constructor(targetId: string, canvasId: string, selectionCallback: any, deselectionCallback: any, rightClickCallback: any) {

        this.targetId = targetId;
        this.canvasId = canvasId;
        this.width = 0;
        this.height = 0;
        
        this.currentTool = 'select';
        this.itemList = [];

        this.creating = false;
        this.valid = true;

        this.globalSetup = new GlobalSetup();
        this.keypress = new Keypress(() => {});
        this.clipboard = new Clipboard();

        this.loadCanvas();
        this.setDragSelectionCallback();
        this.loadSelection(selectionCallback, deselectionCallback);
        this.setDrawingInterval();
        this.setEventListeners();

        this.rightClick = new RightClick(this, rightClickCallback);
    }

    loadCanvas() { // Calls renderCanvas and resizeCanvas
        // Adds canvas element to container
        this.renderCanvas();

        // Matches canvas size to container size and renders the background color
        this.setCanvasSizeAndBackground();

        // Sets the canvas element to this.canvas and gets the boundings
        this.setCanvasElement();

        this.setShortcuts();
    }

    renderCanvas() { // Adds canvas elemnt to container in the DOM and sets the context property to the canvas's context
        // Adds canvas element to container
        const container: any = document.getElementById(this.targetId);
        container.innerHTML = `
            <canvas id="${this.canvasId}" width="${this.width}" height="${this.height}"></canvas>
        `;

        // Sets the canvas context to the newly created canvas element
        this.element = document.getElementById(this.canvasId);
        this.context = this.element.getContext('2d');
        this.context.save();
        this.context.clearRect(0, 0, this.width, this.height);
        
        // Resizes and scales the canvas to account for device DPI. (Prevents image blur)
        fixDpi(this.element, this.width, this.height, this.context);
    }

    loadSelection(selectionCallback: any, deselectionCallback: any){
        this.selection = new Selection(this.canvas, selectionCallback, deselectionCallback, this.dragSelectionCallback);
    }

    setDragSelectionCallback() {
        this.dragSelectionCallback = (dimensions: any) => {
            const shapes = this.itemList;
            const numShapes = shapes.length;
            let shape;
            const selectedShapes = [];

            for (let i = 0; i < numShapes; i++) {
                shape = shapes[i];
                if ((dimensions.x <= shape.x && dimensions.x + dimensions.width >= shape.x && dimensions.y <= shape.y && dimensions.y + dimensions.height >= shape.y) ||
                    (dimensions.x <= shape.x + shape.width && dimensions.x + dimensions.width >= shape.x + shape.width && dimensions.y <= shape.y && dimensions.y + dimensions.height >= shape.y) ||
                    (dimensions.x <= shape.x && dimensions.x + dimensions.width >= shape.x && dimensions.y <= shape.y + shape.height && dimensions.y + dimensions.height >= shape.y + shape.height) ||
                    (dimensions.x <= shape.x + shape.width && dimensions.x + dimensions.width >= shape.x + shape.width && dimensions.y <= shape.y + shape.height && dimensions.y + dimensions.height >= shape.y + shape.height) ||
                    (dimensions.x <= shape.x && dimensions.x + dimensions.width >= shape.x && dimensions.y >= shape.y && dimensions.y <= shape.y + shape.height) ||
                    (dimensions.x >= shape.x && dimensions.x <= shape.x + shape.width && dimensions.y >= shape.y && dimensions.y <= shape.y + shape.height) ||
                    (dimensions.y <= shape.y && dimensions.y + dimensions.height >= shape.y && dimensions.x >= shape.x && dimensions.x <= shape.x + shape.width) ||
                    (dimensions.y >= shape.y && dimensions.y <= shape.y + shape.height && dimensions.x >= shape.x && dimensions.x <= shape.x + shape.width)
                ) {
                    selectedShapes.push(shape);
                }
            }
            if (selectedShapes.length === 0) {
                this.selection.deselectAll();
            } else {
                this.selection.setSelection(selectedShapes);
            }
        }
    }

    renderCanvasBackground() { //draws a rect for the canvas background color
        const ctx = this.context;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, this.width, this.height);
    }

    setCanvasSizeAndBackground() { // Sets the width and height properties and re-render canvas.
        const container: any = document.getElementById(this.targetId);
        this.width = container.offsetWidth;
        this.height = container.offsetHeight;
        this.renderCanvas();
        this.renderCanvasBackground();
    }

    setCanvasElement() { // Gets a reference to the canvas DOM element
        this.canvas = document.getElementById(this.canvasId);
        this.setBoundings();
    }

    setShortcuts() {
        this.shortcuts = new Shortcuts (this);
    }

    setBoundings() { // Sets the boundings property to the canvas element's bounding rect.
        this.boundings = this.canvas.getBoundingClientRect();
    }

    calcMouseXY(x: number, y: number) {
        const newX = x - this.boundings.left;
        const newY = y - this.boundings.top;
        return {x: newX, y: newY};
    }

    setEventListeners() { // Sets event listeners for determining what the user is clicking on and when they are dragging, resizing or creating an item.
        const selection = this.selection;
        
        window.addEventListener('resize', () => {
            this.setBoundings();
        })

        this.canvas.addEventListener('mousedown', (e: any) => { // Gets mouse location and compares it to the xy coordinates of shapes on the canvas.
            const { x, y } = getMouseXY(e, this.boundings);

            this.mousedownXY = {x, y};

            if (e.button === 0) {
                let newShape: any;
                if (this.currentTool === "select") {
                    if (this.selection.getMode() === "point-edit" && this.selection.editPointHover === null) {
                        this.selection.selectionList[0].addPoint(() => {
                            this.selection.setEditPointHover(x, y);
                            this.selection.setSelectedPoint(this.selection.editPointHover);
                            if (this.selection.editPointHover) {
                                this.selection.editPointDragging = true;
                            }
                            this.redrawShapes()
                        });
                        const item = this.coordsAreOnItem(x, y);
                        if ((!item || !this.selection.includes(item)) && !this.selection.isOnEditPoint(x, y)) {
                            this.selection.enableNormalMode();
                            this.redrawShapes();
                        } else if (this.selection.includes(item) && !this.selection.isOnEditPoint(x, y)) {
                            this.selection.setSelectedPoint(null);
                            this.redrawShapes();
                        }
                    } else if (this.selection.hasItems()) {
                        if (this.selection.getMode() === "normal") {
                            if (this.selection.selectorBoxHover) {
                                this.selection.setResize(); // Logs original position coordinates of selected items.
                            } else {
                                this.determineAndHandleItemClick(x, y); // Determines whether the click was on a canvas item and sets flags for dragging, creating, or resizing.
                            }
                        } else if (this.selection.getMode() === "point-edit") {
                            const editPointHover = this.selection.editPointHover;
                            if (editPointHover !== null) {
                                this.selection.setSelectedPoint(editPointHover);
                                this.selection.editPointDragging = true;
                                this.redrawShapes();
                            }
                        }
                        
                    } else {
                        this.determineAndHandleItemClick(x, y); // Determines whether the click was on a canvas item and sets flags for dragging, creating, or resizing.
                    }
                } else if (this.currentTool === 'rectangle' || this.currentTool === 'oval' || this.currentTool === 'triangle' || this.currentTool === 'polygon' || this.currentTool === 'line') { // Create a rectangle if rectangle tool is selected.
                    newShape = new Shape(this.currentTool, Math.floor(x), Math.floor(y), 0, 0, '#FAFAFA', false, '#000000', false, 1, this.canvas);
                    this.itemList.push(newShape);
                    this.selection.selectSingleItem(newShape);
                    this.creating = true;
                }
            }
            
        })

        this.canvas.addEventListener('mousemove', (e: any) => {
            const { x, y } = getMouseXY(e, this.boundings);
            if (this.selection._dragging) { // Handle dragging an item if dragging flag is true.
                this.selection.dragTo(x, y);
                this.valid = false; // Tells the drawing interval to start redrawing the canvas items every 300ms.
            } else if (this.selection.editPointDragging) {
                this.selection.setEditPointCoords(x, y);
                this.valid = false;
            } else if (this.creating) {
                this.selection.selectionList[0].create(this.mousedownXY.x, this.mousedownXY.y, x, y);
                this.valid = false;
            } else if (this.selection._resize) {
                const isRestricted = this.keypress.equals(["ShiftLeft"]) || this.keypress.equals(["ShiftRight"]);
                this.selection.resize(x, y, isRestricted);
                this.valid = false;
            } else if (this.selection.dragSelection.dragging) {
                this.selection.dragSelection.handleMouseMove(x, y);
                this.valid = false;
            } else if (this.selection.hasItems()) { // If none of the above flags are set, but there are still items selected, check to see if the user is hovering over a selector box.
                const { x, y } = getMouseXY(e, this.boundings);
                if (this.selection.getMode() === "normal") {
                    this.selection.setSelectorBoxHover(x, y);
                } else if (this.selection.getMode() === "point-edit") {
                    this.selection.setEditPointHover(x, y);
                    if (this.selection.editPointHover === null) {
                        this.selection.selectionList[0].handleAddPointHover(x, y, () => this.redrawShapes());
                    } else {
                        this.selection.selectionList[0].clearAddPointHover(() => this.redrawShapes());
                    }
                }
                
            }
        })

        this.canvas.addEventListener('mouseup', (e: any) => {
            if (this.selection._dragging) {
                this.selection.clearDraggingCoords();
            }

            if (this.selection.editPointDragging) {
                this.selection.editPointDragging = false;
            }

            if (this.selection._dragging || this.creating || this.selection._resize) { // Timeout function that allows the drawing interval to fire one final time to prevent the items from being innacurate.
                setTimeout(() => {
                    this.valid = true;
                    if (this.selection.hasItems()) {
                        this.redrawShapes();
                        this.selection.selectionCallback(selection.getCommonProperties());
                    }
                }, 100)
            }

            if (this.selection.dragSelection.dragging) {
                this.selection.dragSelection.handleMouseUp();
            }

            // Reset action flags.
            this.selection._dragging = false;
            this.creating = false;
            this.selection._resize = false;

            this.currentTool = 'select';
        })

        this.canvas.addEventListener("dblclick", (e: any) => this.determineAndHandleItemDblClick(e));

    }

    determineAndHandleItemClick(x: number, y: number) {
        const item = this.coordsAreOnItem(x, y);
        const selection = this.selection;

            if (item) {
                this.clickItem(item); // Handle clicking an item.
                selection._dragging = true; // Set the selection dragging to true, just in case the user wants to drag.
                selection.setDraggingCoords(x, y); // Sets original coordinates of the selection.
            
            } else { // Handle a user clicking on the canvas without clicking on a shape.
                selection.deselectAll();
                selection.dragSelection.handleMouseDown(x, y);
                this.redrawShapes();
            }
    }

    determineAndHandleItemDblClick(e: any) {
        const { x, y } = getMouseXY(e, this.boundings);
        const item = this.coordsAreOnItem(x, y);
        const selection = this.selection;
        selection.setSelection([item]);
        if (!(item instanceof Group) && item) {
            selection.enablePointEditMode();
        }
        this.redrawShapes();
    }

    coordsAreOnItem(x: number, y: number) { // Loop over canvas items and determine if mouse coordinates are inside any item coordinates.
        const numItems = this.itemList.length;
        let item;
        for (let i = numItems - 1; i >= 0; i--) { 
            item = this.itemList[i];
            if (x > item.x && y > item.y && x < item.x + item.width && y < item.y + item.height) {
                return item;
            } else if (item instanceof Shape && item.segments.length === 1 && item.segments[0].isHovering(x, y, item)) {
                return item;
            }
        }
        return false
    }

    clickItem(item: any) { // Changes the selectedShape property and sets selected shape event listeners
        if (item !== false) {
            const itemAlreadySelected = this.selection.includes(item);
            if (!itemAlreadySelected) {
                if (this.keypress.includes("ShiftLeft") || this.keypress.includes("ShiftRight")) {
                    this.selection.addItemToSelection(item, this.itemList);
                } else {
                    this.selection.selectSingleItem(item);
                }
            } else if (itemAlreadySelected) {
                if (this.keypress.includes("ShiftLeft") || this.keypress.includes("ShiftRight")) {
                    this.selection.deselectItem(item);
                }
            }
            
        }
    }

    redrawShapes() { // Redraws the canvas shapes. Called by the drawing interval.
        const selection = this.selection;
        const itemList = this.itemList;
        const dragSelection = selection.dragSelection;
        this.context.clearRect(0, 0, this.width, this.height);
        this.renderCanvasBackground();
        
        if (selection.hasItems() && this.selection.getMode() === "normal") {
            selection.drawOutline();
        }
        const numShapes = this.itemList.length;
        for (let i = 0; i <= numShapes - 1; i++) {
            itemList[i].draw();
        }
        if (selection.hasItems()) {
            selection.drawSelection();
        }

        if (dragSelection.dragging) {
            dragSelection.draw();
        }
    }

    setDrawingInterval() { // Sets the interval between canvas redraws when canvas is invalid
        setInterval(() => {
            if (this.valid === false) {
                const selection = this.selection;
                if (this.creating || selection._resize || selection._dragging) {
                    selection.inspectItems();
                }
                this.redrawShapes();
            }
        }, 30);
    }




    // ------ Public Methods (Used by app.js) ------ //


    changeTool(tool: string) { // Changes the current tool
        this.currentTool = tool;
    }

    changeXPos(xPos: number) {
        if (this.selection.hasItems()) {
            this.selection.moveTo(xPos, this.selection.properties.y);
            this.redrawShapes();
        }
    }

    changeYPos(yPos: number) {
        if (this.selection.hasItems()) {
            this.selection.moveTo(this.selection.properties.x, yPos);
            this.redrawShapes();
        }
    }

    changeWidth(width: number) {
        if (this.selection.hasItems()) {
            this.selection.setWidth(width);
            this.redrawShapes();
        }
    }

    changeHeight(height: number) {
        if (this.selection.hasItems()) 
        this.selection.setHeight(height);
        this.redrawShapes();
    }

    changeSelectedFill(fill: string) { // Changes the fill of the selected shape and redraws
        const sanitizedFill = sanitizeHex(fill);

        if (this.selection.hasItems()) {
            this.selection.setFill(sanitizedFill);
        }
        this.redrawShapes();
    }

    changeSelectedBorderColor(borderColor: string) {
        const sanitizedBorderColor = sanitizeHex(borderColor);

        if (this.selection.hasItems()) {
            this.selection.setBorderHex(sanitizedBorderColor);
        }
        this.redrawShapes();
    }

    increaseSelectedBorderWidth() {
        if (this.selection.properties.borderWidth) {
            this.changeSelectedBorderWidth(this.selection.properties.borderWidth + 1);
        } else {
            this.changeSelectedBorderWidth(1);
        }
    }

    decreaseSelectedBorderWidth() {
        if (this.selection.properties.borderWidth && this.selection.properties.borderWidth > 1) {
            this.changeSelectedBorderWidth(this.selection.properties.borderWidth - 1);
        } else {
            this.changeSelectedBorderWidth(0);
        }
    }

    changeSelectedBorderWidth(width: any) {
        let sanitizedBorderWidth;

        if (isAllNums(width)) {
            if (parseInt(width) < 0) {
                sanitizedBorderWidth = 0;
            } else {
                sanitizedBorderWidth = parseInt(width);
            }

            if (this.selection.hasItems()) {
                this.selection.setBorderWidth(sanitizedBorderWidth);
            }
            this.redrawShapes();
        }
    }

    increaseSelectedZIndex() {
        if (this.selection.hasItems) {
            this.itemList = this.selection.moveUpZ(this.itemList);
            this.redrawShapes();
        }
    }

    decreaseSelectedZIndex() {
        if (this.selection.hasItems) {
            this.itemList = this.selection.moveDownZ(this.itemList);
            this.redrawShapes();
        }
    }

    getItemListWithoutSelection() {
        return this.itemList.filter((item: any) => {
            return this.selection.selectionList.indexOf(item) === -1;
        });
    }

    group() {
        if (this.selection.hasItems()) {
            let itemList = this.itemList;
            let numItems = itemList.length;
            let item;

            let filteredItemList = this.getItemListWithoutSelection();

            let groupIndex = 0;
            const newGroup = new Group(this.selection.selectionList);

            for (let i = 0; i < numItems; i++) {
                item = itemList[i];
                if (this.selection.selectionList.indexOf(item) >= 0) {
                    if (i > groupIndex && i < filteredItemList.length - 1) {
                        groupIndex = i;
                    }
                }
            }

            filteredItemList.splice(0, 0, newGroup);
            this.itemList = filteredItemList;
            this.selection.selectSingleItem(newGroup);
            this.redrawShapes();
        }
    }

    unGroup() {
        if (this.selection.selectionList.length === 1 && this.selection.selectionList[0] instanceof Group) {
            const groupItemList = this.selection.selectionList[0].itemList;
            let itemList = this.itemList;
            const groupIndex = this.itemList.indexOf(this.selection.selectionList[0]);
            if (groupIndex >= 0) {
                itemList.splice(groupIndex, 1, ...groupItemList);
            } else {
                console.assert(false);
            }
            this.selection.setSelection(groupItemList);
            this.redrawShapes();
        }
    }

    cut() {
        this.itemList = this.getItemListWithoutSelection();
        this.clipboard.cut(this.selection.selectionList, this.selection.properties.x, this.selection.properties.y);
        this.selection.deselectAll();
        this.redrawShapes();
    }

    copy() {
        this.clipboard.copy(this.selection.selectionList, this.selection.properties.x, this.selection.properties.y);
    }

    paste(mx: any, my: any) {
        let x;
        let y;
        if (mx && my) {
            const calcXY = this.calcMouseXY(mx, my);
            x = calcXY.x;
            y = calcXY.y
        } else {
            const selProperties = this.clipboard.selection;
            x = selProperties.x;
            y = selProperties.y;
        }
        const _itemList = this.itemList;
        const pastedItems = this.clipboard.getPastedItems(x, y);
        this.itemList = [..._itemList, ...pastedItems];
        this.selection.setSelection(pastedItems);
        this.redrawShapes();
    }

    delete() {
        this.itemList = this.getItemListWithoutSelection()
        this.selection.deselectAll();
        this.redrawShapes();
    }

    deletePoint() {
        this.selection.deleteSelectedPoint();
        this.redrawShapes();
    }

    moveUp1() {
        const selProps = this.selection.properties;
        this.selection.moveTo(selProps.x, selProps.y - 1);
        this.selection.selectionCallback(selProps);
        this.redrawShapes();
    }

    moveRight1() {
        const selProps = this.selection.properties;
        this.selection.moveTo(selProps.x + 1, selProps.y);
        this.selection.selectionCallback(selProps);
        this.redrawShapes();
    }

    moveDown1() {
        const selProps = this.selection.properties;
        this.selection.moveTo(selProps.x, selProps.y + 1);
        this.selection.selectionCallback(selProps);
        this.redrawShapes();
    }

    moveLeft1() {
        const selProps = this.selection.properties;
        this.selection.moveTo(selProps.x - 1, selProps.y);
        this.selection.selectionCallback(selProps);
        this.redrawShapes();
    }

    moveUp10() {
        const selProps = this.selection.properties;
        this.selection.moveTo(selProps.x, selProps.y - 10);
        this.selection.selectionCallback(selProps);
        this.redrawShapes();
    }

    moveRight10() {
        const selProps = this.selection.properties;
        this.selection.moveTo(selProps.x + 10, selProps.y);
        this.selection.selectionCallback(selProps);
        this.redrawShapes();
    }

    moveDown10() {
        const selProps = this.selection.properties;
        this.selection.moveTo(selProps.x, selProps.y + 10);
        this.selection.selectionCallback(selProps);
        this.redrawShapes();
    }

    moveLeft10() {
        const selProps = this.selection.properties;
        this.selection.moveTo(selProps.x - 10, selProps.y);
        this.selection.selectionCallback(selProps);
        this.redrawShapes();
    }
}