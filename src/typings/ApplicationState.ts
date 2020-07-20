export default class ApplicationState {
    addMenuOpen: boolean;
    addShapeMenuOpen: boolean;
    leftPanelOpen: boolean;
    rightPanelOpen: boolean;
    canvasRightClickMenu: boolean;

    constructor() {
        this.addMenuOpen = false;
        this.addShapeMenuOpen = false;
        this.leftPanelOpen = true;
        this.rightPanelOpen = true;
        this.canvasRightClickMenu = false;
    }
}