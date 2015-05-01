var dbs = require("./dbs");
var todosDb = dbs.todos;
var listsDb = dbs.lists;
var chatRoomsDb = dbs.chatRooms;
var chatUsersDb = dbs.chatUsers;

module.exports = function(/* req */) {
	var api = {};

	api.TodoItem = function(item, callback) {
		callback(null, todosDb.get(item.id, {}));
	};

	api.TodoList = function(item, callback) {
		callback(null, listsDb.get(item.id, []));
	};

	api.ChatRoom = function(item, callback) {
		callback(null, chatRoomsDb.get(item.id, []));
	};

	api.ChatUser = function(item, callback) {
		callback(null, chatUsersDb.get(item.id));
	};

	return api;
};
