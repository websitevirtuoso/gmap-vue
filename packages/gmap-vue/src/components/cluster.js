/**
  * @class Cluster
  * @prop $clusterObject -- Exposes the marker clusterer to
        descendent Marker classes. Override this if you area
        extending the class

  List of properties from
  https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/src/markerclusterer.js
* */
import MarkerClusterer from '@google/markerclustererplus';
import mapElementFactory from '../factories/map-element';

const props = {
  maxZoom: {
    type: Number,
    twoWay: false,
  },
  batchSizeIE: {
    type: Number,
    twoWay: false,
  },
  calculator: {
    type: Function,
    twoWay: false,
  },
  enableRetinaIcons: {
    type: Boolean,
    twoWay: false,
  },
  gridSize: {
    type: Number,
    twoWay: false,
  },
  averageCenter: {
    type: Boolean,
    twoWay: false,
  },
  ignoreHidden: {
    type: Boolean,
    twoWay: false,
  },
  imageExtension: {
    type: String,
    twoWay: false,
  },
  imagePath: {
    type: String,
    twoWay: false,
  },
  imageSizes: {
    type: Array,
    twoWay: false,
  },
  minimumClusterSize: {
    type: Number,
    twoWay: false,
  },
  clusterClass: {
    type: String,
    twoWay: false,
  },
  styles: {
    type: Array,
    twoWay: false,
  },
  zoomOnClick: {
    type: Boolean,
    twoWay: false,
  },
};

const events = [
  'click',
  'rightclick',
  'dblclick',
  'drag',
  'dragstart',
  'dragend',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout',
];

export default mapElementFactory({
  mappedProps: props,
  events,
  name: 'cluster',
  ctr: () => {
    if (typeof MarkerClusterer === 'undefined') {
      throw new Error(
        'MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js'
      );
    }
    return MarkerClusterer;
  },
  ctrArgs: ({ map, ...otherOptions }) => [map, [], otherOptions],

  render(h) {
    // <div><slot></slot></div>
    return h('div', this.$slots.default);
  },

  afterCreate(inst) {
    const reinsertMarkers = () => {
      const oldMarkers = inst.getMarkers();
      inst.clearMarkers();
      inst.addMarkers(oldMarkers);
    };

    Object.keys(props).forEach((prop) => {
      if (props[prop].twoWay) {
        this.$on(`${prop.toLowerCase()}_changed`, reinsertMarkers);
      }
    });
  },

  updated() {
    if (this.$clusterObject) {
      this.$clusterObject.repaint();
    }
  },

  beforeDestroy() {
    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach((marker) => {
      if (marker.$clusterObject === this.$clusterObject) {
        // TODO: analyze if exists a better way to do this
        // eslint-disable-next-line no-param-reassign -- needed to clean in a more optimized way
        marker.$clusterObject = null;
      }
    });

    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers();
    }
  },
});
