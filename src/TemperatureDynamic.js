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


    getTempBoundaries = (targetValue) => {
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

    computeDeltaFromVal = (temperature, ranges) => {
        var ratio = (temperature - ranges.temperatures[0]) / (ranges.temperatures[1] - ranges.temperatures[0]);
        var deltaR = this.getColorDelta(ratio, ranges.colors, 0);
        var deltaG = this.getColorDelta(ratio, ranges.colors, 1);
        var deltaB = this.getColorDelta(ratio, ranges.colors, 2);

        return [deltaR, deltaG, deltaB];
    }


    getRGBFromVal = (temperature, ranges) => {
        var deltaRGB = this.computeDeltaFromVal(temperature, ranges);
        var r = ranges.colors[0][0] + deltaRGB[0];
        var g = ranges.colors[0][1] + deltaRGB[1];
        var b = ranges.colors[0][2] + deltaRGB[2];

        return [r, g, b];

    }

    preprocess() {
        var temp = this.uniforms['temperature'].value;
        var ranges = this.getTempBoundaries(temp);
        this.RGB = this.getRGBFromVal(temp, ranges);
        this.pulsation = 2*(1 - (Math.sin(this.uniforms['time'].value/1500 % Math.PI/2))) - 0.5;
    }


    renderPixel(x, y) {
        var color = this.RGB;
        var band = 0.3;

        if (y > 200*(this.pulsation - band) && y < 200*this.pulsation) {
            var alpha = 250*(Math.abs(this.pulsation - band - y/200));

            color = [
                alpha+this.RGB[0],
                alpha+this.RGB[1],
                alpha+this.RGB[2]
            ]
        } else if (y < 200*(this.pulsation+band) && y > 200*this.pulsation) {
            var beta = 250*(Math.abs(this.pulsation + band - y/200));

            color = [
                beta+this.RGB[0],
                beta+this.RGB[1],
                beta+this.RGB[2]
            ]
        }

        return color;
    }
}

export default TestEffect;