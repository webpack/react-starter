import React from "react";

export default class ChatUserView extends React.Component {
	render() {
		var { name, messages } = this.props;
		return messages ?
			<span>
				{name} ({messages})
			</span> :
			<span>
				{name}
			</span>;
	}
}
ChatUserView.propTypes = {
	name: React.PropTypes.string.isRequired,
	messages: React.PropTypes.number
};
