function ItemsStore(desc, initialData) {
	desc.applyUpdate = desc.applyUpdate || applyUpdate;
	desc.mergeUpdates = desc.mergeUpdates || mergeUpdates;
	desc.rebaseUpdate = desc.rebaseUpdate || rebaseUpdate;
	desc.queueRequest = desc.queueRequest || process.nextTick.bind(process);
	this.desc = desc;
	this.items = initialData ? Object.keys(initialData).reduce(function(obj, key) {
		obj[key] = {
			data: initialData[key],
			tick: 0
		};
		return obj;
	}, {}) : {};
	this.requesting = false;
	this.invalidItems = [];
	this.updateTick = 0;
}

module.exports = ItemsStore;

ItemsStore.Lease = ItemsStoreLease;
ItemsStore.Fetcher = ItemsStoreFetcher;

/*
item = { outdated: true }
no item data available and data should be requested

item = { data: {} }
item data available

item = { data: {}, outdated: true }
item data available, but data should be renewed by request

item = { data: {}, update: {}, newData: {} }
item data available, but it should be updated with the "update" and "newData"

item = { update: {} }
no item data available and it should be updated with the "update"

*/

ItemsStore.prototype.getData = function() {
	var data = {};
	var hasData = false;
	Object.keys(this.items).forEach(function(key) {
		if(this.items[key].data) {
			data[key] = this.items[key].data;
			hasData = true;
		}
	}, this);
	if(hasData)
		return data;
};

ItemsStore.prototype.update = function() {
	this.updateTick++;
	Object.keys(this.items).forEach(function(key) {
		var id = key.substr(1);
		var item = this.items[key];
		if(!item) return;
		if(!item.outdated && item.handlers && item.handlers.length > 0) {
			item.outdated = true;
			this.invalidateItem(id);
		}
	}, this);
};

ItemsStore.prototype.listenToItem = function(id, handler, ident) {
	if(typeof handler !== "function") throw new Error("handler argument must be a function");
	var lease = {
		ident: ident,
		close: function lease() {
			var item = this.items["_" + id];
			if(!item) return;
			var idx = item.handlers.indexOf(handler);
			if(idx < 0) return;
			item.handlers.splice(idx, 1);
			item.leases.splice(idx, 1);
			// TODO stream: if item.handlers.length === 0
		}.bind(this)
	};
	var item = this.items["_" + id];
	if(!item) {
		this.items["_" + id] = {
			handlers: [handler],
			leases: [lease],
			outdated: true
		};
		this.invalidateItem(id);
	} else {
		if(item.handlers) {
			var idx = item.handlers.indexOf(handler);
			if(idx >= 0) {
				return item.leases[idx];
			}
			item.handlers.push(handler);
			item.leases.push(lease);
		} else {
			item.handlers = [handler];
			item.leases = [lease];
		}
		if(item.tick < this.updateTick && !item.outdated) {
			item.outdated = true;
			this.invalidateItem(id);
		}
	}
	// TODO stream: start streaming
	return lease;
}

ItemsStore.prototype.waitForItem = function(id, callback) {
	var onUpdate = function() {
		if(!item.data) return;
		var idx = item.handlers.indexOf(onUpdate);
		if(idx < 0) return;
		item.handlers.splice(idx);
		item.leases.splice(idx);
		callback();
	}

	var item = this.items["_" + id];
	if(!item) {
		item = this.items["_" + id] = {
			handlers: [onUpdate],
			leases: [null],
			outdated: true
		};
		this.invalidateItem(id);
	} else {
		if(item.data) {
			callback();
			return;
		}
		if(item.handlers) {
			item.handlers.push(onUpdate);
			item.leases.push(null);
		} else {
			item.handlers = [onUpdate];
			item.leases = [null];
		}
		if(!item.outdated && item.tick < this.updateTick) {
			item.outdated = true;
			this.invalidateItem(id);
		}
	}
};

ItemsStore.prototype.getItem = function(id) {
	var item = this.items["_" + id];
	if(!item) return undefined;
	return item.newData || item.data;
};

ItemsStore.prototype.isItemAvailable = function(id) {
	var item = this.items["_" + id];
	return !!(item && item.data);
};

ItemsStore.prototype.getItemInfo = function(id) {
	var item = this.items["_" + id];
	if(!item) return {
		available: false,
		outdated: false,
		updated: false,
		listening: false
	};
	return {
		available: !!item.data,
		outdated: !!item.outdated,
		updated: !!item.update,
		listening: !!item.handlers && item.handlers.length > 0
	};
};

ItemsStore.prototype.updateItem = function(id, update) {
	var item = this.items["_" + id];
	if(!item) {
		this.items["_" + id] = item = {
			update: update
		};
	} else {
		if(item.data) {
			item.newData = this.desc.applyUpdate(item.newData || item.data, update);
		}
		if(item.update) {
			item.update = this.desc.mergeUpdates(item.update, update);
		} else {
			item.update = update;
		}
	}
	this.invalidateItem(id);
	if(item.data && item.handlers) {
		var handlers = item.handlers.slice();
		handlers.forEach(function(fn) {
			fn(item.newData);
		});
	}

};

ItemsStore.prototype.invalidateItem = function(id) {
	if(this.invalidItems.indexOf(id) >= 0)
		return;
	this.invalidItems.push(id);
	if(!this.requesting) {
		this.requesting = true;
		this.desc.queueRequest(this._request.bind(this));
	}
};

ItemsStore.prototype._requestWriteAndReadMultipleItems = function(items, callback) {
	this.desc.writeAndReadMultipleItems(items, function(err, newDatas) {
		if(err) {
			// TODO handle error
		}
		if(newDatas) {
			Object.keys(newDatas).forEach(function(id) {
				this.setItemData(id.substr(1), newDatas[id]);
			}, this);
		}
		this._request(callback);
	}.bind(this));
};

ItemsStore.prototype._requestWriteMultipleItems = function(items, callback) {
	this.desc.writeMultipleItems(items, function(err) {
		if(err) {
			// TODO handle error
		}
		this._request(callback);
	}.bind(this));
};

ItemsStore.prototype._requestWriteAndReadSingleItem = function(item, callback) {
	this.desc.writeAndReadSingleItem(item, function(err, newData) {
		if(err) {
			// TODO handle error
		}
		if(newData) {
			this.setItemData(item.id, newData);
		}
		this._request(callback);
	}.bind(this));
};

ItemsStore.prototype._requestWriteSingleItem = function(item, callback) {
	this.desc.writeSingleItem(item, function(err) {
		if(err) {
			// TODO handle error
		}
		this._request(callback);
	}.bind(this));
};

ItemsStore.prototype._requestReadMultipleItems = function(items, callback) {
	this.desc.readMultipleItems(items, function(err, newDatas) {
		if(err) {
			// TODO handle error
		}
		if(newDatas) {
			Object.keys(newDatas).forEach(function(id) {
				this.setItemData(id.substr(1), newDatas[id]);
			}, this);
		}
		this._request(callback);
	}.bind(this));
};

ItemsStore.prototype._requestReadSingleItem = function(item, callback) {
	this.desc.readSingleItem(item, function(err, newData) {
		if(err) {
			// TODO handle error
		}
		if(newData) {
			this.setItemData(item.id, newData);
		}
		this._request(callback);
	}.bind(this));
};

ItemsStore.prototype._request = function(callback) {
	if(this.desc.writeAndReadMultipleItems) {
		var items = this.popWriteableItem(true, true);
		if(items.length === 1 && this.desc.writeAndReadSingleItem) {
			this._requestWriteAndReadSingleItem(items[0], callback);
			return;
		} else if(items.length > 0) {
			this._requestWriteAndReadMultipleItems(items, callback);
			return;
		}
	}
	if(this.desc.writeMultipleItems) {
		var items = this.popWriteableItem(true, false);
		if(items.length === 1 && this.desc.writeSingleItem) {
			this._requestWriteSingleItem(items[0], callback);
			return;
		} else if(items.length > 0) {
			this._requestWriteMultipleItems(items, callback);
			return;
		}
	}
	if(this.desc.writeAndReadSingleItem) {
		var item = this.popWriteableItem(false, true);
		if(item) {
			this._requestWriteAndReadSingleItem(item, callback);
			return;
		}
	}
	if(this.desc.writeSingleItem) {
		var item = this.popWriteableItem(false);
		if(item) {
			this._requestWriteSingleItem(item, callback);
			return;
		}
	}
	if(this.desc.readMultipleItems) {
		var items = this.popReadableItem(true);
		if(items.length === 1 && this.desc.readSingleItem) {
			this._requestReadSingleItem(items[0], callback);
			return;
		} else if(items.length > 0) {
			this._requestReadMultipleItems(items, callback);
			return;
		}
	}
	if(this.desc.readSingleItem) {
		var item = this.popReadableItem(false);
		if(item) {
			this._requestReadSingleItem(item, callback);
			return;
		}
	}
	this.requesting = false;
	if(callback) callback();
};

ItemsStore.prototype.setItemData = function(id, newData) {
	var item = this.items["_" + id];
	if(!item) {
		this.items["_" + id] = { data: newData };
		return;
	}
	if(item.newData) {
		item.update = this.desc.rebaseUpdate(item.update, item.data, newData);
		item.newData = this.desc.applyUpdate(newData, item.update);
	}
	item.data = newData;
	item.outdated = false;
	item.tick = this.updateTick;
	if(item.handlers) {
		var handlers = item.handlers.slice();
		handlers.forEach(function(fn) {
			fn(newData);
		});
	}
};

ItemsStore.prototype.popWriteableItem = function(multiple, willRead) {
	var results = [];
	for(var i = 0; i < this.invalidItems.length; i++) {
		var id = this.invalidItems[i];
		var item = this.items["_" + id];
		if(item.update) {
			var result = {
				id: id,
				update: item.update,
				oldData: item.data,
				newData: item.newData
			};
			item.outdated = true;
			item.data = item.newData;
			delete item.update;
			delete item.newData;
			if(willRead) {
				this.invalidItems.splice(i, 1);
				i--;
			}
			if(!multiple)
				return result;
			results.push(result);
			if(this.desc.maxWriteItems && results.length >= this.desc.maxWriteItems)
				break;
		}
	}
	if(multiple)
		return results;
};

ItemsStore.prototype.popReadableItem = function(multiple) {
	var results = [];
	for(var i = 0; i < this.invalidItems.length; i++) {
		var id = this.invalidItems[i];
		var item = this.items["_" + id];
		if(item.outdated) {
			var result = {
				id: id,
				oldData: item.data
			};
			this.invalidItems.splice(i, 1);
			i--;
			if(!multiple)
				return result;
			results.push(result);
			if(this.desc.maxReadItems && results.length >= this.desc.maxReadItems)
				break;
		}
	}
	if(multiple)
		return results;
};


function applyUpdate(data, update) {
	return Object.assign({}, data, update);
}

function mergeUpdates(a, b) {
	return Object.assign({}, a, b);
}

function rebaseUpdate(update, oldData, newData) {
	return update;
}

function ItemsStoreLease() {
	this.leases = undefined;
	this.getItem = function() {
		throw new Error("Cannot getItem while not capturing");
	};
}

ItemsStoreLease.prototype.capture = function(fn, onUpdate, ident) {
	var oldGetItem = this.getItem;
	var newLeases = [];
	this.getItem = function(Store, id) {
		var lease = Store.listenToItem(id, onUpdate, ident);
		var idx = newLeases.indexOf(lease);
		if(idx < 0) {
			if(this.leases) {
				idx = this.leases.indexOf(lease);
				if(idx >= 0)
					this.leases.splice(idx, 1);
			}
			newLeases.push(lease);
		}
		return Store.getItem(id);
	}.bind(this);
	var ret = fn(this.getItem);
	if(this.leases) {
		this.leases.forEach(function(lease) {
			lease.close();
		});
	}
	this.leases = newLeases;
	this.getItem = oldGetItem;
	return ret;
};

ItemsStoreLease.prototype.close = function() {
	if(this.leases) {
		this.leases.forEach(function(lease) {
			lease.close();
		});
	}
	this.leases = undefined;
};

function ItemsStoreFetcher(ident) {
	this.ident = ident;
}

ItemsStoreFetcher.prototype.fetch = function(fn, callback) {
	var ident = this.ident;
	var unavailableItems;
	function onItemAvailable() {
		if(--unavailableItems === 0)
			runFn();
	}
	function getItem(Store, id) {
		if(Store.isItemAvailable(id)) {
			return Store.getItem(id);
		} else {
			unavailableItems++;
			Store.waitForItem(id, onItemAvailable);
		}
	}
	function runFn() {
		unavailableItems = 1;
		fn(getItem);
		if(--unavailableItems === 0) {
			callback();
		}
	}
	runFn();
};