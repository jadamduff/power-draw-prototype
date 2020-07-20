export default class Keypress {
    keysPressed: any;
    parentCallback: any;
    
    constructor(parentCallback: any) {
        this.keysPressed = [];
        this.parentCallback = parentCallback;
        this.setEventListeners();
    }

    setEventListeners() {
        window.addEventListener('keydown', this.handleKeydown.bind(this));
        window.addEventListener('keyup', this.handleKeyup.bind(this));
    }

    handleKeydown(e: any) {
        if (e.which === 83 && (this.includes("MetaLeft") || this.includes("MetaRight"))) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        if (!this.keysPressed.includes(e.code)) {
            this.keysPressed.push(e.code);
            this.parentCallback(e, this.keysPressed);
            console.log(this.keysPressed);
            console.log(e.which);
        } else {
            this.parentCallback(e, this.keysPressed);
            console.log(this.keysPressed);
            console.log(e.which);
        }
    }

    handleKeyup(e: any) {
        if (e.code === "MetaLeft" || e.code === "MetaRight") {
            this.keysPressed = [];
        } else {
            let newKeysPressed = this.keysPressed.filter((key: any) => {
                return key !== e.code;
            })
            this.keysPressed = newKeysPressed;
        }
        console.log(this.keysPressed);
        console.log(e.which);
    }

    includes(key: string) {
        const index = this.keysPressed.indexOf(key);
        if (index >= 0) {
            return true;
        }
        return false;
    }

    equals = (keysQuery: any) => {
        const keys = this.keysPressed;
        let key;
        let queryKey;
        if (keys.length === keysQuery.length) {
            for (let i = 0; i < keysQuery.length; i++) {
                key = keys[i];
                queryKey = keysQuery[i];
                if (key !== queryKey) {
                    return false
                }
            }
        } else {
            return false;
        }
            
        return true;
    }
}

// module.exports = {
//     Keypress
// }