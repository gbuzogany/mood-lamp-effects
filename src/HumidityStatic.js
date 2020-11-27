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
            [250, 211, 128],
            [246, 215, 176],
            [155, 198, 146],
            [46, 113, 8]
        ];

    }


    getBoundaries = (targetValue) => {
        var humidities;
        var colors;

        if (targetValue < 45) {
            humidities = [0, 45];
            colors = [this.colors[0], this.colors[1]];
        } else if (targetValue < 60) {
            humidities = [45, 60];
            colors = [this.colors[1], this.colors[2]];
        } else {
            humidities = [60, 100];
            colors = [this.colors[2], this.colors[3]];
        }

        return {'humidities':humidities, 'colors':colors};
    }

    getColorDelta(ratio, range, colorIndex) {
        var colorRange = range[1][colorIndex] - range[0][colorIndex];
        var colorDelta = ratio * colorRange;
        return colorDelta;
    }

    computeDelta = (humidity, ranges) => {
        var ratio = (humidity - ranges.humidities[0]) / (ranges.humidities[1] - ranges.humidities[0]);
        var deltaR = this.getColorDelta(ratio, ranges.colors, 0);
        var deltaG = this.getColorDelta(ratio, ranges.colors, 1);
        var deltaB = this.getColorDelta(ratio, ranges.colors, 2);

        return [deltaR, deltaG, deltaB];
    }


    getRGB = (humidity, ranges) => {
        var deltaRGB = this.computeDelta(humidity, ranges);
        var r = ranges.colors[0][0] + deltaRGB[0];
        var g = ranges.colors[0][1] + deltaRGB[1];
        var b = ranges.colors[0][2] + deltaRGB[2];

        return [r, g, b];

    }

    preprocess() {
        var hum = this.uniforms['humidity'].value;
        var ranges = this.getBoundaries(hum);
        this.RGB = this.getRGB(hum, ranges);

    }


    renderPixel(x, y) {
	    var color = this.RGB;

    	return color;
    }
}

export default TestEffect;