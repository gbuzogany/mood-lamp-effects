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

        this.colorsBlue = [
            [31, 78, 116],
            [78, 107, 138],
            [119, 122, 143],
            [23, 83, 150]
        ]

        this.colorsGreen = [
            [185, 219, 202],
            [105, 182, 176],
            [120, 144, 85],
            [164, 188, 39]
        ]

        this.colorsSand = [
            [254, 243, 205],
            [237, 212, 185],
            [222, 185, 144],
            [191, 155, 117]
        ]

        this.colorsSun = [
            [252, 216, 130],
            [251, 178, 95],
            [246, 174, 44],
            [242, 100, 24],
            [240, 121, 62]
        ]
        this.colorArrayMaxSun = 1;
        this.colorsRangeSun = [this.colorsSun[0], this.colorsSun[1]];
        this.RGBSun = this.colorsSun[0];

        this.currentPulse = 0;
        this.previousPulse = 0;

        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
    }


    getRandomIndex() {
        var random = Math.floor(Math.random() * this.colorsSun.length);
        if (random === this.colorArrayMaxSun) {
            if (random === this.colorsSun.length - 1) {
                random = 0;
            } else {
                random += 1;
            }
        }

        this.colorsRangeSun = [this.colorsSun[this.colorArrayMaxSun], this.colorsSun[random]];
        this.colorArrayMaxSun = random;
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
            this.currentPulse = Math.floor((this.timeSpeed) % this.colorsSun.length);
            this.getBoundaries();

            // compute the two RGB colors
            var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
            this.RGBTop = this.getRGB(ratio, this.colorsSun);
        }  else {
            this.RGBSun = this.colorsRangeSun[this.currentPulse];
        }

    }


    renderPixel(x, y) {

        var color;

        if (y > 150) {
            // grass
            var [ratioGreen, colorsRangeGreen] = this.getSlidingRatioAndRange(this.colorsGreen, y + 30*Math.sin(x/100 + this.timeSpeed*2), this.timeSpeed);
            color = this.getRGB(ratioGreen, colorsRangeGreen);
        } else if (y > 100) {
            //sand
            var [ratioSand, colorsRangeSand] = this.getSlidingRatioAndRange(this.colorsSand, y + 30*Math.sin(y/80)*Math.sin(x/500 - this.timeSpeed), this.timeSpeed);
            color = this.getRGB(ratioSand, colorsRangeSand);
        } else if (y > 50) {
            //sea
            var [ratioBlue, colorsRangeBlue] = this.getSlidingRatioAndRange(this.colorsBlue, y + 30*Math.sin(x/50 + this.timeSpeed*20), this.timeSpeed);
            color = this.getRGB(ratioBlue, colorsRangeBlue);
        } else {
            //sun
            color = this.RGBSun;
        }

        return color;
    }
}

export default TestEffect;