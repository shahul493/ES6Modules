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

var IoArrowShrink = function IoArrowShrink(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm35 7.2l-6.4 6.4 3.9 3.9h-10v-10l3.9 3.9 6.4-6.4z m0 25.6l-2.2 2.2-6.4-6.4-3.9 3.9v-10h10l-3.9 3.9z m-30 0l6.4-6.4-3.9-3.9h10v10l-3.9-3.9-6.4 6.4z m0-25.6l2.2-2.2 6.4 6.4 3.9-3.9v10h-10l3.9-3.9z' })
        )
    );
};

exports.default = IoArrowShrink;
module.exports = exports['default'];