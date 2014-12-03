var async = require("async");
var React = require("react");
var Router = require("react-router");
var routes = require("../app/" + __resourceQuery.substr(1) + "Routes");
var stores = require("../app/" + __resourceQuery.substr(1) + "Stores");
var withTimeout = require("./withTimeout");

var initialRun = true;

Router.run(routes, Router.HistoryLocation, function(Application, state) {
	stores.Router.setItemData("transition", state);
	withTimeout(async.forEach.bind(async, state.routes, function(route, callback) {
		if(route.handler.chargeStores) {
			route.handler.chargeStores(stores, state.params, callback);
		} else {
			callback();
		}
	}), 600, function() {

		stores.Router.setItemData("transition", null);
		React.withContext({
			stores: stores
		}, function() {
			React.render(<Application />, document.getElementById("content"));
		});
	});

	if(!initialRun) {
		process.nextTick(function() {
			Object.keys(stores).forEach(function(key) {
				stores[key].update();
			});
		});
	}
	initialRun = false;
});
