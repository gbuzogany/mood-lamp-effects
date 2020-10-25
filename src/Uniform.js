class Uniform {
    constructor(value, min, max, step) {
    	this.value = value || 0;
    	this.max = max;
    	this.min = min;
    	this.step = step;
    }

    setValue(value) {
    	this.value = value;
    }
}

export default Uniform;
