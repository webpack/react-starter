/** @jsx React.DOM */

var async = require("async");
var React = require("react");
var Router = require("react-router");
var routes = require("../app/" + __resourceQuery.substr(1) + "Routes");
var storesPrerender = require("../app/" + __resourceQuery.substr(1) + "StoresPrerender");
var html = require("../app/prerender.html");

module.exports = function(path, readItems, scriptUrl, styleUrl, commonsUrl, callback) {
	var stores = storesPrerender(readItems);
	Router.run(routes(Object.assign({ prerender: true }, stores)), path, function(Application, state) {
		async.forEach(state.routes, function(route, callback) {
			if(route.handler.chargeStores) {
				route.handler.chargeStores(stores, state.params, callback);
			} else {
				callback();
			}
		}, function() {
			var application = React.renderToString(<Application />);
			callback(null, html
				.replace("STYLE_URL", styleUrl)
				.replace("SCRIPT_URL", scriptUrl)
				.replace("COMMONS_URL", commonsUrl)
				.replace("DATA", JSON.stringify(Object.keys(stores).reduce(function(obj, name) {
					obj[name] = stores[name].getData();
					return obj;
				}, {})))
				.replace("CONTENT", application));
		});
	});
};
