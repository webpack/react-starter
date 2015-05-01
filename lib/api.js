var uuid = require("uuid");

var dbs = require("./dbs");
var todosDb = dbs.todos;
var listsDb = dbs.lists;
var chatRoomsDb = dbs.chatRooms;
var chatUsersDb = dbs.chatUsers;

module.exports = function(app) {

	// REST APIs
	// Note that there is no security in this example
	// Make sure your production server handles requests better!

	app.get("/_/list/*", function(req, res) {
		var listParam = req.params[0];
		res.setHeader("Content-Type", "application/json");
		var list = listsDb.get(listParam, []);
		var items = {};
		list.forEach(function(itemId) {
			items["_" + itemId] = todosDb.get(itemId, {});
		});
		res.end(JSON.stringify({
			list: list,
			items: items
		}));
	});

	app.post("/_/list/*", function(req, res) {
		var list = req.params[0];
		res.setHeader("Content-Type", "application/json");
		var newList = listsDb.update(list, req.body);
		var additionalItems = {};
		newList = newList.map(function(item) {
			if(typeof item === "string") return item;
			var newId = uuid.v4();
			todosDb.set(newId, item);
			additionalItems["_" + newId] = item;
			return newId;
		});
		listsDb.set(list, newList);
		res.end(JSON.stringify({
			list: newList,
			items: additionalItems
		}));
	});

	app.get("/_/todo/*", function(req, res) {
		var todos = req.params[0].split("+");
		res.setHeader("Content-Type", "application/json");
		var data;
		if(todos.length === 1) {
			data = todosDb.get(todos[0], {});
		} else {
			data = todos.reduce(function(obj, todo) {
				obj["_" + todo] = todosDb.get(todo, {});
				return obj;
			}, {});
		}
		res.end(JSON.stringify(data));
	});

	app.post("/_/todo/*", function(req, res) {
		var todo = req.params[0];
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(todosDb.update(todo, {$merge: req.body})));
	});

	app.get("/_/chat-room/*", function(req, res) {
		var roomParam = req.params[0];
		res.setHeader("Content-Type", "application/json");
		var room = chatRoomsDb.get(roomParam, []);
		var users = {};
		room.forEach(function(message) {
			var user = message.user;
			if(!users["_" + user])
				users["_" + user] = chatUsersDb.get(user);
		});
		res.end(JSON.stringify({
			users: users,
			room: room
		}));
	});

	app.post("/_/chat-room/*", function(req, res) {
		var roomParam = req.params[0];
		res.setHeader("Content-Type", "application/json");
		var newMessages = req.body;
		var room = chatRoomsDb.update(roomParam, {$push: newMessages});
		var users = {};
		room.forEach(function(message) {
			var user = message.user;
			if(!users["_" + user])
				users["_" + user] = chatUsersDb.get(user);
		});
		res.end(JSON.stringify({
			room: room,
			users: users
		}));
	});

	app.get("/_/chat-user/*", function(req, res) {
		var user = req.params[0];
		res.setHeader("Content-Type", "application/json");
		var data = chatUsersDb.get(user);
		res.end(JSON.stringify(data));
	});

};
