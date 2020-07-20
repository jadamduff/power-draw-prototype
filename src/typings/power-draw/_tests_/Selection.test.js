import Selection from '../Selection.ts';
import Rectangle from '../Rectangle.ts';

const canvasElement = "<canvas></canvas>";
const selectionCallback = jest.fn();
const deselectionCallback = jest.fn();

describe('Selecting and deselecting items', () => {

    let selection;
    const rectangle1 = new Rectangle(30, 40, 300, 200, "#ffffff", "rgb(255,255,255)", "#000000", "rgb(0,0,0)", 2, canvasElement);
    const rectangle2 = new Rectangle(80, 90, 400, 200, "#ffffff", "rgb(255,255,255)", "#000000", "rgb(0,0,0)", 2, canvasElement);
    const rectangle3 = new Rectangle(20, 80, 10, 200, "#ffffff", "rgb(255,255,255)", "#000000", "rgb(0,0,0)", 2, canvasElement);
    const rectangle4 = new Rectangle(60, 40, 30, 200, "#ffffff", "rgb(255,255,255)", "#000000", "rgb(0,0,0)", 2, canvasElement);

    describe('Selecting items', () => {
        
        beforeEach(() => {
            selection = new Selection(canvasElement, selectionCallback, deselectionCallback);
        })

        test('selectSingleItem() adds an item to emty selectionList', () => {
            selection.selectSingleItem(rectangle1);
            expect(selection.selectionList).toContain(rectangle1);
            expect(selection.selectionList.length).toEqual(1);
        })

        test('selectSingleItem() replaces items in selectionList with a single selected item', () => {
            
            selection.selectionList = [rectangle1, rectangle2, rectangle3];
            selection.selectSingleItem(rectangle4);
            expect(selection.selectionList).toContain(rectangle4);
            expect(selection.selectionList.length).toEqual(1);
        })

        test('addItemToSelection() adds an item to an empty selectionList', () => {
            selection.addItemToSelection(rectangle1);
            expect(selection.selectionList).toContain(rectangle1);
            expect(selection.selectionList.length).toEqual(1);
        })

        test('addItemToSelection(0 adds an item to a selectionList that already has items selected', () => {
            selection.selectionList = [rectangle1, rectangle2, rectangle3];
            selection.addItemToSelection(rectangle4);
            expect(selection.selectionList).toContain(rectangle4);
            expect(selection.selectionList.length).toEqual(4);
        })

    })

    describe('Deselecting Items', () => {

        beforeEach(() => {
            selection = new Selection(canvasElement, selectionCallback, deselectionCallback);
        })

        test('deselectAll() deselects removes one item from selectionList', () => {
            selection.selectionList = [rectangle1];
            selection.deselectAll();
            expect(selection.selectionList).not.toContain(rectangle1);
            expect(selection.selectionList.length).toEqual(0);
        })
        
        test('deselectAll() removes multiple items from selectionList', () => {
            selection.selectionList = [rectangle1, rectangle2];
            selection.deselectAll();
            expect(selection.selectionList).not.toContain(rectangle1);
            expect(selection.selectionList).not.toContain(rectangle2);
            expect(selection.selectionList.length).toEqual(0);
        })

        test('deselectItem() removes one item from selectionList', () => {
            selection.selectionList = [rectangle1];
            selection.deselectItem(rectangle1);
            expect(selection.selectionList).not.toContain(rectangle1);
            expect(selection.selectionList.length).toEqual(0);
        })

        test('deslectItem() removes one item from a selectionList with multiple items', () => {
            selection.selectionList = [rectangle1, rectangle2, rectangle3];
            selection.deselectItem(rectangle2);
            expect(selection.selectionList).not.toContain(rectangle2);
            expect(selection.selectionList).toContain(rectangle1);
            expect(selection.selectionList).toContain(rectangle3);
            expect(selection.selectionList.length).toEqual(2);
        })
    })
});

describe('Describing the selection', () => {
    
    let selection;
    const rectangle1 = new Rectangle(30, 40, 300, 200, "#ffffff", "rgb(255,255,255)", "#000000", "rgb(0,0,0)", 2, canvasElement);
    const rectangle2 = new Rectangle(80, 90, 400, 200, "#ffffff", "rgb(255,255,255)", "#000000", "rgb(0,0,0)", 2, canvasElement);
    const rectangle3 = new Rectangle(20, 80, 10, 200, "#ffffff", "rgb(255,255,255)", "#000000", "rgb(0,0,0)", 2, canvasElement);

    beforeEach(() => {
        selection = new Selection(canvasElement, selectionCallback, deselectionCallback);
    })

    test('hasItems() returns true when an item or items are selected', () => {
        selection.selectionList = [rectangle1, rectangle2, rectangle3];
        expect(selection.hasItems()).toBeTruthy();
    });

    test('hasItems() returns false when no items are selected', () => {
        selection.selectionList = [];
        expect(selection.hasItems()).toBeFalsy();
    });

    test('inlcludes() returns true when selectionList includes the given item', () => {
        selection.selectionList = [rectangle1, rectangle2, rectangle3];
        expect(selection.includes(rectangle3)).toBeTruthy();
    })

    test('includes() returns flase when selectionList does NOT include the given item', () => {
        selection.selectionList = [rectangle1, rectangle2];
        expect(selection.includes(rectangle3)).toBeFalsy();
    })

})