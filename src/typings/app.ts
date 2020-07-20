import ApplicationState from './ApplicationState';
import Canvas from './power-draw/Canvas';
import ColorPicker from './power-draw/ColorPicker';
import UserSettings from './UserSettings';
import partials from './partials';
import { isDescendantOf, isOrIsDescendantOf, isDescendantOfClass, isOrIsDescendantOfClass } from './utils';

// Instantiates user settings object.
const userSettings = new UserSettings({showLeftPanel: true, showRightPanel: true});

//Instantiates Application state object.
const applicationState = new ApplicationState();

window.onload = function() {

    const selectionCallback = (properties: any) => { // Selection callback takes an object of selection property values as an argument and uses them to update data displayed in the UI.
        if (document.getElementById('right-panel-container') !== null) { // Only need to update UI data if the appropriate components are visisble in the UI.
            // Properties on the property object are null if the property isn't consistent among the items in the selection.

            if (properties.x === null) {
                xInput.value = '';
            } else {
                xInput.value = properties.x;
            }
            if (properties.y === null) {
                yInput.value = '';
            } else {
                yInput.value = properties.y;
            }
            if (properties.width === null) {
                widthInput.value = '';
            } else {
                widthInput.value = properties.width;
            }
            if (properties.height === null) {
                heightInput.value = '';
            } else {
                heightInput.value = properties.height;
            }
            if (properties.fillHex === null) {
                colorInputFill.value = '';
                colorPickerBtnFill.style.backgroundColor = '#FFFFFF';
            } else {
                colorInputFill.value = properties.fillHex;
                colorPickerBtnFill.style.backgroundColor = properties.fillHex;
            }
            if (properties.borderHex === null) {
                colorInputBorder.value = '';
                colorPickerBtnBorder.style.backgroundColor = '#E0E0E0';
            } else {
                colorInputBorder.value = properties.borderHex;
                colorPickerBtnBorder.style.backgroundColor = properties.borderHex;
            }
            if (properties.borderWidth === null) {
                borderWidthInput.value = properties.borderWidth;
            } else {
                borderWidthInput.value = properties.borderWidth;
            }
        }
    }

    const deselectionCallback = function () { // Resets/clears data shown in the UI if canvas.selection is cleared of items.
        if (document.getElementById('right-panel-container') !== null) {
            xInput.value = '';
            yInput.value = '';
            widthInput.value = '';
            heightInput.value = '';
            colorInputFill.value = '';
            colorPickerBtnFill.style.backgroundColor = "#FFFFFF";
            colorInputBorder.value = '';
            colorPickerBtnBorder.style.backgroundColor = "#FFFFFF";
            borderWidthInput.value = '';
        }
    }

    const rightClickCallback = function (details: any) {
        const wrapper: any = document.getElementById('main-wrapper');
        let menu;

        if (details.selectionClicked) {
            menu = partials.canvasRightClickMenuOnSelection(details.x, details.y);
            wrapper.appendChild(menu);
            applicationState.canvasRightClickMenu = true;
            menu.addEventListener('mouseup', (e) => rightClickClickHandler(e, details.x, details.y));
            menu.addEventListener('contextmenu', (e: any) => {
                if (e.button === 2) {
                    e.preventDefault();
                }
            })
            
        } else {
            menu = partials.canvasRightClickMenuOffSelection(details.x, details.y);
            wrapper.appendChild(menu);
            applicationState.canvasRightClickMenu = true;
            menu.addEventListener('mouseup', (e) => rightClickClickHandler(e, details.x, details.y));
            menu.addEventListener('contextmenu', (e: any) => {
                if (e.button === 2) {
                    e.preventDefault();
                }
            })
        }

        
        window.addEventListener('mousedown', rightClickCloseHandler);
    }

    const rightClickClickHandler = function(e: any, mx: number, my: number) {
        if (e.button !== 2) {
            const id = e.target.id;
            if (id !== 'right-click-menu-container' && id !== 'right-click-menu-option-group') {
                rightClickOptionHandlers(id, mx, my);
                removeRightClickMenu();
            }
        }
    }

    const removeRightClickMenu = function() {
        const wrapper: any = document.getElementById('main-wrapper');
        const menu: any = document.getElementById('right-click-menu-container');
        wrapper.removeChild(menu);
        applicationState.canvasRightClickMenu = false;
    }

    const rightClickCloseHandler = function (e: any) {
        const id = e.target.id;
        if (id !== 'right-click-menu-container' && id !== 'right-click-menu-option-group' && e.target.className !== "right-click-menu-option noselect" && applicationState.canvasRightClickMenu) {
            removeRightClickMenu();
            window.removeEventListener('mousedown', rightClickCloseHandler);
        }
    }

    const rightClickOptionHandlers = function(id: string, mx: number, my: number) {
        if (id === "right-click-cut") {
            canvas.cut();
        } else if (id === "right-click-copy") {
            canvas.copy();
        } else if (id === "right-click-paste") {
            canvas.paste(mx, my);
        } else if (id === "right-click-delete") {
            canvas.delete();
        } else if (id === "right-click-forward") {
            canvas.increaseSelectedZIndex();
        } else if (id === "right-click-backward") {
            canvas.decreaseSelectedZIndex();
        } else if (id === "right-click-group") {
            canvas.group();
        } else if (id === "right-click-ungroup") {
            canvas.unGroup();
        }
    }

    const canvas = new Canvas('canvas-wrapper', 'main-canvas', selectionCallback, deselectionCallback, rightClickCallback); //Instantiates new Canvas object and passes in the canvas container element, desired canvasID, selection callback, and deselection callback.

    // Creates refrences to necessary UI elements.
    let xInput: any = document.getElementById('x-pos-input');
    let yInput: any = document.getElementById('y-pos-input');
    let widthInput: any = document.getElementById('width-input');
    let heightInput: any = document.getElementById('height-input');
    let colorInputFill: any = document.getElementById('color-input-fill');
    let colorPickerBtnFill: any = document.getElementById('color-picker-button-fill');
    let colorInputBorder: any = document.getElementById('color-input-border');
    let colorPickerBtnBorder: any = document.getElementById('color-picker-button-border');
    let borderWidthInput: any = document.getElementById('border-width-input');
    let borderWidthUpBtn: any = document.getElementById('border-width-up-btn');
    let borderWidthDownBtn: any = document.getElementById('border-width-down-btn')

    let moveUpBtn: any = document.getElementById('move-up-btn');
    let moveDownBtn: any = document.getElementById('move-down-btn');
    let groupBtn: any = document.getElementById('group-btn');
    let ungroupBtn: any = document.getElementById('ungroup-btn');

    const selectRectangleEventListener = function (e: any) {
        if (isOrIsDescendantOf('add-menu-rectangle', e.target)) {
            const mainWrapper: any = document.getElementById('main-wrapper');
            const addMenu = document.getElementById('add-menu-dropdown-container');
            mainWrapper.removeChild(addMenu);
            applicationState.addMenuOpen = false;
            applicationState.addShapeMenuOpen = false;
            canvas.changeTool('rectangle');
            document.removeEventListener('mouseup', selectRectangleEventListener);
        } else if (isOrIsDescendantOf('add-menu-oval', e.target)) {
            const mainWrapper: any = document.getElementById('main-wrapper');
            const addMenu = document.getElementById('add-menu-dropdown-container');
            mainWrapper.removeChild(addMenu);
            applicationState.addMenuOpen = false;
            applicationState.addShapeMenuOpen = false;
            canvas.changeTool('oval');
            document.removeEventListener('mouseup', selectRectangleEventListener);
        } else if (isOrIsDescendantOf('add-menu-triangle', e.target)) {
            const mainWrapper: any = document.getElementById('main-wrapper');
            const addMenu = document.getElementById('add-menu-dropdown-container');
            mainWrapper.removeChild(addMenu);
            applicationState.addMenuOpen = false;
            applicationState.addShapeMenuOpen = false;
            canvas.changeTool('triangle');
            document.removeEventListener('mouseup', selectRectangleEventListener);
        } else if (isOrIsDescendantOf('add-menu-polygon', e.target)) {
            const mainWrapper: any = document.getElementById('main-wrapper');
            const addMenu = document.getElementById('add-menu-dropdown-container');
            mainWrapper.removeChild(addMenu);
            applicationState.addMenuOpen = false;
            applicationState.addShapeMenuOpen = false;
            canvas.changeTool('polygon');
            document.removeEventListener('mouseup', selectRectangleEventListener);
        } else if (isOrIsDescendantOf('add-menu-line', e.target)) {
            const mainWrapper: any = document.getElementById('main-wrapper');
            const addMenu = document.getElementById('add-menu-dropdown-container');
            mainWrapper.removeChild(addMenu);
            applicationState.addMenuOpen = false;
            applicationState.addShapeMenuOpen = false;
            canvas.changeTool('line');
            document.removeEventListener('mouseup', selectRectangleEventListener);
        }
    }

    window.addEventListener('mousedown', (e: any) => { // Click event listeners
        if (e.target.className === 'header-button-add' || e.target.parentElement.className === 'header-button-add') {
            if (!applicationState.addMenuOpen) {
                const mainWrapper: any = document.getElementById('main-wrapper');
                const addMenu = document.createElement('div');
                addMenu.className = 'add-menu-dropdown-container';
                addMenu.id = 'add-menu-dropdown-container';
                addMenu.innerHTML = partials.addMenuMain;
                mainWrapper.appendChild(addMenu);
                applicationState.addMenuOpen = true;
            }
        } else if (e.target.id === 'color-picker-button-fill') {
            const rightPanel: any = document.getElementById('right-panel');
            rightPanel.innerHTML = partials.rightPanelColorPicker;
            const colorPicker = new ColorPicker(canvas.selection, 'right-panel-single-color', 'right-panel-multi-color', (fill: string) => canvas.changeSelectedFill(fill));
        }
    })

    window.addEventListener('mousemove', (e: any) => {
        if (isDescendantOf("add-menu-shape", e.target) && !applicationState.addShapeMenuOpen) {
            applicationState.addShapeMenuOpen = true;
            setTimeout(() => {
                if (applicationState.addShapeMenuOpen && !document.getElementById('add-shape-menu-container')) {
                    const addMenu: any = document.getElementById('add-menu-dropdown-container');
                    const addShapeMenu = document.createElement('div');
                    addShapeMenu.className = 'add-shape-menu-container';
                    addShapeMenu.id = 'add-shape-menu-container';
                    addShapeMenu.innerHTML = partials.addShapeMenu;
                    addMenu.appendChild(addShapeMenu);
                    document.addEventListener('mouseup', selectRectangleEventListener);
                }
            }, 300)
        }
        
        if ((isOrIsDescendantOfClass('add-menu-row', e.target) && !isOrIsDescendantOf('add-menu-shape', e.target) && !isOrIsDescendantOf('add-shape-menu-container', e.target) || isOrIsDescendantOf('header-button-add', e.target)) && applicationState.addShapeMenuOpen) {
            const addMenu: any = document.getElementById('add-menu-dropdown-container');
            const addShapeMenu = document.getElementById('add-shape-menu-container');
            if (addShapeMenu) {
                addMenu.removeChild(addShapeMenu);
            }
            applicationState.addShapeMenuOpen = false;
        }
    });

    window.addEventListener('mouseup', (e: any) => {
        if (e.target.className !== 'header-button-add' && e.target.parentElement.className !== 'header-button-add' && applicationState.addMenuOpen) {
            const mainWrapper: any = document.getElementById('main-wrapper');
            const addMenu = document.getElementById('add-menu-dropdown-container');
            mainWrapper.removeChild(addMenu);
            applicationState.addMenuOpen = false;
        }
    })

    xInput.addEventListener('blur', (e: any) => { // X input blur event listener
        if (canvas.selection.hasItems()) {
            canvas.changeXPos(parseInt(e.target.value));
        }
    })

    yInput.addEventListener('blur', (e: any) => { // Y input blur event listener
        if (canvas.selection.hasItems()) {
            canvas.changeYPos(parseInt(e.target.value));
        }
    })

    widthInput.addEventListener('blur', (e: any) => { // Width input blur event listener
        if (canvas.selection.hasItems()) {
            canvas.changeWidth(parseInt(e.target.value));
        }
    })

    heightInput.addEventListener('blur', (e: any) => { // Height input blur event listener
        if (canvas.selection.hasItems()) {
            canvas.changeHeight(parseInt(e.target.value));
        }
    })

    colorInputFill.addEventListener('blur', (e: any) => { // Fill color input blur event listener
        if (canvas.selection.hasItems()) {
            canvas.changeSelectedFill(e.target.value);
        }
    })

    colorInputBorder.addEventListener('blur', (e: any) => { // Border color input event listener
        if (canvas.selection.hasItems()) {
            canvas.changeSelectedBorderColor(e.target.value);
        }
    })

    borderWidthInput.addEventListener('blur', (e: any) => { // Border with input event listener
        if (canvas.selection.hasItems()) {
            canvas.changeSelectedBorderWidth(e.target.value);
        }
    })

    borderWidthUpBtn.addEventListener('mouseup', (e: any) => { // Increase border width button mouseup event listener
        if (canvas.selection.hasItems()) {
            canvas.increaseSelectedBorderWidth();
        }
    })

    borderWidthDownBtn.addEventListener('mouseup', (e: any) => { // Decrease border width button mouseup event listener
        if (canvas.selection.hasItems()) {
            canvas.decreaseSelectedBorderWidth();
        }
    })

    moveUpBtn.addEventListener('mousedown', (e: any) => {
        canvas.increaseSelectedZIndex();
    });

    moveDownBtn.addEventListener('mousedown', (e: any) => {
        canvas.decreaseSelectedZIndex();
    });

    groupBtn.addEventListener('mousedown', (e: any) => {
        canvas.group();
    });

    ungroupBtn.addEventListener('mousedown', (e: any) => {
        canvas.unGroup();
    });
}
