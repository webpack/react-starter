var React = require("react");
var Router = require("react-router");
var routes = require("../app/" + __resourceQuery.substr(1) + "Routes");
var stores = require("../app/" + __resourceQuery.substr(1) + "Stores")();

var initialRun = true;

Router.run(routes, Router.HistoryLocation, function(Application) {
	React.withContext({
		stores: stores
	}, function() {
		React.render(<Application />, document.getElementById("content"));
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
