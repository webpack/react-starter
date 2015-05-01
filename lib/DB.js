var update = require("react/lib/update");

function DB(initialData) {
	this.data = initialData || {};
}

module.exports = DB;

DB.prototype.get = function(id, createDefaultData) {
	var d = this.data["_" + id];
	if(!d) {
		this.data["_" + id] = createDefaultData;
		return createDefaultData;
	}
	return d;
};

DB.prototype.update = function(id, upd) {
	var res = this.data["_" + id] = update(this.data["_" + id], upd);
	return res;
};

DB.prototype.set = function(id, data) {
	var res = this.data["_" + id] = data;
	return res;
};

DB.prototype.getIds = function() {
	return Object.keys(this.data).map(function(key) {
		return key.substr(1);
	});
};
