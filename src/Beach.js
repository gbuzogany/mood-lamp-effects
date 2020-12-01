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
        this.colorArrayMaxBottom = 1;
        this.colorsRangeBottom = [this.colorsBottom[0], this.colorsBottom[1]];
        this.RGBBottom = this.colorsBottom[0];

        this.currentPulse = 0;
        this.previousPulse = 0;

        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
    }


    getRandomIndex(target) {

        var colorsArray;
        var colorArrayMax;

        if (target === 'top') {
            colorsArray = this.colorsTop;
            colorArrayMax = this.colorArrayMaxTop;
        } else {
            colorsArray = this.colorsBottom;
            colorArrayMax = this.colorArrayMaxBottom;
        }
        
        var random = Math.floor(Math.random() * colorsArray.length);
        if (random === this.colorArrayMax) {
            if (random === this.colors.length - 1) {
                random = 0;
            } else {
                random += 1;
            }
        }

        if (target === 'top') {
            this.colorsRangeTop = [colorsArray[colorArrayMax], colorsArray[random]];
            this.colorArrayMaxTop = random;
        } else {
            this.colorsRangeBottom = [colorsArray[colorArrayMax], colorsArray[random]];
            this.colorArrayMaxBottom = random;
        }

    }


    getBoundaries = () => {

        if (this.currentPulse !== this.previousPulse) {
            this.getRandomIndex('top');
            this.getRandomIndex('bottom');
            this.previousPulse = this.currentPulse;
        };

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
            this.colorsRange = this.colorsRangeBottom;
            this.RGBBottom = this.getRGB(ratio, this.colorsRangeBottom);
        }  else {
            this.RGBTop = this.colorsRangeTop[this.currentPulse];
            this.RGBBottom = this.colorsRangeBottom[this.currentPulse];
        }

    }


    renderPixel(x, y) {

        var color;

        if (y > 100) {
            color = this.RGBBottom;
        } else {
            color = this.RGBTop;
        }

        return color;
    }
}

export default TestEffect;