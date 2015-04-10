import async from "async";
import React from "react";
import Router from "react-router";
import { ItemsStore } from "items-store";
var routes = require("../app/" + __resourceQuery.substr(1) + "Routes");
var storesDescriptions = require("../app/" + __resourceQuery.substr(1) + "StoresDescriptions");
import html from "../app/prerender.html";
import StoresWrapper from "./StoresWrapper";

// create stores for prerending
// readItems contains async methods for fetching the data from database
function createStoresPrerender(readItems) {
	return Object.keys(storesDescriptions).reduce(function(obj, name) {
		obj[name] = new ItemsStore(Object.assign({
			readSingleItem: readItems[name],
			queueRequest: function(fn) { fn(); }
		}, storesDescriptions[name]));
		return obj;
	}, {});
}

module.exports = function(path, readItems, scriptUrl, styleUrl, commonsUrl, callback) {
	var stores = createStoresPrerender(readItems);

	// run the path thought react-router
	Router.run(routes, path, function(Application, state) {
		// wait until every store is charged by the components
		// for faster response time there could be a timeout here
		async.forEach(state.routes, function(route, callback) {
			if(route.handler.chargeStores) {
				route.handler.chargeStores(stores, state.params, callback);
			} else {
				callback();
			}
		}, function() {

			// prerender the application with the stores
			return React.renderToString(<StoresWrapper Component={Application} stores={stores}/>);

			// format the full page
			callback(null, html
				.replace("STYLE_URL", styleUrl)
				.replace("SCRIPT_URL", scriptUrl)
				.replace("COMMONS_URL", commonsUrl)
				.replace("DATA", JSON.stringify(Object.keys(stores).reduce(function(obj, name) {
					if(!stores[name].desc.local)
						obj[name] = stores[name].getData();
					return obj;
				}, {})))
				.replace("CONTENT", application));
		});
	});
};
