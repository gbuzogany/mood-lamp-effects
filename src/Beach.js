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
        this.colorsTop = [
            [239, 173, 81],
            [245, 224, 183],
            [198, 169, 144]
        ];
        this.colorArrayMaxTop = 1;
        this.colorsRangeTop = [this.colorsTop[0], this.colorsTop[1]];
        this.RGBTop = this.colorsTop[0];

        this.colorsBottom = [
            [36, 150, 174],
            [71, 183, 203],
            [101, 205, 213]
        ];

        this.currentPulse = 0;
        this.previousPulse = 0;

        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
    }


    getRandomIndex() {
        var random = Math.floor(Math.random() * this.colorsTop.length);
        if (random === this.colorArrayMaxTop) {
            if (random === this.colorsTop.length - 1) {
                random = 0;
            } else {
                random += 1;
            }
        }

        this.colorsRangeTop = [this.colorsTop[this.colorArrayMaxTop], this.colorsTop[random]];
        this.colorArrayMaxTop = random;
    }


    getBoundaries = () => {
        if (this.currentPulse !== this.previousPulse) {
            this.getRandomIndex();
            this.previousPulse = this.currentPulse;
        };

    }

    getSlidingRatioAndRange = (colors, y, incr) => {
        var output = ((colors.length / 200) * y + incr) % colors.length;
        var colorMinIndex = Math.floor(output);
        var colorMaxIndex = (colorMinIndex + 1) % colors.length;
        var colorsRange = [colors[colorMinIndex], colors[colorMaxIndex]];
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
            this.timeSpeed += deltaTime * speed/50000;

            // update currentPulse and ranges
            var minLength = Math.min(this.colorsTop.length, this.colorsBottom.length);
            this.currentPulse = Math.floor((this.timeSpeed) % minLength);
            this.getBoundaries();


            // compute the two RGB colors
            var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
            this.colorsRange = this.colorsRangeTop;
            this.RGBTop = this.getRGB(ratio, this.colorsRangeTop);
        }  else {
            this.RGBTop = this.colorsRangeTop[this.currentPulse];
        }

    }


    renderPixel(x, y) {

        var color;

        if (y > 100) {
            // color = this.RGBBottom;
            var [ratio, colorsRange] = this.getSlidingRatioAndRange(this.colorsBottom, y + 30*Math.sin(x/20 + this.timeSpeed*20), this.timeSpeed);
            color = this.getRGB(ratio, colorsRange);
        } else {
            color = this.RGBTop;
        }

        return color;
    }
}

export default TestEffect;