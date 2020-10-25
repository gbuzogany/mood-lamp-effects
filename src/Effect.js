import Uniform from './Uniform'

class Effect {
    constructor() {
		this.uniforms = {
			"time" : new Uniform()
		};
    }

    setUniforms(uniforms) {
    	for (var entry in uniforms) {
    		if (entry in this.uniforms) {
    			this.uniforms[entry].setValue(uniforms[entry]);
    		}
    	}
    }

    renderPixel(x, y) {
    	return [0, 0, 0];
    }
}

export default Effect;
