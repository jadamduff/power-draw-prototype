import Keypress from '../Keypress.ts';

describe('event listeners', () => {
    const keypress = new Keypress();
    const e = {
        code: "KeyA"
    }
    
    test('handleKeyPress adds name of key to keysPressed array', () => {
        keypress.handleKeydown(e);
        expect(keypress.keysPressed).toContain("KeyA");
    });

    test('handleKeyup removes name of key from keysPressed array', () => {
        keypress.handleKeyup(e);
        expect(keypress.keysPressed).not.toContain("KeyA");
    })
});

describe('includes function', () => {
    test('returns true when keysPressed contains a "KeyB"', () => {
        const keypress = new Keypress();
        keypress.keysPressed = ["KeyB"];
        expect(keypress.includes("KeyB")).toBeTruthy();
    })

    test('returns false when keysPressed does not contain "KeyB"', () => {
        const keypress = new Keypress();
        keypress.keysPressed = ["KeyC"];
        expect(keypress.includes("KeyB")).toBeFalsy();
    })

    test('returns false when keysPressed is empty', () => {
        const keypress = new Keypress();
        keypress.keysPressed = [];
        expect(keypress.includes("KeyB")).toBeFalsy();
    })
})
    