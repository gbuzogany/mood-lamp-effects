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

        //initial base colours
        this.colorsInit = [
            [179, 60, 60],
            [179, 60, 60],
            [246, 232, 224],
            [48, 71, 115],
            [48, 71, 115],
            [246, 232, 224]
        ];
        this.colors = this.colorsInit;
        this.colorArrayMax = 1;

        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;

    }

    getSlidingRatioAndRange = (x, incr) => {
        var output = ((this.colors.length / 200) * x + incr) % this.colors.length;
        var colorMinIndex = Math.floor(output);
        var colorMaxIndex = (colorMinIndex + 1) % this.colors.length;
        var colorsRange = [this.colors[colorMinIndex], this.colors[colorMaxIndex]];
        var ratio = output - colorMinIndex;

        return [ratio, colorsRange];
    }

    preprocess() {

        var currentTime = this.uniforms['time'].value;

        if (currentTime !== undefined) {
            // update time counter
            var deltaTime = currentTime - this.initialTime;
            this.initialTime = currentTime;
            var speed = this.uniforms['speed'].value;
            this.timeSpeed += deltaTime * speed/10000;
        } 

    }

    renderPixel(x, y) {
        var color;
        var [ratio, colorsRange] = this.getSlidingRatioAndRange(x, this.timeSpeed);
        
        color = this.getRGB(ratio, colorsRange);

        return color;
    }
}

export default TestEffect;