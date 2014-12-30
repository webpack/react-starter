// a helper method for merging react style updates
// (not totally correct, but fine for now)
function mergeUpdates(a, b) {
	if(typeof a === "object" && typeof b === "object") {
		var res = {};
		Object.keys(a).concat(Object.keys(b)).forEach(function(key) {
			if(a[key] && b[key]) {
				switch(key) {
					case "$push":
						res[key] = a[key].concat(b[key]);
						break;
					case "$unshift":
						res[key] = b[key].concat(a[key]);
						break;
					case "$splice":
						res[key] = a[key].concat(b[key]);
						break;
					case "$set":
						res[key] = b[key];
						break;
					case "$merge":
						var o = res[key] = {};
						Object.keys(a[key]).forEach(function(x) {
							o[x] = a[key][x]
						});
						Object.keys(b[key]).forEach(function(x) {
							o[x] = b[key][x]
						});
						break;
				}
				res[key] = mergeUpdates(a[key], b[key]);
			} else if(a[key])
				res[key] = a[key];
			else
				res[key] = b[key];
		});
	}
	return a || b;
}

module.exports = {
	// the Router is a local store that handles information about data fetching
	// see ../config/app.jsx
	Router: {
		local: true,
		readSingleItem: function(item, callback) {
			callback(null, item.oldData);
		}
	},
	
	// stores TodoLists
	// changes are react style updates
	TodoList: {
		applyUpdate: require("react/lib/update"),
		mergeUpdates: mergeUpdates,
	},

	// stores TodoItems
	// changes are in the default format
	TodoItem: {}
}
