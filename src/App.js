import React, { Component } from 'react';
import logo from './logo.svg';
import dash_btn_left from './img/dash_btn_left.png';
import './App.css';
import './css/darkroom.css'
import { Transform } from './Transform';

import { Darkroom, Canvas, Toolbar, FilePicker, CropMenu } from 'react-darkroom';

const createObjectURL = (window.URL || window.webkitURL).createObjectURL || window.createObjectURL;
const canvasWidth = 480;
const canvasHeight = 200;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      crop: false,
      save: false,
    };
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.onCropConfirm = this.onCropConfirm.bind(this);
    this.onCropStart = this.onCropStart.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  handleChangeFile(e) {
    const files = e.target.files;
    const image = createObjectURL(files[0]);
    this.setState({ image: image });
  }

  onCropConfirm() {
    const source = this.state.image;
    const { x, y, width, height } = this.refs.canvasWrapper.cropBox;
    Transform.cropImage(
      source,
      { x, y, width, height },
      { width: canvasWidth, height: canvasHeight }
    ).then(image => this.setState({
      image: image,
      crop: false,
    }));
  }

  onSave() {
    this.setState({ save: true });
  }

  onCancel() {
    this.setState({ save: false });
  }

  onCropStart() {
    this.setState({ crop: true })
  }

  render() {
    const hasFile = this.state.image !== '';

    return (
      <div>
        <div className="contents">
          <Darkroom>
            <Toolbar>
              <CropMenu isCropping={this.state.crop}>
                <button
                  disabled={!hasFile}
                  data-showOnlyWhen='croppingIsOff'
                  onClick={this.onCropStart}
                  data-tipsy="Crop"
                  className="tipsy tipsy--sw">
                  <span className="icon icon-crop"/>
                </button>
                <button disabled={!hasFile} data-showOnlyWhen='croppingIsOn' onClick={this.onCropConfirm} style={{color: 'green'}} data-tipsy="Confirm" className="tipsy tipsy--sw">
                  <span className="icon icon-checkmark"/>
                </button>
              </CropMenu>
              <button disabled={!hasFile} onClick={this.onSave} data-tipsy="Save" className="tipsy tipsy--sw">
                <span className="icon icon-floppy-disk"/>
              </button>
              <button
                disabled={!hasFile}
                onClick={this.onCancel}
                style={{color: 'red'}}
                data-tipsy="Cancel"
                className="tipsy tipsy--sw">
                <span className="icon icon-cross"/>
              </button>
            </Toolbar>
            <Canvas ref="canvasWrapper" crop={this.state.crop} source={this.state.image} angle={0} width={canvasWidth} height={canvasHeight}>
              <FilePicker hasFile={hasFile} onChange={this.handleChangeFile}/>
            </Canvas>
          </Darkroom>
          <img src={dash_btn_left} className="image_dash" alt="logo" width="972" height="586" />
        </div>
      </div>
    );
  }
}

export default App;
