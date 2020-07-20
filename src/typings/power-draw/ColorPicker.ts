import { hexToRGB } from './utils';

export default class ColorPicker {
    itemToColor: any;
    
    singleColorContainerId: string;
    multiColorContainerId: string;

    singleColorContainer: any;
    singleColorCanvas: any;
    singleColorContext: any;
    singleColorBoundings: any;
    singleColorPixels: any;
    singleColorValid: boolean;

    multiColorContainer: any;
    multiColorCanvas: any;
    multiColorContext: any;
    multiColorXRatio: any;
    multiColorValid: boolean;
    multiColorBoundings: any;

    colorClickCallback: any;

    constructor(itemToColor: any, singleColorContainerId: string, multiColorContainerId: string, colorClickCallback: any) {
        this.itemToColor = itemToColor;
        
        this.singleColorContainerId = singleColorContainerId;
        this.multiColorContainerId = multiColorContainerId;
        this.colorClickCallback = colorClickCallback;

        this.multiColorXRatio = 0.0;

        this.singleColorValid = true;
        this.multiColorValid = true;

        this.renderSingleColorCanvas();
        this.renderMultiColorCanvas();
        this.createSingleColorGradient(false);
        this.createMultiColorGradient();
        this.setSingleColorSelector();
        this.setEventListeners();
    }

    renderSingleColorCanvas() {
        this.singleColorContainer = document.getElementById(this.singleColorContainerId);
        this.singleColorContainer.innerHTML = `<canvas width="${this.singleColorContainer.offsetWidth}" height="${this.singleColorContainer.offsetHeight}" id="${this.singleColorContainerId + "-canvas"}"></canvas>`;
        this.singleColorCanvas = document.getElementById(this.singleColorContainerId + "-canvas");
        this.singleColorContext = this.singleColorCanvas.getContext('2d');
        this.singleColorBoundings = this.singleColorCanvas.getBoundingClientRect();

        window.addEventListener('click', (e) => this.getColorFromPixel(e));
    }

    renderMultiColorCanvas() {
        this.multiColorContainer = document.getElementById(this.multiColorContainerId);
        this.multiColorContainer.innerHTML = `<canvas width="${this.multiColorContainer.offsetWidth}" height="${this.multiColorContainer.offsetHeight}" id="${this.multiColorContainerId + "-canvas"}"></canvas>`;
        this.multiColorCanvas = document.getElementById(this.multiColorContainerId + "-canvas");
        this.multiColorContext = this.multiColorCanvas.getContext('2d');
        this.multiColorBoundings = this.multiColorCanvas.getBoundingClientRect();
    }

    createSingleColorGradient(color: any) {
        this.singleColorContext.clearRect(0, 0, this.singleColorCanvas.width, this.singleColorCanvas.height);
  
        if (!color) color = '#f00'
        this.singleColorContext.fillStyle = color;
        this.singleColorContext.fillRect(0, 0, this.singleColorCanvas.width, this.singleColorCanvas.height);

        var whiteGradient = this.singleColorContext.createLinearGradient(0, 0, this.singleColorCanvas.width, 0);
        whiteGradient.addColorStop(0, "#fff");
        whiteGradient.addColorStop(1, "transparent");
        this.singleColorContext.fillStyle = whiteGradient;
        this.singleColorContext.fillRect(0, 0, this.singleColorCanvas.width, this.singleColorCanvas.height);

        var blackGradient = this.singleColorContext.createLinearGradient(0, 0, 0, this.singleColorCanvas.height);
        blackGradient.addColorStop(0, "transparent");
        blackGradient.addColorStop(1, "#000");
        this.singleColorContext.fillStyle = blackGradient;
        this.singleColorContext.fillRect(0, 0, this.singleColorCanvas.width, this.singleColorCanvas.height);

        //true white
        let imgData = this.singleColorContext.getImageData(0, 0, this.singleColorBoundings.width, this.singleColorBoundings.height);
        let blackOffset = imgData.data.length - 1 - this.singleColorBoundings.width * 4;
        let colorOffset = (this.singleColorBoundings.width * 4) - 1;
        const colorRGB: any = hexToRGB(color);
        for (let i = 0; i < imgData.data.length; i++) {
            if (i === 0 || i === 1 || i === 2) {
                imgData.data[i] = 255;
            } else if (i === blackOffset || i == blackOffset + 1 || i === blackOffset + 2) {
                imgData.data[i] = 0;
            }  
        }
        this.singleColorContext.putImageData(imgData, 0, 0);

        this.singleColorPixels = this.getPixelData(this.singleColorContext, this.singleColorBoundings);
    }


    createMultiColorGradient() {
        const hueGradient = this.multiColorContext.createLinearGradient(0, 0, this.multiColorCanvas.width, 0);
        
        hueGradient.addColorStop(0.00, "#ff0000");
        hueGradient.addColorStop(0.17, "#ff00ff");
        hueGradient.addColorStop(0.33, "#0000ff");
        hueGradient.addColorStop(0.50, "#00ffff");
        hueGradient.addColorStop(0.67, "#00ff00");
        hueGradient.addColorStop(0.83, "#ffff00");
        hueGradient.addColorStop(1.00, "#ff0000");

        this.multiColorContext.fillStyle = hueGradient;
        this.multiColorContext.fillRect(0, 0, this.multiColorCanvas.width, this.multiColorCanvas.height);
    }

    setSingleColorSelector() {
        const colorCoords = this.getColorCoords(hexToRGB(this.itemToColor.fillHex))
        if(colorCoords) {
            this.renderSingleColorSelector(colorCoords.x, colorCoords.y);
        }
    }

    renderSingleColorSelector(x: number, y: number) {
        const ctx = this.singleColorContext;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "rgb(0, 0, 0, 1.0)";
        ctx.shadowBlur = 1;   
        ctx.stroke();
    }

    // Color must be an object {r: 255, g: 255, b: 255}
    getColorCoords(color: any) {
        for (let i = 0; i < this.singleColorPixels.length; i++) {
            console.log(i, this.singleColorPixels);
            for (let j = 0; j < this.singleColorPixels[i].length; j++) {
                if (this.singleColorPixels[i][j][0] === color.r && this.singleColorPixels[i][j][1] === color.g && this.singleColorPixels[i][j][2] === color.b) {
                    return {x: j, y: i};
                }
            }
        }
        return false
    }

    getColorFromPixel(e: any) {
        const x: number = e.clientX;
        const y: number = e.clientY;
        const imgData = this.singleColorContext.getImageData(0, 0, this.singleColorBoundings.width, this.singleColorBoundings.height);
        const width = imgData.width;

        var redValueForPixel = ((y - 1) * (width * 4)) + ((x - 1) * 4);
    }

    getPixelData(context: any, boundings: any) {
        const imgData = context.getImageData(0, 0, boundings.width, boundings.height);
        let numPixels = imgData.data.length / 4;
        let pixelArr = [];
        let pixelRow = [];
        let pixel: any = [];
        for (let i = 0; i < numPixels; i++) {
            for (let j = 0; j < 4; j++) {
                pixel.push(imgData.data[(i * 4) + j]);
            }
            pixelRow.push(pixel);
            if (pixelRow.length === this.singleColorBoundings.width) {
                pixelArr.push(pixelRow);
                pixelRow = [];
            }
            pixel = [];
        }
        return pixelArr;
    }

    setEventListeners() {
        this.singleColorCanvas.addEventListener('click', (e: any) => {
            const boundings = e.target.getBoundingClientRect();
            const clickX = e.clientX - boundings.left;
            const clickY = e.clientY - boundings.top;
        })
    }

}