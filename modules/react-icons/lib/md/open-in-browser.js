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

var MdOpenInBrowser = function MdOpenInBrowser(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm20 16.6l6.6 6.8h-5v10h-3.2v-10h-5z m11.6-10q1.4 0 2.4 1.1t1 2.3v20q0 1.3-1 2.3t-2.4 1.1h-6.6v-3.4h6.6v-16.6h-23.2v16.6h6.6v3.4h-6.6q-1.4 0-2.4-1.1t-1-2.3v-20q0-1.3 1-2.3t2.4-1.1h23.2z' })
        )
    );
};

exports.default = MdOpenInBrowser;
module.exports = exports['default'];