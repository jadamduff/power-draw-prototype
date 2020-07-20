import Keypress from './Keypress';

export default class Shortcuts {
    canvasParent: any;
    keypress: any;

    keysEqual: any;
    keysInclude: any;

    cut: any;
    copy: any;
    paste: any;
    delete: any;

    groupItems: any;
    ungroupItems: any;

    moveUp1: any;
    moveRight1: any;
    moveDown1: any;
    moveLeft1: any;

    moveUp10: any;
    moveRight10: any;
    moveDown10: any;
    moveLeft10: any;

    setKeypress: any;

    constructor(canvasParent: any) {
        this.canvasParent = canvasParent;

        this.keysEqual = (keys: any, keyQuery: any) => {
            let key;
            let queryKey;
            if (keys.length === keyQuery.length) {
                for (let i = 0; i < keyQuery.length; i++) {
                    key = keys[i];
                    queryKey = keyQuery[i];
                    if (key !== queryKey) {
                        return false
                    }
                }
            } else {
                return false;
            }
                
            return true;
        }
    
        this.keysInclude = (keys: any, key: string) => {
            const index = keys.indexOf(key);
            if (index >= 0) {
                return true;
            }
            return false;
        }

        this.cut = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["MetaLeft", "KeyX"]) ||
                keysEqual(keys, ["MetaRight", "KeyX"]) ||
                keysEqual(keys, ["ControlLeft", "KeyX"]) ||
                keysEqual(keys, ["ControlRight", "KeyX"])
            ) {
                this.canvasParent.cut();
            }
        }

        this.copy = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["MetaLeft", "KeyC"]) ||
                keysEqual(keys, ["MetaRight", "KeyC"]) ||
                keysEqual(keys, ["ControlLeft", "KeyC"]) ||
                keysEqual(keys, ["ControlRight", "KeyC"])
            ) {
                this.canvasParent.copy();
            }
        }

        this.paste = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["MetaLeft", "KeyV"]) ||
                keysEqual(keys, ["MetaLeft", "KeyC", "KeyV"]) ||
                keysEqual(keys, ["MetaRight", "KeyV"]) ||
                keysEqual(keys, ["MetaRight", "KeyC", "KeyV"]) ||
                keysEqual(keys, ["ControlLeft", "KeyV"]) ||
                keysEqual(keys, ["ControlLeft", "KeyC", "KeyV"]) ||
                keysEqual(keys, ["ControlRight", "KeyV"]) ||
                keysEqual(keys, ["ControlRight", "KeyC", "KeyV"])
            ) {
                this.canvasParent.paste(false, false);
            }
        }

        this.delete = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["Backspace"]) && this.canvasParent.selection.getMode() === 'normal'
            ) {
                this.canvasParent.delete();
            } else if (keysEqual(keys, ["Backspace"]) && this.canvasParent.selection.getMode() === 'point-edit' && this.canvasParent.selection.selectedPoint !== false) {
                this.canvasParent.deletePoint();
            }
        }

        this.groupItems = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["MetaLeft", "KeyG"]) ||
                keysEqual(keys, ["MetaRight", "KeyG"]) ||
                keysEqual(keys, ["ControlLeft", "KeyG"]) ||
                keysEqual(keys, ["ControlRight", "KeyG"])
            ) {
                this.canvasParent.group();
            }
        }

        this.ungroupItems = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["MetaLeft", "ShiftLeft", "KeyG"]) ||
                keysEqual(keys, ["MetaLeft", "ShiftRight", "KeyG"]) ||
                keysEqual(keys, ["MetaRight", "ShiftLeft", "KeyG"]) ||
                keysEqual(keys, ["MetaRight", "ShiftRight", "KeyG"]) ||
                keysEqual(keys, ["ControlLeft", "ShiftLeft", "KeyG"]) ||
                keysEqual(keys, ["ControlLeft", "ShiftRight", "KeyG"]) ||
                keysEqual(keys, ["ControlRight", "ShiftLeft", "KeyG"]) ||
                keysEqual(keys, ["ControlRight", "ShiftRight", "KeyG"])
            ) {
                this.canvasParent.unGroup();
            }
        }

        this.moveUp1 = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["ArrowUp"])
            ) {
                this.canvasParent.moveUp1();
            }
        }

        this.moveRight1 = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["ArrowRight"])
            ) {
                this.canvasParent.moveRight1();
            }
        }

        this.moveDown1 = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["ArrowDown"])
            ) {
                this.canvasParent.moveDown1();
            }
        }

        this.moveLeft1 = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["ArrowLeft"])
            ) {
                this.canvasParent.moveLeft1();
            }
        }

        this.moveUp10 = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["ShiftLeft", "ArrowUp"]) ||
                keysEqual(keys, ["ShiftRight", "ArrowUp"])
            ) {
                this.canvasParent.moveUp10();
            }
        }

        this.moveRight10 = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["ShiftLeft", "ArrowRight"]) ||
                keysEqual(keys, ["ShiftRight", "ArrowRight"])
            ) {
                this.canvasParent.moveRight10();
            }
        }

        this.moveDown10 = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["ShiftLeft", "ArrowDown"]) ||
                keysEqual(keys, ["ShiftRight", "ArrowDown"])
            ) {
                this.canvasParent.moveDown10();
            }
        }

        this.moveLeft10 = (keys: any) => {
            const keysEqual = this.keysEqual;
            if (
                keysEqual(keys, ["ShiftLeft", "ArrowLeft"]) ||
                keysEqual(keys, ["ShiftRight", "ArrowLeft"])
            ) {
                this.canvasParent.moveLeft10();
            }
        }

        

        this.setKeypress = () => {
            this.keypress = new Keypress((e: any, keys: any) => {
                this.cut(keys);
                this.copy(keys);
                this.paste(keys);
                this.delete(keys);
                this.ungroupItems(keys);
                this.groupItems(keys);
                this.moveUp1(keys);
                this.moveRight1(keys);
                this.moveDown1(keys);
                this.moveLeft1(keys);
                this.moveUp10(keys);
                this.moveRight10(keys);
                this.moveDown10(keys);
                this.moveLeft10(keys);
            });
        }

        this.setKeypress();
    }
    
}