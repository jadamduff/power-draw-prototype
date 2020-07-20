import { throws } from "assert";

export default class ControlPoint {
    active: boolean;

    x?: number;
    y?: number;

    percentWidth?: number;
    percentHeight?: number;

    constructor(active: boolean, x?: number, y?: number, percentWidth?: number, percentHeight?: number) {
        this.active = active;
        if (active) {
            this.x = x;
            this.y = y;
            this.percentWidth = percentWidth;
            this.percentHeight = percentHeight;
        }
    }

    setXByWidth(startingX: number, width: number) {
        if (this.active) {
            this.x = startingX + (width * this.percentWidth!);
        }
    }

    setYByHeight(startingY: number, height: number) {
        if (this.active) {
            this.y = startingY + (height * this.percentHeight!);
        }
    }

    setXYByWidthHeight(startingX: number, width: number, startingY: number, height: number) {
        this.setXByWidth(startingX, width);
        this.setYByHeight(startingY, height);
    }

    setPercentWidthByX(startingX: number, newX: number, width: number) {
        this.x = newX;
        this.percentWidth = (newX - startingX) / width;
    }

    setPercentHeightByY(startingY: number, newY: number, height: number) {
        this.y = newY;
        this.percentHeight = (newY - startingY) / height;
    }

    setPercentWidth(startingX: number, width: number, percentWidth: number) {
        if (this.active) {
            this.percentWidth = percentWidth;
            this.setXByWidth(startingX, width);
        }
    }

    setPercentHeight(startingY: number, height: number, percentHeight: number) {
        if (this.active) {
            this.percentHeight = percentHeight;
            this.setYByHeight(startingY, height);
        }
    }

    setPercentWidthAndHeight(startingX: number, width: number, percentWidth: number, startingY: number, height: number, percentHeight: number) {
        this.setPercentWidth(startingX, width, percentWidth);
        this.setPercentHeight(startingY, height, percentHeight);
    }
}