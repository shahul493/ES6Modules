(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *	Searchable Table
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *	Author: Jean-Pierre Sierens
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *	===========================================================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var SearchableTable = function (_React$Component) {
	_inherits(SearchableTable, _React$Component);

	function SearchableTable() {
		_classCallCheck(this, SearchableTable);

		// Initial state of the component
		var _this = _possibleConstructorReturn(this, (SearchableTable.__proto__ || Object.getPrototypeOf(SearchableTable)).call(this));

		_this.state = { filterText: '' };
		return _this;
	}

	_createClass(SearchableTable, [{
		key: 'handleUserInput',
		value: function handleUserInput(filterText) {
			// When there's a change in the state, the component and all its 
			// sub-components get updated.
			this.setState({ filterText: filterText });
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(SearchBar, {
					filterText: this.state.filterText,
					onUserInput: this.handleUserInput.bind(this)
				}),
				_react2.default.createElement(Table, {
					data: this.props.data,
					filterText: this.state.filterText
				})
			);
		}
	}]);

	return SearchableTable;
}(_react2.default.Component);

exports.default = SearchableTable;

var SearchBar = function (_React$Component2) {
	_inherits(SearchBar, _React$Component2);

	function SearchBar() {
		_classCallCheck(this, SearchBar);

		return _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).apply(this, arguments));
	}

	_createClass(SearchBar, [{
		key: 'handleChange',
		value: function handleChange() {
			// passing filter data up by using a callback
			this.props.onUserInput(
			// ref is like the id
			this.refs.filterTextInput.value);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'form',
				null,
				_react2.default.createElement('input', {
					type: 'text',
					placeholder: 'Search for one keyword...',
					ref: 'filterTextInput',
					value: this.props.filterText,
					onChange: this.handleChange.bind(this)
				})
			);
		}
	}]);

	return SearchBar;
}(_react2.default.Component);

var Table = function (_React$Component3) {
	_inherits(Table, _React$Component3);

	function Table() {
		_classCallCheck(this, Table);

		return _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).apply(this, arguments));
	}

	_createClass(Table, [{
		key: 'render',
		value: function render() {
			var sections = [];
			var data = this.props.data;
			data.forEach(function (product) {
				if (product.name.indexOf(this.props.filterText) === -1) {
					return;
				}
				sections.push(_react2.default.createElement(Section, { key: product.name, data: product }));
			}.bind(this));
			return _react2.default.createElement(
				'div',
				null,
				sections
			);
		}
	}]);

	return Table;
}(_react2.default.Component);

var Section = function (_React$Component4) {
	_inherits(Section, _React$Component4);

	function Section() {
		_classCallCheck(this, Section);

		return _possibleConstructorReturn(this, (Section.__proto__ || Object.getPrototypeOf(Section)).apply(this, arguments));
	}

	_createClass(Section, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'p',
					null,
					this.props.data.name,
					' = ',
					this.props.data.price,
					' '
				)
			);
		}
	}]);

	return Section;
}(_react2.default.Component);

},{"react":"react"}],2:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SearchableTable = require('./SearchableTable');

var _SearchableTable2 = _interopRequireDefault(_SearchableTable);

var _data = require('./data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Filterable CheatSheet Component
/*
*	Author: Jean-Pierre Sierens
*	===========================================================================
*/

_reactDom2.default.render(_react2.default.createElement(_SearchableTable2.default, { data: _data.data }), document.getElementById('searchableTable'));

},{"./SearchableTable":1,"./data":3,"react":"react","react-dom":"react-dom"}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var data = exports.data = [{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football" }, { category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball" }, { category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball" }, { category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch" }, { category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5" }, { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" }];

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXFNlYXJjaGFibGVUYWJsZS5qcyIsImFwcFxcYXBwLmpzIiwiYXBwXFxkYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNNQTs7Ozs7Ozs7OzsrZUFOQTs7Ozs7O0lBUXFCLGU7OztBQUNwQiw0QkFBYztBQUFBOztBQUViO0FBRmE7O0FBR2IsUUFBSyxLQUFMLEdBQWEsRUFBQyxZQUFZLEVBQWIsRUFBYjtBQUhhO0FBSWI7Ozs7a0NBQ2UsVSxFQUFZO0FBQzNCO0FBQ0E7QUFDQSxRQUFLLFFBQUwsQ0FBYyxFQUFDLFlBQVksVUFBYixFQUFkO0FBQ0E7OzsyQkFDUTtBQUNSLFVBQ0M7QUFBQTtBQUFBO0FBQ0Msa0NBQUMsU0FBRDtBQUNDLGlCQUFZLEtBQUssS0FBTCxDQUFXLFVBRHhCO0FBRUMsa0JBQWEsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCO0FBRmQsTUFERDtBQUtDLGtDQUFDLEtBQUQ7QUFDQyxXQUFNLEtBQUssS0FBTCxDQUFXLElBRGxCO0FBRUMsaUJBQVksS0FBSyxLQUFMLENBQVc7QUFGeEI7QUFMRCxJQUREO0FBWUE7Ozs7RUF4QjJDLGdCQUFNLFM7O2tCQUE5QixlOztJQTJCZixTOzs7Ozs7Ozs7OztpQ0FDVTtBQUNkO0FBQ0EsUUFBSyxLQUFMLENBQVcsV0FBWDtBQUNDO0FBQ0EsUUFBSyxJQUFMLENBQVUsZUFBVixDQUEwQixLQUYzQjtBQUlBOzs7MkJBQ1E7QUFDUixVQUNDO0FBQUE7QUFBQTtBQUNDO0FBQ0MsV0FBSyxNQUROO0FBRUMsa0JBQVksMkJBRmI7QUFHQyxVQUFJLGlCQUhMO0FBSUMsWUFBUSxLQUFLLEtBQUwsQ0FBVyxVQUpwQjtBQUtDLGVBQVcsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCO0FBTFo7QUFERCxJQUREO0FBV0E7Ozs7RUFwQnNCLGdCQUFNLFM7O0lBdUJ4QixLOzs7Ozs7Ozs7OzsyQkFDSTtBQUNSLE9BQUksV0FBVyxFQUFmO0FBQ0EsT0FBSSxPQUFPLEtBQUssS0FBTCxDQUFXLElBQXRCO0FBQ0EsUUFBSyxPQUFMLENBQWEsVUFBUyxPQUFULEVBQWtCO0FBQzlCLFFBQUksUUFBUSxJQUFSLENBQWEsT0FBYixDQUFxQixLQUFLLEtBQUwsQ0FBVyxVQUFoQyxNQUFnRCxDQUFDLENBQXJELEVBQXdEO0FBQ3ZEO0FBQ0E7QUFDRCxhQUFTLElBQVQsQ0FBYyw4QkFBQyxPQUFELElBQVMsS0FBSyxRQUFRLElBQXRCLEVBQTRCLE1BQU0sT0FBbEMsR0FBZDtBQUNBLElBTFksQ0FLWCxJQUxXLENBS04sSUFMTSxDQUFiO0FBTUEsVUFDQztBQUFBO0FBQUE7QUFBTTtBQUFOLElBREQ7QUFHQTs7OztFQWJrQixnQkFBTSxTOztJQWdCcEIsTzs7Ozs7Ozs7Ozs7MkJBQ0k7QUFDUixVQUNDO0FBQUE7QUFBQTtBQUNDO0FBQUE7QUFBQTtBQUFJLFVBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBcEI7QUFBQTtBQUE2QixVQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQTdDO0FBQUE7QUFBQTtBQURELElBREQ7QUFLQTs7OztFQVBvQixnQkFBTSxTOzs7OztBQ3JFNUI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTtBQVZBOzs7OztBQVdBLG1CQUFTLE1BQVQsQ0FBaUIsMkRBQWlCLGdCQUFqQixHQUFqQixFQUFpRCxTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLENBQWpEOzs7Ozs7OztBQ1hPLElBQU0sc0JBQU8sQ0FDbEIsRUFBQyxVQUFVLGdCQUFYLEVBQTZCLE9BQU8sUUFBcEMsRUFBOEMsU0FBUyxJQUF2RCxFQUE2RCxNQUFNLFVBQW5FLEVBRGtCLEVBRWxCLEVBQUMsVUFBVSxnQkFBWCxFQUE2QixPQUFPLE9BQXBDLEVBQTZDLFNBQVMsSUFBdEQsRUFBNEQsTUFBTSxVQUFsRSxFQUZrQixFQUdsQixFQUFDLFVBQVUsZ0JBQVgsRUFBNkIsT0FBTyxRQUFwQyxFQUE4QyxTQUFTLEtBQXZELEVBQThELE1BQU0sWUFBcEUsRUFIa0IsRUFJbEIsRUFBQyxVQUFVLGFBQVgsRUFBMEIsT0FBTyxRQUFqQyxFQUEyQyxTQUFTLElBQXBELEVBQTBELE1BQU0sWUFBaEUsRUFKa0IsRUFLbEIsRUFBQyxVQUFVLGFBQVgsRUFBMEIsT0FBTyxTQUFqQyxFQUE0QyxTQUFTLEtBQXJELEVBQTRELE1BQU0sVUFBbEUsRUFMa0IsRUFNbEIsRUFBQyxVQUFVLGFBQVgsRUFBMEIsT0FBTyxTQUFqQyxFQUE0QyxTQUFTLElBQXJELEVBQTJELE1BQU0sU0FBakUsRUFOa0IsQ0FBYiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuKlx0U2VhcmNoYWJsZSBUYWJsZVxuKlx0QXV0aG9yOiBKZWFuLVBpZXJyZSBTaWVyZW5zXG4qXHQ9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaGFibGVUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0Ly8gSW5pdGlhbCBzdGF0ZSBvZiB0aGUgY29tcG9uZW50XG5cdFx0dGhpcy5zdGF0ZSA9IHtmaWx0ZXJUZXh0OiAnJ307XG5cdH1cblx0aGFuZGxlVXNlcklucHV0KGZpbHRlclRleHQpIHtcblx0XHQvLyBXaGVuIHRoZXJlJ3MgYSBjaGFuZ2UgaW4gdGhlIHN0YXRlLCB0aGUgY29tcG9uZW50IGFuZCBhbGwgaXRzIFxuXHRcdC8vIHN1Yi1jb21wb25lbnRzIGdldCB1cGRhdGVkLlxuXHRcdHRoaXMuc2V0U3RhdGUoe2ZpbHRlclRleHQ6IGZpbHRlclRleHR9KTtcblx0fVxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxTZWFyY2hCYXIgXG5cdFx0XHRcdFx0ZmlsdGVyVGV4dD17dGhpcy5zdGF0ZS5maWx0ZXJUZXh0fVxuXHRcdFx0XHRcdG9uVXNlcklucHV0PXt0aGlzLmhhbmRsZVVzZXJJbnB1dC5iaW5kKHRoaXMpfVxuXHRcdFx0XHQvPlxuXHRcdFx0XHQ8VGFibGUgXG5cdFx0XHRcdFx0ZGF0YT17dGhpcy5wcm9wcy5kYXRhfSBcblx0XHRcdFx0XHRmaWx0ZXJUZXh0PXt0aGlzLnN0YXRlLmZpbHRlclRleHR9XG5cdFx0XHRcdC8+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG5cbmNsYXNzIFNlYXJjaEJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdGhhbmRsZUNoYW5nZSgpIHtcblx0XHQvLyBwYXNzaW5nIGZpbHRlciBkYXRhIHVwIGJ5IHVzaW5nIGEgY2FsbGJhY2tcblx0XHR0aGlzLnByb3BzLm9uVXNlcklucHV0KFxuXHRcdFx0Ly8gcmVmIGlzIGxpa2UgdGhlIGlkXG5cdFx0XHR0aGlzLnJlZnMuZmlsdGVyVGV4dElucHV0LnZhbHVlXG5cdFx0KTtcblx0fVxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxmb3JtPlxuXHRcdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdFx0dHlwZT1cInRleHRcIiBcblx0XHRcdFx0XHRwbGFjZWhvbGRlcj1cIlNlYXJjaCBmb3Igb25lIGtleXdvcmQuLi5cIiBcblx0XHRcdFx0XHRyZWY9XCJmaWx0ZXJUZXh0SW5wdXRcIlxuXHRcdFx0XHRcdHZhbHVlPSB7dGhpcy5wcm9wcy5maWx0ZXJUZXh0fVxuXHRcdFx0XHRcdG9uQ2hhbmdlPSB7dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0gXG5cdFx0XHRcdC8+XG5cdFx0XHQ8L2Zvcm0+XG5cdFx0KTtcblx0fVxufVxuXG5jbGFzcyBUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdHJlbmRlcigpIHtcblx0XHRsZXQgc2VjdGlvbnMgPSBbXTtcblx0XHRsZXQgZGF0YSA9IHRoaXMucHJvcHMuZGF0YTtcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24ocHJvZHVjdCkge1xuXHRcdFx0aWYgKHByb2R1Y3QubmFtZS5pbmRleE9mKHRoaXMucHJvcHMuZmlsdGVyVGV4dCkgPT09IC0xKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHNlY3Rpb25zLnB1c2goPFNlY3Rpb24ga2V5PXtwcm9kdWN0Lm5hbWV9IGRhdGE9e3Byb2R1Y3R9IC8+KTtcblx0XHR9LmJpbmQodGhpcykpO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PntzZWN0aW9uc308L2Rpdj5cblx0XHQpO1xuXHR9XG59XG5cbmNsYXNzIFNlY3Rpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxwPnt0aGlzLnByb3BzLmRhdGEubmFtZX0gPSB7dGhpcy5wcm9wcy5kYXRhLnByaWNlfSA8L3A+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG4iLCIvKlxuKlx0QXV0aG9yOiBKZWFuLVBpZXJyZSBTaWVyZW5zXG4qXHQ9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBTZWFyY2hhYmxlVGFibGUgZnJvbSAnLi9TZWFyY2hhYmxlVGFibGUnO1xuaW1wb3J0IHtkYXRhfSBmcm9tICcuL2RhdGEnO1xuXG4vLyBGaWx0ZXJhYmxlIENoZWF0U2hlZXQgQ29tcG9uZW50XG5SZWFjdERPTS5yZW5kZXIoIDxTZWFyY2hhYmxlVGFibGUgZGF0YT17ZGF0YX0vPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaGFibGVUYWJsZScpICk7IiwiZXhwb3J0IGNvbnN0IGRhdGEgPSBbXG4gIHtjYXRlZ29yeTogXCJTcG9ydGluZyBHb29kc1wiLCBwcmljZTogXCIkNDkuOTlcIiwgc3RvY2tlZDogdHJ1ZSwgbmFtZTogXCJGb290YmFsbFwifSxcbiAge2NhdGVnb3J5OiBcIlNwb3J0aW5nIEdvb2RzXCIsIHByaWNlOiBcIiQ5Ljk5XCIsIHN0b2NrZWQ6IHRydWUsIG5hbWU6IFwiQmFzZWJhbGxcIn0sXG4gIHtjYXRlZ29yeTogXCJTcG9ydGluZyBHb29kc1wiLCBwcmljZTogXCIkMjkuOTlcIiwgc3RvY2tlZDogZmFsc2UsIG5hbWU6IFwiQmFza2V0YmFsbFwifSxcbiAge2NhdGVnb3J5OiBcIkVsZWN0cm9uaWNzXCIsIHByaWNlOiBcIiQ5OS45OVwiLCBzdG9ja2VkOiB0cnVlLCBuYW1lOiBcImlQb2QgVG91Y2hcIn0sXG4gIHtjYXRlZ29yeTogXCJFbGVjdHJvbmljc1wiLCBwcmljZTogXCIkMzk5Ljk5XCIsIHN0b2NrZWQ6IGZhbHNlLCBuYW1lOiBcImlQaG9uZSA1XCJ9LFxuICB7Y2F0ZWdvcnk6IFwiRWxlY3Ryb25pY3NcIiwgcHJpY2U6IFwiJDE5OS45OVwiLCBzdG9ja2VkOiB0cnVlLCBuYW1lOiBcIk5leHVzIDdcIn1cbl07Il19
