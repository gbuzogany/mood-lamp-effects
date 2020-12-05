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
            [61, 123, 150],
            [191, 192, 178],
            [212, 212, 204],
            [104, 160, 170],
            [237, 241, 226],
            [213, 222, 238],
            [31, 57, 77]
        ];

        this.currentPulse = 0;
        this.previousPulse = 0;
        this.colorArrayMax = 1;
        this.colorsRange = [this.colors[0], this.colors[1]];

        this.ratio = 0;
        this.RGB = this.colors[0];
        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
        this.speed = 20;
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

    getSlidingRatioAndRange = (colors, y, incr) => {
        var output = ((colors.length / 200) * y + incr) % colors.length;
        var colorMinIndex = Math.abs(Math.floor(output));
        var colorMaxIndex = (colorMinIndex + 1) % colors.length;
        var colorsRange = [colors[colorMinIndex], colors[colorMaxIndex]];
        var ratio = output - colorMinIndex;

        return [ratio, colorsRange];
    }

    preprocess() {
        var currentTime = this.uniforms['time'].value;

        if (currentTime === undefined) {
            currentTime = 0;
        } else {
            // compute color for this frame
            var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
            this.RGB = this.getRGB(ratio, this.colorsRange);

            // update time counter
            var deltaTime = currentTime - this.initialTime;
            this.initialTime = currentTime;
            var speed = this.speed;
            this.timeSpeed += deltaTime * speed/50000;

            // update currentIndex and ranges
            this.currentPulse = Math.floor((this.timeSpeed) % (this.colors.length));
            this.getBoundaries();
        } 
    }


    renderPixel(x, y) {

        var [ratio, colorsRange] = this.getSlidingRatioAndRange(
            [this.RGB, this.colors[1]], 
            y + (20*(Math.sin(x/100 + this.timeSpeed*5)))*Math.cos(x/20), 
            this.timeSpeed
        );

        var color = this.getRGB(ratio, colorsRange);

        return color;
    }
}

export default TestEffect;