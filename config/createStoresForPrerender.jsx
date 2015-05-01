import { ItemsStore } from "items-store";

// create stores for prerending
// readItems contains async methods for fetching the data from database
export default function createStoresForPrerender(storesDescriptions, readItems) {
	return Object.keys(storesDescriptions).reduce(function(obj, name) {
		obj[name] = new ItemsStore(Object.assign({
			readSingleItem: readItems[name],
			queueRequest: function(fn) { fn(); }
		}, storesDescriptions[name]));
		return obj;
	}, {});
}
