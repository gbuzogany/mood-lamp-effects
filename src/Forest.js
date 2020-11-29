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
            [44, 112, 116],
            [61, 124, 119],
            [76, 133, 121],
            [98, 151, 125],
            [147, 172, 131],
            [176, 183, 131]
        ];

        this.currentIndex = 0;
        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        //fixed speed for this effect
        this.speed = 4;
        this.timeSpeed = 0.0;
        this.ranges = this.getBoundaries();
    }

    getBoundaries = () => {
        var colors;

        if (this.currentIndex === 0) {
            colors = [this.colors[this.colors.length - 1], this.colors[this.currentIndex]];
        } else {
            colors = [this.colors[this.currentIndex - 1], this.colors[this.currentIndex]];
        }

        return {'colors':colors};
    }

    getColorDelta(ratio, range, colorIndex) {
        var colorRange = range[1][colorIndex] - range[0][colorIndex];
        var colorDelta = ratio * colorRange;
        return colorDelta;
    }

    computeDelta = (ranges) => {
        var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
        var deltaR = this.getColorDelta(ratio, ranges.colors, 0);
        var deltaG = this.getColorDelta(ratio, ranges.colors, 1);
        var deltaB = this.getColorDelta(ratio, ranges.colors, 2);
        return [deltaR, deltaG, deltaB];
    }


    getRGB = () => {
        var ranges = this.ranges;
        var deltaRGB = this.computeDelta(ranges);
        var r = Math.floor(ranges.colors[0][0] + deltaRGB[0]);
        var g = Math.floor(ranges.colors[0][1] + deltaRGB[1]);
        var b = Math.floor(ranges.colors[0][2] + deltaRGB[2]);

        return [r, g, b];

    }

    preprocess() {
        var currentTime = this.uniforms['time'].value;

        if (currentTime !== undefined) {
            // compute color for this frame
            this.RGB = this.getRGB();

            // update time counter
            var deltaTime = currentTime - this.initialTime;
            this.initialTime = currentTime;
            this.timeSpeed += deltaTime * this.speed/50000;

            // update currentIndex and ranges
            this.currentIndex = Math.floor((this.timeSpeed) % (this.colors.length));
            this.ranges = this.getBoundaries();
        } 
        else {
            this.RGB = this.colors[this.currentIndex];
        }
    }


    renderPixel(x, y) {
        var color = this.RGB;

        return color;
    }
}

export default TestEffect;