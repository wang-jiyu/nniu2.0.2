var CommonEvent = require('../../../../components/CommonEvent');
var Register = require('./register/Index');

module.exports = React.createClass({
	render: function() {
		return <div className="signup_box">
					<Register />
					<CommonEvent />
				</div>;
	}
});