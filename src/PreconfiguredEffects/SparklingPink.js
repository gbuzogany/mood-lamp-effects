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
 
        this.colors = [
            [216, 116, 162],
            [186, 105, 128],
            [234, 203, 195],
            [223, 197, 200],
            [214, 175, 177],
            [234, 111, 124],
            [234, 175, 173]
        ]

        this.currentIndex = 0;
        this.previousPulse = 0;
        this.colorArrayMax = 1;
        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
        this.RGB = this.colors[0];
        this.colorsRange = [this.colors[0], this.colors[1]];
        this.speed = 5;
    }

    preprocess() {
        var currentTime = this.uniforms['time'].value;
        // console.log(this.colorsRange[0])
        if (currentTime === undefined) {
            currentTime = 0;
        } else {
            // compute color for this frame
            var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
            this.RGB = this.getRGB(ratio, this.colorsRange);

            // update time counter
            var deltaTime = currentTime - this.initialTime;
            this.initialTime = currentTime;
            var speed = this.uniforms['speed'].value;
            this.timeSpeed += deltaTime * speed/50000;

            // update currentIndex and ranges
            this.currentIndex = Math.floor((this.timeSpeed) % (this.colors.length));
            var colorNextIndex = (this.currentIndex + 1) % this.colors.length;
            this.colorsRange = [this.colors[this.currentIndex], this.colors[colorNextIndex]];

        } 
    }

    getSlidingRatioAndRange = (colors, y, incr) => {
        var output = ((colors.length / 200) * y + incr) % colors.length;
        var colorMinIndex = Math.abs(Math.floor(output));
        var colorMaxIndex = (colorMinIndex + 1) % colors.length;
        var colorsRange = [colors[colorMinIndex], colors[colorMaxIndex]];
        var ratio = output - colorMinIndex;

        return [ratio, colorsRange];
    }



    renderPixel(x, y) {
        var [ratio, colorsRange] = this.getSlidingRatioAndRange(
            [this.RGB, this.colors[1]], 
            y + y * Math.sin(x/20 + this.timeSpeed*20), 
            this.timeSpeed
        );

        var color = this.getRGB(ratio, colorsRange);
        
        return color;
    }
}

export default TestEffect;