import React from "react";

export default class ChatPage extends React.Component {
	static getProps(stores, params) {
		var { room } = params;
		return {
			// Fetch data here
		};
	}
	render() {
		return <div>
			This is the ChatPage.
		</div>;
	}
}
