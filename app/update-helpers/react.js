// a helper method for merging react style updates
// (not totally correct, but fine for now)
export function mergeUpdates(a, b) {
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
							o[x] = a[key][x];
						});
						Object.keys(b[key]).forEach(function(x) {
							o[x] = b[key][x];
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

export { default as applyUpdate } from "react/lib/update";
