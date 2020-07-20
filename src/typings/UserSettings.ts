export default class UserSettings {
    showLeftPanel: boolean;
    showRightPanel: boolean;

    constructor(settingsObj: any) {
        this.showLeftPanel = settingsObj.showLeftPanel;
        this.showRightPanel = settingsObj.showRightPanel;
    }
}