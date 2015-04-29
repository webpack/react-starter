import React from "react";

export default class ChatLineView extends React.Component {
	render() {
		var { user, message } = this.props;
		return <div>
			ChatLine from {JSON.stringify(user)}: {message}
		</div>;
	}
}
ChatLineView.propTypes = {
	user: React.PropTypes.object,
	message: React.PropTypes.string
};
