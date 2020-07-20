const tempaltes = {
    rightPanelColorPicker:
    `<div class="right-panel-row-label">
        COLOR PICKER
    </div>
    <div id="right-panel-single-color" class="single-color-picker"></div>
    <div id="right-panel-multi-color" class="multi-color-picker"></div>`,

    addMenuMain:
    `<div class="add-menu-main" id="add-menu-main">
        <div>
            <div class="add-menu-row" id="add-menu-shape">
                <div class="add-menu-row-left">Shape</div>
                <div class="add-menu-row-right" id="add-menu-row-right"><img src="./src/images/left-menu-arrow-gray-small.svg" /></div>
            </div>
            <div class="add-menu-row" id="add-menu-vector">
                <div class="add-menu-row-left">Vector</div>
                <div class="add-menu-row-right" id="add-menu-row-right"></div>
            </div>
            <div class="add-menu-row" id="add-menu-text">
                <div class="add-menu-row-left">Text</div>
                <div class="add-menu-row-right" id="add-menu-row-right"></div>
            </div>
            <div class="add-menu-row" id="add-menu-Image">
                <div class="add-menu-row-left">Image</div>
                <div class="add-menu-row-right" id="add-menu-row-right"></div>
            </div>
            <div class="add-menu-row" id="add-menu-artboard">
                <div class="add-menu-row-left">Artboard</div>
                <div class="add-menu-row-right" id="add-menu-row-right"></div>
            </div>
            <div class="add-menu-row" id="add-menu-component">
                <div class="add-menu-row-left">Component</div>
                <div class="add-menu-row-right" id="add-menu-row-right"><img src="./src/images/left-menu-arrow-gray-small.svg" /></div>
            </div>
        </div>
    </div>`,

    addShapeMenu:
    `<div class="add-shape-menu-wrapper">
        <div class="add-menu-row" id="add-menu-rectangle">
            <div class="add-menu-row-left">Rectangle</div>
            <div class="add-menu-row-right" id="add-menu-row-right"></div>
        </div>
        <div class="add-menu-row" id="add-menu-oval">
            <div class="add-menu-row-left">Oval</div>
            <div class="add-menu-row-right" id="add-menu-row-right"></div>
        </div>
        <div class="add-menu-row" id="add-menu-triangle">
            <div class="add-menu-row-left">Triangle</div>
            <div class="add-menu-row-right" id="add-menu-row-right"></div>
        </div>
        <div class="add-menu-row" id="add-menu-polygon">
            <div class="add-menu-row-left">Polygon</div>
            <div class="add-menu-row-right" id="add-menu-row-right"></div>
        </div>
        <div class="add-menu-row" id="add-menu-line">
            <div class="add-menu-row-left">Line</div>
            <div class="add-menu-row-right" id="add-menu-row-right"></div>
        </div>
    </div>`,

    canvasRightClickMenuOnSelection: (x: number, y: number) => {
        let menu = document.createElement('div');
        menu.style.cssText = `left: ${x}px; top: ${y}px;`;
        menu.className = "right-click-menu-container";
        menu.id = "right-click-menu-container";
        menu.innerHTML = `
            <div class="right-click-menu-option-group" id="right-click-menu-option-group">
                <div class="right-click-menu-option noselect" id="right-click-cut">
                    Cut
                </div>
                <div class="right-click-menu-option noselect" id="right-click-copy">
                    Copy
                </div>
                <div class="right-click-menu-option noselect" id="right-click-paste">
                    Paste
                </div>
            </div>
            <div class="right-click-menu-option-group" id="right-click-menu-option-group">
                <div class="right-click-menu-option noselect" id="right-click-delete">
                    Delete
                </div>
            </div>
            <div class="right-click-menu-option-group" id="right-click-menu-option-group">
                <div class="right-click-menu-option noselect" id="right-click-forward">
                    Move Forward
                </div>
                <div class="right-click-menu-option noselect" id="right-click-backward">
                    Move Backward
                </div>
            </div>
            <div class="right-click-menu-option-group" id="right-click-menu-option-group">
                <div class="right-click-menu-option noselect" id="right-click-group">
                    Group
                </div>
                <div class="right-click-menu-option noselect" id="right-click-ungroup">
                    Ungroup
                </div>
            </div>
        `
        return menu;
    },
    canvasRightClickMenuOffSelection: (x: number, y: number) => {
        let menu = document.createElement('div');
        menu.style.cssText = `left: ${x}px; top: ${y}px;`;
        menu.className = "right-click-menu-container";
        menu.id = "right-click-menu-container";
        menu.innerHTML = `
            <div class="right-click-menu-option-group" id="right-click-menu-option-group">
                <div class="right-click-menu-option noselect" id="right-click-paste">
                    Paste
                </div>
            </div>
        `
        return menu;
    }
}

export default tempaltes;