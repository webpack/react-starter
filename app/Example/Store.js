var Reflux = require("reflux");
var Actions = require("./Actions");

module.exports = Reflux.createStore({
	init: function() {
		this._value = 1;
	
		this.listenTo(Actions.APPLY_OFFSET, this._applyOffset);
		this.listenTo(Actions.SET, this._set);
	},
	
	_applyOffset: function(offset) {
		this._value += offset;
		this.trigger();
	},
	
	_set: function(value) {
		this._value = value;
		this.trigger();
	},
	
	get: function() {
		return this._value;
	}
});