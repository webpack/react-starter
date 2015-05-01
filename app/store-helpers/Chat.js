export function fetchChatUser(stores, name) {
	return {
		...stores.ChatUser.getItem(name),
		name: name
	};
}

export function fetchChatMessage(stores, data) {
	return {
		...data,
		user: data.user && fetchChatUser(stores, data.user)
	};
}

export function fetchChatMessages(stores, room) {
	var messages = stores.ChatRoom.getItem(room);
	if(!messages) return messages;
	return messages.map((msg) => fetchChatMessage(stores, msg));
}
