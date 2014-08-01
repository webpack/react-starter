var Reflux = require("reflux");

var Actions = module.exports = Reflux.createActions([
	"applyOffset",
	"set",
]);

Actions.view = Reflux.createActions([
	"increment",
	"decrement",
	"reset",
]);

Actions.server = Reflux.createActions([
	"update",
]);

// Hooks
Actions.set.shouldEmit = function(value) {
	return Math.floor(value) === value;
};

// View actions
Actions.view.reset.listen(function() {
	Actions.set(0);
});

Actions.view.increment.listen(function() {
	Actions.applyOffset(1);
});

Actions.view.decrement.listen(function() {
	Actions.applyOffset(-1);
});

// Server actions

Actions.server.update.listen(function(value) {
	Actions.set(value);
});
