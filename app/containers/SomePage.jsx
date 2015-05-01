import React from "react";

export default class SomePage extends React.Component {
	static getProps() {
		return {};
	}
	render() {
		return <div>
			<h2>SomePage</h2>
			<p>This is just some page... (loaded on demand)</p>
		</div>;
	}
}
