import Uniform from './Uniform'

class Effect {
    constructor() {
		this.uniforms = {
			"time" : new Uniform()
		};
    }

    setUniforms(uniforms) {
    	for (var entry in uniforms) {
    		if (entry in this.uniforms) {
    			this.uniforms[entry].setValue(uniforms[entry]);
    		}
    	}
    }

    smoothStep(x) {
        return -2 * Math.pow(x, 3) + 3 * Math.pow(x, 2);
    }

    getColorDelta(ratio, range, colorIndex) {
        var colorRange = range[1][colorIndex] - range[0][colorIndex];
        var colorDelta = this.smoothStep(ratio) * colorRange;
        return colorDelta;
    }

    computeDelta = (ratio, colorRange) => {
        // var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
        var deltaR = this.getColorDelta(ratio, colorRange, 0);
        var deltaG = this.getColorDelta(ratio, colorRange, 1);
        var deltaB = this.getColorDelta(ratio, colorRange, 2);
        return [deltaR, deltaG, deltaB];
    }


    getRGB = (ratio, colorRange) => {
        var deltaRGB = this.computeDelta(ratio, colorRange);
        var r = Math.floor(colorRange[0][0] + deltaRGB[0]);
        var g = Math.floor(colorRange[0][1] + deltaRGB[1]);
        var b = Math.floor(colorRange[0][2] + deltaRGB[2]);
        return [r, g, b];

    }
    
    HSVtoRGB(h, s, v) {
	    var r, g, b, i, f, p, q, t;
	    if (s === undefined && v === undefined) {
	        s = h.s;
	        v = h.v;
	        h = h.h;
	    }
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	        case 0: r = v; g = t; b = p; break;
	        case 1: r = q; g = v; b = p; break;
	        case 2: r = p; g = v; b = t; break;
	        case 3: r = p; g = q; b = v; break;
	        case 4: r = t; g = p; b = v; break;
	        case 5: r = v; g = p; b = q; break;
	        default: break;
	    }
	    return {
	        r: Math.round(r * 255),
	        g: Math.round(g * 255),
	        b: Math.round(b * 255)
	    };
	}

    preprocess() {

    }

    renderPixel(x, y) {
    	return [0, 0, 0];
    }
}

export default Effect;
