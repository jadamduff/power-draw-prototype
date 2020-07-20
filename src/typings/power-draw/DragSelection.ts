export default class DragSelection {

    canvas: any;

    dragging: boolean;
    draggingCallback: any;

    initialXY: any;
    properties: any;

    fillRGBA: string;
    borderHex: string;
    borderWidth: number;

    constructor(canvas: any, draggingCallback: any) {
        this.canvas = canvas;

        this.dragging = false;
        this.draggingCallback = draggingCallback;

        this.initialXY = {
            x: null,
            y: null
        }

        this.properties = {
            x: null,
            y: null,
            width: null,
            height: null
        }

        this.fillRGBA = 'rgba(189, 189, 189, 0.06)';
        this.borderHex = '#BDBDBD';
        this.borderWidth = 1;
    }

    setInitialXY(x: number, y: number) {
        this.initialXY = {x, y};
    }

    clearInitialXY() {
        this.initialXY = {
            x: null,
            y: null
        }
    }

    clearProperties() {
        this.properties = {
            x: null,
            y: null,
            width: null,
            height: null
        }
    }

    resize(mx: number, my: number) {
        const { x, y } = this.initialXY;
        const props = this.properties;

        if (x < mx) {
            props.x = Math.floor(x);
            props.width = mx - Math.floor(x);
        } else if (x > mx) {
            props.x = Math.floor(mx);
            props.width = Math.floor(x - mx);
        }

        if (y < my) {
            props.y = Math.floor(y);
            props.height = Math.floor(my - y);
        } else if (y > my) {
            props.y = Math.floor(my);
            props.height = Math.floor(y - my);
        }
    }

    draw() {
        const { x, y, width, height } = this.properties;

        const ctx = this.canvas.getContext('2d');
        ctx.save();

        ctx.fillStyle = this.fillRGBA;
        ctx.fillRect(x, y, width, height);

        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderHex;
        ctx.strokeRect(x, y, width, height);

        ctx.restore();
    }

    // ------ Public Methods ------ //

    handleMouseDown(mx: number, my: number){
        this.dragging = true;
        this.setInitialXY(mx, my);
    }

    handleMouseMove(mx: number, my: number) {
        this.resize(mx, my);
        this.draggingCallback(this.properties);
    }

    handleMouseUp() {
        this.dragging = false;
        this.clearInitialXY();
        this.clearProperties();
    }
}