class WebsocketService {
	constructor() {
		this.socket = new WebSocket("ws://localhost:8088");
		this.socket.onmessage = this.onSocketMessage;
		this.socket.onopen = this.onConnected;
		this.socket.onclose = this.onDisconnected;
		this.connected = false;
	}

	onConnected = () => {
		this.connected = true;
	}

	onDisconnected = () => {
		this.connected = false;
	}

	onSocketMessage = (event) => {

	}

	send = (buffer) => {
		if (this.connected) {
			this.socket.send(buffer)
		}
	}
}

export default WebsocketService;