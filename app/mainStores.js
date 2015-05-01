/*globals __StoreData */

// This file describe where stores read data from and where stores write data to.

import ItemsStore from "items-store/ItemsStore";
import async from "async";
import { readSingleItem, writeAndReadSingleItem, readMultipleItems } from "fetch-helpers/rest";

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
import desc from "./mainStoresDescriptions";

var stores;

// helper methods to extract embedded data from results

function todoListPlusItems(result) {
	Object.keys(result.items).forEach(function(key) {
		stores.TodoItem.setItemData(key.substr(1), result.items[key]);
	});
	return result.list;
}

function chatRoomPlusUsers(result) {
	Object.keys(result.users).forEach(function(key) {
		stores.ChatUser.setItemData(key.substr(1), result.users[key]);
	});
	return result.room;
}

// the stores
stores = module.exports = {
	Router: new ItemsStore(desc.Router),

	TodoList: new ItemsStore({
		// REST API at "/_/list/" (read/write)
		// the API also returns "TodoItem"s for requests

		writeAndReadSingleItem: writeAndReadSingleItem("/_/list/", todoListPlusItems),
		readSingleItem: readSingleItem("/_/list/", todoListPlusItems),

		queueRequest: queue.push.bind(queue),
		...desc.TodoList
	}, initialData.TodoList),

	TodoItem: new ItemsStore({
		// REST API at "/_/todo" (read/write)
		// it supports reading up to 10 items at once

		writeAndReadSingleItem: writeAndReadSingleItem("/_/todo/"),
		readSingleItem: readSingleItem("/_/todo/"),
		readMultipleItems: readMultipleItems("/_/todo/"),

		queueRequest: queue.push.bind(queue),
		maxWriteItems: 10,
		...desc.TodoItem
	}, initialData.TodoItem),

	ChatRoom: new ItemsStore({
		// REST API at "/_/chat-room" (read/write)
		// the API also returns "ChatUsers"s for requests

		writeAndReadSingleItem: writeAndReadSingleItem("/_/chat-room/", chatRoomPlusUsers),
		readSingleItem: readSingleItem("/_/chat-room/", chatRoomPlusUsers),

		queueRequest: queue.push.bind(queue),
		...desc.ChatRoom
	}, initialData.ChatRoom),

	ChatUser: new ItemsStore({
		// REST API at "/_/chat-user" (read only)

		readSingleItem: readSingleItem("/_/chat-user/"),

		queueRequest: queue.push.bind(queue),
		...desc.ChatUser
	}, initialData.ChatUser)
};


// bind actions to stores

import { Todo, Chat } from "./actions";

Todo.fetch.listen(function() {
	stores.TodoList.update();
	stores.TodoItem.update();
});

Todo.add.listen(function(list, item) {
	stores.TodoList.updateItem(list, { $push: [item] });
});

Todo.update.listen(function(id, update) {
	stores.TodoItem.updateItem(id, update);
});

Todo.fetchItem.listen(function(id) {
	stores.TodoItem.update(id);
});

Chat.fetch.listen(function() {
	stores.ChatRoom.update();
	stores.ChatUser.update();
});

Chat.send.listen((room, msg) => {
	stores.ChatRoom.updateItem(room, [msg]);
});
