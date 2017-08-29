'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = require('react-icon-base');

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TiWeatherWindyCloudy = function TiWeatherWindyCloudy(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm8 26.3c-0.2 0-0.5-0.1-0.7-0.2-2.4-1.1-4-3.5-4-6.1 0-3.1 2.2-5.7 5-6.5 0 0 0-0.1 0-0.2 0-5.5 4.5-10 10-10 4.9 0 9.1 3.5 9.9 8.4 0.1 0.9-0.5 1.7-1.4 1.9-0.9 0.1-1.8-0.5-1.9-1.4-0.6-3.2-3.3-5.5-6.6-5.5-3.6 0-6.6 3-6.6 6.6 0 0.5 0 0.9 0.1 1.4l0.4 2.1-2.4-0.1c-1.6 0-3.1 1.5-3.1 3.3 0 1.3 0.8 2.5 2 3.1 0.8 0.3 1.2 1.3 0.8 2.2-0.2 0.6-0.9 1-1.5 1z m23.7-14.6c-1 0-1.7 0.7-1.7 1.6s0.7 1.7 1.7 1.7c0.9 0 1.6 0.7 1.6 1.7s-0.7 1.6-1.6 1.6h-16c-1 0-1.7 0.8-1.7 1.7s0.7 1.7 1.7 1.7h7.6c1 0 1.7 0.7 1.7 1.6s-0.7 1.7-1.7 1.7h-8.3c-2.8 0-5 2.2-5 5s2.2 5 5 5c0.9 0 1.7-0.7 1.7-1.7s-0.8-1.6-1.7-1.6c-0.9 0-1.7-0.8-1.7-1.7s0.8-1.7 1.7-1.7h8.3c2.8 0 5-2.2 5-5 0-0.6-0.1-1.1-0.3-1.6h3.7c2.7 0 5-2.3 5-5s-2.3-5-5-5z' })
        )
    );
};

exports.default = TiWeatherWindyCloudy;
module.exports = exports['default'];