
// This file describe which stores exists and in which format updates are stored and merged

import { applyUpdate as reactApplyUpdate, mergeUpdates as reactMergeUpdates } from "update-helpers/react";
import { applyUpdate as listApplyUpdate, mergeUpdates as listMergeUpdates } from "update-helpers/list";

module.exports = {
	// the Router is a local store that handles information about data fetching
	// see ../config/app.jsx
	Router: {
		local: true,
		readSingleItem: function(item, callback) {
			callback(null, item.oldData || null);
		}
	},

	// stores TodoLists
	// changes are react style updates
	TodoList: {
		applyUpdate: reactApplyUpdate,
		mergeUpdates: reactMergeUpdates
	},

	// stores TodoItems
	// changes are in the default format
	TodoItem: {},

	// stores chats in a chat room
	// changes are lists of new messages
	// errors result in a error item
	ChatRoom: {
		applyUpdate: listApplyUpdate,
		mergeUpdates: listMergeUpdates,
		applyNewError: (oldData, error) => {
			var errorMessage = {
				user: "System",
				message: error.message
			};
			return (oldData || []).concat(errorMessage);
		}
	},

	// stores information about each chat user
	// currently this only stores the message count
	// uses defaults for everything (simple key-value data)
	ChatUser: {}
};
