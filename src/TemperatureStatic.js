import Effect from './Effect'
import Uniform from './Uniform'

class TestEffect extends Effect {
    constructor(scene) {
        super();
        this.scene = scene;
        this.uniforms['temperature'] = new Uniform(20, 0, 50, 0.1);
        this.uniforms['humidity'] = new Uniform(60, 0, 100, 0.1);
        this.uniforms['pressure'] = new Uniform(1012, 980, 1025, 0.1);
        this.uniforms['light'] = new Uniform(160, 0, 750, 1.0);
        this.uniforms['hour'] = new Uniform(15, 0, 23, 0.1);
        this.uniforms['fft'] = new Uniform([]);

    	var layers = 5;
    	var y = 200 / (layers - 2) / 2;
    	var deltaY = 200 / layers;

    	// 1 on the top
    	// this.scene.addSpacedPixelSamples(y, 1);
    	// y = 200 / layers / 2;
    	// y += deltaY;

    	// 6
    	this.scene.addSpacedPixelSamples(y, 6);
    	y += deltaY;

    	// 8
    	this.scene.addSpacedPixelSamples(y, 8);
    	y += deltaY;

    	// 8
    	this.scene.addSpacedPixelSamples(y, 8);
    	y += deltaY;

    	// 6
    	this.scene.addSpacedPixelSamples(y, 6);
    	y += deltaY;

        //initial base colours
        this.colors = [
            [253, 184, 19],
            [253, 228, 132],
            [178, 202, 237],
            [117, 174, 220]
        ];

    }


    getBoundaries = (targetValue) => {
        var temperatures;
        var colors;

        if (targetValue < 20) {
            temperatures = [0, 20];
            colors = [this.colors[0], this.colors[1]];
        } else if (targetValue < 22) {
            temperatures = [20, 22];
            colors = [this.colors[1], this.colors[2]];
        } else {
            temperatures = [22, 50];
            colors = [this.colors[2], this.colors[3]];
        }
        return {'temperatures':temperatures, 'colors':colors};
    }

    getColorDelta(ratio, range, colorIndex) {
        var colorRange = range[1][colorIndex] - range[0][colorIndex];
        var colorDelta = ratio * colorRange;
        return colorDelta;
    }

    computeDelta = (temperature, ranges) => {
        var ratio = (temperature - ranges.temperatures[0]) / (ranges.temperatures[1] - ranges.temperatures[0]);
        var deltaR = this.getColorDelta(ratio, ranges.colors, 0);
        var deltaG = this.getColorDelta(ratio, ranges.colors, 1);
        var deltaB = this.getColorDelta(ratio, ranges.colors, 2);

        return [deltaR, deltaG, deltaB];
    }


    getRGB = (temperature, ranges) => {
        var deltaRGB = this.computeDelta(temperature, ranges);
        var r = ranges.colors[0][0] + deltaRGB[0];
        var g = ranges.colors[0][1] + deltaRGB[1];
        var b = ranges.colors[0][2] + deltaRGB[2];

        return [r, g, b];

    }

    preprocess() {
        var temp = this.uniforms['temperature'].value;
        var ranges = this.getBoundaries(temp);
        this.RGB = this.getRGB(temp, ranges);

    }


    renderPixel(x, y) {
	    var color = this.RGB;

    	// color = [
    	// 	125, 
    	// 	125,
    	// 	125
    	// ]

    	return color;
    }
}

export default TestEffect;