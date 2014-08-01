var Reflux = require("reflux");
var Actions = require("./Actions");

module.exports = Reflux.createStore({
	CLICK_RECOGNISED: 1,

	init: function() {
		this._clicks = 0;

		this.listenTo(Actions.view.increment, this._click);
		this.listenTo(Actions.view.decrement, this._click);
		this.listenTo(Actions.view.reset, this._click);
	},

	_click: function() {
		this._clicks++;
		this.trigger(this.CLICK_RECOGNISED);
	},

	getClicks: function() {
		return this._clicks;
	}
});