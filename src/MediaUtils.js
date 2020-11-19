class MediaUtils {
	constructor()
	{
		this.fftOutput = [];
	}

	initializeMicrophone() {
		if (this.hasGetUserMedia()) {
			navigator.mediaDevices.getUserMedia({audio: true})
			.then(this.gotDevice)
			.catch(this.handleError);
		} else {
			alert('getUserMedia() is not supported by your browser');
		}
	}

	gotDevice = (stream) => {
		if (stream) {
			this.audioContext = new AudioContext({sampleRate: 44100});

			this.analyser = this.audioContext.createAnalyser();
			this.microphone = this.audioContext.createMediaStreamSource(stream);
			this.normalizeNode = this.audioContext.createScriptProcessor(1024, 1, 1);
			this.scriptNode = this.audioContext.createScriptProcessor(1024, 1, 1);

			this.analyser.smoothingTimeConstant = 0.0;
			this.analyser.minDecibels = -80.0;
			this.analyser.fftSize = 4096;

			this.microphone.connect(this.normalizeNode);
			this.normalizeNode.connect(this.analyser);
			this.analyser.connect(this.scriptNode);
			this.scriptNode.connect(this.audioContext.destination);

			this.normalizeNode.onaudioprocess = this.onMicInput;
			this.scriptNode.onaudioprocess = this.onAudioProcess;
		}
	}

	onMicInput = (event) => {
		var inputBuffer = event.inputBuffer;
		var outputBuffer = event.outputBuffer;

		for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
			var inputData = inputBuffer.getChannelData(channel);
			var outputData = outputBuffer.getChannelData(channel);

	    	var min = 999999;
	    	var max = -999999;

	    	for (var i in inputData) {
	    		if (inputData[i] < min) {
	    			min = inputData[i];
	    		}
	    		if (inputData[i] > max) {
	    			max = inputData[i];
	    		}
	    	}

			for (var sample = 0; sample < inputBuffer.length; sample++) {
				outputData[sample] = ((inputData[sample] - min) / ((max - min) + 1));
			}
		}

	}

	onAudioProcess = () => {
		var array =  new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(array);
		// var values = 0;

		// var length = array.length;
		// for (var i = 0; i < length; i++) {
		// 	values += array[i];
		// }
		// var average = values / length;

		// console.log(average);
		this.fftOutput = array;
	}

	getFFTOutput() {
		return this.fftOutput;
	}

	handleError(error) {
		console.error(error);
	}

	hasGetUserMedia() {
		return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
	}

}

export default MediaUtils;