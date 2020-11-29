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
            [253, 184, 19],
            [253, 228, 132],
            [178, 202, 237],
            [117, 174, 220]
        ];

        this.currentPulse = 0;
        this.previousPulse = 0;
        this.colorArrayMax = 1;
        this.colorsRange = [this.colors[0], this.colors[1]];

        this.RGB = this.colors[0];
        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
    }

    getBoundaries = () => {
        if (this.currentPulse !== this.previousPulse) {
            var random = Math.floor(Math.random() * this.colors.length);
            if (random === this.colorArrayMax) {
                if (random === this.colors.length - 1) {
                    random = 0;
                } else {
                    random += 1;
                }
            }

            this.colorsRange= [this.colors[this.colorArrayMax], this.colors[random]];
            this.colorArrayMax = random;
            this.previousPulse = this.currentPulse;
        };

    }

    getColorDelta(ratio, range, colorIndex) {
        var colorRange = range[1][colorIndex] - range[0][colorIndex];
        var colorDelta = ratio * colorRange;
        return colorDelta;
    }

    computeDelta = (ranges) => {
        var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
        var deltaR = this.getColorDelta(ratio, ranges, 0);
        var deltaG = this.getColorDelta(ratio, ranges, 1);
        var deltaB = this.getColorDelta(ratio, ranges, 2);
        return [deltaR, deltaG, deltaB];
    }


    getRGB = () => {
        var ranges = this.colorsRange;
        var deltaRGB = this.computeDelta(ranges);
        var r = Math.floor(ranges[0][0] + deltaRGB[0]);
        var g = Math.floor(ranges[0][1] + deltaRGB[1]);
        var b = Math.floor(ranges[0][2] + deltaRGB[2]);

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
            var speed = this.uniforms['speed'].value;
            this.timeSpeed += deltaTime * speed/50000;

            // update currentIndex and ranges
            this.currentPulse = Math.floor((this.timeSpeed) % (this.colors.length));
            this.getBoundaries();
        } 
        else {
            this.RGB = this.colors[this.currentPulse];
        }
    }


    renderPixel(x, y) {
        var color = this.RGB;

        return color;
    }
}

export default TestEffect;