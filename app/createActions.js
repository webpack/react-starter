var EventEmitter = require("events").EventEmitter;

module.exports = function(array) {
	var obj = {};
	array.forEach(function(name) {
		var ee = new EventEmitter();
		obj[name] = function() {
			var args = Array.prototype.slice.call(arguments);
			ee.emit("trigger", args);
		};
		obj[name].listen = function(callback, bindContext) {
			ee.addListener("trigger", function(args) {
				callback.apply(bindContext, args);
			});
		};
	});
	return obj;
};
