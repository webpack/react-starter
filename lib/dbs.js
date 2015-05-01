var uuid = require("uuid");
var DB = require("./DB");

// The fake database
var todosDb = new DB();
var listsDb = new DB();
var chatRoomsDb = new DB();

function initData() {
	// Initial data
	var mylist = [uuid.v4(), uuid.v4(), uuid.v4()];
	var otherlist = [uuid.v4()];
	listsDb.set("mylist", mylist);
	listsDb.set("otherlist", otherlist);
	todosDb.set(mylist[0], {
		text: "Hello World"
	});
	todosDb.set(mylist[1], {
		text: "Eat something"
	});
	todosDb.set(mylist[2], {
		text: "Nothing"
	});
	todosDb.set(otherlist[0], {
		text: "12345679"
	});

	chatRoomsDb.set("home", [
		{
			user: "bot",
			message: "Welcome"
		}
	]);
	chatRoomsDb.set("room1", []);
}

initData();

exports.todos = todosDb;
exports.lists = listsDb;
exports.chatRooms = chatRoomsDb;
exports.chatUsers = {
	get: function(name) {
		var count = chatRoomsDb.getIds().map(function(room) {
			return chatRoomsDb.get(room).filter(function(message) {
				return message.user === name;
			}).length;
		}).reduce(function(a, b) {
			return a + b;
		}, 0);
		return {
			name: name,
			messages: count
		};
	}
};
