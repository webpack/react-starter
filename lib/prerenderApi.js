var dbs = require("./dbs");
var todosDb = dbs.todos;
var listsDb = dbs.lists;

exports.TodoItem = function(item, callback) {
	callback(null, todosDb.get(item.id, {}));
};

exports.TodoList = function(item, callback) {
	callback(null, listsDb.get(item.id, []));
};

exports.ChatRoom = function(item, callback) {
	callback(null, listsDb.get(item.id, []));
};

exports.ChatUser = function(item, callback) {
	callback(null, listsDb.get(item.id));
};
