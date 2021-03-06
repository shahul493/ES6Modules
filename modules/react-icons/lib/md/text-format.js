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

var MdTextFormat = function MdTextFormat(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm20 10l-3.1 8.4h6.2z m-4.1 11.3l-1.6 3.7h-3.4l7.9-18.4h2.5l7.8 18.4h-3.4l-1.6-3.7h-8.2z m-7.5 7.1h23.2v3.2h-23.2v-3.2z' })
        )
    );
};

exports.default = MdTextFormat;
module.exports = exports['default'];