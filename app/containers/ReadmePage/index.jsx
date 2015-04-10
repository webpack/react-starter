import React from "react";
import "./style.css";

export default class ReadmePage extends React.Component {
	static getProps() {
		return {};
	}
	render() {
		var readme = { __html: require("./../../../README.md") };
		return <div className="readme-page" dangerouslySetInnerHTML={readme}></div>;
	}
}
