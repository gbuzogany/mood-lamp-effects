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
        // this.RGB = this.colors[0];

    }

    getBoundaries = () => {

        var hour = this.uniforms['hour'];
        var colorsRange;

        if (hour > 22) {
            colorsRange = [this.colors[7], this.colors[0]];
        } else if (hour > 20) {
            colorsRange = [this.colors[6], this.colors[7]];
        } else if (hour > 17) {
            colorsRange = [this.colors[5], this.colors[6]];
        } else if (hour > 10) {
            colorsRange = [this.colors[4], this.colors[5]];
        } else if (hour > 9) {
            colorsRange = [this.colors[3], this.colors[4]];
        } else if (hour > 7) {
            colorsRange = [this.colors[2], this.colors[3]];
        } else if (hour > 6) {
            colorsRange = [this.colors[1], this.colors[2]];
        } else {
            colorsRange = [this.colors[0], this.colors[1]];
        } 

        this.colorsRange = colorsRange;
    }



    getRatio = (y, incr) => {
        var output = y * incr;
        // console.log(output)
        return output;
    }


    preprocess() {
        var currentTime = this.uniforms['time'].value;

        if (currentTime === undefined) {
            currentTime = 0;
        } else {
            // // compute color for this frame
            // var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
            // this.RGB = this.getRGB(ratio, this.colorsRange);

            // update time counter
            var deltaTime = currentTime - this.initialTime;
            this.initialTime = currentTime;
            var speed = this.uniforms['speed'].value;
            this.timeSpeed += deltaTime * speed/50000;

            // update currentIndex and ranges
            this.getBoundaries();
        } 
    }


    renderPixel(x, y) {
        // var ratio = this.getRatio(Math.cos(y)*Math.sin(x/20 + this.timeSpeed*20), this.timeSpeed);
        var ratio =Math.cos(y)*Math.sin(x/20 + this.timeSpeed*20);
        var color = this.getRGB(ratio, this.colorsRange);

        return color;
    }
}

export default TestEffect;