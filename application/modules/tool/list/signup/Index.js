var CommonEvent = require('../../../../components/CommonEvent');
var Register = require('./register/Index');

Utils.setTitle('用户注册');

module.exports = React.createClass({
	render: function() {
		return <div className="signup_box">
					<Register />
					<CommonEvent />
				</div>;
	}
});