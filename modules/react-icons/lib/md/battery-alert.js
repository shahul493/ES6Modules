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

var MdBatteryAlert = function MdBatteryAlert(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm21.6 23.4v-8.4h-3.2v8.4h3.2z m0 6.6v-3.4h-3.2v3.4h3.2z m4.5-23.4c1.2 0 2.3 1.1 2.3 2.3v25.6c0 1.2-1.1 2.1-2.3 2.1h-12.2c-1.2 0-2.3-0.9-2.3-2.1v-25.6c0-1.2 1.1-2.3 2.3-2.3h2.7v-3.2h6.8v3.2h2.7z' })
        )
    );
};

exports.default = MdBatteryAlert;
module.exports = exports['default'];