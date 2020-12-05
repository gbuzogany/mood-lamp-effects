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
        this.colors = [
            [36, 50, 75],
            [31, 67, 102],
            [50, 198, 225],
            [144, 228, 244]
        ];

        this.currentPulse = 0;
        this.previousPulse = 0;
        this.lightStarPulse = 0;
        this.lightStarPulsePrevious = 0;
        this.colorArrayMax = 1;
        this.colorsRange = [this.colors[0], this.colors[1]];

        this.RGB = this.colors[0];
        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
        this.sandLimit = 150;
        this.fishRadius = 50;
        this.fishIndex = Math.floor(Math.random() * (this.scene.pixelSamples.length-6));
        this.fishPosition = [Math.floor(this.scene.pixelSamples[this.fishIndex].pos['x']), Math.floor(this.scene.pixelSamples[this.fishIndex].pos['y'])];
        this.fishTwinPosition = this.getFishTwinCoordinates();
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

    isFishPixel = (x, y) => {
        var hyp = (x - this.fishPosition[0]) ** 2 + (y - this.fishPosition[1]) ** 2;
        var hypTwin = (x - this.fishTwinPosition[0]) ** 2 + (y - this.fishTwinPosition[1]) ** 2;
        if (hyp <= (this.fishRadius ** 2)) {
            return (hyp / this.fishRadius ** 2);
        } else if (hypTwin <= (this.fishRadius ** 2)) {
            return (hypTwin / this.fishRadius ** 2);
        }
        return -1;
    }

    getFishCoordinates() {
        var x = Math.abs(this.fishPosition[0] + (25*Math.sin(this.timeSpeed)/100 + 50*Math.cos(this.timeSpeed)/50)) % 200;
        var y = Math.abs(this.fishPosition[1] + (25*Math.sin(this.timeSpeed)/100));

        if (y + this.fishRadius >= this.sandLimit) {
            y =  Math.abs(this.fishPosition[1] - (25*Math.sin(this.timeSpeed)/100));
        }

        this.fishPosition = [x, y];
        this.fishTwinPosition = this.getFishTwinCoordinates();

    }

    getFishTwinCoordinates = () => {
        var x = this.fishPosition[0];
        var y = this.fishPosition[1];
        if (x > 100) {
            return [x - 200, y];
        } else {
            return [x + 200, y];
        }
    }

    getBlinkingColor = () => {
        var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
        var colorsRange;
        var color;

        if (Math.floor(this.timeSpeed*24 % 2) === 0) {
            colorsRange = [this.colorsRange[0], [255, 147, 41]];
        } else {
            colorsRange = [[255, 147, 41], this.colorsRange[1]];
        } 
        color = this.getRGB(ratio, colorsRange);

        return color;
    } 

    preprocess() {
        var currentTime = this.uniforms['time'].value;
        // console.log(this.fishPosition, this.fishTwinPosition)


        if (currentTime === undefined) {
            currentTime = 0
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
            this.currentPulse = Math.floor((this.timeSpeed) % (this.colors.length));
            this.lightStarPulse = Math.floor(this.timeSpeed*12 % (this.colors.length));

            this.getFishCoordinates();
            if (this.currentPulse !== this.previousPulse) {
                this.getBoundaries();
            }
        } 
    }


    renderPixel(x, y) {
        var color;
        var isFish = this.isFishPixel(x, y);

        if (isFish !== -1) {
            var ratio = isFish;
            var colorsRange = [[255, 147, 41], this.RGB];
            color = this.getRGB(ratio, colorsRange)
        } else if (y>this.sandLimit) {
            color = [135, 117, 113];
        } else {
            color = this.RGB;
        }

        return color;
    }
}

export default TestEffect;