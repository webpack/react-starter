module.exports = function(options) {

	var express = require("express");
	var bodyParser = require("body-parser");
	var path = require("path");
	var uuid = require("uuid");
	var DB = require("./DB");

	// require the page rendering logic
	var renderApplication = options.prerender ?
		require("../build/prerender/main.js") :
		require("../config/simple.js");

	// load bundle information from stats
	var stats = require("../build/stats.json");

	var publicPath = stats.publicPath;

	var STYLE_URL = options.separateStylesheet && (publicPath + "main.css?" + stats.hash);
	var SCRIPT_URL = publicPath + [].concat(stats.assetsByChunkName.main)[0];
	var COMMONS_URL = publicPath + [].concat(stats.assetsByChunkName.commons)[0];

	var app = express();

	// serve the static assets
	app.use("/_assets", express.static(path.join(__dirname, "..", "build", "public"), {
		maxAge: "200d"
	}));

	// artifical delay
	app.use(function(req, res, next) {
		setTimeout(next, Math.ceil(Math.random() * 1000));
	});

	app.use(bodyParser.json());

	// The fake database
	var todosDb = new DB();
	var listsDb = new DB();

	(function() {
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
	}());

	// REST APIs
	// Note that there is no security in this example
	// Make sure your production server handles requests better!

	app.get("/_/list/*", function(req, res) {
		var list = req.params[0];
		res.setHeader("Content-Type", "application/json");
		var list = listsDb.get(list, []);
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
		var todo = req.params[0].split("+");
		res.setHeader("Content-Type", "application/json");
		if(todo.length === 1) {
			data = todosDb.get(todo[0], {});
		} else {
			data = todo.reduce(function(obj, todo) {
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

	// application
	app.get("/*", function(req, res) {
		renderApplication(req.path, {
			TodoItem: function(item, callback) {
				callback(null, todosDb.get(item.id, {}));
			},
			TodoList: function(item, callback) {
				callback(null, listsDb.get(item.id, []));
			}
		}, SCRIPT_URL, STYLE_URL, COMMONS_URL, function(err, html) {
			res.contentType = "text/html; charset=utf8";
			res.end(html);
		});
	});


	var port = +(process.env.PORT || options.defaultPort || 8080);
	app.listen(port, function() {
		console.log("Server listening on port " + port);
	});
};