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
    	this.scene.addSpacedPixelSamples(y, 1);
    	y = 200 / layers / 2;
    	y += deltaY;

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
    }

    preprocess() {
    	var min = 999999;
    	var max = -999999;

    	for (var i in this.uniforms['fft'].value) {
    		if (this.uniforms['fft'].value[i] < min) {
    			min = this.uniforms['fft'].value[i];
    		}
    		if (this.uniforms['fft'].value[i] > max) {
    			max = this.uniforms['fft'].value[i];
    		}
    	}
    	this.min = min;
    	this.max = max;

    	var sum = 0;
    	for (var i in this.uniforms['fft'].value) {
    		sum += ((this.uniforms['fft'].value[i] - this.min) / ((this.max - this.min) + 1));
    	}
    	this.mean = sum/this.uniforms['fft'].value.length;
    }

    renderPixel(x, y) {
	    var color;
    	var input = this.uniforms['fft'].value[x];
	    var val = ((input - this.min) / ((this.max - this.min) + 1));
	    // var t = (Math.sin(this.uniforms['time'].value/20000)+1)/2;

	    // val = this.HSVtoRGB(1.0, 1, this.mean/0.5);
    	color = [
    		val * 255, //this.band1 / 10.0 * 255,
    		val * 255, //this.band2 / 10.0 * 255,
    		val * 255
    	]

    	return color;
    }
}

export default TestEffect;