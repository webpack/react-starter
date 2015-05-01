import React from "react";

export default class TEMPLATE extends React.Component {
	render() {
		var { aaa, bbb, ccc } = this.props;
		return <div>
			This is a Component.
		</div>;
	}
}
TEMPLATE.propTypes = {
	aaa: React.PropTypes.object.isRequired,
	bbb: React.PropTypes.string.isRequired,
	ccc: React.PropTypes.bool
};
