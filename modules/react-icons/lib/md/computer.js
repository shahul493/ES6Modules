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

var MdComputer = function MdComputer(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm6.6 10v16.6h26.8v-16.6h-26.8z m26.8 20h6.6v3.4h-40v-3.4h6.6q-1.3 0-2.3-1t-0.9-2.4v-16.6q0-1.3 0.9-2.3t2.3-1.1h26.8q1.3 0 2.3 1.1t0.9 2.3v16.6q0 1.4-0.9 2.4t-2.3 1z' })
        )
    );
};

exports.default = MdComputer;
module.exports = exports['default'];