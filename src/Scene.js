import PixelSample from './PixelSample'
import TestEffect from './TestEffect'
import WebSocketService from './WebSocketService'
import * as dat from 'dat.gui';

class Scene {
    constructor(targetCanvas) {
    	this.pixelSamples = [];
    	this.pixelSampleIndex = 1;
    	this.targetCanvas = targetCanvas;
    	this.canvasSize = [200, 200];
    	this.effect = new TestEffect(this);
        this.wss = new WebSocketService();

    	this.targetCanvas.width = this.canvasSize[0];
    	this.targetCanvas.height = this.canvasSize[1];
    	this.targetCanvas.style.width = this.canvasSize[0];
    	this.targetCanvas.style.height = this.canvasSize[1];

    	this.currY = 0;

    	this.initUniformEditor();
    	this.initPixelSampleEditor();
    }

    initUniformEditor() {
    	if (window.gui === undefined) {
	    	window.gui = new dat.gui.GUI();
    	}
        var entry;
    	this.gui = window.gui;
    	console.log(this.gui);
    	for (entry in this.gui.__folders) {
    		this.gui.removeFolder(this.gui.__folders[entry]);
    	}
    	for (entry in this.gui.__controllers) {
    		this.gui.remove(this.gui.__controllers[entry]);
    	}

    	const effectFolder = this.gui.addFolder("Effect");

    	for (entry in this.effect.uniforms) {
    		if (entry !== 'time' && entry !== 'fft') {
    			var uniform = this.effect.uniforms[entry]
    			effectFolder.add(uniform, 'value', uniform.min, uniform.max, uniform.step).name(entry);
    		}
    	}
    	effectFolder.open();
    }

    initPixelSampleEditor() {
    	this.gui.add(this, 'addPixelSample').name('Add Pixel Sample');
    }

    addSpacedPixelSamples(y, count) {
		var x = 200 / count / 2;
		var deltaX = 200 / count;
    	for (var i = 0; i<count; i++) {
			this.addPixelSample(x, y);
    		x += deltaX;
		}
    }

    addPixelSample(x, y) {
    	// var folder = this.gui.addFolder("PixelSample" + this.pixelSampleIndex++);
    	var pixelSample = new PixelSample(x || 0, y || 0);
    	this.pixelSamples.push(pixelSample);
    	// folder.add(pixelSample.pos, 'x', 0, 200, 1).name('posX');
    	// folder.add(pixelSample.pos, 'y', 0, 200, 1).name('posY');
    }

    update(uniforms) {
    	this.effect.setUniforms(uniforms);
    }

    renderPixel(x, y) {
    	return this.effect.renderPixel(x, y);
    }

    render() {
    	this.effect.preprocess();
    	// var currY = this.currY;
    	var ctx = this.targetCanvas.getContext('2d');
	    ctx.fillStyle = "#000";
	    ctx.fillRect(0, 0, this.canvasSize[0], this.canvasSize[1]);
    	var imageData = ctx.getImageData(0, 0, this.canvasSize[0], this.canvasSize[1]);
    	// var imageData = ctx.getImageData(0, currY, this.canvasSize[0], 1);
    	var data = imageData.data;
		for (var y=0; y<this.canvasSize[1]; y++) {
	    	for (var x=0; x<this.canvasSize[0]; x++) {
	    		var color = this.renderPixel(x, y);
	    		var index = (y * this.canvasSize[0] + x) * 4;
    			data[index]     = color[0];
    			data[index + 1] = color[1];
    			data[index + 2] = color[2];
    			data[index + 3] = 255;
    		}
    	}
    	ctx.putImageData(imageData, 0, 0);
    	// ctx.putImageData(imageData, 0, currY, 0, 0, this.canvasSize[0], 1);

        this.sendPixelColors();

		ctx.strokeStyle = "white";
    	for (var entry in this.pixelSamples) {
    		var sample = this.pixelSamples[entry];
	    	ctx.beginPath();
			ctx.rect(sample.pos.x, sample.pos.y, 3, 3);
			ctx.stroke();
    	}


    	// this.currY++;
    	// if (this.currY > this.canvasSize[1]) {
    	// 	this.currY = 0;
    	// }
    }

    sendPixelColors() {
        var pixels = new Uint8Array(this.pixelSamples.length*4);
        // [pixel id][r][g][b]

        var i = 0;
        for (var entry in this.pixelSamples) {
            var sample = this.pixelSamples[entry];
            var pixel = this.getPixelColor(sample.pos.x, sample.pos.y);
            pixels[i*4] = i & 0xFF;
            pixels.set(pixel.slice(0,3), i*4+1);
            i++;
            // ctx.rect(sample.pos.x, sample.pos.y, 3, 3);
        }

        this.wss.send(pixels);

        // console.log(pixels);

    }

    getPixelColor(x, y) {
        var ctx = this.targetCanvas.getContext('2d');
        return ctx.getImageData(x, y, 1, 1).data;
    }
}

export default Scene;
