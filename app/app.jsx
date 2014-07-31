/** @jsx React.DOM */

var Reflux = require("reflux");
Reflux.nextTick(process.nextTick);

var React = require("react");
var Application = require("./Application");

React.renderComponent(<Application />, document.body);
