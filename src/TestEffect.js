import Effect from './Effect'
import Uniform from './Uniform'

class TestEffect extends Effect {
    constructor() {
        super();
        this.uniforms['temperature'] = new Uniform(20, 0, 50, 0.1);
        this.uniforms['humidity'] = new Uniform(60, 0, 100, 0.1);
        this.uniforms['pressure'] = new Uniform(1012, 980, 1025, 0.1);
        this.uniforms['light'] = new Uniform(160, 0, 750, 1.0);
        this.uniforms['hour'] = new Uniform(15, 0, 23, 0.1);
        this.uniforms['fft'] = new Uniform([]);
    }

    renderPixel(x, y) {
    	// debugger;
    	var ts = this.uniforms['time'].value || 0;
    	var v = ((ts % 1000) / 1000);
    	return [v * 255, 0, 0];
    }
}

export default TestEffect;