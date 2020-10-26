import React from 'react';
import './App.css';
import MediaUtils from './MediaUtils'
import Scene from './Scene'

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.canvas = document.getElementById('canvas');
        this.scene = new Scene(this.canvas);
        this.mediaUtils = new MediaUtils();
        this.mediaUtils.initializeMicrophone();
        this.time = 0.0;
        this.uniforms = {};
        this.cancelAllAnimationFrames();
        this.renderLoop();
    }

    cancelAllAnimationFrames() {
        for (var i = 1; i < 99999; i++) {
            window.clearInterval(i);
            window.cancelAnimationFrame(i);
        }
    }

    renderLoop = (timestamp) => {
        requestAnimationFrame( this.renderLoop );
        this.uniforms['fft'] = this.mediaUtils.getFFTOutput();
        this.uniforms['time'] = timestamp;
        this.scene.update(this.uniforms);
        this.scene.render();
    }

    render = () => {
        return (
            <div className="App">
                <canvas id="canvas"/>
            </div>
        );
    }
}

export default App;
