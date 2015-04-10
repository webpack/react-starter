import React from "react";
import { Link } from "react-router";

export default class MainMenu extends React.Component {
	render() {
		return <div>
			<h2>MainMenu:</h2>
			<ul>
				<li>The <Link to="home">home</Link> page.</li>
				<li>Do something on the <Link to="todo">todo page</Link>.</li>
				<li>Switch to <Link to="some-page">some page</Link>.</li>
				<li>Open the page that shows <Link to="readme">README.md</Link>.</li>
			</ul>
		</div>;
	}
}
