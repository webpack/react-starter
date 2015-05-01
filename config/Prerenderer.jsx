import React from "react";
import Router from "react-router";
import async from "async";
import StoresWrapper from "./StoresWrapper";

export default class Prerenderer {
	constructor(routes) {
		this.routes = routes;
	}

	getContent(path, stores, callback) {
		// run the path thought react-router
		Router.run(this.routes, path, function(Application, state) {
			// wait until every store is charged by the components
			// for faster response time there could be a timeout here
			async.forEach(state.routes, (route, innerCallback) => {
				if(route.handler.chargeStores) {
					route.handler.chargeStores(stores, state.params, innerCallback);
				} else {
					innerCallback();
				}
			}, () => {

				// prerender the application with the stores
				var application = React.renderToString(<StoresWrapper Component={Application} stores={stores} />);

				// get the data from the stores for embedding into the page
				var data = Object.keys(stores).reduce(function(obj, name) {
					if(!stores[name].desc.local)
						obj[name] = stores[name].getData();
					return obj;
				}, {});

				// format the full page
				callback(null, application, data);
			});
		});
	}
}
