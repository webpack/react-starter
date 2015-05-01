import React from "react";
import ChatUserView from "components/ChatUserView";

export default class ChatLineView extends React.Component {
	render() {
		var { user, message, sending } = this.props;
		return <div>
			<ChatUserView {...user} />: {message}
			{sending && <span> (sending...)</span>}
		</div>;
	}
}
ChatLineView.propTypes = {
	user: React.PropTypes.object.isRequired,
	message: React.PropTypes.string.isRequired,
	sending: React.PropTypes.bool
};
