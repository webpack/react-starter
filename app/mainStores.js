var ItemsStore = require("items-store/ItemsStore");
var async = require("async");
var request = require("superagent");


// a few helper methods for a REST API

function writeAndReadSingleItem(path, resultHandler) {
	resultHandler = resultHandler || function(result) { return result; };
	return function(options, callback) {
		request.post(path + options.id)
			.set("Accept", "application/json")
			.type("json")
			.send(options.update)
			.end(function(err, res) {
				if(err) return callback(err);
				callback(null, resultHandler(res.body));
			});
	}
}

function readSingleItem(path, resultHandler) {
	resultHandler = resultHandler || function(result) { return result; };
	return function(options, callback) {
		request.get(path + options.id)
			.set("Accept", "application/json")
			.type("json")
			.end(function(err, res) {
				if(err) return callback(err);
				callback(null, resultHandler(res.body));
			});
	}
}

function readMultipleItems(path, resultHandler) {
	resultHandler = resultHandler || function(result) { return result; };
	return function(optionsArr, callback) {
		request.get(path + optionsArr.map(function(options) {
			return options.id;
		}).join("+"))
			.set("Accept", "application/json")
			.type("json")
			.end(function(err, res) {
				if(err) return callback(err);
				callback(null, resultHandler(res.body));
			});
	}
}

// a queue that allows only one REST request at a time
// it also defers the requests to next tick, to aggregate multiple changes
var queue = async.queue(function(fn, callback) {
	process.nextTick(function() {
		fn(callback);
	});
}, 1);

// load embedded initial store data from prerendering if available
var initialData = typeof __StoreData === "object" ? __StoreData : {};

// take the store descriptions as base
var desc = require("./mainStoresDescriptions");

var stores = module.exports = {
	Router: new ItemsStore(desc.Router),

	TodoList: new ItemsStore(Object.assign({
		// REST API at "/_/list/"
		// the API also returns "TodoItem"s for requests
		
		writeAndReadSingleItem: writeAndReadSingleItem("/_/list/", function(result) {
			Object.keys(result.items).forEach(function(key) {
				stores.TodoItem.setItemData(key.substr(1), result.items[key]);
			});
			return result.list;
		}),
		readSingleItem: readSingleItem("/_/list/", function(result) {
			Object.keys(result.items).forEach(function(key) {
				stores.TodoItem.setItemData(key.substr(1), result.items[key]);
			});
			return result.list;
		}),

		queueRequest: queue.push.bind(queue),
	}, desc.TodoList), initialData.TodoList),

	TodoItem: new ItemsStore(Object.assign({
		// REST API at "/_/todo"
		// it supports reading up to 10 items at once
		
		writeAndReadSingleItem: writeAndReadSingleItem("/_/todo/"),
		readSingleItem: readSingleItem("/_/todo/"),
		readMultipleItems: readMultipleItems("/_/todo/"),

		queueRequest: queue.push.bind(queue),
		maxWriteItems: 10
	}, desc.TodoItem), initialData.TodoItem)
};


// bind actions to stores

var actions = require("./actions");

actions.Todo.add.listen(function(list, item) {
	stores.TodoList.updateItem(list, { $push: [item] });
});

actions.Todo.update.listen(function(id, update) {
	stores.TodoItem.updateItem(id, update);
});
