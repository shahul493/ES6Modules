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

var MdPictureInPicture = function MdPictureInPicture(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm35 31.7v-23.4h-30v23.4h30z m0-26.7q1.3 0 2.3 1t1.1 2.4v23.2q0 1.4-1.1 2.4t-2.3 1h-30q-1.3 0-2.3-1t-1.1-2.4v-23.2q0-1.4 1.1-2.4t2.3-1h30z m-3.4 6.6v10h-13.2v-10h13.2z' })
        )
    );
};

exports.default = MdPictureInPicture;
module.exports = exports['default'];