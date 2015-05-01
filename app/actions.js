import { Actions } from "items-store";

// All the actions of the application

export var Todo = Actions.create([
	"update", // (id, update): Update a todo item
	"add", // (list, item): Add an todo item to a todo list
	"fetch", // (): Fetch all todo data
	"fetchItem" // (id): Fetch todo item data
]);

export var Chat = Actions.create([
	"send", // (room, message): Send a chat message to a room
	"fetch" // (): Fetch all chat data
]);
