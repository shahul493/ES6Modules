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

var GoBroadcast = function GoBroadcast(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm20 7.5c5.5 0 10 4.5 10 10 0 2.7-1.1 5.2-2.8 7l-0.6 3.6c3.5-2.2 5.9-6.1 5.9-10.6 0-6.9-5.6-12.5-12.5-12.5s-12.5 5.6-12.5 12.5c0 4.5 2.4 8.4 5.9 10.6l-0.6-3.6c-1.7-1.8-2.8-4.3-2.8-7 0-5.5 4.5-10 10-10z m-2.5 12.5c-1.4 0-2.5 1.1-2.5 2.5v5c0 1.4 1.2 2.5 2.5 2.5v10h5v-10c1.3 0 2.5-1.1 2.5-2.5v-5c0-1.4-1.1-2.5-2.5-2.5h-5z m7.5-5c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z m-5-15c-9.6 0-17.5 7.9-17.5 17.5 0 7.7 5 14.2 11.9 16.5l-0.5-2.8c-5.2-2.3-8.9-7.6-8.9-13.7 0-8.3 6.7-15 15-15s15 6.7 15 15c0 6.1-3.7 11.4-8.9 13.7l-0.5 2.8c6.9-2.3 11.9-8.8 11.9-16.5 0-9.6-7.9-17.5-17.5-17.5z' })
        )
    );
};

exports.default = GoBroadcast;
module.exports = exports['default'];