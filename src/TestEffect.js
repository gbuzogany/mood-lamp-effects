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

    renderPixel(x, y) {
    	// debugger;
    	var ts = this.uniforms['time'].value || 0;
    	var v = Math.sin(x/200*Math.PI) * ((ts % 1000) / 1000);
    	return [v * 255, 0, 0];
    }
}

export default TestEffect;