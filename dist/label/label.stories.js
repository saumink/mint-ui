"use strict";

var _react = _interopRequireDefault(require("react"));

var _ = _interopRequireDefault(require("."));

var _storybook = require("../storybook");

var _react2 = require("@storybook/addon-knobs/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_storybook.stories.add("Label", function () {
  return _react.default.createElement(_.default, {
    text: (0, _react2.text)('text', 'Sample label'),
    isActive: (0, _react2.boolean)('isActive', true)
  });
}, {
  info: _react.default.createElement(_.default, {
    text: (0, _react2.text)('text', 'Sample label'),
    isActive: (0, _react2.boolean)('isActive', true)
  })
});