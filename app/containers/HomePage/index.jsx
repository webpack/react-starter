import React from "react";

export default class HomePage extends React.Component {
	static getProps() {
		return {};
	}
	render() {
		return <div>
			<h2>Homepage</h2>
			<p>This is the homepage.</p>
			<p>Try to go to a todo list page.</p>
		</div>;
	}
}
