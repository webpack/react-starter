import async from "async";
import React from "react";
import Router from "react-router";
import withTimeout from "./withTimeout";
import ReactUpdates from "react/lib/ReactUpdates";
import StoresWrapper from "./StoresWrapper";

export default function renderApplication(routes, stores, options) {
	var timeout = options.timeout || 600;

	var initialRun = true;

	// react-router handles location
	Router.run(routes, Router.HistoryLocation, function(Application, state) {

		// On every page navigation invalidate data from the stores
		// This is not needed when the server notifies the client about changes (WebSocket, SSE)
		if(!initialRun) {
			Object.keys(stores).forEach(function(key) {
				stores[key].outdate();
			});
		}
		initialRun = false;

		ReactUpdates.batchedUpdates(function() {
			stores.Router.setItemData("transition", state);
		});

		// try to fetch data for a defined timespan
		// when the data is not fully fetched after the timeout components are rendered (with missing/old data)
		withTimeout(async.forEach.bind(async, state.routes, function(route, callback) {
			if(route.handler.chargeStores) {
				route.handler.chargeStores(stores, state.params, callback);
			} else {
				callback();
			}
		}), timeout, function() {

			ReactUpdates.batchedUpdates(function() {
				stores.Router.setItemData("transition", null);
			});

			// Render the components with the stores
			React.render(
				<StoresWrapper Component={Application} stores={stores}/>,
				document.getElementById("content")
			);
		});
	});
}
