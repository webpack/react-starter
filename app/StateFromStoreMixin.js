var React = require("react");
var ItemsStoreLease = require("./ItemsStore").Lease;
var ItemsStoreFetcher = require("./ItemsStore").Fetcher;

function makeStores(stores, getItem) {
	if(getItem) {
		return Object.keys(stores).reduce(function(obj, key) {
			obj[key] = getItem.bind(null, stores[key]);
			return obj;
		}, {});
	} else {
		return Object.keys(stores).reduce(function(obj, key) {
			obj[key] = function(Store, id) {
				return Store.getItem(id);
			}.bind(null, stores[key]);
			return obj;
		}, {});
	}
}

module.exports = {
	statics: {
		chargeStores: function(stores, params, callback) {
			var fetcher = new ItemsStoreFetcher(this.displayName);
			fetcher.fetch(function(getItem) {
				this.getState(makeStores(stores, getItem), params);
			}.bind(this), callback);
		}
	},
	init: function() {
		this.itemsStoreLease = new ItemsStoreLease();
	},
	componentWillUnmount: function() {
		if(this.itemsStoreLease) this.itemsStoreLease.close();
	},
	getInitialState: function() {
		var This = this.constructor;
		if(this.context.stores.prerender) {
			return Object.assign(
				This.getState(makeStores(this.context.stores), this.getParams()),
				this.getAdditionalInitialState && this.getAdditionalInitialState()
			);
		}
		if(!this.itemsStoreLease) this.itemsStoreLease = new ItemsStoreLease();
		return Object.assign(this.itemsStoreLease.capture(function(getItem) {
			return This.getState(makeStores(this.context.stores, getItem), this.getParams());
		}.bind(this), this.onUpdate, this.constructor.displayName + "_getInitialState"), 
			this.getAdditionalInitialState && this.getAdditionalInitialState());
	},
	onUpdate: function() {
		var This = this.constructor;
		this.setState(this.itemsStoreLease.capture(function(getItem) {
			return This.getState(makeStores(this.context.stores, getItem), this.getParams());
		}.bind(this), this.onUpdate, this.constructor.displayName + "_onUpdate"));
	},
	componentWillReceiveProps: function(newProps, newContext) {
		var This = this.constructor;
		this.setState(this.itemsStoreLease.capture(function(getItem) {
			return This.getState(makeStores(newContext.stores, getItem), newContext.getCurrentParams());
		}.bind(this), this.onUpdate, this.constructor.displayName + "_componentWillReceiveProps"));
	},
	contextTypes: {
		stores: React.PropTypes.object.isRequired
	}
};