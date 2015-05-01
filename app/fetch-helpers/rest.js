import request from "superagent";
import ReactUpdates from "react/lib/ReactUpdates";

// a few helper methods for a REST API

// batchedCallback batches component updates
// which occur within the callback
function batchedCallback(callback) {
	return function(err, res) {
		ReactUpdates.batchedUpdates(callback.bind(null, err, res));
	};
}

export function writeAndReadSingleItem(path, resultHandler) {
	resultHandler = resultHandler || function(result) { return result; };
	return function(options, callback) {
		request.post(path + options.id)
			.set("Accept", "application/json")
			.type("json")
			.send(options.update)
			.end(batchedCallback(function(err, res) {
				if(err) return callback(err);
				if(res.status !== 200)
					return callback(new Error("Request failed with " + res.status + ": " + res.text));
				callback(null, resultHandler(res.body));
			}));
	};
}

export function readSingleItem(path, resultHandler) {
	resultHandler = resultHandler || function(result) { return result; };
	return function(options, callback) {
		request.get(path + options.id)
			.set("Accept", "application/json")
			.type("json")
			.end(batchedCallback(function(err, res) {
				if(err) return callback(err);
				if(res.status !== 200)
					return callback(new Error("Request failed with " + res.status + ": " + res.text));
				callback(null, resultHandler(res.body));
			}));
	};
}

export function readMultipleItems(path, resultHandler) {
	resultHandler = resultHandler || function(result) { return result; };
	return function(optionsArr, callback) {
		request.get(path + optionsArr.map(function(options) {
			return options.id;
		}).join("+"))
			.set("Accept", "application/json")
			.type("json")
			.end(batchedCallback(function(err, res) {
				if(err) return callback(err);
				if(res.status !== 200)
					return callback(new Error("Request failed with " + res.status + ": " + res.text));
				callback(null, resultHandler(res.body));
			}));
	};
}
