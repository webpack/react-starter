import React from "react";
import { Link } from "react-router";

export default class ListMenu extends React.Component {
	render() {
		return <div>
			<h2>Lists:</h2>
			<ul>
				<li><Link to="todolist" params={{list: "mylist"}}>mylist</Link></li>
				<li><Link to="todolist" params={{list: "otherlist"}}>otherlist</Link></li>
			</ul>
		</div>;
	}
}
