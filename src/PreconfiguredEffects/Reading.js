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
            [227, 233, 255], // warm white
            [255, 180, 107] // cold white
        ];
        this.RGB = this.colors[0];

        this.modulo = 1000;
        this.initialTime = this.uniforms['time'].value;
        this.timeSpeed = 0.0;
        this.speed = 3;
    }

    preprocess() {
        var hour = this.uniforms['hour'].value;
        var currentTime = this.uniforms['time'].value;

        if (currentTime === undefined) {
            currentTime = 0;
        } else {
            // compute color for this frame
            this.RGB = this.colors[0];

            if (hour >= 20 || hour <= 8) {
                this.RGB = this.colors[1];
            } else if (hour === 20 || hour === 8) {
                var ratio = this.timeSpeed - Math.floor(this.timeSpeed);
                if (hour === 20) {
                    this.RGB = this.getRGB(ratio, this.colors[0]);
                } else {
                    this.RGB = this.getRGB(ratio, [this.colors[1], this.colors[0]]);
                }
            }
            // update time counter
            var deltaTime = currentTime - this.initialTime;
            this.initialTime = currentTime;
            this.timeSpeed += deltaTime * this.speed/50000;

            // update currentIndex and ranges
            // this.currentPulse = Math.floor((this.timeSpeed) % (this.colors.length));
            // this.getBoundaries();
        } 
    }


    renderPixel(x, y) {
        var color = this.RGB;

        return color;
    }
}

export default TestEffect;