import React from "react";
import styles from "./TEMPLATE.css";

export default class TEMPLATE extends React.Component {
	static getProps(stores, params) {
		return {
			// Fetch data here
		};
	}
	render() {
		return <div className={styles.this}>
			This is a Container.
		</div>;
	}
}
