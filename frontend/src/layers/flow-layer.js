import L from 'leaflet';
import 'leaflet-velocity';
import 'leaflet-velocity/dist/leaflet-velocity.css';

class FlowLayer {
  constructor(api, options = {}) {
    const layerOptions = Object.assign({
      displayValues: true,
      displayOptions: {
        velocityType: 'Wind',
        position: 'bottomright',
        emptyString: 'אין נתוני רוח',
        angleConvention: 'bearingCW',
        speedUnit: 'kt'
      },
      minVelocity: 3,
      maxVelocity: 20,
      velocityScale: 0.01,
      colorScale: [
        'rgb(36,104,180)',
        'rgb(60,157,194)',
        'rgb(128,205,193)',
        'rgb(151,218,168)',
        'rgb(252,217,125)',
        'rgb(255,182,100)',
        'rgb(252,150,75)',
        'rgb(250,112,52)',
        'rgb(245,64,32)',
        'rgb(237,45,28)',
        'rgb(220,24,32)',
        'rgb(180,0,35)'
      ],
      data: null
    }, options);

    this._baseLayer = L.velocityLayer(layerOptions);
    this.uFlow = {
      header: { parameterCategory: 2, parameterNumber: 2 },
      data: []
    };
    this.vFlow = {
      header: { parameterCategory: 2, parameterNumber: 3 },
      data: []
    };
  }

  setForecastModel(model) {
    const modelHeader = {
      nx: model.size[0],
      ny: model.size[1],
      lo1: model.origin[0],
      la1: model.origin[1],
      dx: model.resolution[0],
      dy: model.resolution[1]
    };
    Object.assign(this.uFlow.header, modelHeader);
    Object.assign(this.vFlow.header, modelHeader);
  }

  setData(data) {
    if (Array.isArray(data) && data.length >= 2) {
      this.uFlow.data = data[0].data;
      this.vFlow.data = data[1].data;
      this._baseLayer.setData([this.uFlow, this.vFlow]);
    }
  }
}

export default FlowLayer;
