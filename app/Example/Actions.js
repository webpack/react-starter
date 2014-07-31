var Reflux = require("reflux");

var Actions = module.exports = Reflux.createActions([
	"APPLY_OFFSET",
	"SET",
]);

Actions.SET.shouldEmit = function(value) {
	return Math.floor(value) === value;
};

// Public methods
Actions.set = function(value) {
	Actions.SET(value);
};

Actions.reset = function() {
	Actions.SET(0);
};

Actions.increment = function() {
	Actions.APPLY_OFFSET(1);
};

Actions.decrement = function() {
	Actions.APPLY_OFFSET(-1);
};
