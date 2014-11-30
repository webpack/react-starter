var ItemsStore = require("./ItemsStore");
var request = require("superagent");
var async = require("async");

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

var desc = require("./mainStoresDescriptions");
var actions = require("./actions");
module.exports = function createStores() {
	var queue = async.queue(function(fn, callback) {
		process.nextTick(function() {
			fn(callback);
		});
	}, 1);
	
	var initialData = typeof __StoreData === "object" ? __StoreData : {};

	var stores = {
		TodoItem: new ItemsStore(Object.assign({
			writeAndReadSingleItem: writeAndReadSingleItem("/_/todo/"),
			readSingleItem: readSingleItem("/_/todo/"),
			readMultipleItems: readMultipleItems("/_/todo/"),

			queue: queue,
			queueRequest: queue.push.bind(queue),
			maxWriteItems: 10
		}, desc.TodoItem), initialData.TodoItem),

		TodoList: new ItemsStore(Object.assign({
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

			queue: queue,
			queueRequest: queue.push.bind(queue),
		}, desc.TodoList), initialData.TodoList)
	}

	actions.Todo.add.listen(function(list, item) {
		stores.TodoList.updateItem(list, { $push: [item] });
	});

	actions.Todo.update.listen(function(id, update) {
		stores.TodoItem.updateItem(id, update);
	});

	return stores;
}



