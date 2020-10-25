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
			this.scriptNode = this.audioContext.createScriptProcessor(512, 1, 1);

			this.analyser.smoothingTimeConstant = 0.0;
			this.analyser.fftSize = 8192;

			this.microphone.connect(this.analyser);
			this.analyser.connect(this.scriptNode);
			this.scriptNode.connect(this.audioContext.destination);

			this.scriptNode.onaudioprocess = this.onAudioProcess;
		}
	}

	onAudioProcess = () => {
		var array =  new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(array);
		var values = 0;

		var length = array.length;
		for (var i = 0; i < length; i++) {
			values += array[i];
		}
		var average = values / length;

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