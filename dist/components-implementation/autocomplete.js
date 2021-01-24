"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bindProps = require("../utils/bind-props");

var _simulateArrowDown = _interopRequireDefault(require("../utils/simulate-arrow-down"));

var _mappedPropsToVueProps = _interopRequireDefault(require("../utils/mapped-props-to-vue-props"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mappedProps = {
  bounds: {
    type: Object
  },
  componentRestrictions: {
    type: Object,
    // Do not bind -- must check for undefined
    // in the property
    noBind: true
  },
  types: {
    type: Array,
    default: function _default() {
      return [];
    }
  }
};
var props = {
  selectFirstOnEnter: {
    required: false,
    type: Boolean,
    default: false
  },
  // the unique ref of the slot component
  slotRefName: {
    required: false,
    type: String,
    default: 'input'
  },
  // the name of the ref to obtain the input (if its a child of component in the slot)
  childRefName: {
    required: false,
    type: String,
    default: 'input'
  },
  options: {
    type: Object
  },
  fieldsProp: {
    required: false,
    type: Array,
    default: null
  }
};
var _default = {
  mounted: function mounted() {
    var _this = this;

    this.$gmapApiPromiseLazy().then(function () {
      var scopedInput = null;

      if (_this.$scopedSlots.input) {
        scopedInput = _this.$scopedSlots.input()[0].context.$refs[_this.slotRefName];

        if (scopedInput && scopedInput.$refs) {
          scopedInput = scopedInput.$refs[_this.childRefName || 'input'];
        }

        if (scopedInput) {
          _this.$refs.input = scopedInput;
        }
      }

      if (_this.selectFirstOnEnter) {
        (0, _simulateArrowDown.default)(_this.$refs.input);
      }

      if (typeof google.maps.places.Autocomplete !== 'function') {
        throw new Error("google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?");
      }

      var finalOptions = _objectSpread({}, (0, _bindProps.getPropsValues)(_this, mappedProps), {}, _this.options);

      _this.$autocomplete = new google.maps.places.Autocomplete(_this.$refs.input, finalOptions);
      (0, _bindProps.bindProps)(_this, _this.$autocomplete, mappedProps);

      _this.$watch('componentRestrictions', function (v) {
        if (v !== undefined) {
          _this.$autocomplete.setComponentRestrictions(v);
        }
      }); // IMPORTANT: To avoid paying for data that you don't need,
      // be sure to use Autocomplete.setFields() to specify only the place data that you will use.


      if (_this.fieldsProp) {
        _this.$autocomplete.setFields(_this.fieldsProp);
      } // Not using `bindEvents` because we also want
      // to return the result of `getPlace()`


      _this.$autocomplete.addListener('place_changed', function () {
        _this.$emit('place_changed', _this.$autocomplete.getPlace());
      });
    });
  },
  props: _objectSpread({}, (0, _mappedPropsToVueProps.default)(mappedProps), {}, props)
};
exports.default = _default;