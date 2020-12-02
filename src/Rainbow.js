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
        this.uniforms['speed'] = new Uniform(10, 1, 100, 1);
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

        this.sat = 0.5;
        this.val = 0.9;
        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
        this.speed=20;

    }

    getHue = (y, incr) => {
        var hue = y + incr;
        return hue/800;
    }

    preprocess() {

        var currentTime = this.uniforms['time'].value;

        if (currentTime === undefined) {
            currentTime = 0;
        } 

        // update time counter
        var deltaTime = currentTime - this.initialTime;
        this.initialTime = currentTime;
        this.timeSpeed += deltaTime * this.speed/500;


    }

    renderPixel(x, y) {
        var hue = this.getHue(y + (15+Math.sin(x/10))*Math.sin(x/25 + this.timeSpeed/100), this.timeSpeed);

        var color = this.HSVtoRGB(hue, this.sat, this.val);
        color = [color['r'], color['g'], color['b']];

        return color;
    }
}

export default TestEffect;