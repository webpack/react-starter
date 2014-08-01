var Reflux = require("reflux");
var Actions = require("./Actions");

module.exports = Reflux.createStore({
	OFFSET_APPLIED: 1,
	VALUE_SET: 2,

	init: function() {
		this._value = 1;

		this.listenTo(Actions.applyOffset, this._applyOffset);
		this.listenTo(Actions.set, this._set);
	},

	_applyOffset: function(offset) {
		this._value += offset;
		this.trigger(this.OFFSET_APPLIED);
	},

	_set: function(value) {
		this._value = value;
		this.trigger(this.VALUE_SET);
	},

	getValue: function() {
		return this._value;
	}
});