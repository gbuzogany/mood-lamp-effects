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
            [122, 143, 92],
            [67, 108, 58],
            [37, 68, 53],
            [91, 108, 54]
        ];

        this.blinkingColors = [
            [222, 211, 172],
            [178, 85, 44],
            [193, 118, 59],
            [194, 122, 126],
            [247, 241, 233],
            [12, 11, 82],
            [251, 194, 41],
            [22, 21, 118],
            [186, 147, 61]
        ]

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
        if (this.lightStarPulse !== this.lightStarPulsePrevious) {
            // we pick the LEDS that are going to be lighted up
            var samples = [0, 2, 4, 7, 9, 11, 13, 16, 18, 20, 22, 25, 27]

            var positions = [];
            for (var j=0; j<samples.length; j++) {
                var coords = this.scene.pixelSamples[samples[j]].pos;
                var x = Math.floor(coords['x']);
                var y = Math.floor(coords['y']);
                positions.push([x, y]);
            }
            this.positions = positions;

            // we select three colors for this blinking combination
            var colorsBlink = [];
            for (var k=0; k<samples.length; k++) {
                var colorIndex = Math.floor(Math.random() * this.blinkingColors.length);
                colorsBlink.push(this.blinkingColors[colorIndex]);
            }
            this.colorsBlink = colorsBlink;

            this.lightStarPulsePrevious = this.lightStarPulse;
        }
    }

    getBlinkingColor = (targetColor) => {
        var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
        var colorsRange;
        var color;

        if (this.currentPulse %2 === 0) {
            colorsRange = [this.colorsRange[0], targetColor];
        } else {
            colorsRange = [targetColor, this.colorsRange[1]];
        } 
        color = this.getRGB(ratio, colorsRange);

        return color;
    } 

    preprocess() {
        var currentTime = this.uniforms['time'].value;
        // console.log(this.currentPulse %2, this.lightStarPulse)

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

        for (var i=0 ; i < this.positions.length ; i++) {
            if (pixel === JSON.stringify(this.positions[i])) {
                var targetColor = this.colorsBlink[i];
                color = this.getBlinkingColor(targetColor);
            }
        }

        return color;
    }
}

export default TestEffect;