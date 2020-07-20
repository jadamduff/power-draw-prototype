import Point from "./Point";

export function fixDpi(canvasElement: any, width: number, height: number, context: any) {
    let dpi = window.devicePixelRatio;

    canvasElement.setAttribute('width', width * dpi);
    canvasElement.setAttribute('height', height * dpi);
    canvasElement.style.width = width + "px";
    canvasElement.style.height = height + "px";

    context.scale(dpi, dpi);
}

export function hexToRGB(hex: string) {
    var c: any;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c = hex.substring(1).split('');
            if(c.length === 3){
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x'+c.join('');
            return {r: (c >> 16)&255, g: (c >> 8)&255, b: c & 255};
        }
        throw new Error('Bad Hex');
}

export function sanitizeHex(hex: string) {
    if (hex.length > 7 || hex.length < 6) {
        return "#000000";
    } else if (hex.length === 7) {
        const strippedHex = hex.slice(1, hex.length);
        if (noSpecialOrSpaces(strippedHex)) {
            return hex.toUpperCase();
        }
    } else if (hex.length === 6) {
        if (noSpecialOrSpaces(hex)) {
            const hexFormatted = "#" + hex;
            return hexFormatted.toUpperCase();
        } else {
            return "#000000";
        }
    }
}

export function noSpecialOrSpaces(string: string){
    return !/[~`!#$%\^&*+=\-\s\[\]\\';,/{}|\\":<>\?]/g.test(string);
   }

export function isAllNums(string: string) {
    for (let i = 0; i < string.length; i++) {
        if (/^\d+$/.test(string[i]) === false) {
            return false;
        }
    }
    return true;
}

//Randomly generated string. Chances of duplicate ids are about 1 in a trillion. But, could cause a minor bug if it happens.
export function makeId() {
    var text = "";
    var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 12; i++ ) {  
        text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }

    return text;
}

export function getMouseXY(e: any, boundings: any) { // Gets the mouse XY coordinates relative to the canvas element.
    const x = e.clientX - boundings.left;
    const y = e.clientY - boundings.top;
    return {x, y};
}

export function convertToAspectRatio(ratioA: number, ratioB: number, a: number, b: number) {
    const totalParts = ratioA + ratioB;
    const singleUnit = (a + b) / totalParts;
    return {
        a: singleUnit * ratioA,
        b: singleUnit * ratioB
    }
}

export function calcDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

export function incrementBorderWidth(borderWidth: number) {
    if (borderWidth > 0) {
        return borderWidth + 1;
    } else {
        return 0;
    }
}

export function calcXYAtDistance(startingX: number, startingY: number, distance: number, slope: number) {
    return {
        x: startingX + (distance * (Math.sqrt(1 / (1 + Math.pow(slope, 2))))),
        y: startingY + (slope * distance * (Math.sqrt(1 / (1 + Math.pow(slope, 2)))))
    }
}

export function calcSlope(x1: number, y1: number, x2: number, y2: number) {
    const slope = ((y2 - y1) / (x2 - x1));
    if (slope !== Infinity && slope !== -Infinity) {
        return slope;
    }
    return false;
}

export function calcDistSquared(x1: number, y1: number, x2: number, y2: number) {
    return Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)
}

export function distToSegment (px: number, py: number, ax: number, ay: number, bx: number, by: number) {
    const distAB = calcDistSquared(ax, ay, bx, by);
    if (distAB === 0) {return false};
    let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / distAB;
    t = Math.max(0, Math.min(1, t));
    const p2x = ax + t * (bx - ax);
    const p2y = ay + t * (by - ay);
    return [Math.sqrt(calcDistSquared(px, py, p2x, p2y)), {x: p2x, y: p2y}];
}

export function getBezierXY(t: number, ax: number, ay: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number, bx: number, by: number) {
    return {
      x: Math.pow(1-t,3) * ax + 3 * t * Math.pow(1 - t, 2) * cp1x 
        + 3 * t * t * (1 - t) * cp2x + t * t * t * bx,
      y: Math.pow(1-t,3) * ay + 3 * t * Math.pow(1 - t, 2) * cp1y 
        + 3 * t * t * (1 - t) * cp2y + t * t * t * by
    };
  }

export function getBezierMinMax(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    let tvalues = [], xvalues = [], yvalues = [],
        a, b, c, t, t1, t2, b2ac, sqrtb2ac;
    for (let i = 0; i < 2; ++i) {
        if (i == 0) {
            b = 6 * x0 - 12 * x1 + 6 * x2;
            a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
            c = 3 * x1 - 3 * x0;
        } else {
            b = 6 * y0 - 12 * y1 + 6 * y2;
            a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
            c = 3 * y1 - 3 * y0;
        }
        if (Math.abs(a) < 1e-12) {
            if (Math.abs(b) < 1e-12) {
                continue;
            }
            t = -c / b;
            if (0 < t && t < 1) {
                tvalues.push(t);
            }
            continue;
        }
        b2ac = b * b - 4 * c * a;
        if (b2ac < 0) {
            if (Math.abs(b2ac) < 1e-12) {
                t = -b / (2 * a);
                if (0 < t && t < 1) {
                    tvalues.push(t);
                }
            }
            continue;
        }
        sqrtb2ac = Math.sqrt(b2ac);
        t1 = (-b + sqrtb2ac) / (2 * a);
        if (0 < t1 && t1 < 1) {
            tvalues.push(t1);
        }
        t2 = (-b - sqrtb2ac) / (2 * a);
        if (0 < t2 && t2 < 1) {
            tvalues.push(t2);
        }
    }

    let j = tvalues.length, mt;
    while (j--) {
        t = tvalues[j];
        mt = 1 - t;
        xvalues[j] = (mt * mt * mt * x0) + (3 * mt * mt * t * x1) + (3 * mt * t * t * x2) + (t * t * t * x3);
        yvalues[j] = (mt * mt * mt * y0) + (3 * mt * mt * t * y1) + (3 * mt * t * t * y2) + (t * t * t * y3);
    }

    xvalues.push(x0,x3);
    yvalues.push(y0,y3);

    return {
        min: {x: Math.min.apply(0, xvalues), y: Math.min.apply(0, yvalues)},
        max: {x: Math.max.apply(0, xvalues), y: Math.max.apply(0, yvalues)}
    };
}

