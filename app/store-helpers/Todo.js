export function fetchTodoItem(stores, item) {
	return {
		...stores.TodoItem.getItem(item),
		...stores.TodoItem.getItemInfo(item),
		id: item
	};
}

export function fetchTodoList(stores, list) {
	var data = {
		items: stores.TodoList.getItem(list),
		...stores.TodoList.getItemInfo(list),
		id: list
	};
	var newId = 0;
	if(data.items) {
		data.items = data.items.map((item) => {
			if(typeof item === "object") return {
				...item,
				sending: true,
				id: "new" + (newId++)
			};
			return fetchTodoItem(stores, item);
		});
	}
	return data;
}
