var ItemsStore = require("./ItemsStore");

var desc = require("./mainStoresDescriptions");
module.exports = function createStores(readItems) {
	return Object.keys(desc).reduce(function(obj, name) {
		obj[name] = new ItemsStore(Object.assign({
			readSingleItem: readItems[name]
		}, desc[name]))
		return obj;
	}, {});
}
