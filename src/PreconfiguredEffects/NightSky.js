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
            [2, 23, 46],
            [3, 29, 55],
            [9, 29, 55],
            [16, 41, 73],
            [6, 39, 70],
            [8, 49, 85],
            [11, 15, 39],
            [10, 12, 52],
            [22, 27, 55],
            [36, 43, 75]
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
        this.positions = [];
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

    randomPairs() {
        // this function randomly picks 2 pixelSamples to light up in white
        if (this.lightStarPulse !== this.lightStarPulsePrevious) {
            // we pick the first sample randomly, and the second one 'far away' to prevent adjacent LEDS to light up
            var samples = [];
            var randomIndex = Math.floor(Math.random() * this.scene.pixelSamples.length);
            samples.push(randomIndex);

            var secondIndex = (randomIndex + 10) % this.scene.pixelSamples.length;
            samples.push(secondIndex);

            var positions = [];
            for (var j=0; j<samples.length; j++) {
                var coords = this.scene.pixelSamples[samples[j]].pos;
                var x = Math.floor(coords['x']);
                var y = Math.floor(coords['y']);
                positions.push([x, y]);
            }
            this.positions = JSON.stringify(positions);
            this.lightStarPulsePrevious = this.lightStarPulse;

        }
    }

    getBlinkingColor = () => {
        var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
        var colorsRange;
        var color;

        if ((this.currentPulse >= 1 && this.currentPulse <= 3) || (this.currentPulse >= 6 && this.currentPulse <= 8)) {
            // flicker effect
            color = this.HSVtoRGB(33/360, 0.043, 0.9+Math.random()/10);
            color = [color['r'], color['g'], color['b']];

        } else {
            if (this.currentPulse === 0 || this.currentPulse === 5) {
                colorsRange = [this.colorsRange[0], [255, 250, 244]];
            } else {
                colorsRange = [[255, 250, 244], this.colorsRange[1]];
            } 
            color = this.getRGB(ratio, colorsRange);
        }
        return color;
    } 

    preprocess() {
        var currentTime = this.uniforms['time'].value;

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
            this.lightStarPulse = Math.floor(this.timeSpeed/(this.colors.length/2) % (this.colors.length));

            this.randomPairs();
            if (this.currentPulse !== this.previousPulse) {
                this.getBoundaries();
            }
        } 
    }


    renderPixel(x, y) {
        var color = this.RGB;
        var pixel = JSON.stringify([x, y]);

        var c = this.positions.indexOf(pixel);
        if (c !== -1){
            color = this.getBlinkingColor();
        }


        return color;
    }
}

export default TestEffect;