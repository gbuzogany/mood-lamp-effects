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
            [10, 10, 22],
            [52, 90, 122],
            [234, 203, 195],
            [241, 172, 145],
            [251, 173, 37],
            [237, 136, 95],
            [213, 68, 69],
            [42, 36, 71]
        ]

        this.currentIndex = 0;
        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
        this.colorsRange = [this.colors[0], this.colors[1]];
        this.ratio = 0;
        this.RGB = this.colors[0];
        this.animationSpeed = 2;
    }

    getBoundaries = () => {

        var hour = this.uniforms['hour'].value;
        var colorsRange;
        var lowerRangeHour;
        var rangeHour;
        var animationSpeed;

        if (hour >= 22) {
            colorsRange = [this.colors[7], this.colors[0]];
            lowerRangeHour = 22;
            rangeHour = 2;
            animationSpeed = 2;
        } else if (hour >= 20) {
            colorsRange = [this.colors[6], this.colors[7]];
            lowerRangeHour = 20;
            rangeHour = 2;
            animationSpeed = 6;
        } else if (hour >= 17) {
            colorsRange = [this.colors[5], this.colors[6]];
            lowerRangeHour = 17;
            rangeHour = 3;
            animationSpeed = 8;
        } else if (hour >= 10) {
            colorsRange = [this.colors[4], this.colors[5]];
            lowerRangeHour = 10;
            rangeHour = 7;
            animationSpeed = 10;
        } else if (hour >= 9) {
            colorsRange = [this.colors[3], this.colors[4]];
            lowerRangeHour = 9;
            rangeHour = 1;
            animationSpeed = 10;
        } else if (hour >= 7) {
            colorsRange = [this.colors[2], this.colors[3]];
            lowerRangeHour = 7;
            rangeHour = 2;
            animationSpeed = 6;
        } else if (hour >= 6) {
            colorsRange = [this.colors[1], this.colors[2]];
            lowerRangeHour = 6;
            rangeHour = 1;
            animationSpeed = 4;
        } else {
            colorsRange = [this.colors[0], this.colors[1]];
            lowerRangeHour = 0;
            rangeHour = 6;
            animationSpeed = 2;
        } 

        this.colorsRange = colorsRange;
        this.ratio = ((hour - lowerRangeHour) / rangeHour) ;
        this.animationSpeed = animationSpeed;
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

        if (currentTime === undefined) {
            currentTime = 0;
        } else {
            // compute color for this frame
            this.RGB = this.getRGB(this.ratio, this.colorsRange);

            // update time counter
            var deltaTime = currentTime - this.initialTime;
            this.initialTime = currentTime;
            var speed = this.uniforms['speed'].value;
            this.timeSpeed += deltaTime * speed/50000;

            // update animation speed and range
            this.getBoundaries();
        } 
    }


    renderPixel(x, y) {
        var [ratio, colorsRange] = this.getSlidingRatioAndRange(
            [this.RGB, this.colorsRange[1]], 
            y + 30*Math.sin(x/100 + this.timeSpeed*this.animationSpeed), 
            this.timeSpeed
        );
        var color = this.getRGB(ratio, colorsRange);



        return color;
    }
}

export default TestEffect;