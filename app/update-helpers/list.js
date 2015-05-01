export function mergeUpdates(a, b) {
	return a.concat(b);
}

export function applyUpdate(oldData, update) {
	return oldData.concat(update.map((u) => ({ sending: true, ...u })));
}
